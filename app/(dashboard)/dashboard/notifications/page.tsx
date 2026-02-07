"use client";

/**
 * Email Notifications Page
 *
 * Manage email notification preferences and view notification history.
 * Two tabs: Preferences (toggle switches grouped by category) and History (paginated table).
 */

import { useState } from "react";
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
  useBulkUpdateNotificationPreferences,
  useNotificationHistory,
} from "@/core/api/notifications";
import type {
  NotificationCategory,
  NotificationPreference,
  NotificationStatus,
} from "@/core/api/notifications";

// ============================================================================
// Constants
// ============================================================================

const CATEGORY_ORDER: NotificationCategory[] = ["license", "booth", "billing", "hardware"];

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  license: "License",
  booth: "Booth",
  billing: "Billing",
  hardware: "Hardware",
};

const CATEGORY_ICONS: Record<NotificationCategory, React.ReactNode> = {
  license: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
  booth: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    </svg>
  ),
  billing: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
  hardware: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a3.12 3.12 0 114.41-4.42l.68.69.69-.69a3.12 3.12 0 014.41 0c.6.6.94 1.37 1.01 2.18M19.42 8.43a3.12 3.12 0 00-1.01-2.18M11.42 15.17L16.5 20.25M11.42 15.17l-1.42 1.42M16.5 20.25l1.42-1.42M16.5 20.25h3.75M7.5 11.25V14.25M7.5 14.25H4.5M7.5 14.25h.375" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555M11.25 4.533V3.75m0 .783a9.764 9.764 0 010 14.184m0 0V19.5" />
    </svg>
  ),
};

const HISTORY_PAGE_SIZE = 20;

type Tab = "preferences" | "history";

// ============================================================================
// Components
// ============================================================================

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`} />;
}

function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
  ariaLabel,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0891B2] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0a0a0a] ${
        enabled ? "bg-[#0891B2]" : "bg-zinc-300 dark:bg-zinc-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function StatusBadge({ status }: { status: NotificationStatus }) {
  const config = {
    sent: { label: "Sent", bg: "bg-green-500/20", text: "text-green-600 dark:text-green-400" },
    failed: { label: "Failed", bg: "bg-red-500/20", text: "text-red-600 dark:text-red-400" },
    skipped: { label: "Skipped", bg: "bg-zinc-500/20", text: "text-zinc-600 dark:text-zinc-400" },
  }[status];

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatEventType(eventType: string): string {
  return eventType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ============================================================================
// Preferences Tab
// ============================================================================

function PreferencesTab() {
  const { data, isLoading, error } = useNotificationPreferences();
  const { mutate: togglePreference } = useUpdateNotificationPreference();
  const { mutate: bulkUpdate, isPending: isBulkUpdating } = useBulkUpdateNotificationPreferences();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {CATEGORY_ORDER.map((category) => (
          <div key={category}>
            <Skeleton className="h-6 w-24 mb-3 rounded-lg" />
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <Skeleton className="h-5 w-40 rounded" />
                      <Skeleton className="h-4 w-64 mt-1.5 rounded" />
                    </div>
                    <Skeleton className="h-6 w-11 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
        <p className="text-red-600 dark:text-red-400">Failed to load preferences. Please try again.</p>
      </div>
    );
  }

  const preferences = data?.preferences ?? [];

  // Group preferences by category
  const grouped: Record<NotificationCategory, NotificationPreference[]> = {
    license: [],
    booth: [],
    billing: [],
    hardware: [],
  };
  for (const pref of preferences) {
    if (grouped[pref.category]) {
      grouped[pref.category].push(pref);
    }
  }

  const allEnabled = preferences.every((p) => p.enabled);
  const allDisabled = preferences.every((p) => !p.enabled);

  const handleEnableAll = () => {
    const prefs: Record<string, boolean> = {};
    for (const p of preferences) {
      if (!p.enabled) prefs[p.event_type] = true;
    }
    if (Object.keys(prefs).length > 0) {
      bulkUpdate({ preferences: prefs });
    }
  };

  const handleDisableAll = () => {
    const prefs: Record<string, boolean> = {};
    for (const p of preferences) {
      if (p.enabled) prefs[p.event_type] = false;
    }
    if (Object.keys(prefs).length > 0) {
      bulkUpdate({ preferences: prefs });
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {preferences.filter((p) => p.enabled).length} of {preferences.length} notifications enabled
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleEnableAll}
            disabled={allEnabled || isBulkUpdating}
            className="text-sm font-medium text-[#0891B2] hover:text-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enable All
          </button>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <button
            type="button"
            onClick={handleDisableAll}
            disabled={allDisabled || isBulkUpdating}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Disable All
          </button>
        </div>
      </div>

      {/* Category groups */}
      {CATEGORY_ORDER.map((category) => {
        const items = grouped[category];
        if (items.length === 0) return null;

        return (
          <div key={category}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="text-[#0891B2]">{CATEGORY_ICONS[category]}</div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {CATEGORY_LABELS[category]}
              </h2>
            </div>

            {/* Preference items */}
            <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] divide-y divide-[var(--border)]">
              {items.map((pref) => (
                <div
                  key={pref.event_type}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="pr-4">
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {pref.label}
                    </p>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      {pref.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={pref.enabled}
                    disabled={isBulkUpdating}
                    ariaLabel={`Toggle ${pref.label}`}
                    onChange={(enabled) =>
                      togglePreference({ eventType: pref.event_type, enabled })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// History Tab
// ============================================================================

function HistoryTab() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * HISTORY_PAGE_SIZE;

  const { data, isLoading, error } = useNotificationHistory({
    limit: HISTORY_PAGE_SIZE,
    offset,
  });

  const totalPages = data ? Math.ceil(data.total / HISTORY_PAGE_SIZE) : 0;

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
        <p className="text-red-600 dark:text-red-400">Failed to load notification history. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-[var(--border)] last:border-0">
              <Skeleton className="flex-1 h-4" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-16 h-6 rounded-full" />
              <Skeleton className="w-28 h-4" />
            </div>
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className="text-zinc-900 dark:text-white font-medium">No notifications sent yet</p>
          <p className="text-zinc-500 mt-1">Your email notification history will appear here</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Event Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-zinc-900 dark:text-white truncate max-w-xs">
                        {item.subject}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.recipient_email}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatEventType(item.event_type)}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-sm text-zinc-500">
                Page {page} of {totalPages} ({data?.total} notifications)
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
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
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("preferences");

  const tabs: { value: Tab; label: string }[] = [
    { value: "preferences", label: "Preferences" },
    { value: "history", label: "History" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Email Notifications
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Manage which email notifications you receive
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.value
                ? "bg-[#0891B2] text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "preferences" ? <PreferencesTab /> : <HistoryTab />}
    </div>
  );
}
