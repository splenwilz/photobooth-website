import { apiClient } from "../../client";
import type { ResetPasswordRequest, ResetPasswordResponse } from "./types";

/**
 * Reset password request
 * @param data - Reset password request with token, new password, and confirm new password
 * @returns Promise resolving to user info response
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient<ResetPasswordResponse>("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response;
}