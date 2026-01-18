'use server'
import { z } from 'zod'

import type { AuthResponse } from '../types'
import { verifyEmail } from './services'
import type { VerifyEmailRequest } from './types'

/**
 * Server action result type for verify email
 */
export type VerifyEmailActionResult =
    | { success: true; data: AuthResponse }
    | { success: false; error: string }

const schema = z.object({
    token: z.string().min(1, { message: 'Token is required' }),
    code: z.string().min(6, { message: 'Code must be 6 digits' }),
})
/**
 * Server action for email verification
 * 
 * @param prevState - Previous action state (for useActionState)
 * @param formData - Form data containing verification token and code
 * @returns Promise resolving to verification result
 */
export async function verifyEmailAction(
    prevState: VerifyEmailActionResult | null,
    formData: FormData
): Promise<VerifyEmailActionResult> {
    try {
        const token = formData.get('token')?.toString()
        const code = formData.get('code')?.toString()

        if (!token || !code) {
            return {
                success: false,
                error: 'Token and code are required',
            }
        }

        const validationResult = schema.safeParse({
            token,
            code,
        })
        if (!validationResult.success) {
            return {
                success: false,
                error: validationResult.error.issues[0]?.message || 'Validation failed',
            }
        }



        const requestBody: VerifyEmailRequest = {
            pending_authentication_token: token,
            code,
        }

        const response = await verifyEmail(requestBody)

        return {
            success: true,
            data: response,
        }
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to verify email. Please try again.'

        return {
            success: false,
            error: errorMessage,
        }
    }
}