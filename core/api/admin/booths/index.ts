/**
 * Admin Booths API Module
 *
 * Exports types, services, and React Query hooks for admin booth monitoring.
 *
 * @example
 * import {
 *   useAdminBooths,
 *   useAdminBoothDetail,
 *   type AdminBoothListItem,
 *   type AdminBoothDetailResponse,
 * } from "@/core/api/admin/booths";
 */

// Types - List
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

// Types - Detail
export type {
  AdminBoothDetailStatus,
  SupplyStatus,
  ResourceStatus,
  AlertSeverity,
  BoothOwner,
  BoothStatusDetail,
  PrinterHardware,
  CameraHardware,
  PaymentHardware,
  BoothHardware,
  SupplyLevel,
  BoothSupplies,
  DiskLevel,
  MemoryLevel,
  BoothSystem,
  BoothSubscription,
  BoothRevenue,
  BoothTransaction,
  BoothAlert,
  AdminBoothDetailResponse,
} from "./types";

// Services
export {
  getAdminBooths,
  getAdminBoothDetail,
  exportBoothsCsv,
  type ExportBoothsParams,
} from "./services";

// React Query hooks
export { adminBoothKeys, useAdminBooths, useAdminBoothDetail } from "./queries";
