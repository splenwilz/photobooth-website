"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { usePricingPlans } from "@/core/api/pricing";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  // Auth state
  const { isAuthenticated } = useUser();

  // Fetch pricing plans from API
  const { data: plansData, isLoading: plansLoading } = usePricingPlans();

  // Single CTA path for every plan: signed-in operators jump straight to
  // booth management (where they pick a plan for a specific booth);
  // everyone else signs up first. There is no free trial, no download —
  // every plan goes through the same funnel.
  const ctaText = isAuthenticated ? "Manage Booths" : "Get Started";
  const ctaLink = isAuthenticated ? "/dashboard/booths" : "/signup";

  // Display plan type
  type DisplayPlan = {
    id: string;
    name: string;
    description: string;
    priceCents: number;
    priceDisplay: string;
    badge: string | null;
    features: Array<{ text: string; included: boolean }>;
    highlighted: boolean;
    iconPath: string;
    // Annual billing
    hasAnnualOption: boolean;
    annualPriceDisplay: string | null;
    annualSavingsDisplay: string | null;
  };

  // Map API plans to display format
  const getDisplayPlans = (): DisplayPlan[] => {
    if (!plansData?.plans || plansData.plans.length === 0) {
      return [];
    }

    // Derive badge and icon from plan name instead of array index. Icons
    // are Heroicon SVG paths (rocket / bolt / building / box) — no emoji,
    // matching the rest of the redesigned site.
    const getPlanIconPath = (name: string): string => {
      const lowerName = name.toLowerCase();
      // Rocket — Starter / Basic / Free
      if (lowerName.includes("starter") || lowerName.includes("basic") || lowerName.includes("free")) {
        return "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z";
      }
      // Bolt — Pro / Professional
      if (lowerName.includes("pro") || lowerName.includes("professional")) {
        return "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z";
      }
      // Building — Enterprise / Business
      if (lowerName.includes("enterprise") || lowerName.includes("business")) {
        return "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z";
      }
      // Box — fallback
      return "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9";
    };

    const isPopularPlan = (name: string): boolean => {
      const lowerName = name.toLowerCase();
      return lowerName.includes("pro") || lowerName.includes("professional");
    };

    return plansData.plans.map((plan) => ({
      id: plan.id.toString(),
      name: plan.name,
      description: plan.description || "",
      priceCents: plan.price_cents,
      priceDisplay: plan.price_display,
      badge: isPopularPlan(plan.name) ? "Most Popular" : null,
      features: plan.features.map((f) => ({ text: f, included: true })),
      highlighted: isPopularPlan(plan.name),
      iconPath: getPlanIconPath(plan.name),
      hasAnnualOption: plan.has_annual_option,
      annualPriceDisplay: plan.annual_price_display,
      annualSavingsDisplay: plan.annual_savings_display,
    }));
  };

  const displayPlans = getDisplayPlans();

  // Check if any plan has annual option
  const hasAnyAnnualOption = displayPlans.some((p) => p.hasAnnualOption);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            Flexible Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Simple per-booth pricing<br />
            <span className="text-[#069494]">for every photo booth business</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Subscribe each booth to the plan that fits its needs. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      {/* Software Plans Section */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Section Header — mb-20 (not mb-12) because the highlighted
              card below is lifted with lg:-mt-4 and its "Most Popular"
              badge is positioned -top-4, eating ~32px out of the gap. */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Code" aria-hidden="true">
                <title>Code</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Subscription Plans
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Per-Booth Plans
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto mb-8">
              Each booth gets its own subscription. Mix and match plans across your fleet
              to optimize costs and features.
            </p>

            {/* Billing Toggle */}
            {hasAnyAnnualOption && (
              <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-slate-200 dark:bg-zinc-900 border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    !isAnnual
                      ? "bg-white text-black"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    isAnnual
                      ? "bg-white text-black"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Annual
                </button>
              </div>
            )}
          </div>

          {/* Software Cards */}
          {plansLoading ? (
            /* Loading Skeleton */
            <div className="grid lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl p-8 bg-[var(--card)] border border-[var(--border)] ${
                    i === 2 ? "lg:scale-105 lg:-mt-4 lg:mb-4" : ""
                  }`}
                >
                  {/* Header skeleton */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-zinc-700 animate-pulse" />
                      <div className="h-6 w-24 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-full bg-slate-200 dark:bg-zinc-700 rounded animate-pulse mt-2" />
                  </div>

                  {/* Price skeleton */}
                  <div className="mb-8">
                    <div className="h-12 w-32 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse mt-2" />
                  </div>

                  {/* Button skeleton */}
                  <div className="h-12 w-full bg-slate-200 dark:bg-zinc-700 rounded-xl animate-pulse mb-8" />

                  {/* Features skeleton */}
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-700 animate-pulse shrink-0" />
                        <div className="h-4 flex-1 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : displayPlans.length === 0 ? (
            /* Empty state */
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">No plans available</h3>
              <p className="text-[var(--muted)]">
                Pricing plans are currently being configured. Please check back soon.
              </p>
            </div>
          ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {displayPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-[#069494]/20 to-slate-100 dark:to-[#111111] border-2 border-[#069494]/50 scale-105 lg:-mt-4 lg:mb-4 shadow-xl shadow-[#069494]/10"
                    : "bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-[#069494] text-[var(--foreground)] text-sm font-semibold shadow-lg shadow-[#069494]/30">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-11 h-11 rounded-xl bg-[#069494]/10 border border-[#069494]/20 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-[#069494] dark:text-[#0EC7C7]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={plan.iconPath} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  {plan.priceCents > 0 ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold">
                          {isAnnual && plan.hasAnnualOption && plan.annualPriceDisplay
                            ? plan.annualPriceDisplay.replace("/year", "").replace("/yr", "")
                            : plan.priceDisplay.replace("/month", "").replace("/mo", "")}
                        </span>
                        <span className="text-[var(--muted)]">
                          {isAnnual && plan.hasAnnualOption ? "/booth/yr" : "/booth/mo"}
                        </span>
                      </div>
                      {isAnnual && plan.hasAnnualOption ? (
                        plan.annualSavingsDisplay ? (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            {plan.annualSavingsDisplay}
                          </p>
                        ) : (
                          <p className="text-sm text-[var(--muted)] mt-1">
                            per booth, billed annually
                          </p>
                        )
                      ) : (
                        <p className="text-sm text-[var(--muted)] mt-1">
                          per booth, billed monthly
                        </p>
                      )}
                    </>
                  ) : plan.priceCents === 0 && plan.priceDisplay !== "Custom" ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">$0</span>
                      <span className="text-[var(--muted)]">/booth</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">Custom</span>
                    </div>
                  )}
                </div>

                {/* CTA — single funnel for every plan: signed-in operators
                    go to booth management, others sign up first. */}
                <Link
                  href={ctaLink}
                  className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all mb-8 ${
                    plan.highlighted
                      ? "bg-[#069494] text-white hover:bg-[#176161] shadow-lg shadow-[#069494]/30 hover:shadow-[#069494]/50"
                      : "bg-slate-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-slate-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {ctaText}
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? "text-[var(--foreground-secondary)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {feature.included ? (
                        <svg className="w-5 h-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Included">
                          <title>Included</title>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-400 dark:text-zinc-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Not included">
                          <title>Not included</title>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ============================================
       * FAQs — static 2-column grid, all answers visible. No accordion;
       * matches the FAQ pattern on the features page so the site reads
       * as one cohesive design. Every answer is something we can stand
       * behind without inventing details.
       * ============================================ */}
      <section className="py-24 lg:py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#069494]/5 blur-[150px] rounded-full -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              Common questions
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Things people ask
            </h2>
          </div>

          {/* Q&A grid */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                q: "How does per-booth pricing work?",
                a: "Each booth on your account has its own subscription. Add one booth, pick its plan; add another, pick its plan. Cancel one and the others keep running on whatever plans they were on.",
              },
              {
                q: "Is there a free trial?",
                a: "No free trial — but creating an account is free. You only start paying once you link a physical booth and pick its plan.",
              },
              {
                q: "What hardware do I need?",
                a: "BoothIQ booths are sold and assembled by BoothWorks. The hardware (camera, printer, touchscreen, payment) ships pre-configured to run BoothIQ out of the box.",
              },
              {
                q: "Can I change a booth's plan later?",
                a: "Yes. Upgrade or downgrade any booth's plan from your dashboard at any time. Annual plans switch at the end of the current billing period.",
              },
              {
                q: "Does the booth need internet?",
                a: "No. BoothIQ is offline-first — the booth runs 100% locally on its Windows app and keeps taking sessions, prints, and payments without a network. Cloud sync is a luxury layer that activates when there's internet.",
              },
              {
                q: "How do I cancel a booth's subscription?",
                a: "From your dashboard, on the booth itself. Cancelling one booth's plan only affects that booth — your other booths keep running on their own subscriptions.",
              },
              {
                q: "How are payments handled?",
                a: "Stripe handles checkout securely. You can pay monthly or annually where available, and switch billing intervals from your dashboard.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="p-6 md:p-7 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#069494]/30 transition-colors"
              >
                <h3 className="font-semibold text-base text-[var(--foreground)] mb-2">{q}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-12 h-12 rounded-xl bg-[#069494]/10 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-medium text-[var(--foreground)]">Still have questions?</p>
                <p className="text-sm text-[var(--muted)]">We&apos;re happy to help.</p>
              </div>
              <Link
                href="/contact"
                className="sm:ml-4 px-5 py-2.5 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Final CTA — same pattern as the landing page and features page
       * final CTA (teal glow + grid pattern background, centered text,
       * Sign Up Free + secondary button) so the site reads as one
       * cohesive design.
       * ============================================ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20 dark:opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 dark:bg-[#069494]/20 blur-[150px] rounded-full" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            One plan
            <br />
            <span className="text-[#069494]">per booth.</span>
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            Create your account for free. Link your first booth, pick its
            plan, and you&apos;re live. Add more booths whenever — each on
            its own plan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-10 py-5 rounded-xl bg-[#069494] text-white font-semibold text-lg hover:bg-[#176161] transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              Sign Up Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto px-10 py-5 rounded-xl border-2 border-[#069494]/40 font-semibold text-lg hover:bg-[#069494]/10 transition-all"
            >
              View Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
