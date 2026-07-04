import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import { getBoothCashCollections } from "./services";
import type { BoothPaginationParams, CashCollectionsResponse } from "./types";

/**
 * Cash Box React Query Hooks
 *
 * The live snapshot is read from the shared booth-overview query
 * (`useBoothDetail`) — it's already cached, so the balance card needs no hook
 * of its own. Only the paginated history has a dedicated query.
 */

/**
 * Fetch the paginated cash-box collection history for a booth (newest first).
 *
 * Uses `placeholderData: keepPreviousData` (TanStack Query v5) so the current
 * page stays on screen while the next page loads instead of flashing a
 * spinner. `isPlaceholderData` from the result should gate the "Next" control
 * so the user can't page past not-yet-loaded data.
 *
 * @param boothId - Booth ID; the query idles while null
 * @param params - `{ limit, offset }` — must be part of the query key so each
 *   page caches independently
 * @see GET /api/v1/booths/{booth_id}/cash-collections
 */
export function useBoothCashCollections(
  boothId: string | null,
  params?: BoothPaginationParams,
) {
  return useQuery<CashCollectionsResponse>({
    // Use the key factory for both branches so the prefix can never drift from
    // it (the empty-string id only appears while disabled, never fetched).
    queryKey: queryKeys.booths.cashCollections(boothId ?? "", params),
    queryFn: () => getBoothCashCollections(boothId!, params),
    enabled: !!boothId,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}
