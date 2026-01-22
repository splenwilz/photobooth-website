import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { oauth } from "@/core/api/auth/oauth/services";

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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUri = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI || `${baseUrl}/api/auth/callback`;

    // Store redirect URL in cookie if provided
    const { searchParams } = new URL(req.url);
    const redirectTo = searchParams.get("redirect");

    const response = await oauth({
      provider: "GoogleOAuth",
      redirect_uri: redirectUri,
    });

    const redirectResponse = NextResponse.redirect(response.authorization_url);

    // Set redirect cookie if provided (expires in 10 minutes)
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
    console.error("[AUTH] Google OAuth initiate failed:", error);

    // Redirect to signin page with error
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const errorUrl = new URL("/signin", baseUrl);
    errorUrl.searchParams.set("error", "oauth_failed");
    errorUrl.searchParams.set("message", "Failed to start Google sign in. Please try again.");

    return NextResponse.redirect(errorUrl.toString());
  }
}
