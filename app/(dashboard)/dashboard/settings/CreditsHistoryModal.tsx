"use client";

/**
 * CreditsHistoryModal
 *
 * Paginated list of credit transactions for a booth. Shows current balance
 * up top, then each transaction with its type, amount, source, and time.
 * "Load more" button appends the next page via the existing infinite query.
 *
 * Filters and swipe-to-delete from the mobile app are deliberately omitted
 * here: the goal of this first cut is to make the History button work end
 * to end. Add filters later if operators need them on the dashboard.
 *
 * @see GET /api/v1/booths/{booth_id}/credits/history
 */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  useCreditsHistoryInfinite,
  useDeleteCreditsHistory,
} from "@/core/api/credits";
import type {
  CreditTransaction,
  CreditTransactionType,
} from "@/core/api/credits/types";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useFocusTrap } from "@/lib/use-focus-trap";

interface CreditsHistoryModalProps {
  boothId: string | null;
  boothName?: string;
  currentBalance?: number;
  onClose: () => void;
}

const PAGE_SIZE = 20;

export function CreditsHistoryModal({
  boothId,
  boothName,
  currentBalance,
  onClose,
}: CreditsHistoryModalProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock background scroll and trap Tab focus while the modal is mounted.
  useBodyScrollLock();
  useFocusTrap(dialogRef);

  // "Clear all" inline confirmation: false = idle, true = confirm strip shown.
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);
  const deleteHistoryMutation = useDeleteCreditsHistory();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCreditsHistoryInfinite(boothId, { limit: PAGE_SIZE });

  // Flatten all pages into a single ordered list. The hook already
  // appends pages in fetch order, which matches API offset order.
  const transactions = useMemo<CreditTransaction[]>(
    () => data?.pages.flatMap((p) => p.transactions) ?? [],
    [data],
  );

  // Total reported by the most recent page (server-truth count).
  const total = data?.pages[data.pages.length - 1]?.total ?? 0;

  // Focus management. Escape closes (unless we're mid-clear).
  const isClearingRef = useRef(deleteHistoryMutation.isPending);
  useEffect(() => {
    isClearingRef.current = deleteHistoryMutation.isPending;
  }, [deleteHistoryMutation.isPending]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isClearingRef.current) {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  const handleConfirmClear = async () => {
    if (!boothId) return;
    setClearError(null);
    try {
      // No filter params = delete all history rows for this booth.
      await deleteHistoryMutation.mutateAsync({ boothId });
      setConfirmClear(false);
      // The mutation hook already invalidates history + balance queries,
      // so the list refetches itself and the empty state takes over.
    } catch (err) {
      setClearError(
        err instanceof Error
          ? err.message
          : "Failed to clear history. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close credits history"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={() => {
          if (!deleteHistoryMutation.isPending) onClose();
        }}
        tabIndex={-1}
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-xl font-semibold text-zinc-900 dark:text-white"
            >
              Credits History
            </h2>
            <p className="text-sm text-zinc-500 mt-1 truncate">
              {boothName ?? "Booth"}
              {typeof currentBalance === "number" && (
                <>
                  {" · "}
                  <span className="text-[#069494] font-medium">
                    {currentBalance.toLocaleString()} credits
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            disabled={deleteHistoryMutation.isPending}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <title>Close</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-3">
          {/* Initial loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-[#069494] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-zinc-500">Loading transactions...</p>
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <p className="text-base font-medium text-zinc-900 dark:text-white">
                Failed to load history
              </p>
              <p className="text-sm text-zinc-500 text-center max-w-sm">
                {error instanceof Error
                  ? error.message
                  : "An error occurred while fetching credit history."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 px-4 py-2 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <title>Empty</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">No transactions yet</p>
            </div>
          )}

          {/* Transaction list */}
          {!isLoading && !isError && transactions.length > 0 && (
            <>
              <ul className="space-y-2">
                {transactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </ul>

              {/* Footer: count + actions, or inline confirmation strip. */}
              <div className="pt-2 space-y-2">
                {confirmClear ? (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-3">
                    <p className="text-sm text-zinc-900 dark:text-white">
                      Permanently delete all{" "}
                      <span className="font-semibold">
                        {total.toLocaleString()}
                      </span>{" "}
                      transaction{total === 1 ? "" : "s"} for this booth?
                      This cannot be undone.
                    </p>
                    {clearError && (
                      <p className="text-xs text-red-500">{clearError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmClear(false);
                          setClearError(null);
                        }}
                        disabled={deleteHistoryMutation.isPending}
                        className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmClear}
                        disabled={deleteHistoryMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deleteHistoryMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Clearing...
                          </>
                        ) : (
                          "Yes, clear all"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-zinc-500">
                      Showing {transactions.length.toLocaleString()} of{" "}
                      {total.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      {hasNextPage && (
                        <button
                          type="button"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          {isFetchingNextPage ? (
                            <>
                              <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Load more"
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setConfirmClear(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        Clear history
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<
  CreditTransactionType,
  { sign: string; color: string; bg: string; label: string }
> = {
  Add: {
    sign: "+",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Added",
  },
  Deduct: {
    sign: "−",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    label: "Deducted",
  },
  Reset: {
    sign: "",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    label: "Reset",
  },
};

const SOURCE_LABEL: Record<string, string> = {
  booth_admin: "Booth admin",
  mobile_app: "Mobile app",
  system: "System",
  booth: "Booth",
};

function TransactionRow({ tx }: { tx: CreditTransaction }) {
  const style = TYPE_STYLES[tx.transaction_type];
  const sourceLabel = SOURCE_LABEL[tx.source] ?? tx.source;
  const createdAt = new Date(tx.created_at);

  return (
    <li className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-zinc-900/40 border border-[var(--border)]">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span
          className={`shrink-0 mt-0.5 w-9 h-9 rounded-full flex items-center justify-center font-semibold ${style.bg} ${style.color}`}
        >
          {style.sign || "·"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
            {tx.description || style.label}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            <span>{sourceLabel}</span>
            <span className="mx-1.5">·</span>
            <time
              dateTime={tx.created_at}
              title={createdAt.toLocaleString()}
            >
              {createdAt.toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </time>
            {tx.status !== "completed" && (
              <>
                <span className="mx-1.5">·</span>
                <span className="capitalize text-amber-600 dark:text-amber-400">
                  {tx.status}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold ${style.color}`}>
          {style.sign}
          {tx.amount.toLocaleString()}
        </p>
        {tx.balance_after !== null && (
          <p className="text-xs text-zinc-500 mt-0.5">
            bal {tx.balance_after.toLocaleString()}
          </p>
        )}
      </div>
    </li>
  );
}
