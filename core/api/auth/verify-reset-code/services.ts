import { apiClient } from "../../client";
import type { VerifyResetCodeRequest, VerifyResetCodeResponse } from "./types";

/**
 * Verify password reset code
 * @param data - Verify reset code request with 6-digit code
 * @returns Promise resolving to verify reset code response with token
 */
export async function verifyResetCode(data: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> {
    const response = await apiClient<VerifyResetCodeResponse>("/api/v1/auth/verify-reset-code", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response;
}
