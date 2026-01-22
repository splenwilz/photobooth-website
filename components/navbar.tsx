"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/features", label: "Features" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/downloads", label: "Downloads" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full bg-[var(--background)]">
      <nav className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center shadow-lg shadow-[#0891B2]/25 group-hover:shadow-[#0891B2]/40 transition-all group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg text-zinc-900 dark:text-white">PhotoBooth</span>
              <span className="font-bold text-lg text-[#0891B2]">X</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "text-[#0891B2] bg-[#0891B2]/10"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Dashboard
            </Link>

            {/* Get Started CTA */}
            <Link
              href="/signup"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-all shadow-md shadow-[#0891B2]/25 hover:shadow-lg hover:shadow-[#0891B2]/30"
            >
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <div className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-[#0891B2] bg-[#0891B2]/10"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTAs */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800/50 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] transition-colors"
              >
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
