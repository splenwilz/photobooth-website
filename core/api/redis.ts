/**
 * Upstash Redis client for rate limiting
 * Uses REST API (serverless-friendly, works everywhere)
 *
 * Returns null if credentials are missing (graceful degradation).
 * Rate limiting will be disabled but signin will still work.
 *
 * @see https://upstash.com/docs/redis/overall/getstarted
 */

import { AsyncLocalStorage } from 'node:async_hooks'
import { Redis } from '@upstash/redis'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

/**
 * Per-call AbortController slot. Callers that want to cancel an in-flight
 * Upstash fetch (e.g. on a hard timeout) wrap their command in
 * `redisCallContext.run(controller, () => redis.get(...))`. The factory
 * passed to the Redis client below reads from this store on every fetch
 * so the right controller is associated with the right call, even under
 * concurrency.
 */
export const redisCallContext = new AsyncLocalStorage<AbortController>()

export const redis: Redis | null = (redisUrl && redisToken)
    ? new Redis({
        url: redisUrl,
        token: redisToken,
        // Called by the Upstash client per fetch. Returns the active
        // call's controller signal, or a fresh (never-aborted) one when
        // no call context is set so the request still completes.
        signal: () => redisCallContext.getStore()?.signal ?? new AbortController().signal,
    })
    : null

if (!redis) {
    console.warn('[REDIS] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. Rate limiting is disabled.')
}
