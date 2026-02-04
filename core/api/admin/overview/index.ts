/**
 * Admin Overview API Module
 *
 * Exports types, services, and React Query hooks for the admin dashboard overview.
 *
 * @example
 * import {
 *   useAdminOverview,
 *   type AdminOverviewResponse,
 * } from "@/core/api/admin/overview";
 */

// Types
export type {
  TopPerformingBooth,
  PlanRevenue,
  AdminOverviewResponse,
} from "./types";

// Services
export { getAdminOverview } from "./services";

// React Query hooks
export { adminOverviewKeys, useAdminOverview } from "./queries";
