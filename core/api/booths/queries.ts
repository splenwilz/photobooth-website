import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import {
	cancelBoothRestart,
	createBooth,
	deleteBooth,
	generateBoothCode,
	getBoothCredentials,
	getBoothDetail,
	getBoothList,
	getBoothOverview,
	getBoothPricing,
	getDashboardOverview,
	restartBoothApp,
	restartBoothSystem,
	updateBoothPricing,
} from "./services";
import type {
	BoothCredentialsResponse,
	BoothDetailResponse,
	BoothListResponse,
	BoothOverviewResponse,
	BoothPricingResponse,
	CreateBoothRequest,
	DashboardOverviewResponse,
	GenerateCodeResponse,
	RestartRequest,
	UpdatePricingRequest,
} from "./types";

/**
 * Booth React Query Hooks
 *
 * React Query v5 pattern: Returns mutation and queryClient for component-level handling.
 * @see https://tanstack.com/query/latest/docs/react/guides/mutations
 */

/**
 * Hook to create a new booth
 * Invalidates booth list and dashboard queries after successful creation
 *
 * Usage:
 * ```tsx
 * const { mutate: createBooth, isPending, error } = useCreateBooth();
 *
 * createBooth({ name: 'My Booth', address: '123 Mall Street' }, {
 *   onSuccess: (data) => console.log('Created:', data.id),
 * });
 * ```
 *
 * @returns React Query mutation object for booth creation
 */
export function useCreateBooth() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateBoothRequest) => createBooth(data),
		onSuccess: () => {
			// Invalidate booth list to show new booth
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.list(),
			});
			// Invalidate booth overview to update summary
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.all(),
			});
			// Invalidate dashboard overview to update total_booths count
			queryClient.invalidateQueries({
				queryKey: queryKeys.dashboard.overview(),
			});
		},
	});
}

/**
 * Hook to fetch list of all booths for current user
 * Used for booth selection in dashboard and booth list
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error } = useBoothList();
 * console.log(data?.booths, data?.total);
 * ```
 *
 * @returns React Query result with booth list
 * @see GET /api/v1/booths
 */
export function useBoothList() {
	return useQuery<BoothListResponse>({
		queryKey: queryKeys.booths.list(),
		queryFn: getBoothList,
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
	});
}

/**
 * Hook to fetch detailed overview for a single booth
 * Includes revenue, hardware status, system info, and recent alerts
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error } = useBoothDetail('booth-123');
 * console.log(data?.revenue.today, data?.hardware.printer);
 * ```
 *
 * @param boothId - The booth ID to fetch
 * @param options - Optional query options
 * @returns React Query result with booth detail data
 * @see GET /api/v1/booths/{booth_id}/overview
 */
export function useBoothDetail(boothId: string | null) {
	return useQuery<BoothDetailResponse>({
		queryKey: boothId ? queryKeys.booths.detail(boothId) : ['booths', 'detail', null],
		queryFn: () => getBoothDetail(boothId!),
		// Only run query if boothId is provided
		enabled: !!boothId,
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
	});
}

/**
 * Hook to fetch booth overview with summary and all booths (aggregated view)
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error, refetch } = useBoothOverview();
 *
 * // Access summary stats
 * console.log(data?.summary.total_booths);
 *
 * // Access individual booths
 * data?.booths.forEach(booth => console.log(booth.booth_name));
 * ```
 *
 * @returns React Query result with booth overview data
 * @see GET /api/v1/booths/overview
 */
export function useBoothOverview() {
	return useQuery<BoothOverviewResponse>({
		queryKey: queryKeys.booths.all(),
		queryFn: getBoothOverview,
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
	});
}

/**
 * Hook to fetch dashboard overview with aggregated stats across all booths
 * Includes summary counts, revenue by period, payment breakdown, hardware summary, and alerts
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error, refetch } = useDashboardOverview();
 *
 * // Access summary
 * console.log(data?.summary.total_booths, data?.summary.online_count);
 *
 * // Access revenue by period
 * console.log(data?.revenue.today.amount, data?.revenue.week.amount);
 *
 * // Access payment breakdown by period
 * console.log(data?.payment_breakdown.today.cash, data?.payment_breakdown.today.card);
 *
 * // Access hardware summary
 * console.log(data?.hardware_summary.printers.online);
 *
 * // Access recent alerts
 * data?.recent_alerts.forEach(alert => console.log(alert.title));
 * ```
 *
 * @param options - Optional settings (e.g., { enabled: false } to disable query)
 * @returns React Query result with dashboard overview data
 * @see GET /api/v1/booths/overview/all
 */
export function useDashboardOverview(options?: { enabled?: boolean }) {
	return useQuery<DashboardOverviewResponse>({
		queryKey: queryKeys.dashboard.overview(),
		queryFn: getDashboardOverview,
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
		enabled: options?.enabled ?? true,
	});
}

/**
 * Hook to fetch booth pricing
 * Gets current product prices for a booth
 *
 * Usage:
 * ```tsx
 * const { data, isLoading } = useBoothPricing('booth-123');
 * console.log(data?.pricing.PhotoStrips.price);
 * ```
 *
 * @param boothId - The booth ID to fetch pricing for
 * @returns React Query result with pricing data
 * @see GET /api/v1/booths/{booth_id}/pricing
 */
export function useBoothPricing(boothId: string | null) {
	return useQuery<BoothPricingResponse>({
		queryKey: boothId ? queryKeys.booths.pricing(boothId) : ['booths', 'pricing', null],
		queryFn: () => getBoothPricing(boothId!),
		enabled: !!boothId,
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
	});
}

/**
 * Hook to update booth pricing
 * Sends pricing command to booth via WebSocket
 *
 * Usage:
 * ```tsx
 * const { mutate: updatePricing, isPending } = useUpdatePricing();
 *
 * updatePricing({
 *   boothId: 'booth-123',
 *   photo_strips_price: 15,
 *   photo_4x6_price: 16,
 *   reason: 'Price adjustment'
 * }, {
 *   onSuccess: (data) => console.log('Updated:', data.status),
 * });
 * ```
 *
 * @returns React Query mutation for pricing updates
 * @see PUT /api/v1/booths/{booth_id}/pricing
 */
export function useUpdatePricing() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			boothId,
			...pricingData
		}: { boothId: string } & UpdatePricingRequest) =>
			updateBoothPricing(boothId, pricingData),
		onSuccess: (_, variables) => {
			// Invalidate pricing query to refresh prices
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.pricing(variables.boothId),
			});
			// Invalidate booth detail to refresh pricing info
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.detail(variables.boothId),
			});
		},
	});
}

// ============================================================================
// RESTART HOOKS
// ============================================================================

/**
 * Hook to restart the booth application
 *
 * Usage:
 * ```tsx
 * const { mutate: restartApp, isPending } = useRestartBoothApp();
 * restartApp({ boothId: 'booth-123', delay_seconds: 5 });
 * ```
 *
 * @returns React Query mutation for app restart
 * @see POST /api/v1/booths/{booth_id}/restart-app
 */
export function useRestartBoothApp() {
	return useMutation({
		mutationFn: ({
			boothId,
			...restartData
		}: { boothId: string } & RestartRequest) =>
			restartBoothApp(boothId, restartData),
	});
}

/**
 * Hook to restart the booth system (PC reboot)
 *
 * Usage:
 * ```tsx
 * const { mutate: restartSystem, isPending } = useRestartBoothSystem();
 * restartSystem({ boothId: 'booth-123', delay_seconds: 15 });
 * ```
 *
 * @returns React Query mutation for system restart
 * @see POST /api/v1/booths/{booth_id}/restart-system
 */
export function useRestartBoothSystem() {
	return useMutation({
		mutationFn: ({
			boothId,
			...restartData
		}: { boothId: string } & RestartRequest) =>
			restartBoothSystem(boothId, restartData),
	});
}

/**
 * Hook to cancel a pending restart command
 *
 * Usage:
 * ```tsx
 * const { mutate: cancelRestart, isPending } = useCancelBoothRestart();
 * cancelRestart({ boothId: 'booth-123' });
 * ```
 *
 * @returns React Query mutation for cancel restart
 * @see POST /api/v1/booths/{booth_id}/cancel-restart
 */
export function useCancelBoothRestart() {
	return useMutation({
		mutationFn: ({ boothId }: { boothId: string }) =>
			cancelBoothRestart(boothId),
	});
}

// ============================================================================
// BOOTH CREDENTIALS HOOKS
// ============================================================================

/**
 * Hook to fetch booth credentials (API key and QR code)
 * Used for viewing connection details and reconnecting a booth
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, refetch } = useBoothCredentials('booth-123');
 * console.log(data?.api_key, data?.qr_code);
 * ```
 *
 * @param boothId - The booth ID to get credentials for
 * @returns React Query result with credentials data
 * @see GET /api/v1/booths/{booth_id}/credentials
 */
export function useBoothCredentials(boothId: string | null) {
	return useQuery<BoothCredentialsResponse>({
		queryKey: boothId ? queryKeys.booths.credentials(boothId) : ['booths', 'credentials', null],
		queryFn: () => getBoothCredentials(boothId!),
		enabled: !!boothId,
		// TEMPORARY: Disabled staleTime for fresh data
		staleTime: 0,
	});
}

/**
 * Hook to generate a new registration code for a booth
 * Code is 6-character alphanumeric, valid for 15 minutes, one-time use
 * Easier for users to enter on booth touchscreen than scanning QR codes
 *
 * Usage:
 * ```tsx
 * const { mutate: generateCode, isPending } = useGenerateBoothCode();
 *
 * generateCode({ boothId: 'booth-123' }, {
 *   onSuccess: (data) => {
 *     console.log('Code:', data.code, 'Expires:', data.expires_at);
 *   },
 * });
 * ```
 *
 * @returns React Query mutation for code generation
 * @see POST /api/v1/booths/{booth_id}/generate-code
 */
export function useGenerateBoothCode() {
	const queryClient = useQueryClient();

	return useMutation<GenerateCodeResponse, Error, { boothId: string }>({
		mutationFn: ({ boothId }) => generateBoothCode(boothId),
		onSuccess: (data, variables) => {
			// Invalidate credentials to show new code
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.credentials(variables.boothId),
			});
		},
	});
}

// ============================================================================
// DELETE BOOTH HOOKS
// ============================================================================

/**
 * Hook to delete a booth permanently
 * Invalidates booth list and clears related caches after deletion
 *
 * Usage:
 * ```tsx
 * const { mutate: deleteBooth, isPending } = useDeleteBooth();
 *
 * deleteBooth({ boothId: 'booth-123' }, {
 *   onSuccess: () => {
 *     alert('Booth deleted successfully');
 *     router.back();
 *   },
 * });
 * ```
 *
 * @returns React Query mutation for booth deletion
 * @see DELETE /api/v1/booths/{booth_id}
 */
export function useDeleteBooth() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boothId }: { boothId: string }) => deleteBooth(boothId),
		onSuccess: (_, variables) => {
			// Invalidate booth list to remove deleted booth
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.list(),
			});
			// Invalidate all booths overview
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.all(),
			});
			// Invalidate dashboard overview
			queryClient.invalidateQueries({
				queryKey: queryKeys.dashboard.overview(),
			});
			// Remove detail cache for deleted booth
			queryClient.removeQueries({
				queryKey: queryKeys.booths.detail(variables.boothId),
			});
			// Remove credentials cache for deleted booth
			queryClient.removeQueries({
				queryKey: queryKeys.booths.credentials(variables.boothId),
			});
		},
	});
}
