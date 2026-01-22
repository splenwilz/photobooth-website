import { apiClient } from "../../client";
import type { AuthResponse } from "../types";
import type { OAuthCallbackRequest, OAuthRequest, OAuthResponse } from "./types";

/**
 * Initiate OAuth flow
 * @param data - User oauth request
 * @returns Promise resolving to oauth response
 * @see https://tanstack.com/query/latest/docs/react/guides/mutations
 */
export async function oauth(data: OAuthRequest): Promise<OAuthResponse> {
  const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log("[AUTH] OAuth service - calling backend:", {
    endpoint: "/api/v1/auth/authorize",
    fullUrl: `${apiBaseUrl?.replace(/\/+$/, '')}/api/v1/auth/authorize`,
    provider: data.provider,
    redirect_uri: data.redirect_uri,
  });

  try {
    const response = await apiClient<OAuthResponse>("/api/v1/auth/authorize", {
      method: "POST",
      body: JSON.stringify(data),
    });

    console.log("[AUTH] OAuth service - backend response success");
    return response;
  } catch (error) {
    console.error("[AUTH] OAuth service - backend call failed:", {
      error: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : undefined,
    });
    throw error;
  }
}

/**
 * Handle OAuth callback
 * @param data - OAuth callback request data
 * @returns Promise resolving to auth response with tokens
 */
export async function oauthCallback(data: OAuthCallbackRequest): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>("/api/v1/auth/callback", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}