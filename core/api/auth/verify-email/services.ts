import { apiClient } from "../../client";
  import type { AuthResponse } from "../types";
  import type { VerifyEmailRequest } from "./types";

/**
 * Verify email of an existing user
 * @param data - User verify email request
 * @returns Promise resolving to authentication response
 * @see https://tanstack.com/query/latest/docs/react/guides/mutations
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}

