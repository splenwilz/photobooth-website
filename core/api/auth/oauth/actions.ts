'use server'

import { oauth, oauthCallback } from "./services"
import type { OAuthCallbackRequest, OAuthRequest } from "./types"
import type { AuthResponse } from "../types"
import { setAuthCookies } from "@/lib/auth"
import { ApiError } from "@/core/api/client"

// Map frontend provider names to backend provider values
const PROVIDER_MAP = {
    google: 'GoogleOAuth',
    apple: 'AppleOAuth',
    microsoft: 'MicrosoftOAuth',
    github: 'GitHubOAuth',
} as const

export type OAuthProvider = keyof typeof PROVIDER_MAP

export type OAuthInitiateActionResult =
    | { success: true; authorizationUrl: string }
    | { success: false; error: string }

export type OAuthCallbackActionResult =
    | { success: true; data: AuthResponse }
    | { success: false; error: string }

/**
 * Server action to initiate OAuth flow
 * Returns authorization URL to redirect user to
 *
 * Supported providers: google, apple, microsoft, github
 * Backend expects: GoogleOAuth, AppleOAuth, MicrosoftOAuth, GitHubOAuth
 *
 * @param provider - OAuth provider ('google', 'apple', 'microsoft', 'github')
 * @returns Promise resolving to authorization URL or error
 */
export async function oauthInitiateAction(
    provider: OAuthProvider
): Promise<OAuthInitiateActionResult> {
    try {
        // Build redirect URI based on current environment
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const redirectUri = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI || `${baseUrl}/api/auth/callback`

        // Map frontend provider name to backend provider value
        const backendProvider = PROVIDER_MAP[provider]

        const request: OAuthRequest = {
            provider: backendProvider,
            redirect_uri: redirectUri,
        }

        const response = await oauth(request)

        return {
            success: true,
            authorizationUrl: response.authorization_url,
        }
    } catch (error) {
        console.error('[AUTH] OAuth initiate failed:', error)

        let errorMessage = 'Failed to start OAuth flow. Please try again.'

        if (error instanceof ApiError) {
            errorMessage = error.message || errorMessage
        } else if (error instanceof Error) {
            errorMessage = error.message
        }

        return {
            success: false,
            error: errorMessage,
        }
    }
}

/**
 * Server action for OAuth callback
 * Handles OAuth callback from provider and sets authentication cookies
 * 
 * @param data - OAuth callback data with code and optional state
 * @returns Promise resolving to OAuth callback result
 */
export async function oauthCallbackAction(
    data: OAuthCallbackRequest
): Promise<OAuthCallbackActionResult> {
    try {
        if (!data.code) {
            return {
                success: false,
                error: 'Authorization code is required',
            }
        }

        // Call OAuth callback service
        const authResponse = await oauthCallback(data)

        // Set authentication cookies
        await setAuthCookies(authResponse)

        return {
            success: true,
            data: authResponse,
        }
    } catch (error) {
        console.error('[AUTH] OAuth callback failed:', error)

        // Extract error message with better error handling
        let errorMessage = 'Failed to complete OAuth authentication. Please try again.'

        if (error instanceof Error) {
            errorMessage = error.message

            // Use instanceof for type-safe ApiError detection
            if (error instanceof ApiError) {
                console.error('[AUTH] API Error details:', {
                    status: error.status,
                    message: error.message,
                    // Don't log sensitive OAuth authorization code
                })

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

        return {
            success: false,
            error: errorMessage,
        }
    }
}

