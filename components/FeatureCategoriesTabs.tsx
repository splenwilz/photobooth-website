"use client";

/**
 * FeatureCategoriesTabs
 *
 * Tabbed showcase for the four "what you get" categories on the features
 * page. Replaces the earlier 2x2 bento grid layout: instead of four equal
 * cards competing for attention, this presents one large focal panel with
 * a row of switchable tabs above it.
 *
 * Why a client component: needs `useState` to track the active tab index.
 * The features page itself stays a server component and just renders this.
 *
 * @see app/(main)/features/page.tsx — used in the "All Features" section
 */

import { useState } from "react";

interface Feature {
  title: string;
  desc: string;
}

interface Category {
  name: string;
  iconPath: string;
  description: string;
  features: Feature[];
}

interface Props {
  categories: Category[];
}

export function FeatureCategoriesTabs({ categories }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = categories[activeIndex];

  return (
    <div>
      {/* Tab row — pill buttons with icon + name. Active tab gets the
          full teal fill so the eye knows where to land. */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
        {categories.map((cat, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-pressed={isActive}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#069494] text-white shadow-lg shadow-[#069494]/25 scale-[1.02]"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#069494]/40"
              }`}
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={cat.iconPath} />
              </svg>
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active panel — one large rounded container holding the active
          category's description + features. Subtle teal gradient bleeds in
          from the top-left so it doesn't feel flat. */}
      <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#069494]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#069494]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative p-8 md:p-12 lg:p-16">
          {/* Description — set big and quiet, like a headline */}
          <p className="text-2xl md:text-3xl font-medium text-[var(--foreground)] mb-12 max-w-2xl leading-snug">
            {active.description}
          </p>

          {/* Feature grid — 2 columns on sm+, generous gaps */}
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {active.features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#069494]/15 border border-[#069494]/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-[#069494]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base text-[var(--foreground)] mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
