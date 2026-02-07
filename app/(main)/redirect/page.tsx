"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const VALID_TARGETS = ["booths", "alerts", "pricing", "billing"] as const;
type Target = (typeof VALID_TARGETS)[number];

const WEB_URL_MAP: Record<Target, string> = {
  booths: "/dashboard/booths",
  alerts: "/dashboard/alerts",
  pricing: "/pricing",
  billing: "/dashboard/booths",
};

function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const target = searchParams.get("target");
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    if (!target || !VALID_TARGETS.includes(target as Target)) {
      router.push("/dashboard");
      return;
    }

    router.push(WEB_URL_MAP[target as Target]);
  }, [target, router]);

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
