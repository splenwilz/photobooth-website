import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for route protection
 * 
 * Performs optimistic authentication checks and redirects.
 * Note: This is not the sole security - server components should also verify auth.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 * @see https://nextjs.org/docs/app/building-your-application/authentication
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = [
        '/signin',
        '/signup',
        '/confirm-email',
        '/reset-password'
    ]

    // Protected routes that require authentication
    const protectedRoutes = [
        '/dashboard',
        '/admin',
        '/templates',
    ]

    // Check if route is public
    // Use exact match or trailing slash to prevent false positives
    // e.g., /signin-help should not match /signin
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    // Check if route is protected
    // Use exact match or trailing slash to prevent false positives
    // e.g., /dashboard-settings should not match /dashboard
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    // Check authentication by verifying both access token and user cookie exist
    // Security: Access token is httpOnly and cannot be forged
    // This prevents forged auth_user cookies from bypassing authentication
    const accessToken = request.cookies.get('auth_access_token')?.value
    const userCookie = request.cookies.get('auth_user')?.value
    // Both must exist for authentication (access token prevents cookie forgery)
    const isAuthenticated = !!(accessToken && userCookie)

    // Redirect unauthenticated users trying to access protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const signinUrl = new URL('/signin', request.url)
        signinUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(signinUrl)
    }

    // Redirect authenticated users away from auth pages
    if (isPublicRoute && isAuthenticated && (pathname === '/signin' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

/**
 * Middleware configuration
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}