import { apiClient } from "../client";
import type { AlertsParams, AlertsResponse, BoothAlertsParams } from "./types";

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
 * Get alerts for all booths
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

/**
 * Get alerts for a specific booth
 *
 * @param params - Booth ID (path param) and optional query parameters
 * @returns Promise resolving to alerts response scoped to one booth
 * @see GET /api/v1/analytics/alerts/{booth_id}
 */
export async function getBoothAlerts(
	params: BoothAlertsParams,
): Promise<AlertsResponse> {
	const { booth_id, ...queryParams } = params;
	const queryString = buildQueryString(queryParams as Record<string, unknown>);

	const response = await apiClient<AlertsResponse>(
		`/api/v1/analytics/alerts/${booth_id}${queryString}`,
		{
			method: "GET",
		},
	);
	return response;
}

