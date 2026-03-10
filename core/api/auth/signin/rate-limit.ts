/**
 * Redis-based rate limiting for signin attempts
 * Uses Upstash Redis for persistent, distributed rate limiting
 *
 * Gracefully degrades when Redis is unavailable — signin is allowed
 * through without rate limiting, with warnings logged.
 *
 * @see https://upstash.com/docs/redis/overall/getstarted
 */

import { redis } from '../../redis'

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

/**
 * Rate limit configuration
 * Adjust these values based on your security requirements
 */
const RATE_LIMIT_CONFIG = {
    // Maximum attempts per window
    maxAttempts: 5,
    // Time window in milliseconds (15 minutes)
    windowMs: 15 * 60 * 1000,
    // Block duration after max attempts exceeded (30 minutes)
    blockDurationMs: 30 * 60 * 1000,
} as const;

/** Default permissive response when Redis is unavailable */
const ALLOW_THROUGH = {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxAttempts,
    resetTime: 0,
} as const;

/**
 * Get client identifier for rate limiting
 * Uses IP address from request headers
 *
 * @param headers - Request headers (from Next.js headers())
 * @returns Client identifier string
 */
export function getClientIdentifier(headers: Headers): string {
    // Try to get real IP from various headers (for proxies/load balancers)
    const forwardedFor = headers.get('x-forwarded-for');
    const realIp = headers.get('x-real-ip');
    const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare

    // Use first IP from forwarded-for (if multiple)
    const ip = forwardedFor?.split(',')[0]?.trim()
        || realIp
        || cfConnectingIp
        || 'unknown';

    return `signin:${ip}`;
}

/**
 * Get rate limit key for Redis
 */
function getRateLimitKey(identifier: string): string {
    return `rate_limit:${identifier}`;
}

/**
 * Check if client has exceeded rate limit
 *
 * @param identifier - Client identifier (IP-based)
 * @returns Object with allowed status and remaining attempts
 */
export async function checkRateLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
}> {
    if (!redis) {
        return ALLOW_THROUGH;
    }

    try {
        const now = Date.now();
        const key = getRateLimitKey(identifier);

        // Get current entry from Redis
        const entry = await redis.get<RateLimitEntry>(key);

        // Clean up expired entries
        if (entry && now > entry.resetTime) {
            await redis.del(key);
        }

        // Check if client is blocked
        if (entry && now < entry.resetTime && entry.count >= RATE_LIMIT_CONFIG.maxAttempts) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: entry.resetTime,
            };
        }

        // Get or create entry
        const currentEntry = entry && now <= entry.resetTime ? entry : null;

        if (!currentEntry) {
            // New window
            const resetTime = now + RATE_LIMIT_CONFIG.windowMs;
            const newEntry: RateLimitEntry = {
                count: 0,
                resetTime,
            };

            // Store in Redis with TTL (expires automatically)
            const ttlSeconds = Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000);
            await redis.setex(key, ttlSeconds, newEntry);

            return {
                allowed: true,
                remaining: RATE_LIMIT_CONFIG.maxAttempts,
                resetTime,
            };
        }

        // Existing window
        const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxAttempts - currentEntry.count);

        return {
            allowed: remaining > 0,
            remaining,
            resetTime: currentEntry.resetTime,
        };
    } catch (error) {
        console.warn('[RATE_LIMIT] Redis unavailable for checkRateLimit, allowing request through:', error instanceof Error ? error.message : String(error));
        return ALLOW_THROUGH;
    }
}

/**
 * Record a failed signin attempt
 *
 * @param identifier - Client identifier (IP-based)
 */
export async function recordFailedAttempt(identifier: string): Promise<void> {
    if (!redis) {
        return;
    }

    try {
        const now = Date.now();
        const key = getRateLimitKey(identifier);

        // Get current entry
        const entry = await redis.get<RateLimitEntry>(key);

        if (!entry || now > entry.resetTime) {
            // New window
            const resetTime = now + RATE_LIMIT_CONFIG.windowMs;
            const newEntry: RateLimitEntry = {
                count: 1,
                resetTime,
            };

            const ttlSeconds = Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000);
            await redis.setex(key, ttlSeconds, newEntry);
        } else {
            // Increment count
            const updatedEntry: RateLimitEntry = {
                count: entry.count + 1,
                resetTime: entry.resetTime,
            };

            // If max attempts exceeded, extend block duration
            if (updatedEntry.count >= RATE_LIMIT_CONFIG.maxAttempts) {
                updatedEntry.resetTime = now + RATE_LIMIT_CONFIG.blockDurationMs;
                const blockTtlSeconds = Math.ceil(RATE_LIMIT_CONFIG.blockDurationMs / 1000);
                await redis.setex(key, blockTtlSeconds, updatedEntry);
            } else {
                // Update existing entry
                const remainingTtl = Math.ceil((entry.resetTime - now) / 1000);
                await redis.setex(key, remainingTtl, updatedEntry);
            }
        }
    } catch (error) {
        console.warn('[RATE_LIMIT] Redis unavailable for recordFailedAttempt:', error instanceof Error ? error.message : String(error));
    }
}

/**
 * Clear rate limit for a client (useful for testing or manual unblock)
 *
 * @param identifier - Client identifier (IP-based)
 */
export async function clearRateLimit(identifier: string): Promise<void> {
    if (!redis) {
        return;
    }

    try {
        const key = getRateLimitKey(identifier);
        await redis.del(key);
    } catch (error) {
        console.warn('[RATE_LIMIT] Redis unavailable for clearRateLimit:', error instanceof Error ? error.message : String(error));
    }
}

/**
 * Clear all rate limits (dev-only, useful for testing)
 *
 * Note: This deletes all keys matching the rate limit pattern
 * For production, consider restricting this or using a more specific pattern
 *
 * @returns Number of entries cleared
 */
export async function clearAllRateLimits(): Promise<number> {
    if (!redis) {
        return 0;
    }

    try {
        // Get all rate limit keys
        const keys = await redis.keys('rate_limit:*');

        if (keys.length === 0) {
            return 0;
        }

        // Delete all keys
        await redis.del(...keys);

        return keys.length;
    } catch (error) {
        console.warn('[RATE_LIMIT] Redis unavailable for clearAllRateLimits:', error instanceof Error ? error.message : String(error));
        return 0;
    }
}
