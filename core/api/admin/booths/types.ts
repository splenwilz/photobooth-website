/**
 * Admin Booths Types
 *
 * TypeScript interfaces for the admin booths API endpoints.
 */

/**
 * Booth status type
 */
export type AdminBoothStatus = "online" | "offline" | "warning";

/**
 * Status icon values for hardware components
 */
export type StatusIconValue = "ok" | "warning" | "error" | "unknown";

/**
 * Summary statistics for admin booths dashboard
 */
export interface AdminBoothsSummary {
  total_booths: number;
  online: number;
  offline: number;
  warning: number;
  revenue_mtd: number;
  active_alerts: number;
}

/**
 * Top performing booth item
 */
export interface AdminTopPerformingBooth {
  rank: number;
  id: string;
  name: string;
  owner_name: string | null;
  revenue: number;
  revenue_change_percent: number | null;
}

/**
 * Hardware status icons
 */
export interface BoothStatusIcons {
  camera: StatusIconValue;
  payment: StatusIconValue;
  printer: StatusIconValue;
}

/**
 * Booth list item for admin view
 */
export interface AdminBoothListItem {
  id: string;
  name: string;
  owner_id: string;
  owner_name: string | null;
  address: string | null;
  status: AdminBoothStatus;
  has_error: boolean;
  error_details: string | null;
  last_heartbeat: string | null;
  last_heartbeat_ago: string | null;
  revenue_mtd: number;
  revenue_change_percent: number | null;
  status_icons: BoothStatusIcons;
  paper_percent: number | null;
  ink_percent: number | null;
  alert_count: number;
}

/**
 * Query parameters for listing admin booths
 */
export interface AdminBoothsQueryParams {
  page?: number;
  per_page?: number;
  status?: "all" | AdminBoothStatus;
  search?: string;
}

/**
 * Response from GET /api/v1/admin/booths
 */
export interface AdminBoothsListResponse {
  summary: AdminBoothsSummary;
  top_performing: AdminTopPerformingBooth[];
  booths: AdminBoothListItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
