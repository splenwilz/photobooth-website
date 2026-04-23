"use client";

/**
 * Needs Attention Page
 *
 * Lists stranded paid sessions for a single booth (scoped via `?booth=<id>`).
 * Port of the mobile app's `/app/booths/[boothId]/stranded-sessions.tsx`.
 *
 * Unrefunded sessions render red; refunded sessions render green and muted.
 * Clicking a row opens `StrandedSessionDetailsModal` to record a refund.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useBoothCriticalEvents,
  useBoothList,
  useBoothTransactions,
} from "@/core/api/booths";
import {
  formatCriticalEventTag,
  formatStrandedReason,
  isRowUnrefunded,
  joinCriticalEventsWithTransactions,
  type StrandedSessionRow,
} from "@/core/api/booths";
import { StrandedSessionDetailsModal } from "./StrandedSessionDetailsModal";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function NeedsAttentionPage() {
  const searchParams = useSearchParams();
  const boothId = searchParams.get("booth");

  const [selectedRow, setSelectedRow] = useState<StrandedSessionRow | null>(
    null,
  );

  const { data: boothList } = useBoothList();
  const selectedBooth = boothList?.booths.find((b) => b.id === boothId);

  const eventsQuery = useBoothCriticalEvents(boothId);
  const transactionsQuery = useBoothTransactions(boothId);

  const rows = useMemo(() => {
    const events = eventsQuery.data?.events ?? [];
    const transactions = transactionsQuery.data?.transactions ?? [];
    return joinCriticalEventsWithTransactions(events, transactions);
  }, [eventsQuery.data, transactionsQuery.data]);

  const unrefundedCount = rows.filter(isRowUnrefunded).length;
  const refundedCount = rows.length - unrefundedCount;

  const isLoading =
    (eventsQuery.isLoading || transactionsQuery.isLoading) && rows.length === 0;
  const error = eventsQuery.error ?? transactionsQuery.error;

  const handleRefresh = () => {
    eventsQuery.refetch();
    transactionsQuery.refetch();
  };

  // No booth selected → redirect to dashboard picker
  if (!boothId) {
    return (
      <div className="max-w-3xl space-y-4">
        <Link
          href="/dashboard"
          className="text-sm text-[#069494] hover:underline"
        >
          ← Back to dashboard
        </Link>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
            No booth selected
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Pick a booth from the dashboard to see sessions that need attention.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href={`/dashboard?booth=${boothId}`}
          className="text-sm text-[#069494] hover:underline"
        >
          ← Back to dashboard
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Needs Attention
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {selectedBooth?.name ?? "Loading…"}
              {rows.length > 0 && (
                <>
                  {" · "}
                  <span className="text-red-500">
                    {unrefundedCount} need{unrefundedCount === 1 ? "s" : ""} review
                  </span>
                  {refundedCount > 0 && (
                    <span className="text-zinc-500">
                      {" · "}
                      {refundedCount} refunded
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={eventsQuery.isFetching || transactionsQuery.isFetching}
            className="px-3 py-2 rounded-lg text-sm text-[#069494] hover:bg-[#069494]/10 transition-colors disabled:opacity-50"
          >
            {eventsQuery.isFetching || transactionsQuery.isFetching
              ? "Refreshing…"
              : "Refresh"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4"
        >
          <p className="text-sm text-red-500">
            {error.message ?? "Failed to load sessions."}
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30"
          >
            Retry
          </button>
        </div>
      )}

      {/* List / states */}
      {isLoading ? (
        <SessionCardSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <SessionCard
              key={row.event.id}
              row={row}
              onOpen={() => setSelectedRow(row)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <StrandedSessionDetailsModal
        isOpen={selectedRow !== null}
        boothId={boothId}
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}

// ============================================================================
// SessionCard
// ============================================================================

function SessionCard({
  row,
  onOpen,
}: {
  row: StrandedSessionRow;
  onOpen: () => void;
}) {
  const { event, transaction } = row;
  const unrefunded = isRowUnrefunded(row);
  const amount =
    transaction?.total_price ?? event.transaction_total_price ?? null;
  const refundAmount = event.refund?.refund_amount ?? transaction?.refund_amount ?? null;
  const reasonLabel = unrefunded
    ? formatStrandedReason(transaction?.stranded_reason)
    : null;
  const tagLabel = formatCriticalEventTag(event.tag);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full text-left p-4 rounded-xl border bg-white dark:bg-[#111111] transition-all hover:border-slate-300 dark:hover:border-zinc-700 ${
        unrefunded
          ? "border-red-500/30 border-l-4 border-l-red-500"
          : "border-[var(--border)] opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                unrefunded
                  ? "bg-red-500/15 text-red-600 dark:text-red-400"
                  : "bg-green-500/15 text-green-600 dark:text-green-400"
              }`}
            >
              {unrefunded ? tagLabel : "Refunded"}
            </span>
            {reasonLabel && (
              <span className="text-xs text-zinc-500">{reasonLabel}</span>
            )}
          </div>
          {event.transaction_code && (
            <p className="text-sm font-mono text-zinc-900 dark:text-white break-all">
              {event.transaction_code}
            </p>
          )}
          <p className="text-xs text-zinc-500">
            {formatRelativeTime(event.occurred_at)}
            {transaction?.payment_method && ` · ${transaction.payment_method}`}
          </p>
        </div>
        <div className="text-right shrink-0">
          {unrefunded ? (
            amount !== null && (
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {formatCurrency(amount)}
              </p>
            )
          ) : (
            refundAmount !== null && (
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(refundAmount)}
              </p>
            )
          )}
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// Empty + loading states
// ============================================================================

function EmptyState() {
  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-green-500/15 flex items-center justify-center mb-3">
        <svg
          className="w-6 h-6 text-green-600 dark:text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="font-medium text-zinc-900 dark:text-white">
        No sessions need review
      </p>
      <p className="text-sm text-zinc-500 mt-1">
        Everything on this booth is paid and printed.
      </p>
    </div>
  );
}

function SessionCardSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)]"
        >
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
            <div className="h-5 w-48 bg-slate-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-32 bg-slate-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
