"use client";

/**
 * Booths Management Page
 *
 * List of all booths with filters, search, and status indicators.
 * Uses real API data from useBoothOverview hook.
 *
 * @see GET /api/v1/booths/overview
 */

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useBoothOverview } from "@/core/api/booths";
import { queryKeys } from "@/core/api/utils/query-keys";
import type { BoothStatus, BoothSubscription } from "@/core/api/booths";
import { AddBoothModal } from "./AddBoothModal";
import { SubscribeBoothModal } from "./SubscribeBoothModal";
import { ManageSubscriptionModal } from "./ManageSubscriptionModal";

type FilterStatus = "all" | "online" | "offline" | "warning" | "error";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getStatusColor(status: BoothStatus): string {
  switch (status) {
    case "online": return "#10B981";
    case "offline": return "#EF4444";
    case "warning": return "#F59E0B";
    case "error": return "#EF4444";
    default: return "#6B7280";
  }
}

function getSubscriptionBadge(subscription: BoothSubscription | null): { text: string; color: string; bgColor: string } {
  if (!subscription || subscription.status === 'none' || !subscription.plan_name) {
    return { text: "No Plan", color: "text-zinc-500", bgColor: "bg-zinc-100 dark:bg-zinc-800" };
  }
  switch (subscription.status) {
    case 'active':
      return { text: subscription.plan_name, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30" };
    case 'trialing':
      return { text: `${subscription.plan_name} (Trial)`, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30" };
    case 'past_due':
      return { text: `${subscription.plan_name} (Past Due)`, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" };
    case 'canceled':
      return { text: `${subscription.plan_name} (Canceled)`, color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" };
    default:
      return { text: subscription.plan_name, color: "text-zinc-600 dark:text-zinc-400", bgColor: "bg-zinc-100 dark:bg-zinc-800" };
  }
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`} />;
}

export default function BoothsPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subscribeBoothId, setSubscribeBoothId] = useState<string | null>(null);
  const [subscribeBoothName, setSubscribeBoothName] = useState<string>("");
  const [manageBoothId, setManageBoothId] = useState<string | null>(null);
  const [manageBoothName, setManageBoothName] = useState<string>("");
  const [manageSubscription, setManageSubscription] = useState<BoothSubscription | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<{ type: "success" | "canceled"; message: string } | null>(null);

  const { data, isLoading, error } = useBoothOverview();

  // Handle checkout return (success redirect goes to /checkout/success, this handles canceled)
  useEffect(() => {
    const canceled = searchParams.get("canceled");

    if (canceled === "true") {
      setCheckoutMessage({ type: "canceled", message: "Checkout was canceled. You can try again anytime." });
      // Clear the URL param
      window.history.replaceState({}, "", "/dashboard/booths");
    }

    // Refetch booth data when returning from any checkout flow
    queryClient.invalidateQueries({ queryKey: queryKeys.booths.all() });
  }, [searchParams, queryClient]);

  const openSubscribeModal = (boothId: string, boothName: string) => {
    setSubscribeBoothId(boothId);
    setSubscribeBoothName(boothName);
  };

  const closeSubscribeModal = () => {
    setSubscribeBoothId(null);
    setSubscribeBoothName("");
    // Refetch after closing modal (in case subscription was added)
    queryClient.invalidateQueries({ queryKey: queryKeys.booths.all() });
  };

  const openManageModal = (boothId: string, boothName: string, subscription: BoothSubscription) => {
    setManageBoothId(boothId);
    setManageBoothName(boothName);
    setManageSubscription(subscription);
  };

  const closeManageModal = () => {
    setManageBoothId(null);
    setManageBoothName("");
    setManageSubscription(null);
    queryClient.invalidateQueries({ queryKey: queryKeys.booths.all() });
  };


  const summary = data?.summary;
  const booths = data?.booths ?? [];

  // Filter booths
  const filteredBooths = useMemo(() => {
    return booths.filter((booth) => {
      // Filter by status
      if (filterStatus !== "all" && booth.booth_status !== filterStatus) {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          booth.booth_name.toLowerCase().includes(query) ||
          (booth.booth_address?.toLowerCase().includes(query) ?? false)
        );
      }
      return true;
    });
  }, [booths, filterStatus, searchQuery]);

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-5 w-56 mt-2 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["total", "revenue", "online", "offline"].map((key) => (
            <div key={key} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-8 w-20 mt-2 rounded" />
              <Skeleton className="h-4 w-28 mt-3 rounded" />
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="flex-1 h-12 rounded-xl" />
          <div className="flex gap-2">
            {["all", "online", "offline"].map((key) => (
              <Skeleton key={key} className="h-10 w-20 rounded-xl" />
            ))}
          </div>
        </div>

        {/* All Booths Card */}
        <Skeleton className="h-20 rounded-xl" />

        {/* Booth List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="space-y-3">
            {["booth-1", "booth-2", "booth-3"].map((key) => (
              <div key={key} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div>
                      <Skeleton className="h-5 w-32 rounded" />
                      <Skeleton className="h-4 w-40 mt-1 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <Skeleton className="h-5 w-20 rounded" />
                      <Skeleton className="h-3 w-16 mt-1 rounded" />
                    </div>
                    <Skeleton className="w-5 h-5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Booths</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your photo booth locations</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-500 font-medium">Failed to load booths</p>
          <p className="text-sm text-zinc-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Checkout Message Banner */}
      {checkoutMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between ${
            checkoutMessage.type === "canceled"
              ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
              : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {checkoutMessage.type === "canceled" ? (
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className={`text-sm font-medium ${
              checkoutMessage.type === "canceled"
                ? "text-amber-700 dark:text-amber-300"
                : "text-green-700 dark:text-green-300"
            }`}>
              {checkoutMessage.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutMessage(null)}
            className={`p-1 rounded-lg transition-colors ${
              checkoutMessage.type === "canceled"
                ? "hover:bg-amber-100 dark:hover:bg-amber-800/30 text-amber-500"
                : "hover:bg-green-100 dark:hover:bg-green-800/30 text-green-500"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Booths</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your photo booth locations</p>
        </div>
        <button
        type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Add Booth">
            <title>Add Booth</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Booth
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500 mb-1">Total Booths</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{summary?.total_booths ?? 0}</p>
          <p className="text-sm text-zinc-500 mt-2">{summary?.online_count ?? 0} online</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500 mb-1">Today&apos;s Revenue</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(summary?.total_revenue_today ?? 0)}</p>
          <p className="text-sm text-zinc-500 mt-2">{summary?.total_transactions_today ?? 0} transactions</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm text-zinc-500">Online</p>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{summary?.online_count ?? 0}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="text-sm text-zinc-500">Offline</p>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{summary?.offline_count ?? 0}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-label="Search">
            <title>Search</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search booths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2">
          {(["all", "online", "offline"] as FilterStatus[]).map((status) => (
            <button
              type="button"
                key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                filterStatus === status
                  ? "bg-[#0891B2] border-[#0891B2] text-white"
                  : "border-slate-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"
              }`}
            >
              {status !== "all" && (
                <div className={`w-2 h-2 rounded-full ${status === "online" ? "bg-green-500" : "bg-red-500"}`} />
              )}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* All Booths Card */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#111111] border-2 border-[#0891B2] flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0891B2]/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-label="All Booths">
              <title>All Booths</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">All Booths</p>
            <p className="text-sm text-zinc-500">{summary?.online_count ?? 0} online · {summary?.offline_count ?? 0} offline</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-[#0891B2] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-label="Arrow Right">
              <title>Arrow Right</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-label="Arrow Right">
            <title>Arrow Right</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>

      {/* Booth List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Your Booths</h2>
          <p className="text-sm text-zinc-500">{filteredBooths.length} booth{filteredBooths.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="space-y-3">
          {filteredBooths.map((booth) => {
            const subBadge = getSubscriptionBadge(booth.subscription ?? null);
            return (
              <div
                key={booth.booth_id}
                className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                      <svg className="w-6 h-6 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-label="Booth Icon">
                        <title>Booth Icon</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-zinc-900 dark:text-white">{booth.booth_name}</p>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getStatusColor(booth.booth_status) }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm text-zinc-500">{booth.booth_address ?? "No address"}</p>
                        <span className="text-zinc-300 dark:text-zinc-600">·</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${subBadge.bgColor} ${subBadge.color}`}>
                          {subBadge.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(booth.revenue?.today ?? 0)}</p>
                      <p className="text-xs text-zinc-500">{booth.transactions?.today_count ?? 0} today</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{booth.credits?.balance ?? 0} credits</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const hasActiveSubscription = booth.subscription &&
                          (booth.subscription.status === 'active' ||
                           booth.subscription.status === 'trialing' ||
                           booth.subscription.status === 'past_due');

                        if (hasActiveSubscription && booth.subscription) {
                          openManageModal(booth.booth_id, booth.booth_name, booth.subscription);
                        } else {
                          openSubscribeModal(booth.booth_id, booth.booth_name);
                        }
                      }}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[#0891B2]/10 text-[#0891B2] hover:bg-[#0891B2]/20 transition-colors"
                    >
                      {booth.subscription?.status === 'active' || booth.subscription?.status === 'trialing' || booth.subscription?.status === 'past_due'
                        ? "Manage Plan"
                        : "Subscribe"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredBooths.length === 0 && (
            <div className="p-12 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
              <svg className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-label="No Booths">
                <title>No Booths</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              </svg>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">No booths match your filters</p>
              <p className="text-sm text-zinc-500 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Booth Modal */}
      <AddBoothModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Subscribe Booth Modal */}
      <SubscribeBoothModal
        isOpen={!!subscribeBoothId}
        boothId={subscribeBoothId}
        boothName={subscribeBoothName}
        onClose={closeSubscribeModal}
      />

      {/* Manage Subscription Modal */}
      <ManageSubscriptionModal
        isOpen={!!manageBoothId}
        boothId={manageBoothId}
        boothName={manageBoothName}
        subscription={manageSubscription}
        onClose={closeManageModal}
      />
    </div>
  );
}

