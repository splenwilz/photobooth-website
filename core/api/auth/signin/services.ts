import { apiClient } from '../../client'
import type { AuthResponse } from '../types'
import type { EmailVerificationResponse, SigninRequest } from './types'

/**
 * Sign in an existing user
 * @param data - User signin credentials
 * @returns Promise resolving to authentication response with tokens and user data
 * @see https://tanstack.com/query/latest/docs/react/guides/mutations
 */
export async function signin(
  data: SigninRequest,
): Promise<AuthResponse | EmailVerificationResponse> {
  const response = await apiClient<AuthResponse | EmailVerificationResponse>(
    '/api/v1/auth/signin',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
  return response
}
