import { NextRequest, NextResponse } from 'next/server'
import { oauthCallback } from '@/core/api/auth/oauth/services'
import { setAuthCookies } from '@/lib/auth'
import { ApiError } from '@/core/api/client'

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
        return NextResponse.redirect(
            new URL('/signin?error=missing_code', req.url)
        )
    }

    try {
        // Call OAuth callback service
        const authResponse = await oauthCallback({
            code,
            state: state || undefined,
        })

        // Set authentication cookies
        await setAuthCookies(authResponse)

        // Redirect to dashboard on success
        return NextResponse.redirect(new URL('/dashboard', req.url))
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

        // Redirect to signin with error message
        const errorParam = encodeURIComponent(errorMessage)
        return NextResponse.redirect(
            new URL(`/signin?error=${errorParam}`, req.url)
        )
    }
}

