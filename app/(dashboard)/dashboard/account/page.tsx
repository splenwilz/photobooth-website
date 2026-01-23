"use client";

/**
 * Account Page
 *
 * User profile and subscription management.
 * Shows subscription details when a booth is selected (per-booth subscriptions).
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import type { AuthUser } from "@/core/api/auth/types";
import { useBoothList } from "@/core/api/booths";
import {
  useBoothSubscription,
  useCreateBoothCheckout,
  useCustomerPortal,
} from "@/core/api/payments";
import { SUBSCRIPTION_PRICES } from "@/core/config/stripe";

// Get user from auth_user cookie (client-side)
function getUserFromCookie(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_user="));
    if (!cookie) return null;
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return null;
  }
}

// Get user initials
function getInitials(user: AuthUser | null): string {
  if (!user) return "U";
  const first = user.first_name?.[0] ?? "";
  const last = user.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || "U";
}

// Format date for display
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get status color and label
function getSubscriptionStatusDisplay(status: string | undefined | null) {
  switch (status) {
    case "active":
      return { color: "text-green-500", bg: "bg-green-500/10", label: "Active" };
    case "trialing":
      return { color: "text-blue-500", bg: "bg-blue-500/10", label: "Trial" };
    case "past_due":
      return { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Past Due" };
    case "canceled":
      return { color: "text-red-500", bg: "bg-red-500/10", label: "Canceled" };
    default:
      return { color: "text-zinc-500", bg: "bg-zinc-500/10", label: "Free" };
  }
}

// Get plan name from price_id
function getPlanName(priceId: string | null | undefined): string {
  if (!priceId) return "Free";
  if (priceId === SUBSCRIPTION_PRICES.pro.monthly) return "Pro Monthly";
  if (priceId === SUBSCRIPTION_PRICES.pro.annual) return "Pro Annual";
  return "Pro";
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`} />;
}

function AccountPageContent() {
  const searchParams = useSearchParams();
  const selectedBoothId = searchParams.get("booth");

  // Initialize user from cookie (lazy initialization avoids useEffect)
  const [user] = useState<AuthUser | null>(() => getUserFromCookie());

  // Fetch booths to get booth name
  const { data: boothListData } = useBoothList();
  const booths = boothListData?.booths ?? [];
  const selectedBooth = booths.find((b) => b.id === selectedBoothId);

  // Fetch booth subscription when a booth is selected
  const {
    data: subscription,
    isLoading: subscriptionLoading,
  } = useBoothSubscription(selectedBoothId);

  // Customer portal mutation
  const customerPortal = useCustomerPortal();

  // Booth checkout mutation
  const boothCheckout = useCreateBoothCheckout();

  // Handle manage subscription click
  const handleManageSubscription = () => {
    customerPortal.mutate(
      { return_url: window.location.href },
      {
        onSuccess: ({ portal_url }) => {
          if (portal_url) window.location.href = portal_url;
        },
      }
    );
  };

  // Handle subscribe to booth
  const handleSubscribeToBooth = () => {
    if (!selectedBoothId) return;

    boothCheckout.mutate(
      {
        booth_id: selectedBoothId,
        price_id: SUBSCRIPTION_PRICES.pro.monthly,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&booth_id=${selectedBoothId}`,
        cancel_url: window.location.href,
      },
      {
        onSuccess: ({ checkout_url }) => {
          if (checkout_url) window.location.href = checkout_url;
        },
      }
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Account</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your profile and subscription
        </p>
      </div>

      {/* Profile Section */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Profile</h2>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {getInitials(user)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold text-zinc-900 dark:text-white">
                {user ? `${user.first_name} ${user.last_name}`.trim() : "User"}
              </p>
              <p className="text-zinc-500">{user?.email ?? ""}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section - Shows when a booth is selected */}
      {selectedBoothId ? (
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Subscription & Billing
          </h2>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            {subscriptionLoading ? (
              <div className="space-y-6">
                {/* Plan Info Skeleton */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-8 w-32 rounded" />
                      <Skeleton className="h-7 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-64 rounded" />
                  </div>
                </div>

                {/* Subscription Details Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900">
                  {["status", "billing", "renew"].map((key) => (
                    <div key={key}>
                      <Skeleton className="h-3 w-16 mb-2 rounded" />
                      <Skeleton className="h-5 w-20 rounded" />
                    </div>
                  ))}
                </div>

                {/* Actions Skeleton */}
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-11 w-48 rounded-xl" />
                  <Skeleton className="h-11 w-36 rounded-xl" />
                </div>
              </div>
            ) : subscription?.is_active ? (
              <div className="space-y-6">
                {/* Plan Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {getPlanName(subscription.price_id)}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionStatusDisplay(subscription.status).bg} ${getSubscriptionStatusDisplay(subscription.status).color}`}>
                        {getSubscriptionStatusDisplay(subscription.status).label}
                      </span>
                    </div>
                    <p className="text-zinc-500">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{selectedBooth?.name ?? "Booth"}</span>
                      {" · "}
                      {subscription.cancel_at_period_end
                        ? `Expires ${formatDate(subscription.current_period_end)}`
                        : `Renews ${formatDate(subscription.current_period_end)}`}
                    </p>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</p>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {subscription.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Billing Period</p>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {subscription.price_id === SUBSCRIPTION_PRICES.pro.annual ? "Annual" : "Monthly"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      {subscription.cancel_at_period_end ? "Expires At" : "Renews At"}
                    </p>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleManageSubscription}
                    disabled={customerPortal.isPending}
                    className="px-5 py-2.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {customerPortal.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <title>Settings</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    Manage Subscription
                  </button>
                  <button
                    type="button"
                    onClick={handleManageSubscription}
                    disabled={customerPortal.isPending}
                    className="px-5 py-2.5 rounded-xl border border-[var(--border)] font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <title>Invoices</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    View Invoices
                  </button>
                </div>
              </div>
            ) : (
              /* No subscription for this booth */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <title>No subscription</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                  No Subscription
                </h3>
                <p className="text-zinc-500 mb-2">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{selectedBooth?.name ?? "This booth"}</span> doesn&apos;t have an active subscription.
                </p>
                <p className="text-zinc-500 mb-6 max-w-md mx-auto">
                  Subscribe to unlock premium features, remote management, and priority support.
                </p>
                <button
                  type="button"
                  onClick={handleSubscribeToBooth}
                  disabled={boothCheckout.isPending}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors disabled:opacity-50"
                >
                  {boothCheckout.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <title>Subscribe</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                  Subscribe Now
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* No booth selected - Show info notice */
        <section>
          <div className="p-6 rounded-2xl bg-[#0891B2]/5 border border-[#0891B2]/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0891B2]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <title>Information</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Subscription & Billing</h3>
                <p className="text-sm text-zinc-500">
                  Select a booth from the dropdown above to view and manage its subscription.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
        <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Need Help?</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Having trouble with your account or subscription? Our support team is here to help.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs"
            className="text-sm text-[#0891B2] hover:underline font-medium"
          >
            View Documentation
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <Link
            href="/contact"
            className="text-sm text-[#0891B2] hover:underline font-medium"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountPageContent />
    </Suspense>
  );
}

function AccountPageSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Skeleton className="h-8 w-32 rounded" />
        <Skeleton className="h-5 w-64 mt-2 rounded" />
      </div>
      <section>
        <Skeleton className="h-6 w-20 mb-4 rounded" />
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-4 w-48 mt-2 rounded" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
