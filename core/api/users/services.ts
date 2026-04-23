import { apiClient, ApiError } from "../client";
import type {
	LogoDeleteResponse,
	LogoUploadResponse,
	UpdateBusinessNameRequest,
	UserProfileResponse,
} from "./types";

/**
 * User Profile API Services
 *
 * Service functions for account-level business settings.
 * Logo uploads go through /api/proxy-upload (multipart/form-data); JSON
 * endpoints use the shared apiClient which auto-attaches the auth token.
 */

/**
 * Get user profile including business settings fields.
 * @see GET /api/v1/users/{user_id}
 */
export async function getUserProfile(
	userId: string,
): Promise<UserProfileResponse> {
	return apiClient<UserProfileResponse>(`/api/v1/users/${userId}`, {
		method: "GET",
	});
}

/**
 * Update account-level business settings (business_name and/or use_display_name_on_booths).
 * Pass business_name: null to clear the field.
 * @see PATCH /api/v1/users/{user_id}
 */
export async function updateBusinessName(
	userId: string,
	data: UpdateBusinessNameRequest,
): Promise<UserProfileResponse> {
	return apiClient<UserProfileResponse>(`/api/v1/users/${userId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/**
 * Upload or replace the account logo (multipart/form-data).
 * Uses /api/proxy-upload because apiClient hardcodes Content-Type: application/json.
 * @see PUT /api/v1/users/{user_id}/logo
 */
export async function uploadAccountLogo(
	userId: string,
	file: File,
): Promise<LogoUploadResponse> {
	return uploadFileViaProxy<LogoUploadResponse>(
		`/api/v1/users/${userId}/logo`,
		file,
	);
}

/**
 * Remove the account logo. Booths using it will have no logo until a new one is uploaded.
 * @see DELETE /api/v1/users/{user_id}/logo
 */
export async function deleteAccountLogo(
	userId: string,
): Promise<LogoDeleteResponse> {
	return deleteViaProxy<LogoDeleteResponse>(`/api/v1/users/${userId}/logo`);
}

// ============================================================================
// Shared multipart helpers (used by account + booth logo flows)
// ============================================================================

/**
 * Upload a file through /api/proxy-upload with the auth cookie attached server-side.
 * The browser sets Content-Type with the correct multipart boundary when we pass FormData.
 */
export async function uploadFileViaProxy<T>(
	path: string,
	file: File,
	fieldName = "file",
): Promise<T> {
	const formData = new FormData();
	formData.append(fieldName, file);

	const res = await fetch(
		`/api/proxy-upload?path=${encodeURIComponent(path)}`,
		{
			method: "PUT",
			credentials: "include",
			body: formData,
		},
	);

	if (!res.ok) {
		throw new ApiError(res.status, await extractErrorMessage(res, "Upload failed"));
	}

	return res.json();
}

/**
 * Issue a DELETE through /api/proxy-upload (shared code path for logo removal).
 */
export async function deleteViaProxy<T>(path: string): Promise<T> {
	const res = await fetch(
		`/api/proxy-upload?path=${encodeURIComponent(path)}`,
		{
			method: "DELETE",
			credentials: "include",
		},
	);

	if (!res.ok) {
		throw new ApiError(res.status, await extractErrorMessage(res, "Delete failed"));
	}

	if (res.status === 204) return undefined as T;
	return res.json();
}

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
	try {
		const errorJson = await res.json();
		return (
			errorJson.detail ||
			errorJson.message ||
			errorJson.error ||
			res.statusText ||
			fallback
		);
	} catch {
		return res.statusText || fallback;
	}
}
