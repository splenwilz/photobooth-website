import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore PhotoBoothX features: DSLR support, instant printing, templates, mobile app, payments, and analytics.",
};

/* ============================================
 * Feature Data
 * ============================================ */

const categories = [
  {
    name: "Capture",
    icon: "📷",
    description: "Professional-grade photo capture for any setup",
    features: [
      { title: "DSLR Tethering", desc: "Canon, Nikon, Sony with full control" },
      { title: "USB Webcam", desc: "Logitech C920, C922, BRIO support" },
      { title: "Countdown Timer", desc: "Customizable with audio cues" },
      { title: "Green Screen", desc: "Real-time background removal" },
      { title: "Burst Mode", desc: "Capture sequences for GIFs" },
      { title: "Live Preview", desc: "See exactly what guests see" },
    ],
  },
  {
    name: "Templates",
    icon: "🎨",
    description: "Beautiful layouts for every occasion",
    features: [
      { title: "100+ Layouts", desc: "Strips, 4x6, squares, and more" },
      { title: "Drag & Drop Editor", desc: "Create custom designs easily" },
      { title: "Event Branding", desc: "Add logos, colors, and themes" },
      { title: "Animated GIFs", desc: "Auto-generate shareable GIFs" },
      { title: "Boomerangs", desc: "Fun looping video clips" },
      { title: "Digital Delivery", desc: "QR codes for instant sharing" },
    ],
  },
  {
    name: "Printing",
    icon: "🖨️",
    description: "Lab-quality prints in seconds",
    features: [
      { title: "DNP Support", desc: "RX1hs, DS620, DS820 printers" },
      { title: "HiTi & Mitsubishi", desc: "Full compatibility" },
      { title: "Print Queue", desc: "Manage multiple jobs" },
      { title: "Paper Tracking", desc: "Low supply alerts" },
      { title: "2x6 & 4x6 Sizes", desc: "Standard formats" },
      { title: "Dry & Ready", desc: "Instant takeaway" },
    ],
  },
  {
    name: "Payments",
    icon: "💳",
    description: "Accept payments your way",
    features: [
      { title: "Coin Acceptor", desc: "Arcade-style operation" },
      { title: "Card Payments", desc: "Credit, debit, tap-to-pay" },
      { title: "Custom Pricing", desc: "Per product or package" },
      { title: "Free Play Mode", desc: "For private events" },
      { title: "Credits System", desc: "Prepaid booth credits" },
      { title: "Revenue Reports", desc: "Track all transactions" },
    ],
  },
  {
    name: "Mobile App",
    icon: "📱",
    description: "Your booths in your pocket",
    features: [
      { title: "iOS & Android", desc: "Native apps for both" },
      { title: "Real-time Alerts", desc: "Instant notifications" },
      { title: "Revenue Dashboard", desc: "Track earnings live" },
      { title: "Remote Restart", desc: "Fix issues remotely" },
      { title: "Multi-Booth", desc: "Manage unlimited booths" },
      { title: "Offline Mode", desc: "Works without internet" },
    ],
  },
  {
    name: "Analytics",
    icon: "📊",
    description: "Data-driven insights",
    features: [
      { title: "Transaction History", desc: "Complete audit trail" },
      { title: "Revenue Reports", desc: "Export CSV & PDF" },
      { title: "Usage Stats", desc: "Peak hours & patterns" },
      { title: "Booth Comparison", desc: "Cross-booth analytics" },
      { title: "Product Performance", desc: "Best sellers" },
      { title: "Trend Analysis", desc: "Week over week" },
    ],
  },
];

const integrations = [
  { name: "Canon", type: "Camera" },
  { name: "Nikon", type: "Camera" },
  { name: "Sony", type: "Camera" },
  { name: "Logitech", type: "Webcam" },
  { name: "DNP", type: "Printer" },
  { name: "HiTi", type: "Printer" },
  { name: "Mitsubishi", type: "Printer" },
  { name: "Stripe", type: "Payments" },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0891B2]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#A855F7]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#0891B2] dark:text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Powerful Features
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Everything you need to run
              <br />
              <span className="text-[#0891B2]">professional photo booths</span>
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              From capture to print, payments to analytics. One software, endless possibilities.
            </p>
          </div>

          {/* Hero Feature Cards - Enhanced with Visuals */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Camera Integration */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/10 via-slate-100 to-slate-100 dark:from-[#0891B2]/20 dark:via-[#111111] dark:to-[#111111]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#0891B2]/10 dark:bg-[#0891B2]/20 blur-3xl rounded-full" />

              <div className="relative p-8 border border-[#0891B2]/20 rounded-3xl h-full group-hover:border-[#0891B2]/50 transition-colors">
                {/* Mini visual */}
                <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-[var(--background)] border border-slate-200 dark:border-[var(--border)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-xs text-[var(--muted)]">Logitech C920</span>
                    <span className="ml-auto text-xs text-[#0891B2]">1080p</span>
                  </div>
                  <div className="aspect-video rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-[var(--border)] flex items-center justify-center relative overflow-hidden">
                    <div className="w-12 h-12 border-2 border-[#0891B2] rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-[#0891B2] rounded-full animate-pulse" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] text-[var(--muted)]">
                      <span>ISO 400</span>
                      <span>f/2.8</span>
                    </div>
                  </div>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0891B2]/20 flex items-center justify-center text-2xl">
                    📷
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-[#0891B2] dark:group-hover:text-[#22D3EE] transition-colors">Camera Integration</h3>
                    <p className="text-xs text-[var(--muted)]">Webcam + DSLR support</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">
                  USB webcams for simple setups, or tether Canon, Nikon, Sony for pro quality.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {["Live Preview", "Auto-Focus", "Green Screen"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#0891B2]/10 text-[#0891B2] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 - Instant Printing */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 via-slate-100 to-slate-100 dark:from-[#F59E0B]/20 dark:via-[#111111] dark:to-[#111111]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 blur-3xl rounded-full" />

              <div className="relative p-8 border border-[#F59E0B]/20 rounded-3xl h-full group-hover:border-[#F59E0B]/50 transition-colors">
                {/* Mini visual - Print preview */}
                <div className="mb-6 flex items-center justify-center gap-4">
                  {/* 2x6 Strip */}
                  <div className="w-16 bg-white rounded-lg p-1.5 shadow-xl shadow-black/30 transform -rotate-3">
                    <div className="space-y-0.5">
                      <div className="aspect-[3/2] bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-sm" />
                      <div className="aspect-[3/2] bg-gradient-to-br from-zinc-300 to-zinc-200 rounded-sm" />
                      <div className="aspect-[3/2] bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-sm" />
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-[5px] text-[var(--muted)] font-medium">2x6 STRIP</span>
                    </div>
                  </div>
                  {/* 4x6 Print */}
                  <div className="w-24 bg-white rounded-lg p-1.5 shadow-xl shadow-black/30 transform rotate-2">
                    <div className="aspect-[3/2] bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-sm" />
                    <div className="text-center mt-1">
                      <span className="text-[5px] text-[var(--muted)] font-medium">4x6 PHOTO</span>
                    </div>
                  </div>
                </div>

                {/* Printer status bar */}
                <div className="mb-4 p-3 rounded-xl bg-white dark:bg-[var(--background)] border border-slate-200 dark:border-[var(--border)] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                    <span className="text-lg">🖨️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">DNP RX1hs</div>
                    <div className="text-[10px] text-[#10B981]">Ready • 342 prints</div>
                  </div>
                  <div className="text-xs text-[var(--muted)]">~8s</div>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center text-2xl">
                    🖨️
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-[#d97706] dark:group-hover:text-[#F59E0B] transition-colors">Instant Printing</h3>
                    <p className="text-xs text-[var(--muted)]">Lab-quality in seconds</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {["2x6 Strips", "4x6 Photos", "8 Sec Print"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 - Mobile Management */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/10 via-slate-100 to-slate-100 dark:from-[#A855F7]/20 dark:via-[#111111] dark:to-[#111111]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#A855F7]/10 dark:bg-[#A855F7]/20 blur-3xl rounded-full" />

              <div className="relative p-8 border border-[#A855F7]/20 rounded-3xl h-full group-hover:border-[#A855F7]/50 transition-colors">
                {/* Mini phone mockup */}
                <div className="mb-6 flex justify-center">
                  <div className="w-32 rounded-2xl bg-white dark:bg-[var(--background)] border-4 border-slate-200 dark:border-[var(--border)] p-1.5 shadow-xl shadow-black/10 dark:shadow-black/30">
                    <div className="rounded-xl bg-slate-50 dark:bg-[var(--card)] p-2">
                      {/* Revenue */}
                      <div className="text-center mb-2 p-2 rounded-lg bg-[#A855F7]/10">
                        <div className="text-lg font-bold text-[#A855F7]">$2,847</div>
                        <div className="text-[8px] text-[var(--muted)]">Today</div>
                      </div>
                      {/* Booths */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-100 dark:bg-zinc-900">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          <span className="text-[8px] flex-1">Mall #1</span>
                          <span className="text-[8px] text-[#10B981]">$847</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-100 dark:bg-zinc-900">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                          <span className="text-[8px] flex-1">Wedding</span>
                          <span className="text-[8px] text-[var(--muted)]">$1.2k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification preview */}
                <div className="mb-4 p-3 rounded-xl bg-white dark:bg-[var(--background)] border border-[#A855F7]/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
                    <span className="text-sm">🔔</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">Paper Low Alert</div>
                    <div className="text-[10px] text-[var(--muted)]">Mall Booth #1 • 12 prints left</div>
                  </div>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#A855F7]/20 flex items-center justify-center text-2xl">
                    📱
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-[#9333ea] dark:group-hover:text-[#A855F7] transition-colors">Mobile Management</h3>
                    <p className="text-xs text-[var(--muted)]">iOS & Android</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {["Live Alerts", "Remote Control", "Multi-Booth"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#A855F7]/10 text-[#A855F7] text-xs font-medium">
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
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#0891B2]/5 blur-[200px] rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#A855F7]/5 blur-[150px] rounded-full -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#0891B2] dark:text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              40+ Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Explore all features
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
              Every tool you need to run a successful photo booth business
            </p>
          </div>

          {/* Feature Categories - Stacked Cards */}
          <div className="space-y-8">
            {categories.map((category, categoryIndex) => {
              const colors = ["#0891B2", "#F59E0B", "#A855F7", "#10B981", "#EC4899", "#3B82F6"];
              const color = colors[categoryIndex % colors.length];
              
              return (
                <div
                  key={category.name}
                  className="group relative rounded-3xl overflow-hidden"
                >
                  {/* Card background with gradient */}
                  <div 
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
                  />
                  <div className="absolute inset-0 bg-[var(--card)]" style={{ opacity: 0.95 }} />
                  
                  <div className="relative p-8 md:p-10 border border-[var(--border)] group-hover:border-[var(--border)] rounded-3xl transition-colors">
                    {/* Category Header */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg transition-transform group-hover:scale-110"
                          style={{ 
                            backgroundColor: `${color}20`,
                            boxShadow: `0 8px 32px ${color}20`
                          }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 
                            className="text-2xl font-bold transition-colors"
                            style={{ color: color }}
                          >
                            {category.name}
                          </h3>
                          <p className="text-[var(--muted)]">{category.description}</p>
                        </div>
                      </div>
                      
                      {/* Feature count badge */}
                      <div 
                        className="md:ml-auto px-4 py-2 rounded-full text-sm font-medium w-fit"
                        style={{ 
                          backgroundColor: `${color}15`,
                          color: color
                        }}
                      >
                        {category.features.length} features
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.features.map((feature, featureIndex) => (
                        <div 
                          key={feature.title}
                          className="group/item p-5 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)]/50 hover:border-[var(--border)] hover:bg-[var(--background)] transition-all"
                        >
                          <div className="flex items-start gap-4">
                            {/* Number */}
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors group-hover/item:scale-110"
                              style={{ 
                                backgroundColor: `${color}15`,
                                color: color
                              }}
                            >
                              {String(featureIndex + 1).padStart(2, "0")}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[var(--foreground)] mb-1 group-hover/item:text-[#0891B2] dark:group-hover/item:text-[#22D3EE] transition-colors">
                                {feature.title}
                              </h4>
                              <p className="text-sm text-[var(--muted)] leading-relaxed">
                                {feature.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "40+", label: "Total Features", icon: "⚡" },
              { value: "6", label: "Categories", icon: "📦" },
              { value: "100%", label: "Customizable", icon: "🎨" },
              { value: "24/7", label: "Available", icon: "🌐" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-white dark:bg-[var(--card)] border border-slate-200 dark:border-[var(--border)] text-center"
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <div className="text-2xl font-bold text-[#0891B2] mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * Hardware Compatibility
       * ============================================ */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-[var(--card)]/50 border-y border-slate-200 dark:border-[var(--border)]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Works With Your Hardware
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Compatible with industry leaders
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              PhotoBoothX works with the hardware you already own
            </p>
          </div>

          {/* Hardware Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="p-6 rounded-2xl bg-white dark:bg-[var(--background)] border border-slate-200 dark:border-[var(--border)] text-center hover:border-[#0891B2]/30 transition-colors"
              >
                <div className="text-2xl font-bold text-[var(--foreground)] mb-1">{item.name}</div>
                <div className="text-xs text-[var(--muted)]">{item.type}</div>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              And many more. <Link href="/docs" className="text-[#0891B2] dark:text-[#22D3EE] hover:underline">See full compatibility list →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
       * Comparison Section - Enhanced
       * ============================================ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#0a0a0a] dark:via-[#111111]/50 dark:to-[#0a0a0a]" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              The Difference
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Before & After
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
              See how PhotoBoothX transforms your photo booth operations
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="relative">
            {/* Center Arrow/Divider - Desktop */}
            <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-[var(--background)] border-4 border-slate-200 dark:border-[var(--border)] flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
              {/* Without PhotoBoothX */}
              <div className="relative group">
                {/* Red glow on hover */}
                <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative h-full p-8 md:p-10 rounded-3xl bg-white dark:bg-[var(--card)] border border-red-500/20 group-hover:border-red-500/40 transition-colors">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                      <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-400">Without PhotoBoothX</h3>
                      <p className="text-[var(--muted)]">The old, manual way</p>
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="space-y-4">
                    {[
                      { icon: "📊", title: "Manual Spreadsheets", desc: "Hours spent tracking revenue by hand" },
                      { icon: "🚗", title: "Physical Visits Required", desc: "Drive to each booth to check status" },
                      { icon: "😰", title: "Missed Issues", desc: "Paper runs out, no one knows" },
                      { icon: "💸", title: "Lost Revenue", desc: "Downtime goes unnoticed for hours" },
                      { icon: "🔀", title: "Multiple Apps", desc: "Juggling between different tools" },
                      { icon: "📵", title: "No Remote Access", desc: "Can't manage from your phone" },
                    ].map((item) => (
                      <div 
                        key={item.title}
                        className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10"
                      >
                        <span className="text-xl opacity-50">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-[var(--foreground-secondary)] mb-0.5">{item.title}</h4>
                          <p className="text-sm text-[var(--muted)]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom stat */}
                  <div className="mt-8 pt-6 border-t border-red-500/10 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-red-400">-$2,400</div>
                      <div className="text-sm text-[var(--muted)]">Lost monthly revenue</div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-medium">
                      😩 Stressful
                    </div>
                  </div>
                </div>
              </div>

              {/* With PhotoBoothX */}
              <div className="relative group">
                {/* Green glow on hover */}
                <div className="absolute inset-0 bg-[#10B981]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative h-full p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#10B981]/10 via-white to-[#0891B2]/5 dark:from-[#10B981]/10 dark:via-[#111111] dark:to-[#0891B2]/5 border border-[#10B981]/30 group-hover:border-[#10B981]/50 transition-colors">
                  {/* Recommended badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-[#10B981] text-white text-sm font-semibold shadow-lg shadow-[#10B981]/30">
                      ✨ Recommended
                    </div>
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8 mt-2">
                    <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#10B981]">With PhotoBoothX</h3>
                      <p className="text-[var(--muted)]">The smart, automated way</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4">
                    {[
                      { icon: "📱", title: "Real-time Dashboard", desc: "Revenue updates live on your phone" },
                      { icon: "🔔", title: "Instant Alerts", desc: "Get notified before issues become problems" },
                      { icon: "🌍", title: "Remote Monitoring", desc: "Check any booth from anywhere" },
                      { icon: "💰", title: "Maximize Revenue", desc: "Never miss a sales opportunity" },
                      { icon: "🎯", title: "All-in-One Platform", desc: "Everything you need in one place" },
                      { icon: "🚀", title: "Full Mobile Control", desc: "Restart, configure, manage remotely" },
                    ].map((item) => (
                      <div 
                        key={item.title}
                        className="flex items-start gap-4 p-4 rounded-xl bg-[#10B981]/5 border border-[#10B981]/10"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-[var(--foreground)] mb-0.5">{item.title}</h4>
                          <p className="text-sm text-[var(--muted)]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom stat */}
                  <div className="mt-8 pt-6 border-t border-[#10B981]/20 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-[#10B981]">+$8,500</div>
                      <div className="text-sm text-[var(--muted)]">Potential monthly gain</div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-[#10B981]/10 text-[#10B981] text-sm font-medium">
                      🎉 Effortless
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-[var(--muted)] mb-6">Ready to make the switch?</p>
            <Link
              href="/downloads"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-105 shadow-lg shadow-[#0891B2]/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
       * Final CTA
       * ============================================ */}
      <section className="py-24 px-6 border-t border-slate-200 dark:border-[var(--border)]/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to experience all features?
          </h2>
          <p className="text-[var(--muted)] text-lg mb-10 max-w-xl mx-auto">
            Download PhotoBoothX and start your 14-day free trial. 
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/downloads"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-[#0891B2]/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Free Trial
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[var(--border)] font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              View Pricing
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
