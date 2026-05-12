"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/core/api/client";
import { submitCancellationFeedback } from "@/core/api/feedback";
import type { CancellationReason } from "@/core/api/feedback";
import { getBoothSubscription } from "@/core/api/payments";

const COMMENT_MAX = 2000;

const REASON_OPTIONS: ReadonlyArray<{ value: CancellationReason; label: string }> = [
  { value: "too_expensive", label: "Too expensive" },
  { value: "missing_features", label: "Missing features I need" },
  { value: "switched_competitor", label: "Switched to another product" },
  { value: "not_using", label: "Not using it enough" },
  { value: "technical_issues", label: "Technical issues" },
  { value: "other", label: "Something else" },
];

type ResolveState =
  | { status: "loading" }
  | { status: "ready"; subscriptionId: string; boothName: string | null }
  | { status: "still_active" }
  | { status: "missing" };

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{title}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mt-1">{subtitle}</p>
    </div>
  );
}

function BackToDashboardLink() {
  return (
    <Link
      href="/dashboard/booths"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] transition-colors"
    >
      Back to dashboard
    </Link>
  );
}

export function SubscriptionCancelledForm() {
  const searchParams = useSearchParams();
  const subIdParam = searchParams.get("sub_id");
  const boothIdParam = searchParams.get("booth_id");

  const [resolve, setResolve] = useState<ResolveState>(() => {
    if (subIdParam && subIdParam.startsWith("sub_")) {
      return { status: "ready", subscriptionId: subIdParam, boothName: null };
    }
    if (boothIdParam) {
      return { status: "loading" };
    }
    return { status: "missing" };
  });

  const [reason, setReason] = useState<CancellationReason | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resolve.status !== "loading" || !boothIdParam) return;
    let cancelled = false;
    (async () => {
      try {
        const item = await getBoothSubscription(boothIdParam);
        if (cancelled) return;
        const isCancelled =
          item.status === "canceled" || item.cancel_at_period_end === true;
        if (isCancelled && item.subscription_id) {
          setResolve({
            status: "ready",
            subscriptionId: item.subscription_id,
            boothName: item.booth_name ?? null,
          });
        } else {
          setResolve({ status: "still_active" });
        }
      } catch {
        if (!cancelled) setResolve({ status: "missing" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resolve.status, boothIdParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resolve.status !== "ready" || !reason || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const trimmed = comment.trim();
    try {
      await submitCancellationFeedback({
        stripe_subscription_id: resolve.subscriptionId,
        reason,
        comment: trimmed.length > 0 ? trimmed : undefined,
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          // Already submitted on another tab/device - treat as success.
          setSubmitted(true);
        } else if (err.status === 400) {
          setError(
            "This subscription isn't eligible for feedback. It may be older than 60 days or already submitted from another device.",
          );
        } else if (err.status === 422) {
          setError("Something looks off with the form. Please refresh and try again.");
        } else {
          setError("Failed to send feedback. Please try again.");
        }
      } else {
        setError("Failed to send feedback. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <PageHeader
          title="Thanks for sharing"
          subtitle="Your feedback helps us improve BoothIQ for everyone."
        />
        <div className="bg-white dark:bg-[#111111] border border-[var(--border)] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[#10B981]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <BackToDashboardLink />
        </div>
      </>
    );
  }

  if (resolve.status === "loading") {
    return (
      <>
        <PageHeader
          title="One moment"
          subtitle="Checking your subscription."
        />
        <div className="bg-white dark:bg-[#111111] border border-[var(--border)] rounded-2xl p-8 text-center">
          <div className="w-8 h-8 mx-auto border-2 border-[#069494] border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (resolve.status === "still_active") {
    return (
      <>
        <PageHeader
          title="Your subscription is still active"
          subtitle="Nothing changed. You can keep using BoothIQ."
        />
        <div className="bg-white dark:bg-[#111111] border border-[var(--border)] rounded-2xl p-8 text-center">
          <BackToDashboardLink />
        </div>
      </>
    );
  }

  if (resolve.status === "missing") {
    return (
      <>
        <PageHeader
          title="We couldn't find a recent cancellation"
          subtitle="If you just cancelled, head back to your booths and try again from there."
        />
        <div className="bg-white dark:bg-[#111111] border border-[var(--border)] rounded-2xl p-8 text-center">
          <BackToDashboardLink />
        </div>
      </>
    );
  }

  const overLimit = comment.trim().length > COMMENT_MAX;
  const canSubmit = reason !== null && !overLimit && !isSubmitting;

  return (
    <>
      <PageHeader
        title="Sorry to see you go"
        subtitle="Help us improve by telling us why you cancelled. This takes 30 seconds."
      />
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#111111] border border-[var(--border)] rounded-2xl p-6 space-y-6"
      >
        {resolve.boothName && (
          <p className="text-sm text-zinc-500">
            Cancelling for{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {resolve.boothName}
            </span>
          </p>
        )}

        <fieldset className="space-y-2" aria-required="true">
          <legend className="text-sm font-medium mb-2 text-zinc-900 dark:text-white">
            Why did you cancel? <span className="text-red-500">*</span>
          </legend>
          <div className="space-y-1">
            {REASON_OPTIONS.map((option) => {
              const checked = reason === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    checked
                      ? "border-[#069494] bg-[#069494]/5"
                      : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={option.value}
                    checked={checked}
                    onChange={() => setReason(option.value)}
                    className="w-4 h-4 text-[#069494] focus:ring-2 focus:ring-[#069494]"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-200">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white"
          >
            Anything else? (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            maxLength={COMMENT_MAX + 200}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#069494] focus:border-transparent transition-all resize-none"
            placeholder="What could we have done differently?"
          />
          <div className="flex justify-end mt-1">
            <span
              className={`text-xs ${
                overLimit
                  ? "text-red-500"
                  : "text-zinc-500"
              }`}
            >
              {comment.length}/{COMMENT_MAX}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              "Send feedback"
            )}
          </button>
          <div className="text-center">
            <Link
              href="/dashboard/booths"
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              Skip and go to dashboard
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
