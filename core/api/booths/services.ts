import { apiClient, ApiError } from "../client";
import {
	deleteViaProxy,
	uploadFileViaProxy,
} from "../users/services";
import type {
	LogoDeleteResponse,
	LogoUploadResponse,
} from "../users/types";
import type {
	BoothBusinessSettingsResponse,
	BoothCredentialsResponse,
	BoothCriticalEventsResponse,
	BoothDetailResponse,
	BoothListResponse,
	BoothOverviewResponse,
	BoothPaginationParams,
	BoothPricingResponse,
	BoothTransactionsResponse,
	CancelRestartResponse,
	CreateBoothRequest,
	CreateBoothResponse,
	DashboardOverviewResponse,
	DeleteBoothResponse,
	DownloadBoothLogsRequest,
	DownloadBoothLogsResponse,
	GenerateCodeResponse,
	RefundTransactionRequest,
	RefundTransactionResponse,
	RestartAppResponse,
	RestartRequest,
	RestartSystemResponse,
	UpdateBoothSettingsRequest,
	UpdatePricingRequest,
	UpdatePricingResponse,
} from "./types";

/**
 * Booth API Services
 *
 * Service functions for booth management.
 * @see https://tanstack.com/query/latest/docs/react/guides/mutations
 */

/**
 * Create a new booth
 * @param data - Booth creation request data (name, address)
 * @returns Promise resolving to created booth with API key and QR code
 */
export async function createBooth(
	data: CreateBoothRequest,
): Promise<CreateBoothResponse> {
	const response = await apiClient<CreateBoothResponse>("/api/v1/booths", {
		method: "POST",
		body: JSON.stringify(data),
	});
	return response;
}

/**
 * Update booth name and/or address (partial update)
 * @param boothId - The booth ID to update
 * @param data - Fields to update (name, address)
 * @returns Promise resolving when the update completes
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
 * Get list of all booths for the current user
 * @returns Promise resolving to booth list with total count
 * @see GET /api/v1/booths
 */
export async function getBoothList(): Promise<BoothListResponse> {
	const response = await apiClient<BoothListResponse>("/api/v1/booths", {
		method: "GET",
	});
	return response;
}

/**
 * Get detailed overview for a single booth
 * Includes revenue, hardware status, system info, and recent alerts
 * @param boothId - The booth ID to fetch
 * @returns Promise resolving to detailed booth data
 * @see GET /api/v1/booths/{booth_id}/overview
 */
export async function getBoothDetail(boothId: string): Promise<BoothDetailResponse> {
	const response = await apiClient<BoothDetailResponse>(
		`/api/v1/booths/${boothId}/overview`,
		{
			method: "GET",
		},
	);
	return response;
}

/**
 * Get booth overview with summary and all booths (aggregated view)
 * @returns Promise resolving to booth overview with summary statistics
 * @see GET /api/v1/booths/overview
 */
export async function getBoothOverview(): Promise<BoothOverviewResponse> {
	const response = await apiClient<BoothOverviewResponse>(
		"/api/v1/booths/overview",
		{
			method: "GET",
		},
	);
	return response;
}

/**
 * Get dashboard overview with aggregated stats across all booths
 * Includes summary, revenue by period, payment breakdown, hardware summary, and alerts
 * @returns Promise resolving to dashboard overview data
 * @see GET /api/v1/booths/overview/all
 */
export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
	return apiClient<DashboardOverviewResponse>("/api/v1/booths/overview/all", {
		method: "GET",
	});
}

/**
 * Get current pricing for a booth
 * @param boothId - The booth ID to get pricing for
 * @returns Promise resolving to current pricing info
 * @see GET /api/v1/booths/{booth_id}/pricing
 */
export async function getBoothPricing(
	boothId: string,
): Promise<BoothPricingResponse> {
	const response = await apiClient<BoothPricingResponse>(
		`/api/v1/booths/${boothId}/pricing`,
		{
			method: "GET",
		},
	);
	return response;
}

/**
 * Update pricing for a booth (partial update)
 * Sends pricing update command to the booth via WebSocket
 * @param boothId - The booth ID to update pricing for
 * @param data - Pricing update data (only include fields to update)
 * @returns Promise resolving to command result
 * @see PATCH /api/v1/booths/{booth_id}/pricing
 */
export async function updateBoothPricing(
	boothId: string,
	data: UpdatePricingRequest,
): Promise<UpdatePricingResponse> {
	const response = await apiClient<UpdatePricingResponse>(
		`/api/v1/booths/${boothId}/pricing`,
		{
			method: "PATCH",
			body: JSON.stringify(data),
		},
	);
	return response;
}

// ============================================================================
// RESTART SERVICES
// ============================================================================

/**
 * Restart the booth application
 * @param boothId - The booth ID to restart
 * @param data - Optional delay and force settings
 * @returns Promise resolving to command result
 * @see POST /api/v1/booths/{booth_id}/restart-app
 */
export async function restartBoothApp(
	boothId: string,
	data?: RestartRequest,
): Promise<RestartAppResponse> {
	const response = await apiClient<RestartAppResponse>(
		`/api/v1/booths/${boothId}/restart-app`,
		{
			method: "POST",
			body: JSON.stringify(data ?? { delay_seconds: 5, force: false }),
		},
	);
	return response;
}

/**
 * Restart the booth system (PC reboot)
 * @param boothId - The booth ID to restart
 * @param data - Optional delay and force settings
 * @returns Promise resolving to command result
 * @see POST /api/v1/booths/{booth_id}/restart-system
 */
export async function restartBoothSystem(
	boothId: string,
	data?: RestartRequest,
): Promise<RestartSystemResponse> {
	const response = await apiClient<RestartSystemResponse>(
		`/api/v1/booths/${boothId}/restart-system`,
		{
			method: "POST",
			body: JSON.stringify(data ?? { delay_seconds: 15, force: false }),
		},
	);
	return response;
}

/**
 * Cancel a pending restart command
 * @param boothId - The booth ID to cancel restart for
 * @returns Promise resolving to command result
 * @see POST /api/v1/booths/{booth_id}/cancel-restart
 */
export async function cancelBoothRestart(
	boothId: string,
): Promise<CancelRestartResponse> {
	const response = await apiClient<CancelRestartResponse>(
		`/api/v1/booths/${boothId}/cancel-restart`,
		{
			method: "POST",
			body: JSON.stringify({}),
		},
	);
	return response;
}

// ============================================================================
// BOOTH CREDENTIALS SERVICES
// ============================================================================

/**
 * Get booth credentials (API key and QR code for reconnection)
 * @param boothId - The booth ID to get credentials for
 * @returns Promise resolving to credentials with API key and QR code
 * @see GET /api/v1/booths/{booth_id}/credentials
 */
export async function getBoothCredentials(
	boothId: string,
): Promise<BoothCredentialsResponse> {
	const response = await apiClient<BoothCredentialsResponse>(
		`/api/v1/booths/${boothId}/credentials`,
		{
			method: "GET",
		},
	);
	return response;
}

/**
 * Generate a new 6-digit registration code for a booth
 * Code is valid for 15 minutes and is one-time use
 * User types this code on the photobooth instead of scanning QR codes
 * 
 * @param boothId - The booth ID to generate code for
 * @returns Promise resolving to code and expiration info
 * @see POST /api/v1/booths/{booth_id}/generate-code
 */
export async function generateBoothCode(
	boothId: string,
): Promise<GenerateCodeResponse> {
	const response = await apiClient<GenerateCodeResponse>(
		`/api/v1/booths/${boothId}/generate-code`,
		{
			method: "POST",
			body: JSON.stringify({}),
		},
	);
	return response;
}

// ============================================================================
// STRANDED PAID SESSIONS SERVICES
// ============================================================================

/**
 * List transactions for a booth, including `stranded_at` / `stranded_reason`
 * markers used to surface sessions where the customer paid but the
 * post-payment flow failed.
 * @see GET /api/v1/booths/{booth_id}/transactions
 */
export async function getBoothTransactions(
	boothId: string,
	params?: BoothPaginationParams,
): Promise<BoothTransactionsResponse> {
	if (!boothId) throw new Error("Booth ID is required for getBoothTransactions");
	const limit = params?.limit ?? 50;
	const offset = params?.offset ?? 0;
	return apiClient<BoothTransactionsResponse>(
		`/api/v1/booths/${boothId}/transactions?limit=${limit}&offset=${offset}`,
		{ method: "GET" },
	);
}

/**
 * List critical (operator-alertable) events for a booth. Each event is
 * server-joined with its transaction so amount and inline refund summary
 * are available without a second fetch.
 *
 * Ordering: newest `occurred_at` first (booth-reported incident time).
 * @see GET /api/v1/booths/{booth_id}/critical-events
 */
export async function getBoothCriticalEvents(
	boothId: string,
	params?: BoothPaginationParams,
): Promise<BoothCriticalEventsResponse> {
	if (!boothId)
		throw new Error("Booth ID is required for getBoothCriticalEvents");
	const limit = params?.limit ?? 50;
	const offset = params?.offset ?? 0;
	return apiClient<BoothCriticalEventsResponse>(
		`/api/v1/booths/${boothId}/critical-events?limit=${limit}&offset=${offset}`,
		{ method: "GET" },
	);
}

/**
 * Record a refund against a transaction (accounting closure only — money
 * must be returned physically BEFORE calling this).
 *
 * Error cases:
 *   400 — amount > total_price
 *   404 — booth not owned, or transaction code not found
 *   409 — already refunded (existing record returned in body)
 *   422 — validation error (bad method, amount <= 0)
 *
 * @see POST /api/v1/booths/{booth_id}/transactions/{transaction_code}/refund
 */
export async function refundBoothTransaction(
	boothId: string,
	transactionCode: string,
	data: RefundTransactionRequest,
): Promise<RefundTransactionResponse> {
	if (!boothId)
		throw new Error("Booth ID is required for refundBoothTransaction");
	if (!transactionCode)
		throw new Error(
			"Transaction code is required for refundBoothTransaction",
		);

	// Trim before truthy-check — `Boolean("   ")` is true, which would leak a
	// whitespace-only note past a naive guard and fail server min-length validation.
	const trimmedNote = data.note?.trim();
	const body: RefundTransactionRequest = {
		amount: data.amount,
		method: data.method,
		...(trimmedNote ? { note: trimmedNote } : {}),
	};

	return apiClient<RefundTransactionResponse>(
		`/api/v1/booths/${boothId}/transactions/${encodeURIComponent(transactionCode)}/refund`,
		{ method: "POST", body: JSON.stringify(body) },
	);
}

// ============================================================================
// BUSINESS SETTINGS SERVICES
// ============================================================================

/**
 * Get the effective business settings for a booth (combines account + booth level).
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
 * Upload or replace a booth's custom logo (multipart/form-data).
 * @see PUT /api/v1/booths/{booth_id}/logo
 */
export async function uploadBoothLogo(
	boothId: string,
	file: File,
): Promise<LogoUploadResponse> {
	return uploadFileViaProxy<LogoUploadResponse>(
		`/api/v1/booths/${boothId}/logo`,
		file,
	);
}

/**
 * Remove the booth's custom logo (falls back to the account logo).
 * @see DELETE /api/v1/booths/{booth_id}/logo
 */
export async function deleteBoothLogo(
	boothId: string,
): Promise<LogoDeleteResponse> {
	return deleteViaProxy<LogoDeleteResponse>(
		`/api/v1/booths/${boothId}/logo`,
	);
}

// ============================================================================
// DELETE BOOTH SERVICES
// ============================================================================

/**
 * Delete a booth permanently
 * @param boothId - The booth ID to delete
 * @returns Promise resolving to delete confirmation
 * @see DELETE /api/v1/booths/{booth_id}
 */
export async function deleteBooth(
	boothId: string,
): Promise<DeleteBoothResponse> {
	const response = await apiClient<DeleteBoothResponse>(
		`/api/v1/booths/${boothId}`,
		{
			method: "DELETE",
		},
	);
	return response;
}

// ============================================================================
// DOWNLOAD LOGS SERVICES
// ============================================================================

/**
 * Download logs from a booth (long-running operation)
 *
 * Uses /api/proxy-long instead of apiClient because the backend may take
 * up to 120 seconds (booth collects, ZIPs, and uploads logs to S3).
 *
 * @param boothId - The booth UUID
 * @param data - Optional log type and time range filters
 * @returns Promise with presigned S3 download URL and file size
 *
 * @example
 * const result = await downloadBoothLogs("booth-uuid-1", { log_types: ["errors"], hours: 6 });
 * window.open(result.download_url, "_blank");
 */
export async function downloadBoothLogs(
	boothId: string,
	data: DownloadBoothLogsRequest = {},
): Promise<DownloadBoothLogsResponse> {
	const path = `/api/v1/booths/${boothId}/download-logs`;
	const response = await fetch(
		`/api/proxy-long?path=${encodeURIComponent(path)}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		},
	);

	if (!response.ok) {
		const errorText = await response.text();
		let message: string;
		try {
			const errorJson = JSON.parse(errorText);
			message =
				errorJson.detail ||
				errorJson.message ||
				errorJson.error ||
				response.statusText;
		} catch {
			message = errorText || response.statusText;
		}
		throw new ApiError(response.status, message);
	}

	return response.json();
}
