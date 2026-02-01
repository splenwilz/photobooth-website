/**
 * Admin Booths API Module
 *
 * Exports types, services, and React Query hooks for admin booth monitoring.
 *
 * @example
 * import {
 *   useAdminBooths,
 *   type AdminBoothListItem,
 *   type AdminBoothsSummary,
 * } from "@/core/api/admin/booths";
 */

// Types
export type {
  AdminBoothStatus,
  StatusIconValue,
  AdminBoothsSummary,
  AdminTopPerformingBooth,
  BoothStatusIcons,
  AdminBoothListItem,
  AdminBoothsQueryParams,
  AdminBoothsListResponse,
} from "./types";

// Services
export { getAdminBooths, exportBoothsCsv, type ExportBoothsParams } from "./services";

// React Query hooks
export { adminBoothKeys, useAdminBooths } from "./queries";
