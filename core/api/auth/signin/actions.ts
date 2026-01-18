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
import type { SigninRequest, EmailVerificationResponse } from './types'
import type { AuthResponse } from '../types'
import { setAuthCookies } from '@/lib/auth'

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
    const headersList = await headers()
    const clientId = getClientIdentifier(headersList)

    try {
        // Extract and validate form data
        const email = formData.get('email')?.toString()
        const password = formData.get('password')?.toString()

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
        const rateLimit = await checkRateLimit(clientId)

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

        const signinResponse = await signin(requestBody)

        // Set authentication cookies using official pattern
        // @see https://nextjs.org/docs/app/building-your-application/authentication
        if ('access_token' in signinResponse && 'refresh_token' in signinResponse) {
            await setAuthCookies(signinResponse as AuthResponse)
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

        return {
            success: true,
            data: signinResponse,
        }
    } catch (error) {
        // Record failed attempt for rate limiting
        await recordFailedAttempt(clientId)

        // Get updated rate limit status
        const rateLimit = await checkRateLimit(clientId)

        // Handle API errors
        const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to login. Please try again.'

        // Log failed signin attempt
        const duration = Date.now() - startTime
        console.error('[AUTH] Failed signin attempt', {
            clientId,
            error: errorMessage,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            remainingAttempts: rateLimit.remaining,
        })

        return {
            success: false,
            error: errorMessage,
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