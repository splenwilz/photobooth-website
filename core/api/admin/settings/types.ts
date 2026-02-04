/**
 * Admin Settings API Types
 *
 * Types matching the backend Admin Settings API.
 */

/**
 * Setting categories
 */
export type SettingCategory =
  | "operational"
  | "billing"
  | "support"
  | "security"
  | "templates"
  | "notifications";

/**
 * Setting data types
 */
export type SettingDataType = "integer" | "boolean" | "string";

/**
 * Setting security levels
 */
export type SettingSecurityLevel = "public" | "sensitive";

/**
 * Validation constraints for a setting
 */
export interface SettingValidation {
  min?: number;
  max?: number;
  enum?: string[];
  pattern?: string;
}

/**
 * Single setting item
 */
export interface AdminSetting {
  key: string;
  category: SettingCategory;
  name: string;
  data_type: SettingDataType;
  default_value: number | boolean | string;
  current_value: number | boolean | string;
  is_default: boolean;
  description: string;
  security_level: SettingSecurityLevel;
  validation?: SettingValidation;
  updated_at: string | null;
  updated_by: string | null;
}

/**
 * Category information
 */
export interface AdminSettingCategoryInfo {
  category: SettingCategory;
  name: string;
  description: string;
  setting_count: number;
}

/**
 * Response: List of categories
 */
export interface AdminSettingsCategoriesResponse {
  categories: AdminSettingCategoryInfo[];
}

/**
 * Response: All settings list
 */
export interface AdminSettingsResponse {
  settings: AdminSetting[];
  total: number;
}

/**
 * Response: Settings by category
 */
export interface AdminSettingsByCategoryResponse {
  category: SettingCategory;
  name: string;
  description: string;
  settings: AdminSetting[];
}

/**
 * Response: Single setting
 */
export interface AdminSettingResponse {
  setting: AdminSetting;
}

/**
 * Request: Update a single setting
 */
export interface UpdateSettingRequest {
  value: number | boolean | string;
  reason?: string;
}

/**
 * Bulk update item
 */
export interface BulkUpdateSettingItem {
  key: string;
  value: number | boolean | string;
}

/**
 * Request: Bulk update settings in a category
 */
export interface BulkUpdateSettingsRequest {
  settings: BulkUpdateSettingItem[];
  reason?: string;
}

/**
 * Response: Bulk update result
 */
export interface BulkUpdateSettingsResponse {
  updated: AdminSetting[];
  failed: Array<{ key: string; error: string }>;
}

/**
 * Audit log entry
 */
export interface SettingsAuditLogEntry {
  id: number;
  setting_key: string;
  old_value: string | null;
  new_value: string;
  changed_by: string;
  changed_by_email: string;
  changed_at: string;
  reason: string | null;
}

/**
 * Response: Paginated audit log
 */
export interface SettingsAuditLogResponse {
  entries: SettingsAuditLogEntry[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Query params for audit log
 */
export interface SettingsAuditLogParams {
  setting_key?: string;
  page?: number;
  per_page?: number;
}
