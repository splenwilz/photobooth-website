/**
 * Admin Billing React Query Hooks
 *
 * React Query hooks for admin billing management with caching.
 */

import { useQuery } from "@tanstack/react-query";
import {
  getAdminBillingOverview,
  getAdminBillingTransactions,
  getAdminBillingIssues,
} from "./services";
import type { AdminTransactionsQueryParams } from "./types";

/**
 * Query keys for admin billing cache management
 */
export const adminBillingKeys = {
  all: ["admin-billing"] as const,
  overview: () => [...adminBillingKeys.all, "overview"] as const,
  transactions: (params?: AdminTransactionsQueryParams) =>
    [...adminBillingKeys.all, "transactions", params] as const,
  issues: () => [...adminBillingKeys.all, "issues"] as const,
};

/**
 * Hook to fetch billing overview with MRR, payment health, and revenue by plan
 *
 * @returns React Query result with billing metrics
 *
 * @example
 * const { data, isLoading } = useAdminBillingOverview();
 *
 * // Access summary
 * console.log(data?.summary.mrr);
 * console.log(data?.summary.active_subscriptions);
 *
 * // Access payment health
 * console.log(data?.payment_health.success_rate);
 *
 * // Access revenue by plan
 * data?.revenue_by_plan.forEach(plan => {
 *   console.log(plan.tier, plan.mrr);
 * });
 */
export function useAdminBillingOverview() {
  return useQuery({
    queryKey: adminBillingKeys.overview(),
    queryFn: getAdminBillingOverview,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch paginated billing transactions
 *
 * @param params - Query parameters for filtering and pagination
 * @returns React Query result with transactions list
 *
 * @example
 * const { data } = useAdminBillingTransactions({
 *   status: "paid",
 *   page: 1,
 *   per_page: 20
 * });
 *
 * data?.transactions.forEach(tx => {
 *   console.log(tx.customer_name, tx.amount, tx.status);
 * });
 */
export function useAdminBillingTransactions(
  params: AdminTransactionsQueryParams = {}
) {
  return useQuery({
    queryKey: adminBillingKeys.transactions(params),
    queryFn: () => getAdminBillingTransactions(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch billing issues requiring attention
 *
 * @returns React Query result with issues list
 *
 * @example
 * const { data } = useAdminBillingIssues();
 *
 * if (data && data.total > 0) {
 *   console.warn(`${data.total} billing issues need attention`);
 * }
 */
export function useAdminBillingIssues() {
  return useQuery({
    queryKey: adminBillingKeys.issues(),
    queryFn: getAdminBillingIssues,
    staleTime: 60 * 1000, // 1 minute
  });
}
