/**
 * Admin Settings API Module
 *
 * Exports types, services, and React Query hooks for admin settings management.
 *
 * @example
 * import {
 *   useAdminSettingsByCategory,
 *   useUpdateSetting,
 *   type AdminSetting,
 *   type SettingCategory,
 * } from "@/core/api/admin/settings";
 */

// Types
export type {
  SettingCategory,
  SettingDataType,
  SettingSecurityLevel,
  SettingValidation,
  AdminSetting,
  AdminSettingCategoryInfo,
  AdminSettingsCategoriesResponse,
  AdminSettingsResponse,
  AdminSettingsByCategoryResponse,
  AdminSettingResponse,
  UpdateSettingRequest,
  BulkUpdateSettingItem,
  BulkUpdateSettingsRequest,
  BulkUpdateSettingsResponse,
  SettingsAuditLogEntry,
  SettingsAuditLogResponse,
  SettingsAuditLogParams,
} from "./types";

// Services
export {
  getSettingsCategories,
  getAllSettings,
  getSettingsByCategory,
  getSetting,
  updateSetting,
  bulkUpdateSettings,
  resetSetting,
  getSettingsAuditLog,
} from "./services";

// React Query hooks
export {
  adminSettingsKeys,
  useAdminSettingsCategories,
  useAdminSettings,
  useAdminSettingsByCategory,
  useAdminSetting,
  useAdminSettingsAuditLog,
  useUpdateSetting,
  useBulkUpdateSettings,
  useResetSetting,
} from "./queries";
