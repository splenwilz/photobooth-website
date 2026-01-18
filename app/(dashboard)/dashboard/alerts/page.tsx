"use client";

/**
 * Alerts Page
 *
 * Notification center with severity and category filters.
 * Uses real API data from useAlerts hook.
 *
 * @see GET /api/v1/analytics/alerts
 */

import { useState, useMemo } from "react";
import { useAlerts } from "@/core/api/alerts";
import type { AlertSeverity, AlertCategory } from "@/core/api/alerts/types";

type FilterSeverity = "all" | AlertSeverity;
type FilterCategory = "all" | AlertCategory;

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

function getSeverityConfig(severity: AlertSeverity) {
  switch (severity) {
    case "critical": return { color: "#EF4444", label: "Critical" };
    case "warning": return { color: "#F59E0B", label: "Warning" };
    case "info": return { color: "#0891B2", label: "Info" };
  }
}

function formatCategory(category: string): string {
  const labels: Record<string, string> = {
    hardware: "Hardware",
    supplies: "Supplies",
    network: "Network",
    revenue: "Revenue",
  };
  return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export default function AlertsPage() {
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const { data, isLoading, error } = useAlerts({ limit: 100 });

  const alerts = data?.alerts ?? [];

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (filterSeverity !== "all" && alert.severity !== filterSeverity) return false;
      if (filterCategory !== "all" && alert.category !== filterCategory) return false;
      return true;
    });
  }, [alerts, filterSeverity, filterCategory]);

  // Count unread by severity
  const unreadCounts = useMemo(() => ({
    critical: alerts.filter(a => a.severity === "critical" && !a.isRead).length,
    warning: alerts.filter(a => a.severity === "warning" && !a.isRead).length,
    info: alerts.filter(a => a.severity === "info" && !a.isRead).length,
    total: alerts.filter(a => !a.isRead).length,
  }), [alerts]);

  const severityFilters: { value: FilterSeverity; label: string; color?: string }[] = [
    { value: "all", label: "All" },
    { value: "critical", label: "Critical", color: "#EF4444" },
    { value: "warning", label: "Warning", color: "#F59E0B" },
    { value: "info", label: "Info", color: "#0891B2" },
  ];

  const categoryFilters: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "All" },
    { value: "hardware", label: "Hardware" },
    { value: "supplies", label: "Supplies" },
    { value: "network", label: "Network" },
    { value: "revenue", label: "Revenue" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Alerts</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Notifications and system alerts</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Alerts</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Notifications and system alerts</p>
        </div>
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-500 font-medium">Failed to load alerts</p>
          <p className="text-sm text-zinc-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Alerts</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Notifications and system alerts</p>
        </div>
        {unreadCounts.total > 0 && (
          <button className="px-4 py-2 text-sm font-medium text-[#0891B2] border border-[#0891B2] rounded-xl hover:bg-[#0891B2]/10 transition-colors">
            Mark All as Read
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{unreadCounts.critical}</p>
            <p className="text-sm text-zinc-500">Critical</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-500">{unreadCounts.warning}</p>
            <p className="text-sm text-zinc-500">Warnings</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0891B2]/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#0891B2]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0891B2]">{unreadCounts.info}</p>
            <p className="text-sm text-zinc-500">Info</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Severity Filters */}
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">Severity</p>
          <div className="flex flex-wrap gap-2">
            {severityFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterSeverity(filter.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm transition-all ${
                  filterSeverity === filter.value
                    ? "bg-[#0891B2] border-[#0891B2] text-white"
                    : "border-slate-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
              >
                {filter.color && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: filter.color }} />}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterCategory(filter.value)}
                className={`px-4 py-2 rounded-full border font-medium text-sm transition-all ${
                  filterCategory === filter.value
                    ? "bg-[#0891B2] border-[#0891B2] text-white"
                    : "border-slate-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Notifications</h2>
          <p className="text-sm text-zinc-500">{filteredAlerts.length} alert{filteredAlerts.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl bg-white dark:bg-[#111111] border transition-all cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 ${
                  alert.isRead ? "border-slate-200 dark:border-zinc-800 opacity-60" : "border-slate-300 dark:border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    {alert.severity === "critical" && (
                      <svg className="w-5 h-5" fill={config.color} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {alert.severity === "warning" && (
                      <svg className="w-5 h-5" fill={config.color} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {alert.severity === "info" && (
                      <svg className="w-5 h-5" fill={config.color} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{alert.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{alert.boothName}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-500">{formatRelativeTime(alert.timestamp)}</span>
                        {!alert.isRead && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">{alert.message}</p>
                    <div className="mt-3">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "#0891B220", color: "#0891B2" }}
                      >
                        {formatCategory(alert.category)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAlerts.length === 0 && (
            <div className="p-12 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
              <svg className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                {alerts.length === 0 ? "No alerts" : "No alerts match your filters"}
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                {alerts.length === 0 ? "You're all caught up!" : "Try adjusting your filter criteria"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
