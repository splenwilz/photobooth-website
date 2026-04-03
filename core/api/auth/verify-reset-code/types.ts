import z from "zod"

export const VerifyResetCodeRequestSchema = z.object({
    code: z.string().regex(/^\d{6}$/, { message: "Reset code must be 6 digits" }),
})

export const VerifyResetCodeResponseSchema = z.object({
    message: z.string(),
    token: z.string(),
})

export type VerifyResetCodeRequest = z.infer<typeof VerifyResetCodeRequestSchema>;
export type VerifyResetCodeResponse = z.infer<typeof VerifyResetCodeResponseSchema>;
