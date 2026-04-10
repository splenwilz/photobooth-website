/**
 * Payment API Services
 *
 * Service functions for payment-related API endpoints. Handles checkout
 * session verification, customer portal, per-booth subscriptions, and
 * template purchases.
 *
 * Note: a number of functions used to live here for the OLD global
 * subscription flow (single Pro plan + 14-day trial) and for hardware
 * package sales. Both features were removed at the client's request.
 * The corresponding service functions and hooks were deleted along
 * with the routes that used them.
 *
 * @see https://stripe.com/docs/api
 */

import { apiClient } from "../client";
import type {
  BoothSubscriptionItem,
  CheckoutResponse,
  CheckoutSessionResponse,
  CreateBoothCheckoutRequest,
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,
  CreateTemplateCheckoutRequest,
} from "./types";

// ============================================================================
// CHECKOUT SERVICES
// ============================================================================

/**
 * Create a template checkout session
 * Uses database prices (price_data) instead of Stripe Price IDs
 *
 * @param data - Template checkout request with template IDs
 * @returns Promise resolving to checkout URL and session ID
 * @see POST /api/v1/payments/checkout/templates
 */
export async function createTemplateCheckout(
  data: CreateTemplateCheckoutRequest
): Promise<CheckoutResponse> {
  return apiClient<CheckoutResponse>("/api/v1/payments/checkout/templates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get checkout session status
 * Verify if a checkout session completed successfully
 *
 * @param sessionId - The Stripe checkout session ID
 * @returns Promise resolving to session status and payment details
 * @see GET /api/v1/payments/checkout/{session_id}
 *
 * @example
 * ```ts
 * // On success page
 * const sessionId = new URLSearchParams(window.location.search).get('session_id');
 * const session = await getCheckoutSession(sessionId);
 *
 * if (session.payment_status === 'paid') {
 *   showThankYouMessage();
 * } else {
 *   showPaymentPendingMessage();
 * }
 * ```
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<CheckoutSessionResponse> {
  return apiClient<CheckoutSessionResponse>(
    `/api/v1/payments/checkout/${sessionId}`,
    {
      method: "GET",
    }
  );
}

// ============================================================================
// CUSTOMER PORTAL SERVICES
// ============================================================================

/**
 * Create a Stripe Customer Portal session
 * Redirects user to Stripe's self-service portal for billing management
 *
 * Portal allows users to:
 * - Update payment method
 * - View/download invoices
 * - Cancel subscription
 * - Change plan (if configured)
 *
 * @param data - Portal request with return URL
 * @returns Promise resolving to portal URL
 * @see POST /api/v1/payments/portal
 *
 * @example
 * ```ts
 * const { portal_url } = await createPortalSession({
 *   return_url: `${window.location.origin}/dashboard/settings`
 * });
 * window.location.href = portal_url;
 * ```
 */
export async function createPortalSession(
  data: CreatePortalSessionRequest
): Promise<CreatePortalSessionResponse> {
  return apiClient<CreatePortalSessionResponse>("/api/v1/payments/portal", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================================
// PER-BOOTH SUBSCRIPTION SERVICES
// ============================================================================

/**
 * Get single booth subscription status
 * Returns subscription details for a specific booth
 *
 * @param boothId - Booth ID to get subscription for
 * @returns Promise resolving to booth subscription status
 * @see GET /api/v1/booths/{booth_id}/subscription
 */
export async function getBoothSubscription(
  boothId: string
): Promise<BoothSubscriptionItem> {
  return apiClient<BoothSubscriptionItem>(
    `/api/v1/booths/${boothId}/subscription`,
    { method: "GET" }
  );
}

/**
 * Create checkout session for booth subscription
 * Creates a Stripe checkout session for a specific booth
 *
 * @param data - Checkout configuration with booth ID and URLs
 * @returns Promise resolving to checkout URL and session ID
 * @see POST /api/v1/booths/{booth_id}/subscription/checkout
 */
export async function createBoothCheckout(
  data: CreateBoothCheckoutRequest
): Promise<CheckoutResponse> {
  return apiClient<CheckoutResponse>(
    `/api/v1/booths/${data.booth_id}/subscription/checkout`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Cancel booth subscription
 * Cancels subscription for a specific booth
 *
 * @param boothId - Booth ID to cancel subscription for
 * @param cancelImmediately - If true, cancels immediately instead of at period end
 * @returns Promise resolving to updated booth subscription state
 * @see POST /api/v1/booths/{booth_id}/subscription/cancel
 */
export async function cancelBoothSubscription(
  boothId: string,
  cancelImmediately = false
): Promise<BoothSubscriptionItem> {
  const url = `/api/v1/booths/${boothId}/subscription/cancel${cancelImmediately ? "?cancel_immediately=true" : ""}`;
  return apiClient<BoothSubscriptionItem>(url, { method: "POST" });
}
