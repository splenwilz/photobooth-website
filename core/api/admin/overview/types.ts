/**
 * Admin Overview API Types
 *
 * TypeScript interfaces for the admin overview endpoint.
 */

/**
 * Top performing booth in the dashboard
 */
export interface TopPerformingBooth {
  rank: number;
  booth_id: string;
  booth_name: string;
  owner_name: string | null;
  /** Revenue in cents - divide by 100 for display */
  revenue: number;
  revenue_change: number | null;
}

/**
 * Revenue breakdown by subscription plan
 */
export interface PlanRevenue {
  plan_name: string;
  subscriber_count: number;
  mrr: number;
}

/**
 * Response from GET /api/v1/admin/overview
 *
 * All monetary values are in cents.
 */
export interface AdminOverviewResponse {
  monthly_revenue: number;
  monthly_revenue_change: number | null;
  active_subscriptions: number;
  trialing_subscriptions: number;
  total_users: number;
  active_users: number;
  total_booths: number;
  online_booths: number;
  offline_booths: number;
  // Null when there's no data to compute a rate yet (e.g. no booths / no
  // payments on a fresh install) — the backend returns null, not 0.
  booth_connectivity_percent: number | null;
  payment_success_rate: number | null;
  active_alerts: number;
  top_performing: TopPerformingBooth[];
  revenue_by_plan: PlanRevenue[];
}
