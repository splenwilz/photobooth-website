import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { oauth } from "@/core/api/auth/oauth/services";
import { safeRedirectPath } from "@/lib/auth-redirect";

/**
 * GET /api/auth/apple
 *
 * Initiates Apple OAuth flow by redirecting to Apple's authorization URL.
 * This is a simple redirect endpoint - no JavaScript required on the client.
 *
 * Query params:
 * - redirect: URL to redirect to after successful authentication (optional)
 */
export async function GET(req: NextRequest) {
  try {
    // Derive base URL from request to work in all environments
    const { origin } = new URL(req.url);
    const redirectUri = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI || `${origin}/api/auth/callback`;

    // Store redirect URL in cookie if provided. We validate same-origin here
    // (and again on read in /api/auth/callback) to prevent open-redirect via a
    // crafted /api/auth/apple?redirect=https://evil.com/... URL.
    const { searchParams } = new URL(req.url);
    const rawRedirect = searchParams.get("redirect");
    const validated = safeRedirectPath(rawRedirect);
    const redirectTo = rawRedirect && validated === rawRedirect ? validated : null;

    const response = await oauth({
      provider: "AppleOAuth",
      redirect_uri: redirectUri,
    });

    const redirectResponse = NextResponse.redirect(response.authorization_url);

    // Always clear any stale auth_redirect from a previous (possibly
    // cancelled) OAuth attempt before conditionally setting a fresh one.
    redirectResponse.cookies.delete("auth_redirect");
    if (redirectTo) {
      redirectResponse.cookies.set("auth_redirect", redirectTo, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600, // 10 minutes
      });
    }

    return redirectResponse;
  } catch (error) {
    console.error("[AUTH] Apple OAuth initiate failed:", error);

    // Redirect to signin with a stable error code; /signin maps the code
    // to fixed copy via mapSigninError(). We don't pass user-facing
    // strings through the URL — a crafted ?message=… would otherwise let
    // an attacker phish via copy on our own domain.
    const { origin } = new URL(req.url);
    const errorUrl = new URL("/signin", origin);
    errorUrl.searchParams.set("error", "oauth_failed");

    return NextResponse.redirect(errorUrl.toString());
  }
}
