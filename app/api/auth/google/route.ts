import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { oauth } from "@/core/api/auth/oauth/services";
import { safeRedirectPath } from "@/lib/auth-redirect";

/**
 * GET /api/auth/google
 *
 * Initiates Google OAuth flow by redirecting to Google's authorization URL.
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

    console.log("[AUTH] Google OAuth initiate:", {
      origin,
      redirectUri,
      envRedirectUri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
      apiBaseUrl: process.env.API_BASE_URL,
    });

    // Store redirect URL in cookie if provided. We validate same-origin here
    // (and again on read in /api/auth/callback) to prevent open-redirect via a
    // crafted /api/auth/google?redirect=https://evil.com/... URL.
    const { searchParams } = new URL(req.url);
    const rawRedirect = searchParams.get("redirect");
    const validated = safeRedirectPath(rawRedirect);
    // safeRedirectPath returns the default ("/dashboard") for invalid input —
    // only persist the cookie when the caller actually supplied a real target.
    const redirectTo = rawRedirect && validated === rawRedirect ? validated : null;

    const response = await oauth({
      provider: "GoogleOAuth",
      redirect_uri: redirectUri,
    });

    console.log("[AUTH] Google OAuth response received:", {
      hasAuthorizationUrl: !!response.authorization_url,
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
    console.error("[AUTH] Google OAuth initiate failed:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      fullError: error,
    });

    // Redirect to signin with a stable error code; /signin maps the code
    // to fixed copy via mapSigninError(). We don't pass user-facing
    // strings through the URL — a crafted ?message=… would otherwise let
    // an attacker phish via copy on our own domain. The validated
    // redirect (if any) is forwarded so the user can retry without
    // losing their original destination.
    const { origin: errOrigin, searchParams: errSearchParams } = new URL(req.url);
    const errorUrl = new URL("/signin", errOrigin);
    errorUrl.searchParams.set("error", "oauth_failed");
    const errRawRedirect = errSearchParams.get("redirect");
    const errValidated = safeRedirectPath(errRawRedirect);
    if (errRawRedirect && errValidated === errRawRedirect) {
      errorUrl.searchParams.set("redirect", errValidated);
    }
    const errResponse = NextResponse.redirect(errorUrl.toString());
    // Clear any stale auth_redirect from a previous attempt — we never
    // got far enough to set a new one in this attempt.
    errResponse.cookies.delete("auth_redirect");
    return errResponse;
  }
}
