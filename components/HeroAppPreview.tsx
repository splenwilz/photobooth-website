"use client";

/**
 * HeroAppPreview
 *
 * Hero "app window" mockup that auto-cycles through multiple screenshots of
 * the BoothIQ admin panel, with floating annotation cards that animate in.
 *
 * - The window frame holds a carousel of admin-panel screenshots.
 * - Carousel auto-advances every 5s with a crossfade between screens.
 * - Hovering the window pauses the auto-advance so users can read.
 * - Dot indicators below the chrome let users jump directly to a screen.
 * - The window chrome label updates per screen ("BoothIQ Admin Panel — Sales").
 * - Floating cards animate in once on mount and stay put while screens cycle.
 * - In dark mode the screenshot is dimmed/desaturated so it doesn't blast
 *   out of the page like a flashlight.
 * - Cards are hidden on `<lg` viewports because they overlap content on mobile.
 *
 * Client component (`"use client"`) only because motion needs the browser.
 * Rest of the landing page stays a server component.
 *
 * @see app/(main)/page.tsx — used by the landing hero
 */

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface Screen {
  src: string;
  label: string;
}

const screens: Screen[] = [
  { src: "/admin-screens/sales.png", label: "Sales & Analytics" },
  { src: "/admin-screens/credits.png", label: "Credit Management" },
  { src: "/admin-screens/products.png", label: "Product Configuration" },
];

const AUTO_ADVANCE_MS = 5000;

export function HeroAppPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance the carousel every 5 seconds. No hover-pause — earlier
  // attempts attached the pause handler to the outer wrapper, which made
  // `isPaused` get stuck `true` whenever the cursor was anywhere near the
  // hero (which is most of the time while testing). Just let it cycle.
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screens.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  const currentScreen = screens[currentIndex];

  return (
    <div className="mt-16 max-w-[1536px] mx-auto relative">
      {/* Window frame */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 overflow-hidden shadow-2xl brand-glow">
        {/* Window chrome — traffic-light dots + dynamic label per screen */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
          <span className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-green-400" aria-hidden="true" />
          <span className="ml-3 text-xs text-zinc-500">
            BoothIQ Admin Panel —{" "}
            <span className="text-zinc-700 dark:text-zinc-300">
              {currentScreen.label}
            </span>
          </span>
        </div>

        {/* Carousel area — gentlest possible transition: a slow opacity fade
            with no movement, no scale, no blur. The screens just quietly melt
            into each other so the carousel functions without drawing attention
            to itself. */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <AnimatePresence>
            <motion.div
              key={currentScreen.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentScreen.src}
                alt={`BoothIQ admin panel — ${currentScreen.label}`}
                fill
                className="object-cover object-top dark:brightness-[0.78] dark:saturate-90 dark:contrast-105"
                priority
                sizes="(max-width: 1536px) 100vw, 1536px"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators — clickable, the active dot is wider and teal */}
        <div className="flex items-center justify-center gap-2 py-3 border-t border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
          {screens.map((screen, i) => (
            <button
              key={screen.src}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Show ${screen.label}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-8 bg-[#069494]"
                  : "w-1.5 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating card 1 — Live revenue (left side, mid-height).
          Slides in from the left after the page settles. */}
      <motion.div
        initial={{ opacity: 0, x: -32, y: 8 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute -left-4 lg:-left-6 top-[28%] hidden lg:flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 shadow-2xl"
      >
        <div className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#069494] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#069494]" />
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">$1,134 tracked</div>
          <div className="text-xs text-zinc-500">Live revenue this year</div>
        </div>
      </motion.div>

      {/* Floating card 2 — Supply levels (right side, slightly lower).
          Reframed from the old "PCB offline" alert pattern: now positions the
          dashboard as a visibility/inventory tool. The number 224 is the
          remaining print paper count visible at the top of every screenshot.
          No fear-based framing — just stating that supplies are tracked. */}
      <motion.div
        initial={{ opacity: 0, x: 32, y: 8 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute -right-4 lg:-right-6 top-[44%] hidden lg:flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 shadow-2xl"
      >
        <div className="w-10 h-10 rounded-lg bg-[#069494]/15 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-[#069494]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">224 prints remaining</div>
          <div className="text-xs text-zinc-500">Supply levels, live</div>
        </div>
      </motion.div>

      {/* Floating card 3 — Cloud sync / remote access (bottom-left).
          Captures the most important "not obvious from this screenshot" thing:
          the booth's data syncs to the cloud so operators can watch what's
          happening from any device while they're away from the venue. */}
      <motion.div
        initial={{ opacity: 0, x: -32, y: 8 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute -left-4 lg:-left-6 top-[68%] hidden lg:flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 shadow-2xl"
      >
        <div className="w-10 h-10 rounded-lg bg-[#069494]/15 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-[#069494]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
            />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">Live on your phone</div>
          <div className="text-xs text-zinc-500">Cloud synced from your booth</div>
        </div>
      </motion.div>
    </div>
  );
}
