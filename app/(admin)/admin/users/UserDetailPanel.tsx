"use client";

/**
 * User Detail Slide-out Panel
 *
 * Displays detailed user information and their booths in a slide-out panel.
 */

import { useEffect } from "react";
import { useAdminUserDetail } from "@/core/api/admin/users";

interface UserDetailPanelProps {
  userId: string;
  onClose: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(part => part.length > 0);
  if (parts.length === 0) return "?";
  return parts
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getBoothStatusColor(status: string): string {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "offline":
      return "bg-zinc-400";
    case "error":
      return "bg-red-500";
    case "maintenance":
      return "bg-yellow-500";
    default:
      return "bg-zinc-400";
  }
}

function getSubscriptionBadgeStyle(status: string | null): string {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-600 dark:text-green-400";
    case "trialing":
      return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
    case "past_due":
      return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
    case "canceled":
      return "bg-red-500/20 text-red-600 dark:text-red-400";
    default:
      return "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400";
  }
}

export default function UserDetailPanel({ userId, onClose }: UserDetailPanelProps) {
  const { data: user, isLoading, error } = useAdminUserDetail(userId);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#0a0a0a] border-l border-[var(--border)] z-50 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            User Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg
              className="w-5 h-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-6 space-y-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
                ))}
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6">
              <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
                <p className="text-red-600 dark:text-red-400">
                  Failed to load user details.
                </p>
              </div>
            </div>
          )}

          {/* User Details */}
          {user && (
            <div className="p-6 space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-xl text-white shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.status === "active"
                          ? "bg-green-500/20 text-green-600 dark:text-green-400"
                          : "bg-red-500/20 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <p className="text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-[var(--border)]">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Booths</p>
                  <p className="text-xl font-bold mt-1 text-zinc-900 dark:text-white">
                    {user.total_booths}
                  </p>
                  {user.active_booths < user.total_booths && (
                    <p className="text-xs text-zinc-500">{user.active_booths} active</p>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-[var(--border)]">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Revenue</p>
                  <p className="text-xl font-bold mt-1 text-green-600 dark:text-green-500">
                    {formatCurrency(user.total_revenue)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-[var(--border)]">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Member</p>
                  <p className="text-sm font-medium mt-1 text-zinc-900 dark:text-white">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              {/* Booths Section */}
              <div>
                <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">
                  Booths ({user.booths.length})
                </h4>

                {user.booths.length === 0 ? (
                  <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-[var(--border)] text-center">
                    <p className="text-zinc-500">No booths yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.booths.map((booth) => (
                      <div
                        key={booth.id}
                        className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-[var(--border)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${getBoothStatusColor(booth.status)}`}
                              />
                              <p className="font-medium text-zinc-900 dark:text-white truncate">
                                {booth.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {booth.subscription_tier ? (
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSubscriptionBadgeStyle(
                                    booth.subscription_status
                                  )}`}
                                >
                                  {booth.subscription_tier}
                                </span>
                              ) : (
                                <span className="text-xs text-zinc-500">No subscription</span>
                              )}
                              {booth.subscription_status && booth.subscription_status !== "active" && (
                                <span className="text-xs text-zinc-500 capitalize">
                                  ({booth.subscription_status})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-medium text-green-600 dark:text-green-500">
                              {formatCurrency(booth.revenue)}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                              {booth.status === "online" ? (
                                <span className="text-green-600 dark:text-green-400">Online</span>
                              ) : (
                                <span>Last seen {formatRelativeTime(booth.last_heartbeat)}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {user && (
          <div className="p-4 border-t border-[var(--border)] bg-zinc-50 dark:bg-zinc-900">
            <a
              href={`mailto:${user.email}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Contact User
            </a>
          </div>
        )}
      </div>
    </>
  );
}
