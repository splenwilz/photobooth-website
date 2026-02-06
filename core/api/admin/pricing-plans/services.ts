/**
 * Admin Pricing Plans API Services
 *
 * Service functions for admin pricing plans management.
 */

import { apiClient } from "@/core/api/client";
import type { PricingPlansResponse } from "./types";

const ADMIN_PRICING_BASE = "/api/v1/admin/pricing-plans";

/**
 * Fetch all pricing plans (admin view)
 *
 * @returns List of pricing plans
 *
 * @example
 * const plans = await getAdminPricingPlans();
 */
export async function getAdminPricingPlans(): Promise<PricingPlansResponse> {
  return apiClient<PricingPlansResponse>(ADMIN_PRICING_BASE);
}
