import { apiClient } from "../../client";
import type { AuthResponse } from "../types";
import type { SignupRequest } from "./types";

/**
 * Sign up a new user
 * @param data - User signup data
 * @returns Promise resolving to authentication response with tokens and user data
 * @see https://tanstack.com/query/latest/docs/react/guides/mutations
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}

