import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import {
	getNotificationPreferences,
	updateNotificationPreference,
	bulkUpdateNotificationPreferences,
	getNotificationHistory,
} from "./services";
import type {
	NotificationEventType,
	NotificationPreferencesResponse,
	NotificationHistoryResponse,
	NotificationHistoryParams,
	BulkUpdatePreferencesRequest,
} from "./types";

/**
 * Notification React Query Hooks
 *
 * React Query hooks for managing email notification preferences and viewing history.
 * @see https://tanstack.com/query/latest/docs/react/guides/queries
 */

/**
 * Hook to fetch all notification preferences
 *
 * Usage:
 * ```tsx
 * const { data, isLoading } = useNotificationPreferences();
 * data?.preferences.forEach(p => console.log(p.event_type, p.enabled));
 * ```
 *
 * @returns React Query result with preferences list
 * @see GET /api/v1/notifications/preferences
 */
export function useNotificationPreferences() {
	return useQuery<NotificationPreferencesResponse>({
		queryKey: queryKeys.notifications.preferences(),
		queryFn: getNotificationPreferences,
		staleTime: 0,
	});
}

/**
 * Hook to toggle a single notification preference
 *
 * Usage:
 * ```tsx
 * const { mutate: toggle, isPending } = useUpdateNotificationPreference();
 * toggle({ eventType: 'printer_error', enabled: false });
 * ```
 *
 * @returns React Query mutation for single preference update
 * @see PUT /api/v1/notifications/preferences/{event_type}
 */
export function useUpdateNotificationPreference() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ eventType, enabled }: { eventType: NotificationEventType; enabled: boolean }) =>
			updateNotificationPreference(eventType, { enabled }),
		onMutate: async ({ eventType, enabled }) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: queryKeys.notifications.preferences() });

			// Snapshot previous value
			const previous = queryClient.getQueryData<NotificationPreferencesResponse>(
				queryKeys.notifications.preferences(),
			);

			// Optimistically update
			if (previous) {
				queryClient.setQueryData<NotificationPreferencesResponse>(
					queryKeys.notifications.preferences(),
					{
						preferences: previous.preferences.map((p) =>
							p.event_type === eventType ? { ...p, enabled } : p,
						),
					},
				);
			}

			return { previous };
		},
		onError: (_err, _vars, context) => {
			// Revert on error
			if (context?.previous) {
				queryClient.setQueryData(
					queryKeys.notifications.preferences(),
					context.previous,
				);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
		},
	});
}

/**
 * Hook to bulk update multiple notification preferences
 *
 * Usage:
 * ```tsx
 * const { mutate: bulkUpdate, isPending } = useBulkUpdateNotificationPreferences();
 * bulkUpdate({ preferences: { printer_error: false, pcb_error: false } });
 * ```
 *
 * @returns React Query mutation for bulk preference update
 * @see PUT /api/v1/notifications/preferences
 */
export function useBulkUpdateNotificationPreferences() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: BulkUpdatePreferencesRequest) =>
			bulkUpdateNotificationPreferences(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
		},
	});
}

/**
 * Hook to fetch notification history
 *
 * Usage:
 * ```tsx
 * const { data, isLoading } = useNotificationHistory({ limit: 20, offset: 0 });
 * console.log(data?.items, data?.total);
 * ```
 *
 * @param params - Optional pagination parameters (limit, offset)
 * @returns React Query result with paginated history
 * @see GET /api/v1/notifications/history
 */
export function useNotificationHistory(params?: NotificationHistoryParams) {
	return useQuery<NotificationHistoryResponse>({
		queryKey: queryKeys.notifications.history(params),
		queryFn: () => getNotificationHistory(params),
		staleTime: 0,
	});
}
