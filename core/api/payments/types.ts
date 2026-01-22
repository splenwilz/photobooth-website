/**
 * Payment API Types
 *
 * TypeScript types for all payment-related API endpoints.
 * Includes checkout, subscription, and portal types.
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
// SUBSCRIPTION CHECKOUT
// ============================================================================

/**
 * Request body for creating a subscription checkout session
 * @see POST /api/v1/payments/checkout/subscription
 */
export interface CreateSubscriptionCheckoutRequest {
  /** Stripe Price ID for the subscription plan */
  price_id: string;
  /** URL to redirect after successful payment */
  success_url: string;
  /** URL to redirect if user cancels checkout */
  cancel_url: string;
  /** Number of free trial days (optional) */
  trial_period_days?: number;
  /** Custom metadata to attach to the subscription */
  metadata?: Record<string, string>;
}

// ============================================================================
// PRODUCT CHECKOUT (Single Item)
// ============================================================================

/**
 * Request body for creating a single product checkout session
 * @see POST /api/v1/payments/checkout/product
 */
export interface CreateProductCheckoutRequest {
  /** Stripe Price ID for the product */
  price_id: string;
  /** URL to redirect after successful payment */
  success_url: string;
  /** URL to redirect if user cancels checkout */
  cancel_url: string;
  /** Quantity to purchase (default: 1) */
  quantity?: number;
  /** Customer email for guest checkout (optional if authenticated) */
  customer_email?: string;
  /** Custom metadata to attach to the payment */
  metadata?: Record<string, string>;
}

// ============================================================================
// PRODUCTS CHECKOUT (Multiple Items - Cart)
// ============================================================================

/**
 * Line item for multi-product checkout
 */
export interface CheckoutLineItem {
  /** Stripe Price ID for the product */
  price_id: string;
  /** Quantity of this item */
  quantity: number;
}

/**
 * Request body for creating a multi-product checkout session (cart checkout)
 * @see POST /api/v1/payments/checkout/products
 */
export interface CreateProductsCheckoutRequest {
  /** Array of items to purchase */
  items: CheckoutLineItem[];
  /** URL to redirect after successful payment */
  success_url: string;
  /** URL to redirect if user cancels checkout */
  cancel_url: string;
  /** Customer email for guest checkout (optional if authenticated) */
  customer_email?: string;
  /** Custom metadata to attach to the payment */
  metadata?: Record<string, string>;
}

// ============================================================================
// CHECKOUT SESSION STATUS
// ============================================================================

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
  /** Customer email from checkout */
  customer_email: string | null;
  /** Total amount in cents */
  amount_total: number;
  /** Currency code (e.g., "usd") */
  currency: string;
}

// ============================================================================
// SUBSCRIPTION ACCESS
// ============================================================================

/**
 * Response from subscription access check endpoint
 * Used for feature gating in the app
 * @see GET /api/v1/payments/access
 */
export interface SubscriptionAccessResponse {
  /** Whether the user has an active subscription */
  has_access: boolean;
  /** Current subscription status (null if no subscription) */
  subscription_status: SubscriptionStatus | null;
  /** When access expires (ISO datetime string, null if no subscription) */
  expires_at: string | null;
  /** Human-readable message about subscription status */
  message: string;
}

// ============================================================================
// SUBSCRIPTION INFO
// ============================================================================

/**
 * Response from subscription info endpoint
 * Detailed information about the user's subscription
 * @see GET /api/v1/payments/subscription
 */
export interface SubscriptionInfoResponse {
  /** Stripe subscription ID */
  subscription_id: string;
  /** Current status of the subscription */
  status: SubscriptionStatus;
  /** Whether the subscription is currently active */
  is_active: boolean;
  /** End of current billing period (ISO datetime string) */
  current_period_end: string;
  /** Whether subscription will cancel at period end */
  cancel_at_period_end: boolean;
  /** Stripe Price ID of the subscribed plan */
  price_id: string;
}

// ============================================================================
// CANCEL SUBSCRIPTION
// ============================================================================

/**
 * Query parameters for cancel subscription endpoint
 * @see POST /api/v1/payments/subscription/cancel
 */
export interface CancelSubscriptionParams {
  /** If true, cancel immediately. If false, cancel at end of billing period */
  cancel_immediately?: boolean;
}

/**
 * Response from cancel subscription endpoint
 * Returns updated subscription info after cancellation
 * @see POST /api/v1/payments/subscription/cancel
 */
export type CancelSubscriptionResponse = SubscriptionInfoResponse;

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
// PRICE IDS (Configuration)
// ============================================================================

/**
 * Configuration type for Stripe Price IDs
 * These should be configured in environment variables
 */
export interface PriceIds {
  // Subscription plans
  pro_monthly: string;
  pro_annual: string;

  // Hardware packages
  booth_essential: string;
  booth_professional: string;
  booth_premium: string;

  // Templates (dynamic based on template)
  templates: Record<string, string>;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Billing interval for subscription plans
 */
export type BillingInterval = "monthly" | "annual";

/**
 * Subscription plan metadata
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_id_monthly: string;
  price_id_annual: string;
  price_monthly: number;
  price_annual: number;
  features: string[];
  highlighted?: boolean;
}

/**
 * Hardware package metadata
 */
export interface HardwarePackage {
  id: string;
  name: string;
  description: string;
  price_id: string;
  price: number;
  features: Array<{ text: string; included: boolean }>;
  highlighted?: boolean;
  badge?: string;
}
