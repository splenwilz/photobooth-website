/**
 * Admin Users API Services
 *
 * Service functions for admin user management.
 */

import { apiClient } from "@/core/api/client";
import type {
  AdminUsersResponse,
  AdminUsersQueryParams,
  AdminUserDetail,
} from "./types";

const ADMIN_USERS_BASE = "/api/v1/admin/users";

/**
 * Build query string from params object
 */
function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Fetch paginated list of admin users with summary statistics
 *
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Paginated users list with summary stats
 *
 * @example
 * // Get active users sorted by revenue
 * const response = await getAdminUsers({
 *   status: "active",
 *   sort_by: "revenue",
 *   sort_order: "desc",
 *   page: 1,
 *   per_page: 20
 * });
 */
export async function getAdminUsers(
  params: AdminUsersQueryParams = {}
): Promise<AdminUsersResponse> {
  const queryString = buildQueryString(params);
  return apiClient<AdminUsersResponse>(`${ADMIN_USERS_BASE}${queryString}`);
}

/**
 * Fetch detailed information for a specific user including their booths
 *
 * @param userId - WorkOS user ID
 * @returns User details with list of booths
 *
 * @example
 * const user = await getAdminUserDetail("user_01KDJQG1WYWFWAX2SPJ4CY7AFS");
 * console.log(user.booths); // Array of booth details
 */
export async function getAdminUserDetail(
  userId: string
): Promise<AdminUserDetail> {
  return apiClient<AdminUserDetail>(`${ADMIN_USERS_BASE}/${userId}`);
}
