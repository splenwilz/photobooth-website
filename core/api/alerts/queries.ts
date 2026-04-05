import type { Alert as AppAlert } from "@/types/photobooth";
import { mapAlertsApiAlertToAppAlert } from "@/utils/alert-mapping";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import { getAlerts, getBoothAlerts } from "./services";
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
