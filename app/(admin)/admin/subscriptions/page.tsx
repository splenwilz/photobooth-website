"use client";

/**
 * Admin Subscriptions Page
 * 
 * Clean card design for managing billing and plans.
 */

import { useState, useMemo } from "react";

const demoSubscriptions = [
  { id: "1", user: "SnapShot Events", email: "contact@snapshot.com", plan: "Enterprise", status: "active", amount: 299, billingCycle: "monthly", nextBilling: "Feb 1, 2024" },
  { id: "2", user: "Party Pics Pro", email: "hello@partypics.com", plan: "Pro", status: "active", amount: 99, billingCycle: "monthly", nextBilling: "Jan 28, 2024" },
  { id: "3", user: "EventPix Studios", email: "info@eventpix.com", plan: "Pro", status: "active", amount: 99, billingCycle: "monthly", nextBilling: "Feb 5, 2024" },
  { id: "4", user: "Celebrate Moments", email: "team@celebrate.io", plan: "Pro", status: "past_due", amount: 99, billingCycle: "monthly", nextBilling: "Jan 15, 2024" },
  { id: "5", user: "Flash Photography", email: "flash@photo.com", plan: "Starter", status: "active", amount: 29, billingCycle: "monthly", nextBilling: "Feb 10, 2024" },
  { id: "6", user: "Moments & More", email: "lisa@moments.co", plan: "Starter", status: "active", amount: 290, billingCycle: "yearly", nextBilling: "Sep 12, 2024" },
  { id: "7", user: "PhotoFun LLC", email: "amanda@photofun.com", plan: "Starter", status: "trial", amount: 0, billingCycle: "monthly", nextBilling: "Jan 25, 2024" },
  { id: "8", user: "EventShots", email: "rachel@eventshots.com", plan: "Enterprise", status: "active", amount: 2990, billingCycle: "yearly", nextBilling: "Apr 15, 2024" },
];

type FilterStatus = "all" | "active" | "past_due" | "trial";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getStatusConfig(status: string) {
  switch (status) {
    case "active": return { label: "Active", bg: "bg-green-500/20", text: "text-green-400" };
    case "past_due": return { label: "Past Due", bg: "bg-red-500/20", text: "text-red-400" };
    case "canceled": return { label: "Canceled", bg: "bg-zinc-700", text: "text-zinc-400" };
    case "trial": return { label: "Trial", bg: "bg-blue-500/20", text: "text-blue-400" };
    default: return { label: status, bg: "bg-zinc-700", text: "text-zinc-400" };
  }
}

export default function AdminSubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredSubscriptions = useMemo(() => {
    return demoSubscriptions.filter((sub) => {
      if (filterStatus !== "all" && sub.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return sub.user.toLowerCase().includes(query) || sub.email.toLowerCase().includes(query);
      }
      return true;
    });
  }, [searchQuery, filterStatus]);

  const totalMRR = demoSubscriptions
    .filter(s => s.status === "active")
    .reduce((sum, s) => sum + (s.billingCycle === "yearly" ? s.amount / 12 : s.amount), 0);

  const stats = {
    starter: demoSubscriptions.filter(s => s.plan === "Starter").length,
    pro: demoSubscriptions.filter(s => s.plan === "Pro").length,
    enterprise: demoSubscriptions.filter(s => s.plan === "Enterprise").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-zinc-400 mt-1">Manage customer billing and plans</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
          <p className="text-sm text-green-400">Monthly Recurring Revenue</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(Math.round(totalMRR))}</p>
          <p className="text-xs text-zinc-500 mt-1">MRR</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800">
          <p className="text-sm text-zinc-500">Starter Plans</p>
          <p className="text-2xl font-bold mt-1">{stats.starter}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800">
          <p className="text-sm text-zinc-500">Pro Plans</p>
          <p className="text-2xl font-bold mt-1 text-blue-400">{stats.pro}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800">
          <p className="text-sm text-zinc-500">Enterprise Plans</p>
          <p className="text-2xl font-bold mt-1 text-[#0891B2]">{stats.enterprise}</p>
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
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#111111] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
          />
        </div>

        <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-xl">
          {(["all", "active", "past_due", "trial"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                filterStatus === status
                  ? "bg-[#0891B2] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {status === "past_due" ? "Past Due" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-3">
        {filteredSubscriptions.map((sub) => {
          const statusConfig = getStatusConfig(sub.status);
          
          return (
            <div key={sub.id} className="p-4 rounded-xl bg-[#111111] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-sm shrink-0">
                  {sub.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{sub.user}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 truncate">{sub.email}</p>
                </div>
                <div className="hidden sm:block">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    sub.plan === "Enterprise" ? "bg-[#0891B2]/20 text-[#0891B2]" :
                    sub.plan === "Pro" ? "bg-blue-500/20 text-blue-400" :
                    "bg-zinc-700 text-zinc-400"
                  }`}>
                    {sub.plan}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(sub.amount)}<span className="text-zinc-500 text-sm">/{sub.billingCycle === "yearly" ? "yr" : "mo"}</span></p>
                  <p className="text-xs text-zinc-500">Next: {sub.nextBilling}</p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSubscriptions.length === 0 && (
          <div className="p-12 rounded-2xl bg-[#111111] border border-zinc-800 text-center">
            <p className="text-zinc-400">No subscriptions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
