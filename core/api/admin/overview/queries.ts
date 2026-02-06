/**
 * Admin Overview React Query Hooks
 *
 * Custom hooks for fetching admin dashboard overview data.
 */

import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "./services";

/**
 * Query keys for admin overview
 */
export const adminOverviewKeys = {
  all: ["admin-overview"] as const,
  data: () => [...adminOverviewKeys.all, "data"] as const,
};

/**
 * Hook to fetch admin dashboard overview data
 *
 * @returns Query result with overview data, loading state, and error
 *
 * @example
 * const { data, isLoading, error } = useAdminOverview();
 * if (data) {
 *   console.log(data.monthly_revenue);
 *   console.log(data.top_performing);
 * }
 */
export function useAdminOverview() {
  return useQuery({
    queryKey: adminOverviewKeys.data(),
    queryFn: () => getAdminOverview(),
    staleTime: 30 * 1000, // 30 seconds - dashboard data refreshes frequently
  });
}
