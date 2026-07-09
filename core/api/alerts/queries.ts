import type { Alert as AppAlert } from "@/types/photobooth";
import { mapAlertsApiAlertToAppAlert } from "@/utils/alert-mapping";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import { getAlerts, getBoothAlerts, markAllAlertsRead } from "./services";
import type { AlertsParams, AlertsSummary, BoothAlertsParams } from "./types";

/**
 * Alerts React Query Hooks
 *
 * React Query hooks for fetching alerts.
 * @see https://tanstack.com/query/latest/docs/react/guides/queries
 */

/**
 * Transformed alerts response with app Alert types
 */
interface TransformedAlertsResponse {
	summary: AlertsSummary;
	alerts: AppAlert[];
	total: number;
	returned: number;
}

/**
 * Hook to fetch alerts for all booths
 *
 * @param params - Optional parameters (severity, category, limit)
 * @param options - Optional query options (e.g., { enabled: false })
 * @returns React Query result with transformed alerts data
 * @see GET /api/v1/analytics/alerts
 */
export function useAlerts(params?: AlertsParams, options?: { enabled?: boolean }) {
	return useQuery<TransformedAlertsResponse>({
		queryKey: queryKeys.alerts.list(params),
		queryFn: async () => {
			const response = await getAlerts(params);
			return {
				summary: response.summary,
				alerts: response.alerts.map(mapAlertsApiAlertToAppAlert),
				total: response.total,
				returned: response.returned,
			};
		},
		enabled: options?.enabled ?? true,
		staleTime: 0,
	});
}

/**
 * Hook to fetch alerts for a specific booth
 *
 * Only fetches when boothId is provided (enabled: !!boothId).
 *
 * @param boothId - Booth ID or null for all booths
 * @param params - Optional parameters (severity, category, limit)
 * @returns React Query result with transformed alerts data
 * @see GET /api/v1/analytics/alerts/{booth_id}
 */
export function useBoothAlerts(
	boothId: string | null,
	params?: Omit<BoothAlertsParams, "booth_id">,
) {
	return useQuery<TransformedAlertsResponse>({
		queryKey: queryKeys.alerts.booth(boothId ?? "", params),
		queryFn: async () => {
			const response = await getBoothAlerts({
				booth_id: boothId!,
				...params,
			});
			return {
				summary: response.summary,
				alerts: response.alerts.map(mapAlertsApiAlertToAppAlert),
				total: response.total,
				returned: response.returned,
			};
		},
		enabled: !!boothId,
		staleTime: 0,
	});
}

/**
 * Hook to mark all alerts read.
 *
 * Pass a booth id to scope to one booth, or null for every booth. On success we
 * refresh the alerts caches (list + booth, used by the sidebar/bell badge) and
 * the dashboard overview + booth detail, which carry `recent_alerts` shown on
 * the Overview page. Invalidation is scoped to the marked booth to avoid
 * refetching every unrelated booth query on a single-booth mark.
 *
 * @see PATCH /api/v1/analytics/alerts/read-all
 */
export function useMarkAllAlertsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (boothId: string | null) => markAllAlertsRead(boothId),
		onSuccess: (_data, boothId) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all() });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() });
			if (boothId) {
				// Only this booth's detail carries stale recent_alerts.
				queryClient.invalidateQueries({
					queryKey: queryKeys.booths.detail(boothId),
				});
			} else {
				// All booths were marked; refresh every booth's detail so a
				// later-opened booth shows fresh recent_alerts.
				queryClient.invalidateQueries({ queryKey: queryKeys.booths.all() });
			}
		},
	});
}
