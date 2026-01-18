import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import { getBoothRevenue, getRevenueDashboard } from "./services";
import type {
	BoothRevenueParams,
	BoothRevenueResponse,
	RevenueDashboardParams,
	RevenueDashboardResponse,
} from "./types";

/**
 * Analytics React Query Hooks
 *
 * React Query hooks for analytics data fetching.
 * @see https://tanstack.com/query/latest/docs/react/guides/queries
 */

/**
 * Hook to fetch revenue dashboard data
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error, refetch } = useRevenueDashboard({ recent_limit: 5 });
 *
 * // Access stats
 * console.log(data?.stats.today.amount);
 *
 * // Access chart data
 * data?.daily_chart.forEach(point => console.log(point.date, point.amount));
 * ```
 *
 * @param params - Optional parameters (recent_limit for transactions)
 * @param options - Optional settings (e.g., { enabled: false } to disable query)
 * @returns React Query result with revenue dashboard data
 * @see GET /api/v1/analytics/revenue/dashboard
 */
export function useRevenueDashboard(
	params?: RevenueDashboardParams,
	options?: { enabled?: boolean },
) {
	return useQuery<RevenueDashboardResponse>({
		queryKey: queryKeys.analytics.dashboard(params),
		queryFn: () => getRevenueDashboard(params),
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
		enabled: options?.enabled ?? true,
	});
}

/**
 * Default page size for transactions list
 */
const TRANSACTIONS_PAGE_SIZE = 20;

/**
 * Hook to fetch transactions with infinite scroll pagination
 *
 * Uses the dashboard endpoint with pagination params to load more transactions.
 * React Query's useInfiniteQuery handles caching and pagination state.
 *
 * Usage:
 * ```tsx
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 *   isLoading,
 * } = useTransactionsInfinite();
 *
 * // Flatten all pages into single transactions array
 * const transactions = data?.pages.flatMap(page => page.recent_transactions.data) ?? [];
 *
 * // Load more when user scrolls to bottom
 * if (hasNextPage) fetchNextPage();
 * ```
 *
 * @param pageSize - Number of transactions per page (default: 20)
 * @returns React Query infinite query result
 * @see GET /api/v1/analytics/revenue/dashboard
 */
export function useTransactionsInfinite(pageSize = TRANSACTIONS_PAGE_SIZE) {
	return useInfiniteQuery<RevenueDashboardResponse>({
		queryKey: queryKeys.analytics.transactions(pageSize),
		queryFn: ({ pageParam = 0 }) =>
			getRevenueDashboard({
				recent_limit: pageSize,
				recent_offset: pageParam as number,
			}),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			// Calculate next offset based on pagination info
			const { pagination } = lastPage.recent_transactions;
			if (!pagination.has_more) return undefined;
			return pagination.offset + pagination.limit;
		},
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
	});
}

/**
 * Hook to fetch revenue analytics for a specific booth
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error, refetch } = useBoothRevenue('booth-123');
 *
 * // Access booth-specific stats
 * console.log(data?.booth_name, data?.stats.today.amount);
 *
 * // Access chart data
 * data?.daily_chart.forEach(point => console.log(point.date, point.amount));
 * ```
 *
 * @param boothId - Booth ID to fetch analytics for (null to disable query)
 * @param params - Optional parameters (recent_limit for transactions)
 * @returns React Query result with booth-specific revenue data
 * @see GET /api/v1/analytics/revenue/{booth_id}
 */
export function useBoothRevenue(
	boothId: string | null,
	params?: Omit<BoothRevenueParams, "booth_id">,
) {
	return useQuery<BoothRevenueResponse>({
		queryKey: queryKeys.analytics.boothRevenue(boothId ?? ""),
		queryFn: () =>
			getBoothRevenue({
				booth_id: boothId!,
				...params,
			}),
		// Only run query if boothId is provided
		enabled: !!boothId,
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
	});
}
