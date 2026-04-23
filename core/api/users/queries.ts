import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import {
	deleteAccountLogo,
	getUserProfile,
	updateBusinessName,
	uploadAccountLogo,
} from "./services";
import type { UpdateBusinessNameRequest, UserProfileResponse } from "./types";

/**
 * User Profile React Query Hooks
 *
 * Hooks for account-level business settings (business name, logo, display-name override).
 * Mutations invalidate the user profile AND all booth-level caches that depend on it,
 * since business_name and use_display_name_on_booths cascade to every booth's
 * effective business-settings response.
 */

/**
 * Fetch user profile including business_name, logo_url, use_display_name_on_booths.
 * @see GET /api/v1/users/{user_id}
 */
export function useUserProfile(userId: string | null) {
	return useQuery<UserProfileResponse>({
		queryKey: userId
			? queryKeys.user.profile(userId)
			: ["user", "profile", null],
		queryFn: () => getUserProfile(userId!),
		enabled: !!userId,
		staleTime: 0,
	});
}

/**
 * Update account-level business settings.
 * Invalidates user profile + all booth caches (overview/list/businessSettings)
 * because the account fields cascade to every booth's effective view.
 * @see PATCH /api/v1/users/{user_id}
 */
export function useUpdateBusinessName() {
	const queryClient = useQueryClient();

	return useMutation<
		UserProfileResponse,
		Error,
		{ userId: string } & UpdateBusinessNameRequest
	>({
		mutationFn: ({ userId, ...data }) => updateBusinessName(userId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.user.profile(variables.userId),
			});
			// booths.all() prefix-matches list/detail/overview/businessSettings/etc.
			// All of those can reflect account-level fields when
			// use_display_name_on_booths is on, so blow them all away.
			queryClient.invalidateQueries({ queryKey: queryKeys.booths.all() });
		},
	});
}

/**
 * Upload or replace the account logo.
 * @see PUT /api/v1/users/{user_id}/logo
 */
export function useUploadAccountLogo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, file }: { userId: string; file: File }) =>
			uploadAccountLogo(userId, file),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.user.profile(variables.userId),
			});
			// Booths using the account logo now need fresh presigned URLs
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.all(),
			});
		},
	});
}

/**
 * Remove the account logo.
 * @see DELETE /api/v1/users/{user_id}/logo
 */
export function useDeleteAccountLogo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId }: { userId: string }) => deleteAccountLogo(userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.user.profile(variables.userId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.booths.all(),
			});
		},
	});
}
