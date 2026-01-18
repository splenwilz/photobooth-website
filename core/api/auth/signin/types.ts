import { z } from "zod";

/**
 * Schema for user signin request
 */
export const SigninRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8)
})

export const EmailVerificationResponseSchema = z.object({
  message: z.string(),
  pending_authentication_token: z.string(),
  email_verification_id: z.string(),
  email: z.string(),
  requires_verification: z.boolean(),
})

export type SigninRequest = z.infer<typeof SigninRequestSchema>;

export type EmailVerificationResponse = z.infer<typeof EmailVerificationResponseSchema>;