"use client";

import Link from "next/link";
import { useState } from "react";

/* ============================================
 * Documentation Data
 * ============================================ */

const quickStartSteps = [
  {
    step: 1,
    title: "Download & Install",
    description: "Get PhotoBoothX on Windows or Mac in minutes",
    time: "2 min",
    href: "/docs/installation",
  },
  {
    step: 2,
    title: "Connect Hardware",
    description: "Set up your camera and printer",
    time: "5 min",
    href: "/docs/hardware-setup",
  },
  {
    step: 3,
    title: "Configure Settings",
    description: "Customize templates, pricing, and branding",
    time: "10 min",
    href: "/docs/first-booth",
  },
  {
    step: 4,
    title: "Go Live",
    description: "Start serving customers",
    time: "Ready!",
    href: "/docs/go-live",
  },
];

const sections = [
  {
    title: "Getting Started",
    description: "Set up your first photo booth in minutes",
    icon: "🚀",
    color: "#10B981",
    links: [
      { href: "/docs/getting-started", label: "Quick Start Guide", badge: "Popular" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/first-booth", label: "Creating Your First Booth" },
      { href: "/docs/hardware-setup", label: "Hardware Setup" },
      { href: "/docs/system-requirements", label: "System Requirements" },
    ],
  },
  {
    title: "Camera & Capture",
    description: "Configure cameras and capture settings",
    icon: "📷",
    color: "#0891B2",
    links: [
      { href: "/docs/camera-setup", label: "Camera Configuration", badge: "Popular" },
      { href: "/docs/supported-cameras", label: "Supported Cameras" },
      { href: "/docs/webcam-setup", label: "Webcam Setup (C920, BRIO)" },
      { href: "/docs/dslr-tethering", label: "DSLR Tethering" },
      { href: "/docs/live-preview", label: "Live Preview" },
      { href: "/docs/countdown-timer", label: "Countdown Timer" },
      { href: "/docs/green-screen", label: "Green Screen Removal" },
    ],
  },
  {
    title: "Templates & Design",
    description: "Create and customize photo layouts",
    icon: "🎨",
    color: "#F59E0B",
    links: [
      { href: "/docs/templates", label: "Using Templates" },
      { href: "/docs/template-editor", label: "Template Editor" },
      { href: "/docs/strip-layouts", label: "2x6 Strip Layouts" },
      { href: "/docs/4x6-layouts", label: "4x6 Photo Layouts" },
      { href: "/docs/branding", label: "Event Branding" },
      { href: "/docs/overlays", label: "Overlays & Frames" },
      { href: "/docs/gifs", label: "Animated GIFs & Boomerangs" },
    ],
  },
  {
    title: "Printing",
    description: "Set up printers and print settings",
    icon: "🖨️",
    color: "#A855F7",
    links: [
      { href: "/docs/printer-setup", label: "Printer Setup", badge: "Popular" },
      { href: "/docs/dnp-printers", label: "DNP RX1hs / DS620 Setup" },
      { href: "/docs/hiti-printers", label: "HiTi Printers" },
      { href: "/docs/mitsubishi-printers", label: "Mitsubishi Printers" },
      { href: "/docs/print-quality", label: "Print Quality Settings" },
      { href: "/docs/paper-tracking", label: "Paper & Ribbon Tracking" },
      { href: "/docs/troubleshooting-printing", label: "Troubleshooting" },
    ],
  },
  {
    title: "Payments",
    description: "Configure payment methods and pricing",
    icon: "💳",
    color: "#EC4899",
    links: [
      { href: "/docs/payment-setup", label: "Payment Setup" },
      { href: "/docs/pricing", label: "Setting Prices" },
      { href: "/docs/coin-acceptor", label: "Coin Acceptor Setup" },
      { href: "/docs/card-payments", label: "Card Payments (Stripe)" },
      { href: "/docs/credits-system", label: "Credits System" },
      { href: "/docs/free-play", label: "Free Play Mode" },
    ],
  },
  {
    title: "Mobile App",
    description: "Monitor and control booths remotely",
    icon: "📱",
    color: "#3B82F6",
    links: [
      { href: "/docs/mobile-app", label: "Mobile App Guide", badge: "New" },
      { href: "/docs/connecting-booth", label: "Connecting Your Booth" },
      { href: "/docs/remote-monitoring", label: "Remote Monitoring" },
      { href: "/docs/remote-control", label: "Remote Restart & Control" },
      { href: "/docs/notifications", label: "Notifications & Alerts" },
      { href: "/docs/multi-booth", label: "Multi-Booth Management" },
    ],
  },
];

const videoTutorials = [
  {
    title: "Complete Setup Guide - From Unboxing to First Print",
    duration: "12:34",
    thumbnail: "🎬",
    href: "#",
    views: "24.5k",
    featured: true,
    description: "Learn how to set up PhotoBoothX from scratch. We cover installation, hardware connection, and your first test print.",
    category: "Getting Started",
  },
  {
    title: "DNP RX1hs Printer Setup",
    duration: "6:21",
    thumbnail: "🖨️",
    href: "#",
    views: "18.2k",
    featured: false,
    description: "Configure your DNP printer for optimal print quality.",
    category: "Printing",
  },
  {
    title: "Creating Custom Templates",
    duration: "8:45",
    thumbnail: "🎨",
    href: "#",
    views: "12.8k",
    featured: false,
    description: "Design beautiful 2x6 strips and 4x6 layouts.",
    category: "Design",
  },
  {
    title: "Mobile App Deep Dive",
    duration: "10:15",
    thumbnail: "📱",
    href: "#",
    views: "9.4k",
    featured: false,
    description: "Master remote monitoring and booth control.",
    category: "Mobile",
  },
  {
    title: "Payment Integration Guide",
    duration: "7:52",
    thumbnail: "💳",
    href: "#",
    views: "7.1k",
    featured: false,
    description: "Set up coin acceptors and card payments.",
    category: "Payments",
  },
];

const faqItems = [
  {
    question: "What cameras are supported?",
    answer: "PhotoBoothX supports USB webcams (Logitech C920, C922, BRIO) and tethered DSLRs from Canon, Nikon, and Sony. For best results, we recommend starting with a Logitech C920 for simple setups.",
  },
  {
    question: "Which printers work with PhotoBoothX?",
    answer: "We support dye-sublimation printers including DNP RX1hs, DS620, DS820, HiTi, and Mitsubishi models. The DNP RX1hs is our most popular choice for its speed and print quality.",
  },
  {
    question: "Can I use it without internet?",
    answer: "Yes! PhotoBoothX works fully offline for capturing, printing, and all core functionality. Internet is only needed for mobile app sync, remote monitoring, and cloud backups.",
  },
  {
    question: "How do I accept payments?",
    answer: "You can use coin acceptors for arcade-style operation, card readers via Stripe integration, or run in free play mode for private events and weddings.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Our Starter plan is completely free forever with 1 booth, basic templates, and webcam support. Upgrade anytime to unlock more features.",
  },
  {
    question: "How do I get help if I'm stuck?",
    answer: "We offer multiple support channels: documentation, video tutorials, Discord community, and email support for Pro and Enterprise customers.",
  },
];

export default function DocsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0891B2]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-[#A855F7]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Documentation
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Learn PhotoBoothX
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Comprehensive guides, tutorials, and reference documentation to help you get the most out of PhotoBoothX.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#0891B2]/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search documentation... (e.g., printer setup, camera config)"
                  className="w-full pl-14 pr-20 py-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[#0891B2]/50 focus:ring-2 focus:ring-[#0891B2]/20 transition-all text-lg"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)] border border-[var(--border)] px-2 py-1 rounded-md font-mono">
                    ⌘K
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "📚", value: "50+", label: "Articles" },
              { icon: "🎬", value: "12", label: "Video Tutorials" },
              { icon: "❓", value: "30+", label: "FAQs" },
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
       * Quick Start Timeline
       * ============================================ */}
      <section className="py-20 px-6 bg-[var(--card)]/30 border-y border-[var(--border)]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Quick Start</h2>
            <p className="text-[var(--muted)]">Get up and running in under 20 minutes</p>
          </div>

          <div className="relative">
            {/* Timeline line - desktop */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

            <div className="grid md:grid-cols-4 gap-6">
              {quickStartSteps.map((step, index) => (
                <Link
                  key={step.step}
                  href={step.href}
                  className="group relative"
                >
                  {/* Step number */}
                  <div className="relative flex justify-center md:justify-start mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#0891B2]/10 border border-[#0891B2]/30 flex items-center justify-center text-2xl font-bold text-[#0891B2] group-hover:bg-[#0891B2] group-hover:text-[var(--foreground)] transition-all z-10">
                      {step.step}
                    </div>
                    {/* Connector line - mobile */}
                    {index < quickStartSteps.length - 1 && (
                      <div className="md:hidden absolute top-16 left-1/2 w-0.5 h-6 bg-zinc-700" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-center md:text-left p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] group-hover:border-[#0891B2]/30 transition-colors">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <h3 className="font-semibold group-hover:text-[#22D3EE] transition-colors">{step.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#0891B2]/10 text-[#0891B2] text-xs">{step.time}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)]">{step.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Documentation Sections - Enhanced Layout
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#0891B2]/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#A855F7]/5 blur-[150px] rounded-full" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              6 Categories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto">
              Find detailed guides organized by topic. Each category contains step-by-step tutorials, best practices, and troubleshooting tips.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((section, sectionIndex) => (
              <div
                key={section.title}
                className="group relative rounded-3xl overflow-hidden"
              >
                {/* Background gradient */}
                <div 
                  className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    background: `linear-gradient(135deg, ${section.color}15, transparent 60%)` 
                  }}
                />
                
                {/* Glow effect */}
                <div 
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: `${section.color}30` }}
                />

                <div 
                  className="relative h-full p-6 lg:p-8 border rounded-3xl transition-colors"
                  style={{ borderColor: `${section.color}20` }}
                >
                  {/* Large Icon Background */}
                  <div 
                    className="absolute top-4 right-4 text-6xl lg:text-7xl opacity-10 group-hover:opacity-20 transition-opacity select-none"
                  >
                    {section.icon}
                  </div>

                  {/* Start here badge for first card */}
                  {sectionIndex === 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-[#10B981] text-[var(--foreground)] text-xs font-semibold shadow-lg shadow-[#10B981]/30">
                        ⚡ Start here
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg"
                      style={{ 
                        backgroundColor: `${section.color}20`,
                        boxShadow: `0 4px 20px ${section.color}20`
                      }}
                    >
                      {section.icon}
                    </div>
                    <div>
                      <h3 
                        className="text-xl font-bold mb-1 transition-colors"
                        style={{ color: section.color }}
                      >
                        {section.title}
                      </h3>
                      <p className="text-sm text-[var(--muted)]">{section.description}</p>
                    </div>
                  </div>

                  {/* Articles count badge */}
                  <div 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
                    style={{ 
                      backgroundColor: `${section.color}15`,
                      color: section.color 
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {section.links.length} articles
                  </div>

                  {/* Links */}
                  <ul className="space-y-1">
                    {section.links.slice(0, 4).map((link, linkIndex) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group/link flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5 transition-all"
                        >
                          <span 
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-transform group-hover/link:scale-110"
                            style={{ 
                              backgroundColor: `${section.color}15`,
                              color: section.color 
                            }}
                          >
                            {String(linkIndex + 1).padStart(2, '0')}
                          </span>
                          <span className="flex-1 group-hover/link:translate-x-1 transition-transform">{link.label}</span>
                          {link.badge && (
                            <span 
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold animate-pulse"
                              style={{ 
                                backgroundColor: link.badge === 'New' ? '#10B98120' : `${section.color}20`,
                                color: link.badge === 'New' ? '#10B981' : section.color 
                              }}
                            >
                              {link.badge}
                            </span>
                          )}
                          <svg 
                            className="w-4 h-4 text-[var(--muted)] opacity-0 group-hover/link:opacity-100 transition-opacity" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* View all button */}
                  {section.links.length > 4 && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]/50">
                      <Link
                        href={`/docs/${section.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                        className="group/btn flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all hover:gap-3"
                        style={{ 
                          backgroundColor: `${section.color}10`,
                          color: section.color 
                        }}
                      >
                        View all {section.links.length} articles
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>

          {/* Bottom stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { value: "98%", label: "Satisfaction rate", icon: "⭐" },
              { value: "<2min", label: "Avg. read time", icon: "⏱️" },
              { value: "Daily", label: "Updated", icon: "🔄" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-lg block mb-1">{stat.icon}</span>
                <div className="text-lg font-bold text-[#0891B2]">{stat.value}</div>
                <div className="text-xs text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * Video Tutorials - Enhanced Layout
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111]/50 to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#EF4444]/5 blur-[200px] rounded-full" />

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm font-medium mb-6">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Video Tutorials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Learn by Watching</h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto">
              Step-by-step video guides to help you master every feature of PhotoBoothX
            </p>
          </div>

          {/* Featured + Grid Layout */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Featured Video - Large */}
            {videoTutorials.filter(v => v.featured).map((video) => (
              <Link
                key={video.title}
                href={video.href}
                className="lg:col-span-3 group relative rounded-3xl overflow-hidden"
              >
                {/* Thumbnail Area */}
                <div className="aspect-video lg:aspect-[16/10] bg-gradient-to-br from-[#EF4444]/20 via-zinc-900 to-zinc-900 flex items-center justify-center relative">
                  {/* Video icon background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[120px] lg:text-[180px] opacity-20">{video.thumbnail}</span>
                  </div>
                  
                  {/* Play button */}
                  <div className="relative z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#EF4444] flex items-center justify-center shadow-2xl shadow-[#EF4444]/40 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[var(--foreground)] ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>

                  {/* Featured badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#EF4444] text-[var(--foreground)] text-xs font-semibold shadow-lg">
                    🔥 Most Popular
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 text-[var(--foreground)] text-sm font-medium backdrop-blur-sm">
                    {video.duration}
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[var(--muted)] text-xs">{video.category}</span>
                      <span className="text-[var(--muted)] text-xs">{video.views} views</span>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-[var(--foreground)] group-hover:text-[#EF4444] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-[var(--muted)] text-sm mt-2 hidden sm:block">{video.description}</p>
                  </div>
                </div>
              </Link>
            ))}

            {/* Video List - Right Side */}
            <div className="lg:col-span-2 space-y-4">
              {videoTutorials.filter(v => !v.featured).map((video, index) => (
                <Link
                  key={video.title}
                  href={video.href}
                  className="group flex gap-4 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#EF4444]/30 transition-all hover:bg-[var(--card)]/80"
                >
                  {/* Thumbnail */}
                  <div className="relative w-28 sm:w-32 flex-shrink-0 aspect-video rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center overflow-hidden">
                    <span className="text-3xl">{video.thumbnail}</span>
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center">
                        <svg className="w-4 h-4 text-[var(--foreground)] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    {/* Duration */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-medium">
                      {video.duration}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: '#EF444420', color: '#EF4444' }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{video.category}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-[var(--foreground)] group-hover:text-[#EF4444] transition-colors line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-xs text-[var(--muted)] mt-1">{video.views} views</p>
                  </div>
                </Link>
              ))}

              {/* View all button */}
              <Link
                href="/tutorials"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] font-medium hover:bg-[#EF4444]/20 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                View All 12 Tutorials
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🎬", value: "12", label: "Video Tutorials" },
              { icon: "⏱️", value: "2h 45m", label: "Total Runtime" },
              { icon: "👀", value: "125k+", label: "Total Views" },
              { icon: "⭐", value: "4.9", label: "Avg. Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-2xl block mb-2">{stat.icon}</span>
                <div className="text-xl font-bold text-[#EF4444]">{stat.value}</div>
                <div className="text-xs text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * FAQ Section - Accordion Style (Matching Pricing)
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#0891B2]/5 blur-[150px] rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#F59E0B]/5 blur-[120px] rounded-full" />
        
        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Got Questions?
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Quick answers to common questions about PhotoBoothX
            </p>
          </div>

          {/* FAQ Grid - Two columns on desktop */}
          <div className="grid md:grid-cols-2 gap-4">
            {faqItems.map((faq, index) => (
              <div 
                key={faq.question}
                className={`group rounded-2xl border overflow-hidden transition-all ${
                  openFaq === index 
                    ? "bg-[#0891B2]/5 border-[#0891B2]/30" 
                    : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--border)]"
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
                      ? "bg-[#0891B2] text-[var(--foreground)]" 
                      : "bg-zinc-800 text-[var(--muted)] group-hover:bg-[#0891B2]/20 group-hover:text-[#0891B2]"
                  }`}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <span className={`font-semibold block transition-colors ${
                      openFaq === index ? "text-[#22D3EE]" : "text-[var(--foreground)] group-hover:text-[#22D3EE]"
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    openFaq === index 
                      ? "bg-[#0891B2]/20 rotate-180" 
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
                  openFaq === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-6 pb-6 pl-[4.5rem] text-[var(--muted)] leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-12 h-12 rounded-xl bg-[#0891B2]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-medium text-[var(--foreground)]">Still have questions?</p>
                <p className="text-sm text-[var(--muted)]">Our team is here to help</p>
              </div>
              <Link 
                href="/support" 
                className="sm:ml-4 px-5 py-2.5 rounded-xl bg-[#0891B2] text-[var(--foreground)] font-semibold hover:bg-[#0E7490] transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Help Section - Enhanced
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111111]/30 to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0891B2]/5 blur-[200px] rounded-full" />

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Get Help
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              We&apos;re here to help you succeed
            </h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto">
              Multiple ways to get support, connect with experts, and find answers
            </p>
          </div>

          {/* Three Column Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Support Card */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/20 via-[#111111] to-[#111111]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0891B2]/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative h-full p-8 border border-[#0891B2]/20 rounded-3xl group-hover:border-[#0891B2]/40 transition-colors">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#0891B2]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-medium mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  24/7 Available
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-[#22D3EE] transition-colors">Need Help?</h3>
                <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">
                  Our expert support team responds within hours. Get personalized help with setup, troubleshooting, and optimization.
                </p>

                {/* Stats */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                  <div>
                    <div className="text-lg font-bold text-[#0891B2]">&lt;2h</div>
                    <div className="text-xs text-[var(--muted)]">Response</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#0891B2]">98%</div>
                    <div className="text-xs text-[var(--muted)]">Resolved</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#0891B2]">4.9★</div>
                    <div className="text-xs text-[var(--muted)]">Rating</div>
                  </div>
                </div>

                <Link
                  href="/support"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0891B2] text-[var(--foreground)] font-medium hover:bg-[#0E7490] transition-colors group-hover:shadow-lg group-hover:shadow-[#0891B2]/20"
                >
                  Contact Support
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Community Card */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/20 via-[#111111] to-[#111111]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5865F2]/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative h-full p-8 border border-[#5865F2]/20 rounded-3xl group-hover:border-[#5865F2]/40 transition-colors">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-xs font-medium mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5865F2] animate-pulse" />
                  2,500+ members
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-[#5865F2] transition-colors">Join the Community</h3>
                <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">
                  Connect with booth operators worldwide. Share tips, get feedback, and learn from experts in our Discord.
                </p>

                {/* Community features */}
                <div className="space-y-2 mb-6 pb-6 border-b border-[var(--border)]">
                  {["Real-time chat", "Weekly Q&A sessions", "Template sharing"].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <svg className="w-4 h-4 text-[#5865F2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <a
                  href="https://discord.gg/photoboothx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#5865F2] text-[var(--foreground)] font-medium hover:bg-[#4752C4] transition-colors group-hover:shadow-lg group-hover:shadow-[#5865F2]/20"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                  Join Discord
                </a>
              </div>
            </div>

            {/* Developer API Card */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 via-[#111111] to-[#111111]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative h-full p-8 border border-[#F59E0B]/20 rounded-3xl group-hover:border-[#F59E0B]/40 transition-colors">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium mb-4">
                  REST API
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-[#F59E0B] transition-colors">Developer API</h3>
                <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">
                  Build custom integrations, automate workflows, and extend PhotoBoothX with our comprehensive REST API.
                </p>

                {/* Code preview */}
                <div className="mb-6 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] font-mono text-xs">
                  <div className="text-[var(--muted)] mb-1">{`// Get booth status`}</div>
                  <div>
                    <span className="text-[#F59E0B]">GET</span>
                    <span className="text-[var(--muted)]">{` /api/v1/booths/`}</span>
                    <span className="text-[#22D3EE]">:id</span>
                  </div>
                </div>

                {/* API features */}
                <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-[var(--border)]">
                  {["RESTful", "Webhooks", "OAuth2"].map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-zinc-800 text-[var(--muted)] text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/docs/api"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#F59E0B] text-black font-medium hover:bg-[#D97706] transition-colors group-hover:shadow-lg group-hover:shadow-[#F59E0B]/20"
                >
                  View API Docs
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom row - Additional resources */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link
              href="/docs/changelog"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border)] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-[#0891B2]/20 transition-colors">
                <svg className="w-5 h-5 text-[var(--muted)] group-hover:text-[#0891B2] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm group-hover:text-[#22D3EE] transition-colors">Changelog</div>
                <div className="text-xs text-[var(--muted)]">See what&apos;s new</div>
              </div>
            </Link>

            <Link
              href="/docs/roadmap"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border)] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-[#A855F7]/20 transition-colors">
                <svg className="w-5 h-5 text-[var(--muted)] group-hover:text-[#A855F7] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm group-hover:text-[#A855F7] transition-colors">Roadmap</div>
                <div className="text-xs text-[var(--muted)]">Upcoming features</div>
              </div>
            </Link>

            <Link
              href="/docs/status"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border)] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-[#10B981]/20 transition-colors">
                <svg className="w-5 h-5 text-[var(--muted)] group-hover:text-[#10B981] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm group-hover:text-[#10B981] transition-colors">System Status</div>
                <div className="text-xs text-[var(--muted)]">All systems operational</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
