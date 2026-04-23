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

// Cookie TTL is dynamic — resolveMaxAge(remember) returns 7 or 30 days.
// The JWT inside the access token cookie expires in 15 min (backend-enforced);
// when it does, the API returns 401 + expired header and the refresh flow kicks in.
// Cookie lifetime is kept in sync with the refresh token so the proxy doesn't
// redirect before refresh can be attempted.
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days (default)
const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60 // 30 days (opt-in via "remember me")
const REMEMBER_COOKIE = 'auth_remember'

function resolveMaxAge(remember: boolean): number {
  return remember ? REMEMBER_ME_MAX_AGE : SESSION_MAX_AGE
}

/**
 * Set authentication cookies after successful login/signup
 *
 * Sets:
 * - auth_access_token: access token cookie (dynamic TTL via resolveMaxAge; the
 *   JWT itself still expires in 15 min, enforced by the backend)
 * - auth_refresh_token: refresh token (dynamic TTL via resolveMaxAge)
 * - auth_user: user data for client-side access (non-httpOnly)
 *
 * @param response - Authentication response containing tokens and user data
 * @param options.remember - If true, cookies persist for 30 days instead of 7
 */
export async function setAuthCookies(
  response: AuthResponse,
  { remember = false }: { remember?: boolean } = {}
): Promise<void> {
  const cookieStore = await cookies()
  const maxAge = resolveMaxAge(remember)

  // Set access token (cookie TTL 7 or 30 days via resolveMaxAge; JWT expires in 15 min, backend-enforced)
  cookieStore.set('auth_access_token', response.access_token, {
    ...COOKIE_OPTIONS,
    maxAge,
  })

  // Set refresh token
  cookieStore.set('auth_refresh_token', response.refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge,
  })

  // Set user data (client-accessible for UI purposes)
  // Include role from the top-level response in the user cookie
  const userData = { ...response.user, ...(response.role !== undefined && { role: response.role }) }
  cookieStore.set('auth_user', JSON.stringify(userData), {
    ...COOKIE_OPTIONS,
    httpOnly: false, // Allow client-side access for user display
    maxAge,
  })

  // Persist the remember-me choice so token refreshes don't downgrade a 30-day session.
  if (remember) {
    cookieStore.set(REMEMBER_COOKIE, '1', { ...COOKIE_OPTIONS, maxAge })
  } else {
    cookieStore.delete(REMEMBER_COOKIE)
  }
}

/**
 * Update only token cookies after refresh
 * Preserves user data cookie
 *
 * @param tokenData - New tokens from refresh response
 */
export async function updateTokenCookies(tokenData: RefreshTokenResponse): Promise<void> {
  const cookieStore = await cookies()
  const remember = cookieStore.get(REMEMBER_COOKIE)?.value === '1'
  const maxAge = resolveMaxAge(remember)

  // Update access token
  cookieStore.set('auth_access_token', tokenData.access_token, {
    ...COOKIE_OPTIONS,
    maxAge,
  })

  // Update refresh token
  cookieStore.set('auth_refresh_token', tokenData.refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge,
  })

  // Refresh the remember flag alongside the tokens so it doesn't expire first.
  if (remember) {
    cookieStore.set(REMEMBER_COOKIE, '1', { ...COOKIE_OPTIONS, maxAge })
  }
}

/**
 * Clear all authentication cookies (logout)
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.delete('auth_access_token')
  cookieStore.delete('auth_refresh_token')
  cookieStore.delete('auth_user')
  cookieStore.delete(REMEMBER_COOKIE)
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
