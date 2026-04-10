/**
 * Stripe Configuration
 *
 * Centralized configuration for Stripe price IDs and checkout settings.
 * Price IDs should be set in environment variables.
 *
 * Note: hardware packages and free trial constants used to live in this
 * file. Both features were removed at the client's request — booths are
 * now sold exclusively on the BoothWorks website, and there is no free
 * trial. If you need a trial period in the future, configure it via the
 * admin settings UI (`billing.trial_period_days`) instead of hardcoding
 * a constant here.
 */

// ============================================================================
// PRICE IDS
// ============================================================================

/**
 * Software subscription price IDs
 */
export const SUBSCRIPTION_PRICES = {
  pro: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? "",
    annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL ?? "",
  },
} as const;

// ============================================================================
// CHECKOUT URLS
// ============================================================================

/**
 * Get checkout URLs based on current origin
 */
export function getCheckoutUrls() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return {
    success: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel: `${origin}/pricing`,
  };
}
