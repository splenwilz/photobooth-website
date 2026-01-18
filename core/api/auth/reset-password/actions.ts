'use server'

import { resetPassword } from "./services"
import { ResetPasswordRequestSchema, type ResetPasswordRequest } from "./types"
import type { AuthResponse } from "../types"

export type ResetPasswordActionResult =
    | { success: true; data: AuthResponse }
    | { success: false; error: string }
    | null

export async function resetPasswordAction(
    _prevState: ResetPasswordActionResult | null,
    formData: FormData
): Promise<ResetPasswordActionResult> {
    // Get token and passwords from FormData (passed from client component)
    const token = formData.get('token')?.toString() ?? ''
    const new_password = formData.get('new_password')?.toString() ?? ''
    const confirm_new_password = formData.get('confirm_new_password')?.toString() ?? ''

    // Validate using Zod schema
    const validationResult = ResetPasswordRequestSchema.safeParse({
        token,
        new_password,
        confirm_new_password,
    })

    if (!validationResult.success) {
        return {
            success: false,
            error: validationResult.error.issues[0]?.message || 'Validation failed',
        }
    }

    try {
        const requestBody: ResetPasswordRequest = {
            token: validationResult.data.token,
            new_password: validationResult.data.new_password,
            confirm_new_password: validationResult.data.confirm_new_password,
        }
        const response = await resetPassword(requestBody)
        return {
            success: true,
            data: response,
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reset password',
        }
    }
}

