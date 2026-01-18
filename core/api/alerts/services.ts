import { apiClient } from "../client";
import type { AlertsParams, AlertsResponse } from "./types";

/**
 * Alerts API Services
 *
 * Service functions for fetching alerts and notifications.
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
 * Get alerts from API
 * Supports filtering by severity, category, and limit.
 *
 * @param params - Optional query parameters (severity, category, limit)
 * @returns Promise resolving to alerts response
 * @see GET /api/v1/analytics/alerts
 */
export async function getAlerts(
	params?: AlertsParams,
): Promise<AlertsResponse> {
	const queryString = buildQueryString(params as Record<string, unknown>);

	const response = await apiClient<AlertsResponse>(
		`/api/v1/analytics/alerts${queryString}`,
		{
			method: "GET",
		},
	);
	return response;
}



