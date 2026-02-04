/**
 * Admin Pricing Plans API Types
 *
 * Types matching the backend Pricing Plans Admin API.
 * Note: Subscriptions are per-booth, not per-account.
 */

/**
 * Billing interval for subscription plans
 */
export type BillingInterval = "month" | "year";

/**
 * Full pricing plan details (admin view)
 */
export interface PricingPlan {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  price_display: string;
  currency: string;
  billing_interval: BillingInterval;
  features: string[];
  stripe_price_id: string | null;
  // Annual billing
  has_annual_option: boolean;
  annual_discount_percent: number | null;
  annual_price_cents: number | null;
  annual_price_display: string | null;
  annual_savings_display: string | null;
  stripe_annual_price_id: string | null;
}

/**
 * Response: List of pricing plans
 */
export interface PricingPlansResponse {
  plans: PricingPlan[];
}
