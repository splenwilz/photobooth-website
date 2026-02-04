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
  revenue_mtd: string;
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
  revenue: string;
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
  revenue_mtd: string;
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

// ============================================================================
// Booth Detail Types
// ============================================================================

/**
 * Extended booth status for detail view
 */
export type AdminBoothDetailStatus = "online" | "offline" | "warning" | "maintenance";

/**
 * Supply level status
 */
export type SupplyStatus = "ok" | "low" | "critical" | "unknown";

/**
 * Resource level status
 */
export type ResourceStatus = "ok" | "low" | "critical" | "high" | "unknown";

/**
 * Booth owner information
 */
export interface BoothOwner {
  id: string;
  name: string | null;
  email: string;
}

/**
 * Booth status details
 */
export interface BoothStatusDetail {
  current: AdminBoothDetailStatus;
  has_error: boolean;
  error_details: string | null;
  last_heartbeat: string | null;
  last_heartbeat_ago: string | null;
  last_sync: string | null;
}

/**
 * Printer hardware details
 */
export interface PrinterHardware {
  status: StatusIconValue;
  name: string | null;
  model: string | null;
  error: string | null;
}

/**
 * Camera hardware details
 */
export interface CameraHardware {
  status: StatusIconValue;
  name: string | null;
  cameras_detected: number | null;
  error: string | null;
}

/**
 * Payment hardware details
 */
export interface PaymentHardware {
  status: StatusIconValue;
  error: string | null;
}

/**
 * All hardware details
 */
export interface BoothHardware {
  printer: PrinterHardware;
  camera: CameraHardware;
  payment: PaymentHardware;
}

/**
 * Supply level information
 */
export interface SupplyLevel {
  current: number;
  total: number;
  percent: number;
  status: SupplyStatus;
}

/**
 * Booth supplies information
 */
export interface BoothSupplies {
  paper: SupplyLevel;
  ribbon: SupplyLevel;
  prints_today: number;
  prints_total: number;
}

/**
 * Disk resource level
 */
export interface DiskLevel {
  total_gb: number | null;
  free_gb: number | null;
  used_percent: number | null;
  status: ResourceStatus;
}

/**
 * Memory resource level
 */
export interface MemoryLevel {
  total_mb: number | null;
  used_mb: number | null;
  used_percent: number | null;
  status: ResourceStatus;
}

/**
 * System resources information
 */
export interface BoothSystem {
  disk: DiskLevel;
  memory: MemoryLevel;
  cpu_percent: number | null;
  app_version: string | null;
  app_uptime_seconds: number | null;
  system_uptime_seconds: number | null;
}

/**
 * Booth subscription information
 */
export interface BoothSubscription {
  id: number;
  tier_name: string | null;
  status: string;
  amount_cents: number | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

/**
 * Booth revenue breakdown (all values in cents)
 */
export interface BoothRevenue {
  today: number;
  week: number;
  month: number;
  previous_month: number;
  month_change_percent: number | null;
  all_time: number;
}

/**
 * Recent transaction
 */
export interface BoothTransaction {
  id: string;
  transaction_code: string;
  product_type: string;
  template_name: string | null;
  quantity: number;
  total_price: number;
  payment_method: string;
  created_at: string;
}

/**
 * Alert severity
 */
export type AlertSeverity = "warning" | "critical";

/**
 * Booth alert
 */
export interface BoothAlert {
  type: string;
  message: string;
  severity: AlertSeverity;
}

/**
 * Response from GET /api/v1/admin/booths/{booth_id}
 */
export interface AdminBoothDetailResponse {
  id: string;
  name: string;
  address: string | null;
  mac_address: string | null;
  created_at: string;
  owner: BoothOwner;
  status: BoothStatusDetail;
  hardware: BoothHardware;
  supplies: BoothSupplies;
  system: BoothSystem;
  subscription: BoothSubscription | null;
  revenue: BoothRevenue;
  recent_transactions: BoothTransaction[];
  alerts: BoothAlert[];
}
