"use client";

/**
 * Admin All Booths Page
 * 
 * Enhanced platform-wide booth monitoring with rich visuals.
 */

import { useState, useMemo } from "react";

const demoBooths = [
  { 
    id: "1", 
    name: "Downtown Mall", 
    owner: "SnapShot Events",
    ownerEmail: "contact@snapshot.com",
    status: "online" as const,
    revenue: 12500, 
    transactions: 625,
    growth: 18,
    lastSeen: "2 min ago",
    hardware: { camera: true, printer: true, wifi: true },
    supplies: { paper: 85, ink: 72 },
    location: "New York, NY",
    alerts: 0,
  },
  { 
    id: "2", 
    name: "Wedding Venue", 
    owner: "SnapShot Events",
    ownerEmail: "contact@snapshot.com",
    status: "online" as const,
    revenue: 8900, 
    transactions: 445,
    growth: 12,
    lastSeen: "5 min ago",
    hardware: { camera: true, printer: true, wifi: true },
    supplies: { paper: 45, ink: 68 },
    location: "Los Angeles, CA",
    alerts: 1,
  },
  { 
    id: "3", 
    name: "Convention Center", 
    owner: "Party Pics Pro",
    ownerEmail: "hello@partypics.com",
    status: "offline" as const,
    revenue: 6200, 
    transactions: 310,
    growth: -5,
    lastSeen: "3h ago",
    hardware: { camera: false, printer: false, wifi: false },
    supplies: { paper: 90, ink: 85 },
    location: "Chicago, IL",
    alerts: 3,
  },
  { 
    id: "4", 
    name: "Beach Resort", 
    owner: "Party Pics Pro",
    ownerEmail: "hello@partypics.com",
    status: "online" as const,
    revenue: 9800, 
    transactions: 490,
    growth: 24,
    lastSeen: "3 min ago",
    hardware: { camera: true, printer: true, wifi: true },
    supplies: { paper: 62, ink: 55 },
    location: "Miami, FL",
    alerts: 0,
  },
  { 
    id: "5", 
    name: "City Park", 
    owner: "EventPix Studios",
    ownerEmail: "info@eventpix.com",
    status: "online" as const,
    revenue: 5400, 
    transactions: 270,
    growth: 8,
    lastSeen: "1 min ago",
    hardware: { camera: true, printer: true, wifi: true },
    supplies: { paper: 78, ink: 82 },
    location: "Seattle, WA",
    alerts: 0,
  },
  { 
    id: "6", 
    name: "Shopping Center", 
    owner: "EventPix Studios",
    ownerEmail: "info@eventpix.com",
    status: "warning" as const,
    revenue: 7200, 
    transactions: 360,
    growth: 3,
    lastSeen: "15 min ago",
    hardware: { camera: true, printer: false, wifi: true },
    supplies: { paper: 12, ink: 25 },
    location: "Denver, CO",
    alerts: 2,
  },
  { 
    id: "7", 
    name: "Hotel Lobby", 
    owner: "Celebrate Moments",
    ownerEmail: "team@celebrate.io",
    status: "online" as const,
    revenue: 4300, 
    transactions: 215,
    growth: 15,
    lastSeen: "8 min ago",
    hardware: { camera: true, printer: true, wifi: true },
    supplies: { paper: 95, ink: 88 },
    location: "Boston, MA",
    alerts: 0,
  },
  { 
    id: "8", 
    name: "Airport Terminal", 
    owner: "Flash Photography",
    ownerEmail: "flash@photo.com",
    status: "online" as const,
    revenue: 11200, 
    transactions: 560,
    growth: 22,
    lastSeen: "4 min ago",
    hardware: { camera: true, printer: true, wifi: true },
    supplies: { paper: 58, ink: 45 },
    location: "San Francisco, CA",
    alerts: 0,
  },
];

type FilterStatus = "all" | "online" | "offline" | "warning";
type ViewMode = "grid" | "list";

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

function getSupplyColor(level: number) {
  if (level >= 60) return "bg-green-500";
  if (level >= 30) return "bg-yellow-500";
  return "bg-red-500";
}

export default function AdminBoothsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredBooths = useMemo(() => {
    return demoBooths.filter((booth) => {
      if (filterStatus !== "all" && booth.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return booth.name.toLowerCase().includes(query) || booth.owner.toLowerCase().includes(query);
      }
      return true;
    });
  }, [searchQuery, filterStatus]);

  const stats = {
    total: demoBooths.length,
    online: demoBooths.filter(b => b.status === "online").length,
    offline: demoBooths.filter(b => b.status === "offline").length,
    warning: demoBooths.filter(b => b.status === "warning").length,
    totalRevenue: demoBooths.reduce((sum, b) => sum + b.revenue, 0),
    totalAlerts: demoBooths.reduce((sum, b) => sum + b.alerts, 0),
  };

  const topBooths = [...demoBooths].sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">All Booths</h1>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-400">Live Monitoring</span>
            </div>
          </div>
          <p className="text-zinc-400 mt-1">Platform-wide booth monitoring and management</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="p-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-[#111111] border border-zinc-800">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-zinc-500">Total Booths</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#111111] border border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-2xl font-bold">{stats.online}</p>
          </div>
          <p className="text-sm text-zinc-500">Online</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#111111] border border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <p className="text-2xl font-bold">{stats.offline}</p>
          </div>
          <p className="text-sm text-zinc-500">Offline</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#111111] border border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <p className="text-2xl font-bold">{stats.warning}</p>
          </div>
          <p className="text-sm text-zinc-500">Warning</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#111111] border border-zinc-800">
          <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-zinc-500">Revenue (MTD)</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#111111] border border-zinc-800">
          <p className="text-2xl font-bold">{stats.totalAlerts}</p>
          <p className="text-sm text-zinc-500">Active Alerts</p>
        </div>
      </div>

      {/* Top Performers */}
      <section className="p-5 rounded-2xl bg-[#111111] border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Top Performing Booths</h3>
          <span className="text-xs text-zinc-500">This Month</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topBooths.map((booth, i) => (
            <div key={booth.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-zinc-700 text-zinc-300">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{booth.name}</p>
                <p className="text-xs text-zinc-500">{booth.owner}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(booth.revenue)}</p>
                <span className="text-xs text-zinc-500">+{booth.growth}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search booths by name, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#111111] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-xl">
            {(["all", "online", "offline", "warning"] as FilterStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                  filterStatus === status
                    ? "bg-[#0891B2] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {status !== "all" && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig(status).color }} />}
                {status}
              </button>
            ))}
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#0891B2] text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#0891B2] text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Booths Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
        {filteredBooths.map((booth) => {
          const statusConfig = getStatusConfig(booth.status);
          
          return viewMode === "grid" ? (
            <div key={booth.id} className="p-5 rounded-2xl bg-[#111111] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      </svg>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#111111]" style={{ backgroundColor: statusConfig.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{booth.name}</p>
                      {booth.alerts > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
                          {booth.alerts}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">{booth.owner}</p>
                  </div>
                </div>
              </div>

              {/* Revenue & Growth */}
              <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-zinc-800/50">
                <div>
                  <p className="text-xs text-zinc-500">Revenue (MTD)</p>
                  <p className="text-lg font-bold">{formatCurrency(booth.revenue)}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${booth.growth >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={booth.growth >= 0 ? "M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" : "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"} />
                  </svg>
                  <span className="text-xs font-medium">{Math.abs(booth.growth)}%</span>
                </div>
              </div>

              {/* Hardware Status */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5" title="Camera">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${booth.hardware.camera ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    <svg className={`w-3.5 h-3.5 ${booth.hardware.camera ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-1.5" title="Printer">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${booth.hardware.printer ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    <svg className={`w-3.5 h-3.5 ${booth.hardware.printer ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-1.5" title="WiFi">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${booth.hardware.wifi ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    <svg className={`w-3.5 h-3.5 ${booth.hardware.wifi ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1" />
                <span className="text-xs text-zinc-500">{booth.location}</span>
              </div>

              {/* Supplies */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 w-12">Paper</span>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getSupplyColor(booth.supplies.paper)}`} style={{ width: `${booth.supplies.paper}%` }} />
                  </div>
                  <span className="text-xs text-zinc-400 w-8">{booth.supplies.paper}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 w-12">Ink</span>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getSupplyColor(booth.supplies.ink)}`} style={{ width: `${booth.supplies.ink}%` }} />
                  </div>
                  <span className="text-xs text-zinc-400 w-8">{booth.supplies.ink}%</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{booth.lastSeen}</span>
                  <button type="button" className="text-[#0891B2] hover:text-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div key={booth.id} className="p-4 rounded-xl bg-[#111111] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#111111]" style={{ backgroundColor: statusConfig.color }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{booth.name}</p>
                    {booth.alerts > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
                        {booth.alerts}
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">{booth.owner} · {booth.location}</p>
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${booth.hardware.camera ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    <svg className={`w-3.5 h-3.5 ${booth.hardware.camera ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    </svg>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${booth.hardware.printer ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    <svg className={`w-3.5 h-3.5 ${booth.hardware.printer ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${booth.hardware.wifi ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    <svg className={`w-3.5 h-3.5 ${booth.hardware.wifi ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="font-bold">{formatCurrency(booth.revenue)}</p>
                  <div className={`flex items-center justify-end gap-1 ${booth.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={booth.growth >= 0 ? "M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" : "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"} />
                    </svg>
                    <span className="text-xs font-medium">{Math.abs(booth.growth)}%</span>
                  </div>
                </div>
                
                <span className="text-xs text-zinc-500 shrink-0 hidden sm:block">{booth.lastSeen}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooths.length === 0 && (
        <div className="p-12 rounded-2xl bg-[#111111] border border-zinc-800 text-center">
          <svg className="w-12 h-12 mx-auto text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          </svg>
          <p className="text-zinc-400 text-lg font-medium">No booths found</p>
          <p className="text-zinc-500 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">Showing {filteredBooths.length} of {demoBooths.length} booths</p>
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
            Previous
          </button>
          <button type="button" className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
