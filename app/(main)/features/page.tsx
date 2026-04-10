import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FeatureCategoriesTabs } from "@/components/FeatureCategoriesTabs";

export const metadata: Metadata = {
  title: "Features",
  description: "BoothIQ cloud features for photo booth operators: live analytics, remote configuration, fleet management, and cross-platform access.",
};

/* ============================================
 * Feature Data
 * ============================================ */

const categories = [
  {
    name: "Analytics & Reporting",
    iconPath:
      "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    description: "See exactly how each booth is performing",
    features: [
      { title: "Live Revenue", desc: "Real-time tracking with daily averages and peak days" },
      { title: "Product Mix", desc: "See which products and templates earn the most" },
      { title: "Upsell + Cross-sell", desc: "Track extra copies and add-on sales separately" },
      { title: "Payment Analytics", desc: "Cash, card, manual, and free play breakdowns" },
    ],
  },
  {
    name: "Booth Configuration",
    iconPath:
      "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75",
    description: "Tweak any booth from any device",
    features: [
      { title: "Per-Product Pricing", desc: "Set prices for strips, 4x6 prints, and add-ons individually" },
      { title: "Operating Modes", desc: "Coin Operated for retail, Free Play for events" },
      { title: "Extra Copy Pricing", desc: "Configure upsell and multi-copy discounts" },
      { title: "Credits & Balance", desc: "Adjust booth credits manually with full audit history" },
    ],
  },
  {
    name: "Fleet Management",
    iconPath:
      "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
    description: "Manage every booth from a single dashboard",
    features: [
      { title: "Per-Booth Subscriptions", desc: "One plan per booth — pay for what you actually run" },
      { title: "Unified Dashboard", desc: "Switch between booths or see them all at once" },
      { title: "Booth ↔ Cloud Sync", desc: "Settings flow both ways in real-time" },
      { title: "Status & Supply", desc: "Live hardware status and print paper levels" },
    ],
  },
  {
    name: "Mobile & Web Access",
    iconPath:
      "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
    description: "iOS, Android, and web — same data everywhere",
    features: [
      { title: "Native iOS App", desc: "Watch live revenue from your iPhone or iPad" },
      { title: "Native Android App", desc: "Same dashboard on Android phones and tablets" },
      { title: "Responsive Web", desc: "Sign in from any browser — laptop or desktop" },
      { title: "Real-time Sync", desc: "Every device shows the same data, always" },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#069494]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#069494]/5 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Built for operators
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Run your photo booth business
              <br />
              <span className="text-[#069494]">from anywhere</span>
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Live revenue, remote configuration, and full booth visibility — on
              the booth&apos;s touchscreen and your cloud dashboard, in sync.
            </p>
          </div>

          {/* Three pillar cards — same 3 jobs the cloud portal does, that
              tie back to the floating cards on the landing page hero. Each
              card uses a Heroicon SVG (no emoji), real feature names (no BYO
              hardware brands), and no fake CSS mockups. */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 — Live Analytics (teal) */}
            <div className="group relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#069494]/10 via-slate-100 to-slate-100 dark:from-[#069494]/20 dark:via-[#111111] dark:to-[#111111]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#069494]/10 dark:bg-[#069494]/20 blur-3xl rounded-full" />

              <div className="relative p-8 border border-[#069494]/20 rounded-3xl h-full group-hover:border-[#069494]/50 transition-colors">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#069494]/15 border border-[#069494]/30 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-[#069494] dark:group-hover:text-[#0EC7C7] transition-colors">
                  Live Analytics
                </h3>
                <p className="text-base text-[var(--muted)] mb-6 leading-relaxed">
                  Revenue, transactions, product mix, and supply levels —
                  updated as the booth runs.
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Revenue Trends", "Upsell Tracking", "Supply Levels"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#069494]/10 text-[#069494] dark:text-[#0EC7C7] text-xs font-medium border border-[#069494]/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 — Remote Configuration (amber) */}
            <div className="group relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 via-slate-100 to-slate-100 dark:from-[#F59E0B]/20 dark:via-[#111111] dark:to-[#111111]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 blur-3xl rounded-full" />

              <div className="relative p-8 border border-[#F59E0B]/20 rounded-3xl h-full group-hover:border-[#F59E0B]/50 transition-colors">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-[#d97706] dark:group-hover:text-[#F59E0B] transition-colors">
                  Configure Anywhere
                </h3>
                <p className="text-base text-[var(--muted)] mb-6 leading-relaxed">
                  Pricing, modes, and product setup — sync between the
                  booth&apos;s touchscreen and your dashboard.
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Per-Product Pricing", "Free Play / Coin", "Credit Adjustments"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium border border-[#F59E0B]/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 — Mobile Apps (teal) */}
            <div className="group relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#069494]/10 via-slate-100 to-slate-100 dark:from-[#069494]/20 dark:via-[#111111] dark:to-[#111111]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#069494]/10 dark:bg-[#069494]/20 blur-3xl rounded-full" />

              <div className="relative p-8 border border-[#069494]/20 rounded-3xl h-full group-hover:border-[#069494]/50 transition-colors">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#069494]/15 border border-[#069494]/30 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-[#069494] dark:group-hover:text-[#0EC7C7] transition-colors">
                  iOS · Android · Web
                </h3>
                <p className="text-base text-[var(--muted)] mb-6 leading-relaxed">
                  Native apps and a responsive web dashboard. Same data, every
                  device, all in sync.
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Native iOS", "Native Android", "Web Dashboard"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#069494]/10 text-[#069494] dark:text-[#0EC7C7] text-xs font-medium border border-[#069494]/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * All Features - Horizontal Scroll Categories
       * ============================================ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#069494]/5 blur-[200px] rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#069494]/5 blur-[150px] rounded-full -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cloud Portal Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              What you get on every device
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
              The cloud dashboard for photo booth operators — accessible from
              iOS, Android, and any browser.
            </p>
          </div>

          {/* Feature Categories — tabbed showcase. One large focal panel
              swaps content based on the active tab, instead of four equal
              cards competing for attention. */}
          <FeatureCategoriesTabs categories={categories} />

        </div>
      </section>

      {/* ============================================
       * Cross-device showcase — proves the "same data on every screen"
       * claim made in the tabbed showcase above. Real screenshots, no
       * mockups. Browser frame is the main element; phone frame overlaps
       * its bottom-right corner on lg+ for visual interest, stacks below
       * on smaller screens. Extra bottom padding on the section so the
       * phone overhang doesn't bleed into the Final CTA.
       * ============================================ */}
      <section className="pt-24 pb-40 lg:pb-56 px-6 relative overflow-hidden">
        {/* Background — soft teal glow at center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#069494]/8 dark:bg-[#069494]/15 blur-[200px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
              Cross-device sync
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              The same booth, on every screen
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
              Sign in from your phone on the way to the venue, then pick up
              the same view on your laptop when you sit down.
            </p>
          </div>

          {/* Device showcase — browser frame with phone overlapping its
              bottom-right corner on lg+, phone stacks below on smaller
              screens. Both use real screenshots from /web-screens and
              /mobile-screens. */}
          <div className="relative">
            {/* Browser window frame — main element */}
            <div className="relative rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 overflow-hidden shadow-2xl brand-glow">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                <span className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-green-400" aria-hidden="true" />
                <span className="ml-3 text-xs text-zinc-500">
                  BoothIQ — Web Dashboard
                </span>
              </div>
              {/* Screenshot — aspect ratio matches the source image */}
              <div className="relative w-full" style={{ aspectRatio: "3024 / 1730" }}>
                <Image
                  src="/web-screens/dashboard-overview.png"
                  alt="BoothIQ web dashboard showing booth overview"
                  fill
                  className="object-cover object-top dark:brightness-[0.78] dark:saturate-90 dark:contrast-105"
                  sizes="(max-width: 1536px) 100vw, 1536px"
                />
              </div>
            </div>

            {/* Phone frame — overlaps the browser's bottom-right on lg+,
                stacks below it (centered) on mobile so it stays visible. */}
            <div className="mt-8 lg:mt-0 lg:absolute lg:-bottom-32 lg:-right-4 xl:-right-8 mx-auto lg:mx-0 w-48 sm:w-56 lg:w-64">
              <div className="relative rounded-[2.5rem] border-[10px] border-zinc-900 dark:border-zinc-700 bg-zinc-900 overflow-hidden shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-zinc-900 rounded-b-2xl z-10" />
                <div className="relative" style={{ aspectRatio: "1170 / 2532" }}>
                  <Image
                    src="/mobile-screens/mobile-details-all.png"
                    alt="BoothIQ mobile app showing the same booth overview"
                    fill
                    className="object-cover object-top dark:brightness-[0.78] dark:saturate-90 dark:contrast-105"
                    sizes="256px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Booth touchscreen showcase — completes the "every screen" story.
       * The same admin panel that runs on phone/web also runs on the
       * booth's own Windows touchscreen (the app shipped from BoothWorks).
       * Single large kiosk-frame mock with the real sales.png screenshot.
       * ============================================ */}
      <section className="py-24 lg:py-32 px-6 relative overflow-hidden bg-slate-50/60 dark:bg-[#0a0a0a]/60 border-y border-slate-200 dark:border-zinc-800/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#069494]/8 dark:bg-[#069494]/12 blur-[180px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              On the booth itself
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              And on the booth&apos;s own touchscreen
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
              BoothIQ&apos;s admin panel runs on the Windows app shipped with
              your booth. Same dashboard, same data — right there at the
              venue.
            </p>
          </div>

          {/* Kiosk-style touchscreen frame containing the admin panel.
              Chunky outer bezel suggests physical hardware. We force a
              4:3 aspect (same trick as the landing hero) and let
              object-cover + object-top crop the bottom of the source
              screenshot — otherwise it renders way too tall. */}
          <div className="relative mx-auto max-w-3xl">
            <div className="relative rounded-[2rem] border-[14px] border-zinc-900 dark:border-zinc-800 bg-zinc-900 shadow-2xl brand-glow overflow-hidden">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src="/admin-screens/sales.png"
                  alt="BoothIQ admin panel running on the booth's touchscreen"
                  fill
                  className="object-cover object-top dark:brightness-[0.85] dark:saturate-95"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>
            {/* Subtle stand at the bottom — small visual nod to kiosk hardware */}
            <div className="hidden md:block">
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-2 bg-zinc-900 dark:bg-zinc-800 rounded-b-2xl" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-3 bg-zinc-800 dark:bg-zinc-900 rounded-b-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Per-booth pricing explainer — visual diagram of the unusual
       * pricing model (one operator account → multiple booths, each on
       * its own plan). No fake locations or prices; abstract Booth 1/2/3
       * with generic plan badges so it reads as a model, not real data.
       * ============================================ */}
      <section className="py-24 lg:py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#069494]/5 blur-[180px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              How pricing works
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              One plan per booth
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
              Add a booth, pick its plan. Add another, pick its plan. Each
              one is independent — no enterprise tiers, no per-seat math,
              no all-or-nothing upgrades.
            </p>
          </div>

          {/* Diagram — operator account at the top, 3 booth cards below
              connected by a vertical line on md+, stacked on mobile. */}
          <div className="relative">
            {/* Account card */}
            <div className="flex justify-center mb-16">
              <div className="relative inline-flex items-center gap-4 px-6 py-5 rounded-2xl bg-[var(--card)] border border-[#069494]/30 shadow-lg shadow-[#069494]/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#069494] to-[#176161] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[var(--foreground)]">Your operator account</div>
                  <div className="text-sm text-[var(--muted)]">One sign-in, all your booths</div>
                </div>
              </div>
            </div>

            {/* Vertical connecting line — decorative, hidden on small screens */}
            <div className="hidden md:block absolute top-[88px] left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-[#069494]/60 to-transparent" />

            {/* 3 booth cards */}
            <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { name: "Booth 1", plan: "Pro", planTier: "pro" },
                { name: "Booth 2", plan: "Pro", planTier: "pro" },
                { name: "Booth 3", plan: "Starter", planTier: "starter" },
              ].map((booth) => (
                <div
                  key={booth.name}
                  className="relative p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#069494]/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#069494]/10 border border-[#069494]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        booth.planTier === "pro"
                          ? "bg-[#069494]/15 text-[#069494] dark:text-[#0EC7C7] border border-[#069494]/30"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {booth.plan} plan
                    </span>
                  </div>
                  <div className="font-semibold text-[var(--foreground)] mb-1">{booth.name}</div>
                  <div className="text-sm text-[var(--muted)]">Independent subscription</div>
                </div>
              ))}
            </div>

            {/* Footnote */}
            <p className="text-center text-sm text-[var(--muted)] mt-10 max-w-xl mx-auto">
              Cancel one booth&apos;s plan and that booth comes off your
              account. The others keep running.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
       * FAQ — static 2-column grid of high-confidence Q&A pairs. No
       * accordion (keeps it a server component, all answers visible).
       * Every answer is something we can stand behind without making
       * up details that don't exist yet.
       * ============================================ */}
      <section className="py-24 lg:py-32 px-6 relative overflow-hidden bg-slate-50/60 dark:bg-[#0a0a0a]/60 border-y border-slate-200 dark:border-zinc-800/50">
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
                q: "Do I need a separate plan for each booth?",
                a: "Yes. Every booth on your account has its own subscription. Add one when you link a new booth, cancel it independently if you take that booth offline.",
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
                q: "Does it work without internet?",
                a: "Yes — completely. BoothIQ is offline-first: the booth runs 100% on its own Windows app with no network requirement. Cloud sync is a luxury layered on top when internet is available, so you can watch live revenue from your phone. The booth itself never needs the internet to take sessions, print, or accept payments.",
              },
              {
                q: "Can I sign in from my phone?",
                a: "Yes — native iOS and Android apps, plus a responsive web dashboard. All three show the same data, in real time, on the same operator account.",
              },
              {
                q: "Where do I see what's happening at a booth?",
                a: "In your dashboard, anytime, on any device. Live revenue, supply levels, recent sessions, and current configuration are all there.",
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
        </div>
      </section>

      {/* ============================================
       * Final CTA — matches the landing page final CTA pattern (same
       * background grid + teal glow + button styling) so the site reads
       * as one cohesive design.
       * ============================================ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20 dark:opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 dark:bg-[#069494]/20 blur-[150px] rounded-full" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            See all of this in
            <br />
            <span className="text-[#069494]">your own dashboard</span>
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            Sign up for BoothIQ, link your booth, and every feature above
            goes live on every device you sign in from.
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
              href="/pricing"
              className="w-full sm:w-auto px-10 py-5 rounded-xl border-2 border-[#069494]/40 font-semibold text-lg hover:bg-[#069494]/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
