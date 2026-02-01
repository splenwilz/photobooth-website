"use client";

/**
 * Admin All Booths Page
 *
 * Platform-wide booth monitoring with rich visuals.
 */

import { useState, useEffect } from "react";
import {
  useAdminBooths,
  exportBoothsCsv,
  type AdminBoothListItem,
  type AdminBoothStatus,
  type StatusIconValue,
} from "@/core/api/admin/booths";

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

type FilterStatus = "all" | AdminBoothStatus;
type ViewMode = "grid" | "list";

// Loading skeleton component
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`} />
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getStatusConfig(status: string) {
  switch (status) {
    case "online": return { color: "#10B981", bg: "bg-green-500/20", text: "text-green-400", label: "Online" };
    case "offline": return { color: "#EF4444", bg: "bg-red-500/20", text: "text-red-400", label: "Offline" };
    case "warning": return { color: "#F59E0B", bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Warning" };
    default: return { color: "#6B7280", bg: "bg-zinc-700", text: "text-zinc-400", label: "Unknown" };
  }
}

function getSupplyColor(level: number | null) {
  if (level === null) return "bg-zinc-500";
  if (level >= 60) return "bg-green-500";
  if (level >= 30) return "bg-yellow-500";
  return "bg-red-500";
}

function getStatusIconConfig(value: StatusIconValue) {
  switch (value) {
    case "ok": return { ok: true, color: "bg-green-500/20", icon: "text-green-500" };
    case "warning": return { ok: true, color: "bg-yellow-500/20", icon: "text-yellow-500" };
    case "error": return { ok: false, color: "bg-red-500/20", icon: "text-red-500" };
    default: return { ok: false, color: "bg-zinc-500/20", icon: "text-zinc-500" };
  }
}

export default function AdminBoothsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, error, refetch, isFetching } = useAdminBooths({
    page,
    per_page: 20,
    status: filterStatus,
    search: debouncedSearch || undefined,
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportBoothsCsv({
        status: filterStatus,
        search: debouncedSearch || undefined,
      });
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Extract data
  const summary = data?.summary;
  const topBooths = data?.top_performing || [];
  const booths = data?.booths || [];
  const totalPages = data?.total_pages || 1;
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">All Booths</h1>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-400">Live Monitoring</span>
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Platform-wide booth monitoring and management</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
            title="Refresh data"
          >
            <svg className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
                <Skeleton className="w-12 h-8 mb-1" />
                <Skeleton className="w-20 h-4" />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{summary?.total_booths ?? 0}</p>
              <p className="text-sm text-zinc-500">Total Booths</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{summary?.online ?? 0}</p>
              </div>
              <p className="text-sm text-zinc-500">Online</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{summary?.offline ?? 0}</p>
              </div>
              <p className="text-sm text-zinc-500">Offline</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{summary?.warning ?? 0}</p>
              </div>
              <p className="text-sm text-zinc-500">Warning</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(summary?.revenue_mtd ?? 0)}</p>
              <p className="text-sm text-zinc-500">Revenue (MTD)</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{summary?.active_alerts ?? 0}</p>
              <p className="text-sm text-zinc-500">Active Alerts</p>
            </div>
          </>
        )}
      </div>

      {/* Top Performers */}
      <section className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Top Performing Booths</h3>
          <span className="text-xs text-zinc-500">This Month</span>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/50">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="w-24 h-4 mb-1" />
                  <Skeleton className="w-16 h-3" />
                </div>
                <div className="text-right">
                  <Skeleton className="w-16 h-5 mb-1" />
                  <Skeleton className="w-10 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : topBooths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topBooths.map((booth) => (
              <div key={booth.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/50">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-slate-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {booth.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-zinc-900 dark:text-white">{booth.name}</p>
                  <p className="text-xs text-zinc-500">{booth.owner_name || "Unknown"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-900 dark:text-white">{formatCurrency(booth.revenue)}</p>
                  {booth.revenue_change_percent !== null && (
                    <span className={`text-xs ${booth.revenue_change_percent >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {booth.revenue_change_percent >= 0 ? "+" : ""}{booth.revenue_change_percent.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-4">No booth data available</p>
        )}
      </section>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search booths by name or address..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
            {(["all", "online", "offline", "warning"] as FilterStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleFilterChange(status)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                  filterStatus === status
                    ? "bg-[#0891B2] text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {status !== "all" && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig(status).color }} />}
                {status}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#0891B2] text-white" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#0891B2] text-white" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load booths. Please try again.</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <div className="flex items-start gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div>
                  <Skeleton className="w-32 h-5 mb-1" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
              <Skeleton className="w-full h-16 rounded-xl mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="w-6 h-6 rounded-lg" />
                <Skeleton className="w-6 h-6 rounded-lg" />
                <Skeleton className="w-6 h-6 rounded-lg" />
              </div>
              <Skeleton className="w-full h-8" />
            </div>
          ))}
        </div>
      )}

      {/* Booths Grid */}
      {!isLoading && !error && (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
          {booths.map((booth) => (
            <BoothCard key={booth.id} booth={booth} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && booths.length === 0 && (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
          <svg className="w-12 h-12 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          </svg>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">No booths found</p>
          <p className="text-zinc-500 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && booths.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing {booths.length} of {total} booths
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Booth Card Component
function BoothCard({ booth, viewMode }: { booth: AdminBoothListItem; viewMode: ViewMode }) {
  const statusConfig = getStatusConfig(booth.status);
  const cameraStatus = getStatusIconConfig(booth.status_icons.camera);
  const paymentStatus = getStatusIconConfig(booth.status_icons.payment);
  const printerStatus = getStatusIconConfig(booth.status_icons.printer);

  if (viewMode === "list") {
    return (
      <div className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#111111]" style={{ backgroundColor: statusConfig.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate text-zinc-900 dark:text-white">{booth.name}</p>
              {booth.alert_count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
                  {booth.alert_count}
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                {statusConfig.label}
              </span>
            </div>
            <p className="text-sm text-zinc-500">{booth.owner_name || "Unknown"} · {booth.address || "No address"}</p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${cameraStatus.color}`} title="Camera">
              <svg className={`w-3.5 h-3.5 ${cameraStatus.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              </svg>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${printerStatus.color}`} title="Printer">
              <svg className={`w-3.5 h-3.5 ${printerStatus.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
              </svg>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${paymentStatus.color}`} title="Payment">
              <svg className={`w-3.5 h-3.5 ${paymentStatus.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="font-bold text-zinc-900 dark:text-white">{formatCurrency(booth.revenue_mtd)}</p>
            {booth.revenue_change_percent !== null && (
              <div className={`flex items-center justify-end gap-1 ${booth.revenue_change_percent >= 0 ? "text-green-500" : "text-red-500"}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={booth.revenue_change_percent >= 0 ? "M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" : "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"} />
                </svg>
                <span className="text-xs font-medium">{Math.abs(booth.revenue_change_percent).toFixed(1)}%</span>
              </div>
            )}
          </div>

          <span className="text-xs text-zinc-500 shrink-0 hidden sm:block">{booth.last_heartbeat_ago || "Never"}</span>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#111111]" style={{ backgroundColor: statusConfig.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-zinc-900 dark:text-white">{booth.name}</p>
              {booth.alert_count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
                  {booth.alert_count}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500">{booth.owner_name || "Unknown"}</p>
          </div>
        </div>
      </div>

      {/* Revenue & Growth */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/50">
        <div>
          <p className="text-xs text-zinc-500">Revenue (MTD)</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white">{formatCurrency(booth.revenue_mtd)}</p>
        </div>
        {booth.revenue_change_percent !== null && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${booth.revenue_change_percent >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d={booth.revenue_change_percent >= 0 ? "M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" : "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"} />
            </svg>
            <span className="text-xs font-medium">{Math.abs(booth.revenue_change_percent).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Hardware Status */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${cameraStatus.color}`} title="Camera">
          <svg className={`w-3.5 h-3.5 ${cameraStatus.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          </svg>
        </div>
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${printerStatus.color}`} title="Printer">
          <svg className={`w-3.5 h-3.5 ${printerStatus.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
        </div>
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${paymentStatus.color}`} title="Payment">
          <svg className={`w-3.5 h-3.5 ${paymentStatus.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-zinc-500">{booth.address || "No address"}</span>
      </div>

      {/* Supplies */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 w-12">Paper</span>
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getSupplyColor(booth.paper_percent)}`} style={{ width: `${booth.paper_percent ?? 0}%` }} />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 w-8">{booth.paper_percent ?? 0}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 w-12">Ink</span>
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getSupplyColor(booth.ink_percent)}`} style={{ width: `${booth.ink_percent ?? 0}%` }} />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 w-8">{booth.ink_percent ?? 0}%</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
          {statusConfig.label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">{booth.last_heartbeat_ago || "Never"}</span>
          <button type="button" className="text-[#0891B2] hover:text-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
