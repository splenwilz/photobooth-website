"use client";

/**
 * Admin Booth Detail Page
 *
 * Comprehensive view of a single booth with hardware status, supplies,
 * system resources, subscription, revenue, and recent transactions.
 */

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  useAdminBoothDetail,
  type StatusIconValue,
  type SupplyStatus,
  type ResourceStatus,
  type AlertSeverity,
} from "@/core/api/admin/booths";
import { EmergencyPasswordModal } from "@/components/admin/EmergencyPasswordModal";
import { useState } from "react";

// Loading skeleton component
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`} />
  );
}

// Format currency (values are already in dollars)
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Format duration from seconds
function formatDuration(seconds: number | null): string {
  if (seconds === null) return "N/A";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Format date
function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format date and time
function formatDateTime(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Get status color for hardware/supply status
function getStatusColor(status: StatusIconValue | SupplyStatus | ResourceStatus | string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case "ok":
      return { bg: "bg-green-500/20", text: "text-green-500", dot: "bg-green-500" };
    case "warning":
    case "low":
      return { bg: "bg-yellow-500/20", text: "text-yellow-500", dot: "bg-yellow-500" };
    case "error":
    case "critical":
    case "high":
      return { bg: "bg-red-500/20", text: "text-red-500", dot: "bg-red-500" };
    default:
      return { bg: "bg-zinc-500/20", text: "text-zinc-500", dot: "bg-zinc-500" };
  }
}

// Get status color for booth connectivity
function getConnectivityColor(status: string): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case "online":
      return { bg: "bg-green-500/20", text: "text-green-500", label: "Online" };
    case "offline":
      return { bg: "bg-red-500/20", text: "text-red-500", label: "Offline" };
    case "warning":
      return { bg: "bg-yellow-500/20", text: "text-yellow-500", label: "Warning" };
    case "maintenance":
      return { bg: "bg-blue-500/20", text: "text-blue-500", label: "Maintenance" };
    default:
      return { bg: "bg-zinc-500/20", text: "text-zinc-500", label: "Unknown" };
  }
}

// Get alert severity color
function getAlertColor(severity: AlertSeverity): {
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case "critical":
      return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30" };
    case "warning":
      return { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/30" };
    default:
      return { bg: "bg-zinc-500/10", text: "text-zinc-500", border: "border-zinc-500/30" };
  }
}

// Get subscription status color
function getSubscriptionStatusColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status) {
    case "active":
      return { bg: "bg-green-500/20", text: "text-green-500" };
    case "trialing":
      return { bg: "bg-blue-500/20", text: "text-blue-500" };
    case "past_due":
      return { bg: "bg-yellow-500/20", text: "text-yellow-500" };
    case "canceled":
    case "unpaid":
      return { bg: "bg-red-500/20", text: "text-red-500" };
    default:
      return { bg: "bg-zinc-500/20", text: "text-zinc-500" };
  }
}

export default function AdminBoothDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boothId = params.id as string;
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const { data: booth, isLoading, error, refetch, isFetching } = useAdminBoothDetail(boothId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !booth) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Booth Not Found</h1>
        </div>
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load booth details. The booth may not exist or you may not have permission to view it.</p>
          <button
            type="button"
            onClick={() => router.push("/admin/booths")}
            className="mt-4 px-4 py-2 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors"
          >
            Back to Booths
          </button>
        </div>
      </div>
    );
  }

  const statusColor = getConnectivityColor(booth.status.current);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{booth.name}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor.bg} ${statusColor.text}`}>
                {statusColor.label}
              </span>
              {booth.status.has_error && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  Error
                </span>
              )}
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">{booth.address || "No address"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
            title="Refresh data"
          >
            <svg className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setEmergencyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium rounded-xl hover:bg-amber-500/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            Emergency Access
          </button>
        </div>
      </div>

      {/* Alerts */}
      {booth.alerts.length > 0 && (
        <div className="space-y-2">
          {booth.alerts.map((alert, index) => {
            const alertColor = getAlertColor(alert.severity);
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border ${alertColor.bg} ${alertColor.border}`}
              >
                <div className="flex items-center gap-3">
                  <svg className={`w-5 h-5 ${alertColor.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className={`font-medium ${alertColor.text}`}>{alert.message}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${alertColor.bg} ${alertColor.text} capitalize`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard label="Owner" value={booth.owner.name || "Unknown"} subValue={booth.owner.email} />
        <InfoCard label="Last Heartbeat" value={booth.status.last_heartbeat_ago || "Never"} />
        <InfoCard label="Created" value={formatDate(booth.created_at)} />
        <InfoCard label="MAC Address" value={booth.mac_address || "N/A"} />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <RevenueCard label="Today" value={booth.revenue.today} />
        <RevenueCard label="This Week" value={booth.revenue.week} />
        <RevenueCard
          label="This Month"
          value={booth.revenue.month}
          change={booth.revenue.month_change_percent}
        />
        <RevenueCard label="Last Month" value={booth.revenue.previous_month} />
        <RevenueCard label="All Time" value={booth.revenue.all_time} highlight />
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{booth.supplies.prints_today}</p>
          <p className="text-sm text-zinc-500">Prints Today</p>
          <p className="text-xs text-zinc-400 mt-1">{booth.supplies.prints_total.toLocaleString()} lifetime</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Status */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Hardware Status</h2>
          <div className="space-y-4">
            <HardwareItem
              label="Printer"
              status={booth.hardware.printer.status}
              name={booth.hardware.printer.name}
              model={booth.hardware.printer.model}
              error={booth.hardware.printer.error}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                </svg>
              }
            />
            <HardwareItem
              label="Camera"
              status={booth.hardware.camera.status}
              name={booth.hardware.camera.name}
              extra={booth.hardware.camera.cameras_detected !== null ? `${booth.hardware.camera.cameras_detected} detected` : undefined}
              error={booth.hardware.camera.error}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                </svg>
              }
            />
            <HardwareItem
              label="Payment"
              status={booth.hardware.payment.status}
              error={booth.hardware.payment.error}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Supplies */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Supplies</h2>
          <div className="space-y-6">
            <SupplyBar
              label="Paper"
              current={booth.supplies.paper.current}
              total={booth.supplies.paper.total}
              percent={booth.supplies.paper.percent}
              status={booth.supplies.paper.status}
            />
            <SupplyBar
              label="Ribbon"
              current={booth.supplies.ribbon.current}
              total={booth.supplies.ribbon.total}
              percent={booth.supplies.ribbon.percent}
              status={booth.supplies.ribbon.status}
            />
          </div>
        </div>

        {/* System Resources */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">System Resources</h2>
          <div className="space-y-4">
            <ResourceItem
              label="CPU"
              value={booth.system.cpu_percent !== null ? `${booth.system.cpu_percent.toFixed(1)}%` : "N/A"}
              status={booth.system.cpu_percent !== null && booth.system.cpu_percent > 80 ? "high" : "ok"}
            />
            <ResourceItem
              label="Memory"
              value={booth.system.memory.used_percent !== null ? `${booth.system.memory.used_percent.toFixed(1)}%` : "N/A"}
              extra={booth.system.memory.total_mb !== null ? `${(booth.system.memory.used_mb || 0).toLocaleString()} / ${booth.system.memory.total_mb.toLocaleString()} MB` : undefined}
              status={booth.system.memory.status}
            />
            <ResourceItem
              label="Disk"
              value={booth.system.disk.used_percent !== null ? `${booth.system.disk.used_percent.toFixed(1)}%` : "N/A"}
              extra={booth.system.disk.total_gb !== null ? `${booth.system.disk.free_gb || 0} GB free of ${booth.system.disk.total_gb} GB` : undefined}
              status={booth.system.disk.status}
            />
            <div className="pt-4 border-t border-[var(--border)]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">App Version</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{booth.system.app_version || "N/A"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">App Uptime</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{formatDuration(booth.system.app_uptime_seconds)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">System Uptime</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{formatDuration(booth.system.system_uptime_seconds)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Last Sync</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{formatDateTime(booth.status.last_sync)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Subscription</h2>
          {booth.subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {booth.subscription.tier_name || "Unknown Plan"}
                  </p>
                  <p className="text-zinc-500">
                    {booth.subscription.amount_cents !== null ? `${formatCurrency(booth.subscription.amount_cents / 100)}/mo` : "N/A"}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getSubscriptionStatusColor(booth.subscription.status).bg} ${getSubscriptionStatusColor(booth.subscription.status).text}`}>
                  {booth.subscription.status}
                </span>
              </div>
              <div className="pt-4 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">Period Ends</p>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {formatDate(booth.subscription.current_period_end)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Auto Renew</p>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {booth.subscription.cancel_at_period_end ? "No (Canceling)" : "Yes"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              <p className="text-zinc-500">No active subscription</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Recent Transactions</h2>
        {booth.recent_transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-zinc-500 border-b border-[var(--border)]">
                  <th className="pb-3 font-medium">Code</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Template</th>
                  <th className="pb-3 font-medium">Qty</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {booth.recent_transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">{txn.transaction_code}</td>
                    <td className="py-3 text-zinc-900 dark:text-white">{txn.product_type}</td>
                    <td className="py-3 text-zinc-500">{txn.template_name || "-"}</td>
                    <td className="py-3 text-zinc-900 dark:text-white">{txn.quantity}</td>
                    <td className="py-3 font-medium text-zinc-900 dark:text-white">{formatCurrency(txn.total_price / 100)}</td>
                    <td className="py-3 text-zinc-500">{txn.payment_method}</td>
                    <td className="py-3 text-zinc-500">{formatDateTime(txn.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            <p className="text-zinc-500">No recent transactions</p>
          </div>
        )}
      </div>

      {/* Emergency Password Modal */}
      <EmergencyPasswordModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        boothId={booth.id}
        boothName={booth.name}
      />
    </div>
  );
}

// Sub-components

function InfoCard({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <p className="font-medium text-zinc-900 dark:text-white truncate">{value}</p>
      {subValue && <p className="text-xs text-zinc-400 truncate mt-0.5">{subValue}</p>}
    </div>
  );
}

function RevenueCard({
  label,
  value,
  change,
  highlight,
}: {
  label: string;
  value: number;
  change?: number | null;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-2xl border border-[var(--border)] ${highlight ? "bg-gradient-to-br from-[#0891B2]/10 to-[#10B981]/10" : "bg-white dark:bg-[#111111]"}`}>
      <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(value)}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-zinc-500">{label}</p>
        {change !== null && change !== undefined && (
          <span className={`text-xs font-medium ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {change >= 0 ? "+" : ""}{change.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function HardwareItem({
  label,
  status,
  name,
  model,
  extra,
  error,
  icon,
}: {
  label: string;
  status: StatusIconValue;
  name?: string | null;
  model?: string | null;
  extra?: string;
  error?: string | null;
  icon: React.ReactNode;
}) {
  const statusColor = getStatusColor(status);
  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusColor.bg} ${statusColor.text}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-zinc-900 dark:text-white">{label}</p>
          <span className={`w-2 h-2 rounded-full ${statusColor.dot}`} />
          <span className={`text-xs capitalize ${statusColor.text}`}>{status}</span>
        </div>
        {(name || model) && (
          <p className="text-sm text-zinc-500 truncate">
            {name}{model ? ` (${model})` : ""}
          </p>
        )}
        {extra && <p className="text-sm text-zinc-500">{extra}</p>}
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}

function SupplyBar({
  label,
  current,
  total,
  percent,
  status,
}: {
  label: string;
  current: number;
  total: number;
  percent: number;
  status: SupplyStatus;
}) {
  const statusColor = getStatusColor(status);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-zinc-900 dark:text-white">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">{current} / {total}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor.bg} ${statusColor.text}`}>
            {status}
          </span>
        </div>
      </div>
      <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${statusColor.dot}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-right text-sm text-zinc-500 mt-1">{percent}%</p>
    </div>
  );
}

function ResourceItem({
  label,
  value,
  extra,
  status,
}: {
  label: string;
  value: string;
  extra?: string;
  status: ResourceStatus;
}) {
  const statusColor = getStatusColor(status);
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-zinc-900 dark:text-white">{label}</p>
        {extra && <p className="text-xs text-zinc-500">{extra}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-zinc-900 dark:text-white">{value}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${statusColor.dot}`} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div>
          <Skeleton className="w-48 h-8 mb-2" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>

      {/* Info Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <Skeleton className="w-16 h-4 mb-2" />
            <Skeleton className="w-24 h-6" />
          </div>
        ))}
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <Skeleton className="w-20 h-8 mb-2" />
            <Skeleton className="w-16 h-4" />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <Skeleton className="w-32 h-6 mb-4" />
            <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
        <Skeleton className="w-40 h-6 mb-4" />
        <Skeleton className="w-full h-48" />
      </div>
    </div>
  );
}
