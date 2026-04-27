import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { oauthCallback } from '@/core/api/auth/oauth/services'
import { setAuthCookies } from '@/lib/auth'
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

        // Map server error to a stable code. /signin maps codes to fixed
        // copy via mapSigninError() — we never round-trip arbitrary error
        // text through the URL so a crafted ?error=… can't phish via copy
        // on our own domain.
        const errResponse = NextResponse.redirect(
            new URL('/signin?error=oauth_failed', req.url)
        )
        errResponse.cookies.delete('auth_redirect')
        return errResponse
    }
}

