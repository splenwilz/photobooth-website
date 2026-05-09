'use server'

import { headers } from 'next/headers'
import { signin } from './services'  // Use existing service - it now uses secure env vars on server
import {
    checkRateLimit,
    recordFailedAttempt,
    getClientIdentifier,
    clearRateLimit,
    clearAllRateLimits
} from './rate-limit'
import { ApiError } from '../../client'
import type { SigninRequest, EmailVerificationResponse } from './types'
import type { AuthResponse } from '../types'
import { setAuthCookies } from '@/lib/auth'
import { signinPerfLog } from '@/lib/signin-perf'

/**
 * Map a thrown error to a stable, non-sensitive log key. The user-facing
 * `errorMessage` is still rendered in the UI alert, but logs and perf
 * traces should never contain raw backend strings (which can vary, leak
 * internals, or echo input). Add new branches as new error shapes appear.
 */
function classifySigninError(err: unknown): string {
    if (err instanceof ApiError) {
        if (err.status === 0) return 'network_error'
        if (err.status === 401 || err.status === 403) return 'invalid_credentials'
        if (err.status === 422) return 'validation_error'
        if (err.status === 429) return 'rate_limited_upstream'
        if (err.status >= 500) return 'server_error'
        return `http_${err.status}`
    }
    if (err instanceof Error) return 'unknown_error'
    return 'non_error_thrown'
}

/**
 * Server action result type for signin
 * Returns either success with data or error with message
 */
export type SigninActionResult =
    | { success: true; data: AuthResponse | EmailVerificationResponse }
    | { success: false; error: string; rateLimited?: boolean; remainingAttempts?: number }

/**
 * Server action for user signin with enhanced security
 * 
 * Security features:
 * - Rate limiting to prevent brute force attacks
 * - Server-side validation (can't be bypassed)
 * - Request logging for monitoring
 * 
 * @param prevState - Previous action state (for useActionState)
 * @param formData - Form data containing email and password
 * @returns Promise resolving to signin result with success/error state
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */
export async function signinAction(
    prevState: SigninActionResult | null,
    formData: FormData
): Promise<SigninActionResult> {
    const startTime = Date.now()
    // Diagnostic per-request id so concurrent signins are distinguishable in logs.
    const reqId = Math.random().toString(36).slice(2, 8)
    const perf = (phase: string, extra: Record<string, unknown> = {}) => {
        signinPerfLog({ reqId, phase, elapsed_ms: Date.now() - startTime, ...extra })
    }
    perf('action_start')

    const headersList = await headers()
    perf('headers_resolved')
    const clientId = getClientIdentifier(headersList)

    try {
        // Extract and validate form data
        const email = formData.get('email')?.toString()
        const password = formData.get('password')?.toString()
        const remember = formData.get('remember') === 'on'

        if (!email || !password) {
            return {
                success: false,
                error: 'Email and password are required',
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return {
                success: false,
                error: 'Invalid email address',
            }
        }

        if (password.length < 8) {
            return {
                success: false,
                error: 'Password must be at least 8 characters',
            }
        }

        if (password.length > 50) {
            return {
                success: false,
                error: 'Password must be less than 50 characters',
            }
        }


        // Rate limiting check
        const rlStart = Date.now()
        const rateLimit = await checkRateLimit(clientId)
        perf('rate_limit_checked', { rate_limit_ms: Date.now() - rlStart })

        // If rate limit is exceeded, return error
        if (!rateLimit.allowed) {
            const minutesUntilReset = Math.ceil(
                (rateLimit.resetTime - Date.now()) / (60 * 1000)
            )

            // Log security event
            console.warn('[SECURITY] Rate limit exceeded', {
                clientId,
                timestamp: new Date().toISOString(),
                resetTime: new Date(rateLimit.resetTime).toISOString(),
            })

            return {
                success: false,
                error: `Too many login attempts. Please try again in ${minutesUntilReset} minute(s).`,
                rateLimited: true,
                remainingAttempts: 0,
            }
        }

        // Call the signin service (uses apiClient which now uses API_BASE_URL on server)
        const requestBody: SigninRequest = {
            email,
            password,
        }

        const beStart = Date.now()
        perf('backend_call_start')
        const signinResponse = await signin(requestBody, reqId)
        perf('backend_call_end', { backend_ms: Date.now() - beStart })

        // Set authentication cookies using official pattern
        // @see https://nextjs.org/docs/app/building-your-application/authentication
        if ('access_token' in signinResponse && 'refresh_token' in signinResponse) {
            const ckStart = Date.now()
            await setAuthCookies(signinResponse, { remember })
            perf('cookies_set', { cookies_ms: Date.now() - ckStart })
        } else {
            perf('cookies_skipped_verification_required')
        }

        // Log successful signin (without sensitive data)
        const duration = Date.now() - startTime
        console.log('[AUTH] Successful signin', {
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            requiresVerification: 'requires_verification' in signinResponse
                ? (signinResponse as EmailVerificationResponse).requires_verification
                : false,
        })

        perf('action_returning_success')
        return {
            success: true,
            data: signinResponse,
        }
    } catch (error) {
        // Record failed attempt for rate limiting
        await recordFailedAttempt(clientId)

        // Get updated rate limit status
        const rateLimit = await checkRateLimit(clientId)

        // Handle API errors. errorMessage is what the user sees in the UI
        // alert; errorKind is a stable classification that's safe to log.
        // Never put raw error.message into logs or perf payloads — backend
        // strings can leak internals or echo input.
        const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to login. Please try again.'
        const errorKind = classifySigninError(error)

        // Log failed signin attempt
        const duration = Date.now() - startTime
        console.error('[AUTH] Failed signin attempt', {
            clientId,
            error_kind: errorKind,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            remainingAttempts: rateLimit.remaining,
        })

        perf('action_returning_error', { error_kind: errorKind })
        return {
            success: false,
            error: errorMessage,
            rateLimited: rateLimit.remaining <= 0,
            remainingAttempts: rateLimit.remaining,
        }
    }
}

/**
 * Dev-only: Clear rate limit for a specific identifier
 * Only works in development mode
 */
export async function devClearRateLimit(identifier: string) {
    if (process.env.NODE_ENV !== 'development') {
        return { success: false, message: 'Dev-only function' }
    }
    await clearRateLimit(identifier)
    return { success: true, message: `Cleared: ${identifier}` }
}

/**
 * Dev-only: Clear all rate limits
 * Only works in development mode
 */
export async function devClearAllRateLimits() {
    if (process.env.NODE_ENV !== 'development') {
        return { success: false, message: 'Dev-only function' }
    }
    const count = await clearAllRateLimits()
    return { success: true, message: `Cleared ${count} rate limits` }
}