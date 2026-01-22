"use client";

/**
 * Dashboard Overview Page
 *
 * Main dashboard showing revenue stats, hardware status, and recent alerts.
 * Shows aggregated data when "All Booths" selected, or booth-specific data
 * when a particular booth is selected.
 *
 * @see GET /api/v1/booths/overview/all (all booths)
 * @see GET /api/v1/booths/{booth_id}/overview (single booth)
 */

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboardOverview, useBoothDetail } from "@/core/api/booths";

type RevenuePeriod = "today" | "week" | "month" | "year";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`} />;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getSeverityColor(severity: "critical" | "warning" | "info"): string {
  switch (severity) {
    case "critical": return "#EF4444";
    case "warning": return "#F59E0B";
    case "info": return "#0891B2";
  }
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<RevenuePeriod>("today");
  const searchParams = useSearchParams();

  // Get booth ID from URL search params (null = all booths)
  const selectedBoothId = searchParams.get("booth");
  const isAllBooths = !selectedBoothId;

  // Use appropriate hook based on selection
  const dashboardQuery = useDashboardOverview({ enabled: isAllBooths });
  const boothDetailQuery = useBoothDetail(selectedBoothId);

  // Select the active query
  const isLoading = isAllBooths ? dashboardQuery.isLoading : boothDetailQuery.isLoading;
  const error = isAllBooths ? dashboardQuery.error : boothDetailQuery.error;
  const dashboardData = dashboardQuery.data;
  const boothData = boothDetailQuery.data;

  // Get stats for selected period - handle both data shapes
  const revenue = isAllBooths
    ? dashboardData?.revenue?.[selectedPeriod]
    : boothData?.revenue?.[selectedPeriod];
  const payment = isAllBooths
    ? dashboardData?.payment_breakdown?.[selectedPeriod]
    : boothData?.payment_breakdown?.[selectedPeriod];
  const upsale = isAllBooths
    ? dashboardData?.upsale_breakdown?.[selectedPeriod]
    : boothData?.upsale_breakdown?.[selectedPeriod];
  const summary = dashboardData?.summary;
  const hardware = dashboardData?.hardware_summary;
  const boothHardware = boothData?.hardware;
  const boothSystem = boothData?.system;
  const alerts = isAllBooths
    ? (dashboardData?.recent_alerts ?? [])
    : (boothData?.recent_alerts ?? []);

  // Calculate payment totals for percentage bars
  const paymentTotal = (payment?.cash ?? 0) + (payment?.card ?? 0) + (payment?.manual ?? 0);
  const cashPercent = paymentTotal > 0 ? ((payment?.cash ?? 0) / paymentTotal) * 100 : 0;
  const cardPercent = paymentTotal > 0 ? ((payment?.card ?? 0) / paymentTotal) * 100 : 0;
  const manualPercent = paymentTotal > 0 ? ((payment?.manual ?? 0) / paymentTotal) * 100 : 0;

  // Calculate upsale totals
  const totalUpsaleRevenue = (upsale?.extra_copies_revenue ?? 0) + (upsale?.cross_sell_revenue ?? 0);

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Page Header Skeleton */}
        <div>
          <Skeleton className="h-8 w-40 rounded-lg" />
          <Skeleton className="h-5 w-64 mt-2 rounded-lg" />
        </div>

        {/* Revenue Overview Skeleton */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-24 mt-1 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-64 rounded-xl" />
          </div>

          {/* Stats Cards Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["revenue", "transactions", "upsale", "avg-order"].map((key) => (
              <div key={key} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-8 w-28 mt-2 rounded" />
                <Skeleton className="h-4 w-32 mt-3 rounded" />
              </div>
            ))}
          </div>

          {/* Stats Cards Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {/* Payment Methods Skeleton */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <Skeleton className="h-5 w-36 mb-4 rounded" />
              <div className="space-y-3">
                {["cash", "card", "manual"].map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <Skeleton className="h-4 w-16 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>

            {/* Upsale Breakdown Skeleton */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <Skeleton className="h-5 w-36 mb-4 rounded" />
              <div className="space-y-4">
                {["extra-copies", "cross-sell"].map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <div>
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-3 w-16 mt-1 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          </div>
        </section>

        {/* Hardware & Alerts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hardware Overview Skeleton */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Skeleton className="h-6 w-40 rounded-lg" />
                <Skeleton className="h-4 w-20 mt-1 rounded-lg" />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
              {["booths", "printers", "payment"].map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
              <div className="flex gap-4 pt-2 border-t border-slate-200 dark:border-zinc-800">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            </div>
          </section>

          {/* Recent Alerts Skeleton */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-4 w-20 mt-1 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="space-y-3">
              {["alert-1", "alert-2", "alert-3"].map((key) => (
                <div key={key} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-3 w-12 rounded" />
                      </div>
                      <Skeleton className="h-4 w-full mt-2 rounded" />
                      <Skeleton className="h-3 w-24 mt-2 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Overview of your photo booth business</p>
        </div>
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-500 font-medium">Failed to load dashboard data</p>
          <p className="text-sm text-zinc-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {isAllBooths ? "Dashboard" : boothData?.booth_name ?? "Dashboard"}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          {isAllBooths
            ? "Overview of your photo booth business"
            : boothData?.booth_address ?? "Booth overview"}
        </p>
      </div>

      {/* Revenue Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Revenue Overview</h2>
            <p className="text-sm text-zinc-500">
              {isAllBooths
                ? `${summary?.total_booths ?? 0} booths total`
                : boothData?.booth_status
                  ? `Status: ${boothData.booth_status}`
                  : "Loading..."
              }
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
            {(["today", "week", "month", "year"] as RevenuePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedPeriod === period
                    ? "bg-[#0891B2] text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <p className="text-sm text-zinc-500 mb-1">Revenue</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(revenue?.amount ?? 0)}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${(revenue?.change ?? 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                {(revenue?.change ?? 0) >= 0 ? "+" : ""}{revenue?.change ?? 0}%
              </span>
              <span className="text-xs text-zinc-500">vs last period</span>
            </div>
          </div>

          {/* Transactions Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <p className="text-sm text-zinc-500 mb-1">Transactions</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{(revenue?.transactions ?? 0).toLocaleString()}</p>
            <p className="text-sm text-zinc-500 mt-2">
              Avg: {formatCurrency(revenue?.transactions ? (revenue.amount / revenue.transactions) : 0)}
            </p>
          </div>

          {/* Upsale Revenue Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Upsale Revenue</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(totalUpsaleRevenue)}</p>
            <p className="text-xs text-zinc-500 mt-2">
              {(upsale?.extra_copies_count ?? 0) + (upsale?.cross_sell_count ?? 0)} upsales
            </p>
          </div>

          {/* Average Order Value */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Avg Order</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {formatCurrency(revenue?.transactions ? (revenue.amount / revenue.transactions) : 0)}
            </p>
            <p className="text-xs text-zinc-500 mt-2">per transaction</p>
          </div>
        </div>

        {/* Stats Cards - Row 2: Payment Methods & Upsale Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Payment Methods Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {/* Cash */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Cash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{formatCurrency(payment?.cash ?? 0)}</span>
                    <span className="text-xs text-zinc-500">({cashPercent.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${cashPercent}%` }} />
                </div>
              </div>
              {/* Card */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0891B2]" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{formatCurrency(payment?.card ?? 0)}</span>
                    <span className="text-xs text-zinc-500">({cardPercent.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0891B2] rounded-full transition-all" style={{ width: `${cardPercent}%` }} />
                </div>
              </div>
              {/* Manual */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Manual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{formatCurrency(payment?.manual ?? 0)}</span>
                    <span className="text-xs text-zinc-500">({manualPercent.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${manualPercent}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-sm text-zinc-500">Total</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">{formatCurrency(paymentTotal)}</span>
            </div>
          </div>

          {/* Upsale Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Upsale Breakdown</h3>
            <div className="space-y-4">
              {/* Extra Copies */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Extra Copies</p>
                    <p className="text-xs text-zinc-500">{upsale?.extra_copies_count ?? 0} sold</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{formatCurrency(upsale?.extra_copies_revenue ?? 0)}</p>
              </div>

              {/* Cross-Sell */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Cross-Sell</p>
                    <p className="text-xs text-zinc-500">{upsale?.cross_sell_count ?? 0} sold</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{formatCurrency(upsale?.cross_sell_revenue ?? 0)}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-sm text-zinc-500">Total Upsale Revenue</span>
              <span className="text-sm font-semibold text-purple-500">{formatCurrency(totalUpsaleRevenue)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Status & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Overview - Aggregated (All Booths) */}
        {isAllBooths ? (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Hardware Overview</h2>
                <p className="text-sm text-zinc-500">{summary?.total_booths ?? 0} booths</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
              {/* Booths Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0891B2]/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      </svg>
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-white">Booths</span>
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {summary?.online_count ?? 0}/{summary?.total_booths ?? 0} online
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0891B2] rounded-full transition-all"
                    style={{ width: `${summary?.total_booths ? ((summary.online_count / summary.total_booths) * 100) : 0}%` }}
                  />
                </div>
              </div>

              {/* Printers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                      </svg>
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-white">Printers</span>
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {hardware?.printers.online ?? 0}/{(hardware?.printers.online ?? 0) + (hardware?.printers.error ?? 0) + (hardware?.printers.offline ?? 0)} online
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  {(() => {
                    const total = (hardware?.printers.online ?? 0) + (hardware?.printers.error ?? 0) + (hardware?.printers.offline ?? 0);
                    const percentage = total > 0 ? ((hardware?.printers.online ?? 0) / total) * 100 : 0;
                    return (
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    );
                  })()}
                </div>
              </div>

              {/* Payment Controllers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-white">Payment</span>
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {hardware?.payment_controllers.connected ?? 0} connected
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  {(() => {
                    const total = (hardware?.payment_controllers.connected ?? 0) + (hardware?.payment_controllers.disconnected ?? 0) + (hardware?.payment_controllers.not_configured ?? 0);
                    const percentage = total > 0 ? ((hardware?.payment_controllers.connected ?? 0) / total) * 100 : 0;
                    return (
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    );
                  })()}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex gap-4 pt-2 border-t border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${(hardware?.printers.error ?? 0) > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {hardware?.printers.error ?? 0} printer errors
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${(summary?.error_count ?? 0) > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {summary?.error_count ?? 0} booth errors
                  </span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Hardware & System - Single Booth */
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Hardware & System</h2>
                <p className="text-sm text-zinc-500">
                  {boothData?.last_heartbeat_ago ? `Last seen ${boothData.last_heartbeat_ago}` : "Status unknown"}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
              {/* Printer Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Printer</p>
                    <p className="text-xs text-zinc-500">
                      {boothHardware?.printer?.name ?? boothHardware?.printer?.model ?? "Not configured"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    boothHardware?.printer?.status === "online" ? "text-green-500" :
                    boothHardware?.printer?.status === "error" ? "text-red-500" :
                    "text-zinc-500"
                  }`}>
                    {boothHardware?.printer?.status ?? "Unknown"}
                  </span>
                  {boothHardware?.printer?.prints_remaining !== undefined && (
                    <p className="text-xs text-zinc-500">{boothHardware.printer.prints_remaining} prints left</p>
                  )}
                </div>
              </div>

              {/* Payment Controller Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Payment</p>
                    <p className="text-xs text-zinc-500">
                      {boothHardware?.payment_controller?.payment_methods ?? "Not configured"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    boothHardware?.payment_controller?.status === "connected" ? "text-green-500" :
                    boothHardware?.payment_controller?.status === "disconnected" ? "text-red-500" :
                    "text-zinc-500"
                  }`}>
                    {boothHardware?.payment_controller?.status ?? "Unknown"}
                  </span>
                  {boothHardware?.payment_controller?.transactions_today !== undefined && (
                    <p className="text-xs text-zinc-500">{boothHardware.payment_controller.transactions_today} txns today</p>
                  )}
                </div>
              </div>

              {/* Camera Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0891B2]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Camera</p>
                    <p className="text-xs text-zinc-500">
                      {boothHardware?.camera?.name ?? `${boothHardware?.camera?.cameras_detected ?? 0} detected`}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  boothHardware?.camera?.status === "online" ? "text-green-500" :
                  boothHardware?.camera?.status === "error" ? "text-red-500" :
                  "text-zinc-500"
                }`}>
                  {boothHardware?.camera?.status ?? "Unknown"}
                </span>
              </div>

              {/* System Info */}
              {boothSystem && (
                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">App Version</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{boothSystem.app_version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">App Uptime</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{boothSystem.app_uptime_formatted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">System Uptime</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{boothSystem.system_uptime_formatted}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center">
                      <p className="text-xs text-zinc-500 mb-1">CPU</p>
                      <p className={`text-sm font-medium ${(boothSystem.cpu_percent ?? 0) > 80 ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
                        {boothSystem.cpu_percent?.toFixed(0) ?? "—"}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-500 mb-1">Memory</p>
                      <p className={`text-sm font-medium ${(boothSystem.memory_percent ?? 0) > 80 ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
                        {boothSystem.memory_percent?.toFixed(0) ?? "—"}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-500 mb-1">Disk</p>
                      <p className={`text-sm font-medium ${(boothSystem.disk_percent ?? 0) > 90 ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
                        {boothSystem.disk_percent?.toFixed(0) ?? "—"}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recent Alerts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Alerts</h2>
              <p className="text-sm text-zinc-500">{alerts.filter(a => !a.is_read).length} unread</p>
            </div>
            <a href="/dashboard/alerts" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              View All →
            </a>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="p-6 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
                <p className="text-zinc-500">No recent alerts</p>
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl bg-white dark:bg-[#111111] border transition-all cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 ${
                    alert.is_read ? 'border-slate-200 dark:border-zinc-800 opacity-60' : 'border-slate-300 dark:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${getSeverityColor(alert.severity)}20` }}
                    >
                      {alert.severity === "critical" && (
                        <svg className="w-4 h-4" fill={getSeverityColor(alert.severity)} viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {alert.severity === "warning" && (
                        <svg className="w-4 h-4" fill={getSeverityColor(alert.severity)} viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {alert.severity === "info" && (
                        <svg className="w-4 h-4" fill={getSeverityColor(alert.severity)} viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm truncate text-zinc-900 dark:text-white">{alert.title}</p>
                        <span className="text-xs text-zinc-500 shrink-0">{formatRelativeTime(alert.timestamp)}</span>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{alert.message}</p>
                      <p className="text-xs text-zinc-500 mt-1">{alert.booth_name}</p>
                    </div>
                    {!alert.is_read && (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getSeverityColor(alert.severity) }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

