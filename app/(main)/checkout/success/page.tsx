"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCheckoutSession, getBoothSubscription } from "@/core/api/payments";
import type { BoothSubscriptionItem } from "@/core/api/payments";
import { usePricingPlans } from "@/core/api/pricing";
import { useCartStore } from "@/stores/cart-store";

/**
 * Checkout success page.
 *
 * Two checkout types are supported:
 *   1. "subscription" — operator subscribed a booth to a Pro plan (the
 *      common path; comes from SubscribeBoothModal in /dashboard/booths)
 *   2. "templates" — operator bought one or more templates from the
 *      template marketplace
 *
 * Hardware sales used to be a third type but were removed at the
 * client's request — booths are now sold exclusively on the BoothWorks
 * website. The license-redemption + offline-activation flow that lived
 * here was tied to that hardware path and is now gone too.
 */

type CheckoutType = "subscription" | "templates";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const checkoutType = (searchParams.get("type") as CheckoutType) ?? "subscription";
  const boothId = searchParams.get("booth_id");
  // The subscribe modal passes these in the success URL so we don't have
  // to depend on a post-payment API lookup matching by stripe_price_id
  // (which has been unreliable).
  const boothNameParam = searchParams.get("booth_name");
  const planNameParam = searchParams.get("plan_name");
  const billingParam = searchParams.get("billing"); // "monthly" | "annual"

  // Booth subscription data — fallback source for plan info if the URL
  // params are missing (e.g., on an old bookmarked success URL).
  const [boothSubscription, setBoothSubscription] = useState<BoothSubscriptionItem | null>(null);
  const [hasAttemptedBoothFetch, setHasAttemptedBoothFetch] = useState(false);

  // Mobile app redirect state
  const [isMobileUser, setIsMobileUser] = useState(false);
  const [showAppButton, setShowAppButton] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasAttemptedRedirect = useRef(false);

  // Pending-too-long state lives BEFORE the hook so we can pass
  // `enabled: !pendingTooLong` and stop the 2-s poll once we've given up.
  // The effect that drives `pendingSince` is declared further down — it
  // reads session data, but effect-declaration order is independent of
  // hook-call order; only state declarations need to come up here.
  const [pendingSince, setPendingSince] = useState<
    { sessionId: string; startedAt: number } | null
  >(null);
  const [now, setNow] = useState(() => Date.now());
  const PENDING_GRACE_MS = 90_000;
  const pendingTooLong =
    pendingSince !== null &&
    pendingSince.sessionId === sessionId &&
    now - pendingSince.startedAt > PENDING_GRACE_MS;

  // Fetch checkout session to verify payment. The hook polls automatically
  // while fulfillment_status === "pending" — see queries.ts. Once the
  // 90-s grace window expires we disable the hook so polling truly stops
  // (otherwise it would keep firing every 2 s in the background even
  // after we've rendered the failed view).
  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
    refetch: refetchSession,
    isFetching: sessionFetching,
  } = useCheckoutSession(sessionId, { enabled: !pendingTooLong });

  // Fetch pricing plans for subscription feature details
  const { data: plansData } = usePricingPlans();
  const plans = plansData?.plans ?? [];

  // Clear the cart only once fulfillment is confirmed by the backend, not
  // when the user clicked "Pay" (the previous CheckoutModal logic). That
  // way a Stripe-side cancellation leaves the cart intact. We track the
  // last-cleared session id rather than a boolean so a second purchase
  // that lands on the same Next.js page instance (no remount) still
  // clears its own cart instead of skipping the second clear.
  const clearCart = useCartStore((s) => s.clearCart);
  const lastClearedSessionIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      checkoutType === "templates" &&
      session?.fulfillment_status === "completed" &&
      sessionId &&
      lastClearedSessionIdRef.current !== sessionId
    ) {
      lastClearedSessionIdRef.current = sessionId;
      clearCart();
    }
  }, [checkoutType, session?.fulfillment_status, sessionId, clearCart]);

  // Drive the pendingSince state declared above. Effect-declaration order
  // is independent of state-declaration order; the state lives at the
  // top so the hook above can gate `enabled` on `pendingTooLong`.
  //
  // pendingSince is in the deps because the Try-again handler resets it
  // to null while status is still "pending" — without it in the deps
  // the effect wouldn't re-run and the timer would never restart. The
  // inner null/different-session check makes the setter idempotent so
  // the effect doesn't loop on its own state changes.
  useEffect(() => {
    if (session?.fulfillment_status === "pending" && sessionId) {
      if (pendingSince === null || pendingSince.sessionId !== sessionId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot pending-start tag tied to session id
        setPendingSince({ sessionId, startedAt: Date.now() });
      }
      const tick = setInterval(() => setNow(Date.now()), 5000);
      return () => clearInterval(tick);
    }
    if (pendingSince !== null) setPendingSince(null);
  }, [session?.fulfillment_status, sessionId, pendingSince]);

  // Fetch booth subscription details after payment is confirmed
  useEffect(() => {
    if (
      checkoutType === "subscription" &&
      boothId &&
      session?.payment_status === "paid" &&
      !hasAttemptedBoothFetch
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guard flag for one-time fetch
      setHasAttemptedBoothFetch(true);
      getBoothSubscription(boothId)
        .then((data) => {
          setBoothSubscription(data);
        })
        .catch((err) => {
          console.error("Failed to fetch booth subscription:", err);
        });
    }
  }, [checkoutType, boothId, session, hasAttemptedBoothFetch]);

  // Reset the deeplink-attempt flags whenever the session changes (e.g.,
  // browser-back from one success URL to a different one within the same
  // component instance). Without this, hasAttemptedRedirect.current
  // would still be `true` from the previous session and the redirect
  // wouldn't fire for the new one.
  useEffect(() => {
    hasAttemptedRedirect.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset stale per-session flags
    setIsRedirecting(false);
    setShowAppButton(false);
  }, [sessionId]);

  // Mobile detection and app redirect for templates/subscription purchases
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detect device on mount
    setIsMobileUser(isMobile);

    // For templates, also require fulfillment_status === "completed" so we
    // don't deeplink the user into the app while their purchases are still
    // in flight on the backend. Subscriptions have fulfillment_status =
    // "not_applicable" and only need payment_status === "paid".
    const fulfilled =
      checkoutType === "templates"
        ? session?.fulfillment_status === "completed"
        : true;

    // Guard against duplicate redirect attempts (e.g., from React Query refetch)
    if (
      isMobile &&
      session?.payment_status === "paid" &&
      fulfilled &&
      sessionId &&
      !hasAttemptedRedirect.current
    ) {
      hasAttemptedRedirect.current = true;
      setIsRedirecting(true);

      // Construct the appropriate deep link with URL-encoded parameters
      const encodedSessionId = encodeURIComponent(sessionId);
      let deepLink: string;
      if (checkoutType === "templates") {
        deepLink = `boothiq://template-purchase-success?session_id=${encodedSessionId}`;
      } else {
        // subscription
        deepLink = `boothiq://payment-success?session_id=${encodedSessionId}`;
        if (boothId) {
          deepLink += `&booth_id=${encodeURIComponent(boothId)}`;
        }
      }

      // Attempt to redirect to the app
      window.location.href = deepLink;

      // Show fallback button after 2 seconds in case redirect didn't work
      const timer = setTimeout(() => {
        setShowAppButton(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [session, sessionId, checkoutType, boothId]);

  // Loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#069494] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-[var(--muted)] mb-8">
            We couldn&apos;t verify your payment. Please contact support if you believe this is an error.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-colors"
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
            <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] font-semibold hover:bg-[#069494]/5 hover:border-[#069494]/30 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  // For template purchases the backend distinguishes "Stripe captured the
  // money" (payment_status) from "we recorded the purchase, queued the
  // booth sync, and the user can actually use the templates"
  // (fulfillment_status). Subscription checkout exposes fulfillment_status
  // = "not_applicable" and we fall through to the existing flow.
  if (checkoutType === "templates") {
    if (session?.fulfillment_status === "failed" || pendingTooLong) {
      // Some failures are transient (DB hiccup, race against the webhook).
      // The backend's inline fulfillment is idempotent, so a retry costs
      // nothing — if it's truly structural the next response will be
      // "failed" again and we land back here. The session_id is shown
      // prominently because support needs it to find the failed row.
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6 py-12">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment received — but we hit a snag</h1>
            <p className="text-[var(--muted)] mb-6">
              Your payment is safe. We couldn&apos;t finish recording the order on our side. Try again below — most snags clear up on retry. If it doesn&apos;t, email support with the order ID and we&apos;ll either finish the order or refund.
            </p>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mb-6 text-left">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Order ID</p>
              <p className="font-mono text-sm break-all select-all text-[var(--foreground)]">
                {session.session_id}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  // Reset the pending-too-long timer so a retry gets a
                  // fresh 90-s window rather than instantly bouncing back
                  // to this view if the response is "pending" again.
                  setPendingSince(null);
                  refetchSession();
                }}
                disabled={sessionFetching}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sessionFetching ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Retrying…
                  </>
                ) : (
                  "Try again"
                )}
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] font-semibold hover:bg-[#069494]/5 hover:border-[#069494]/30 transition-colors"
              >
                Email Support
              </Link>
            </div>
          </div>
        </div>
      );
    }
    if (session?.fulfillment_status !== "completed") {
      // "pending" — Stripe paid but our state hasn't caught up yet. The
      // useCheckoutSession hook polls every 2s; this view is the waiting
      // room and transitions to the success view automatically.
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 border-4 border-[#069494] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Finalizing your order…</h1>
            <p className="text-[var(--muted)]">
              Your payment was received. We&apos;re recording your templates now — this usually takes a few seconds.
            </p>
          </div>
        </div>
      );
    }
  }

  // Mobile app redirect view — both subscription and templates checkout
  // types fall through here on mobile devices.
  if (isMobileUser && isRedirecting && session?.payment_status === "paid") {
    const encodedSessionId = encodeURIComponent(sessionId || "");
    const deepLink =
      checkoutType === "templates"
        ? `boothiq://template-purchase-success?session_id=${encodedSessionId}`
        : `boothiq://payment-success?session_id=${encodedSessionId}${boothId ? `&booth_id=${encodeURIComponent(boothId)}` : ""}`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#069494]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-[var(--muted)] mb-8">
            {showAppButton
              ? "Tap the button below to return to the BoothIQ app."
              : "Redirecting you back to the BoothIQ app..."}
          </p>

          {!showAppButton && (
            <div className="w-8 h-8 border-2 border-[#069494] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          )}

          {showAppButton && (
            <a
              href={deepLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-all hover:scale-[1.02] shadow-lg shadow-[#069494]/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Open BoothIQ App
            </a>
          )}
        </div>
      </div>
    );
  }

  // Build the success content based on checkout type
  const getSuccessContent = () => {
    if (checkoutType === "templates") {
      return {
        title: "Purchase Complete!",
        description: "Your templates have been added to your library. Open them in BoothIQ to start using them.",
        primaryAction: { href: "/dashboard/templates", label: "Download Templates" },
        secondaryAction: { href: "/templates", label: "Browse More Templates" },
        // NOTE: Templates are booth-scoped — see release notes for v0.1.0:
        // "Booth-scoped template purchases — prevents sharing across booths".
        // Don't tell users they can use templates across all their booths.
        features: [
          "Templates available immediately in your dashboard",
          "Tied to the booth you purchased them for",
          "Re-download anytime — purchase never expires",
        ],
      };
    }

    // Subscription (default)
    //
    // Prefer the URL-passed plan name over the booth-subscription API
    // lookup. The lookup matched by stripe_price_id and was failing
    // silently — falling back to a generic "Subscription Active" title
    // even when the user had clearly just paid for a specific plan. The
    // subscribe modal now sends plan_name + booth_name in the success
    // URL so we always know what to display.
    const planName =
      planNameParam ||
      (boothSubscription?.price_id
        ? plans.find(
            (p) =>
              p.stripe_price_id === boothSubscription.price_id ||
              p.stripe_annual_price_id === boothSubscription.price_id
          )?.name ?? null
        : null);

    const boothName = boothNameParam;
    const billingInterval = billingParam === "annual" ? "annually" : "monthly";

    // Real "what's next" guidance — actual things the operator can do
    // now that the subscription is live, not restatements of the title.
    const features: string[] = [
      boothName
        ? `Live revenue from ${boothName} is now visible in your dashboard`
        : "Live revenue is now visible in your dashboard",
      `Renews ${billingInterval} — cancel or change plan anytime`,
      "Manage this subscription from the booth detail page",
    ];

    // Personalised description — names the booth and plan when known.
    let description: string;
    if (planName && boothName) {
      description = `Your ${planName} plan is now active for ${boothName}.`;
    } else if (planName) {
      description = `Your ${planName} plan is now active for this booth.`;
    } else if (boothName) {
      description = `${boothName} is now subscribed.`;
    } else {
      description = "Your booth subscription is now active.";
    }

    return {
      title: planName ? `${planName} plan active!` : "Subscription Active!",
      description,
      primaryAction: { href: "/dashboard/booths", label: "Go to Booths" },
      // The downloads page is for updates / re-installs. A brand-new
      // subscriber doesn't need to download anything — the booth ships
      // pre-installed by BoothWorks. Send them to the dashboard overview
      // instead.
      secondaryAction: { href: "/dashboard", label: "Open Dashboard" },
      features,
    };
  };

  const content = getSuccessContent();

  // Success state
  return (
    <div className="min-h-screen bg-[var(--background)] pt-28 sm:pt-32 lg:pt-36 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[#069494]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-lg text-[var(--muted)] max-w-lg mx-auto">
            {content.description}
          </p>
        </div>

        {/* What's Next Card */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What&apos;s Next
          </h2>
          <ul className="space-y-3">
            {content.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <svg className="w-5 h-5 text-[#069494] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--foreground-secondary)]">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Receipt Info */}
        {session && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-8">
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
                  {session.amount_total != null && session.currency
                    ? `$${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}`
                    : "—"}
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
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-all hover:scale-[1.02] shadow-lg shadow-[#069494]/20"
          >
            {content.primaryAction.label}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href={content.secondaryAction.href}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[var(--border)] font-semibold hover:bg-[#069494]/5 hover:border-[#069494]/30 transition-colors"
          >
            {content.secondaryAction.label}
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-center text-sm text-[var(--muted)] mt-8">
          Need help? <Link href="/contact" className="text-[#069494] hover:underline">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function CheckoutSuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-8 h-8 border-2 border-[#069494] border-t-transparent rounded-full animate-spin" />
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
