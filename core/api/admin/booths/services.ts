/**
 * Admin Booths Services
 *
 * API service functions for admin booth management.
 */

import { apiClient } from "@/core/api/client";
import type { AdminBoothsQueryParams, AdminBoothsListResponse } from "./types";

const BASE_URL = "/api/v1/admin/booths";

/**
 * Build query string from parameters object
 */
function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Fetch admin booths list with summary and top performers
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with booths list, summary stats, and top performers
 *
 * @example
 * const { summary, booths, top_performing } = await getAdminBooths({ status: "warning" });
 */
export async function getAdminBooths(
  params: AdminBoothsQueryParams = {}
): Promise<AdminBoothsListResponse> {
  const queryString = buildQueryString(params);
  return apiClient<AdminBoothsListResponse>(`${BASE_URL}${queryString}`);
}

/**
 * Export parameters for CSV download
 */
export interface ExportBoothsParams {
  status?: "all" | "online" | "offline" | "warning";
  search?: string;
}

/**
 * Export booths as CSV file
 *
 * @param params - Filter parameters for export
 * @returns Promise that resolves when download starts
 *
 * @example
 * await exportBoothsCsv({ status: "warning" });
 */
export async function exportBoothsCsv(params: ExportBoothsParams = {}): Promise<void> {
  const queryString = buildQueryString(params);
  const url = `${BASE_URL}/export${queryString}`;

  // Use the proxy with proper URL encoding (proxy handles Authorization)
  const response = await fetch(`/api/proxy?path=${encodeURIComponent(url)}`);

  if (!response.ok) {
    throw new Error(`Export failed: ${response.status} ${response.statusText}`);
  }

  // Get filename from Content-Disposition header or use default
  const contentDisposition = response.headers.get("Content-Disposition");
  const filenameMatch = contentDisposition?.match(/filename=([^;]+)/);
  const filename = filenameMatch?.[1] || `booths_export_${new Date().toISOString().split("T")[0]}.csv`;

  // Download the CSV
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(downloadUrl);
}
