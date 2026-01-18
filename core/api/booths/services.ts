import { apiClient } from "../client";
import type {
	BoothCredentialsResponse,
	BoothDetailResponse,
	BoothListResponse,
	BoothOverviewResponse,
	BoothPricingResponse,
	CancelRestartResponse,
	CreateBoothRequest,
	CreateBoothResponse,
	DashboardOverviewResponse,
	DeleteBoothResponse,
	GenerateCodeResponse,
	RestartAppResponse,
	RestartRequest,
	RestartSystemResponse,
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
