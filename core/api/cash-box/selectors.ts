/**
 * Cash Box display selectors — pure functions.
 *
 * The dashboard has no component-test infra, so all non-trivial display logic
 * lives here as pure, unit-tested helpers and the JSX stays thin.
 */

// Relative import (not the `@/` alias) so this module resolves under Vitest,
// which runs without a config to map path aliases — matching the convention of
// other unit-tested service modules that import via `../`.
import { PLACEHOLDER, formatCurrency, parseDate } from "../../utils/format";
import type { CashBox } from "./types";

/** Booth online/offline status carried by the overview response. */
export type BoothStatus = "online" | "offline" | "warning" | "error";

/**
 * Float-noise threshold. Gross totals and expected_total are independent
 * sums, so their difference can land a hair off zero (e.g. `-1e-9`). Anything
 * at or below this (half a cent) is treated as no gap.
 */
const GAP_EPSILON = 0.005;

/**
 * Cash-till refunds are netted against `expected_total` only (the booth can't
 * know which physical acceptor the operator took refund cash from), so
 * `bill1_inserted + bill2_inserted >= expected_total`. The positive
 * difference is money paid out as refunds since the last collection — normal,
 * not an error and not theft. Returns 0 when within float-noise range so the
 * UI never shows a phantom payout.
 */
export function computeRefundGap(cashBox: CashBox): number {
  const gap =
    cashBox.bill1_inserted + cashBox.bill2_inserted - cashBox.expected_total;
  // Guard against non-finite fields in a malformed payload (Infinity would
  // otherwise pass `> ε` and render a "— paid out as refunds" line).
  return Number.isFinite(gap) && gap > GAP_EPSILON ? gap : 0;
}

/**
 * Resolve a nullable collector display name. `collected_by_name` is null when
 * the booth admin was later deleted or the collection had no logged-in user.
 * Mirrors the `getUserDisplayName` null-guard idiom so a null never renders as
 * the literal string "null".
 */
export function resolveCollectorName(name: string | null | undefined): string {
  const trimmed = typeof name === "string" ? name.trim() : "";
  return trimmed.length > 0 ? trimmed : "Unknown";
}

/**
 * Format a nullable per-acceptor amount. `null` marks a row recorded before
 * per-acceptor tracking existed, which must render as the placeholder — NOT
 * `$0.00` (that would misstate a real zero).
 */
export function formatBillAmount(amount: number | null | undefined): string {
  return amount === null || amount === undefined
    ? PLACEHOLDER
    : formatCurrency(amount);
}

/** A snapshot older than this is treated as stale (6× the ~30s heartbeat). */
const STALE_AFTER_MS = 3 * 60 * 1000;

/**
 * Whether the live snapshot should be presented as "as of {updated_at}"
 * rather than live. `offline` is a hard signal (the booth isn't reporting).
 * `warning`/`error` booths can still heartbeat, so for any non-offline status
 * staleness is decided purely by snapshot age. `now` is injectable for tests.
 */
export function isCashBoxStale(
  updatedAt: string | null | undefined,
  boothStatus: BoothStatus | null | undefined,
  now: Date = new Date(),
): boolean {
  if (boothStatus === "offline") return true;
  const t = parseDate(updatedAt);
  if (!t) return false; // no/invalid snapshot time → don't assert staleness
  return now.getTime() - t.getTime() > STALE_AFTER_MS;
}
