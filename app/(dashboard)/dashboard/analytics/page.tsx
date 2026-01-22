"use client";

/**
 * Analytics Page
 *
 * Revenue charts, breakdowns, and transaction history.
 * Shows aggregated data when "All Booths" selected, or booth-specific data
 * when a particular booth is selected.
 *
 * @see GET /api/v1/analytics/revenue/dashboard (all booths)
 * @see GET /api/v1/analytics/revenue/{booth_id} (single booth)
 */

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRevenueDashboard, useBoothRevenue } from "@/core/api/analytics";

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
    PhotoStrips: "Photo Strips",
    photo_4x6: "4x6 Photo",
    Photo4x6: "4x6 Photo",
    smartphone: "Smartphone Print",
    SmartphonePrint: "Smartphone Print",
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

function formatChartLabel(dateStr: string, period: ChartPeriod): string {
  // Handle various date formats from API
  // Could be "2024-01-15", "2024-01", "Jan", "Mon", etc.
  const date = new Date(dateStr);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    // If invalid, try to return a short version of the string
    // or the string itself if it's already short (like "Mon" or "Jan")
    if (dateStr.length <= 5) return dateStr;
    // Try to extract just the day or month part
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (period === "week" && parts.length >= 3) {
        return parts[2]; // Return day number
      }
      if (period === "month" && parts.length >= 2) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = parseInt(parts[1], 10) - 1;
        return monthNames[monthIndex] || parts[1];
      }
    }
    return dateStr.slice(0, 3); // Fallback: first 3 chars
  }

  if (period === "week") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short" });
}

function getPrintStatusConfig(status: "completed" | "pending" | "failed") {
  switch (status) {
    case "completed": return { label: "Printed", color: "#10B981" };
    case "pending": return { label: "Pending", color: "#F59E0B" };
    case "failed": return { label: "Failed", color: "#EF4444" };
  }
}

function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`} style={style} />;
}

export default function AnalyticsPage() {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("week");
  const searchParams = useSearchParams();

  // Get booth ID from URL search params (null = all booths)
  const selectedBoothId = searchParams.get("booth");
  const isAllBooths = !selectedBoothId;

  // Use appropriate hook based on selection
  const dashboardQuery = useRevenueDashboard({ recent_limit: 10 }, { enabled: isAllBooths });
  const boothQuery = useBoothRevenue(selectedBoothId, { recent_limit: 10 });

  // Select the active query
  const isLoading = isAllBooths ? dashboardQuery.isLoading : boothQuery.isLoading;
  const error = isAllBooths ? dashboardQuery.error : boothQuery.error;
  const data = isAllBooths ? dashboardQuery.data : boothQuery.data;

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-5 w-64 mt-2 rounded-lg" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["today", "week", "month", "year"].map((key) => (
            <div key={key} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-8 w-28 mt-2 rounded" />
              <Skeleton className="h-4 w-32 mt-3 rounded" />
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-4 w-20 mt-1 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-end gap-1 h-44">
              {["d1", "d2", "d3", "d4", "d5", "d6", "d7"].map((key) => (
                <div key={key} className="flex-1 flex flex-col items-center justify-end h-full">
                  <Skeleton className="w-full max-w-8 rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }} />
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-2">
              {["d1", "d2", "d3", "d4", "d5", "d6", "d7"].map((key) => (
                <div key={key} className="flex-1 text-center">
                  <Skeleton className="h-3 w-8 mx-auto rounded" />
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
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-32 mt-1 rounded-lg" />
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
              {["product-1", "product-2", "product-3"].map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-5 w-28 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-3 w-20 mt-1 rounded" />
                </div>
              ))}
            </div>
          </section>

          {/* By Payment */}
          <section>
            <div className="mb-4">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-4 w-40 mt-1 rounded-lg" />
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
              {["cash", "card"].map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded" />
                    </div>
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-3 w-20 mt-1 rounded" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-32 mt-1 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] overflow-hidden">
            <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 bg-slate-50 dark:bg-zinc-900/50">
              {["product", "booth", "amount", "payment", "status", "time"].map((key) => (
                <Skeleton key={key} className="h-4 w-16 rounded" />
              ))}
            </div>
            <div className="divide-y divide-slate-200 dark:divide-zinc-800">
              {["txn-1", "txn-2", "txn-3"].map((key) => (
                <div key={key} className="px-5 py-4">
                  <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                    <div>
                      <Skeleton className="h-5 w-24 rounded" />
                      <Skeleton className="h-3 w-20 mt-1 rounded" />
                    </div>
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Revenue insights and transaction history</p>
        </div>
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-500 font-medium">Failed to load analytics</p>
          <p className="text-sm text-zinc-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const byProduct = data?.by_product ?? [];
  const byPayment = data?.by_payment ?? [];
  const dailyChart = data?.daily_chart ?? [];
  const monthlyChart = data?.monthly_chart ?? [];
  const transactions = data?.recent_transactions?.data ?? [];

  const chartData = chartPeriod === "week" ? dailyChart : monthlyChart;
  const maxChartValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.amount)) * 1.1 : 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {isAllBooths ? "Analytics" : `${boothQuery.data?.booth_name ?? "Booth"} Analytics`}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          {isAllBooths
            ? "Revenue insights and transaction history"
            : "Booth-specific revenue insights"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(["today", "week", "month", "year"] as const).map((period) => {
          const periodStats = stats?.[period];
          return (
            <div key={period} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500 mb-1 capitalize">{period === "today" ? "Today" : `This ${period}`}</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(periodStats?.amount ?? 0)}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-sm font-medium ${(periodStats?.change ?? 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {(periodStats?.change ?? 0) >= 0 ? "+" : ""}{periodStats?.change ?? 0}%
                </span>
                <span className="text-xs text-zinc-500">vs last {period}</span>
              </div>
            </div>
          );
        })}
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
          {chartData.length > 0 ? (
            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-right pr-2">
                {[100, 75, 50, 25, 0].map((percent) => (
                  <span key={percent} className="text-[10px] text-zinc-400 leading-none">
                    {formatCurrency((maxChartValue * percent) / 100)}
                  </span>
                ))}
              </div>

              {/* Chart area */}
              <div className="ml-14">
                {/* Grid lines */}
                <div className="absolute left-14 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-dashed border-zinc-200 dark:border-zinc-800" />
                  ))}
                </div>

                {/* Bars */}
                <div className="relative flex items-end gap-1 h-44">
                  {chartData.map((item) => {
                    const barHeight = maxChartValue > 0 ? (item.amount / maxChartValue) * 100 : 0;
                    const heightPx = (barHeight / 100) * 176; // 176px = h-44
                    return (
                      <div key={item.date} className="flex-1 flex flex-col items-center group relative h-full">
                        {/* Tooltip */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          {formatCurrency(item.amount)}
                        </div>
                        {/* Bar container - takes full height, bar aligned to bottom */}
                        <div className="w-full h-full flex items-end justify-center px-0.5">
                          <div
                            className={`w-full max-w-8 rounded-t transition-all cursor-pointer ${
                              item.amount > 0
                                ? "bg-[#0891B2] hover:bg-[#22D3EE]"
                                : "bg-zinc-200 dark:bg-zinc-700"
                            }`}
                            style={{
                              height: item.amount > 0 ? `${Math.max(heightPx, 4)}px` : "2px",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels */}
                <div className="flex gap-1 mt-2">
                  {chartData.map((item) => (
                    <div key={item.date} className="flex-1 text-center">
                      <span className="text-xs text-zinc-500">{formatChartLabel(item.date, chartPeriod)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-zinc-500">
              No data available
            </div>
          )}
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
            {byProduct.length > 0 ? (
              byProduct.map((item, i) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-zinc-900 dark:text-white">{formatProductName(item.name)}</span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{formatCurrency(item.value)}</span>
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
              ))
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">No product data</p>
            )}
          </div>
        </section>

        {/* By Payment */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Payment Methods</h2>
            <p className="text-sm text-zinc-500">Revenue by payment type</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
            {byPayment.length > 0 ? (
              byPayment.map((item) => {
                const isCard = item.name.toLowerCase() === "card";
                const isCash = item.name.toLowerCase() === "cash";
                const color = isCard ? "#0891B2" : isCash ? "#10B981" : "#F59E0B";
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          {isCard ? (
                            <svg className="w-3.5 h-3.5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-zinc-900 dark:text-white">{formatPaymentMethod(item.name)}</span>
                      </div>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{item.percentage}% of total</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">No payment data</p>
            )}
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
            View All
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
            {transactions.length > 0 ? (
              transactions.map((txn) => {
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
              })
            ) : (
              <div className="px-5 py-12 text-center">
                <p className="text-zinc-500">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
