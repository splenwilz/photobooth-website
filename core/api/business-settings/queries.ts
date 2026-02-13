import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import {
	deleteAccountLogo,
	deleteBoothLogo,
	getBoothBusinessSettings,
	getUserProfile,
	updateBoothSettings,
	updateUserProfile,
	uploadAccountLogo,
	uploadBoothLogo,
} from "./services";
import type {
	BoothBusinessSettingsResponse,
	UpdateBoothSettingsRequest,
	UpdateUserProfileRequest,
	UserProfileResponse,
} from "./types";

/**
 * Business Settings React Query Hooks
 *
 * Hooks for account-level branding and per-booth display settings.
 */

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch user profile including business name and logo
 */
export function useUserProfile(userId: string | null) {
	return useQuery<UserProfileResponse>({
		queryKey: userId
			? queryKeys.businessSettings.userProfile(userId)
			: ["businessSettings", "userProfile", null],
		queryFn: () => getUserProfile(userId!),
		enabled: !!userId,
		staleTime: 0,
	});
}

/**
 * Fetch all business settings for a booth
 */
export function useBoothBusinessSettings(boothId: string | null) {
	return useQuery<BoothBusinessSettingsResponse>({
		queryKey: boothId
			? queryKeys.businessSettings.boothSettings(boothId)
			: ["businessSettings", "booth", null],
		queryFn: () => getBoothBusinessSettings(boothId!),
		enabled: !!boothId,
		staleTime: 0,
	});
}

// ============================================================================
// Account Mutations
// ============================================================================

/**
 * Update user profile (business name, etc.)
 */
export function useUpdateUserProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			userId,
			...data
		}: { userId: string } & UpdateUserProfileRequest) =>
			updateUserProfile(userId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.businessSettings.userProfile(variables.userId),
			});
		},
	});
}

/**
 * Upload or replace account-level logo
 */
export function useUploadAccountLogo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, file }: { userId: string; file: File }) =>
			uploadAccountLogo(userId, file),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.businessSettings.userProfile(variables.userId),
			});
			// Booth settings may reference the account logo
			queryClient.invalidateQueries({
				queryKey: queryKeys.businessSettings.all(),
			});
		},
	});
}

/**
 * Remove account logo
 */
export function useDeleteAccountLogo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId }: { userId: string }) => deleteAccountLogo(userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.businessSettings.userProfile(variables.userId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.businessSettings.all(),
			});
		},
	});
}

// ============================================================================
// Booth Mutations
// ============================================================================

/**
 * Update per-booth business settings with optimistic updates for toggles
 */
export function useUpdateBoothSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			boothId,
			...data
		}: { boothId: string } & UpdateBoothSettingsRequest) =>
			updateBoothSettings(boothId, data),

		onMutate: async ({ boothId, ...data }) => {
			await queryClient.cancelQueries({
				queryKey: queryKeys.businessSettings.boothSettings(boothId),
			});

			const previous =
				queryClient.getQueryData<BoothBusinessSettingsResponse>(
					queryKeys.businessSettings.boothSettings(boothId),
				);

			if (previous) {
				queryClient.setQueryData<BoothBusinessSettingsResponse>(
					queryKeys.businessSettings.boothSettings(boothId),
					{ ...previous, ...data },
				);
			}

			return { previous, boothId };
		},

		onError: (_err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(
					queryKeys.businessSettings.boothSettings(context.boothId),
					context.previous,
				);
			}
		},

		onSettled: (_, __, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.businessSettings.boothSettings(variables.boothId),
			});
		},
	});
}

/**
 * Upload custom booth logo
 */
export function useUploadBoothLogo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boothId, file }: { boothId: string; file: File }) =>
			uploadBoothLogo(boothId, file),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.businessSettings.boothSettings(variables.boothId),
			});
		},
	});
}

/**
 * Remove custom booth logo (reverts to account logo)
 */
export function useDeleteBoothLogo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boothId }: { boothId: string }) => deleteBoothLogo(boothId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.businessSettings.boothSettings(variables.boothId),
			});
		},
	});
}
