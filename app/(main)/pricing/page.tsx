"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { usePricingPlans } from "@/core/api/pricing";

const faqs = [
  {
    question: "What's included in the hardware packages?",
    answer: "Each hardware package includes everything you need to start your photo booth business — monitor, stand, lighting, and depending on the tier, professional printers and cameras. All equipment is tested and configured before shipping.",
  },
  {
    question: "Do I need to buy hardware from you?",
    answer: "No! You can use your own equipment. Our software works with most webcams, DSLR cameras, and photo printers. Our hardware packages are a convenient option if you want a complete, tested setup.",
  },
  {
    question: "How do I get started with Pro software?",
    answer: "Simply choose a plan and subscribe. You can upgrade or downgrade anytime from your dashboard.",
  },
  {
    question: "Can I cancel my software subscription anytime?",
    answer: "Absolutely. Cancel anytime from your dashboard with no questions asked. Your booths will continue working on the Starter plan.",
  },
  {
    question: "Do hardware packages include the software?",
    answer: "Hardware packages include 3 months of Pro software subscription free. After that, you can continue with Pro or switch to our free Starter plan.",
  },
  {
    question: "What warranty comes with the hardware?",
    answer: "Essential packages include 6-month warranty, Professional includes 1-year warranty, and Premium includes 2-year warranty. Extended warranties are available for purchase.",
  },
  {
    question: "Do you offer financing for hardware?",
    answer: "Yes! We partner with financing providers to offer 0% APR financing for qualified buyers. Contact our sales team to learn more about payment plans.",
  },
  {
    question: "Is there a discount for annual software billing?",
    answer: "Yes! Pay annually and save 20% — that's $39/month instead of $49/month. Plus, you get priority support.",
  },
];

const comparisonFeatures = [
  { name: "Template Library", starter: "10 basic", pro: "100+ premium", enterprise: "100+ premium + custom" },
  { name: "Camera Support", starter: "Webcam only", pro: "Webcam + DSLR", enterprise: "Webcam + DSLR" },
  { name: "Print Quality", starter: "Watermarked", pro: "Full quality", enterprise: "Full quality" },
  { name: "Mobile App", starter: "—", pro: "✓", enterprise: "✓" },
  { name: "Analytics", starter: "—", pro: "✓", enterprise: "✓ Advanced" },
  { name: "Payment Processing", starter: "—", pro: "2.9% + $0.30", enterprise: "Custom rates" },
  { name: "Support", starter: "Community", pro: "Priority email", enterprise: "Dedicated manager" },
  { name: "API Access", starter: "—", pro: "—", enterprise: "✓" },
  { name: "SLA", starter: "—", pro: "—", enterprise: "99.9%" },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auth state
  const { isAuthenticated } = useUser();

  // Fetch pricing plans from API
  const { data: plansData, isLoading: plansLoading } = usePricingPlans();

  // Get trial period from API (0 = no trial)
  const trialPeriodDays = plansData?.trial_period_days ?? 0;

  // Get CTA text for paid plans (subscription happens from booth management)
  const getPaidPlanCtaText = () => {
    if (isAuthenticated) return "Manage Booths";
    if (trialPeriodDays > 0) return `${trialPeriodDays}-Day Free Trial`;
    return "Get Started";
  };

  // Get CTA link - authenticated users go to booth management, others to signup
  const getPaidPlanCtaLink = () => {
    return isAuthenticated ? "/dashboard/booths" : "/signup";
  };

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
    icon: string;
    isPaid: boolean;
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

    return plansData.plans.map((plan, index) => ({
      id: plan.id.toString(),
      name: plan.name,
      description: plan.description || "",
      priceCents: plan.price_cents,
      priceDisplay: plan.price_display,
      badge: index === 1 ? "Most Popular" : null, // Highlight second plan
      features: plan.features.map((f) => ({ text: f, included: true })),
      highlighted: index === 1,
      icon: index === 0 ? "🎯" : index === 1 ? "⚡" : "🏢",
      isPaid: plan.price_cents > 0,
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
      <section className="relative pt-16 pb-16 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0891B2]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Checkmark" aria-hidden="true">
              <title>Checkmark</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Flexible Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Simple per-booth pricing<br />
            <span className="text-[#0891B2]">for every photo booth business</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Subscribe each booth to the plan that fits its needs. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      {/* Software Plans Section */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#0891B2] text-sm font-medium mb-4">
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
                    ? "bg-gradient-to-b from-[#0891B2]/20 to-slate-100 dark:to-[#111111] border-2 border-[#0891B2]/50 scale-105 lg:-mt-4 lg:mb-4 shadow-xl shadow-[#0891B2]/10"
                    : "bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-[#0891B2] text-[var(--foreground)] text-sm font-semibold shadow-lg shadow-[#0891B2]/30">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{plan.icon}</span>
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

                {/* CTA */}
                <Link
                  href={plan.isPaid ? getPaidPlanCtaLink() : "/downloads"}
                  className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all mb-8 ${
                    plan.highlighted
                      ? "bg-[#0891B2] text-white hover:bg-[#0E7490] shadow-lg shadow-[#0891B2]/30 hover:shadow-[#0891B2]/50"
                      : "bg-slate-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-slate-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {plan.isPaid ? getPaidPlanCtaText() : "Download Free"}
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

      {/* Trust Badges */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🔒", title: "Secure Payments", desc: "256-bit SSL encryption" },
              { icon: "💸", title: "Money-Back", desc: "30-day guarantee" },
              { icon: "🚀", title: "Instant Access", desc: "Start in minutes" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
            ].map((badge) => (
              <div key={badge.title} className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="text-3xl mb-3">{badge.icon}</div>
                <h3 className="font-semibold mb-1">{badge.title}</h3>
                <p className="text-sm text-[var(--muted)]">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Compare software plans
          </h2>
          <p className="text-[var(--muted)] text-center mb-12">
            Find the perfect plan for your business
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-4 px-6 font-semibold text-zinc-900 dark:text-white">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-zinc-600 dark:text-white">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold bg-[#0891B2]/10 dark:bg-[#0891B2]/20 border-x border-[#0891B2]/20 dark:border-[#0891B2]/40 text-zinc-600 dark:text-white">Pro</th>
                  <th className="text-center py-4 px-4 font-semibold text-zinc-600 dark:text-white">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr
                    key={feature.name}
                    className="border-b border-[var(--border)]/50 last:border-b-0"
                  >
                    <td className="py-4 px-6 text-sm font-semibold text-zinc-800 dark:text-white">{feature.name}</td>
                    <td className="py-4 px-4 text-sm text-center text-zinc-600 dark:text-white">{feature.starter}</td>
                    <td className="py-4 px-4 text-sm text-center bg-[#0891B2]/10 dark:bg-[#0891B2]/20 border-x border-[#0891B2]/20 dark:border-[#0891B2]/40 font-semibold text-zinc-600 dark:text-white">{feature.pro}</td>
                    <td className="py-4 px-4 text-sm text-center text-zinc-600 dark:text-white">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="relative p-10 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            {/* Quote mark */}
            <svg className="absolute top-6 left-8 w-10 h-10 text-[#0891B2]/30" fill="currentColor" viewBox="0 0 24 24" aria-label="Quote mark" aria-hidden="true">
              <title>Quote mark</title>
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <blockquote className="text-xl text-[var(--foreground)] leading-relaxed mb-6 relative z-10">
              &ldquo;Switching to Pro was a no-brainer. The ROI was immediate — we made back the annual
              subscription in just one weekend event. The mobile app alone is worth the price.&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white font-bold">
                SK
              </div>
              <div>
                <div className="font-semibold text-[var(--foreground)]">Sarah Kim</div>
                <div className="text-sm text-[var(--muted)]">Owner, SnapBox Events · 8 booths</div>
              </div>
              <div className="ml-auto flex gap-0.5" role="img" aria-label="5 star rating">
                {["star-1", "star-2", "star-3", "star-4", "star-5"].map((id) => (
                  <svg key={id} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs - Two Column Layout */}
      <section className="px-6 pb-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#0891B2]/5 blur-[150px] rounded-full -translate-y-1/2" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Question mark" aria-hidden="true">
                <title>Question mark</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Got Questions?
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently asked questions
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Everything you need to know about our pricing
            </p>
          </div>

          {/* FAQ Grid - Two columns on desktop */}
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className={`group rounded-2xl border overflow-hidden transition-all ${
                  openFaq === index
                    ? "bg-[#0891B2]/10 dark:bg-[#0891B2]/20 border-[#0891B2]/30"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-[#0891B2]/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-start gap-4 p-6 text-left"
                >
                  {/* Number badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    openFaq === index
                      ? "bg-[#0891B2] text-white"
                      : "bg-slate-200 dark:bg-zinc-600 text-zinc-600 dark:text-white group-hover:bg-[#0891B2]/20 group-hover:text-[#0891B2]"
                  }`}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <span className={`font-semibold block transition-colors ${
                      openFaq === index ? "text-[#0891B2] dark:text-[#22D3EE]" : "text-zinc-800 dark:text-white group-hover:text-[#0891B2] dark:group-hover:text-[#22D3EE]"
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    openFaq === index
                      ? "bg-[#0891B2]/20 rotate-180"
                      : "bg-slate-200 dark:bg-zinc-700 group-hover:bg-slate-300 dark:group-hover:bg-zinc-600"
                  }`}>
                    <svg
                      className={`w-4 h-4 transition-colors ${openFaq === index ? "text-[#0891B2]" : "text-zinc-500 dark:text-zinc-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-label={openFaq === index ? "Collapse" : "Expand"}
                    >
                      <title>{openFaq === index ? "Collapse" : "Expand"}</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-6 pb-6 pl-[4.5rem] text-zinc-600 dark:text-white leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-12 h-12 rounded-xl bg-[#0891B2]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Chat" aria-hidden="true">
                  <title>Chat</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">Still have questions?</p>
                <p className="text-sm text-[var(--muted)]">Our team is here to help</p>
              </div>
              <Link
                href="/contact"
                className="ml-4 px-5 py-2.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Split Layout */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-[var(--border)]">
            {/* Left side - Content */}
            <div className="bg-[var(--card)] p-10 md:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-medium w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Start in under 5 minutes
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                Ready to get started?
              </h2>

              <p className="text-[var(--muted)] mb-8 leading-relaxed">
                Download PhotoBoothX and get started today.
                Cancel your subscription anytime.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/downloads"
                  className="px-6 py-3.5 rounded-xl bg-[#0891B2] text-[var(--foreground)] font-semibold hover:bg-[#0E7490] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-[#0891B2]/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Download" aria-hidden="true">
                    <title>Download</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Free
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                  Contact Sales
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Checkmark" aria-hidden="true">
                    <title>Checkmark</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free starter plan
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Checkmark" aria-hidden="true">
                    <title>Checkmark</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Secure payments
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Checkmark" aria-hidden="true">
                    <title>Checkmark</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime
                </span>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative bg-gradient-to-br from-[#0891B2] to-[#0E7490] p-10 md:p-14 hidden lg:flex items-center justify-center">
              {/* Decorative circles */}
              <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-white/10" />
              <div className="absolute bottom-6 left-6 w-32 h-32 rounded-full border border-white/10" />
              <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/5" />

              {/* Stats card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full max-w-xs">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Chart" aria-hidden="true">
                      <title>Chart</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Your potential</div>
                    <div className="text-white font-semibold">Monthly Revenue</div>
                  </div>
                </div>

                <div className="text-4xl font-bold text-white mb-2">$8,500</div>
                <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] text-xs font-medium">+340%</span>
                  vs. manual operations
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-2xl font-bold text-white">2,400</div>
                    <div className="text-xs text-white/50">Photos/month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-xs text-white/50">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
