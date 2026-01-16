"use client";

/**
 * Admin Audit Logs Page
 * 
 * Clean timeline design for tracking admin actions.
 */

import { useState, useMemo } from "react";

const demoLogs = [
  { id: "1", action: "User suspended", actor: "Super Admin", target: "robert@clickpix.net", category: "user", time: "15m ago" },
  { id: "2", action: "Subscription upgraded", actor: "System", target: "Party Pics Pro → Pro", category: "billing", time: "32m ago" },
  { id: "3", action: "Support ticket resolved", actor: "Support Agent", target: "TKT-007", category: "support", time: "45m ago" },
  { id: "4", action: "User credentials reset", actor: "Super Admin", target: "james@flash.com", category: "security", time: "1h ago" },
  { id: "5", action: "Payout processed", actor: "System", target: "$12,450 to SnapShot Events", category: "billing", time: "2h ago" },
  { id: "6", action: "Admin login", actor: "Super Admin", target: "-", category: "auth", time: "3h ago" },
  { id: "7", action: "Plan pricing updated", actor: "Super Admin", target: "Pro plan", category: "settings", time: "5h ago" },
  { id: "8", action: "User account deleted", actor: "Super Admin", target: "spam.user@fake.com", category: "user", time: "8h ago" },
];

type FilterCategory = "all" | "user" | "billing" | "support" | "security" | "auth" | "settings";

function getCategoryConfig(category: string) {
  switch (category) {
    case "user": return { icon: "👤", bg: "bg-blue-500/20", text: "text-blue-400" };
    case "billing": return { icon: "💳", bg: "bg-green-500/20", text: "text-green-400" };
    case "support": return { icon: "🎫", bg: "bg-yellow-500/20", text: "text-yellow-400" };
    case "security": return { icon: "🔒", bg: "bg-red-500/20", text: "text-red-400" };
    case "auth": return { icon: "🔑", bg: "bg-[#0891B2]/20", text: "text-[#0891B2]" };
    case "settings": return { icon: "⚙️", bg: "bg-zinc-500/20", text: "text-zinc-400" };
    default: return { icon: "📋", bg: "bg-zinc-700", text: "text-zinc-400" };
  }
}

export default function AdminLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  const filteredLogs = useMemo(() => {
    return demoLogs.filter((log) => {
      if (filterCategory !== "all" && log.category !== filterCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return log.action.toLowerCase().includes(query) || log.target.toLowerCase().includes(query);
      }
      return true;
    });
  }, [searchQuery, filterCategory]);

  const categories: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "All" },
    { value: "user", label: "User" },
    { value: "billing", label: "Billing" },
    { value: "support", label: "Support" },
    { value: "security", label: "Security" },
    { value: "auth", label: "Auth" },
    { value: "settings", label: "Settings" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Audit Logs</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track admin actions and system events</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] text-zinc-700 dark:text-white font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
          />
        </div>

        <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                filterCategory === cat.value
                  ? "bg-[#0891B2] text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const catConfig = getCategoryConfig(log.category);

          return (
            <div key={log.id} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${catConfig.bg} flex items-center justify-center text-lg shrink-0`}>
                  {catConfig.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{log.action}</p>
                      <p className="text-sm text-zinc-500 mt-0.5">
                        by <span className="text-zinc-600 dark:text-zinc-400">{log.actor}</span>
                        {log.target !== "-" && (
                          <> → <span className="text-zinc-600 dark:text-zinc-400">{log.target}</span></>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500 shrink-0">{log.time}</span>
                  </div>
                  <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${catConfig.bg} ${catConfig.text}`}>
                    {log.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
            <p className="text-zinc-500 dark:text-zinc-400">No logs found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">Showing {filteredLogs.length} entries</p>
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
            Previous
          </button>
          <button type="button" className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
