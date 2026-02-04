"use client";

/**
 * Subscribe Booth Modal
 *
 * Allows users to subscribe a booth to a pricing plan.
 * Fetches available plans and initiates Stripe checkout.
 */

import { useState } from "react";
import { usePricingPlans, createSubscriptionCheckout } from "@/core/api/pricing";

interface SubscribeBoothModalProps {
  isOpen: boolean;
  boothId: string | null;
  boothName: string;
  onClose: () => void;
}

export function SubscribeBoothModal({
  isOpen,
  boothId,
  boothName,
  onClose,
}: SubscribeBoothModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: plansData, isLoading: plansLoading } = usePricingPlans();
  const plans = plansData?.plans ?? [];

  const hasAnyAnnualOption = plans.some((p) => p.has_annual_option);

  const handleSubscribe = async () => {
    if (!selectedPlanId || !boothId) return;

    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!plan) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the appropriate price ID
      const priceId = isAnnual && plan.stripe_annual_price_id
        ? plan.stripe_annual_price_id
        : plan.stripe_price_id;

      // Create checkout session via API
      // Use {CHECKOUT_SESSION_ID} placeholder - Stripe replaces this with actual session ID
      const result = await createSubscriptionCheckout(boothId, {
        price_id: priceId,
        booth_id: boothId,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=subscription&booth_id=${boothId}`,
        cancel_url: `${window.location.origin}/dashboard/booths?canceled=true`,
      });

      // Redirect to Stripe Checkout
      window.location.href = result.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create checkout session");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Subscribe Booth
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Choose a plan for <span className="font-medium text-zinc-700 dark:text-zinc-300">{boothName}</span>
              </p>
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

          {/* Billing Toggle */}
          {hasAnyAnnualOption && (
            <div className="mt-4 flex items-center gap-3">
              <span className={`text-sm ${!isAnnual ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-500"}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isAnnual ? "bg-[#0891B2]" : "bg-slate-300 dark:bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isAnnual ? "left-7" : "left-1"
                  }`}
                />
              </button>
              <span className={`text-sm ${isAnnual ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-500"}`}>
                Annual
              </span>
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {plansLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-[var(--border)] animate-pulse">
                  <div className="h-6 w-32 bg-slate-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="h-4 w-48 bg-slate-200 dark:bg-zinc-700 rounded" />
                </div>
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500">No plans available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isFree = plan.price_cents === 0;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-[#0891B2] bg-[#0891B2]/5"
                        : "border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-zinc-900 dark:text-white">
                            {plan.name}
                          </h3>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#0891B2] flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                        {plan.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {plan.features.slice(0, 3).map((feature) => (
                              <span
                                key={feature}
                                className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                              >
                                {feature}
                              </span>
                            ))}
                            {plan.features.length > 3 && (
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                +{plan.features.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        {isFree ? (
                          <p className="text-2xl font-bold text-zinc-900 dark:text-white">Free</p>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                              {isAnnual && plan.has_annual_option && plan.annual_price_display
                                ? plan.annual_price_display.replace("/year", "").replace("/yr", "")
                                : plan.price_display.replace("/month", "").replace("/mo", "")}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {isAnnual && plan.has_annual_option ? "/year" : "/month"}
                            </p>
                            {isAnnual && plan.has_annual_option && plan.annual_savings_display && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                {plan.annual_savings_display}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              {selectedPlanId
                ? `Selected: ${plans.find((p) => p.id === selectedPlanId)?.name}`
                : "Select a plan to continue"}
            </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={!selectedPlanId || isLoading}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-[#0891B2] text-white hover:bg-[#0E7490] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
