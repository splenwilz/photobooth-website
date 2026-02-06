"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const VALID_TARGETS = ["booths", "alerts", "pricing", "billing"] as const;
type Target = (typeof VALID_TARGETS)[number];

const DEEP_LINK_MAP: Record<Target, string> = {
  booths: "boothiq://booths",
  alerts: "boothiq://alerts",
  pricing: "boothiq://pricing",
  billing: "boothiq://billing",
};

const WEB_FALLBACK_MAP: Record<Target, string> = {
  booths: "/dashboard/booths",
  alerts: "/dashboard/alerts",
  pricing: "/pricing",
  billing: "/dashboard/booths",
};

function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const target = searchParams.get("target");
  const boothId = searchParams.get("booth_id");

  const [showAppButton, setShowAppButton] = useState(false);
  const [isMobileUser, setIsMobileUser] = useState(false);
  const hasAttemptedRedirect = useRef(false);

  // Deep link for current target (used in both effect and render)
  const deepLink = (() => {
    if (!target || !VALID_TARGETS.includes(target as Target)) return null;
    let link = DEEP_LINK_MAP[target as Target];
    if (target === "booths" && boothId) {
      link += `?booth_id=${encodeURIComponent(boothId)}`;
    }
    return link;
  })();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasAttemptedRedirect.current) return;

    // Invalid or missing target — redirect to dashboard
    if (!target || !VALID_TARGETS.includes(target as Target)) {
      hasAttemptedRedirect.current = true;
      router.push("/dashboard");
      return;
    }

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detect device on mount
    setIsMobileUser(isMobile);

    if (!isMobile) {
      // Desktop: immediate web redirect
      hasAttemptedRedirect.current = true;
      router.push(WEB_FALLBACK_MAP[target as Target]);
      return;
    }

    // Mobile: attempt deep link
    hasAttemptedRedirect.current = true;
    if (deepLink) {
      window.location.href = deepLink;
    }

    // Show fallback button after 2 seconds
    const timer = setTimeout(() => {
      setShowAppButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [target, router, deepLink]);

  // Mobile redirect view
  if (isMobileUser && deepLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#0891B2]/10 flex items-center justify-center mx-auto mb-6">
            <svg aria-hidden="true" className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {showAppButton ? "Open in BoothIQ" : "Redirecting to BoothIQ app..."}
          </h1>
          <p className="text-[var(--muted)] mb-8">
            {showAppButton
              ? "Tap the button below to open the BoothIQ app."
              : "Please wait while we redirect you..."}
          </p>

          {!showAppButton && (
            <div className="w-8 h-8 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          )}

          {showAppButton && (
            <a
              href={deepLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-[1.02] shadow-lg shadow-[#0891B2]/20"
            >
              <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Open BoothIQ App
            </a>
          )}

          <p className="text-sm text-[var(--muted)] mt-8">
            Don&apos;t have the app?{" "}
            <Link href="/downloads" className="text-[#0891B2] hover:underline">
              Download it here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Desktop / fallback: show spinner while router.push takes effect
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--muted)]">Redirecting...</p>
      </div>
    </div>
  );
}

function RedirectLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-8 h-8 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={<RedirectLoading />}>
      <RedirectContent />
    </Suspense>
  );
}
