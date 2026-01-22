/**
 * Stripe Configuration
 *
 * Centralized configuration for Stripe price IDs and checkout settings.
 * Price IDs should be set in environment variables.
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

/**
 * Hardware package price IDs
 */
export const HARDWARE_PRICES = {
  essential: process.env.NEXT_PUBLIC_STRIPE_PRICE_HARDWARE_ESSENTIAL ?? "",
  professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_HARDWARE_PROFESSIONAL ?? "",
  premium: process.env.NEXT_PUBLIC_STRIPE_PRICE_HARDWARE_PREMIUM ?? "",
} as const;

// ============================================================================
// CHECKOUT SETTINGS
// ============================================================================

/**
 * Trial period for Pro subscription (in days)
 */
export const PRO_TRIAL_DAYS = 14;

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

/**
 * Get hardware checkout URLs with package info
 */
export function getHardwareCheckoutUrls(packageName: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return {
    success: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=hardware&package=${packageName}`,
    cancel: `${origin}/pricing#hardware`,
  };
}

// ============================================================================
// PACKAGE METADATA
// ============================================================================

export type HardwarePackageId = "essential" | "professional" | "premium";

/**
 * Hardware packages with their price IDs and metadata
 */
export const HARDWARE_PACKAGES: Record<
  HardwarePackageId,
  {
    name: string;
    priceId: string;
    price: number;
    includesProMonths: number;
  }
> = {
  essential: {
    name: "Essential",
    priceId: HARDWARE_PRICES.essential,
    price: 2499,
    includesProMonths: 3,
  },
  professional: {
    name: "Professional",
    priceId: HARDWARE_PRICES.professional,
    price: 4999,
    includesProMonths: 3,
  },
  premium: {
    name: "Premium",
    priceId: HARDWARE_PRICES.premium,
    price: 7999,
    includesProMonths: 3,
  },
};
