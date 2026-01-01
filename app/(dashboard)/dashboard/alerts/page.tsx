"use client";

/**
 * Alerts Page
 * 
 * Notification center with severity and category filters.
 * Uses demo data matching the mobile app structure.
 * 
 * @see Mobile app - /app/(tabs)/alerts.tsx
 */

import { useState, useMemo } from "react";

// Demo alerts data
const demoAlerts = [
  {
    id: "1",
    title: "Low Paper Warning",
    message: "Downtown Mall booth has less than 50 sheets remaining. Please refill soon to avoid service interruption.",
    type: "warning" as const,
    category: "supplies" as const,
    boothName: "Downtown Mall",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: "2",
    title: "Booth Offline",
    message: "Convention Center booth went offline. Last known status was 2 hours ago. Check network connection.",
    type: "critical" as const,
    category: "connectivity" as const,
    boothName: "Convention Center",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: "3",
    title: "High Revenue Alert",
    message: "Today's revenue exceeded $800 across all booths. Great performance!",
    type: "info" as const,
    category: "sales" as const,
    boothName: "All Booths",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: "4",
    title: "Camera Disconnected",
    message: "Beach Resort booth camera is not responding. Booth is still operational with backup camera.",
    type: "warning" as const,
    category: "hardware" as const,
    boothName: "Beach Resort",
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    isRead: true,
  },
  {
    id: "5",
    title: "Print Job Failed",
    message: "A print job at Wedding Venue failed. Customer was notified and given a refund.",
    type: "critical" as const,
    category: "hardware" as const,
    boothName: "Wedding Venue",
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    isRead: true,
  },
  {
    id: "6",
    title: "Weekly Report Ready",
    message: "Your weekly analytics report is ready to view. Total revenue: $4,235.00",
    type: "info" as const,
    category: "sales" as const,
    boothName: "All Booths",
    timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
    isRead: true,
  },
];

type FilterSeverity = "all" | "critical" | "warning" | "info";
type FilterCategory = "all" | "hardware" | "supplies" | "connectivity" | "sales";

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

function getSeverityConfig(type: "critical" | "warning" | "info") {
  switch (type) {
    case "critical": return { color: "#EF4444", icon: "exclamation-circle" };
    case "warning": return { color: "#F59E0B", icon: "exclamation-triangle" };
    case "info": return { color: "#0891B2", icon: "information-circle" };
  }
}

export default function AlertsPage() {
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return demoAlerts.filter((alert) => {
      if (filterSeverity !== "all" && alert.type !== filterSeverity) return false;
      if (filterCategory !== "all" && alert.category !== filterCategory) return false;
      return true;
    });
  }, [filterSeverity, filterCategory]);

  // Count unread by severity
  const unreadCounts = useMemo(() => ({
    critical: demoAlerts.filter(a => a.type === "critical" && !a.isRead).length,
    warning: demoAlerts.filter(a => a.type === "warning" && !a.isRead).length,
    info: demoAlerts.filter(a => a.type === "info" && !a.isRead).length,
    total: demoAlerts.filter(a => !a.isRead).length,
  }), []);

  const severityFilters = [
    { value: "all" as const, label: "All" },
    { value: "critical" as const, label: "Critical", color: "#EF4444" },
    { value: "warning" as const, label: "Warning", color: "#F59E0B" },
    { value: "info" as const, label: "Info", color: "#0891B2" },
  ];

  const categoryFilters = [
    { value: "all" as const, label: "All" },
    { value: "hardware" as const, label: "Hardware" },
    { value: "supplies" as const, label: "Supplies" },
    { value: "connectivity" as const, label: "Connectivity" },
    { value: "sales" as const, label: "Sales" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-zinc-400 mt-1">Notifications and system alerts</p>
        </div>
        {unreadCounts.total > 0 && (
          <button className="px-4 py-2 text-sm font-medium text-[#0891B2] border border-[#0891B2] rounded-xl hover:bg-[#0891B2]/10 transition-colors">
            Mark All as Read
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800 flex items-center gap-4">
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
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800 flex items-center gap-4">
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
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800 flex items-center gap-4">
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
                    : "border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
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
                    : "border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
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
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-zinc-500">{filteredAlerts.length} alert{filteredAlerts.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const config = getSeverityConfig(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl bg-[#111111] border transition-all cursor-pointer hover:border-zinc-700 ${
                  alert.isRead ? "border-zinc-800 opacity-60" : "border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    {alert.type === "critical" && (
                      <svg className="w-5 h-5" fill={config.color} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {alert.type === "warning" && (
                      <svg className="w-5 h-5" fill={config.color} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {alert.type === "info" && (
                      <svg className="w-5 h-5" fill={config.color} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{alert.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{alert.boothName}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-500">{formatRelativeTime(alert.timestamp)}</span>
                        {!alert.isRead && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 mt-2">{alert.message}</p>
                    <div className="mt-3">
                      <span 
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "#0891B220", color: "#0891B2" }}
                      >
                        {alert.category.charAt(0).toUpperCase() + alert.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAlerts.length === 0 && (
            <div className="p-12 rounded-xl bg-[#111111] border border-zinc-800 text-center">
              <svg className="w-12 h-12 text-zinc-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 003.714.318c1.28 0 2.52-.1 3.714-.318M5.946 10.596A8.001 8.001 0 1118.054 10.6M12 3v3m0 10v.75" />
              </svg>
              <p className="text-zinc-400 font-medium">No alerts match your filters</p>
              <p className="text-sm text-zinc-500 mt-1">Try adjusting your filter criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

