"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Sparkles, Camera } from "lucide-react";
import type { TourStep } from "./tour-steps";
import { TOUR_STORAGE_KEYS } from "./tour-steps";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PADDING = 8;
const TOOLTIP_WIDTH = 360;
const TOOLTIP_HEIGHT_EST = 240;
const MARGIN = 16;
const LG_BREAKPOINT = 1024;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeTooltipPosition(
  targetRect: TargetRect,
  preferredPlacement: TourStep["placement"]
): { top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tw = Math.min(TOOLTIP_WIDTH, vw - MARGIN * 2);

  let top: number;
  let left: number;

  switch (preferredPlacement) {
    case "right":
      top = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT_EST / 2;
      left = targetRect.left + targetRect.width + PADDING + MARGIN;
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT_EST / 2;
      left = targetRect.left - tw - PADDING - MARGIN;
      break;
    case "top":
      top = targetRect.top - TOOLTIP_HEIGHT_EST - PADDING - MARGIN;
      left = targetRect.left + targetRect.width / 2 - tw / 2;
      break;
    case "bottom":
    default:
      top = targetRect.top + targetRect.height + PADDING + MARGIN;
      left = targetRect.left + targetRect.width / 2 - tw / 2;
      break;
  }

  left = Math.max(MARGIN, Math.min(left, vw - tw - MARGIN));
  top = Math.max(MARGIN, Math.min(top, vh - TOOLTIP_HEIGHT_EST - MARGIN));

  return { top, left };
}

function isElementVisible(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return el.offsetParent !== null || el.getClientRects().length > 0;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GuidedTour({ steps, isOpen, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [targetMissing, setTargetMissing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const scrollLocked = useRef(false);
  const prevFocusRef = useRef<Element | null>(null);
  const stepIdRef = useRef(0); // Tracks step changes to cancel stale RAF
  const justOpenedRef = useRef(false);

  // Filter out sidebar steps on mobile
  const effectiveSteps = useMemo(() => {
    if (isMobile) return steps.filter((s) => !s.requiresSidebar);
    return steps;
  }, [steps, isMobile]);

  // Clamp currentStep to valid range (no sync effect needed)
  const safeStep = Math.min(
    Math.max(0, currentStep),
    Math.max(0, effectiveSteps.length - 1)
  );
  const step = effectiveSteps[safeStep];
  const isLastStep = safeStep === effectiveSteps.length - 1;
  const isCenterModal = !step?.target;

  // Keep a ref for effectiveSteps length so keyboard handler reads latest
  const stepsLenRef = useRef(effectiveSteps.length);
  stepsLenRef.current = effectiveSteps.length;

  // -----------------------------------------------------------------------
  // Navigation callbacks (stable via useCallback)
  // -----------------------------------------------------------------------

  const handleComplete = useCallback(() => {
    setCurrentStep(0);
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    setCurrentStep(0);
    onSkip();
  }, [onSkip]);

  const goNext = useCallback(() => {
    setCurrentStep((s) => {
      const max = stepsLenRef.current - 1;
      if (s >= max) {
        // Defer onComplete to avoid setState during render
        setTimeout(handleComplete, 0);
        return s;
      }
      return Math.min(s + 1, max);
    });
  }, [handleComplete]);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  // -----------------------------------------------------------------------
  // Mobile detection
  // -----------------------------------------------------------------------

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < LG_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // -----------------------------------------------------------------------
  // Measure target element (with stale-RAF protection)
  // -----------------------------------------------------------------------

  const measureTarget = useCallback(() => {
    if (!step?.target) {
      setTargetRect(null);
      setTargetMissing(false);
      return;
    }
    const capturedId = stepIdRef.current;
    const el = document.querySelector(step.target);
    if (el && isElementVisible(el)) {
      setTargetMissing(false);
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      requestAnimationFrame(() => {
        // Skip if step changed since we scheduled this RAF
        if (stepIdRef.current !== capturedId) return;
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      });
    } else {
      setTargetRect(null);
      setTargetMissing(true);
    }
  }, [step]);

  // Bump step ID when step changes
  useEffect(() => {
    stepIdRef.current += 1;
  }, [safeStep]);

  // Initial measurement when step changes
  useEffect(() => {
    if (!isOpen) return;
    measureTarget();
  }, [isOpen, measureTarget]);

  // Resize/scroll listener (separate to prevent accumulation)
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => requestAnimationFrame(measureTarget);
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [isOpen, measureTarget]);

  // -----------------------------------------------------------------------
  // Body scroll lock (with rapid-toggle protection)
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (isOpen) {
      if (!scrollLocked.current) {
        scrollYRef.current = window.scrollY;
        scrollLocked.current = true;
      }
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        scrollLocked.current = false;
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, [isOpen]);

  // -----------------------------------------------------------------------
  // Focus management (save on open, restore on close, trap during tour)
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    const firstBtn = dialog.querySelector<HTMLElement>("button");
    firstBtn?.focus();

    return () => {
      document.removeEventListener("keydown", handleTab);
      // Restore focus when tour closes
      if (prevFocusRef.current instanceof HTMLElement) {
        prevFocusRef.current.focus();
      }
    };
  }, [isOpen, safeStep]);

  // -----------------------------------------------------------------------
  // Keyboard navigation (uses stable callbacks)
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goBack();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleSkip, goNext, goBack]);

  // -----------------------------------------------------------------------
  // localStorage: merged persist + resume (no race condition)
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) {
      justOpenedRef.current = false;
      return;
    }

    if (!justOpenedRef.current) {
      justOpenedRef.current = true;
      // Resume from interrupted tour
      try {
        const saved = localStorage.getItem(TOUR_STORAGE_KEYS.currentStep);
        if (saved) {
          const idx = parseInt(saved, 10);
          if (idx >= 0 && idx < effectiveSteps.length) {
            setCurrentStep(idx);
          }
        }
      } catch {
        // Silently continue
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Persist step changes (only after initial resume)
  useEffect(() => {
    if (isOpen && justOpenedRef.current) {
      try {
        localStorage.setItem(TOUR_STORAGE_KEYS.currentStep, String(safeStep));
      } catch {
        // Silently continue
      }
    }
  }, [isOpen, safeStep]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  if (!isOpen || !step) return null;

  const tooltipPos = isCenterModal
    ? null
    : targetRect
      ? computeTooltipPosition(targetRect, step.placement)
      : null;

  const progress = ((safeStep + 1) / effectiveSteps.length) * 100;
  const descriptionId = `tour-desc-${safeStep}`;

  return (
    <>
      {/* Backdrop for center modals */}
      {isCenterModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* Spotlight cutout for targeted steps */}
      {!isCenterModal && targetRect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[9998] rounded-xl"
          style={{
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            pointerEvents: "none",
            transition:
              "top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease",
          }}
        />
      )}

      {/* Click shield */}
      {!isCenterModal && (
        <div
          className="fixed inset-0 z-[9997]"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {/* Allow click-through on the highlighted element */}
      {!isCenterModal && targetRect && (
        <div
          className="fixed z-[9999]"
          style={{
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            pointerEvents: "auto",
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          ref={dialogRef}
          key={safeStep}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] as const }}
          role="dialog"
          aria-modal="true"
          aria-label={step.title}
          aria-describedby={descriptionId}
          className={`fixed z-[10000] w-[360px] max-w-[calc(100vw-2rem)] ${
            isCenterModal
              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : ""
          }`}
          style={
            !isCenterModal && tooltipPos
              ? { top: tooltipPos.top, left: tooltipPos.left }
              : undefined
          }
        >
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {safeStep + 1} of {effectiveSteps.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                Skip tour
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full bg-slate-100 dark:bg-zinc-800 mb-4 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#069494]"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Icon for center modals */}
            {isCenterModal && (
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#069494] to-[#0EC7C7] flex items-center justify-center">
                  {isLastStep ? (
                    <Camera className="w-7 h-7 text-white" />
                  ) : (
                    <Sparkles className="w-7 h-7 text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Title & Description */}
            <h3
              className={`text-base font-semibold text-zinc-900 dark:text-white mb-2 ${
                isCenterModal ? "text-center" : ""
              }`}
            >
              {step.title}
            </h3>
            <p
              id={descriptionId}
              className={`text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5 ${
                isCenterModal ? "text-center" : ""
              }`}
            >
              {targetMissing
                ? "This section isn\u2019t available right now. Skip to the next step."
                : step.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goBack}
                disabled={safeStep === 0}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={goNext}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg bg-[#069494] text-white hover:bg-[#057a7a] transition-colors shadow-sm"
              >
                {isLastStep ? (
                  "Done"
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
