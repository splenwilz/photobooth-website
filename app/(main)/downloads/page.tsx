"use client";

import Link from "next/link";
import { useState } from "react";

/* ============================================
 * Download Data
 * ============================================ */

const currentVersion = {
  version: "2.4.1",
  releaseDate: "December 28, 2024",
  highlights: [
    {
      title: "Green Screen Mode",
      description: "Real-time background removal with AI-powered edge detection",
      icon: "🎨",
      tag: "New",
      color: "#10B981",
    },
    {
      title: "Animated GIF Export",
      description: "Create shareable GIFs from burst mode captures",
      icon: "🎬",
      tag: "New",
      color: "#A855F7",
    },
    {
      title: "Faster Printing",
      description: "DNP RX1hs now prints 30% faster with optimized drivers",
      icon: "⚡",
      tag: "Improved",
      color: "#0891B2",
    },
  ],
  changelog: [
    { 
      type: "new", 
      title: "Green Screen Mode",
      description: "AI-powered real-time background removal. Works with any green screen setup and includes 50+ preset backgrounds plus custom upload support."
    },
    { 
      type: "new", 
      title: "Animated GIF Export",
      description: "Create fun, shareable GIFs from burst mode captures. Customize frame rate, size, and add text overlays before exporting."
    },
    { 
      type: "new", 
      title: "QR Code Digital Delivery",
      description: "Guests can instantly access their photos on their phones by scanning a QR code displayed after printing."
    },
    { 
      type: "improved", 
      title: "30% Faster Printing",
      description: "Optimized drivers for DNP RX1hs printer significantly reduce print time from capture to delivery."
    },
    { 
      type: "improved", 
      title: "Camera Preview Performance",
      description: "Smoother live preview with reduced CPU usage. Now supports up to 60fps preview on compatible hardware."
    },
    { 
      type: "fixed", 
      title: "Template Editor Stability",
      description: "Resolved crashes when working with complex multi-layer templates. Improved undo/redo reliability."
    },
  ],
};

const windowsDownload = {
  platform: "Windows",
  version: "2.4.1",
  size: "156 MB",
  requirements: "Windows 10 or later (64-bit)",
  downloadUrl: "#",
  downloads: "175k+",
  releaseDate: "Dec 28, 2024",
  features: [
    "Full photo booth software",
    "Template editor included",
    "All printer drivers",
    "Automatic updates",
  ],
  systemReqs: {
    minimum: {
      os: "Windows 10 (64-bit)",
      ram: "4 GB RAM",
      disk: "500 MB disk space",
      display: "1280x720 display",
      usb: "USB 2.0 port",
    },
    recommended: {
      os: "Windows 11 (64-bit)",
      ram: "8 GB RAM or more",
      disk: "1 GB disk space",
      display: "1920x1080 display",
      usb: "USB 3.0 port",
    },
  },
};

const previousVersions = [
  { version: "2.4.0", date: "Dec 15, 2024", notes: "Template editor overhaul", size: "154 MB" },
  { version: "2.3.2", date: "Nov 28, 2024", notes: "Bug fixes and stability improvements", size: "152 MB" },
  { version: "2.3.1", date: "Nov 10, 2024", notes: "Square & Stripe payment integration", size: "151 MB" },
  { version: "2.3.0", date: "Oct 25, 2024", notes: "Mobile app sync and real-time alerts", size: "150 MB" },
  { version: "2.2.0", date: "Sep 20, 2024", notes: "DNP RX1hs printer driver improvements", size: "148 MB" },
];

const installSteps = [
  {
    step: 1,
    title: "Download",
    description: "Download the Windows installer (.exe)",
    icon: "download",
  },
  {
    step: 2,
    title: "Install",
    description: "Run the installer and follow the setup wizard",
    icon: "install",
  },
  {
    step: 3,
    title: "Connect Hardware",
    description: "Plug in your camera (Logitech C920) and printer (DNP RX1hs)",
    icon: "hardware",
  },
  {
    step: 4,
    title: "Start Earning",
    description: "Configure your booth settings and go live",
    icon: "rocket",
  },
];

export default function DownloadsPage() {
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [openChange, setOpenChange] = useState<number | null>(0); // First item open by default

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0891B2]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#10B981]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Version {currentVersion.version}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Download PhotoBoothX
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-8">
              Get the desktop software for your photo booth and the mobile app to manage it from anywhere.
            </p>

            {/* Quick download button */}
            <div className="flex flex-col items-center gap-4">
              <a
                href="#"
                className="group flex items-center gap-4 px-10 py-5 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-100 transition-all shadow-2xl shadow-white/20 hover:scale-105"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                <div className="text-left">
                  <div className="text-lg">Download for Windows</div>
                  <div className="text-sm font-normal text-[var(--muted)]">Version {windowsDownload.version} · {windowsDownload.size}</div>
                </div>
                <svg className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
              <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Verified safe
                </span>
                <span>·</span>
                <span>Windows 10/11</span>
                <span>·</span>
                <span>{windowsDownload.downloads} downloads</span>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)] mt-4">
              Free 14-day trial · No credit card required
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "⬇️", value: "175k+", label: "Downloads" },
              { icon: "⭐", value: "4.9", label: "Avg. Rating" },
              { icon: "🌍", value: "50+", label: "Countries" },
              { icon: "🔄", value: "Weekly", label: "Updates" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-[var(--card)]/50 border border-[var(--border)]/50">
                <span className="text-2xl block mb-1">{stat.icon}</span>
                <div className="text-xl font-bold text-[var(--foreground)]">{stat.value}</div>
                <div className="text-xs text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * What's New Section - FAQ Accordion Style
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111]/30 to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#10B981]/5 blur-[150px] rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#0891B2]/5 blur-[150px] rounded-full -translate-y-1/2" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#10B981]/20 via-[#0891B2]/10 to-transparent border border-[#10B981]/30 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
              </span>
              <span className="text-[#10B981] font-semibold">New Release</span>
              <span className="h-4 w-px bg-zinc-700" />
              <span className="text-[var(--foreground)] font-mono font-bold">v{currentVersion.version}</span>
              <span className="h-4 w-px bg-zinc-700" />
              <span className="text-[var(--muted)] text-sm">{currentVersion.releaseDate}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What&apos;s New in This Release
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Explore all the new features, improvements, and fixes
            </p>
          </div>

          {/* Changelog Accordion Grid - Two columns on desktop */}
          <div className="grid md:grid-cols-2 gap-4">
            {currentVersion.changelog.map((item, index) => (
              <div 
                key={item.title}
                className={`group rounded-2xl border overflow-hidden transition-all ${
                  openChange === index 
                    ? item.type === "new" 
                      ? "bg-[#10B981]/5 border-[#10B981]/30" 
                      : item.type === "improved"
                        ? "bg-[#0891B2]/5 border-[#0891B2]/30"
                        : "bg-[#F59E0B]/5 border-[#F59E0B]/30"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenChange(openChange === index ? null : index)}
                  className="w-full flex items-start gap-4 p-6 text-left"
                >
                  {/* Type badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-colors ${
                    openChange === index 
                      ? item.type === "new"
                        ? "bg-[#10B981] text-[var(--foreground)]" 
                        : item.type === "improved"
                          ? "bg-[#0891B2] text-[var(--foreground)]"
                          : "bg-[#F59E0B] text-[var(--foreground)]"
                      : item.type === "new"
                        ? "bg-[#10B981]/20 text-[#10B981]"
                        : item.type === "improved"
                          ? "bg-[#0891B2]/20 text-[#0891B2]"
                          : "bg-[#F59E0B]/20 text-[#F59E0B]"
                  }`}>
                    {item.type === "new" ? "✨" : item.type === "improved" ? "⚡" : "✓"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs uppercase tracking-wider font-bold ${
                        item.type === "new" 
                          ? "text-[#10B981]" 
                          : item.type === "improved" 
                            ? "text-[#0891B2]"
                            : "text-[#F59E0B]"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <span className={`font-semibold block transition-colors ${
                      openChange === index ? "text-[var(--foreground)]" : "text-[var(--foreground-secondary)]"
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    openChange === index 
                      ? item.type === "new"
                        ? "bg-[#10B981]/20 rotate-180"
                        : item.type === "improved"
                          ? "bg-[#0891B2]/20 rotate-180"
                          : "bg-[#F59E0B]/20 rotate-180"
                      : "bg-zinc-800 group-hover:bg-zinc-700"
                  }`}>
                    <svg 
                      className="w-4 h-4 text-[var(--muted)]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openChange === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-6 pb-6 pl-20 text-[var(--muted)] leading-relaxed">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View Full Changelog */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="flex gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center text-sm font-bold text-[#10B981]">
                  {currentVersion.changelog.filter(c => c.type === "new").length}
                </span>
                <span className="w-8 h-8 rounded-lg bg-[#0891B2]/20 flex items-center justify-center text-sm font-bold text-[#0891B2]">
                  {currentVersion.changelog.filter(c => c.type === "improved").length}
                </span>
                <span className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-sm font-bold text-[#F59E0B]">
                  {currentVersion.changelog.filter(c => c.type === "fixed").length}
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-700" />
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">Want to see all versions?</p>
                <p className="text-sm text-[var(--muted)]">Browse the complete changelog</p>
              </div>
              <Link 
                href="/docs/changelog" 
                className="ml-4 px-5 py-2.5 rounded-xl bg-[#0891B2] text-[var(--foreground)] font-semibold hover:bg-[#0E7490] transition-colors"
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Desktop Download - Windows Only (Enhanced)
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#111111]/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0891B2]/5 blur-[200px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-sm font-medium mb-4">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              Windows Only
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Download PhotoBoothX</h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              The complete photo booth software for Windows. Run your booth, create templates, and manage everything from one app.
            </p>
          </div>

          {/* Main Download Card */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/20 via-[#111111] to-[#111111]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0891B2]/20 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#10B981]/10 blur-3xl rounded-full" />

              <div className="relative p-8 md:p-12 border border-[#0891B2]/30 rounded-3xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left - Info */}
                  <div>
                    {/* Windows logo */}
                    <div className="w-20 h-20 rounded-2xl bg-[#0891B2]/20 flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-[#0891B2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                      </svg>
                    </div>

                    <h3 className="text-3xl font-bold mb-2">PhotoBoothX for Windows</h3>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1.5 rounded-lg bg-[#0891B2]/20 text-[#22D3EE] text-sm font-medium">v{windowsDownload.version}</span>
                      <span className="text-[var(--muted)]">{windowsDownload.size}</span>
                      <span className="text-[var(--muted)]">·</span>
                      <span className="text-[var(--muted)]">Released {windowsDownload.releaseDate}</span>
                    </div>

                    <p className="text-[var(--muted)] mb-6">
                      {windowsDownload.requirements}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2 mb-8">
                      {windowsDownload.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[var(--foreground-secondary)]">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Download button */}
                    <a
                      href={windowsDownload.downloadUrl}
                      className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/10 hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Now
                      <svg className="w-4 h-4 opacity-50 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </a>

                    <p className="text-xs text-[var(--muted)] mt-4">
                      SHA256: a1b2c3d4e5f6g7h8i9j0...
                    </p>
                  </div>

                  {/* Right - System Requirements */}
                  <div className="space-y-4">
                    {/* Minimum */}
                    <div className="p-5 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-[var(--muted)]">Minimum Requirements</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-[var(--muted)]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                          {windowsDownload.systemReqs.minimum.os}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                          {windowsDownload.systemReqs.minimum.ram}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                          {windowsDownload.systemReqs.minimum.disk}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                          {windowsDownload.systemReqs.minimum.usb}
                        </li>
                      </ul>
                    </div>

                    {/* Recommended */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#10B981]/10 to-[#0a0a0a]/80 border border-[#10B981]/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#10B981]">Recommended</h4>
                          <span className="text-xs text-[var(--muted)]">Best experience</span>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-[var(--foreground-secondary)]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          {windowsDownload.systemReqs.recommended.os}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          {windowsDownload.systemReqs.recommended.ram}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          {windowsDownload.systemReqs.recommended.disk}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          {windowsDownload.systemReqs.recommended.usb}
                        </li>
                      </ul>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Verified Safe
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Auto Updates
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        4.9 Rating
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
       * Installation Steps
       * ============================================ */}
      <section className="py-24 px-6 bg-[var(--card)]/30 border-y border-[var(--border)]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-[var(--muted)]">Simple installation process</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

            <div className="grid md:grid-cols-4 gap-8">
              {installSteps.map((step, index) => (
                <div key={step.step} className="relative text-center">
                  {/* Step circle */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-24 h-24 rounded-full bg-[#0891B2]/10 border-2 border-[#0891B2]/30 flex items-center justify-center">
                      {step.icon === "download" && (
                        <svg className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                      {step.icon === "install" && (
                        <svg className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      )}
                      {step.icon === "hardware" && (
                        <svg className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {step.icon === "rocket" && (
                        <svg className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0891B2] text-[var(--foreground)] text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Previous Versions
       * ============================================ */}
      <section className="py-24 px-6 bg-[var(--card)]/30 border-y border-[var(--border)]/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-800 border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Version History
            </div>
            <h2 className="text-3xl font-bold mb-4">Previous Versions</h2>
            <p className="text-[var(--muted)]">
              Need an older version? Download previous releases below.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-end mb-6">
              <button
                type="button"
                onClick={() => setShowAllVersions(!showAllVersions)}
                className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors"
              >
                {showAllVersions ? "Show less" : "View all versions"}
              </button>
            </div>
            <div className="space-y-3">
              {previousVersions.slice(0, showAllVersions ? undefined : 3).map((version) => (
                <div
                  key={version.version}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] hover:border-[#0891B2]/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[var(--muted)]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-lg">v{version.version}</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-[var(--muted)] text-xs">{version.date}</span>
                        <span className="text-xs text-[var(--muted)]">{version.size}</span>
                      </div>
                      <p className="text-sm text-[var(--muted)]">{version.notes}</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-zinc-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#F59E0B] font-semibold mb-1">Security Recommendation</p>
                  <p className="text-sm text-[var(--muted)]">
                    We strongly recommend always using the latest version for security updates, bug fixes, and new features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Help CTA
       * ============================================ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need help getting started?</h2>
          <p className="text-[var(--muted)] mb-8">
            Check out our comprehensive setup guide or reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/docs/getting-started"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0891B2] text-[var(--foreground)] font-medium hover:bg-[#0E7490] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read Setup Guide
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--foreground-secondary)] font-medium hover:bg-white/5 hover:text-[var(--foreground)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
