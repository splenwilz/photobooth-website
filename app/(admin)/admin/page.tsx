"use client";

/**
 * Admin Overview Page
 *
 * Platform-wide metrics dashboard for photobooth SaaS administration.
 * Fetches data from the unified admin overview API endpoint.
 */

import Link from "next/link";
import { useAdminOverview } from "@/core/api/admin/overview";

/**
 * Format currency display (values are already in dollars)
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Get color class for plan based on name
 */
function getPlanColor(planName: string): string {
  const name = planName.toLowerCase();
  if (name.includes("enterprise")) return "bg-[#0891B2]";
  if (name.includes("pro")) return "bg-blue-500";
  return "bg-emerald-500";
}

/**
 * Loading skeleton component
 */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`} />
  );
}

/**
 * Loading state for the dashboard
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Skeleton className="w-32 h-8 mb-2" />
        <Skeleton className="w-64 h-5" />
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={`metric-skeleton-${i}`} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <Skeleton className="w-24 h-4 mb-3" />
            <Skeleton className="w-32 h-8 mb-2" />
            <Skeleton className="w-40 h-4" />
          </div>
        ))}
      </div>

      {/* System Health */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] p-5">
          <Skeleton className="w-48 h-6 mb-4" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={`top-booth-skeleton-${i}`} className="w-full h-16 mb-2" />
          ))}
        </div>
        <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] p-5">
          <Skeleton className="w-48 h-6 mb-4" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={`plan-skeleton-${i}`} className="w-full h-12 mb-2" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useAdminOverview();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">Platform overview and key metrics</p>
        </div>
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load dashboard data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const totalPlanMrr = data.revenue_by_plan.reduce((sum, plan) => sum + plan.mrr, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Key Business Metrics */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* MRR */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-[#0891B2]/20 flex items-center justify-center">
                <svg aria-hidden="true" className="w-3.5 h-3.5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Monthly Revenue</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(data.monthly_revenue)}</p>
            {data.monthly_revenue_change !== null && (
              <p className={`text-sm mt-2 flex items-center gap-1 ${data.monthly_revenue_change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {data.monthly_revenue_change >= 0 && (
                  <svg aria-hidden="true" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {data.monthly_revenue_change < 0 && (
                  <svg aria-hidden="true" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {data.monthly_revenue_change >= 0 ? "+" : ""}{data.monthly_revenue_change}% from last month
              </p>
            )}
          </div>

          {/* Active Subscriptions */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg aria-hidden="true" className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Active Subscriptions</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatNumber(data.active_subscriptions)}</p>
            <p className="text-sm text-zinc-500 mt-2">{data.trialing_subscriptions} trialing</p>
          </div>

          {/* Total Users */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg aria-hidden="true" className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Total Users</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatNumber(data.total_users)}</p>
            <p className="text-sm text-zinc-500 mt-2">{formatNumber(data.active_users)} active</p>
          </div>

          {/* Total Booths */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg aria-hidden="true" className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Total Booths</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatNumber(data.total_booths)}</p>
            <p className="text-sm mt-2">
              <span className="text-green-500">{formatNumber(data.online_booths)} online</span>
              <span className="text-zinc-400 mx-1">·</span>
              <span className="text-zinc-500">{data.offline_booths} offline</span>
            </p>
          </div>
        </div>
      </section>

      {/* System Health */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">System Health</h2>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
          {/* Booth Connectivity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                  </svg>
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">Booth Connectivity</span>
              </div>
              <span className="text-sm text-green-500 font-medium">{data.booth_connectivity_percent.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.booth_connectivity_percent}%` }} />
            </div>
            <p className="text-xs text-zinc-500 mt-1">{formatNumber(data.online_booths)} of {formatNumber(data.total_booths)} booths online</p>
          </div>

          {/* Payment Success Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0891B2]/20 flex items-center justify-center">
                  <svg aria-hidden="true" className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">Payment Success Rate</span>
              </div>
              <span className="text-sm text-[#0891B2] font-medium">{data.payment_success_rate.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#0891B2] rounded-full" style={{ width: `${data.payment_success_rate}%` }} />
            </div>
          </div>

          {/* Active Alerts */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <svg aria-hidden="true"   className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <span className="font-medium text-zinc-900 dark:text-white">Active Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-sm font-semibold rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                {data.active_alerts}
              </span>
              <Link href="/admin/booths" className="text-sm text-[#0891B2] hover:text-[#22D3EE]">View →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Booths */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Top Performing Booths</h2>
            <Link href="/admin/booths" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              View All →
            </Link>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] overflow-hidden">
            {data.top_performing.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                No booth data available yet.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {data.top_performing.map((booth) => (
                  <div key={booth.booth_id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        booth.rank === 1 ? "bg-yellow-500 text-yellow-900" :
                        booth.rank === 2 ? "bg-zinc-300 text-zinc-700" :
                        booth.rank === 3 ? "bg-orange-400 text-orange-900" :
                        "bg-zinc-700 text-zinc-300"
                      }`}>
                        {booth.rank}
                      </span>

                      {/* Booth Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-white truncate">{booth.booth_name}</p>
                        <p className="text-sm text-zinc-500 truncate">{booth.owner_name || "Unknown"}</p>
                      </div>

                      {/* Revenue */}
                      <div className="text-right">
                        <p className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(booth.revenue)}</p>
                        {booth.revenue_change !== null && (
                          <p className={`text-xs ${booth.revenue_change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {booth.revenue_change >= 0 ? "+" : ""}{booth.revenue_change}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Revenue by Plan */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Revenue by Plan</h2>
            <a href="/admin/subscriptions" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              View Billing →
            </a>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] p-5">
            {data.revenue_by_plan.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">
                No subscription data available yet.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {data.revenue_by_plan.map((plan) => {
                    const percentage = totalPlanMrr > 0 ? (plan.mrr / totalPlanMrr) * 100 : 0;
                    const colorClass = getPlanColor(plan.plan_name);
                    return (
                      <div key={plan.plan_name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                            <span className="font-medium text-zinc-900 dark:text-white">{plan.plan_name}</span>
                            <span className="text-sm text-zinc-500">({plan.subscriber_count})</span>
                          </div>
                          <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(plan.mrr)}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-zinc-500">Total MRR</span>
                  <span className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(totalPlanMrr)}</span>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
