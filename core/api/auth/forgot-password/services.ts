import { apiClient } from "../../client";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "./types";

/**
 * Send forgot password request
 * @param data - Forgot password request with email
 * @returns Promise resolving to forgot password response
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient<ForgotPasswordResponse>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response;
}