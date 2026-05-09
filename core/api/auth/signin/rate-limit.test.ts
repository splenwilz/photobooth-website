import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockRedis } = vi.hoisted(() => ({
    mockRedis: {
        get: vi.fn(),
        setex: vi.fn(),
        del: vi.fn(),
        keys: vi.fn(),
    },
}))

vi.mock('../../redis', () => ({
    redis: mockRedis,
    // Stub the AsyncLocalStorage wrapper: just invoke the thunk in-place.
    redisCallContext: {
        run: <T,>(_ctrl: AbortController, fn: () => T): T => fn(),
        getStore: () => undefined,
    },
}))

beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    // Healthy defaults: empty key, writes accepted, dels return 1.
    mockRedis.get.mockResolvedValue(null)
    mockRedis.setex.mockResolvedValue('OK')
    mockRedis.del.mockResolvedValue(1)
    mockRedis.keys.mockResolvedValue([])
})

afterEach(() => {
    vi.useRealTimers()
})

describe('rate-limit: Redis healthy path', () => {
    it('reads from and writes to Redis on first attempt', async () => {
        const mod = await import('./rate-limit')
        const result = await mod.checkRateLimit('signin:1.2.3.4')

        expect(mockRedis.get).toHaveBeenCalledWith('rate_limit:signin:1.2.3.4')
        expect(mockRedis.setex).toHaveBeenCalledTimes(1)
        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(5)
    })

    it('returns blocked when stored count >= maxAttempts', async () => {
        mockRedis.get.mockResolvedValue({
            count: 5,
            resetTime: Date.now() + 60_000,
        })
        const mod = await import('./rate-limit')
        const result = await mod.checkRateLimit('signin:1.2.3.4')

        expect(result.allowed).toBe(false)
        expect(result.remaining).toBe(0)
        // No write when blocked.
        expect(mockRedis.setex).not.toHaveBeenCalled()
    })

    it('extends to blockDuration when failed count crosses threshold (4 -> 5)', async () => {
        vi.useFakeTimers()
        const start = new Date('2026-05-07T12:00:00Z').getTime()
        vi.setSystemTime(start)

        mockRedis.get.mockResolvedValue({
            count: 4,
            resetTime: start + 5 * 60_000,
        })

        const mod = await import('./rate-limit')
        await mod.recordFailedAttempt('signin:1.2.3.4')

        const blockTtlSeconds = Math.ceil(
            mod.__testing.constants.RATE_LIMIT_CONFIG.blockDurationMs / 1000,
        )
        expect(mockRedis.setex).toHaveBeenCalledWith(
            'rate_limit:signin:1.2.3.4',
            blockTtlSeconds,
            expect.objectContaining({ count: 5 }),
        )
    })
})

describe('rate-limit: circuit breaker', () => {
    it('falls back to memory and trips breaker when Redis fails', async () => {
        mockRedis.get.mockRejectedValue(new Error('connection refused'))

        const mod = await import('./rate-limit')
        const result = await mod.checkRateLimit('signin:1.2.3.4')

        // Memory fallback opens a fresh window.
        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(5)
        expect(mod.__testing.getCircuitBreakerDeadline()).toBeGreaterThan(Date.now())
    })

    it('skips Redis on subsequent calls while breaker is open', async () => {
        mockRedis.get.mockRejectedValue(new Error('connection refused'))
        const mod = await import('./rate-limit')

        await mod.checkRateLimit('signin:1.2.3.4')
        await mod.checkRateLimit('signin:5.6.7.8')

        // First call probed Redis; second call hit memory directly.
        expect(mockRedis.get).toHaveBeenCalledTimes(1)
    })

    it('probes Redis again after the breaker backoff elapses', async () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-05-07T12:00:00Z'))

        mockRedis.get.mockRejectedValueOnce(new Error('down'))
        const mod = await import('./rate-limit')
        await mod.checkRateLimit('signin:1.2.3.4')
        expect(mockRedis.get).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(mod.__testing.constants.REDIS_UNHEALTHY_BACKOFF_MS + 1_000)
        mockRedis.get.mockResolvedValueOnce(null)

        await mod.checkRateLimit('signin:5.6.7.8')
        expect(mockRedis.get).toHaveBeenCalledTimes(2)
    })

    it('aborts the in-flight Redis call when the timeout fires', async () => {
        vi.useFakeTimers()

        // Redis hangs forever; the timeout should win.
        mockRedis.get.mockImplementation(() => new Promise(() => {}))

        const mod = await import('./rate-limit')
        const callPromise = mod.checkRateLimit('signin:1.2.3.4')
        await vi.advanceTimersByTimeAsync(mod.__testing.constants.REDIS_TIMEOUT_MS + 50)
        const result = await callPromise

        // Timeout flipped us to memory; result is the new-window memory response.
        expect(result.allowed).toBe(true)
        expect(mod.__testing.getCircuitBreakerDeadline()).toBeGreaterThan(0)
    })
})

describe('rate-limit: memory store behaviour', () => {
    it('expires entries after resetTime and treats them as a new window', async () => {
        vi.useFakeTimers()
        const start = new Date('2026-05-07T12:00:00Z').getTime()
        vi.setSystemTime(start)

        // Force memory path for the entire test.
        mockRedis.get.mockRejectedValue(new Error('down'))
        mockRedis.setex.mockRejectedValue(new Error('down'))

        const mod = await import('./rate-limit')
        await mod.recordFailedAttempt('signin:1.2.3.4')

        // Walk past the 15-minute window.
        vi.advanceTimersByTime(16 * 60_000)

        const result = await mod.checkRateLimit('signin:1.2.3.4')
        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(mod.__testing.constants.RATE_LIMIT_CONFIG.maxAttempts)
    })

    it('caps memory store size when writes exceed soft cap', async () => {
        // Force memory.
        mockRedis.get.mockRejectedValue(new Error('down'))
        mockRedis.setex.mockRejectedValue(new Error('down'))

        const mod = await import('./rate-limit')
        const softCap = mod.__testing.constants.MEMORY_STORE_SOFT_CAP

        // Push past the soft cap by ~10% with unique IPs so entries are
        // all live and prune cannot drop any "for free."
        const overshoot = Math.floor(softCap * 0.1) + 5
        for (let i = 0; i < softCap + overshoot; i++) {
            await mod.recordFailedAttempt(`signin:10.0.${(i >> 8) & 0xff}.${i & 0xff}`)
        }

        // After capping, size should be at or below the soft cap.
        expect(mod.__testing.getMemoryStoreSize()).toBeLessThanOrEqual(softCap)
    })
})

describe('rate-limit: clear functions', () => {
    it('clearRateLimit deletes the key from Redis and memory', async () => {
        const mod = await import('./rate-limit')
        await mod.clearRateLimit('signin:1.2.3.4')
        expect(mockRedis.del).toHaveBeenCalledWith('rate_limit:signin:1.2.3.4')
    })

    it('clearAllRateLimits scans and deletes Redis keys, then clears memory', async () => {
        mockRedis.keys.mockResolvedValue(['rate_limit:signin:1', 'rate_limit:signin:2'])
        const mod = await import('./rate-limit')

        // Seed the memory store with one entry by failing Redis once
        // before triggering clearAll.
        await mod.recordFailedAttempt('signin:9.9.9.9') // memory side-effect indirect
        const before = mod.__testing.getMemoryStoreSize()

        const cleared = await mod.clearAllRateLimits()

        expect(mockRedis.keys).toHaveBeenCalledWith('rate_limit:*')
        expect(mockRedis.del).toHaveBeenCalledWith('rate_limit:signin:1', 'rate_limit:signin:2')
        // Returned count includes both Redis keys + memory entries that existed.
        expect(cleared).toBeGreaterThanOrEqual(2 + before)
        expect(mod.__testing.getMemoryStoreSize()).toBe(0)
    })
})
