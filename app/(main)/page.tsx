import Link from "next/link";

/* ============================================
 * Demo Data
 * ============================================ */


const stats = [
  { value: "10K+", label: "Active Booths" },
  { value: "50M+", label: "Photos Captured" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "App Store" },
];


export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-28 pb-20 px-6">
        {/* Animated grid background */}
        <div className="absolute inset-0 grid-pattern" />
        
        {/* Multiple glow effects */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#0891B2]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#0E7490]/15 blur-[120px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0891B2]/30 bg-[#0891B2]/10 text-sm text-[#22D3EE] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              v2.4 now available — see what&apos;s new
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              The photo booth software
              <br />
              <span className="text-[#0891B2]">professionals trust</span>
          </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Capture stunning photos, print instantly, and manage everything from your phone. 
              Trusted by 10,000+ operators worldwide.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/downloads"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Free
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#0891B2]/30 text-zinc-300 font-semibold hover:bg-[#0891B2]/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Trust indicators */}
            <p className="text-sm text-zinc-500">
              Free 14-day trial · No credit card required · Cancel anytime
            </p>
          </div>

          {/* App Preview */}
          <div className="mt-16 relative">
            {/* Floating elements */}
            <div className="absolute -left-4 top-1/4 p-4 rounded-xl bg-[#111111] border border-[#0891B2]/20 shadow-xl hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Print Complete</div>
                  <div className="text-xs text-zinc-500">Photo Strip #1247</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-1/3 p-4 rounded-xl bg-[#111111] border border-[#0891B2]/20 shadow-xl hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0891B2]/20 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <div className="text-sm font-medium">$2,847</div>
                  <div className="text-xs text-zinc-500">Revenue today</div>
                </div>
              </div>
            </div>

            {/* Main preview */}
            <div className="aspect-video max-w-4xl mx-auto rounded-2xl border border-[#0891B2]/20 bg-[#111111] brand-glow overflow-hidden">
              <div className="h-full flex">
                {/* Sidebar */}
                <div className="w-56 border-r border-[#0891B2]/10 p-4 hidden md:flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </div>
                    <span className="font-semibold text-sm">PhotoBoothX</span>
                  </div>
                  <div className="space-y-1 flex-1">
                    {["Dashboard", "Templates", "Gallery", "Settings"].map((item, i) => (
                      <div
                        key={item}
                        className={`px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${i === 0 ? "bg-[#0891B2]/20 text-[#22D3EE]" : "text-zinc-500 hover:text-zinc-300"}`}
                      >
                        {["📊", "🎨", "🖼️", "⚙️"][i]} {item}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[#0891B2]/10">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      Booth Online
                    </div>
                  </div>
                </div>
                
                {/* Main content */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">Live Preview</h3>
                      <p className="text-xs text-zinc-500">Logitech C920 · 1080p</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-medium">● Live</span>
                    </div>
                  </div>
                  {/* Camera view */}
                  <div className="aspect-[4/3] rounded-xl border border-[#0891B2]/10 bg-gradient-to-br from-[#0a0a0a] to-[#111111] flex items-center justify-center relative overflow-hidden">
                    {/* Viewfinder grid */}
                    <div className="absolute inset-4 border border-white/10 rounded-lg">
                      <div className="absolute top-1/3 left-0 right-0 border-t border-white/5" />
                      <div className="absolute top-2/3 left-0 right-0 border-t border-white/5" />
                      <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/5" />
                      <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/5" />
                    </div>
                    {/* Center focus */}
                    <div className="w-20 h-20 border-2 border-[#0891B2] rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#0891B2] rounded-full" />
                    </div>
                    {/* Capture button hint */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#0891B2] text-white text-sm font-medium">
                      Tap to Capture
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Features - Alternating Layout
       * ============================================ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-24">
            <p className="text-[#0891B2] font-medium tracking-widest text-sm mb-4">FEATURES</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Everything you need,<br />nothing you don&apos;t
            </h2>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto">
              Professional tools built for real photo booth operators
            </p>
          </div>

          {/* Feature 1 - Camera Control */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" />
                Camera Integration
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Webcams & DSLRs supported
              </h3>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Use USB webcams like Logitech C920 for simple setups, or tether 
                Canon, Nikon, Sony DSLRs for professional quality. Your choice.
              </p>
              <ul className="space-y-4">
                {[
                  "USB webcams (Logitech C920, C922, BRIO)",
                  "DSLR tethering with live preview",
                  "Custom countdown timers",
                  "Auto color correction and filters"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-[#0891B2]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#0891B2]/20 blur-[100px] rounded-full" />
              <div className="relative aspect-square rounded-3xl bg-[#111111] border border-[#0891B2]/20 p-8 overflow-hidden">
                {/* Camera UI mockup */}
                <div className="w-full h-full rounded-2xl bg-[#0a0a0a] border border-zinc-800 flex flex-col">
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                      <span className="text-xs text-zinc-500">Logitech C920</span>
                    </div>
                    <span className="text-xs text-[#0891B2]">1080p</span>
                  </div>
                  {/* Viewfinder */}
                  <div className="flex-1 p-4">
                    <div className="w-full h-full rounded-xl border-2 border-dashed border-[#0891B2]/30 flex items-center justify-center relative">
                      <div className="absolute inset-4 grid grid-cols-3 grid-rows-3">
                        {["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"].map((id) => (
                          <div key={id} className="border border-white/5" />
                        ))}
                      </div>
                      <div className="w-16 h-16 border-2 border-[#0891B2] rounded-lg flex items-center justify-center z-10">
                        <div className="w-3 h-3 bg-[#0891B2] rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                  {/* Bottom controls */}
                  <div className="flex items-center justify-center gap-4 px-4 py-4 border-t border-zinc-800">
                    <div className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-400">ISO 400</div>
                    <div className="w-14 h-14 rounded-full bg-[#0891B2] flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-white/80" />
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-400">f/2.8</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Printing (reversed) */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            {/* Visual - Left side */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-[#F59E0B]/10 blur-[100px] rounded-full" />
              <div className="relative aspect-square rounded-3xl bg-[#111111] border border-zinc-800 p-8 overflow-hidden">
                {/* Print preview mockup */}
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                  {/* Photo strip preview */}
                  <div className="w-32 bg-white rounded-lg p-2 shadow-2xl transform -rotate-3">
                    <div className="space-y-1">
                      <div className="aspect-[3/2] bg-zinc-200 rounded" />
                      <div className="aspect-[3/2] bg-zinc-300 rounded" />
                      <div className="aspect-[3/2] bg-zinc-200 rounded" />
                      <div className="h-6 flex items-center justify-center">
                        <span className="text-[8px] text-zinc-400 font-medium">PHOTOBOOTHX</span>
                      </div>
                    </div>
                  </div>
                  {/* Printer animation */}
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                    <svg className="w-4 h-4 text-[#10B981] animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-xs text-[#10B981] font-medium">Printing in 8s...</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Content - Right side */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                Instant Printing
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Lab-quality prints in seconds
              </h3>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Connect dye-sublimation printers for professional-grade prints 
                that guests can take home immediately. No waiting, no hassle.
              </p>
              <ul className="space-y-4">
                {[
                  "DNP RX1hs, DS620, HiTi, Mitsubishi",
                  "2x 2x6 strips or 1x 4x6 per vend",
                  "Automatic paper and ribbon tracking",
                  "Print preview before confirmation"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-300">
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
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#111111]/50 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#A855F7]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#0891B2]/10 blur-[150px] rounded-full" />

        <div className="max-w-6xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile App
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Your booths in your pocket
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Monitor revenue, get instant alerts, and control your booths remotely. 
              Available for iOS and Android.
            </p>
          </div>

          {/* Phone Showcase */}
          <div className="relative flex justify-center items-end gap-4 md:gap-8 mb-16">
            {/* Left Phone - Analytics */}
            <div className="hidden md:block w-48 rounded-[2rem] bg-[#0a0a0a] border-4 border-zinc-800 p-1.5 shadow-2xl transform -rotate-6 translate-y-8">
              <div className="w-full rounded-[1.5rem] bg-[#111111] overflow-hidden">
                <div className="px-3 py-2 flex items-center justify-between border-b border-zinc-800">
                  <span className="text-[10px] text-zinc-500">Analytics</span>
                  <div className="w-2 h-2 rounded-full bg-[#A855F7]" />
                </div>
                <div className="p-3">
                  {/* Mini chart */}
                  <div className="h-20 flex items-end gap-1 mb-3">
                    {[
                      { id: "mon", h: 40 },
                      { id: "tue", h: 65 },
                      { id: "wed", h: 45 },
                      { id: "thu", h: 80 },
                      { id: "fri", h: 55 },
                      { id: "sat", h: 90 },
                      { id: "sun", h: 70 },
                    ].map((bar) => (
                      <div 
                        key={bar.id}
                        className="flex-1 bg-gradient-to-t from-[#A855F7] to-[#A855F7]/30 rounded-t"
                        style={{ height: `${bar.h}%` }}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#A855F7]">$12,450</div>
                    <div className="text-[9px] text-zinc-500">This Month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Phone - Main Dashboard (larger) */}
            <div className="w-64 sm:w-72 rounded-[3rem] bg-[#0a0a0a] border-8 border-zinc-800 p-2 shadow-2xl relative z-10">
              {/* Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
              <div className="w-full rounded-[2.2rem] bg-[#111111] overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 py-3 pt-8">
                  <span className="text-xs text-zinc-500">9:41</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-zinc-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                    </svg>
                    <svg className="w-3 h-3 text-zinc-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17 4h-3V2h-4v2H7v18h10V4zm-2 16H9V6h6v14z"/>
                    </svg>
                  </div>
                </div>
                {/* App content */}
                <div className="px-4 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[10px] text-zinc-500">Good morning</div>
                      <h4 className="font-semibold">Dashboard</h4>
                    </div>
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center text-xs font-bold">
                        JD
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#EF4444] border-2 border-[#111111]" />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-3 rounded-xl bg-[#0891B2]/10 border border-[#0891B2]/20">
                      <div className="text-[10px] text-zinc-500 mb-0.5">Revenue</div>
                      <div className="text-lg font-bold text-[#0891B2]">$2,847</div>
                      <div className="flex items-center gap-0.5">
                        <svg className="w-2 h-2 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-[9px] text-[#10B981]">+24%</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                      <div className="text-[10px] text-zinc-500 mb-0.5">Photos</div>
                      <div className="text-lg font-bold text-[#10B981]">1,247</div>
                      <div className="text-[9px] text-zinc-500">today</div>
                    </div>
                  </div>

                  {/* Booths section */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-400">Your Booths</span>
                      <span className="text-[10px] text-[#0891B2]">See all</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                        <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">Mall Booth #1</div>
                          <div className="text-[9px] text-zinc-500">42 photos today</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-[#10B981]">$847</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                        <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">Wedding Setup</div>
                          <div className="text-[9px] text-zinc-500">Idle · 2h ago</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-zinc-400">$1,200</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom nav hint */}
                  <div className="flex justify-center gap-6 pt-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0891B2] flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center relative">
                      <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Phone - Alerts */}
            <div className="hidden md:block w-48 rounded-[2rem] bg-[#0a0a0a] border-4 border-zinc-800 p-1.5 shadow-2xl transform rotate-6 translate-y-8">
              <div className="w-full rounded-[1.5rem] bg-[#111111] overflow-hidden">
                <div className="px-3 py-2 flex items-center justify-between border-b border-zinc-800">
                  <span className="text-[10px] text-zinc-500">Alerts</span>
                  <div className="px-1.5 py-0.5 rounded-full bg-[#EF4444] text-[8px] font-bold">3</div>
                </div>
                <div className="p-2 space-y-2">
                  <div className="p-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
                        <span className="text-[8px]">⚠️</span>
                      </div>
                      <span className="text-[9px] font-medium text-[#EF4444]">Paper Low</span>
                    </div>
                    <p className="text-[8px] text-zinc-500">Mall Booth #1 · 12 prints left</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
                        <span className="text-[8px]">📷</span>
                      </div>
                      <span className="text-[9px] font-medium text-[#F59E0B]">Camera Offline</span>
                    </div>
                    <p className="text-[8px] text-zinc-500">Wedding Setup · 5m ago</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                        <span className="text-[8px]">💰</span>
                      </div>
                      <span className="text-[9px] font-medium text-[#10B981]">Goal Reached!</span>
                    </div>
                    <p className="text-[8px] text-zinc-500">$2,500 daily target hit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature List + Download */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: "📊", title: "Real-time Analytics", desc: "Revenue, photos, and trends at a glance" },
              { icon: "🔔", title: "Instant Alerts", desc: "Paper low, errors, and milestones" },
              { icon: "🔄", title: "Remote Control", desc: "Restart apps, reboot systems remotely" },
              { icon: "📍", title: "Multi-Booth", desc: "Manage unlimited booths from one app" },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-[#111111]/50 border border-zinc-800/50">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-zinc-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Download buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/downloads" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-60">Download on the</div>
                <div className="font-semibold -mt-0.5">App Store</div>
              </div>
            </Link>
            <Link href="/downloads" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors">
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
      <section className="py-32 px-6 bg-[#111111]/30 border-y border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#0891B2] font-medium tracking-widest text-sm mb-4">HOW IT WORKS</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              From download to first photo<br />in under 10 minutes
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#0891B2] via-[#0891B2]/50 to-transparent" />

            {/* Steps */}
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:text-right md:pr-16 pl-20 md:pl-0">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0891B2] text-white text-sm font-bold mb-4">
                    Step 1
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Download & Install</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Grab the installer for Windows or Mac. Run it, and you&apos;re done. 
                    No command line, no configuration files, no headaches.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#0891B2] ring-4 ring-[#0891B2]/20" />
                <div className="md:pl-16 pl-20">
                  <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0891B2]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">PhotoBoothX-Setup.exe</div>
                        <div className="text-sm text-zinc-500">124 MB · Windows 10+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:order-2 md:pl-16 pl-20">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0891B2] text-white text-sm font-bold mb-4">
                    Step 2
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Connect Your Hardware</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Plug in your camera and printer via USB. PhotoBoothX automatically 
                    detects and configures them. Green lights mean good to go.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#0891B2] ring-4 ring-[#0891B2]/20" />
                <div className="md:order-1 md:pr-16 md:text-right pl-20 md:pl-0">
                  <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-zinc-800 md:inline-block">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-sm">Logitech C920 — Connected</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-sm">DNP RX1hs — Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:text-right md:pr-16 pl-20 md:pl-0">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0891B2] text-white text-sm font-bold mb-4">
                    Step 3
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Start Capturing</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Choose a template, set your pricing, and hit Start Booth. 
                    Guests can now take photos, and you can start making money.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#10B981] ring-4 ring-[#10B981]/20" />
                <div className="md:pl-16 pl-20">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10B981]/10 to-[#0891B2]/10 border border-[#10B981]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-[#10B981]">You&apos;re Live!</div>
                        <div className="text-sm text-zinc-500">Ready to capture memories</div>
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
       * Social Proof / Testimonial
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#0891B2]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-4xl mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-[#111111] border border-[#0891B2]/10">
                <div className="text-3xl font-bold text-[#0891B2] mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Featured testimonial */}
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-[#0891B2]/20 mb-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-2xl sm:text-3xl font-medium text-white leading-relaxed mb-8 max-w-3xl mx-auto">
              &ldquo;PhotoBoothX transformed our business. We went from managing chaos to 
              running 12 booths effortlessly. The mobile app is a game-changer.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center text-white font-bold text-lg">
                JM
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">James Mitchell</div>
                <div className="text-sm text-zinc-500">CEO, Premier Photo Experiences</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Use Cases - Featured Grid
       * ============================================ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#0891B2] font-medium tracking-widest text-sm mb-4">USE CASES</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Built for every occasion
            </h2>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto">
              From intimate weddings to high-traffic retail locations
            </p>
          </div>

          {/* Featured + Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Featured Card - Weddings */}
            <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0891B2]/20 via-[#111111] to-[#0a0a0a] border border-[#0891B2]/20 p-10 lg:row-span-2 flex flex-col justify-end min-h-[400px]">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#0891B2]/10 blur-[100px] rounded-full" />
              <div className="absolute top-8 right-8 text-8xl opacity-30 group-hover:opacity-50 transition-opacity">
                💒
              </div>
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium mb-4">
                  Most Popular
                </div>
                <h3 className="text-3xl font-bold mb-4 group-hover:text-[#22D3EE] transition-colors">
                  Weddings & Receptions
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6 max-w-md">
                  Create unforgettable guest experiences with custom templates, 
                  instant photo strips, and digital sharing. The perfect addition to any celebration.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Custom Templates", "Guest Book Mode", "Instant Prints"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-white/5 text-sm text-zinc-300 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - 3 cards */}
            <div className="grid gap-6">
              {/* Corporate */}
              <div className="group relative rounded-2xl overflow-hidden bg-[#111111] border border-zinc-800 p-8 hover:border-[#0891B2]/30 transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0 text-3xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#22D3EE] transition-colors">
                      Corporate Events
                    </h3>
                    <p className="text-zinc-500 leading-relaxed">
                      Brand activations, trade shows, and team events. Add logo overlays, 
                      capture leads, and share to social instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Retail */}
              <div className="group relative rounded-2xl overflow-hidden bg-[#111111] border border-zinc-800 p-8 hover:border-[#0891B2]/30 transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 text-3xl">
                    🛍️
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#22D3EE] transition-colors">
                      Retail & Malls
                    </h3>
                    <p className="text-zinc-500 leading-relaxed">
                      Unattended coin-operated booths that run 24/7. Accept payments, 
                      track revenue, and monitor remotely from anywhere.
                    </p>
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div className="group relative rounded-2xl overflow-hidden bg-[#111111] border border-zinc-800 p-8 hover:border-[#0891B2]/30 transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0 text-3xl">
                    🎉
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#22D3EE] transition-colors">
                      Parties & Celebrations
                    </h3>
                    <p className="text-zinc-500 leading-relaxed">
                      Birthdays, graduations, holidays. Fun props, themed templates, 
                      and GIF creation make every party memorable.
                    </p>
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
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0891B2]/20 blur-[150px] rounded-full" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Ready to transform your
            <br />
            <span className="text-[#0891B2]">photo booth business?</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join 10,000+ operators who trust PhotoBoothX. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/downloads"
              className="w-full sm:w-auto px-10 py-5 rounded-xl bg-[#0891B2] text-white font-semibold text-lg hover:bg-[#0E7490] transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download for Free
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-10 py-5 rounded-xl border-2 border-[#0891B2]/40 text-white font-semibold text-lg hover:bg-[#0891B2]/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
