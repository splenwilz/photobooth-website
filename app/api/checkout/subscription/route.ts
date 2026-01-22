import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSubscriptionCheckout,
  checkSubscriptionAccess,
  createPortalSession,
} from "@/core/api/payments";
import { SUBSCRIPTION_PRICES, PRO_TRIAL_DAYS } from "@/core/config/stripe";

/**
 * GET /api/checkout/subscription
 *
 * Initiates Stripe subscription checkout by creating a session and redirecting.
 * Handles authentication check and existing subscription redirect to portal.
 *
 * Query params:
 * - interval: "monthly" | "annual" (default: "annual")
 *
 * This is a simple redirect endpoint - no JavaScript loading state required.
 */
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    // Check authentication
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("auth_access_token")?.value;

    if (!accessToken) {
      // Redirect to signin with return URL back to this checkout route
      const { searchParams } = new URL(req.url);
      const interval = searchParams.get("interval") || "annual";
      const signinUrl = new URL("/signin", baseUrl);
      signinUrl.searchParams.set("redirect", `/api/checkout/subscription?interval=${interval}`);
      return NextResponse.redirect(signinUrl.toString());
    }

    // Check if user already has an active subscription
    try {
      const accessData = await checkSubscriptionAccess();

      if (accessData.has_access) {
        // User has active subscription - redirect to customer portal
        const { portal_url } = await createPortalSession({
          return_url: `${baseUrl}/dashboard/settings`,
        });
        return NextResponse.redirect(portal_url);
      }
    } catch (accessError) {
      // If access check fails, continue with checkout
      // (user might not have a subscription yet)
      console.error("[CHECKOUT] Access check failed:", accessError);
    }

    // Get billing interval from query params
    const { searchParams } = new URL(req.url);
    const interval = searchParams.get("interval") || "annual";
    const isAnnual = interval === "annual";

    // Get price ID
    const priceId = isAnnual
      ? SUBSCRIPTION_PRICES.pro.annual
      : SUBSCRIPTION_PRICES.pro.monthly;

    if (!priceId) {
      console.error("[CHECKOUT] Stripe price ID not configured for Pro", interval);
      const errorUrl = new URL("/pricing", baseUrl);
      errorUrl.searchParams.set("error", "checkout_config");
      errorUrl.searchParams.set("message", "Checkout is not configured. Please contact support.");
      return NextResponse.redirect(errorUrl.toString());
    }

    // Create checkout session
    const { checkout_url } = await createSubscriptionCheckout({
      price_id: priceId,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      trial_period_days: PRO_TRIAL_DAYS,
      metadata: {
        plan: "pro",
        billing_interval: interval,
      },
    });

    // Redirect to Stripe checkout
    return NextResponse.redirect(checkout_url);
  } catch (error) {
    console.error("[CHECKOUT] Subscription checkout failed:", error);

    // Redirect to pricing page with error
    const errorUrl = new URL("/pricing", baseUrl);
    errorUrl.searchParams.set("error", "checkout_failed");
    errorUrl.searchParams.set(
      "message",
      error instanceof Error ? error.message : "Failed to start checkout. Please try again."
    );
    return NextResponse.redirect(errorUrl.toString());
  }
}
