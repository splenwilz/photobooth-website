"use client";

/**
 * StrandedSessionDetailsModal
 *
 * Detail view + refund form for a single stranded paid session. Ported from
 * the mobile app's `components/booths/StrandedSessionDetailsModal.tsx`.
 *
 * Key patterns preserved from the mobile source:
 * - Session-token guard (`modalSessionRef`): if the modal is closed or a
 *   different row is loaded while a refund is in flight, the late response
 *   is silently discarded instead of firing on the wrong row.
 * - Dual-source refund detection: reads refund state from BOTH `event.refund`
 *   and `transaction.refunded_at`. Closes the brief race window where one
 *   query has refetched but the other hasn't, which would otherwise let the
 *   UI offer the Refund button on a transaction the server already refunded.
 *
 * @see POST /api/v1/booths/{booth_id}/transactions/{transaction_code}/refund
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRefundBoothTransaction } from "@/core/api/booths";
import {
  formatStrandedReason,
  inferRefundMethod,
  type StrandedSessionRow,
} from "@/core/api/booths";
import type { RefundMethod } from "@/core/api/booths/types";

interface StrandedSessionDetailsModalProps {
  isOpen: boolean;
  boothId: string;
  row: StrandedSessionRow | null;
  onClose: () => void;
}

const REFUND_METHOD_OPTIONS: { value: RefundMethod; label: string }[] = [
  { value: "cash_till", label: "Cash Till" },
  { value: "card_void", label: "Card Void" },
  { value: "manual_credit_reverse", label: "Manual Credit" },
  { value: "other", label: "Other" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDateTime(timestamp: string): string {
  const d = new Date(timestamp);
  const datePart = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} · ${timePart}`;
}

function methodLabel(m: RefundMethod): string {
  return REFUND_METHOD_OPTIONS.find((o) => o.value === m)?.label ?? m;
}

export function StrandedSessionDetailsModal({
  isOpen,
  boothId,
  row,
  onClose,
}: StrandedSessionDetailsModalProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const amountId = `${reactId}-amount`;
  const noteId = `${reactId}-note`;

  const refundMutation = useRefundBoothTransaction();

  // ── Dual-source refund detection ────────────────────────────────────
  // Read refund state from BOTH the event (server-joined) and the transaction
  // (authoritative), merging so the earliest-refreshed source is respected.
  const eventRefund = row?.event.refund ?? null;
  const transactionRefundedAt = row?.transaction?.refunded_at ?? null;
  const isRefunded = eventRefund !== null || transactionRefundedAt !== null;

  const refundSummary = eventRefund
    ? {
        refunded_at: eventRefund.refunded_at,
        refunded_by_user_id: eventRefund.refunded_by_user_id,
        refund_amount: eventRefund.refund_amount,
        refund_method: eventRefund.refund_method,
        refund_note: row?.transaction?.refund_note ?? null,
      }
    : row?.transaction?.refunded_at
      ? {
          refunded_at: row.transaction.refunded_at,
          refunded_by_user_id: row.transaction.refunded_by_user_id ?? "",
          refund_amount: row.transaction.refund_amount ?? 0,
          refund_method: (row.transaction.refund_method ??
            "other") as RefundMethod,
          refund_note: row.transaction.refund_note,
        }
      : null;

  // ── Max refundable ──────────────────────────────────────────────────
  const maxRefundable =
    row?.transaction?.total_price ?? row?.event.transaction_total_price ?? null;

  // ── Defaults (derived from fresh data) ──────────────────────────────
  const defaultAmount =
    maxRefundable !== null && maxRefundable !== undefined
      ? maxRefundable.toFixed(2)
      : "";
  const defaultMethod: RefundMethod = inferRefundMethod(
    row?.transaction?.payment_method,
  );

  // ── Form state ──────────────────────────────────────────────────────
  const [amount, setAmount] = useState(defaultAmount);
  const [method, setMethod] = useState<RefundMethod>(defaultMethod);
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // ── Refs ────────────────────────────────────────────────────────────
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Session token: bumped whenever the modal opens/closes OR row changes.
  // Late refund responses that capture an older token are silently ignored.
  const modalSessionRef = useRef(0);
  useEffect(() => {
    modalSessionRef.current += 1;
  }, [isOpen, row?.event.id]);

  const amountInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Reset form when modal opens or a different row is shown ─────────
  // Skip reset while a refund is in-flight to avoid clobbering user input.
  const rowKey = row?.event.id ?? null;
  const isRefundPending = refundMutation.isPending;
  useEffect(() => {
    if (!isOpen) return;
    if (isRefundPending) return;
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate from async row data */
    setAmount(defaultAmount);
    setMethod(defaultMethod);
    setNote("");
    setFormError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [
    isOpen,
    rowKey,
    defaultAmount,
    defaultMethod,
    isRefundPending,
  ]);

  // ── Close handler (blocks during pending mutation) ──────────────────
  const handleClose = useCallback(() => {
    if (refundMutation.isPending) return;
    onClose();
  }, [refundMutation.isPending, onClose]);

  // ── Escape + focus management ──────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    amountInputRef.current?.focus();
    amountInputRef.current?.select();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleClose]);

  // ── Copy transaction code ──────────────────────────────────────────
  const handleCopyCode = async () => {
    if (!row?.event.transaction_code) return;
    try {
      await navigator.clipboard.writeText(row.event.transaction_code);
      setFormError(null);
    } catch {
      setFormError("Could not copy code to clipboard.");
    }
  };

  // ── Validation ─────────────────────────────────────────────────────
  const parsedAmount = Number(amount);
  const amountInvalid =
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    (maxRefundable !== null &&
      maxRefundable !== undefined &&
      parsedAmount > maxRefundable + 0.0001);

  const noteTooLong = note.length > 1000;
  const canSubmit =
    !!row?.event.transaction_code &&
    !isRefunded &&
    !amountInvalid &&
    !noteTooLong &&
    !refundMutation.isPending;

  // ── Submit handler ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !row?.event.transaction_code) return;
    setFormError(null);

    const submissionSession = modalSessionRef.current;
    const isStillThisSession = () =>
      isMountedRef.current && submissionSession === modalSessionRef.current;

    try {
      const trimmedNote = note.trim();
      await refundMutation.mutateAsync({
        boothId,
        transactionCode: row.event.transaction_code,
        amount: parsedAmount,
        method,
        ...(trimmedNote ? { note: trimmedNote } : {}),
      });
      if (!isStillThisSession()) return;
      onClose();
    } catch (err) {
      if (!isStillThisSession()) return;
      setFormError(err instanceof Error ? err.message : "Refund failed.");
    }
  };

  if (!isOpen || !row) return null;

  const { event, transaction } = row;
  const reasonLabel = formatStrandedReason(transaction?.stranded_reason);
  const paymentMethod =
    transaction?.payment_method ?? event.refund?.refund_method ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close refund details"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={handleClose}
        tabIndex={-1}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[var(--border)] bg-white dark:bg-[#111111]">
          <h2
            id={titleId}
            className="text-xl font-semibold text-zinc-900 dark:text-white"
          >
            {isRefunded ? "Refund Record" : "Record Refund"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={refundMutation.isPending}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Status badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              isRefunded
                ? "bg-green-500/15 text-green-600 dark:text-green-400"
                : "bg-red-500/15 text-red-600 dark:text-red-400"
            }`}
          >
            {isRefunded ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Refunded{" "}
                  {refundSummary
                    ? formatCurrency(refundSummary.refund_amount)
                    : ""}
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{reasonLabel}</span>
              </>
            )}
          </div>

          {/* Amount + payment method headline */}
          <div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">
              {maxRefundable !== null && maxRefundable !== undefined
                ? formatCurrency(maxRefundable)
                : "—"}
            </p>
            {paymentMethod && (
              <p className="text-sm text-zinc-500 mt-1">
                Paid via {paymentMethod}
              </p>
            )}
          </div>

          {/* Transaction code */}
          {event.transaction_code && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-[var(--border)]">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
                Customer Reference Code
              </p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono text-zinc-900 dark:text-white break-all">
                  {event.transaction_code}
                </code>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2 py-1 text-xs rounded-md bg-[#069494]/15 text-[#069494] hover:bg-[#069494]/25 transition-colors shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Inline error banner */}
          {formError && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <p className="text-sm text-red-500 break-words">{formError}</p>
            </div>
          )}

          {/* Refund details: read-only OR form */}
          {isRefunded && refundSummary ? (
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-2 text-sm">
              <Row label="Amount" value={formatCurrency(refundSummary.refund_amount)} />
              <Row
                label="Method"
                value={methodLabel(refundSummary.refund_method)}
              />
              <Row
                label="When"
                value={formatDateTime(refundSummary.refunded_at)}
              />
              {refundSummary.refunded_by_user_id && (
                <Row label="By" value={refundSummary.refunded_by_user_id} />
              )}
              {refundSummary.refund_note && (
                <div className="pt-2 border-t border-green-500/20">
                  <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
                    Note
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
                    {refundSummary.refund_note}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Amount field */}
              <div className="space-y-2">
                <label
                  htmlFor={amountId}
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Refund Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    $
                  </span>
                  <input
                    id={amountId}
                    ref={amountInputRef}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={refundMutation.isPending}
                    className={`w-full pl-8 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                      amountInvalid && amount !== ""
                        ? "border-red-500/60 focus:border-red-500 focus:ring-red-500"
                        : "border-[var(--border)] focus:border-[#069494] focus:ring-[#069494]"
                    }`}
                  />
                </div>
                {maxRefundable !== null && maxRefundable !== undefined && (
                  <p className="text-xs text-zinc-500">
                    Max: {formatCurrency(maxRefundable)}
                  </p>
                )}
              </div>

              {/* Method chip selector */}
              <div className="space-y-2">
                <fieldset>
                  <legend className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Refund Method
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {REFUND_METHOD_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMethod(opt.value)}
                        disabled={refundMutation.isPending}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 ${
                          method === opt.value
                            ? "bg-[#069494] text-white border-[#069494]"
                            : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-[var(--border)] hover:border-[#069494]/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Note field */}
              <div className="space-y-2">
                <label
                  htmlFor={noteId}
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Note <span className="text-zinc-500">(optional)</span>
                </label>
                <textarea
                  id={noteId}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Receipt number, incident context, etc."
                  maxLength={1000}
                  rows={3}
                  disabled={refundMutation.isPending}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50 resize-none"
                />
                <p className="text-xs text-zinc-500 text-right">
                  {note.length} / 1000
                </p>
              </div>
            </>
          )}

          {/* Incident details */}
          {event.details && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-[var(--border)]">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
                Incident Details
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-mono whitespace-pre-wrap break-words">
                {event.details}
              </p>
            </div>
          )}

          {/* Guidance */}
          {!isRefunded && (
            <p className="text-xs text-zinc-500 leading-relaxed">
              Return funds physically (till or local card void) before recording the refund. This endpoint records accounting closure only; it does not move money.
            </p>
          )}

          {/* Footer actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={refundMutation.isPending}
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {isRefunded ? "Done" : "Cancel"}
            </button>
            {!isRefunded && (
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 px-4 py-3 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {refundMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Recording...
                  </>
                ) : (
                  "Record Refund"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <span className="text-sm text-zinc-900 dark:text-white text-right break-words">
        {value}
      </span>
    </div>
  );
}
