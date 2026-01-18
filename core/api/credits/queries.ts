/**
 * Credits React Query Hooks
 *
 * Hooks for fetching and mutating booth credits.
 *
 * @see https://tanstack.com/query/latest - React Query docs
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import { getBoothCredits, addBoothCredits, getCreditsHistory, deleteCreditsHistory } from "./services";
import type { CreditsHistoryParams, DeleteCreditsHistoryParams } from "./types";

/**
 * Hook to fetch booth credit balance
 *
 * @param boothId - The booth ID to get credits for
 * @returns Query result with credit balance
 *
 * @example
 * const { data, isLoading } = useBoothCredits("booth-123");
 * console.log(data?.credit_balance);
 */
export function useBoothCredits(boothId: string | null) {
	return useQuery({
		queryKey: boothId ? queryKeys.credits.balance(boothId) : ['credits', 'balance', null],
		queryFn: () => getBoothCredits(boothId!),
		enabled: !!boothId,
		staleTime: 0,
		gcTime: 0, // Don't cache - always fetch fresh
		refetchOnMount: 'always',
		refetchOnWindowFocus: 'always',
	});
}

/**
 * Hook to add credits to a booth
 *
 * Automatically invalidates the credits query on success.
 *
 * @returns Mutation for adding credits
 *
 * @example
 * const { mutate } = useAddCredits();
 * mutate({ boothId: "booth-123", amount: 100, reason: "Top-up" });
 */
export function useAddCredits() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			boothId,
			amount,
			reason,
		}: {
			boothId: string;
			amount: number;
			reason?: string;
		}) => addBoothCredits(boothId, { amount, reason }),
		onSuccess: (_, variables) => {
			// Invalidate credits query to refetch the new balance
			queryClient.invalidateQueries({
				queryKey: queryKeys.credits.balance(variables.boothId),
			});
			// Invalidate all history queries for this booth (regardless of pagination params)
			// Using partial key to match all history queries with different params
			queryClient.invalidateQueries({
				queryKey: ['credits', 'history', variables.boothId],
			});
			// Also invalidate booth detail as it may show credit info
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.detail(variables.boothId),
			});
		},
	});
}

/**
 * Hook to fetch credits history with pagination
 *
 * @param boothId - The booth ID to get history for
 * @param params - Pagination params (limit, offset)
 * @returns Query result with paginated history
 *
 * @example
 * const { data, isLoading } = useCreditsHistory("booth-123", { limit: 50 });
 * console.log(data?.transactions);
 */
export function useCreditsHistory(
	boothId: string | null,
	params?: CreditsHistoryParams,
) {
	return useQuery({
		queryKey: boothId
			? queryKeys.credits.history(boothId, params)
			: ['credits', 'history', null, params],
		queryFn: () => getCreditsHistory(boothId!, params),
		enabled: !!boothId,
		staleTime: 0,
		gcTime: 0, // Don't cache - always fetch fresh
		refetchOnMount: 'always',
	});
}

/**
 * Hook to fetch credits history with infinite scroll pagination
 *
 * @param boothId - The booth ID to get history for
 * @param params - Base pagination params (limit)
 * @returns Infinite query result with paginated history
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useCreditsHistoryInfinite("booth-123");
 */
export function useCreditsHistoryInfinite(
	boothId: string | null,
	params?: { limit?: number },
) {
	const limit = params?.limit ?? 20;

	return useInfiniteQuery({
		queryKey: boothId
			? [...queryKeys.credits.history(boothId, { limit }), "infinite"]
			: ['credits', 'history', null, { limit }, 'infinite'],
		queryFn: ({ pageParam }) =>
			getCreditsHistory(boothId!, { limit, offset: pageParam }),
		enabled: !!boothId,
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			// Calculate total items loaded across all pages
			const totalLoaded = allPages.reduce(
				(sum, page) => sum + page.transactions.length,
				0
			);
			// If we've loaded all items, return undefined (no more pages)
			return totalLoaded < lastPage.total ? totalLoaded : undefined;
		},
	});
}

/**
 * Hook to delete credit history transactions
 *
 * WARNING: This operation cannot be undone!
 *
 * @returns Mutation for deleting credit history
 *
 * @example
 * const { mutate } = useDeleteCreditsHistory();
 * mutate({ boothId: "booth-123", params: { transaction_id: "tx-456" } });
 */
export function useDeleteCreditsHistory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			boothId,
			params,
		}: {
			boothId: string;
			params?: DeleteCreditsHistoryParams;
		}) => deleteCreditsHistory(boothId, params),
		onSuccess: (_, variables) => {
			// Invalidate all history queries for this booth
			queryClient.invalidateQueries({
				queryKey: ['credits', 'history', variables.boothId],
			});
			// Also invalidate credits balance as it may have changed
			queryClient.invalidateQueries({
				queryKey: queryKeys.credits.balance(variables.boothId),
			});
		},
	});
}

