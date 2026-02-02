"use client";

/**
 * Admin Emergency Access Page
 *
 * Audit log for all emergency passwords issued across the platform.
 * Allows viewing history and revoking active passwords.
 * Includes Local Master Password generator for offline recovery.
 */

import { useState } from "react";
import {
  useEmergencyPasswords,
  useRevokeEmergencyPassword,
  type EmergencyPasswordRecord,
} from "@/core/api/admin/emergency-password";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`}
    />
  );
}

function getStatusBadge(password: EmergencyPasswordRecord) {
  const now = new Date();
  const expiresAt = new Date(password.expires_at);
  const isExpired = now > expiresAt;

  if (password.revoked) {
    return {
      label: "Revoked",
      bg: "bg-zinc-500/20",
      text: "text-zinc-500",
      icon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    };
  }
  if (password.used) {
    return {
      label: "Used",
      bg: "bg-blue-500/20",
      text: "text-blue-500",
      icon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
  }
  if (isExpired) {
    return {
      label: "Expired",
      bg: "bg-yellow-500/20",
      text: "text-yellow-500",
      icon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
  }
  return {
    label: "Active",
    bg: "bg-green-500/20",
    text: "text-green-500",
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  };
}

function PasswordRow({
  password,
  onRevoke,
  isRevoking,
}: {
  password: EmergencyPasswordRecord;
  onRevoke: (id: number) => void;
  isRevoking: boolean;
}) {
  const status = getStatusBadge(password);
  const now = new Date();
  const expiresAt = new Date(password.expires_at);
  const isExpired = now > expiresAt;
  const canRevoke = !password.revoked && !password.used && !isExpired;

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-zinc-900 dark:text-white">
              {password.booth_name}
            </p>
            <p className="text-xs text-zinc-500">{password.booth_id.slice(0, 8)}...</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
        >
          {status.icon}
          {status.label}
        </span>
      </td>
      <td className="px-4 py-4">
        <div>
          <p className="text-sm text-zinc-900 dark:text-white">
            {password.issued_by_email}
          </p>
          <p className="text-xs text-zinc-500">{formatDate(password.issued_at)}</p>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-zinc-900 dark:text-white">
          {formatDate(password.expires_at)}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate">
          {password.reason}
        </p>
      </td>
      <td className="px-4 py-4 text-right">
        {canRevoke ? (
          <button
            type="button"
            onClick={() => onRevoke(password.id)}
            disabled={isRevoking}
            className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRevoking ? "Revoking..." : "Revoke"}
          </button>
        ) : password.used_at ? (
          <span className="text-xs text-zinc-500">
            Used {formatDate(password.used_at)}
          </span>
        ) : password.revoked_at ? (
          <span className="text-xs text-zinc-500">
            Revoked by {password.revoked_by}
          </span>
        ) : null}
      </td>
    </tr>
  );
}

export default function EmergencyAccessPage() {
  const [page, setPage] = useState(1);
  const [includeExpired, setIncludeExpired] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useEmergencyPasswords({
    page,
    per_page: 20,
    include_expired: includeExpired,
  });

  const { mutateAsync: revokePassword } = useRevokeEmergencyPassword();

  const handleRevoke = async (passwordId: number) => {
    if (!confirm("Are you sure you want to revoke this emergency password?")) {
      return;
    }

    setRevokingId(passwordId);
    try {
      await revokePassword(passwordId);
    } catch (err) {
      console.error("Failed to revoke password:", err);
      alert("Failed to revoke password. Please try again.");
    } finally {
      setRevokingId(null);
    }
  };

  const passwords = data?.passwords || [];
  const totalPages = data?.total_pages || 1;
  const total = data?.total || 0;

  // Calculate stats
  const activeCount = passwords.filter((p) => {
    const now = new Date();
    const expiresAt = new Date(p.expires_at);
    return !p.revoked && !p.used && now <= expiresAt;
  }).length;

  const usedCount = passwords.filter((p) => p.used).length;
  const revokedCount = passwords.filter((p) => p.revoked).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Emergency Access
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/20">
              <svg
                className="w-3.5 h-3.5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
              <span className="text-xs font-medium text-amber-500">
                Master Passwords
              </span>
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Audit log for emergency booth access passwords
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
            title="Refresh data"
          >
            <svg
              className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{total}</p>
          <p className="text-sm text-zinc-500">Total Issued</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {activeCount}
            </p>
          </div>
          <p className="text-sm text-zinc-500">Active (this page)</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {usedCount}
            </p>
          </div>
          <p className="text-sm text-zinc-500">Used (this page)</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-500" />
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {revokedCount}
            </p>
          </div>
          <p className="text-sm text-zinc-500">Revoked (this page)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeExpired}
            onChange={(e) => {
              setIncludeExpired(e.target.checked);
              setPage(1);
            }}
            className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-[#0891B2] focus:ring-[#0891B2]"
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Include expired passwords
          </span>
        </label>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load emergency passwords. Please try again.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Booth
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Issued By
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                          <Skeleton className="w-24 h-4 mb-1" />
                          <Skeleton className="w-16 h-3" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="w-32 h-4 mb-1" />
                      <Skeleton className="w-24 h-3" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="w-28 h-4" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="w-40 h-4" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="w-16 h-6 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : passwords.length > 0 ? (
                passwords.map((password) => (
                  <PasswordRow
                    key={password.id}
                    password={password}
                    onRevoke={handleRevoke}
                    isRevoking={revokingId === password.id}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-zinc-400 dark:text-zinc-600 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                      />
                    </svg>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">
                      No emergency passwords found
                    </p>
                    <p className="text-zinc-500 text-sm mt-1">
                      Emergency passwords will appear here when generated
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && passwords.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              Showing {passwords.length} of {total} passwords
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Methods Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cloud Emergency Password */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Cloud Emergency Password</h3>
              <p className="text-xs text-zinc-500">Format: EMR-XXXXXXXX</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Time-limited (5-30 min)
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Revocable remotely
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Central audit log
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Requires internet
            </li>
          </ul>
          <p className="mt-3 text-xs text-zinc-500">
            Best for: Remote support with audit trail
          </p>
        </div>

        {/* Local Master Password */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Local Master Password</h3>
              <p className="text-xs text-zinc-500">Format: 12345678 (8 digits)</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Works fully offline on booth
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Machine-specific (MAC bound)
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Generated via API (easy)
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Single-use per nonce
            </li>
          </ul>
          <p className="mt-3 text-xs text-zinc-500">
            Best for: Offline emergencies when booth has no internet
          </p>
        </div>
      </div>

    </div>
  );
}
