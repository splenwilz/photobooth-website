import { apiClient } from "../client";
import type {
	BoothRevenueParams,
	BoothRevenueResponse,
	RevenueDashboardParams,
	RevenueDashboardResponse,
} from "./types";

/**
 * Analytics API Services
 *
 * Service functions for analytics and revenue data.
 * @see https://tanstack.com/query/latest/docs/react/guides/queries
 */

/**
 * Build query string from params object
 * Filters out undefined values
 */
function buildQueryString(params?: Record<string, unknown>): string {
	if (!params) return "";

	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			searchParams.append(key, String(value));
		}
	});

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
}

/**
 * Get revenue dashboard data (aggregated across all booths)
 * Includes stats, breakdowns, charts, and recent transactions with pagination.
 *
 * @param params - Optional query parameters (recent_limit, recent_offset)
 * @returns Promise resolving to complete revenue dashboard data
 * @see GET /api/v1/analytics/revenue/dashboard
 */
export async function getRevenueDashboard(
	params?: RevenueDashboardParams,
): Promise<RevenueDashboardResponse> {
	const queryString = buildQueryString(params as Record<string, unknown>);

	const response = await apiClient<RevenueDashboardResponse>(
		`/api/v1/analytics/revenue/dashboard${queryString}`,
		{
			method: "GET",
		},
	);
	return response;
}

/**
 * Get revenue analytics for a specific booth
 * Includes stats, breakdowns, charts, and recent transactions for that booth.
 *
 * @param params - Booth ID and optional query parameters (recent_limit, recent_offset)
 * @returns Promise resolving to booth-specific revenue data
 * @see GET /api/v1/analytics/revenue/{booth_id}
 */
export async function getBoothRevenue(
	params: BoothRevenueParams,
): Promise<BoothRevenueResponse> {
	const { booth_id, ...queryParams } = params;
	const queryString = buildQueryString(queryParams as Record<string, unknown>);

	const response = await apiClient<BoothRevenueResponse>(
		`/api/v1/analytics/revenue/${booth_id}${queryString}`,
		{
			method: "GET",
		},
	);
	return response;
}

