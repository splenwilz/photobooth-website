import { apiClient } from "../client";
import type {
	NotificationEventType,
	NotificationPreferencesResponse,
	UpdatePreferenceRequest,
	UpdatePreferenceResponse,
	BulkUpdatePreferencesRequest,
	BulkUpdatePreferencesResponse,
	NotificationHistoryResponse,
	NotificationHistoryParams,
} from "./types";

/**
 * Notifications API Services
 *
 * Service functions for managing email notification preferences and history.
 * @see https://tanstack.com/query/latest/docs/react/guides/queries
 */

/**
 * Get all notification preferences
 *
 * @returns Promise resolving to all 14 event types with enabled/disabled state
 * @see GET /api/v1/notifications/preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferencesResponse> {
	return apiClient<NotificationPreferencesResponse>(
		"/api/v1/notifications/preferences",
		{ method: "GET" },
	);
}

/**
 * Update a single notification preference
 *
 * @param eventType - The event type to update
 * @param data - The enabled/disabled state
 * @returns Promise resolving to the updated preference
 * @see PUT /api/v1/notifications/preferences/{event_type}
 */
export async function updateNotificationPreference(
	eventType: NotificationEventType,
	data: UpdatePreferenceRequest,
): Promise<UpdatePreferenceResponse> {
	return apiClient<UpdatePreferenceResponse>(
		`/api/v1/notifications/preferences/${eventType}`,
		{ method: "PUT", body: JSON.stringify(data) },
	);
}

/**
 * Bulk update multiple notification preferences
 *
 * @param data - Map of event types to enabled/disabled state
 * @returns Promise resolving to the count of updated preferences
 * @see PUT /api/v1/notifications/preferences
 */
export async function bulkUpdateNotificationPreferences(
	data: BulkUpdatePreferencesRequest,
): Promise<BulkUpdatePreferencesResponse> {
	return apiClient<BulkUpdatePreferencesResponse>(
		"/api/v1/notifications/preferences",
		{ method: "PUT", body: JSON.stringify(data) },
	);
}

/**
 * Get notification history
 *
 * @param params - Optional pagination parameters (limit, offset)
 * @returns Promise resolving to paginated notification history
 * @see GET /api/v1/notifications/history
 */
export async function getNotificationHistory(
	params?: NotificationHistoryParams,
): Promise<NotificationHistoryResponse> {
	const searchParams = new URLSearchParams();
	if (params?.limit !== undefined) searchParams.append("limit", String(params.limit));
	if (params?.offset !== undefined) searchParams.append("offset", String(params.offset));
	const qs = searchParams.toString();

	return apiClient<NotificationHistoryResponse>(
		`/api/v1/notifications/history${qs ? `?${qs}` : ""}`,
		{ method: "GET" },
	);
}
