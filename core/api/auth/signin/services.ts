import { apiClient } from '../../client'
import { signinPerfLog } from '@/lib/signin-perf'
import type { AuthResponse } from '../types'
import type { EmailVerificationResponse, SigninRequest } from './types'

/**
 * Sign in an existing user
 * @param data - User signin credentials
 * @param reqId - Optional correlation id for [SIGNIN-PERF] logs
 * @returns Promise resolving to authentication response with tokens and user data
 * @see https://tanstack.com/query/latest/docs/react/guides/mutations
 */
export async function signin(
  data: SigninRequest,
  reqId?: string,
): Promise<AuthResponse | EmailVerificationResponse> {
  const start = Date.now()
  signinPerfLog({ reqId, phase: 'signin_service_start' })
  try {
    const response = await apiClient<AuthResponse | EmailVerificationResponse>(
      '/api/v1/auth/signin',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    )
    signinPerfLog({ reqId, phase: 'signin_service_end', service_ms: Date.now() - start })
    return response
  } catch (e) {
    signinPerfLog({ reqId, phase: 'signin_service_error', service_ms: Date.now() - start })
    throw e
  }
}
