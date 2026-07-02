import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TOUR_STORAGE_KEYS } from "@/components/tour/tour-steps";
import { queryKeys } from "../utils/query-keys";
import {
	deleteAccount,
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
 * Permanently delete the current user's account, then tear down the session.
 *
 * The full teardown lives here in the mutation's own `onSuccess` (not in a
 * `mutate(..., { onSuccess })` call-site callback) on purpose: React Query only
 * runs call-site callbacks if the calling component is still mounted when the
 * mutation settles. The delete modal can unmount mid-flight (Escape/close), so
 * putting the sign-out + redirect here guarantees they always run once the
 * server confirms the delete — otherwise we could delete the account server
 * side yet leave a live browser session pointing at a deleted user.
 *
 * Teardown order (each step matters):
 *  1. Clear auth cookies (POST /api/auth/logout) FIRST, so the cache wipe below
 *     can't trigger a refetch that still carries a valid token.
 *  2. Clear non-auth localStorage tied to the old account (onboarding/tour
 *     flags) so a different account signing in on this browser starts fresh.
 *  3. Wipe the React Query cache — every entry now refers to a deleted user.
 *  4. Hard-redirect to /signin. A full navigation is required: there is no
 *     middleware guard, and it also discards any in-flight requests / state.
 *
 * On failure nothing is torn down and the session is left intact.
 * @see DELETE /api/v1/users/{user_id}
 */
export function useDeleteAccount() {
	const queryClient = useQueryClient();

	return useMutation<void, Error, { userId: string }>({
		mutationFn: ({ userId }) => deleteAccount(userId),
		onSuccess: async () => {
			try {
				await fetch("/api/auth/logout", { method: "POST" });
			} catch {
				// The account (and its tokens) are already gone server-side, so a
				// logout failure is inconsequential — press on with teardown.
			}
			if (typeof window !== "undefined") {
				try {
					for (const key of Object.values(TOUR_STORAGE_KEYS)) {
						localStorage.removeItem(key);
					}
				} catch {
					// Best-effort: localStorage access can throw (blocked storage,
					// sandboxed contexts). Never let it stop the mandatory cache
					// wipe + redirect below.
				}
			}
			queryClient.clear();
			window.location.href = "/signin";
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
