import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createProductCheckout } from "@/core/api/payments";
import { HARDWARE_PRICES, type HardwarePackageId } from "@/core/config/stripe";

/**
 * GET /api/checkout/hardware/[package]
 *
 * Initiates Stripe product checkout for hardware packages.
 * Handles authentication check and creates a one-time payment session.
 *
 * Route params:
 * - package: "essential" | "professional" | "premium"
 *
 * This is a simple redirect endpoint - no JavaScript loading state required.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ package: string }> }
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const { package: packageId } = await params;

    // Validate package ID
    const validPackages: HardwarePackageId[] = ["essential", "professional", "premium"];
    if (!validPackages.includes(packageId as HardwarePackageId)) {
      const errorUrl = new URL("/pricing", baseUrl);
      errorUrl.searchParams.set("error", "invalid_package");
      errorUrl.searchParams.set("message", "Invalid hardware package selected.");
      return NextResponse.redirect(errorUrl.toString());
    }

    // Check authentication
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("auth_access_token")?.value;

    if (!accessToken) {
      // Redirect to signin with return URL back to this checkout route
      const signinUrl = new URL("/signin", baseUrl);
      signinUrl.searchParams.set("redirect", `/api/checkout/hardware/${packageId}`);
      return NextResponse.redirect(signinUrl.toString());
    }

    // Get price ID for the package
    const priceId = HARDWARE_PRICES[packageId as HardwarePackageId];

    if (!priceId) {
      console.error("[CHECKOUT] Stripe price ID not configured for hardware package:", packageId);
      const errorUrl = new URL("/pricing", baseUrl);
      errorUrl.searchParams.set("error", "checkout_config");
      errorUrl.searchParams.set("message", "Checkout is not configured. Please contact support.");
      return NextResponse.redirect(errorUrl.toString());
    }

    // Create checkout session
    const { checkout_url } = await createProductCheckout({
      price_id: priceId,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=hardware&package=${packageId}`,
      cancel_url: `${baseUrl}/pricing#hardware`,
      quantity: 1,
      metadata: {
        type: "hardware",
        package: packageId,
      },
    });

    // Redirect to Stripe checkout
    return NextResponse.redirect(checkout_url);
  } catch (error) {
    console.error("[CHECKOUT] Hardware checkout failed:", error);

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
