"use client";

/**
 * Booths Management Page
 * 
 * List of all booths with filters, search, and status indicators.
 * Uses demo data matching the mobile app structure.
 * 
 * @see Mobile app - /app/(tabs)/booths.tsx
 */

import { useState, useMemo } from "react";

// Demo booths data
const demoBooths = [
  {
    id: "booth-1",
    name: "Downtown Mall",
    location: "123 Main Street, Suite 101",
    status: "online" as const,
    todayRevenue: 285.50,
    todayTransactions: 14,
    credits: 450,
    lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "booth-2",
    name: "Wedding Venue",
    location: "456 Oak Avenue",
    status: "online" as const,
    todayRevenue: 420.00,
    todayTransactions: 21,
    credits: 325,
    lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: "booth-3",
    name: "Convention Center",
    location: "789 Expo Blvd",
    status: "offline" as const,
    todayRevenue: 0,
    todayTransactions: 0,
    credits: 180,
    lastUpdated: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: "booth-4",
    name: "Beach Resort",
    location: "321 Coastal Highway",
    status: "online" as const,
    todayRevenue: 142.00,
    todayTransactions: 7,
    credits: 520,
    lastUpdated: new Date(Date.now() - 8 * 60000).toISOString(),
  },
];

const demoSummary = {
  total_booths: 4,
  online_count: 3,
  offline_count: 1,
  total_revenue_today: 847.50,
  total_transactions_today: 42,
};

type FilterStatus = "all" | "online" | "offline";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getStatusColor(status: "online" | "offline"): string {
  return status === "online" ? "#10B981" : "#EF4444";
}

export default function BoothsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter booths
  const filteredBooths = useMemo(() => {
    return demoBooths.filter((booth) => {
      // Filter by status
      if (filterStatus !== "all" && booth.status !== filterStatus) {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          booth.name.toLowerCase().includes(query) ||
          booth.location.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [filterStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Booths</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your photo booth locations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Booth
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500 mb-1">Total Booths</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{demoSummary.total_booths}</p>
          <p className="text-sm text-zinc-500 mt-2">{demoSummary.online_count} online</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500 mb-1">Today&apos;s Revenue</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(demoSummary.total_revenue_today)}</p>
          <p className="text-sm text-zinc-500 mt-2">{demoSummary.total_transactions_today} transactions</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm text-zinc-500">Online</p>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{demoSummary.online_count}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="text-sm text-zinc-500">Offline</p>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{demoSummary.offline_count}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
            <svg className="w-6 h-6 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">All Booths</p>
            <p className="text-sm text-zinc-500">{demoSummary.online_count} online · {demoSummary.offline_count} offline</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-[#0891B2] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
          {filteredBooths.map((booth) => (
            <div
              key={booth.id}
              className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                    <svg className="w-6 h-6 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-900 dark:text-white">{booth.name}</p>
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(booth.status) }}
                      />
                    </div>
                    <p className="text-sm text-zinc-500">{booth.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(booth.todayRevenue)}</p>
                    <p className="text-xs text-zinc-500">{booth.todayTransactions} today</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{booth.credits} credits</p>
                  </div>
                  <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>
          ))}

          {filteredBooths.length === 0 && (
            <div className="p-12 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
              <svg className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              </svg>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">No booths match your filters</p>
              <p className="text-sm text-zinc-500 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

