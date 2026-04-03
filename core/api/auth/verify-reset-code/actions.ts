'use server'

import { verifyResetCode } from "./services"
import { z } from "zod"

export type VerifyResetCodeActionResult =
    | { success: true; token: string; message: string }
    | { success: false; error: string }
    | null

const schema = z.object({
    code: z.string().regex(/^\d{6}$/, { message: "Reset code must be 6 digits" }),
})

export async function verifyResetCodeAction(
    _prevState: VerifyResetCodeActionResult | null,
    formData: FormData
): Promise<VerifyResetCodeActionResult> {
    const code = formData.get('code')?.toString()

    if (!code) {
        return { success: false, error: 'Verification code is required' }
    }

    const validationResult = schema.safeParse({ code })
    if (!validationResult.success) {
        return {
            success: false,
            error: validationResult.error.issues[0]?.message || 'Invalid code',
        }
    }

    try {
        const response = await verifyResetCode({ code: validationResult.data.code })
        return {
            success: true,
            token: response.token,
            message: response.message,
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to verify code',
        }
    }
}
