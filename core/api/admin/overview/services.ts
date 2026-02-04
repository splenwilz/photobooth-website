/**
 * Admin Overview API Services
 *
 * Service functions for the admin dashboard overview endpoint.
 */

import { apiClient } from "@/core/api/client";
import type { AdminOverviewResponse } from "./types";

/**
 * Fetch admin dashboard overview data
 *
 * Returns all metrics needed for the admin dashboard in a single API call.
 *
 * @returns Promise with overview data including metrics, top booths, and revenue breakdown
 *
 * @example
 * const overview = await getAdminOverview();
 * console.log(overview.monthly_revenue); // in cents
 */
export async function getAdminOverview(): Promise<AdminOverviewResponse> {
  return apiClient<AdminOverviewResponse>("/api/v1/admin/overview");
}
