"use client";

/**
 * CashBoxCard
 *
 * The live PHYSICAL cash sitting in a booth's bill acceptors since the last
 * operator "Collect", rendered as a stat-card grid consistent with the
 * Analytics page. Presentational only.
 *
 * This is NOT revenue. Revenue attribution (cash/card/manual takings) lives on
 * the dashboard's Payment Methods card; a booth can have high cash revenue and
 * an empty box (just collected), or a full box against zero revenue today.
 *
 * Null semantics (all distinct — see the API docs):
 *   - `cashBox === null`         → "Not available" (kiosk never reported one). NOT $0.
 *   - `expected_total === 0`     → a real, meaningful empty box ($0.00).
 *   - `last_collection === null` → booth has never recorded a collection.
 *
 * @see GET /api/v1/booths/{booth_id}/overview  (cash_box object)
 */

import {
  type BoothStatus,
  type CashBox,
  computeRefundGap,
  isCashBoxStale,
  resolveCollectorName,
} from "@/core/api/cash-box";
import {
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
} from "@/core/utils/format";

interface CashBoxCardProps {
  cashBox: CashBox | null | undefined;
  boothStatus: BoothStatus | null | undefined;
}

function StatCard({
  label,
  value,
  muted = false,
  children,
}: {
  label: string;
  value: string;
  muted?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${
          muted
            ? "text-zinc-400 dark:text-zinc-600"
            : "text-zinc-900 dark:text-white"
        }`}
      >
        {value}
      </p>
      {children}
    </div>
  );
}

export function CashBoxCard({ cashBox, boothStatus }: CashBoxCardProps) {
  // Older kiosks never report a snapshot — distinct from an empty box ($0.00),
  // so render "not available" rather than a zero balance.
  if (!cashBox) {
    return (
      <StatCard label="Cash in Machine" value="Not available" muted>
        <p className="text-xs text-zinc-500 mt-2">
          This booth hasn&apos;t reported a cash-box reading yet.
        </p>
      </StatCard>
    );
  }

  const refundGap = computeRefundGap(cashBox);
  const stale = isCashBoxStale(cashBox.updated_at, boothStatus);
  const lastCollection = cashBox.last_collection;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Cash in Machine"
          value={formatCurrency(cashBox.expected_total)}
        >
          {cashBox.updated_at && (
            <div className="flex items-center gap-1.5 mt-2">
              {stale && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"
                  aria-hidden="true"
                />
              )}
              <span className="text-xs text-zinc-500">
                {stale ? "as of " : "updated "}
                {formatRelativeTime(cashBox.updated_at)}
              </span>
            </div>
          )}
        </StatCard>

        <StatCard
          label="Acceptor 1"
          value={formatCurrency(cashBox.bill1_inserted)}
        >
          <p className="text-xs text-zinc-500 mt-2">Gross inserted</p>
        </StatCard>

        <StatCard
          label="Acceptor 2"
          value={formatCurrency(cashBox.bill2_inserted)}
        >
          <p className="text-xs text-zinc-500 mt-2">Gross inserted</p>
        </StatCard>
      </div>

      {/* Meta line: last collection + refund gap (normal, not theft) */}
      <div className="flex flex-wrap items-center gap-x-2 text-sm text-zinc-500">
        {lastCollection ? (
          <span>
            Last emptied {formatDateTime(lastCollection.collected_at)}
            {lastCollection.collected_by_name &&
              ` by ${resolveCollectorName(lastCollection.collected_by_name)}`}
            {" · "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {formatCurrency(lastCollection.total_amount)}
            </span>
          </span>
        ) : (
          <span>Never collected</span>
        )}
        {refundGap > 0 && (
          <span
            title="Cash-till refunds are netted against the total only, so the acceptor counters can exceed the expected balance. This is expected, not a discrepancy."
          >
            {" · "}
            {formatCurrency(refundGap)} paid out as refunds since last collection
          </span>
        )}
      </div>
    </div>
  );
}
