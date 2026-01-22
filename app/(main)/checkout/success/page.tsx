"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCheckoutSession } from "@/core/api/payments";
import { useRedeemLicense } from "@/core/api/licenses";
import type { RedeemLicenseResponse } from "@/core/api/licenses";

type CheckoutType = "subscription" | "hardware" | "templates";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const checkoutType = (searchParams.get("type") as CheckoutType) ?? "subscription";
  const hardwarePackage = searchParams.get("package");

  const [licenseData, setLicenseData] = useState<RedeemLicenseResponse | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [hasAttemptedRedeem, setHasAttemptedRedeem] = useState(false);

  // Offline license state
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [fingerprint, setFingerprint] = useState("");
  const [offlineLicenseData, setOfflineLicenseData] = useState<RedeemLicenseResponse | null>(null);
  const [offlineError, setOfflineError] = useState<string | null>(null);
  const [isGeneratingOffline, setIsGeneratingOffline] = useState(false);

  // Fetch checkout session to verify payment
  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useCheckoutSession(sessionId);

  // License redemption mutation
  const redeemLicense = useRedeemLicense();

  // Redeem license after payment confirmed (for hardware purchases)
  useEffect(() => {
    if (
      checkoutType === "hardware" &&
      session?.payment_status === "paid" &&
      !hasAttemptedRedeem &&
      !redeemLicense.isPending &&
      sessionId
    ) {
      setHasAttemptedRedeem(true);
      redeemLicense.mutate(
        {
          checkout_session_id: sessionId,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              setLicenseData(data);
            } else {
              setRedeemError(data.message ?? "Failed to redeem license");
            }
          },
          onError: (error) => {
            setRedeemError(error.message);
          },
        }
      );
    }
  }, [checkoutType, session, sessionId, hasAttemptedRedeem, redeemLicense]);

  // Handle offline license generation
  const handleGenerateOfflineLicense = () => {
    if (!sessionId || !fingerprint.trim()) return;

    setIsGeneratingOffline(true);
    setOfflineError(null);

    redeemLicense.mutate(
      {
        checkout_session_id: sessionId,
        fingerprint: fingerprint.trim(),
      },
      {
        onSuccess: (data) => {
          setIsGeneratingOffline(false);
          if (data.success && data.license_json) {
            setOfflineLicenseData(data);
          } else {
            setOfflineError(data.message ?? "Failed to generate offline license");
          }
        },
        onError: (error) => {
          setIsGeneratingOffline(false);
          setOfflineError(error.message);
        },
      }
    );
  };

  // Download offline license as file
  const handleDownloadOfflineLicense = (format: "json" | "lic") => {
    if (!offlineLicenseData?.license_json) return;

    const mimeType = format === "json" ? "application/json" : "application/octet-stream";
    const blob = new Blob([offlineLicenseData.license_json], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `photoboothx-license-${offlineLicenseData.license_key}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--muted)]">Verifying payment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (sessionError || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-[var(--muted)] mb-8">
            We couldn&apos;t verify your payment. Please contact support if you believe this is an error.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
          >
            Back to Pricing
          </Link>
        </div>
      </div>
    );
  }

  // Payment pending
  if (session?.payment_status !== "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Processing</h1>
          <p className="text-[var(--muted)] mb-8">
            Your payment is still being processed. This page will update automatically.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  // Hardware license redemption in progress
  if (checkoutType === "hardware" && redeemLicense.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--muted)]">Generating your license key...</p>
        </div>
      </div>
    );
  }

  // License redemption error
  if (redeemError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-[var(--muted)] mb-4">
            Your payment is confirmed, but we had trouble generating your license key.
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-8">
            Please contact support to manually receive your license key.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get success content based on checkout type
  const getSuccessContent = () => {
    switch (checkoutType) {
      case "hardware":
        return {
          title: "Order Confirmed!",
          description: `Your ${hardwarePackage ? hardwarePackage.charAt(0).toUpperCase() + hardwarePackage.slice(1) : ""} booth package is on its way.${licenseData ? " Your license key is ready!" : ""}`,
          primaryAction: { href: "/dashboard", label: "Go to Dashboard" },
          secondaryAction: { href: "/downloads", label: "Download Software" },
          features: [
            "Hardware ships within 3-5 business days",
            licenseData ? `${licenseData.key_type} license activated (${licenseData.expires_days} days)` : "License key being generated...",
            "Setup guide sent to your email",
          ],
          showLicenseKey: true,
        };
      case "templates":
        return {
          title: "Purchase Complete!",
          description: "Your templates have been added to your library. Start using them right away!",
          primaryAction: { href: "/dashboard", label: "Go to Dashboard" },
          secondaryAction: { href: "/templates", label: "Browse More Templates" },
          features: [
            "Templates available immediately",
            "Download anytime from your dashboard",
            "Use across all your booths",
          ],
          showLicenseKey: false,
        };
      default:
        return {
          title: "Welcome to Pro!",
          description: "Your subscription is now active. Enjoy unlimited booths, premium templates, and all Pro features.",
          primaryAction: { href: "/dashboard", label: "Go to Dashboard" },
          secondaryAction: { href: "/downloads", label: "Download Software" },
          features: [
            "14-day free trial started",
            "Unlimited booths",
            "100+ premium templates",
            "Priority support",
          ],
          showLicenseKey: false,
        };
    }
  };

  const content = getSuccessContent();

  // Success state
  return (
    <div className="min-h-screen bg-[var(--background)] pt-16 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-lg text-[var(--muted)] max-w-lg mx-auto">
            {content.description}
          </p>
        </div>

        {/* License Key Card */}
        {content.showLicenseKey && licenseData && (
          <div className="bg-gradient-to-r from-[#0891B2]/10 to-[#10B981]/10 rounded-2xl border border-[#0891B2]/20 p-6 mb-8">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Your License Key (Online Activation)
            </h2>
            <div className="bg-[var(--background)] rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between gap-4">
                <code className="text-lg sm:text-xl font-mono font-bold tracking-wider text-[#0891B2]">
                  {licenseData.license_key}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(licenseData.license_key);
                  }}
                  className="shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Enter this key in the PhotoBoothX software to activate online.
              {licenseData.already_redeemed && (
                <span className="block mt-1 text-yellow-600 dark:text-yellow-400">
                  This key was already redeemed previously.
                </span>
              )}
            </p>

            {/* Offline Activation Section */}
            <div className="mt-6 pt-6 border-t border-[#0891B2]/20">
              {!showOfflineForm && !offlineLicenseData && (
                <button
                  type="button"
                  onClick={() => setShowOfflineForm(true)}
                  className="text-sm text-[#0891B2] hover:underline flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                  </svg>
                  Need offline activation?
                </button>
              )}

              {showOfflineForm && !offlineLicenseData && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Machine ID
                    </label>
                    <p className="text-xs text-[var(--muted)] mb-2">
                      Open PhotoBoothX, go to Settings → License → Activate, and copy the Machine ID shown there.
                    </p>
                    <input
                      type="text"
                      value={fingerprint}
                      onChange={(e) => setFingerprint(e.target.value)}
                      placeholder="e.g., EF1DE6E3F598515EFDF6B32E2034F443..."
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent"
                    />
                  </div>
                  {offlineError && (
                    <p className="text-sm text-red-500">{offlineError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleGenerateOfflineLicense}
                      disabled={!fingerprint.trim() || isGeneratingOffline}
                      className="px-4 py-2 rounded-lg bg-[#0891B2] text-white text-sm font-semibold hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGeneratingOffline ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Offline License"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOfflineForm(false);
                        setFingerprint("");
                        setOfflineError(null);
                      }}
                      className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {offlineLicenseData && offlineLicenseData.license_json && (
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-[#10B981]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Offline License Generated
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    Download the license file and import it in PhotoBoothX (Settings → License → Import Offline License).
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleDownloadOfflineLicense("lic")}
                      className="px-4 py-2 rounded-lg bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download .lic
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadOfflineLicense("json")}
                      className="px-4 py-2 rounded-lg bg-[#0891B2] text-white text-sm font-semibold hover:bg-[#0E7490] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download .json
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (offlineLicenseData.license_json) {
                          navigator.clipboard.writeText(offlineLicenseData.license_json);
                        }
                      }}
                      className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What&apos;s Next
          </h2>
          <ul className="space-y-3">
            {content.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <svg className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Receipt Info */}
        {session && (
          <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-medium text-[var(--muted)] mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              {session.customer_email && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Email</span>
                  <span className="font-medium">{session.customer_email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Amount</span>
                <span className="font-medium">
                  ${(session.amount_total / 100).toFixed(2)} {session.currency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Session ID</span>
                <span className="font-mono text-xs text-[var(--muted)]">{session.session_id.slice(-8)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={content.primaryAction.href}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-[1.02] shadow-lg shadow-[#0891B2]/20"
          >
            {content.primaryAction.label}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href={content.secondaryAction.href}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[var(--border)] font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {content.secondaryAction.label}
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-center text-sm text-[var(--muted)] mt-8">
          Need help? <Link href="/contact" className="text-[#0891B2] hover:underline">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function CheckoutSuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-8 h-8 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
