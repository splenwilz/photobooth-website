/**
 * Public Pricing API Types
 *
 * Types for public-facing pricing plans and checkout.
 * Note: Subscriptions are per-booth, not per-account.
 */

/**
 * Public pricing plan (limited fields for end users)
 */
export interface PublicPricingPlan {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  price_display: string;
  currency: string;
  billing_interval: "month" | "year";
  features: string[];
  stripe_price_id: string;
  // Annual billing options
  has_annual_option: boolean;
  annual_discount_percent: number | null;
  annual_price_cents: number | null;
  annual_price_display: string | null;
  annual_savings_display: string | null;
  stripe_annual_price_id: string | null;
}

/**
 * Response: List of public pricing plans
 */
export interface PublicPlansResponse {
  plans: PublicPricingPlan[];
  /** Global trial period in days (0 = no trial) */
  trial_period_days?: number;
}

/**
 * Request: Create a subscription checkout session for a booth
 */
export interface CheckoutRequest {
  price_id: string;
  booth_id: string;
  success_url: string;
  cancel_url: string;
}

/**
 * Response: Checkout session created
 */
export interface CheckoutResponse {
  success: boolean;
  checkout_url: string;
  session_id: string;
}
