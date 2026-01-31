"use client";

/**
 * Admin Billing Dashboard
 *
 * Overview of platform revenue, payment health, and recent transactions.
 */

import { useState } from "react";
import {
  useAdminBillingOverview,
  useAdminBillingTransactions,
  useAdminBillingIssues,
  type AdminTransactionsQueryParams,
} from "@/core/api/admin/billing";

function formatCurrency(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusConfig(status: string) {
  switch (status) {
    case "paid":
      return { label: "Paid", bg: "bg-green-500/20", text: "text-green-600 dark:text-green-400" };
    case "open":
      return { label: "Open", bg: "bg-yellow-500/20", text: "text-yellow-600 dark:text-yellow-400" };
    case "void":
      return { label: "Void", bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
    case "uncollectible":
      return { label: "Failed", bg: "bg-red-500/20", text: "text-red-600 dark:text-red-400" };
    default:
      return { label: status, bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPlanColor(tier: string): string {
  const lowerTier = tier.toLowerCase();
  if (lowerTier.includes("enterprise")) return "bg-[#0891B2]";
  if (lowerTier.includes("pro")) return "bg-blue-500";
  return "bg-zinc-400";
}

type TabType = "overview" | "transactions" | "issues";

export default function AdminBillingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsStatus, setTransactionsStatus] = useState<AdminTransactionsQueryParams["status"]>("all");

  // Fetch data
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useAdminBillingOverview();
  const { data: transactionsData, isLoading: transactionsLoading } = useAdminBillingTransactions({
    page: transactionsPage,
    per_page: 20,
    status: transactionsStatus,
  });
  const { data: issuesData, isLoading: issuesLoading } = useAdminBillingIssues();

  const issuesCount = issuesData?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Billing</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Revenue metrics, payments, and billing health
          </p>
        </div>
        <a
          href="https://dashboard.stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
          </svg>
          Open Stripe
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl w-fit">
        {[
          { id: "overview", label: "Overview" },
          { id: "transactions", label: "Transactions" },
          { id: "issues", label: "Issues", count: issuesCount },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-[#0891B2] text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-red-500/20 text-red-600 dark:text-red-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Error State */}
          {overviewError && (
            <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
              <p className="text-red-600 dark:text-red-400">Failed to load billing data. Please try again.</p>
            </div>
          )}

          {/* Revenue Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400">
                Monthly Recurring Revenue
              </p>
              <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">
                {overviewLoading ? "—" : formatCurrency(overview?.summary.mrr ?? 0)}
              </p>
              {overview && overview.summary.mrr_change_percent !== 0 && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${
                  overview.summary.mrr_change_percent > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                  <svg className={`w-3 h-3 ${overview.summary.mrr_change_percent < 0 ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {Math.abs(overview.summary.mrr_change_percent)}% from last month
                </p>
              )}
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500">Annual Recurring Revenue</p>
              <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">
                {overviewLoading ? "—" : formatCurrency(overview?.summary.arr ?? 0)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Projected yearly</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500">Active Subscriptions</p>
              <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">
                {overviewLoading ? "—" : overview?.summary.active_subscriptions ?? 0}
              </p>
              {overview && overview.summary.trialing_subscriptions > 0 && (
                <p className="text-xs text-zinc-500 mt-1">
                  +{overview.summary.trialing_subscriptions} in trial
                </p>
              )}
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500">Churn Rate</p>
              <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">
                {overviewLoading ? "—" : `${overview?.summary.churn_rate ?? 0}%`}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Monthly average</p>
            </div>
          </div>

          {/* Payment Health & Plan Distribution */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Payment Health */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                Payment Health (Last {overview?.payment_health.period_days ?? 30} Days)
              </h3>
              {overviewLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        <div>
                          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
                          <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mt-1" />
                        </div>
                      </div>
                      <div className="h-6 w-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Successful</p>
                        <p className="text-sm text-zinc-500">{overview?.payment_health.success_rate ?? 0}% success rate</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{overview?.payment_health.successful ?? 0}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Failed</p>
                        <p className="text-sm text-zinc-500">Needs attention</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{overview?.payment_health.failed ?? 0}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Pending</p>
                        <p className="text-sm text-zinc-500">Processing</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{overview?.payment_health.pending ?? 0}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Recovered</p>
                        <p className="text-sm text-zinc-500">Auto-retried</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{overview?.payment_health.recovered ?? 0}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Plan Distribution */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                Revenue by Plan
              </h3>
              {overviewLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
                        <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                      </div>
                      <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {overview?.revenue_by_plan.map((plan) => {
                    const totalRevenue = overview.total_mrr || overview.revenue_by_plan.reduce((sum, p) => sum + p.mrr, 0);
                    const percentage = totalRevenue > 0 ? Math.round((plan.mrr / totalRevenue) * 100) : 0;
                    const planColor = getPlanColor(plan.tier);
                    return (
                      <div key={plan.tier}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${planColor}`} />
                            <span className="font-medium text-zinc-900 dark:text-white">{plan.tier}</span>
                            <span className="text-sm text-zinc-500">({plan.count})</span>
                          </div>
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {formatCurrency(plan.mrr)}/mo
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${planColor} rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-500">Total MRR</span>
                      <span className="text-xl font-bold text-zinc-900 dark:text-white">
                        {formatCurrency(overview?.total_mrr ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions Preview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-900 dark:text-white">Recent Transactions</h3>
              <button
                type="button"
                onClick={() => setActiveTab("transactions")}
                className="text-sm text-[#0891B2] hover:underline"
              >
                View all
              </button>
            </div>
            {transactionsLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                      <div>
                        <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-700 rounded" />
                        <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mt-1" />
                      </div>
                    </div>
                    <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {transactionsData?.transactions.slice(0, 5).map((tx) => {
                  const statusConfig = getStatusConfig(tx.status);
                  return (
                    <div key={tx.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-xs text-white">
                          {getInitials(tx.customer_name)}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{tx.customer_name}</p>
                          <p className="text-sm text-zinc-500">{formatDate(tx.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                        <span className="font-medium text-zinc-900 dark:text-white">{formatCurrency(tx.amount, tx.currency)}</span>
                      </div>
                    </div>
                  );
                })}
                {transactionsData?.transactions.length === 0 && (
                  <p className="text-zinc-500 text-center py-4">No transactions yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl w-fit">
            {(["all", "paid", "pending", "failed"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setTransactionsStatus(status);
                  setTransactionsPage(1);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                  transactionsStatus === status
                    ? "bg-[#0891B2] text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            {transactionsLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
                      <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mt-1" />
                    </div>
                    <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-zinc-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsData?.transactions.map((tx) => {
                      const statusConfig = getStatusConfig(tx.status);
                      return (
                        <tr key={tx.id} className="border-b border-[var(--border)] last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-xs text-white">
                                {getInitials(tx.customer_name)}
                              </div>
                              <div>
                                <p className="font-medium text-zinc-900 dark:text-white">{tx.customer_name}</p>
                                <p className="text-sm text-zinc-500">{tx.customer_email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-zinc-600 dark:text-zinc-400">{formatDate(tx.created_at)}</td>
                          <td className="py-4 px-4">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-medium text-zinc-900 dark:text-white">
                            {formatCurrency(tx.amount, tx.currency)}
                          </td>
                        </tr>
                      );
                    })}
                    {transactionsData?.transactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-zinc-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {transactionsData && transactionsData.total_pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-sm text-zinc-500">
                  Page {transactionsData.page} of {transactionsData.total_pages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTransactionsPage((p) => Math.max(1, p - 1))}
                    disabled={transactionsPage === 1}
                    className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionsPage((p) => Math.min(transactionsData.total_pages, p + 1))}
                    disabled={transactionsPage >= transactionsData.total_pages}
                    className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Issues Tab */}
      {activeTab === "issues" && (
        <div className="space-y-4">
          {issuesLoading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
                      <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mt-2" />
                    </div>
                    <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : issuesData?.issues.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-zinc-900 dark:text-white font-medium">All clear!</p>
              <p className="text-zinc-500 mt-1">No billing issues need attention</p>
            </div>
          ) : (
            <div className="space-y-3">
              {issuesData?.issues.map((issue) => {
                const statusLabel = issue.status === "uncollectible" ? "Payment failed" : "Payment pending";
                return (
                  <div key={issue.id} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-zinc-900 dark:text-white">{issue.customer_name}</p>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
                              {statusLabel}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-500">{issue.customer_email}</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {issue.attempt_count > 0 && `${issue.attempt_count} retry attempt${issue.attempt_count > 1 ? "s" : ""} • `}
                            Created {formatDate(issue.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-zinc-900 dark:text-white">{formatCurrency(issue.amount, issue.currency)}</p>
                        <a
                          href={`https://dashboard.stripe.com/invoices/${issue.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors"
                        >
                          View in Stripe
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
