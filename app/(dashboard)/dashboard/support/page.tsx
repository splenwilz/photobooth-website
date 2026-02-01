"use client";

/**
 * Support Tickets Page
 *
 * Displays user's support tickets with filtering and pagination.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTickets, type TicketStatus, type TicketsQueryParams } from "@/core/api/tickets";
import CreateTicketModal from "./CreateTicketModal";

// Loading skeleton component
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`}
    />
  );
}

// Format date for display
function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Get status badge styling
function getStatusConfig(status: TicketStatus) {
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

// Get priority badge styling
function getPriorityConfig(priority: string) {
  switch (priority) {
    case "low":
      return { label: "Low", bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
    case "medium":
      return { label: "Medium", bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" };
    case "high":
      return { label: "High", bg: "bg-orange-500/20", text: "text-orange-600 dark:text-orange-400" };
    case "critical":
      return { label: "Critical", bg: "bg-red-500/20", text: "text-red-600 dark:text-red-400" };
    default:
      return { label: priority, bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
  }
}

type StatusFilter = "all" | TicketStatus;

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function SupportPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryParams: TicketsQueryParams = {
    page,
    per_page: 20,
    status: statusFilter,
  };

  const { data, isLoading, error } = useTickets(queryParams);

  const handleTicketClick = (ticketId: number) => {
    router.push(`/dashboard/support/${ticketId}`);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Support</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Get help with your booths and account
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl w-fit overflow-x-auto">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => handleStatusChange(filter.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              statusFilter === filter.value
                ? "bg-[#0891B2] text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load tickets. Please try again.</p>
        </div>
      )}

      {/* Tickets Table */}
      {!error && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-[var(--border)] last:border-0">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="flex-1 h-4" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-24 h-4" />
                </div>
              ))}
            </div>
          ) : data?.tickets.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <p className="text-zinc-900 dark:text-white font-medium">No tickets yet</p>
              <p className="text-zinc-500 mt-1">Create a ticket to get help from our support team</p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors"
              >
                Create Your First Ticket
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Ticket</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Priority</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Booth</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Messages</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.tickets.map((ticket) => {
                      const statusConfig = getStatusConfig(ticket.status);
                      const priorityConfig = getPriorityConfig(ticket.priority);
                      return (
                        <tr
                          key={ticket.id}
                          onClick={() => handleTicketClick(ticket.id)}
                          className="border-b border-[var(--border)] last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-4">
                            <span className="font-mono text-sm text-[#0891B2]">{ticket.ticket_number}</span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-zinc-900 dark:text-white truncate max-w-xs">
                              {ticket.subject}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityConfig.bg} ${priorityConfig.text}`}>
                              {priorityConfig.label}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-zinc-600 dark:text-zinc-400">
                            {ticket.booth_name ?? "—"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                              </svg>
                              {ticket.message_count}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-zinc-600 dark:text-zinc-400 text-sm">
                            {formatDate(ticket.last_message_at ?? ticket.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data && data.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
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
            </>
          )}
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(ticketId) => {
            setShowCreateModal(false);
            router.push(`/dashboard/support/${ticketId}`);
          }}
        />
      )}
    </div>
  );
}
