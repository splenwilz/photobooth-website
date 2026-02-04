"use client";

/**
 * Manage Subscription Modal
 *
 * Shows current subscription details for a booth and allows
 * the user to manage via Stripe Customer Portal or cancel.
 */

import { useState } from "react";
import type { BoothSubscription } from "@/core/api/booths";
import { usePricingPlans } from "@/core/api/pricing";
import { createPortalSession, cancelBoothSubscription } from "@/core/api/payments";

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  boothId: string | null;
  boothName: string;
  subscription: BoothSubscription | null;
  onClose: () => void;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusDisplay(status: string): { label: string; color: string; bgColor: string } {
  switch (status) {
    case "active":
      return { label: "Active", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30" };
    case "trialing":
      return { label: "Trial", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30" };
    case "past_due":
      return { label: "Past Due", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" };
    case "canceled":
      return { label: "Canceled", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" };
    default:
      return { label: status, color: "text-zinc-600 dark:text-zinc-400", bgColor: "bg-zinc-100 dark:bg-zinc-800" };
  }
}

export function ManageSubscriptionModal({
  isOpen,
  boothId,
  boothName,
  subscription,
  onClose,
}: ManageSubscriptionModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: plansData } = usePricingPlans();
  const plans = plansData?.plans ?? [];

  // Find the current plan details
  const currentPlan = plans.find((p) => p.id === subscription?.plan_id);

  // Detect if subscription is annual by comparing price_id
  const isAnnualBilling = currentPlan && subscription?.price_id
    ? subscription.price_id === currentPlan.stripe_annual_price_id
    : false;

  // Get the correct price display based on billing interval
  const priceDisplay = currentPlan
    ? isAnnualBilling && currentPlan.annual_price_display
      ? currentPlan.annual_price_display
      : currentPlan.price_display
    : null;

  const handleOpenPortal = async () => {
    setIsLoadingPortal(true);
    setError(null);

    try {
      const result = await createPortalSession({
        return_url: `${window.location.origin}/dashboard/booths`,
      });

      if (result.portal_url) {
        window.location.href = result.portal_url;
      } else {
        setError(result.error_message || "Failed to open billing portal");
        setIsLoadingPortal(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open billing portal");
      setIsLoadingPortal(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!boothId) return;

    setIsCanceling(true);
    setError(null);

    try {
      await cancelBoothSubscription(boothId, false); // Cancel at period end
      setShowCancelConfirm(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel subscription");
      setIsCanceling(false);
    }
  };

  if (!isOpen || !subscription) return null;

  const statusDisplay = getStatusDisplay(subscription.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)]">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Subscription Details
              </h2>
              <p className="text-sm text-zinc-500 mt-1">{boothName}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Plan Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {subscription.plan_name ?? "Unknown Plan"}
                </p>
                {priceDisplay && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-zinc-500">
                      {priceDisplay}
                    </p>
                    {isAnnualBilling && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        Annual
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusDisplay.bgColor} ${statusDisplay.color}`}>
                {statusDisplay.label}
              </span>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-sm text-zinc-500">Status</span>
              <span className={`text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.label}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-sm text-zinc-500">
                {subscription.cancel_at_period_end
                  ? "Access Until"
                  : isAnnualBilling
                    ? "Renews On"
                    : "Next Billing Date"}
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {formatDate(subscription.current_period_end)}
              </span>
            </div>

            {subscription.cancel_at_period_end && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your subscription will end on {formatDate(subscription.current_period_end)}.
                  You can continue using the service until then.
                </p>
              </div>
            )}

            {subscription.status === "past_due" && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                  Your payment is past due. Please update your payment method to continue service.
                </p>
              </div>
            )}
          </div>

          {/* Plan Features */}
          {currentPlan && currentPlan.features.length > 0 && (
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Plan Features
              </p>
              <div className="space-y-2">
                {currentPlan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[var(--border)]">
          {showCancelConfirm ? (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Are you sure you want to cancel? You&apos;ll lose access at the end of your current billing period.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                >
                  Keep Subscription
                </button>
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isCanceling ? "Canceling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Manage Billing Button - Opens Stripe Portal */}
              <button
                type="button"
                onClick={handleOpenPortal}
                disabled={isLoadingPortal}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-[#0891B2] text-white hover:bg-[#0E7490] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoadingPortal ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Opening Portal...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                    Manage Billing
                  </>
                )}
              </button>

              <p className="text-xs text-zinc-500 text-center">
                Change plan, update payment method, or view invoices
              </p>

              {/* Cancel Button */}
              {!subscription.cancel_at_period_end && subscription.status !== "canceled" && (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full px-4 py-2 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
