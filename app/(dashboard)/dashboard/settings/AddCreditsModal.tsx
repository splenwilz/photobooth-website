"use client";

/**
 * AddCreditsModal
 *
 * Operator-facing modal for topping up a booth's credit balance. Quick
 * preset amounts plus a custom input. 1 credit = $1.
 *
 * Mirrors the mobile app's AddCreditsModal but uses the website's modal
 * pattern (centered card, conditional mount on the parent so each open is
 * a fresh component instance with reset state).
 *
 * @see POST /api/v1/booths/{booth_id}/credits
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAddCredits } from "@/core/api/credits";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useFocusTrap } from "@/lib/use-focus-trap";

const QUICK_CREDIT_AMOUNTS = [50, 100, 250, 500, 1000] as const;

interface AddCreditsModalProps {
  /**
   * Booth to credit. Required for the API call. The parent should only
   * mount this modal when a booth is selected; the hook short-circuits
   * if it's somehow null.
   */
  boothId: string | null;
  boothName?: string;
  /** Current balance, shown for context above the picker. */
  currentBalance?: number;
  onClose: () => void;
}

export function AddCreditsModal({
  boothId,
  boothName,
  currentBalance,
  onClose,
}: AddCreditsModalProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const customInputId = `${reactId}-custom`;

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock background scroll and trap Tab focus while the modal is mounted.
  useBodyScrollLock();
  useFocusTrap(dialogRef);

  const addCreditsMutation = useAddCredits();

  // Resolve the chosen amount from whichever input is active.
  // parseInt returns NaN on empty input; `|| 0` collapses NaN and 0
  // to a single non-positive value, so `amount > 0` is the only check
  // that matters for validity.
  const amount = isCustom
    ? Number.parseInt(customAmount, 10) || 0
    : (selectedAmount ?? 0);
  const isValid = amount > 0;

  // Focus management. Escape closes unless a mutation is in flight (don't
  // want to lose feedback in the middle of a submit).
  const isPendingRef = useRef(addCreditsMutation.isPending);
  useEffect(() => {
    isPendingRef.current = addCreditsMutation.isPending;
  }, [addCreditsMutation.isPending]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPendingRef.current) {
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

  const handleSelectQuick = useCallback((value: number) => {
    setSelectedAmount(value);
    setIsCustom(false);
    setCustomAmount("");
    setFormError(null);
  }, []);

  const handleCustomFocus = useCallback(() => {
    setIsCustom(true);
    setSelectedAmount(null);
    setFormError(null);
  }, []);

  const handleCustomChange = useCallback((value: string) => {
    // Strip non-digits so the parsed integer is always non-negative.
    const digitsOnly = value.replace(/[^0-9]/g, "").slice(0, 7);
    setCustomAmount(digitsOnly);
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid || !boothId || addCreditsMutation.isPending) return;

      try {
        await addCreditsMutation.mutateAsync({
          boothId,
          amount,
          reason: `Added ${amount} credits via dashboard`,
        });
        onClose();
      } catch (err) {
        setFormError(
          err instanceof Error
            ? err.message
            : "Failed to add credits. Please try again.",
        );
      }
    },
    [amount, addCreditsMutation, boothId, isValid, onClose],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close add credits modal"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={() => {
          if (!addCreditsMutation.isPending) onClose();
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
        className="relative w-full max-w-lg mx-4 max-h-[90vh] flex flex-col bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-xl font-semibold text-zinc-900 dark:text-white"
            >
              Add Credits
            </h2>
            <p className="text-sm text-zinc-500 mt-1 truncate">
              {boothName ? `${boothName} · ` : ""}1 credit = $1
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            disabled={addCreditsMutation.isPending}
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
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6 space-y-5"
        >
          {/* Current balance */}
          {typeof currentBalance === "number" && (
            <div className="flex items-baseline justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-[var(--border)]">
              <span className="text-sm text-zinc-500">Current balance</span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {currentBalance.toLocaleString()} credits
              </span>
            </div>
          )}

          {/* Quick amount cards */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Select amount
            </p>
            <div className="grid grid-cols-1 gap-2">
              {QUICK_CREDIT_AMOUNTS.map((value) => {
                const isSelected = selectedAmount === value && !isCustom;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSelectQuick(value)}
                    disabled={addCreditsMutation.isPending}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-[#069494]/10 border-[#069494]"
                        : "bg-white dark:bg-zinc-900/40 border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {value.toLocaleString()}{" "}
                        <span className="text-sm font-normal text-zinc-500">
                          credits
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-[#069494]">
                        ${value.toLocaleString()}
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-[#069494]"
                            : "border-zinc-400 dark:border-zinc-600"
                        }`}
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#069494]" />
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/*
               * Custom amount card.
               *
               * The card is a <label> wired to the inner <input> via htmlFor,
               * not a <button>. Nesting an <input> inside a <button> is
               * invalid HTML and breaks screen-reader announcement; using a
               * <label> gives us the same "click anywhere on the card to
               * focus the input" UX while keeping the input as the only
               * interactive element. focus-within paints the active state
               * when the input is focused.
               */}
              <label
                htmlFor={customInputId}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-text transition-all focus-within:ring-2 focus-within:ring-[#069494]/30 ${
                  isCustom
                    ? "bg-[#069494]/10 border-[#069494]"
                    : "bg-white dark:bg-zinc-900/40 border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700"
                } ${addCreditsMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  ref={customInputRef}
                  id={customInputId}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  onFocus={handleCustomFocus}
                  placeholder="Custom amount"
                  maxLength={7}
                  disabled={addCreditsMutation.isPending}
                  className="flex-1 mr-3 bg-transparent text-lg font-semibold text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none disabled:cursor-not-allowed"
                />
                {isCustom && customAmount && (
                  <span className="text-base font-semibold text-[#069494]">
                    ${(Number.parseInt(customAmount, 10) || 0).toLocaleString()}
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Error */}
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500">{formError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={addCreditsMutation.isPending}
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || !boothId || addCreditsMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {addCreditsMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : amount > 0 ? (
                `Add ${amount.toLocaleString()} Credits`
              ) : (
                "Add Credits"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
