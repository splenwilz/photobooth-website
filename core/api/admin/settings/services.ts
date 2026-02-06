/**
 * Admin Settings API Services
 *
 * Service functions for admin settings management.
 */

import { apiClient } from "@/core/api/client";
import type {
  SettingCategory,
  AdminSettingsCategoriesResponse,
  AdminSettingsResponse,
  AdminSettingsByCategoryResponse,
  AdminSettingResponse,
  BulkUpdateSettingItem,
  BulkUpdateSettingsResponse,
  SettingsAuditLogResponse,
  SettingsAuditLogParams,
} from "./types";

const ADMIN_SETTINGS_BASE = "/api/v1/admin/settings";

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
 * Fetch list of setting categories
 *
 * @returns List of categories with setting counts
 *
 * @example
 * const categories = await getSettingsCategories();
 * categories.categories.forEach(cat => {
 *   console.log(cat.name, cat.setting_count);
 * });
 */
export async function getSettingsCategories(): Promise<AdminSettingsCategoriesResponse> {
  return apiClient<AdminSettingsCategoriesResponse>(
    `${ADMIN_SETTINGS_BASE}/categories`
  );
}

/**
 * Fetch all settings, optionally filtered by category
 *
 * @param category - Optional category filter
 * @returns List of all settings
 *
 * @example
 * const allSettings = await getAllSettings();
 * const billingSettings = await getAllSettings("billing");
 */
export async function getAllSettings(
  category?: SettingCategory
): Promise<AdminSettingsResponse> {
  const queryString = category ? `?category=${category}` : "";
  return apiClient<AdminSettingsResponse>(
    `${ADMIN_SETTINGS_BASE}${queryString}`
  );
}

/**
 * Fetch settings for a specific category
 *
 * @param category - Category to fetch
 * @returns Category info with settings list
 *
 * @example
 * const billing = await getSettingsByCategory("billing");
 * console.log(billing.name, billing.settings.length);
 */
export async function getSettingsByCategory(
  category: SettingCategory
): Promise<AdminSettingsByCategoryResponse> {
  return apiClient<AdminSettingsByCategoryResponse>(
    `${ADMIN_SETTINGS_BASE}/${category}`
  );
}

/**
 * Fetch a specific setting by category and key
 *
 * @param category - Setting category
 * @param key - Setting key (without category prefix)
 * @returns Single setting details
 *
 * @example
 * const setting = await getSetting("billing", "trial_period_days");
 * console.log(setting.setting.current_value);
 */
export async function getSetting(
  category: SettingCategory,
  key: string
): Promise<AdminSettingResponse> {
  return apiClient<AdminSettingResponse>(
    `${ADMIN_SETTINGS_BASE}/${category}/${encodeURIComponent(key)}`
  );
}

/**
 * Update a single setting
 *
 * @param category - Setting category
 * @param key - Setting key
 * @param value - New value
 * @param reason - Optional reason for the change
 * @returns Updated setting
 *
 * @example
 * const updated = await updateSetting(
 *   "billing",
 *   "trial_period_days",
 *   30,
 *   "Extended trial for Q1 promotion"
 * );
 */
export async function updateSetting(
  category: SettingCategory,
  key: string,
  value: number | boolean | string,
  reason?: string
): Promise<AdminSettingResponse> {
  return apiClient<AdminSettingResponse>(
    `${ADMIN_SETTINGS_BASE}/${category}/${encodeURIComponent(key)}`,
    {
      method: "PUT",
      body: JSON.stringify({ value, reason }),
    }
  );
}

/**
 * Bulk update multiple settings in a category
 *
 * @param category - Category to update
 * @param settings - Array of settings to update
 * @param reason - Optional reason for the changes
 * @returns Result with updated settings and any failures
 *
 * @example
 * const result = await bulkUpdateSettings("billing", [
 *   { key: "trial_period_days", value: 30 },
 *   { key: "grace_period_days", value: 14 },
 * ], "Updated for Q1 promotion");
 */
export async function bulkUpdateSettings(
  category: SettingCategory,
  settings: BulkUpdateSettingItem[],
  reason?: string
): Promise<BulkUpdateSettingsResponse> {
  return apiClient<BulkUpdateSettingsResponse>(
    `${ADMIN_SETTINGS_BASE}/${category}`,
    {
      method: "PUT",
      body: JSON.stringify({ settings, reason }),
    }
  );
}

/**
 * Reset a setting to its default value
 *
 * @param category - Setting category
 * @param key - Setting key
 * @returns Setting with default value restored
 *
 * @example
 * const reset = await resetSetting("billing", "trial_period_days");
 * console.log(reset.setting.current_value); // Default value
 */
export async function resetSetting(
  category: SettingCategory,
  key: string
): Promise<AdminSettingResponse> {
  return apiClient<AdminSettingResponse>(
    `${ADMIN_SETTINGS_BASE}/reset/${category}/${encodeURIComponent(key)}`,
    {
      method: "POST",
    }
  );
}

/**
 * Fetch settings audit log
 *
 * @param params - Query params for filtering and pagination
 * @returns Paginated audit log entries
 *
 * @example
 * const audit = await getSettingsAuditLog({
 *   setting_key: "billing.trial_period_days",
 *   page: 1,
 *   per_page: 20,
 * });
 */
export async function getSettingsAuditLog(
  params: SettingsAuditLogParams = {}
): Promise<SettingsAuditLogResponse> {
  const queryString = buildQueryString(params);
  return apiClient<SettingsAuditLogResponse>(
    `${ADMIN_SETTINGS_BASE}/audit${queryString}`
  );
}
