"use client";

/**
 * Admin Support Tickets Page
 * 
 * Clean card design for managing customer support.
 */

import { useState, useMemo } from "react";

const demoTickets = [
  { id: "TKT-001", subject: "Printer not working after update", user: "Michael Johnson", email: "michael@snapshot.com", priority: "high" as const, status: "open" as const, category: "hardware", createdAt: "30m ago", messages: 4 },
  { id: "TKT-002", subject: "Billing discrepancy on last invoice", user: "Sarah Kim", email: "sarah@partypics.com", priority: "medium" as const, status: "pending" as const, category: "billing", createdAt: "2h ago", messages: 2 },
  { id: "TKT-003", subject: "How to set up multiple templates?", user: "David Chen", email: "david@eventpix.com", priority: "low" as const, status: "open" as const, category: "general", createdAt: "12h ago", messages: 1 },
  { id: "TKT-004", subject: "Booth going offline randomly", user: "Emily Rodriguez", email: "emily@celebrate.io", priority: "high" as const, status: "in_progress" as const, category: "technical", createdAt: "1d ago", messages: 6 },
  { id: "TKT-005", subject: "Cannot process credit card payments", user: "Lisa Thompson", email: "lisa@moments.co", priority: "critical" as const, status: "open" as const, category: "payment", createdAt: "45m ago", messages: 3 },
];

type FilterPriority = "all" | "critical" | "high" | "medium" | "low";

function getPriorityConfig(priority: string) {
  switch (priority) {
    case "critical": return { bg: "bg-red-500/20", text: "text-red-400", dot: "bg-red-500" };
    case "high": return { bg: "bg-yellow-500/20", text: "text-yellow-400", dot: "bg-yellow-500" };
    case "medium": return { bg: "bg-[#0891B2]/20", text: "text-[#0891B2]", dot: "bg-[#0891B2]" };
    case "low": return { bg: "bg-green-500/20", text: "text-green-400", dot: "bg-green-500" };
    default: return { bg: "bg-zinc-700", text: "text-zinc-400", dot: "bg-zinc-500" };
  }
}

function getStatusConfig(status: string) {
  switch (status) {
    case "open": return { label: "Open", bg: "bg-blue-500/20", text: "text-blue-400" };
    case "pending": return { label: "Pending", bg: "bg-yellow-500/20", text: "text-yellow-400" };
    case "in_progress": return { label: "In Progress", bg: "bg-[#0891B2]/20", text: "text-[#0891B2]" };
    case "resolved": return { label: "Resolved", bg: "bg-green-500/20", text: "text-green-400" };
    default: return { label: status, bg: "bg-zinc-700", text: "text-zinc-400" };
  }
}

export default function AdminTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");

  const filteredTickets = useMemo(() => {
    return demoTickets.filter((ticket) => {
      if (filterPriority !== "all" && ticket.priority !== filterPriority) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return ticket.subject.toLowerCase().includes(query) || ticket.user.toLowerCase().includes(query);
      }
      return true;
    });
  }, [searchQuery, filterPriority]);

  const stats = {
    total: demoTickets.length,
    critical: demoTickets.filter(t => t.priority === "critical").length,
    open: demoTickets.filter(t => t.status === "open").length,
    pending: demoTickets.filter(t => t.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-zinc-400 mt-1">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800">
          <p className="text-sm text-zinc-500">Total Tickets</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111111] border border-red-500/30">
          <p className="text-sm text-red-400">Critical</p>
          <p className="text-2xl font-bold mt-1 text-red-500">{stats.critical}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111111] border border-blue-500/30">
          <p className="text-sm text-blue-400">Open</p>
          <p className="text-2xl font-bold mt-1 text-blue-500">{stats.open}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111111] border border-yellow-500/30">
          <p className="text-sm text-yellow-400">Pending</p>
          <p className="text-2xl font-bold mt-1 text-yellow-500">{stats.pending}</p>
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
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#111111] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
          />
        </div>

        <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-xl overflow-x-auto">
          {(["all", "critical", "high", "medium", "low"] as FilterPriority[]).map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => setFilterPriority(priority)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                filterPriority === priority
                  ? "bg-[#0891B2] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {priority !== "all" && <span className={`w-2 h-2 rounded-full ${getPriorityConfig(priority).dot}`} />}
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => {
          const priorityConfig = getPriorityConfig(ticket.priority);
          const statusConfig = getStatusConfig(ticket.status);
          
          return (
            <div key={ticket.id} className="p-4 rounded-xl bg-[#111111] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${priorityConfig.bg} flex items-center justify-center shrink-0`}>
                  <div className={`w-3 h-3 rounded-full ${priorityConfig.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-zinc-500 font-mono">{ticket.id}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityConfig.bg} ${priorityConfig.text}`}>
                      {ticket.priority}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="font-medium mt-1">{ticket.subject}</p>
                  <p className="text-sm text-zinc-500 mt-1">{ticket.user} · {ticket.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-zinc-500">{ticket.createdAt}</p>
                  <p className="text-xs text-zinc-400 mt-1">{ticket.messages} messages</p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="p-12 rounded-2xl bg-[#111111] border border-zinc-800 text-center">
            <p className="text-zinc-400">No tickets found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
