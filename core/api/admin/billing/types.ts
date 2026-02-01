/**
 * Admin Billing API Types
 *
 * Types matching the backend Admin Billing API.
 */

/**
 * Billing summary metrics
 */
export interface AdminBillingSummary {
  mrr: number;
  mrr_change_percent: number;
  arr: number;
  active_subscriptions: number;
  trialing_subscriptions: number;
  churn_rate: number;
}

/**
 * Payment health statistics for a period
 */
export interface AdminPaymentHealth {
  successful: number;
  success_rate: number;
  failed: number;
  pending: number;
  recovered: number;
  period_days: number;
}

/**
 * Revenue breakdown by subscription tier
 */
export interface AdminRevenueByPlan {
  tier: string;
  count: number;
  mrr: number;
}

/**
 * Full billing overview response
 */
export interface AdminBillingOverviewResponse {
  summary: AdminBillingSummary;
  payment_health: AdminPaymentHealth;
  revenue_by_plan: AdminRevenueByPlan[];
  total_mrr: number;
}

/**
 * Transaction/invoice status
 */
export type AdminTransactionStatus = "paid" | "open" | "void" | "uncollectible";

/**
 * Transaction/invoice item
 */
export interface AdminTransaction {
  id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  status: AdminTransactionStatus;
  created_at: string;
}

/**
 * Query parameters for transactions list
 */
export interface AdminTransactionsQueryParams {
  page?: number;
  per_page?: number;
  status?: "all" | "paid" | "failed" | "pending";
}

/**
 * Paginated transactions response
 */
export interface AdminTransactionsResponse {
  transactions: AdminTransaction[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Billing issue status
 */
export type AdminBillingIssueStatus = "open" | "uncollectible";

/**
 * Billing issue item (invoice requiring attention)
 */
export interface AdminBillingIssue {
  id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  status: AdminBillingIssueStatus;
  attempt_count: number;
  created_at: string;
}

/**
 * Billing issues response
 */
export interface AdminBillingIssuesResponse {
  issues: AdminBillingIssue[];
  total: number;
}
