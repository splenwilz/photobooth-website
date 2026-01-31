/**
 * Admin Billing API Module
 *
 * Exports types, services, and React Query hooks for admin billing management.
 *
 * @example
 * import {
 *   useAdminBillingOverview,
 *   useAdminBillingTransactions,
 *   useAdminBillingIssues,
 *   type AdminBillingOverviewResponse,
 *   type AdminTransaction,
 * } from "@/core/api/admin/billing";
 */

// Types
export type {
  AdminBillingSummary,
  AdminPaymentHealth,
  AdminRevenueByPlan,
  AdminBillingOverviewResponse,
  AdminTransactionStatus,
  AdminTransaction,
  AdminTransactionsQueryParams,
  AdminTransactionsResponse,
  AdminBillingIssueStatus,
  AdminBillingIssue,
  AdminBillingIssuesResponse,
} from "./types";

// Services
export {
  getAdminBillingOverview,
  getAdminBillingTransactions,
  getAdminBillingIssues,
} from "./services";

// React Query hooks
export {
  adminBillingKeys,
  useAdminBillingOverview,
  useAdminBillingTransactions,
  useAdminBillingIssues,
} from "./queries";
