import { apiClient } from "../../client";
import type { RefreshTokenRequest, RefreshTokenResponse } from "./types";

/**
 * Refresh access token using refresh token
 * @param request - Refresh token request
 * @returns Promise resolving to new authentication response with tokens
 * @see https://tanstack.com/query/latest/docs/react/guides/mutations
 */
export async function refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient<RefreshTokenResponse>("/api/v1/auth/refresh-token", {
        method: "POST",
        body: JSON.stringify(request),
    });
    return response;
}