/**
 * Cash Box API Types
 *
 * The cash box is the PHYSICAL money currently sitting in a booth's bill
 * acceptors since the last operator "Collect". It is NOT revenue — revenue
 * attribution lives in `payment_breakdown`/`revenue` on the same overview
 * response and must be kept separate in the UI.
 *
 * @see GET /api/v1/booths/{booth_id}/overview  (cash_box object)
 * @see GET /api/v1/booths/{booth_id}/cash-collections  (audit history)
 */

/** Summary of a booth's most recent collection (embedded in the overview). */
export interface CashBoxLastCollection {
  /** Amount collected. */
  total_amount: number;
  /** Booth-local event time; null on legacy rows. */
  collected_at: string | null;
  /** Collector display name, resolved on the booth; null when unknown. */
  collected_by_name: string | null;
}

/**
 * Live cash-box snapshot on the booth overview. The whole object is `null`
 * until a booth sends its first cash-box heartbeat (older kiosks never do) —
 * render that as "not available", NOT `$0` (a real `$0` means "box empty").
 */
export interface CashBox {
  /** Expected cash since the last collection: inserts minus cash-till refunds. */
  expected_total: number;
  /** Gross inserted through acceptor 1 since the last collection. */
  bill1_inserted: number;
  /** Gross inserted through acceptor 2 since the last collection. */
  bill2_inserted: number;
  /** When the booth last reported the snapshot (~30s heartbeat); may be stale. */
  updated_at: string | null;
  /** Most recent collection, or null if the booth has never collected. */
  last_collection: CashBoxLastCollection | null;
}

/**
 * A single append-only collection audit row (exactly-once synced from the
 * booth). Sort and display by `collected_at`, never `synced_at` (first-upgrade
 * backfill makes `synced_at` arrive much later than `collected_at`).
 */
export interface CashCollection {
  /** Cloud row ID. */
  id: string;
  /** Booth-local audit row ID (dedup key together with the booth). */
  local_id: number;
  /** Expected cash at the moment of collection. */
  total_amount: number;
  /** Gross via acceptor 1; null on rows predating per-acceptor tracking. */
  bill1_amount: number | null;
  /** Gross via acceptor 2; null on rows predating per-acceptor tracking. */
  bill2_amount: number | null;
  /** Collector display name; null when the admin was deleted or none logged in. */
  collected_by_name: string | null;
  /** Operator free-form note. */
  note: string | null;
  /** When the collection happened on the booth. */
  collected_at: string | null;
  /** When the cloud received the row. */
  synced_at: string;
}

/**
 * Paginated response from the cash-collections endpoint (newest first).
 * `total` is the booth's full collection count for pager math, independent of
 * `limit`/`offset`.
 * @see GET /api/v1/booths/{booth_id}/cash-collections
 */
export interface CashCollectionsResponse {
  booth_id: string;
  booth_name: string;
  collections: CashCollection[];
  total: number;
  limit: number;
  offset: number;
}

// Re-export the shared limit/offset params so cash-box consumers don't reach
// into the booths module for them.
export type { BoothPaginationParams } from "../booths/types";
