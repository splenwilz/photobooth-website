"use client";

/**
 * Dashboard Overview Page
 * 
 * Main dashboard showing revenue stats, hardware status, and recent alerts.
 * Uses demo data matching the mobile app structure.
 * 
 * @see Mobile app - /app/(tabs)/index.tsx
 */

import { useState } from "react";

// Demo data matching mobile app API structure
const demoStats = {
  today: { amount: 847.50, change: 12.5, transactions: 42 },
  week: { amount: 4235.00, change: 8.2, transactions: 198 },
  month: { amount: 18420.00, change: 15.3, transactions: 876 },
  year: { amount: 142580.00, change: 22.1, transactions: 7842 },
};

const demoPaymentBreakdown = {
  today: { cash: 312.50, card: 535.00 },
  week: { cash: 1450.00, card: 2785.00 },
  month: { cash: 6840.00, card: 11580.00 },
  year: { cash: 52420.00, card: 90160.00 },
};

const demoHardwareSummary = {
  cameras_online: 3,
  cameras_total: 4,
  printers_online: 3,
  printers_total: 4,
  low_paper_count: 1,
  low_ink_count: 0,
};

const demoAlerts = [
  {
    id: "1",
    title: "Low Paper Warning",
    message: "Booth 'Downtown Mall' has less than 50 sheets remaining",
    severity: "warning" as const,
    boothName: "Downtown Mall",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: "2",
    title: "High Revenue Alert",
    message: "Today's revenue exceeded $800 - great performance!",
    severity: "info" as const,
    boothName: "All Booths",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: "3",
    title: "Booth Offline",
    message: "Convention Center booth went offline 2 hours ago",
    severity: "critical" as const,
    boothName: "Convention Center",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    isRead: true,
  },
];

type RevenuePeriod = "today" | "week" | "month" | "year";

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

  const stats = demoStats[selectedPeriod];
  const payment = demoPaymentBreakdown[selectedPeriod];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Overview of your photo booth business</p>
      </div>

      {/* Revenue Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Revenue Overview</h2>
            <p className="text-sm text-zinc-500">4 booths total</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <p className="text-sm text-zinc-500 mb-1">Revenue</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(stats.amount)}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${stats.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.change >= 0 ? "+" : ""}{stats.change}%
              </span>
              <span className="text-xs text-zinc-500">vs last period</span>
            </div>
          </div>

          {/* Transactions Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <p className="text-sm text-zinc-500 mb-1">Transactions</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.transactions.toLocaleString()}</p>
            <p className="text-sm text-zinc-500 mt-2">
              Avg: {formatCurrency(stats.amount / stats.transactions)}
            </p>
          </div>

          {/* Cash Revenue */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Cash</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(payment.cash)}</p>
          </div>

          {/* Card Revenue */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-[#0891B2]/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Card</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(payment.card)}</p>
          </div>
        </div>
      </section>

      {/* Hardware Status & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Hardware Overview</h2>
              <p className="text-sm text-zinc-500">4 booths</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
            {/* Cameras */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0891B2]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    </svg>
                  </div>
                  <span className="font-medium text-zinc-900 dark:text-white">Cameras</span>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {demoHardwareSummary.cameras_online}/{demoHardwareSummary.cameras_total} online
                </span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0891B2] rounded-full transition-all"
                  style={{ width: `${(demoHardwareSummary.cameras_online / demoHardwareSummary.cameras_total) * 100}%` }}
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
                  {demoHardwareSummary.printers_online}/{demoHardwareSummary.printers_total} online
                </span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(demoHardwareSummary.printers_online / demoHardwareSummary.printers_total) * 100}%` }}
                />
              </div>
            </div>

            {/* Supplies Alerts */}
            <div className="flex gap-4 pt-2 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${demoHardwareSummary.low_paper_count > 0 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {demoHardwareSummary.low_paper_count} low paper
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${demoHardwareSummary.low_ink_count > 0 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {demoHardwareSummary.low_ink_count} low ink
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Alerts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Alerts</h2>
              <p className="text-sm text-zinc-500">{demoAlerts.filter(a => !a.isRead).length} unread</p>
            </div>
            <a href="/dashboard/alerts" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              View All →
            </a>
          </div>

          <div className="space-y-3">
            {demoAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl bg-white dark:bg-[#111111] border transition-all cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 ${
                  alert.isRead ? 'border-slate-200 dark:border-zinc-800 opacity-60' : 'border-slate-300 dark:border-zinc-700'
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
                    <p className="text-xs text-zinc-500 mt-1">{alert.boothName}</p>
                  </div>
                  {!alert.isRead && (
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getSeverityColor(alert.severity) }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

