"use client";

/**
 * Admin Users Management Page
 * 
 * Clean card design matching user dashboard style.
 */

import { useState, useMemo } from "react";

const demoUsers = [
  { id: "1", name: "Michael Johnson", email: "michael@snapshot.com", company: "SnapShot Events", plan: "Enterprise", booths: 12, status: "active", revenue: 45230 },
  { id: "2", name: "Sarah Kim", email: "sarah@partypics.com", company: "Party Pics Pro", plan: "Pro", booths: 8, status: "active", revenue: 32150 },
  { id: "3", name: "David Chen", email: "david@eventpix.com", company: "EventPix Studios", plan: "Pro", booths: 6, status: "active", revenue: 28400 },
  { id: "4", name: "Emily Rodriguez", email: "emily@celebrate.io", company: "Celebrate Moments", plan: "Pro", booths: 5, status: "active", revenue: 22100 },
  { id: "5", name: "James Wilson", email: "james@flash.com", company: "Flash Photography", plan: "Starter", booths: 4, status: "active", revenue: 18750 },
  { id: "6", name: "Lisa Thompson", email: "lisa@moments.co", company: "Moments & More", plan: "Starter", booths: 3, status: "active", revenue: 14200 },
  { id: "7", name: "Robert Brown", email: "robert@clickpix.net", company: "ClickPix Network", plan: "Pro", booths: 7, status: "suspended", revenue: 8500 },
  { id: "8", name: "Amanda Davis", email: "amanda@photofun.com", company: "PhotoFun LLC", plan: "Starter", booths: 2, status: "active", revenue: 9800 },
];

type FilterStatus = "all" | "active" | "suspended";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredUsers = useMemo(() => {
    return demoUsers.filter((user) => {
      if (filterStatus !== "all" && user.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      }
      return true;
    });
  }, [searchQuery, filterStatus]);

  const stats = {
    total: demoUsers.length,
    active: demoUsers.filter(u => u.status === "active").length,
    suspended: demoUsers.filter(u => u.status === "suspended").length,
    totalRevenue: demoUsers.reduce((sum, u) => sum + u.revenue, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Users</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage platform users and accounts</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Total Users</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Active</p>
          <p className="text-2xl font-bold mt-1 text-green-500">{stats.active}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Suspended</p>
          <p className="text-2xl font-bold mt-1 text-red-500">{stats.suspended}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Total Revenue</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
          />
        </div>

        <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
          {(["all", "active", "suspended"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                filterStatus === status
                  ? "bg-[#0891B2] text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-sm text-white shrink-0">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate text-zinc-900 dark:text-white">{user.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    user.status === "active" ? "bg-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/20 text-red-600 dark:text-red-400"
                  }`}>
                    {user.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 truncate">{user.email}</p>
              </div>
              <div className="hidden sm:block text-right">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  user.plan === "Enterprise" ? "bg-[#0891B2]/20 text-[#0891B2]" :
                  user.plan === "Pro" ? "bg-blue-500/20 text-blue-500 dark:text-blue-400" :
                  "bg-slate-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                }`}>
                  {user.plan}
                </span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.booths} booths</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600 dark:text-green-500">{formatCurrency(user.revenue)}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
            <p className="text-zinc-500 dark:text-zinc-400">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">Showing {filteredUsers.length} of {demoUsers.length} users</p>
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
