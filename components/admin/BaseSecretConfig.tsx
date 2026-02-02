"use client";

/**
 * Base Secret Configuration Component
 *
 * Allows admins to configure the base secret used for
 * local master password generation on booths.
 */

import { useState } from "react";
import {
  useBaseSecretStatus,
  useConfigureBaseSecret,
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

export function BaseSecretConfig() {
  const [isEditing, setIsEditing] = useState(false);
  const [newSecret, setNewSecret] = useState("");
  const [confirmSecret, setConfirmSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: status, isLoading, refetch } = useBaseSecretStatus();
  const { mutateAsync: configureSecret, isPending } = useConfigureBaseSecret();

  const handleSave = async () => {
    setError(null);

    if (newSecret.length < 32) {
      setError("Base secret must be at least 32 characters.");
      return;
    }

    if (newSecret !== confirmSecret) {
      setError("Secrets do not match.");
      return;
    }

    try {
      await configureSecret({ base_secret: newSecret });
      setNewSecret("");
      setConfirmSecret("");
      setIsEditing(false);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to configure base secret");
    }
  };

  const handleCancel = () => {
    setNewSecret("");
    setConfirmSecret("");
    setError(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800">
        <Skeleton className="w-48 h-6 mb-2" />
        <Skeleton className="w-full h-4" />
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status?.is_configured ? "bg-green-500/20" : "bg-red-500/20"}`}>
            {status?.is_configured ? (
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">Base Secret Configuration</h3>
            <p className="text-sm text-zinc-500">
              {status?.is_configured
                ? `Configured ${status.updated_at ? `on ${formatDate(status.updated_at)}` : ""}`
                : "Required for local master password generation"}
            </p>
          </div>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 text-sm font-medium text-[#0891B2] hover:text-[#0E7490] transition-colors"
          >
            {status?.is_configured ? "Update" : "Configure"}
          </button>
        )}
      </div>

      {isEditing && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              New Base Secret <span className="text-zinc-500 font-normal">(min 32 characters)</span>
            </label>
            <input
              type="password"
              value={newSecret}
              onChange={(e) => setNewSecret(e.target.value)}
              placeholder="Enter a secure base secret..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all font-mono text-sm"
            />
            <p className="mt-1 text-xs text-zinc-500">
              {newSecret.length}/32 characters minimum
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Confirm Base Secret
            </label>
            <input
              type="password"
              value={confirmSecret}
              onChange={(e) => setConfirmSecret(e.target.value)}
              placeholder="Confirm the base secret..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all font-mono text-sm"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || newSecret.length < 32}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>

          <p className="text-xs text-zinc-500">
            <strong>Important:</strong> Store this secret securely. It&apos;s used to generate local master passwords for all booths.
          </p>
        </div>
      )}
    </div>
  );
}
