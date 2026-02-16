import { apiClient, ApiError } from "../client";
import type {
	BoothBusinessSettingsResponse,
	DeleteLogoResponse,
	UpdateBoothSettingsRequest,
	UpdateUserProfileRequest,
	UploadLogoResponse,
	UserProfileResponse,
} from "./types";

/**
 * Business Settings API Services
 *
 * Service functions for account-level branding and per-booth display settings.
 */

// ============================================================================
// File Upload Helper
// ============================================================================

/**
 * Upload a file through the proxy-upload route (multipart/form-data).
 * Cannot use apiClient because it hardcodes Content-Type: application/json.
 */
async function uploadFile<T>(path: string, file: File, fieldName = "file"): Promise<T> {
	const formData = new FormData();
	formData.append(fieldName, file);

	const res = await fetch(`/api/proxy-upload?path=${encodeURIComponent(path)}`, {
		method: "PUT",
		credentials: "include",
		body: formData,
		// Do NOT set Content-Type — browser auto-sets with boundary
	});

	if (!res.ok) {
		let errorMessage: string;
		try {
			const errorJson = await res.json();
			errorMessage = errorJson.detail || errorJson.message || errorJson.error || "Upload failed";
		} catch {
			errorMessage = res.statusText || "Upload failed";
		}
		throw new ApiError(res.status, errorMessage);
	}

	return res.json();
}

/**
 * Delete via the proxy-upload route (for logo deletion endpoints).
 */
async function deleteViaUploadProxy<T>(path: string): Promise<T> {
	const res = await fetch(`/api/proxy-upload?path=${encodeURIComponent(path)}`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!res.ok) {
		let errorMessage: string;
		try {
			const errorJson = await res.json();
			errorMessage = errorJson.detail || errorJson.message || errorJson.error || "Delete failed";
		} catch {
			errorMessage = res.statusText || "Delete failed";
		}
		throw new ApiError(res.status, errorMessage);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	return res.json();
}

// ============================================================================
// Account-level Services
// ============================================================================

/**
 * Get user profile including business name and logo
 * @see GET /api/v1/users/{user_id}
 */
export async function getUserProfile(userId: string): Promise<UserProfileResponse> {
	return apiClient<UserProfileResponse>(`/api/v1/users/${userId}`, {
		method: "GET",
	});
}

/**
 * Update user profile (business name, etc.)
 * @see PATCH /api/v1/users/{user_id}
 */
export async function updateUserProfile(
	userId: string,
	data: UpdateUserProfileRequest,
): Promise<UserProfileResponse> {
	return apiClient<UserProfileResponse>(`/api/v1/users/${userId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/**
 * Upload or replace the account-level logo
 * @see PUT /api/v1/users/{user_id}/logo
 */
export async function uploadAccountLogo(
	userId: string,
	file: File,
): Promise<UploadLogoResponse> {
	return uploadFile<UploadLogoResponse>(`/api/v1/users/${userId}/logo`, file);
}

/**
 * Remove the account logo
 * @see DELETE /api/v1/users/{user_id}/logo
 */
export async function deleteAccountLogo(userId: string): Promise<DeleteLogoResponse> {
	return deleteViaUploadProxy<DeleteLogoResponse>(`/api/v1/users/${userId}/logo`);
}

// ============================================================================
// Per-booth Services
// ============================================================================

/**
 * Get all business settings for a booth
 * @see GET /api/v1/booths/{booth_id}/business-settings
 */
export async function getBoothBusinessSettings(
	boothId: string,
): Promise<BoothBusinessSettingsResponse> {
	return apiClient<BoothBusinessSettingsResponse>(
		`/api/v1/booths/${boothId}/business-settings`,
		{ method: "GET" },
	);
}

/**
 * Partial update of per-booth settings
 * @see PATCH /api/v1/booths/{booth_id}
 */
export async function updateBoothSettings(
	boothId: string,
	data: UpdateBoothSettingsRequest,
): Promise<unknown> {
	return apiClient(`/api/v1/booths/${boothId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/**
 * Upload a custom logo for a booth
 * @see PUT /api/v1/booths/{booth_id}/logo
 */
export async function uploadBoothLogo(
	boothId: string,
	file: File,
): Promise<UploadLogoResponse> {
	return uploadFile<UploadLogoResponse>(`/api/v1/booths/${boothId}/logo`, file);
}

/**
 * Remove custom logo for a booth (reverts to account logo)
 * @see DELETE /api/v1/booths/{booth_id}/logo
 */
export async function deleteBoothLogo(boothId: string): Promise<DeleteLogoResponse> {
	return deleteViaUploadProxy<DeleteLogoResponse>(`/api/v1/booths/${boothId}/logo`);
}
