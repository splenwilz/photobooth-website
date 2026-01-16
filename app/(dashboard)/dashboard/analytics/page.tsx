"use client";

/**
 * Analytics Page
 * 
 * Revenue charts, breakdowns, and transaction history.
 * Uses demo data matching the mobile app structure.
 * 
 * @see Mobile app - /app/(tabs)/analytics.tsx
 */

import { useState } from "react";

// Demo data
const demoStats = {
  today: { amount: 847.50, change: 12.5 },
  week: { amount: 4235.00, change: 8.2 },
  month: { amount: 18420.00, change: 15.3 },
  year: { amount: 142580.00, change: 22.1 },
};

const demoDailyChart = [
  { label: "Mon", amount: 580 },
  { label: "Tue", amount: 720 },
  { label: "Wed", amount: 450 },
  { label: "Thu", amount: 890 },
  { label: "Fri", amount: 1120 },
  { label: "Sat", amount: 980 },
  { label: "Sun", amount: 495 },
];

const demoMonthlyChart = [
  { label: "Jan", amount: 12500 },
  { label: "Feb", amount: 14200 },
  { label: "Mar", amount: 11800 },
  { label: "Apr", amount: 15600 },
  { label: "May", amount: 16400 },
  { label: "Jun", amount: 18200 },
  { label: "Jul", amount: 17800 },
  { label: "Aug", amount: 19500 },
  { label: "Sep", amount: 18900 },
  { label: "Oct", amount: 20100 },
  { label: "Nov", amount: 21500 },
  { label: "Dec", amount: 18420 },
];

const demoByProduct = [
  { category: "photo_strips", amount: 8540, percentage: 46 },
  { category: "photo_4x6", amount: 6230, percentage: 34 },
  { category: "smartphone", amount: 3650, percentage: 20 },
];

const demoByPayment = [
  { category: "card", amount: 11580, percentage: 63 },
  { category: "cash", amount: 6840, percentage: 37 },
];

const demoTransactions = [
  {
    id: "txn-1",
    product: "photo_strips",
    amount: 5.00,
    payment_method: "card",
    booth_name: "Downtown Mall",
    template: "Classic Strip",
    print_status: "completed" as const,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "txn-2",
    product: "photo_4x6",
    amount: 8.00,
    payment_method: "cash",
    booth_name: "Wedding Venue",
    template: "Elegant Frame",
    print_status: "completed" as const,
    timestamp: new Date(Date.now() - 32 * 60000).toISOString(),
  },
  {
    id: "txn-3",
    product: "photo_strips",
    amount: 5.00,
    payment_method: "card",
    booth_name: "Beach Resort",
    template: "Summer Vibes",
    print_status: "pending" as const,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "txn-4",
    product: "smartphone",
    amount: 3.00,
    payment_method: "card",
    booth_name: "Downtown Mall",
    template: "N/A",
    print_status: "completed" as const,
    timestamp: new Date(Date.now() - 58 * 60000).toISOString(),
  },
  {
    id: "txn-5",
    product: "photo_strips",
    amount: 5.00,
    payment_method: "cash",
    booth_name: "Wedding Venue",
    template: "Classic Strip",
    print_status: "failed" as const,
    timestamp: new Date(Date.now() - 72 * 60000).toISOString(),
  },
];

type ChartPeriod = "week" | "month";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatProductName(product: string): string {
  const names: Record<string, string> = {
    photo_strips: "Photo Strips",
    photo_4x6: "4×6 Photo",
    smartphone: "Smartphone Print",
  };
  return names[product] || product;
}

function formatPaymentMethod(method: string): string {
  return method.charAt(0).toUpperCase() + method.slice(1);
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getPrintStatusConfig(status: "completed" | "pending" | "failed") {
  switch (status) {
    case "completed": return { label: "Printed", color: "#10B981" };
    case "pending": return { label: "Pending", color: "#F59E0B" };
    case "failed": return { label: "Failed", color: "#EF4444" };
  }
}

export default function AnalyticsPage() {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("week");

  const chartData = chartPeriod === "week" ? demoDailyChart : demoMonthlyChart;
  const maxChartValue = Math.max(...chartData.map(d => d.amount)) * 1.1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Revenue insights and transaction history</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(["today", "week", "month", "year"] as const).map((period) => (
          <div key={period} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <p className="text-sm text-zinc-500 mb-1 capitalize">{period === "today" ? "Today" : `This ${period}`}</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(demoStats[period].amount)}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${demoStats[period].change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {demoStats[period].change >= 0 ? "+" : ""}{demoStats[period].change}%
              </span>
              <span className="text-xs text-zinc-500">vs last {period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{chartPeriod === "week" ? "Daily Revenue" : "Monthly Revenue"}</h2>
            <p className="text-sm text-zinc-500">{chartPeriod === "week" ? "Last 7 days" : "Last 12 months"}</p>
          </div>
          <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-lg">
            <button
              onClick={() => setChartPeriod("week")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                chartPeriod === "week" ? "bg-[#0891B2] text-white" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setChartPeriod("month")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                chartPeriod === "month" ? "bg-[#0891B2] text-white" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-end gap-2 h-48">
            {chartData.map((item, i) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[#0891B2] rounded-t-md transition-all hover:bg-[#22D3EE]"
                  style={{ height: `${(item.amount / maxChartValue) * 100}%` }}
                  title={formatCurrency(item.amount)}
                />
                <span className="text-xs text-zinc-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakdowns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Product */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Revenue by Product</h2>
            <p className="text-sm text-zinc-500">This month&apos;s breakdown</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
            {demoByProduct.map((item, i) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-zinc-900 dark:text-white">{formatProductName(item.category)}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: `rgba(8, 145, 178, ${1 - i * 0.2})`,
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">{item.percentage}% of total</p>
              </div>
            ))}
          </div>
        </section>

        {/* By Payment */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Payment Methods</h2>
            <p className="text-sm text-zinc-500">Revenue by payment type</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
            {demoByPayment.map((item, i) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: item.category === "card" ? "rgba(8, 145, 178, 0.2)" : "rgba(16, 185, 129, 0.2)" }}
                    >
                      {item.category === "card" ? (
                        <svg className="w-3.5 h-3.5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-white">{formatPaymentMethod(item.category)}</span>
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.category === "card" ? "#0891B2" : "#10B981",
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">{item.percentage}% of total</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Transactions</h2>
            <p className="text-sm text-zinc-500">Latest sales activity</p>
          </div>
          <button className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
            View All →
          </button>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 bg-slate-50 dark:bg-zinc-900/50 text-sm text-zinc-500 font-medium">
            <span>Product</span>
            <span>Booth</span>
            <span>Amount</span>
            <span>Payment</span>
            <span>Status</span>
            <span>Time</span>
          </div>

          {/* Transactions */}
          <div className="divide-y divide-slate-200 dark:divide-zinc-800">
            {demoTransactions.map((txn) => {
              const statusConfig = getPrintStatusConfig(txn.print_status);
              return (
                <div key={txn.id} className="px-5 py-4">
                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{formatProductName(txn.product)}</p>
                      <p className="text-xs text-zinc-500">{txn.template}</p>
                    </div>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{txn.booth_name}</span>
                    <span className="font-semibold text-[#0891B2]">{formatCurrency(txn.amount)}</span>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full w-fit"
                      style={{ backgroundColor: `${txn.payment_method === "card" ? "#0891B2" : "#10B981"}20`, color: txn.payment_method === "card" ? "#0891B2" : "#10B981" }}
                    >
                      {formatPaymentMethod(txn.payment_method)}
                    </span>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full w-fit"
                      style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
                    >
                      {statusConfig.label}
                    </span>
                    <span className="text-sm text-zinc-500">{formatTime(txn.timestamp)}</span>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{formatProductName(txn.product)}</p>
                        <p className="text-xs text-zinc-500">{txn.booth_name}</p>
                      </div>
                      <p className="font-semibold text-[#0891B2]">{formatCurrency(txn.amount)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${txn.payment_method === "card" ? "#0891B2" : "#10B981"}20`, color: txn.payment_method === "card" ? "#0891B2" : "#10B981" }}
                      >
                        {formatPaymentMethod(txn.payment_method)}
                      </span>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
                      >
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-zinc-500 ml-auto">{formatTime(txn.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
