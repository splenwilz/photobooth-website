/**
 * Admin Users API Types
 *
 * Types matching the backend Admin Users API for admin operations.
 */

// User status from backend
export type AdminUserStatus = "active" | "inactive";

// Booth status from backend
export type AdminBoothStatus = "online" | "offline" | "error" | "maintenance";

/**
 * Query parameters for fetching admin users list
 */
export interface AdminUsersQueryParams {
  page?: number;
  per_page?: number;
  status?: "all" | "active" | "inactive";
  search?: string;
  sort_by?: "name" | "email" | "revenue" | "total_booths" | "created_at";
  sort_order?: "asc" | "desc";
}

/**
 * Summary statistics from users list response
 */
export interface AdminUsersSummary {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_revenue: number;
}

/**
 * User item in the paginated list response
 */
export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  status: AdminUserStatus;
  total_booths: number;
  active_booths: number;
  revenue: number;
  created_at: string;
}

/**
 * Paginated users list response
 */
export interface AdminUsersResponse {
  summary: AdminUsersSummary;
  users: AdminUserListItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Booth information within user detail response
 */
export interface AdminUserBooth {
  id: string;
  name: string;
  status: AdminBoothStatus;
  subscription_status: string | null;
  subscription_tier: string | null;
  revenue: number;
  last_heartbeat: string | null;
  created_at: string;
}

/**
 * Detailed user response with booths
 */
export interface AdminUserDetail {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  status: AdminUserStatus;
  total_booths: number;
  active_booths: number;
  total_revenue: number;
  created_at: string;
  booths: AdminUserBooth[];
}
