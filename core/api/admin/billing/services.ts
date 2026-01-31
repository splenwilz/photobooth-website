/**
 * Admin Billing API Services
 *
 * Service functions for admin billing management.
 */

import { apiClient } from "@/core/api/client";
import type {
  AdminBillingOverviewResponse,
  AdminTransactionsResponse,
  AdminTransactionsQueryParams,
  AdminBillingIssuesResponse,
} from "./types";

const ADMIN_BILLING_BASE = "/api/v1/admin/billing";

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
 * Fetch billing overview with MRR, payment health, and revenue by plan
 *
 * @returns Billing metrics and statistics
 *
 * @example
 * const overview = await getAdminBillingOverview();
 * console.log(overview.summary.mrr); // Monthly recurring revenue
 * console.log(overview.payment_health.success_rate); // Payment success rate
 */
export async function getAdminBillingOverview(): Promise<AdminBillingOverviewResponse> {
  return apiClient<AdminBillingOverviewResponse>(ADMIN_BILLING_BASE);
}

/**
 * Fetch paginated list of billing transactions
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated transactions list
 *
 * @example
 * const transactions = await getAdminBillingTransactions({
 *   status: "paid",
 *   page: 1,
 *   per_page: 20
 * });
 */
export async function getAdminBillingTransactions(
  params: AdminTransactionsQueryParams = {}
): Promise<AdminTransactionsResponse> {
  const queryString = buildQueryString(params);
  return apiClient<AdminTransactionsResponse>(
    `${ADMIN_BILLING_BASE}/transactions${queryString}`
  );
}

/**
 * Fetch billing issues requiring attention
 *
 * @returns List of invoices with payment issues
 *
 * @example
 * const issues = await getAdminBillingIssues();
 * if (issues.total > 0) {
 *   console.warn(`${issues.total} billing issues need attention`);
 * }
 */
export async function getAdminBillingIssues(): Promise<AdminBillingIssuesResponse> {
  return apiClient<AdminBillingIssuesResponse>(`${ADMIN_BILLING_BASE}/issues`);
}
