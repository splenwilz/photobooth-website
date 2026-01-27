/**
 * Payment API Services
 *
 * Service functions for all payment-related API endpoints.
 * Handles checkout, subscription management, and customer portal.
 *
 * @see https://stripe.com/docs/api
 */

import { apiClient } from "../client";
import type {
  BoothSubscriptionItem,
  BoothSubscriptionsListResponse,
  CancelSubscriptionParams,
  CancelSubscriptionResponse,
  CheckoutResponse,
  CheckoutSessionResponse,
  CreateBoothCheckoutRequest,
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,
  CreateProductCheckoutRequest,
  CreateProductsCheckoutRequest,
  CreateSubscriptionCheckoutRequest,
  CreateTemplateCheckoutRequest,
  SubscriptionAccessResponse,
  SubscriptionInfoResponse,
} from "./types";

// ============================================================================
// CHECKOUT SERVICES
// ============================================================================

/**
 * Create a subscription checkout session
 * Redirects user to Stripe Checkout for recurring subscription
 *
 * @param data - Subscription checkout request data
 * @returns Promise resolving to checkout URL and session ID
 * @see POST /api/v1/payments/checkout/subscription
 *
 * @example
 * ```ts
 * const { checkout_url } = await createSubscriptionCheckout({
 *   price_id: 'price_pro_monthly_xxx',
 *   success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
 *   cancel_url: `${window.location.origin}/pricing`,
 *   trial_period_days: 14,
 *   metadata: { plan: 'pro' }
 * });
 * window.location.href = checkout_url;
 * ```
 */
export async function createSubscriptionCheckout(
  data: CreateSubscriptionCheckoutRequest
): Promise<CheckoutResponse> {
  return apiClient<CheckoutResponse>("/api/v1/payments/checkout/subscription", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Create a single product checkout session
 * Redirects user to Stripe Checkout for one-time purchase
 *
 * @param data - Product checkout request data
 * @returns Promise resolving to checkout URL and session ID
 * @see POST /api/v1/payments/checkout/product
 *
 * @example
 * ```ts
 * const { checkout_url } = await createProductCheckout({
 *   price_id: 'price_booth_professional_xxx',
 *   success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
 *   cancel_url: `${window.location.origin}/pricing`,
 *   quantity: 1,
 *   metadata: { package: 'professional' }
 * });
 * window.location.href = checkout_url;
 * ```
 */
export async function createProductCheckout(
  data: CreateProductCheckoutRequest
): Promise<CheckoutResponse> {
  return apiClient<CheckoutResponse>("/api/v1/payments/checkout/product", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Create a multi-product checkout session (cart checkout)
 * Redirects user to Stripe Checkout with multiple line items
 *
 * @param data - Products checkout request data with items array
 * @returns Promise resolving to checkout URL and session ID
 * @see POST /api/v1/payments/checkout/products
 *
 * @example
 * ```ts
 * const { checkout_url } = await createProductsCheckout({
 *   items: [
 *     { price_id: 'price_template_heart_trio', quantity: 1 },
 *     { price_id: 'price_template_classic_quad', quantity: 1 }
 *   ],
 *   success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
 *   cancel_url: `${window.location.origin}/templates`
 * });
 * window.location.href = checkout_url;
 * ```
 */
export async function createProductsCheckout(
  data: CreateProductsCheckoutRequest
): Promise<CheckoutResponse> {
  return apiClient<CheckoutResponse>("/api/v1/payments/checkout/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

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
// SUBSCRIPTION ACCESS SERVICES
// ============================================================================

/**
 * Check if user has active subscription access
 * Used for feature gating throughout the app
 *
 * @returns Promise resolving to access status and subscription info
 * @see GET /api/v1/payments/access
 *
 * @example
 * ```ts
 * const { has_access, subscription_status } = await checkSubscriptionAccess();
 *
 * if (has_access) {
 *   showPremiumFeatures();
 * } else {
 *   showUpgradePrompt();
 * }
 * ```
 */
export async function checkSubscriptionAccess(): Promise<SubscriptionAccessResponse> {
  return apiClient<SubscriptionAccessResponse>("/api/v1/payments/access", {
    method: "GET",
  });
}

/**
 * Get detailed subscription information
 * Returns full subscription details including billing period and status
 *
 * @returns Promise resolving to subscription details
 * @see GET /api/v1/payments/subscription
 *
 * @example
 * ```ts
 * const subscription = await getSubscriptionInfo();
 * console.log(subscription.status); // 'active', 'trialing', etc.
 * console.log(subscription.current_period_end); // '2026-02-20T09:23:50Z'
 * console.log(subscription.cancel_at_period_end); // false
 * ```
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfoResponse> {
  return apiClient<SubscriptionInfoResponse>("/api/v1/payments/subscription", {
    method: "GET",
  });
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT SERVICES
// ============================================================================

/**
 * Cancel the user's subscription
 * Can cancel immediately or at end of billing period
 *
 * @param params - Cancel options (cancel_immediately defaults to false)
 * @returns Promise resolving to updated subscription info
 * @see POST /api/v1/payments/subscription/cancel
 *
 * @example
 * ```ts
 * // Cancel at end of billing period (user keeps access until then)
 * const subscription = await cancelSubscription({ cancel_immediately: false });
 * console.log(subscription.cancel_at_period_end); // true
 *
 * // Cancel immediately (user loses access now)
 * const subscription = await cancelSubscription({ cancel_immediately: true });
 * console.log(subscription.is_active); // false
 * ```
 */
export async function cancelSubscription(
  params?: CancelSubscriptionParams
): Promise<CancelSubscriptionResponse> {
  const queryString = params?.cancel_immediately
    ? "?cancel_immediately=true"
    : "?cancel_immediately=false";

  return apiClient<CancelSubscriptionResponse>(
    `/api/v1/payments/subscription/cancel${queryString}`,
    {
      method: "POST",
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
 * Get all booth subscriptions for user
 * Returns all user's booths with their subscription status
 *
 * @returns Promise resolving to list of booths with subscription status
 * @see GET /api/v1/payments/booths/subscriptions
 */
export async function getBoothSubscriptions(): Promise<BoothSubscriptionsListResponse> {
  return apiClient<BoothSubscriptionsListResponse>(
    "/api/v1/payments/booths/subscriptions",
    { method: "GET" }
  );
}

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
