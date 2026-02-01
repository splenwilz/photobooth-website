/**
 * Admin Booths React Query Hooks
 *
 * Custom hooks for fetching and caching admin booth data.
 */

import { useQuery } from "@tanstack/react-query";
import { getAdminBooths } from "./services";
import type { AdminBoothsQueryParams } from "./types";

/**
 * Query keys for admin booths
 *
 * Hierarchical key structure for cache invalidation:
 * - all: invalidates everything
 * - lists: invalidates all list queries
 * - list(params): invalidates specific filtered list
 */
export const adminBoothKeys = {
  all: ["admin-booths"] as const,
  lists: () => [...adminBoothKeys.all, "list"] as const,
  list: (params?: AdminBoothsQueryParams) => [...adminBoothKeys.lists(), params] as const,
};

/**
 * Hook to fetch admin booths list with summary and top performers
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with booths data, loading state, and error
 *
 * @example
 * const { data, isLoading, error } = useAdminBooths({ status: "online", page: 1 });
 * if (data) {
 *   console.log(data.summary.total_booths);
 *   console.log(data.booths);
 * }
 */
export function useAdminBooths(params: AdminBoothsQueryParams = {}) {
  return useQuery({
    queryKey: adminBoothKeys.list(params),
    queryFn: () => getAdminBooths(params),
    staleTime: 30 * 1000, // 30 seconds - booth status changes frequently
  });
}
