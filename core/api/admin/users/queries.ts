/**
 * Admin Users React Query Hooks
 *
 * React Query hooks for admin user management with caching.
 */

import { useQuery } from "@tanstack/react-query";
import { getAdminUsers, getAdminUserDetail } from "./services";
import type { AdminUsersQueryParams } from "./types";

/**
 * Query keys for admin users cache management
 */
export const adminUserKeys = {
  all: ["admin-users"] as const,
  lists: () => [...adminUserKeys.all, "list"] as const,
  list: (params?: AdminUsersQueryParams) =>
    [...adminUserKeys.lists(), params] as const,
  details: () => [...adminUserKeys.all, "detail"] as const,
  detail: (userId: string) => [...adminUserKeys.details(), userId] as const,
};

/**
 * Hook to fetch paginated admin users with filtering and sorting
 *
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns React Query result with users data
 *
 * @example
 * // Basic usage
 * const { data, isLoading, error } = useAdminUsers();
 *
 * @example
 * // With filters
 * const { data } = useAdminUsers({
 *   status: "active",
 *   search: "john",
 *   sort_by: "revenue",
 *   sort_order: "desc",
 *   page: 1,
 *   per_page: 20
 * });
 *
 * // Access summary stats
 * console.log(data?.summary.total_users);
 *
 * // Access users list
 * data?.users.forEach(user => console.log(user.name));
 */
export function useAdminUsers(params: AdminUsersQueryParams = {}) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => getAdminUsers(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch detailed user information including their booths
 *
 * @param userId - WorkOS user ID
 * @returns React Query result with user details
 *
 * @example
 * const { data: user, isLoading } = useAdminUserDetail("user_01KDJQG1WYWFWAX2SPJ4CY7AFS");
 *
 * // Access user info
 * console.log(user?.name, user?.email);
 *
 * // Access user's booths
 * user?.booths.forEach(booth => {
 *   console.log(booth.name, booth.subscription_tier);
 * });
 */
export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: adminUserKeys.detail(userId),
    queryFn: () => getAdminUserDetail(userId),
    enabled: !!userId, // Only fetch when userId is provided
    staleTime: 60 * 1000, // 1 minute
  });
}
