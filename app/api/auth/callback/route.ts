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

    // Read (and re-validate) the auth_redirect cookie now so we can
    // forward it on any error path. Previously we just deleted it on
    // error, which meant the user lost their original destination after
    // a cancellation/failure even though they still wanted to land
    // there after retry.
    const cookieStore = await cookies()
    const rawRedirect = cookieStore.get('auth_redirect')?.value
    const validatedRedirect = safeRedirectPath(rawRedirect)
    const isResumable = !!rawRedirect && validatedRedirect === rawRedirect

    function signinError(code: string): NextResponse {
        const url = new URL(`/signin?error=${code}`, req.url)
        if (isResumable) {
            url.searchParams.set('redirect', validatedRedirect)
        }
        const res = NextResponse.redirect(url)
        // Cookie is single-use; the redirect is now in the URL where
        // SigninForm/OAuthButtons will pick it up if the user retries.
        res.cookies.delete('auth_redirect')
        return res
    }

    if (!code) return signinError('missing_code')

    try {
        // Call OAuth callback service
        const authResponse = await oauthCallback({
            code,
            state: state || undefined,
        })

        // Set authentication cookies
        await setAuthCookies(authResponse)

        // Use the redirect we already validated above (defense-in-depth
        // against the cookie being set/tampered through another path).
        const response = NextResponse.redirect(new URL(validatedRedirect, req.url))
        if (rawRedirect) {
            response.cookies.delete('auth_redirect')
        }
        return response
    } catch (error) {
        console.error('[AUTH] OAuth callback failed:', error)
        // Map server error to a stable code. /signin maps codes to fixed
        // copy via mapSigninError() — we never round-trip arbitrary error
        // text through the URL so a crafted ?error=… can't phish via copy
        // on our own domain. The validated redirect is forwarded so the
        // user can resume to their original destination after retry.
        return signinError('oauth_failed')
    }
}

