/**
 * Public Pricing API Services
 *
 * Service functions for public pricing plans and checkout.
 */

import { apiClient } from "@/core/api/client";
import type {
  PublicPlansResponse,
  CheckoutRequest,
  CheckoutResponse,
} from "./types";

const PRICING_BASE = "/api/v1/pricing";

/**
 * Fetch public pricing plans
 *
 * No authentication required.
 *
 * @returns List of active pricing plans
 *
 * @example
 * const plans = await getPublicPricingPlans();
 * plans.plans.forEach(plan => console.log(plan.name, plan.price_display));
 */
export async function getPublicPricingPlans(): Promise<PublicPlansResponse> {
  return apiClient<PublicPlansResponse>(`${PRICING_BASE}/plans`);
}

/**
 * Create a subscription checkout session for a booth
 *
 * Initiates Stripe Checkout for per-booth subscription.
 *
 * @param boothId - Booth ID to subscribe
 * @param data - Checkout request with price ID and URLs
 * @returns Checkout session with redirect URL
 *
 * @example
 * const checkout = await createSubscriptionCheckout("booth-123", {
 *   price_id: "price_abc123",
 *   success_url: "https://example.com/success",
 *   cancel_url: "https://example.com/cancel",
 * });
 * window.location.href = checkout.checkout_url;
 */
export async function createSubscriptionCheckout(
  boothId: string,
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  return apiClient<CheckoutResponse>(
    `/api/v1/booths/${boothId}/subscription/checkout`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
