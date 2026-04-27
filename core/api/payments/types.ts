/**
 * Payment API Types
 *
 * TypeScript types for payment-related API endpoints. Covers checkout
 * session verification, customer portal, per-booth subscriptions, and
 * template purchases.
 *
 * Note: types for the OLD global subscription flow (CreateSubscriptionCheckoutRequest,
 * SubscriptionAccessResponse, SubscriptionInfoResponse, CancelSubscriptionParams,
 * etc.) and for hardware sales (CreateProductCheckoutRequest, HardwarePackage,
 * PriceIds.booth_*) used to live here. Both feature sets were removed at
 * the client's request — booths are sold on the BoothWorks website now,
 * and there is no global Pro plan or free trial.
 *
 * @see Stripe API: https://stripe.com/docs/api
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Standard checkout response from all checkout endpoints
 */
export interface CheckoutResponse {
  success: boolean;
  checkout_url: string;
  session_id: string;
  error_message: string | null;
}

/**
 * Checkout session status values
 */
export type CheckoutStatus = "open" | "complete" | "expired";

/**
 * Payment status values
 */
export type PaymentStatus = "paid" | "unpaid" | "no_payment_required";

/**
 * Subscription status values from Stripe
 */
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

// ============================================================================
// TEMPLATE CHECKOUT (Database Prices)
// ============================================================================

/**
 * Line item for template checkout
 */
export interface TemplateCheckoutLineItem {
  /** Database template ID */
  template_id: number;
  /** Quantity of this item */
  quantity: number;
}

/**
 * Request body for creating a template checkout session
 * Uses database prices (price_data) instead of Stripe Price IDs
 * @see POST /api/v1/payments/checkout/templates
 */
export interface CreateTemplateCheckoutRequest {
  /** UUID of the booth this purchase is for */
  booth_id: string;
  /** Array of template items to purchase */
  items: TemplateCheckoutLineItem[];
  /** URL to redirect after successful payment */
  success_url: string;
  /** URL to redirect if user cancels checkout */
  cancel_url: string;
  /** Customer email (optional) */
  customer_email?: string;
  /** Custom metadata to attach to the payment */
  metadata?: Record<string, string>;
}

// ============================================================================
// CHECKOUT SESSION STATUS
// ============================================================================

/**
 * Backend's view of post-payment fulfillment.
 *
 * Stripe's `payment_status` only tells us whether the customer's money was
 * captured. `fulfillment_status` tells us whether our side actually
 * recorded the purchase (template rows, booth sync command, etc.). The
 * checkout-session endpoint runs idempotent fulfillment inline as a
 * fallback for when the Stripe webhook is delayed or missing — so this
 * field is the right signal to gate "purchase complete" UI on, not
 * `payment_status`.
 *
 * - "completed":      purchase recorded, booth notified — safe to show success.
 * - "pending":        Stripe says paid but our state hasn't caught up. Poll.
 * - "failed":         payment captured but fulfillment hit a structural
 *                     error (missing metadata etc.). Support notified.
 * - "not_applicable": session is not a template purchase (e.g. subscription).
 */
export type FulfillmentStatus =
  | "completed"
  | "pending"
  | "failed"
  | "not_applicable";

/**
 * Response from checkout session status endpoint
 * @see GET /api/v1/payments/checkout/{session_id}
 */
export interface CheckoutSessionResponse {
  /** The checkout session ID */
  session_id: string;
  /** Current status of the checkout session */
  status: CheckoutStatus;
  /** Payment status */
  payment_status: PaymentStatus;
  /** Backend fulfillment state — see FulfillmentStatus. */
  fulfillment_status: FulfillmentStatus;
  /** Customer email from checkout */
  customer_email: string | null;
  /** Total amount in cents */
  amount_total: number;
  /** Currency code (e.g., "usd") */
  currency: string;
}

// ============================================================================
// CUSTOMER PORTAL
// ============================================================================

/**
 * Request body for creating a customer portal session
 * @see POST /api/v1/payments/portal
 */
export interface CreatePortalSessionRequest {
  /** URL to redirect after user exits the portal */
  return_url: string;
}

/**
 * Response from create portal session endpoint
 * @see POST /api/v1/payments/portal
 */
export interface CreatePortalSessionResponse {
  /** Whether the portal session was created successfully */
  success: boolean;
  /** URL to redirect user to Stripe Customer Portal */
  portal_url: string;
  /** Error message if creation failed */
  error_message: string | null;
}

// ============================================================================
// PER-BOOTH SUBSCRIPTIONS
// ============================================================================

/**
 * Per-booth subscription status
 *
 * @see GET /api/v1/booths/{booth_id}/subscription - Get single booth subscription
 */
export interface BoothSubscriptionItem {
  /** Booth ID */
  booth_id: string;
  /** Booth name for display */
  booth_name: string;
  /** Stripe subscription ID or null if no subscription */
  subscription_id: string | null;
  /** Current subscription status or null if no subscription */
  status: SubscriptionStatus | null;
  /** Whether booth has active subscription */
  is_active: boolean;
  /** End of current billing period (ISO 8601) or null */
  current_period_end: string | null;
  /** Whether subscription will cancel at period end */
  cancel_at_period_end: boolean;
  /** Stripe price ID or null */
  price_id: string | null;
}

/**
 * POST /api/v1/booths/{booth_id}/subscription/checkout request body
 */
export interface CreateBoothCheckoutRequest {
  /** Booth ID to create subscription for */
  booth_id: string;
  /** Stripe price ID (optional - uses default if not provided) */
  price_id?: string;
  /** URL to redirect to on successful payment */
  success_url: string;
  /** URL to redirect to if payment is cancelled */
  cancel_url: string;
  /** Optional trial period in days */
  trial_period_days?: number;
}
