import { apiClient } from "../client";
import type { BoothPaginationParams, CashCollectionsResponse } from "./types";

/**
 * Cash Box API Services
 *
 * Read-only owner-scoped access to a booth's collection audit history. The
 * live snapshot rides the existing booth-overview response (see
 * `getBoothDetail`), so no separate fetch is needed for the balance card.
 */

/**
 * List cash-box collection audit rows for a booth (newest `collected_at`
 * first, `local_id` tie-breaker — stable across pages). Mirrors the
 * limit/offset contract of `getBoothTransactions`.
 *
 * @param boothId - The booth ID to fetch collections for
 * @param params - Optional `{ limit (1–100, default 50), offset (>= 0) }`
 * @returns Promise resolving to the paginated collection history
 * @see GET /api/v1/booths/{booth_id}/cash-collections
 */
export async function getBoothCashCollections(
  boothId: string,
  params?: BoothPaginationParams,
): Promise<CashCollectionsResponse> {
  if (!boothId)
    throw new Error("Booth ID is required for getBoothCashCollections");
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  return apiClient<CashCollectionsResponse>(
    `/api/v1/booths/${boothId}/cash-collections?limit=${limit}&offset=${offset}`,
    { method: "GET" },
  );
}
