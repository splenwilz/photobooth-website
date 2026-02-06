/**
 * Admin Settings React Query Hooks
 *
 * React Query hooks for admin settings management with caching.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSettingsCategories,
  getAllSettings,
  getSettingsByCategory,
  getSetting,
  updateSetting,
  bulkUpdateSettings,
  resetSetting,
  getSettingsAuditLog,
} from "./services";
import type {
  SettingCategory,
  SettingsAuditLogParams,
  BulkUpdateSettingItem,
} from "./types";

/**
 * Query keys for admin settings cache management
 */
export const adminSettingsKeys = {
  all: ["admin-settings"] as const,
  categories: () => [...adminSettingsKeys.all, "categories"] as const,
  list: (category?: SettingCategory) =>
    [...adminSettingsKeys.all, "list", category] as const,
  byCategory: (category: SettingCategory) =>
    [...adminSettingsKeys.all, "category", category] as const,
  setting: (category: SettingCategory, key: string) =>
    [...adminSettingsKeys.all, "setting", category, key] as const,
  audit: (params?: SettingsAuditLogParams) =>
    [...adminSettingsKeys.all, "audit", params] as const,
};

/**
 * Hook to fetch list of setting categories
 *
 * @returns React Query result with categories
 *
 * @example
 * const { data, isLoading } = useAdminSettingsCategories();
 * data?.categories.forEach(cat => console.log(cat.name));
 */
export function useAdminSettingsCategories() {
  return useQuery({
    queryKey: adminSettingsKeys.categories(),
    queryFn: getSettingsCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all settings, optionally filtered by category
 *
 * @param category - Optional category filter
 * @returns React Query result with settings list
 *
 * @example
 * const { data } = useAdminSettings();
 * const { data: billing } = useAdminSettings("billing");
 */
export function useAdminSettings(category?: SettingCategory) {
  return useQuery({
    queryKey: adminSettingsKeys.list(category),
    queryFn: () => getAllSettings(category),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch settings for a specific category
 *
 * @param category - Category to fetch
 * @returns React Query result with category settings
 *
 * @example
 * const { data, isLoading } = useAdminSettingsByCategory("operational");
 * data?.settings.forEach(s => console.log(s.name, s.current_value));
 */
export function useAdminSettingsByCategory(category: SettingCategory) {
  return useQuery({
    queryKey: adminSettingsKeys.byCategory(category),
    queryFn: () => getSettingsByCategory(category),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch a specific setting
 *
 * @param category - Setting category
 * @param key - Setting key
 * @returns React Query result with setting details
 *
 * @example
 * const { data } = useAdminSetting("billing", "trial_period_days");
 * console.log(data?.setting.current_value);
 */
export function useAdminSetting(category: SettingCategory, key: string) {
  return useQuery({
    queryKey: adminSettingsKeys.setting(category, key),
    queryFn: () => getSetting(category, key),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch settings audit log
 *
 * @param params - Query params for filtering and pagination
 * @returns React Query result with audit log entries
 *
 * @example
 * const { data } = useAdminSettingsAuditLog({ page: 1, per_page: 20 });
 * data?.entries.forEach(e => console.log(e.setting_key, e.new_value));
 */
export function useAdminSettingsAuditLog(params?: SettingsAuditLogParams) {
  return useQuery({
    queryKey: adminSettingsKeys.audit(params),
    queryFn: () => getSettingsAuditLog(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to update a single setting
 *
 * @returns Mutation for updating a setting
 *
 * @example
 * const mutation = useUpdateSetting();
 *
 * mutation.mutate({
 *   category: "billing",
 *   key: "trial_period_days",
 *   value: 30,
 *   reason: "Extended trial",
 * });
 */
export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      key,
      value,
      reason,
    }: {
      category: SettingCategory;
      key: string;
      value: number | boolean | string;
      reason?: string;
    }) => updateSetting(category, key, value, reason),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.byCategory(variables.category),
      });
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.setting(variables.category, variables.key),
      });
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.list(),
      });
    },
  });
}

/**
 * Hook to bulk update settings in a category
 *
 * @returns Mutation for bulk updating settings
 *
 * @example
 * const mutation = useBulkUpdateSettings();
 *
 * mutation.mutate({
 *   category: "billing",
 *   settings: [
 *     { key: "trial_period_days", value: 30 },
 *     { key: "grace_period_days", value: 14 },
 *   ],
 *   reason: "Q1 promotion",
 * });
 */
export function useBulkUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      settings,
      reason,
    }: {
      category: SettingCategory;
      settings: BulkUpdateSettingItem[];
      reason?: string;
    }) => bulkUpdateSettings(category, settings, reason),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.byCategory(variables.category),
      });
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.list(),
      });
    },
  });
}

/**
 * Hook to reset a setting to its default value
 *
 * @returns Mutation for resetting a setting
 *
 * @example
 * const mutation = useResetSetting();
 *
 * mutation.mutate({
 *   category: "billing",
 *   key: "trial_period_days",
 * });
 */
export function useResetSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      key,
    }: {
      category: SettingCategory;
      key: string;
    }) => resetSetting(category, key),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.byCategory(variables.category),
      });
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.setting(variables.category, variables.key),
      });
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.list(),
      });
    },
  });
}
