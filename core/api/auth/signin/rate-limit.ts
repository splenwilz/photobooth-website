/**
 * Rate limiting for signin attempts.
 *
 * Primary store: Upstash Redis (distributed across instances).
 * Fallback: in-memory Map (per process) for when Upstash is unreachable
 * or unconfigured. Free-tier Upstash projects sometimes disappear; the
 * fallback keeps brute-force protection on instead of falling open.
 *
 * @see https://upstash.com/docs/redis/overall/getstarted
 */

import { redis, redisCallContext } from '../../redis'

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const RATE_LIMIT_CONFIG = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
} as const;

/**
 * Hard timeout for any Redis call. The Upstash REST client has no built-in
 * timeout, so a stalled connection blocks signin for ~4s before erroring.
 * On timeout we abort the underlying fetch (via AbortController plumbed
 * through redisCallContext) and the surrounding code falls through to
 * the in-memory store.
 */
const REDIS_TIMEOUT_MS = 500;

/**
 * Run a Redis command with a hard timeout and abort the in-flight fetch
 * if the timer wins. The argument is a thunk so the redis call is invoked
 * inside the AsyncLocalStorage scope that carries the AbortController.
 */
function withRedisTimeout<T>(makeCall: () => Promise<T>, label: string): Promise<T> {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    return redisCallContext.run(controller, () => {
        const callPromise = makeCall();
        const timeoutPromise = new Promise<T>((_, reject) => {
            timer = setTimeout(() => {
                controller.abort(`Redis ${label} timed out`);
                reject(new Error(`Redis ${label} timed out after ${REDIS_TIMEOUT_MS}ms`));
            }, REDIS_TIMEOUT_MS);
        });
        return Promise.race([callPromise, timeoutPromise]).finally(() => {
            if (timer) clearTimeout(timer);
        });
    });
}

// --- In-memory fallback store ---------------------------------------------

/**
 * Per-process rate-limit state. Used when Redis is unconfigured or
 * unreachable. State is lost on server restart (acceptable: attackers
 * gain at most a fresh window per restart) and is not shared across
 * instances (acceptable: degraded mode, still better than no limit).
 */
const memoryStore = new Map<string, RateLimitEntry>();

/**
 * Soft cap: when exceeded, prune expired entries first. If still over,
 * evict entries closest to expiry until back to the soft cap. Hard cap
 * exists as a belt to the suspenders: we never let the Map grow beyond
 * it, period, even if eviction logic ever regresses.
 */
const MEMORY_STORE_SOFT_CAP = 500;
const MEMORY_STORE_HARD_CAP = 10_000;

function memoryGet(key: string): RateLimitEntry | null {
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.resetTime) {
        memoryStore.delete(key);
        return null;
    }
    return entry;
}

function memorySet(key: string, entry: RateLimitEntry): void {
    memoryStore.set(key, entry);
    if (memoryStore.size > MEMORY_STORE_SOFT_CAP) {
        capMemoryStore();
    }
}

function memoryDel(key: string): void {
    memoryStore.delete(key);
}

/**
 * Bring the memory store size back under the soft cap. Called only when
 * the soft cap is breached. Two-phase:
 *   1. Drop expired entries (free).
 *   2. If still over, evict entries with the smallest resetTime (closest
 *      to natural expiry) until back to the soft cap. This keeps the
 *      attempts-most-likely-still-active in the Map and lets the
 *      shortest-lived ones go first.
 *
 * Without this, a sustained attack rotating IPs could grow memoryStore
 * unbounded while no entries expire (window is 15m / block is 30m).
 */
function capMemoryStore(): void {
    const now = Date.now();
    let expiredRemoved = 0;
    for (const [k, v] of memoryStore) {
        if (now > v.resetTime) {
            memoryStore.delete(k);
            expiredRemoved++;
        }
    }

    if (memoryStore.size <= MEMORY_STORE_SOFT_CAP) return;

    // Still over soft cap: evict by resetTime ascending.
    const overage = memoryStore.size - MEMORY_STORE_SOFT_CAP;
    const sorted = [...memoryStore.entries()]
        .sort((a, b) => a[1].resetTime - b[1].resetTime)
        .slice(0, overage);
    for (const [k] of sorted) memoryStore.delete(k);

    // Belt-and-suspenders: enforce the hard cap unconditionally. Should
    // be unreachable given the eviction above.
    while (memoryStore.size > MEMORY_STORE_HARD_CAP) {
        const firstKey = memoryStore.keys().next().value;
        if (firstKey === undefined) break;
        memoryStore.delete(firstKey);
    }

    if (process.env.NODE_ENV !== 'production') {
        console.warn('[RATE_LIMIT] Memory store capped', {
            sizeAfter: memoryStore.size,
            expiredRemoved,
            evicted: sorted.length,
        });
    }
}

// --- Redis circuit breaker ------------------------------------------------

/**
 * After a Redis failure, mark Redis unhealthy for this many ms. While
 * unhealthy, Redis ops are skipped entirely (we go straight to memory)
 * so subsequent signins don't keep paying the 500ms timeout.
 */
const REDIS_UNHEALTHY_BACKOFF_MS = 30_000;
let redisUnhealthyUntil = 0;

function isRedisAvailable(): boolean {
    return !!redis && Date.now() >= redisUnhealthyUntil;
}

function markRedisUnhealthy(label: string, error: unknown): void {
    // Only warn on the healthy→unhealthy transition. Subsequent failures
    // inside the same backoff window are silent to avoid log spam.
    const wasHealthy = Date.now() >= redisUnhealthyUntil;
    redisUnhealthyUntil = Date.now() + REDIS_UNHEALTHY_BACKOFF_MS;
    if (wasHealthy) {
        console.warn(
            `[RATE_LIMIT] Redis ${label} failed; using in-memory fallback for ${REDIS_UNHEALTHY_BACKOFF_MS / 1000}s:`,
            error instanceof Error ? error.message : String(error),
        );
    }
}

// --- Storage helpers ------------------------------------------------------

type Store = 'redis' | 'memory';

async function readEntry(key: string): Promise<{ entry: RateLimitEntry | null; store: Store }> {
    const r = redis;
    if (isRedisAvailable() && r) {
        try {
            const entry = await withRedisTimeout(() => r.get<RateLimitEntry>(key), 'get');
            return { entry, store: 'redis' };
        } catch (error) {
            markRedisUnhealthy('get', error);
        }
    }
    return { entry: memoryGet(key), store: 'memory' };
}

async function writeEntry(
    key: string,
    entry: RateLimitEntry,
    ttlSeconds: number,
    store: Store,
): Promise<void> {
    const r = redis;
    if (store === 'redis' && r) {
        try {
            await withRedisTimeout(() => r.setex(key, ttlSeconds, entry), 'setex');
            return;
        } catch (error) {
            markRedisUnhealthy('setex', error);
        }
    }
    // If we get here with `store === 'redis'`, Redis just died between
    // the read and the write. We fall through to memory: the failed
    // attempt is recorded somewhere, even if state is now split-brain
    // until the breaker resets and Redis catches back up. Best-effort
    // rate limiting, not strict consistency.
    memorySet(key, entry);
}

async function deleteEntry(key: string, store: Store): Promise<void> {
    const r = redis;
    if (store === 'redis' && r) {
        try {
            await withRedisTimeout(() => r.del(key), 'del');
            return;
        } catch (error) {
            markRedisUnhealthy('del', error);
        }
    }
    memoryDel(key);
}

// --- Public API -----------------------------------------------------------

export function getClientIdentifier(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for');
    const realIp = headers.get('x-real-ip');
    const cfConnectingIp = headers.get('cf-connecting-ip');

    const ip = forwardedFor?.split(',')[0]?.trim()
        || realIp
        || cfConnectingIp
        || 'unknown';

    return `signin:${ip}`;
}

function getRateLimitKey(identifier: string): string {
    return `rate_limit:${identifier}`;
}

export async function checkRateLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
}> {
    const now = Date.now();
    const key = getRateLimitKey(identifier);

    const { entry, store } = await readEntry(key);

    // Drop expired entries.
    if (entry && now > entry.resetTime) {
        await deleteEntry(key, store);
    }

    // Blocked window.
    if (entry && now < entry.resetTime && entry.count >= RATE_LIMIT_CONFIG.maxAttempts) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
        };
    }

    const currentEntry = entry && now <= entry.resetTime ? entry : null;

    if (!currentEntry) {
        // Open a new window.
        const resetTime = now + RATE_LIMIT_CONFIG.windowMs;
        const newEntry: RateLimitEntry = { count: 0, resetTime };
        const ttlSeconds = Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000);
        await writeEntry(key, newEntry, ttlSeconds, store);
        return {
            allowed: true,
            remaining: RATE_LIMIT_CONFIG.maxAttempts,
            resetTime,
        };
    }

    const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxAttempts - currentEntry.count);
    return {
        allowed: remaining > 0,
        remaining,
        resetTime: currentEntry.resetTime,
    };
}

export async function recordFailedAttempt(identifier: string): Promise<void> {
    const now = Date.now();
    const key = getRateLimitKey(identifier);

    // Read and write may land on different stores if Redis dies between
    // them (e.g. read hit Redis, then connection drops, write falls back
    // to memory). The failed attempt is still recorded somewhere; the
    // counts will reconcile when the circuit-breaker resets and a
    // future read hits Redis again. Acceptable for best-effort rate
    // limiting; do not rely on cross-store consistency here.
    const { entry, store } = await readEntry(key);

    if (!entry || now > entry.resetTime) {
        // New window.
        const resetTime = now + RATE_LIMIT_CONFIG.windowMs;
        const newEntry: RateLimitEntry = { count: 1, resetTime };
        const ttlSeconds = Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000);
        await writeEntry(key, newEntry, ttlSeconds, store);
        return;
    }

    const updatedEntry: RateLimitEntry = {
        count: entry.count + 1,
        resetTime: entry.resetTime,
    };

    if (updatedEntry.count >= RATE_LIMIT_CONFIG.maxAttempts) {
        // Threshold hit: extend to the longer block window.
        updatedEntry.resetTime = now + RATE_LIMIT_CONFIG.blockDurationMs;
        const blockTtlSeconds = Math.ceil(RATE_LIMIT_CONFIG.blockDurationMs / 1000);
        await writeEntry(key, updatedEntry, blockTtlSeconds, store);
    } else {
        const remainingTtl = Math.ceil((entry.resetTime - now) / 1000);
        await writeEntry(key, updatedEntry, remainingTtl, store);
    }
}

export async function clearRateLimit(identifier: string): Promise<void> {
    const key = getRateLimitKey(identifier);
    const r = redis;
    // Clear both stores so dev resets work regardless of Redis health.
    if (isRedisAvailable() && r) {
        try {
            await withRedisTimeout(() => r.del(key), 'del');
        } catch (error) {
            markRedisUnhealthy('del', error);
        }
    }
    memoryDel(key);
}

export async function clearAllRateLimits(): Promise<number> {
    let cleared = 0;
    const r = redis;

    if (isRedisAvailable() && r) {
        try {
            const keys = await withRedisTimeout(() => r.keys('rate_limit:*'), 'keys');
            if (keys.length > 0) {
                await withRedisTimeout(() => r.del(...keys), 'del');
                cleared += keys.length;
            }
        } catch (error) {
            markRedisUnhealthy('keys', error);
        }
    }

    cleared += memoryStore.size;
    memoryStore.clear();
    return cleared;
}

// --- Test-only exports ----------------------------------------------------

/**
 * Internal accessors for unit tests. Never used in production code.
 * Keeping them exported (rather than reflecting via private state) keeps
 * the test simple and avoids tying the test to the file layout.
 */
export const __testing = {
    getMemoryStoreSize: () => memoryStore.size,
    resetMemoryStore: () => memoryStore.clear(),
    resetCircuitBreaker: () => {
        redisUnhealthyUntil = 0;
    },
    getCircuitBreakerDeadline: () => redisUnhealthyUntil,
    constants: {
        REDIS_TIMEOUT_MS,
        REDIS_UNHEALTHY_BACKOFF_MS,
        MEMORY_STORE_SOFT_CAP,
        MEMORY_STORE_HARD_CAP,
        RATE_LIMIT_CONFIG,
    },
};
