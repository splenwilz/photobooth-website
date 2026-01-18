'use server'

import { cookies } from 'next/headers'
import type { AuthResponse } from '@/core/api/auth/types'
import type { RefreshTokenResponse } from '@/core/api/auth/refresh/types'

/**
 * Cookie configuration for authentication
 * @see https://nextjs.org/docs/app/api-reference/functions/cookies
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

// Cookie expiry times
// Note: Access token cookie lives as long as refresh token.
// The actual JWT expiry (15 min) is enforced by the backend.
// When JWT expires, API returns 401 + expired header, triggering refresh.
// This prevents middleware from redirecting before refresh can be attempted.
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days (same for all auth cookies)

/**
 * Set authentication cookies after successful login/signup
 *
 * Sets:
 * - auth_access_token: Short-lived access token (15 min)
 * - auth_refresh_token: Long-lived refresh token (7 days)
 * - auth_user: User data for client-side access (non-httpOnly)
 *
 * @param response - Authentication response containing tokens and user data
 */
export async function setAuthCookies(response: AuthResponse): Promise<void> {
  const cookieStore = await cookies()

  // Set access token (cookie lives 7 days, JWT expires in 15 min - enforced by backend)
  cookieStore.set('auth_access_token', response.access_token, {
    ...COOKIE_OPTIONS,
    maxAge: SESSION_MAX_AGE,
  })

  // Set refresh token
  cookieStore.set('auth_refresh_token', response.refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge: SESSION_MAX_AGE,
  })

  // Set user data (client-accessible for UI purposes)
  cookieStore.set('auth_user', JSON.stringify(response.user), {
    ...COOKIE_OPTIONS,
    httpOnly: false, // Allow client-side access for user display
    maxAge: SESSION_MAX_AGE,
  })
}

/**
 * Update only token cookies after refresh
 * Preserves user data cookie
 *
 * @param tokenData - New tokens from refresh response
 */
export async function updateTokenCookies(tokenData: RefreshTokenResponse): Promise<void> {
  const cookieStore = await cookies()

  // Update access token
  cookieStore.set('auth_access_token', tokenData.access_token, {
    ...COOKIE_OPTIONS,
    maxAge: SESSION_MAX_AGE,
  })

  // Update refresh token
  cookieStore.set('auth_refresh_token', tokenData.refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge: SESSION_MAX_AGE,
  })
}

/**
 * Clear all authentication cookies (logout)
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.delete('auth_access_token')
  cookieStore.delete('auth_refresh_token')
  cookieStore.delete('auth_user')
}

/**
 * Get current user from cookie (server-side)
 * @returns User data or null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthResponse['user'] | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('auth_user')?.value

  if (!userCookie) return null

  try {
    return JSON.parse(userCookie)
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated (server-side)
 * @returns true if access token exists
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return !!cookieStore.get('auth_access_token')?.value
}
