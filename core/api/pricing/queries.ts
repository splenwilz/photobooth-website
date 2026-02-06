/**
 * Public Pricing React Query Hooks
 *
 * React Query hooks for public pricing plans and checkout.
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPublicPricingPlans,
  createSubscriptionCheckout,
} from "./services";
import type { CheckoutRequest } from "./types";

/**
 * Query keys for public pricing cache management
 */
export const pricingKeys = {
  all: ["pricing"] as const,
  plans: () => [...pricingKeys.all, "plans"] as const,
};

/**
 * Hook to fetch public pricing plans
 *
 * @returns React Query result with plans list
 *
 * @example
 * const { data, isLoading } = usePricingPlans();
 * data?.plans.forEach(plan => console.log(plan.name, plan.price_display));
 */
export function usePricingPlans() {
  return useQuery({
    queryKey: pricingKeys.plans(),
    queryFn: getPublicPricingPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes - plans don't change often
  });
}

/**
 * Hook to create a subscription checkout session
 *
 * @returns Mutation for creating checkout
 *
 * @example
 * const mutation = useCreateCheckout();
 *
 * mutation.mutate({
 *   boothId: "booth-123",
 *   data: {
 *     price_id: "price_abc123",
 *     success_url: window.location.origin + "/success",
 *     cancel_url: window.location.origin + "/pricing",
 *   },
 * }, {
 *   onSuccess: (data) => {
 *     window.location.href = data.checkout_url;
 *   },
 * });
 */
export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ boothId, data }: { boothId: string; data: CheckoutRequest }) =>
      createSubscriptionCheckout(boothId, data),
  });
}
