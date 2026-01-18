/**
 * Credits API Types
 *
 * Type definitions for booth credits endpoints.
 *
 * @see GET /api/v1/booths/{booth_id}/credits - Get credit balance
 * @see POST /api/v1/booths/{booth_id}/credits - Add credits
 * @see GET /api/v1/booths/{booth_id}/credits/history - Get credit history
 */

/**
 * GET /api/v1/booths/{booth_id}/credits response
 */
export interface BoothCreditsResponse {
	booth_id: string;
	booth_name: string;
	credit_balance: number;
	has_credits: boolean;
	last_updated: string;
}

/**
 * POST /api/v1/booths/{booth_id}/credits request body
 */
export interface AddCreditsRequest {
	amount: number;
	reason?: string;
}

/**
 * POST /api/v1/booths/{booth_id}/credits response
 */
export interface AddCreditsResponse {
	command_id: number;
	booth_id: string;
	amount: number;
	status: "delivered" | "pending" | "failed";
	message: string;
}

// ============================================================================
// CREDITS HISTORY TYPES
// ============================================================================

/**
 * Credit transaction status
 */
export type CreditTransactionStatus = "completed" | "pending" | "failed";

/**
 * Credit transaction type (API filter values)
 */
export type CreditTransactionType = "Add" | "Deduct" | "Reset";

/**
 * Credit transaction source
 */
export type CreditTransactionSource = "booth_admin" | "mobile_app" | "system" | "booth";

/**
 * Single credit history transaction item
 */
export interface CreditTransaction {
	id: string;
	source: CreditTransactionSource;
	transaction_type: CreditTransactionType;
	amount: number;
	description: string;
	balance_after: number | null;
	status: CreditTransactionStatus;
	created_at: string;
}

/**
 * GET /api/v1/booths/{booth_id}/credits/history response
 */
export interface CreditsHistoryResponse {
	booth_id: string;
	booth_name: string;
	transactions: CreditTransaction[];
	total: number;
	limit: number;
	offset: number;
}

/**
 * Source filter values for API query
 * Maps to: cloud, booth_admin, booth_pcb, booth_system
 */
export type CreditSourceFilter = "cloud" | "booth_admin" | "booth_pcb" | "booth_system";

/**
 * GET /api/v1/booths/{booth_id}/credits/history query params
 */
export interface CreditsHistoryParams {
	/** Max number of records (default 50, max 100) */
	limit?: number;
	/** Pagination offset (default 0) */
	offset?: number;
	/** Filter by source */
	source?: CreditSourceFilter;
	/** Filter by transaction type */
	transaction_type?: CreditTransactionType;
	/** Filter transactions from this date (ISO 8601) */
	date_from?: string;
	/** Filter transactions until this date (ISO 8601) */
	date_to?: string;
}

/**
 * DELETE /api/v1/booths/{booth_id}/credits/history query params
 */
export interface DeleteCreditsHistoryParams {
	/** Delete a specific transaction by ID */
	transaction_id?: string;
	/** Filter by source */
	source?: CreditSourceFilter;
	/** Filter by transaction type */
	transaction_type?: CreditTransactionType;
	/** Delete transactions from this date (ISO 8601) */
	date_from?: string;
	/** Delete transactions until this date (ISO 8601) */
	date_to?: string;
}

/**
 * DELETE /api/v1/booths/{booth_id}/credits/history response
 */
export interface DeleteCreditsHistoryResponse {
	message: string;
	deleted_count: number;
}

