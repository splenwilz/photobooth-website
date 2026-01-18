/**
 * Credits API Services
 *
 * Service functions for booth credits operations.
 *
 * @see GET /api/v1/booths/{booth_id}/credits - Get credit balance
 * @see POST /api/v1/booths/{booth_id}/credits - Add credits
 * @see GET /api/v1/booths/{booth_id}/credits/history - Get credit history
 */

import { apiClient } from "../client";
import type {
    AddCreditsRequest,
    AddCreditsResponse,
    BoothCreditsResponse,
    CreditsHistoryParams,
    CreditsHistoryResponse,
    DeleteCreditsHistoryParams,
    DeleteCreditsHistoryResponse,
} from "./types";

/**
 * Get booth credit balance
 *
 * @param boothId - The booth ID to get credits for
 * @returns Credit balance and metadata
 *
 * @example
 * const credits = await getBoothCredits("booth-123");
 * console.log(credits.credit_balance); // 12215
 */
export async function getBoothCredits(
	boothId: string,
): Promise<BoothCreditsResponse> {
	// apiClient is a fetch-like function, not axios
	const response = await apiClient<BoothCreditsResponse>(
		`/api/v1/booths/${boothId}/credits`,
		{ method: "GET" },
	);
	return response;
}

/**
 * Add credits to a booth
 *
 * @param boothId - The booth ID to add credits to
 * @param data - Amount and optional reason
 * @returns Command result with delivery status
 *
 * @example
 * const result = await addBoothCredits("booth-123", { amount: 100, reason: "Monthly top-up" });
 * console.log(result.status); // "delivered"
 */
export async function addBoothCredits(
	boothId: string,
	data: AddCreditsRequest,
): Promise<AddCreditsResponse> {
	// apiClient is a fetch-like function, not axios
	const response = await apiClient<AddCreditsResponse>(
		`/api/v1/booths/${boothId}/credits`,
		{
			method: "POST",
			body: JSON.stringify(data),
		},
	);
	return response;
}

/**
 * Get booth credits history with pagination and filters
 *
 * @param boothId - The booth ID to get history for
 * @param params - Pagination and filter params
 * @returns Paginated list of credit transactions
 *
 * @example
 * const history = await getCreditsHistory("booth-123", { limit: 50, offset: 0 });
 * const filtered = await getCreditsHistory("booth-123", { source: "cloud", transaction_type: "Add" });
 */
export async function getCreditsHistory(
	boothId: string,
	params?: CreditsHistoryParams,
): Promise<CreditsHistoryResponse> {
	// Build query string for pagination and filters
	const queryParams = new URLSearchParams();
	if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
	if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());
	if (params?.source) queryParams.append("source", params.source);
	if (params?.transaction_type) queryParams.append("transaction_type", params.transaction_type);
	if (params?.date_from) queryParams.append("date_from", params.date_from);
	if (params?.date_to) queryParams.append("date_to", params.date_to);

	const queryString = queryParams.toString();
	const url = `/api/v1/booths/${boothId}/credits/history${queryString ? `?${queryString}` : ""}`;

	const response = await apiClient<CreditsHistoryResponse>(url, {
		method: "GET",
	});
	return response;
}

/**
 * Delete credit history transactions
 *
 * WARNING: This operation cannot be undone!
 *
 * @param boothId - The booth ID to delete history for
 * @param params - Filter params to select which transactions to delete
 * @returns Delete result with count of deleted transactions
 *
 * @example
 * // Delete a specific transaction
 * await deleteCreditsHistory("booth-123", { transaction_id: "tx-456" });
 */
export async function deleteCreditsHistory(
	boothId: string,
	params?: DeleteCreditsHistoryParams,
): Promise<DeleteCreditsHistoryResponse> {
	// Build query string for filters
	const queryParams = new URLSearchParams();
	if (params?.transaction_id) queryParams.append("transaction_id", params.transaction_id);
	if (params?.source) queryParams.append("source", params.source);
	if (params?.transaction_type) queryParams.append("transaction_type", params.transaction_type);
	if (params?.date_from) queryParams.append("date_from", params.date_from);
	if (params?.date_to) queryParams.append("date_to", params.date_to);

	const queryString = queryParams.toString();
	const url = `/api/v1/booths/${boothId}/credits/history${queryString ? `?${queryString}` : ""}`;

	const response = await apiClient<DeleteCreditsHistoryResponse>(url, {
		method: "DELETE",
	});
	return response;
}
