/**
 * Admin Pricing Plans API Module
 *
 * Exports types, services, and React Query hooks for admin pricing plans management.
 *
 * @example
 * import {
 *   useAdminPricingPlans,
 *   type PricingPlan,
 * } from "@/core/api/admin/pricing-plans";
 */

// Types
export type {
  BillingInterval,
  PricingPlan,
  PricingPlansResponse,
} from "./types";

// Services
export { getAdminPricingPlans } from "./services";

// React Query hooks
export { adminPricingPlansKeys, useAdminPricingPlans } from "./queries";
