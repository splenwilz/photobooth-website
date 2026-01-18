import { apiClient } from "../../client";
import type { AuthResponse } from "../types";
import type { ResetPasswordRequest } from "./types";

/**
 * Reset password request
 * @param data - Reset password request with token, new password, and confirm new password
 * @returns Promise resolving to authentication response
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response;
}