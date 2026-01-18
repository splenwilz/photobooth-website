import { z } from "zod";

/**
 * Schema for user refresh token request
 */

export const RefreshTokenRequestSchema = z.object({
    refresh_token: z.string(),
})

export const RefreshTokenResponseSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
})

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;