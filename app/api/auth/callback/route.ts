import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { oauthCallback } from '@/core/api/auth/oauth/services'
import { setAuthCookies } from '@/lib/auth'
import { ApiError } from '@/core/api/client'
import { safeRedirectPath } from '@/lib/auth-redirect'

/**
 * OAuth callback route handler
 * Handles OAuth callback from provider and sets authentication cookies
 *
 * This must be a Route Handler (not a Server Component) to modify cookies
 * @see https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
        // The auth_redirect cookie is single-use intent; if we're not going
        // to consume it (no auth happened), clear it so a later OAuth attempt
        // does not pick up a stale value.
        const errResponse = NextResponse.redirect(
            new URL('/signin?error=missing_code', req.url)
        )
        errResponse.cookies.delete('auth_redirect')
        return errResponse
    }

    try {
        // Call OAuth callback service
        const authResponse = await oauthCallback({
            code,
            state: state || undefined,
        })

        // Set authentication cookies
        await setAuthCookies(authResponse)

        // Check for redirect cookie (set by the initiate routes). The initiate
        // routes already validate same-origin before setting it, but we
        // re-validate here as defense-in-depth in case the cookie is ever set
        // by another path or tampered with.
        const cookieStore = await cookies()
        const rawRedirect = cookieStore.get('auth_redirect')?.value
        const redirectUrl = safeRedirectPath(rawRedirect)
        const response = NextResponse.redirect(new URL(redirectUrl, req.url))

        if (rawRedirect) {
            response.cookies.delete('auth_redirect')
        }

        return response
    } catch (error) {
        console.error('[AUTH] OAuth callback failed:', error)

        // Extract error message
        let errorMessage = 'Failed to complete OAuth authentication. Please try again.'

        if (error instanceof Error) {
            errorMessage = error.message

            // Use instanceof for type-safe ApiError detection
            if (error instanceof ApiError) {
                // Provide more specific error messages based on status
                if (error.status === 400) {
                    errorMessage = 'Invalid authorization code. Please try signing in again.'
                } else if (error.status === 401) {
                    errorMessage = 'Authentication failed. Please try signing in again.'
                } else if (error.status >= 500) {
                    errorMessage = 'Server error occurred. Please try again later.'
                } else {
                    errorMessage = error.message || errorMessage
                }
            }
        }

        // Redirect to signin with error message; clear the single-use
        // auth_redirect cookie so the next OAuth attempt starts clean.
        const errorParam = encodeURIComponent(errorMessage)
        const errResponse = NextResponse.redirect(
            new URL(`/signin?error=${errorParam}`, req.url)
        )
        errResponse.cookies.delete('auth_redirect')
        return errResponse
    }
}

