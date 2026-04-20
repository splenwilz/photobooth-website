"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, PlayCircle, Camera } from "lucide-react";
import { TOUR_STORAGE_KEYS } from "./tour-steps";

interface WelcomeBannerProps {
  onStartTour: () => void;
}

export function WelcomeBanner({ onStartTour }: WelcomeBannerProps) {
  const [visible, setVisible] = useState(false);

  // Check localStorage after mount (idempotent, safe in Strict Mode)
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(TOUR_STORAGE_KEYS.bannerDismissed);
      const tourDone = localStorage.getItem(TOUR_STORAGE_KEYS.completed);
      if (!dismissed && !tourDone) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage check on mount
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEYS.bannerDismissed, "true");
    } catch {
      // Silently continue
    }
  };

  const handleStartTour = () => {
    setVisible(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEYS.bannerDismissed, "true");
    } catch {
      // Silently continue
    }
    onStartTour();
  };

  // No early return — let AnimatePresence handle exit animation
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mb-6 p-5 rounded-xl border border-[#069494]/20 bg-gradient-to-r from-[#069494]/5 via-white to-[#0EC7C7]/5 dark:via-zinc-900"
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#069494] to-[#0EC7C7] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                Welcome to BoothIQ!
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-lg">
                Your booth management dashboard is ready. Take a quick tour to
                learn your way around, or head to Booths to register your first kiosk.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleStartTour}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#069494] text-white text-sm font-medium hover:bg-[#057a7a] transition-colors shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  Take a Tour
                </button>
                <Link
                  href="/dashboard/booths"
                  onClick={dismiss}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Manage Booths
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
