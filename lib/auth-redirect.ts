/**
 * Shared helpers for post-signin redirect handling.
 *
 * Both the password signin flow (?redirect= query param) and the OAuth flow
 * (sessionStorage round-trip across the provider redirect) use these to
 * validate and apply the post-signin destination, rejecting anything that
 * could enable an open-redirect attack.
 */

export const POST_SIGNIN_REDIRECT_KEY = "auth_post_signin_redirect";

const DEFAULT_DESTINATION = "/dashboard";

/**
 * Returns `target` if it is a same-origin path; otherwise the default.
 *
 * Rejects:
 * - empty / null / undefined
 * - paths that do not start with "/" (e.g. "https://evil.com/...")
 * - protocol-relative URLs ("//evil.com/...")
 */
export function safeRedirectPath(target: string | null | undefined): string {
  if (!target) return DEFAULT_DESTINATION;
  if (!target.startsWith("/")) return DEFAULT_DESTINATION;
  if (target.startsWith("//")) return DEFAULT_DESTINATION;
  return target;
}
