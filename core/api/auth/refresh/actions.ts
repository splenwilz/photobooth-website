'use server'

import { cookies } from 'next/headers'
import { refreshToken } from './services'
import { clearAuthCookies, updateTokenCookies } from '@/lib/auth'
import type { RefreshTokenRequest } from './types'

/**
 * Server action to refresh access token
 * 
 * Uses refresh token from HTTP-only cookie to get new access token
 * Updates cookies with new tokens
 */
export async function refreshTokenAction(): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const cookieStore = await cookies()
        const refreshTokenCookie = cookieStore.get('auth_refresh_token')?.value

        if (!refreshTokenCookie) {
            await clearAuthCookies()
            return {
                success: false,
                error: 'No refresh token available',
            }
        }

        // Call refresh service with refresh token from cookie
        const request: RefreshTokenRequest = {
            refresh_token: refreshTokenCookie,
        }
        const tokenData = await refreshToken(request)

        // Update only token cookies (preserves user data)
        await updateTokenCookies(tokenData)

        return {
            success: true,
        }
    } catch (error) {
        // Refresh failed - clear auth
        await clearAuthCookies()

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to refresh token',
        }
    }
}