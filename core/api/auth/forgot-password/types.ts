import z from "zod"

export const ForgotPasswordRequestSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
})

export const ForgotPasswordResponseSchema = z.object({
    message: z.string(),
})
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>;