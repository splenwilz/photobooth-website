"use client";

/**
 * CashCollections
 *
 * Paginated audit history of cash-box collections for a booth (newest first),
 * rendered as a semantic <table> styled to match the Analytics list. Rows are
 * append-only, exactly-once synced from the booth.
 *
 * Pagination is local state; `keepPreviousData` (via the hook) keeps the
 * current page visible while the next loads, and Next is gated on
 * `isPlaceholderData`. The parent remounts this component with `key={boothId}`,
 * so `offset` resets and no other booth's rows can leak in on a booth switch.
 * Display by `collected_at`, never `synced_at` (first upgrade backfills
 * history, so `synced_at` is skewed).
 *
 * @see GET /api/v1/booths/{booth_id}/cash-collections
 */

import { useCallback, useState } from "react";
import {
  formatBillAmount,
  resolveCollectorName,
  useBoothCashCollections,
} from "@/core/api/cash-box";
import { formatCurrency, formatDateTime } from "@/core/utils/format";
import { Skeleton } from "./Skeleton";

const PAGE_SIZE = 20;

const TH_BASE = "px-5 py-3 text-sm font-medium text-zinc-500";

export function CashCollections({ boothId }: { boothId: string }) {
  const [offset, setOffset] = useState(0);

  const query = useBoothCashCollections(boothId, { limit: PAGE_SIZE, offset });
  const collections = query.data?.collections ?? [];
  const total = query.data?.total ?? 0;
  const hasData = collections.length > 0;

  const goPrev = useCallback(
    () => setOffset((o) => Math.max(0, o - PAGE_SIZE)),
    [],
  );
  const goNext = useCallback(() => setOffset((o) => o + PAGE_SIZE), []);

  const canPrev = offset > 0;
  // Gate Next on the authoritative full count AND placeholder state, so the
  // user can't page past not-yet-loaded data.
  const canNext = !query.isPlaceholderData && offset + PAGE_SIZE < total;
  const rangeStart = total === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + PAGE_SIZE, total);

  const errorMessage =
    query.error instanceof Error
      ? query.error.message
      : "Failed to load collection history.";

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Collection History
        </h2>
        <p className="text-sm text-zinc-500">
          Every operator pickup, newest first
        </p>
      </div>

      {query.isError && !hasData ? (
        // First-load failure with nothing cached → full error state.
        <div
          role="alert"
          className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4"
        >
          <p className="text-sm text-red-500 break-words">{errorMessage}</p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 shrink-0"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] overflow-hidden">
          {/* Non-destructive error: a failed page fetch keeps the cached rows
              visible and surfaces an inline retry instead of blanking the list. */}
          {query.isError && hasData && (
            <div
              role="alert"
              className="flex items-center justify-between gap-4 px-5 py-3 bg-red-500/10 border-b border-red-500/20"
            >
              <p className="text-sm text-red-500 break-words">
                Couldn&apos;t refresh: {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => query.refetch()}
                className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {query.isLoading ? (
            <div className="divide-y divide-slate-200 dark:divide-zinc-800">
              {["a", "b", "c", "d", "e"].map((k) => (
                <div key={k} className="px-5 py-4">
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
          ) : !hasData ? (
            <div className="px-5 py-12 text-center">
              <p className="text-zinc-500">No collections recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Cash-box collection history, newest first
                </caption>
                <thead className="bg-slate-50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className={`${TH_BASE} text-left`}>
                      Collected
                    </th>
                    <th scope="col" className={`${TH_BASE} text-right`}>
                      Amount
                    </th>
                    <th scope="col" className={`${TH_BASE} text-right`}>
                      Acceptor 1
                    </th>
                    <th scope="col" className={`${TH_BASE} text-right`}>
                      Acceptor 2
                    </th>
                    <th scope="col" className={`${TH_BASE} text-left`}>
                      Collected by
                    </th>
                    <th scope="col" className={`${TH_BASE} text-left`}>
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y divide-slate-200 dark:divide-zinc-800 ${
                    query.isPlaceholderData ? "opacity-60 transition-opacity" : ""
                  }`}
                >
                  {collections.map((row) => (
                    <tr key={row.id}>
                      <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {formatDateTime(row.collected_at)}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-[#069494] whitespace-nowrap">
                        {formatCurrency(row.total_amount)}
                      </td>
                      <td className="px-5 py-4 text-right text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {formatBillAmount(row.bill1_amount)}
                      </td>
                      <td className="px-5 py-4 text-right text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {formatBillAmount(row.bill2_amount)}
                      </td>
                      <td className="px-5 py-4 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                        {resolveCollectorName(row.collected_by_name)}
                      </td>
                      <td
                        className="px-5 py-4 text-zinc-500 max-w-[16rem] truncate"
                        title={row.note ?? undefined}
                      >
                        {row.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer pager — shown only when there is something to page */}
          {!query.isLoading && total > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500">
                Showing {rangeStart}–{rangeEnd} of {total}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!canPrev}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-zinc-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹ Prev
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-zinc-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
