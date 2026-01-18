import type { Alert as AppAlert } from "@/types/photobooth";
import { mapAlertsApiAlertToAppAlert } from "@/utils/alert-mapping";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import { getAlerts } from "./services";
import type { AlertsParams } from "./types";

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
	alerts: AppAlert[];
}

/**
 * Hook to fetch alerts from API
 *
 * Automatically transforms API alerts (snake_case) to app alerts (camelCase).
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error, refetch } = useAlerts({ severity: 'critical' });
 *
 * // Access alerts (already transformed to app format)
 * data?.alerts.forEach(alert => console.log(alert.title, alert.isRead));
 * ```
 *
 * @param params - Optional parameters (severity, category, limit)
 * @returns React Query result with transformed alerts data
 * @see GET /api/v1/analytics/alerts
 */
export function useAlerts(params?: AlertsParams) {
	return useQuery<TransformedAlertsResponse>({
		queryKey: queryKeys.alerts.list(params),
		queryFn: async () => {
			const response = await getAlerts(params);
			// Transform API alerts to app format
			return {
				alerts: response.alerts.map(mapAlertsApiAlertToAppAlert),
			};
		},
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
	});
}
