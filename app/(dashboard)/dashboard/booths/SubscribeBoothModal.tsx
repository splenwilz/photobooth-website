"use client";

/**
 * Subscribe Booth Modal
 *
 * Subscribes a booth to the BoothIQ plan. Subscriptions collapsed to a single
 * plan, so there's nothing to "pick" — the real choice is Monthly vs Annual,
 * and we encourage Annual: renewal requires the booth to be online, so annual
 * billing means the operator only has to get the booth online once a year to
 * renew, versus every month with monthly billing. Initiates Stripe Checkout.
 */

import { useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, Ref } from "react";
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
  // Default to Annual — the encouraged option (guards below keep it safe when a
  // plan has no annual option).
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: plansData, isLoading: plansLoading } = usePricingPlans();
  const plans = plansData?.plans ?? [];
  const singlePlan = plans.length === 1 ? plans[0] : null;

  // The only plan is implicitly selected (nothing to choose); multi-plan
  // installs use the manual `selectedPlanId`. Derived, so Subscribe is enabled
  // immediately without a setState-in-effect.
  const effectiveSelectedId = singlePlan ? singlePlan.id : selectedPlanId;

  // The Monthly/Annual control only renders in the single-plan branch, so the
  // multi-plan fallback (no billing UI) must never silently check out annual.
  const billingIsAnnual = singlePlan ? isAnnual : false;

  // Roving-tabindex keyboard nav for the Monthly/Annual radiogroup.
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const annualRef = useRef<HTMLButtonElement>(null);
  const handleBillingKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      const nextAnnual = !isAnnual; // two options → any arrow moves to the other
      setIsAnnual(nextAnnual);
      (nextAnnual ? annualRef : monthlyRef).current?.focus();
    }
  };

  const handleSubscribe = async () => {
    if (!effectiveSelectedId || !boothId) return;

    const plan = plans.find((p) => p.id === effectiveSelectedId);
    if (!plan) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the appropriate price ID
      const priceId = billingIsAnnual && plan.stripe_annual_price_id
        ? plan.stripe_annual_price_id
        : plan.stripe_price_id;

      // Pass plan_name + booth_name through the success URL so the
      // checkout/success page can render a personalised confirmation
      // without depending on the post-payment API lookup matching the
      // right plan by stripe_price_id (which has been unreliable).
      //
      // CRITICAL: `{CHECKOUT_SESSION_ID}` must be a *literal* substring
      // for Stripe to substitute it server-side. URLSearchParams encodes
      // `{` / `}` to `%7B` / `%7D`, breaking the substitution. Use
      // string concatenation for the placeholder and only encode the
      // other params (which may contain spaces / unicode in
      // booth_name/plan_name).
      const otherParams = new URLSearchParams({
        type: "subscription",
        booth_id: boothId,
        booth_name: boothName,
        plan_name: plan.name,
        billing: billingIsAnnual && plan.has_annual_option ? "annual" : "monthly",
      });
      const successUrl =
        `${window.location.origin}/checkout/success` +
        `?session_id={CHECKOUT_SESSION_ID}` +
        `&${otherParams.toString()}`;

      // Create checkout session via API
      const result = await createSubscriptionCheckout(boothId, {
        price_id: priceId,
        success_url: successUrl,
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

  const canSubscribe = !!effectiveSelectedId && !!boothId && !isLoading;
  const subscribeLabel =
    singlePlan?.has_annual_option && isAnnual
      ? "Subscribe annually"
      : singlePlan?.has_annual_option
        ? "Subscribe monthly"
        : "Subscribe";

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
                {singlePlan ? (
                  <>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {singlePlan.name}
                    </span>{" "}
                    for{" "}
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {boothName}
                    </span>
                  </>
                ) : (
                  <>
                    Choose a plan for{" "}
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {boothName}
                    </span>
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
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
          ) : singlePlan ? (
            <div className="space-y-5">
              {/* Plan summary (no selection needed) */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-zinc-900/40">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {singlePlan.name}
                </h3>
                {singlePlan.description && (
                  <p className="text-sm text-zinc-500 mt-1">{singlePlan.description}</p>
                )}
                {singlePlan.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {singlePlan.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Billing choice */}
              {singlePlan.has_annual_option ? (
                <div
                  role="radiogroup"
                  aria-label="Billing interval"
                  className="space-y-3"
                >
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Choose billing
                  </p>

                  <BillingOption
                    buttonRef={monthlyRef}
                    tabIndex={!isAnnual ? 0 : -1}
                    onKeyDown={handleBillingKeyDown}
                    selected={!isAnnual}
                    onSelect={() => setIsAnnual(false)}
                    label="Monthly"
                    price={singlePlan.price_cents === 0 ? "Free" : singlePlan.price_display}
                    note="Renews every month, so the booth needs to get online each month to renew."
                  />

                  <BillingOption
                    buttonRef={annualRef}
                    tabIndex={isAnnual ? 0 : -1}
                    onKeyDown={handleBillingKeyDown}
                    selected={isAnnual}
                    onSelect={() => setIsAnnual(true)}
                    label="Annual"
                    price={
                      singlePlan.price_cents === 0
                        ? "Free"
                        : (singlePlan.annual_price_display ?? singlePlan.price_display)
                    }
                    note="Renews once a year, so the booth only needs to get online once a year to renew (not every month)."
                    recommended
                    savings={
                      singlePlan.annual_savings_display ??
                      (singlePlan.annual_discount_percent != null
                        ? `Save ${singlePlan.annual_discount_percent}%`
                        : null)
                    }
                  />
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {singlePlan.price_cents === 0 ? "Free" : singlePlan.price_display}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Multi-plan fallback (defensive; not the current install) */
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
                        ? "border-[#069494] bg-[#069494]/5"
                        : "border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-zinc-900 dark:text-white">{plan.name}</h3>
                        <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                          {isFree
                            ? "Free"
                            : billingIsAnnual && plan.has_annual_option && plan.annual_price_display
                              ? plan.annual_price_display
                              : plan.price_display}
                        </p>
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
          <div className="flex items-center justify-end gap-3">
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
              disabled={!canSubscribe}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-[#069494] text-white hover:bg-[#176161] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                subscribeLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingOption({
  selected,
  onSelect,
  label,
  price,
  note,
  recommended = false,
  savings = null,
  buttonRef,
  tabIndex,
  onKeyDown,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  price: string;
  note: string;
  recommended?: boolean;
  savings?: string | null;
  buttonRef?: Ref<HTMLButtonElement>;
  tabIndex?: number;
  onKeyDown?: (e: ReactKeyboardEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? "border-[#069494] bg-[#069494]/5"
          : "border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Radio dot */}
          <span
            aria-hidden="true"
            className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selected ? "border-[#069494]" : "border-slate-300 dark:border-zinc-600"
            }`}
          >
            {selected && <span className="w-2 h-2 rounded-full bg-[#069494]" />}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-zinc-900 dark:text-white">{label}</span>
              {recommended && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#069494]/15 text-[#069494]">
                  Recommended
                </span>
              )}
              {savings && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
                  {savings}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500 mt-1">{note}</p>
          </div>
        </div>
        <span className="text-lg font-bold text-zinc-900 dark:text-white whitespace-nowrap">
          {price}
        </span>
      </div>
    </button>
  );
}
