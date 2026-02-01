"use client";

/**
 * Admin Support Tickets Page
 *
 * Manage all customer support tickets with filtering and detail view.
 */

import { useState, useEffect, useCallback } from "react";
import {
  useAdminTickets,
  type AdminTicketsQueryParams,
  type TicketPriority,
  type TicketStatus,
} from "@/core/api/admin/tickets";
import TicketDetailPanel from "./TicketDetailPanel";

// Loading skeleton component
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`}
    />
  );
}

// Debounce hook for search
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

type FilterStatus = "all" | TicketStatus;
type FilterPriority = "all" | TicketPriority;

function getPriorityConfig(priority: string) {
  switch (priority) {
    case "critical":
      return { bg: "bg-red-500/20", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" };
    case "high":
      return { bg: "bg-orange-500/20", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500" };
    case "medium":
      return { bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" };
    case "low":
      return { bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400", dot: "bg-zinc-400" };
    default:
      return { bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400", dot: "bg-zinc-400" };
  }
}

function getStatusConfig(status: string) {
  switch (status) {
    case "open":
      return { label: "Open", bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" };
    case "pending":
      return { label: "Pending", bg: "bg-yellow-500/20", text: "text-yellow-600 dark:text-yellow-400" };
    case "in_progress":
      return { label: "In Progress", bg: "bg-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400" };
    case "resolved":
      return { label: "Resolved", bg: "bg-green-500/20", text: "text-green-600 dark:text-green-400" };
    case "closed":
      return { label: "Closed", bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
    default:
      return { label: status, bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Handle future timestamps or very recent (< 1 minute)
  if (diffMs < 0 || diffMs < 60000) return "Just now";

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AdminTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const queryParams: AdminTicketsQueryParams = {
    page,
    per_page: 20,
    status: filterStatus === "all" ? undefined : filterStatus,
    priority: filterPriority === "all" ? undefined : filterPriority,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading, error } = useAdminTickets(queryParams);

  const handleFilterChange = useCallback((type: "status" | "priority", value: string) => {
    if (type === "status") {
      setFilterStatus(value as FilterStatus);
    } else {
      setFilterPriority(value as FilterPriority);
    }
    setPage(1);
  }, []);

  const handleTicketClick = (ticketId: number) => {
    setSelectedTicketId(ticketId);
  };

  const handleClosePanel = () => {
    setSelectedTicketId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Support Tickets</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage customer support requests</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load tickets. Please try again.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <Skeleton className="w-20 h-4 mb-2" />
              <Skeleton className="w-12 h-8" />
            </div>
          ))
        ) : (
          <>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500">Total Tickets</p>
              <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">
                {data?.summary.total_tickets ?? 0}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-red-500/30">
              <p className="text-sm text-red-600 dark:text-red-400">Critical</p>
              <p className="text-2xl font-bold mt-1 text-red-500">
                {data?.summary.critical_tickets ?? 0}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-blue-500/30">
              <p className="text-sm text-blue-600 dark:text-blue-400">Open</p>
              <p className="text-2xl font-bold mt-1 text-blue-500">
                {data?.summary.open_tickets ?? 0}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-yellow-500/30">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">
                {data?.summary.pending_tickets ?? 0}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-cyan-500/30">
              <p className="text-sm text-cyan-600 dark:text-cyan-400">In Progress</p>
              <p className="text-2xl font-bold mt-1 text-cyan-500">
                {data?.summary.in_progress_tickets ?? 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by ticket number or subject..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl overflow-x-auto">
          {(["all", "open", "pending", "in_progress", "resolved", "closed"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleFilterChange("status", status)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                filterStatus === status
                  ? "bg-[#0891B2] text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {status === "in_progress" ? "In Progress" : status}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl overflow-x-auto">
          {(["all", "critical", "high", "medium", "low"] as FilterPriority[]).map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => handleFilterChange("priority", priority)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                filterPriority === priority
                  ? "bg-[#0891B2] text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {priority !== "all" && (
                <span className={`w-2 h-2 rounded-full ${getPriorityConfig(priority).dot}`} />
              )}
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      {!error && (
        <div className="space-y-3">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)]">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <Skeleton className="w-16 h-5 rounded-full" />
                      <Skeleton className="w-12 h-5 rounded-full" />
                      <Skeleton className="w-16 h-5 rounded-full" />
                    </div>
                    <Skeleton className="w-64 h-5 mb-2" />
                    <Skeleton className="w-40 h-4" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="w-12 h-4 mb-1" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                </div>
              </div>
            ))
          ) : data?.tickets.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <p className="text-zinc-900 dark:text-white font-medium">No tickets found</p>
              <p className="text-zinc-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            data?.tickets.map((ticket) => {
              const priorityConfig = getPriorityConfig(ticket.priority);
              const statusConfig = getStatusConfig(ticket.status);

              return (
                <div
                  key={ticket.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTicketClick(ticket.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleTicketClick(ticket.id);
                    }
                  }}
                  className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:ring-offset-2 dark:focus:ring-offset-[#0a0a0a]"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${priorityConfig.bg} flex items-center justify-center shrink-0`}>
                      <div className={`w-3 h-3 rounded-full ${priorityConfig.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-zinc-500 font-mono">{ticket.ticket_number}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityConfig.bg} ${priorityConfig.text}`}>
                          {ticket.priority}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                        {ticket.assigned_to && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-600 dark:text-zinc-400">
                            Assigned
                          </span>
                        )}
                      </div>
                      <p className="font-medium mt-1 text-zinc-900 dark:text-white truncate">{ticket.subject}</p>
                      <p className="text-sm text-zinc-500 mt-1">
                        {ticket.user_name} · {ticket.user_email}
                        {ticket.booth_name && ` · ${ticket.booth_name}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-zinc-500">{formatDate(ticket.created_at)}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {ticket.message_count} message{ticket.message_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4">
              <p className="text-sm text-zinc-500">
                Page {data.page} of {data.total_pages} ({data.total} tickets)
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
                  onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                  disabled={page >= data.total_pages}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ticket Detail Panel */}
      {selectedTicketId !== null && (
        <TicketDetailPanel
          ticketId={selectedTicketId}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}
