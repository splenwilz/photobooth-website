import Link from "next/link";
import Image from "next/image";
import { HeroAppPreview } from "@/components/HeroAppPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-white overflow-hidden">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-20 pb-20 px-6">
        {/* Animated grid background */}
        <div className="absolute inset-0 grid-pattern opacity-50 dark:opacity-100" />

        {/* Multiple glow effects */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#069494]/10 dark:bg-[#069494]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#176161]/10 dark:bg-[#176161]/15 blur-[120px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#069494]/30 bg-[#069494]/10 text-sm text-[#069494] dark:text-[#0EC7C7] mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              v2.4 now available — see what&apos;s new
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              The photo booth software
              <br />
              <span className="text-[#069494]">professionals trust</span>
          </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Run your photo booth business from anywhere — live revenue,
              complete booth visibility, and full remote control of every
              booth you operate.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/downloads"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Free
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#069494]/30 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-[#069494]/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Trust indicators */}
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              For BoothIQ operators. Manage your booths from any browser.
            </p>
          </div>

          {/* App Preview — extracted to a client component so motion can run
              without forcing the rest of this page to be a client component. */}
          <HeroAppPreview />
        </div>
      </section>

      {/* ============================================
       * Features - Alternating Layout
       * ============================================ */}
      <section className="py-32 px-6 bg-slate-50 dark:bg-transparent">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-24">
            <p className="text-[#069494] font-medium tracking-widest text-sm mb-4">FEATURES</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Everything you need,<br />nothing you don&apos;t
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-500 max-w-xl mx-auto">
              Professional tools built for real photo booth operators
            </p>
          </div>

          {/* Feature 1 - Real-time Analytics */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              {/* Larger icon block — replaces the old small pill badge to give
                  the text column more visual weight against the framed
                  screenshot on the right. */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#069494]/10 border border-[#069494]/20 flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <div className="text-[#069494] dark:text-[#0EC7C7] text-xs font-semibold uppercase tracking-widest">
                  Real-time Analytics
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Every dollar tracked, every second
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
                Each BoothIQ booth runs a complete analytics dashboard built
                right in. Track revenue, transactions, product mix, and payment
                methods straight from the touchscreen — then watch it all sync
                to the cloud.
              </p>
              <ul className="space-y-4">
                {[
                  "Live revenue tracking with daily averages and peak days",
                  "Upsell + cross-sell tracking (extra copies, 4x6 add-ons)",
                  "Popular templates ranked by revenue",
                  "Print and paper supply status at a glance",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-[#069494]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Visual — real Sales & Analytics screenshot, framed in the same
                two-layer "screen on a desk" structure the old CSS mockup had:
                outer card = the "desk" surface, inner card = the "screen". */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#069494]/10 dark:bg-[#069494]/20 blur-[100px] rounded-full" />
              <div className="relative aspect-[4/3] rounded-3xl bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#069494]/20 p-4 overflow-hidden">
                <div className="relative w-full h-full rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-xl">
                  <Image
                    src="/admin-screens/sales.png"
                    alt="BoothIQ Sales & Analytics dashboard showing revenue trend, stat cards, and product mix"
                    fill
                    className="object-cover object-top dark:brightness-[0.78] dark:saturate-90 dark:contrast-105"
                    sizes="(max-width: 1024px) 100vw, 510px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Remote Configuration (reversed) */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual - Left side — real Product Configuration screenshot,
                framed in the same two-layer "screen on a desk" structure as
                Feature 1: outer card = "desk", inner card = "screen". */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10 blur-[100px] rounded-full" />
              <div className="relative aspect-[4/3] rounded-3xl bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 p-4 overflow-hidden">
                <div className="relative w-full h-full rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-xl">
                  <Image
                    src="/admin-screens/products.png"
                    alt="BoothIQ Product Configuration showing pricing controls and operating modes"
                    fill
                    className="object-cover object-top dark:brightness-[0.78] dark:saturate-90 dark:contrast-105"
                    sizes="(max-width: 1024px) 100vw, 510px"
                  />
                </div>
              </div>
            </div>
            {/* Content - Right side */}
            <div className="order-1 lg:order-2">
              {/* Larger icon block — matches Feature 1's pattern, in amber */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                <div className="text-[#F59E0B] text-xs font-semibold uppercase tracking-widest">
                  Remote Configuration
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Set it on the booth, or set it from your phone
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
                Pricing, operating modes, and product configuration sync
                between the booth&apos;s touchscreen and your cloud dashboard.
                Use whichever is closer — they share the same data.
              </p>
              <ul className="space-y-4">
                {[
                  "Set per-product pricing per booth",
                  "Switch between Coin Operated and Free Play modes",
                  "Adjust credits and balance manually",
                  "Configure extra copy and upsell pricing",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 - Mobile App - Full Width Showcase */}
        </div>
      </section>

      {/* Mobile App - Dedicated Section */}
      <section className="py-32 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100/50 dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#111111]/50 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#069494]/5 dark:bg-[#069494]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#069494]/5 dark:bg-[#069494]/10 blur-[150px] rounded-full" />

        <div className="max-w-6xl mx-auto relative px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              iOS · Android · Web
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Your fleet, in your pocket
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Native iOS and Android apps plus the web dashboard you&apos;re on
              now. Same data, same controls, whichever device is closest.
            </p>
          </div>

          {/* Three-phone showcase — center phone elevated, side phones tilted
              for depth. Each phone is a CSS frame holding a real screenshot.
              Stacks vertically on mobile with no rotation. */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-6 mb-20">
            {/* Phone 1 — Multi-booth overview (left, tilted left) */}
            <div className="relative w-64 lg:w-64 lg:-mr-4 lg:rotate-[-6deg] lg:translate-y-4 transition-transform duration-300 lg:hover:-translate-y-1">
              {/* Phone bezel */}
              <div className="relative aspect-[9/18] rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-950 p-2 shadow-2xl shadow-[#069494]/20">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl bg-zinc-900 dark:bg-zinc-950 z-10" />
                {/* Screen */}
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white">
                  <Image
                    src="/mobile-screens/mobile-overview.png"
                    alt="BoothIQ mobile app — multi-booth revenue overview"
                    fill
                    className="object-cover object-top dark:brightness-[0.85] dark:saturate-95"
                    sizes="256px"
                  />
                </div>
              </div>
            </div>

            {/* Phone 2 — Single booth detail (center, elevated, on top) */}
            <div className="relative w-64 lg:w-72 z-10 lg:-translate-y-6 transition-transform duration-300 lg:hover:-translate-y-9">
              {/* Phone bezel */}
              <div className="relative aspect-[9/18] rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-950 p-2 shadow-2xl shadow-[#069494]/30">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl bg-zinc-900 dark:bg-zinc-950 z-10" />
                {/* Screen */}
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white">
                  <Image
                    src="/mobile-screens/mobile-detail.png"
                    alt="BoothIQ mobile app — single booth revenue and upsell detail"
                    fill
                    className="object-cover object-top dark:brightness-[0.85] dark:saturate-95"
                    sizes="(max-width: 1024px) 256px, 288px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Phone 3 — Account / billing (right, tilted right) */}
            <div className="relative w-64 lg:w-64 lg:-ml-4 lg:rotate-[6deg] lg:translate-y-4 transition-transform duration-300 lg:hover:-translate-y-1">
              {/* Phone bezel */}
              <div className="relative aspect-[9/18] rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-950 p-2 shadow-2xl shadow-[#069494]/20">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl bg-zinc-900 dark:bg-zinc-950 z-10" />
                {/* Screen */}
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white">
                  <Image
                    src="/mobile-screens/mobile-account.png"
                    alt="BoothIQ mobile app — account, branding, and subscription"
                    fill
                    className="object-cover object-top dark:brightness-[0.85] dark:saturate-95"
                    sizes="256px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature cards — operator-framed, no fear-based language. Icons
              are inline Heroicons SVGs in teal-tinted containers, matching
              the visual language used in the Features section above. */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Live Revenue",
                desc: "Revenue and transaction counts as they happen",
                iconPath:
                  "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
              },
              {
                title: "Multi-Booth View",
                desc: "All your booths in one fleet dashboard",
                iconPath:
                  "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
              },
              {
                title: "Subscription & Billing",
                desc: "Manage plans and billing from your phone",
                iconPath:
                  "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
              },
              {
                title: "Synced Everywhere",
                desc: "iOS, Android, and web — same data",
                iconPath:
                  "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-white/50 dark:bg-[#111111]/50 border border-slate-200/50 dark:border-zinc-800/50">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#069494]/10 border border-[#069494]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.iconPath} />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Download buttons — real native apps, real store links to add later */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/downloads" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-60">Download on the</div>
                <div className="font-semibold -mt-0.5">App Store</div>
              </div>
            </Link>
            <Link href="/downloads" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-60">Get it on</div>
                <div className="font-semibold -mt-0.5">Google Play</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
       * How It Works - Timeline
       * ============================================ */}
      <section className="py-32 px-6 bg-slate-100/50 dark:bg-[#111111]/30 border-y border-slate-200/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#069494] font-medium tracking-widest text-sm mb-4">HOW IT WORKS</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              From sign-up to live booth<br />in three steps
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#069494] via-[#069494]/50 to-transparent" />

            {/* Steps */}
            <div className="space-y-16">
              {/* Step 1 — Sign up for the cloud portal */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:text-right md:pr-16 pl-20 md:pl-0">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#069494] text-white text-sm font-bold mb-4">
                    Step 1
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Create your account</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Sign up for BoothIQ in seconds. Your account is the home
                    base for every booth you operate — accessible from iOS,
                    Android, or any browser.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#069494] ring-4 ring-[#069494]/20" />
                <div className="md:pl-16 pl-20">
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#069494]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Account ready</div>
                        <div className="text-sm text-zinc-500">Sign in from any device</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 — Add a booth and pick a per-booth subscription */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:order-2 md:pl-16 pl-20">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#069494] text-white text-sm font-bold mb-4">
                    Step 2
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Add a booth, pick a plan</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Create a booth in your dashboard and choose a subscription.
                    Each booth has its own plan — you only pay for what you
                    actually run.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#069494] ring-4 ring-[#069494]/20" />
                <div className="md:order-1 md:pr-16 md:text-right pl-20 md:pl-0">
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 md:inline-block">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-xl bg-[#069494]/10 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Subscription active</div>
                        <div className="text-sm text-zinc-500">One plan per booth</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 — Pair the cloud booth with the physical BoothIQ unit */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:text-right md:pr-16 pl-20 md:pl-0">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#069494] text-white text-sm font-bold mb-4">
                    Step 3
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Link your hardware</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Pair your cloud booth with the BoothIQ unit running at
                    your venue. The two start syncing instantly — revenue,
                    supply levels, and settings flow live to your dashboard.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#069494] ring-4 ring-[#069494]/20" />
                <div className="md:pl-16 pl-20">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-[#069494]/10 to-[#176161]/10 border border-[#069494]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#069494]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-[#069494]">Linked &amp; syncing</div>
                        <div className="text-sm text-zinc-500">Live data flowing to your dashboard</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Final CTA
       * ============================================ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20 dark:opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 dark:bg-[#069494]/20 blur-[150px] rounded-full" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Ready to manage your booths
            <br />
            <span className="text-[#069494]">from anywhere?</span>
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            Sign up for BoothIQ in seconds. Add your first booth, link it to
            the cloud, and start watching live revenue from your phone.
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
