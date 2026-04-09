import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with BoothIQ. Browse the documentation, submit a support ticket, or send us a message.",
};

/**
 * Public Support landing page.
 *
 * The marketing site, the auth flows, the downloads page, and the docs
 * all link visitors to /support when they need help. Before this page
 * existed those links were 404s. This page funnels visitors to the
 * right place:
 *   1. Self-service via the docs (most common case)
 *   2. The dashboard ticketing system at /dashboard/support (logged-in
 *      users land there directly; logged-out users sign in first, then
 *      get redirected back)
 *   3. The /contact page for general inquiries
 *
 * No fake stats, no fabricated SLAs, no "24/7 support" claims. Brand
 * new product = brand new support footprint, and the page reflects that.
 */

const helpOptions = [
  {
    title: "Browse the documentation",
    description:
      "Setup guides, troubleshooting walkthroughs, and how-tos for every feature. Most questions are answered here.",
    href: "/docs",
    cta: "Read the docs",
    iconPath:
      "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    title: "Submit a support ticket",
    description:
      "Open a ticket from your dashboard so we can track your issue end-to-end. You'll need to be signed in.",
    href: "/dashboard/support",
    cta: "Open a ticket",
    iconPath:
      "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z",
  },
  {
    title: "Send us a message",
    description:
      "Have a general question, partnership inquiry, or feedback? Reach out through the contact form.",
    href: "/contact",
    cta: "Contact us",
    iconPath:
      "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  },
];

const commonIssues = [
  {
    q: "I forgot my password",
    href: "/forgot-password",
    cta: "Reset it",
  },
  {
    q: "I can't sign in to my account",
    href: "/signin",
    cta: "Sign in",
  },
  {
    q: "How do I link my booth to my account?",
    href: "/docs/getting-started",
    cta: "Setup guide",
  },
  {
    q: "How do I install the Windows app?",
    href: "/downloads",
    cta: "Downloads",
  },
  {
    q: "How does per-booth pricing work?",
    href: "/pricing",
    cta: "Pricing",
  },
  {
    q: "What features are included?",
    href: "/features",
    cta: "Features",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================
       * Hero Section — same nav-clearing top padding as the rest of
       * the redesigned marketing pages.
       * ============================================ */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
            Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            How can we
            <br />
            <span className="text-[#069494]">help you?</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Browse the docs, open a support ticket, or send us a message —
            whichever gets you back on the road fastest.
          </p>
        </div>
      </section>

      {/* ============================================
       * Help options — three primary paths.
       * ============================================ */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {helpOptions.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="group relative flex flex-col p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#069494]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#069494]/10 border border-[#069494]/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <svg
                    className="w-6 h-6 text-[#069494] dark:text-[#0EC7C7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={option.iconPath}
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">
                  {option.title}
                </h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-6 flex-1">
                  {option.description}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#069494] dark:text-[#0EC7C7] group-hover:gap-3 transition-all">
                  {option.cta}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * Common issues — quick links to the right place for the most
       * frequently asked questions, so visitors don't have to file a
       * ticket for things that already have a self-serve answer.
       * ============================================ */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick answers
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Common questions
            </h2>
            <p className="text-[var(--muted)]">
              Most issues are one click away.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {commonIssues.map((item) => (
              <Link
                key={item.q}
                href={item.href}
                className="flex items-center justify-between gap-4 p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[#069494]/30 hover:bg-[#069494]/5 transition-colors group"
              >
                <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#069494] dark:group-hover:text-[#0EC7C7] transition-colors">
                  {item.q}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#069494] dark:text-[#0EC7C7] shrink-0">
                  {item.cta}
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * Final note — sets honest expectations about response time
       * without inventing an SLA. Brand new product = small support
       * footprint, and the copy reflects that.
       * ============================================ */}
      <section className="px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
            <h2 className="text-2xl font-bold mb-3">
              Still need help?
            </h2>
            <p className="text-[var(--muted)] mb-6 max-w-lg mx-auto">
              BoothIQ is a small team. We read every message and reply as
              soon as we can — usually within a couple of business days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/support"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-colors"
              >
                Open a ticket
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[var(--border)] font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Send a message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
