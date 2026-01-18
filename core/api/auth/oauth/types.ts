import { z } from "zod";

/**
 * Schema for user oauth request
 */

export const OAuthRequestSchema = z.object({
  provider: z.string(),
  connection_id: z.string().optional(),
  redirect_uri: z.url({ message: "redirect_uri must match the redirect_uri in your Workos Dashboard" }),
  state: z.string().optional(),
})

export const OAuthResponseSchema = z.object({
  authorization_url: z.string(),
})

export const OAuthCallbackRequestSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
})

export type OAuthRequest = z.infer<typeof OAuthRequestSchema>;
export type OAuthResponse = z.infer<typeof OAuthResponseSchema>;
export type OAuthCallbackRequest = z.infer<typeof OAuthCallbackRequestSchema>;