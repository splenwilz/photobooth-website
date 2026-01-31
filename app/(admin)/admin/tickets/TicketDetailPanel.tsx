"use client";

/**
 * Ticket Detail Panel
 *
 * Slide-out panel for viewing and responding to support tickets.
 */

import { useState } from "react";
import {
  useAdminTicketDetail,
  useUpdateAdminTicket,
  useAddAdminMessage,
  type TicketStatus,
  type TicketPriority,
  type TicketMessage,
} from "@/core/api/admin/tickets";

interface TicketDetailPanelProps {
  ticketId: number;
  onClose: () => void;
}

// Loading skeleton
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`} />
  );
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Format file size
function formatFileSize(bytes: number): string {
  if (!isFinite(bytes) || bytes <= 0) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getPriorityConfig(priority: string) {
  switch (priority) {
    case "critical":
      return { bg: "bg-red-500/20", text: "text-red-600 dark:text-red-400" };
    case "high":
      return { bg: "bg-orange-500/20", text: "text-orange-600 dark:text-orange-400" };
    case "medium":
      return { bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" };
    case "low":
      return { bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
    default:
      return { bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" };
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

// Message bubble component
function MessageBubble({ message, isAdmin }: { message: TicketMessage; isAdmin: boolean }) {
  return (
    <div className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] ${
          isAdmin
            ? "bg-[#0891B2] text-white rounded-2xl rounded-bl-md"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl rounded-br-md"
        }`}
      >
        <div className="px-4 py-3">
          <div className={`text-xs mb-1 ${isAdmin ? "text-white/70" : "text-zinc-500"}`}>
            {message.sender_name} ({isAdmin ? "Admin" : "User"}) · {formatDate(message.created_at)}
          </div>
          <p className="whitespace-pre-wrap">{message.message}</p>

          {message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isAdmin
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="flex-1 text-sm truncate">{att.filename}</span>
                  <span className={`text-xs ${isAdmin ? "text-white/60" : "text-zinc-500"}`}>
                    {formatFileSize(att.file_size)}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TicketDetailPanel({ ticketId, onClose }: TicketDetailPanelProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const { data: ticket, isLoading, error } = useAdminTicketDetail(ticketId);
  const { mutate: updateTicket, isPending: isUpdating } = useUpdateAdminTicket();
  const { mutate: sendReply, isPending: isSending } = useAddAdminMessage(ticketId);

  const isClosed = ticket?.status === "closed";
  const canReply = !isClosed && replyMessage.trim().length > 0;

  const handleStatusChange = (status: TicketStatus) => {
    updateTicket({ ticketId, data: { status } });
    setShowStatusDropdown(false);
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    updateTicket({ ticketId, data: { priority } });
    setShowPriorityDropdown(false);
  };

  const handleSendReply = () => {
    if (!canReply) return;
    sendReply(
      { message: replyMessage.trim() },
      { onSuccess: () => setReplyMessage("") }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111111] shadow-xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            {isLoading ? (
              <>
                <Skeleton className="w-20 h-5 mb-1" />
                <Skeleton className="w-48 h-6" />
              </>
            ) : (
              <>
                <p className="text-sm font-mono text-[#0891B2]">{ticket?.ticket_number}</p>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
                  {ticket?.subject}
                </h2>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400">Failed to load ticket details.</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!error && (
          <div className="flex-1 overflow-y-auto">
            {/* Ticket Info */}
            <div className="p-6 border-b border-[var(--border)] space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              ) : ticket && (
                (() => {
                  // Get user info from ticket or first user message
                  const firstUserMessage = ticket.messages.find(m => m.sender_type === "user");
                  const userName = (ticket.user_name || firstUserMessage?.sender_name || "").trim() || "Unknown User";
                  const userEmail = ticket.user_email || "";
                  const nameParts = userName.split(" ").filter(part => part.length > 0);
                  const userInitials = nameParts.length > 0
                    ? nameParts.map(n => n[0]).join("").slice(0, 2).toUpperCase()
                    : "?";

                  return (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-sm text-white">
                      {userInitials}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{userName}</p>
                      {userEmail && <p className="text-sm text-zinc-500">{userEmail}</p>}
                    </div>
                    {ticket.booth && (
                      <span className="ml-auto text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                        {ticket.booth.name}
                      </span>
                    )}
                  </div>

                  {/* Status & Priority Controls */}
                  <div className="flex gap-3">
                    {/* Status Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        disabled={isUpdating}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${getStatusConfig(ticket.status).bg} ${getStatusConfig(ticket.status).text}`}
                      >
                        {getStatusConfig(ticket.status).label}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {showStatusDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-zinc-800 border border-[var(--border)] rounded-lg shadow-lg z-20 overflow-hidden">
                            {(["open", "pending", "in_progress", "resolved", "closed"] as TicketStatus[]).map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusChange(status)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-900 dark:text-white"
                              >
                                {getStatusConfig(status).label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Priority Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                        disabled={isUpdating}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${getPriorityConfig(ticket.priority).bg} ${getPriorityConfig(ticket.priority).text}`}
                      >
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {showPriorityDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowPriorityDropdown(false)} />
                          <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-zinc-800 border border-[var(--border)] rounded-lg shadow-lg z-20 overflow-hidden">
                            {(["low", "medium", "high", "critical"] as TicketPriority[]).map((priority) => (
                              <button
                                key={priority}
                                type="button"
                                onClick={() => handlePriorityChange(priority)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-900 dark:text-white capitalize"
                              >
                                {priority}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500">
                    Created {formatDate(ticket.created_at)}
                    {ticket.resolved_at && ` · Resolved ${formatDate(ticket.resolved_at)}`}
                  </p>
                </>
                  );
                })()
              )}
            </div>

            {/* Messages */}
            <div className="p-6">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Conversation</h3>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Skeleton className="w-2/3 h-20 rounded-2xl" />
                  </div>
                  <div className="flex justify-start">
                    <Skeleton className="w-2/3 h-24 rounded-2xl" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {ticket?.messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isAdmin={message.sender_type === "admin"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reply Form */}
        {!error && !isLoading && !isClosed && (
          <div className="p-4 border-t border-[var(--border)]">
            <div className="flex gap-3">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={2}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-[#0891B2] focus:outline-none transition-colors text-zinc-900 dark:text-white placeholder-zinc-500 resize-none"
              />
              <button
                type="button"
                onClick={handleSendReply}
                disabled={!canReply || isSending}
                className="px-6 py-3 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Closed Notice */}
        {!error && !isLoading && isClosed && (
          <div className="p-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                This ticket is closed. Change status to reopen.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
