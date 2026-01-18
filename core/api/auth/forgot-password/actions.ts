'use server'

import { forgotPassword } from "./services"
import type { ForgotPasswordRequest } from "./types"
import { z } from "zod"

export type ForgotPasswordActionResult =
    | { success: true; message: string }
    | { success: false; error: string }
    | null

const schema = z.object({
    email: z.email({ message: 'Invalid email address' }),
})

export async function forgotPasswordAction(
    _prevState: ForgotPasswordActionResult | null,
    formData: FormData
): Promise<ForgotPasswordActionResult> {
    const email = formData.get('email')?.toString()

    if (!email) {
        return { success: false, error: 'Email is required' }
    }

    // Validate email format using Zod schema
    const validationResult = schema.safeParse({ email })
    if (!validationResult.success) {
        return {
            success: false,
            error: validationResult.error.issues[0]?.message || 'Invalid email address',
        }
    }

    try {
        const requestBody: ForgotPasswordRequest = {
            email: validationResult.data.email,
        }
        const response = await forgotPassword(requestBody)
        return {
            success: true,
            message: response.message,
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        }
    }
}

