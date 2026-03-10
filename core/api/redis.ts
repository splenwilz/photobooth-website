/**
 * Upstash Redis client for rate limiting
 * Uses REST API (serverless-friendly, works everywhere)
 *
 * Returns null if credentials are missing (graceful degradation).
 * Rate limiting will be disabled but signin will still work.
 *
 * @see https://upstash.com/docs/redis/overall/getstarted
 */

import { Redis } from '@upstash/redis'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

export const redis: Redis | null = (redisUrl && redisToken)
    ? new Redis({ url: redisUrl, token: redisToken })
    : null

if (!redis) {
    console.warn('[REDIS] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. Rate limiting is disabled.')
}
