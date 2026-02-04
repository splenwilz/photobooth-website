/**
 * Admin Pricing Plans React Query Hooks
 *
 * React Query hooks for admin pricing plans management with caching.
 */

import { useQuery } from "@tanstack/react-query";
import { getAdminPricingPlans } from "./services";

/**
 * Query keys for admin pricing plans cache management
 */
export const adminPricingPlansKeys = {
  all: ["admin-pricing-plans"] as const,
  list: () => [...adminPricingPlansKeys.all, "list"] as const,
};

/**
 * Hook to fetch all pricing plans (admin view)
 *
 * @returns React Query result with plans list
 *
 * @example
 * const { data, isLoading } = useAdminPricingPlans();
 * data?.plans.forEach(plan => console.log(plan.name));
 */
export function useAdminPricingPlans() {
  return useQuery({
    queryKey: adminPricingPlansKeys.list(),
    queryFn: () => getAdminPricingPlans(),
    staleTime: 60 * 1000, // 1 minute
  });
}
