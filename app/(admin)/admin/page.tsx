"use client";

/**
 * Admin Overview Page
 * 
 * Platform-wide metrics with clean card design matching user dashboard.
 */

import { useState } from "react";

// Demo platform data
const platformStats = {
  today: { users: 24, revenue: 18420, subscriptions: 8, tickets: 3 },
  week: { users: 156, revenue: 124580, subscriptions: 42, tickets: 18 },
  month: { users: 623, revenue: 456780, subscriptions: 168, tickets: 67 },
  year: { users: 5234, revenue: 2456780, subscriptions: 1842, tickets: 423 },
};

const systemHealth = {
  uptime: 99.7,
  activeUsers: 1247,
  onlineBooths: 7891,
  totalBooths: 8742,
};

const recentActivity = [
  { id: 1, type: "user", action: "New user registered", detail: "sarah.k@example.com", meta: "Signed up via Google", time: "5 min ago", isNew: true },
  { id: 2, type: "subscription", action: "Upgraded to Pro", detail: "mike.j@company.com", meta: "From Starter plan", time: "12 min ago", isNew: true },
  { id: 3, type: "ticket", action: "New support ticket", detail: "TKT-089 - Payment issue", meta: "Priority: High", time: "18 min ago", isNew: true },
  { id: 4, type: "booth", action: "Booth went offline", detail: "Downtown Mall - Booth #3", meta: "Last seen: 25m ago", time: "25 min ago", isNew: false },
  { id: 5, type: "payment", action: "Payout processed", detail: "$12,450 to SnapShot Events", meta: "Bank: ****4521", time: "32 min ago", isNew: false },
  { id: 6, type: "user", action: "Account verified", detail: "james@flash.com", meta: "Email verified", time: "45 min ago", isNew: false },
];

const topUsers = [
  { name: "SnapShot Events", email: "contact@snapshot.com", booths: 12, revenue: 45230, growth: 24, transactions: 2156, plan: "Enterprise", avatar: "SE" },
  { name: "Party Pics Pro", email: "hello@partypics.com", booths: 8, revenue: 32150, growth: 18, transactions: 1523, plan: "Pro", avatar: "PP" },
  { name: "EventPix Studios", email: "info@eventpix.com", booths: 6, revenue: 28400, growth: 12, transactions: 1298, plan: "Pro", avatar: "ES" },
  { name: "Celebrate Moments", email: "team@celebrate.io", booths: 5, revenue: 22100, growth: -5, transactions: 987, plan: "Pro", avatar: "CM" },
  { name: "Flash Photography", email: "flash@photo.com", booths: 4, revenue: 18750, growth: 8, transactions: 856, plan: "Starter", avatar: "FP" },
];

type Period = "today" | "week" | "month" | "year";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getActivityIcon(type: string) {
  const iconClasses = "w-4 h-4";
  switch (type) {
    case "user":
      return { bg: "bg-blue-500/20", color: "text-blue-500", icon: (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )};
    case "subscription":
      return { bg: "bg-green-500/20", color: "text-green-500", icon: (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )};
    case "ticket":
      return { bg: "bg-yellow-500/20", color: "text-yellow-500", icon: (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
      )};
    case "booth":
      return { bg: "bg-red-500/20", color: "text-red-500", icon: (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      )};
    case "payment":
      return { bg: "bg-[#0891B2]/20", color: "text-[#0891B2]", icon: (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )};
    default:
      return { bg: "bg-zinc-800", color: "text-zinc-400", icon: null };
  }
}

export default function AdminOverviewPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("today");
  const stats = platformStats[selectedPeriod];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Platform Stats */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Platform Overview</h2>
            <p className="text-sm text-zinc-500">{systemHealth.activeUsers.toLocaleString()} active users</p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
            {(["today", "week", "month", "year"] as Period[]).map((period) => (
              <button
                key={period}
                type="button"
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
          {/* Revenue */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Revenue</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(stats.revenue)}</p>
            <p className="text-sm text-green-500 mt-2">+18.2% from last period</p>
          </div>

          {/* New Users */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">New Users</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.users.toLocaleString()}</p>
            <p className="text-sm text-zinc-500 mt-2">{(systemHealth.activeUsers / 100).toFixed(0)}% active rate</p>
          </div>

          {/* New Subscriptions */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-[#0891B2]/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Subscriptions</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.subscriptions.toLocaleString()}</p>
            <p className="text-sm text-zinc-500 mt-2">+{Math.round(stats.subscriptions * 0.12)} upgrades</p>
          </div>

          {/* Support Tickets */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Tickets</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.tickets}</p>
            <p className="text-sm text-yellow-500 mt-2">{Math.round(stats.tickets * 0.25)} open</p>
          </div>
        </div>
      </section>

      {/* System Health */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">System Health</h2>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-4">
          {/* Uptime */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">Platform Uptime</span>
              </div>
              <span className="text-sm text-green-500 font-medium">{systemHealth.uptime}%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${systemHealth.uptime}%` }} />
            </div>
          </div>

          {/* Booths Online */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0891B2]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  </svg>
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">Booths Online</span>
              </div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{systemHealth.onlineBooths.toLocaleString()}/{systemHealth.totalBooths.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#0891B2] rounded-full" style={{ width: `${(systemHealth.onlineBooths / systemHealth.totalBooths) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Activity & Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Activity</h2>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-400">Live</span>
              </div>
            </div>
            <a href="/admin/logs" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              View All →
            </a>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] overflow-hidden">
            <div className="divide-y divide-[var(--border)]">
              {recentActivity.map((activity, index) => {
                const iconConfig = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <div className="flex items-start gap-3">
                      {/* Timeline connector */}
                      <div className="relative flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconConfig.bg} group-hover:scale-110 transition-transform`}>
                          <span className={iconConfig.color}>{iconConfig.icon}</span>
                        </div>
                        {index < recentActivity.length - 1 && (
                          <div className="w-0.5 h-8 bg-slate-200 dark:bg-zinc-800 -mb-8 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-zinc-900 dark:text-white">{activity.action}</p>
                          {activity.isNew && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[#0891B2]/20 text-[#0891B2]">NEW</span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">{activity.detail}</p>
                        <p className="text-xs text-zinc-500 mt-1">{activity.meta}</p>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-xs text-zinc-500">{activity.time}</span>
                        <button type="button" className="block mt-2 text-xs text-[#0891B2] hover:text-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity">
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Users */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Top Users</h2>
              <p className="text-sm text-zinc-500">By revenue this month</p>
            </div>
            <a href="/admin/users" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              View All →
            </a>
          </div>

          <div className="space-y-3">
            {topUsers.map((user, i) => {
              const maxRevenue = topUsers[0].revenue;
              const percentage = (user.revenue / maxRevenue) * 100;
              
              return (
                <div key={user.name} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    {/* Rank + Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-sm">
                        {user.avatar}
                      </div>
                      <span className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        i === 0 ? "bg-yellow-500 text-yellow-900" :
                        i === 1 ? "bg-zinc-300 text-zinc-700" :
                        i === 2 ? "bg-orange-400 text-orange-900" :
                        "bg-zinc-700 text-zinc-300"
                      }`}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate text-zinc-900 dark:text-white">{user.name}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          user.plan === "Enterprise" ? "bg-[#0891B2]/20 text-[#0891B2]" :
                          user.plan === "Pro" ? "bg-blue-500/20 text-blue-400" :
                          "bg-slate-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                        }`}>
                          {user.plan}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                      
                      {/* Progress Bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-[#0891B2] to-[#10B981] rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500">{user.transactions.toLocaleString()} txn</span>
                      </div>
                    </div>
                    
                    {/* Revenue + Growth */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">{formatCurrency(user.revenue)}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${user.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d={user.growth >= 0 ? "M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" : "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"} />
                        </svg>
                        <span className="text-xs font-medium">{Math.abs(user.growth)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summary Row */}
          <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-zinc-500">Total Revenue</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{formatCurrency(topUsers.reduce((sum, u) => sum + u.revenue, 0))}</p>
              </div>
              <div className="w-px h-8 bg-slate-300 dark:bg-zinc-700" />
              <div className="text-center">
                <p className="text-sm text-zinc-500">Avg. Growth</p>
                <p className="text-lg font-bold text-green-500">+{Math.round(topUsers.reduce((sum, u) => sum + u.growth, 0) / topUsers.length)}%</p>
              </div>
            </div>
            <button type="button" className="px-4 py-2 text-sm font-medium bg-[#0891B2] text-white rounded-xl hover:bg-[#0E7490] transition-colors">
              Export Report
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
