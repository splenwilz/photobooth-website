"use client";

/**
 * Download Logs Modal
 *
 * Modal component for downloading log files from a booth remotely.
 * The booth collects, ZIPs, and uploads logs to S3. This can take up to 2 minutes.
 *
 * 3-phase flow: Configure -> Downloading -> Complete
 */

import { useState, useRef, useEffect, useCallback } from "react";
import {
  useDownloadBoothLogs,
  BOOTH_LOG_TYPES,
  DEFAULT_LOG_TYPES,
  type BoothLogType,
  type DownloadBoothLogsResponse,
} from "@/core/api/booths";
import { ApiError } from "@/core/api/client";

const HOURS_OPTIONS = [
  { value: 1, label: "Last 1 hour" },
  { value: 6, label: "Last 6 hours" },
  { value: 12, label: "Last 12 hours" },
  { value: 24, label: "Last 24 hours" },
  { value: 48, label: "Last 48 hours" },
  { value: 72, label: "Last 3 days" },
  { value: 168, label: "Last 7 days" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 409:
        return "This booth is offline and cannot collect logs right now.";
      case 502:
        return error.message || "An error occurred communicating with the booth.";
      case 503:
        return "Log storage is not configured. Contact support.";
      case 504:
        return "The booth did not respond in time. Please try again.";
    }
  }
  return error instanceof Error ? error.message : "Failed to download logs";
}

interface DownloadLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  boothId: string;
  boothName: string;
  boothStatus: string;
}

type ModalPhase = "configure" | "downloading" | "complete";

export function DownloadLogsModal({
  isOpen,
  onClose,
  boothId,
  boothName,
  boothStatus,
}: DownloadLogsModalProps) {
  const [phase, setPhase] = useState<ModalPhase>("configure");
  const [selectedLogTypes, setSelectedLogTypes] = useState<BoothLogType[]>([...DEFAULT_LOG_TYPES]);
  const [hours, setHours] = useState(24);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DownloadBoothLogsResponse | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cancelledRef = useRef(false);

  const { mutateAsync: downloadLogs } = useDownloadBoothLogs();

  const isOffline = boothStatus === "offline";

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClose = useCallback(() => {
    if (phase === "downloading") return;
    setPhase("configure");
    setSelectedLogTypes([...DEFAULT_LOG_TYPES]);
    setHours(24);
    setError(null);
    setResult(null);
    setElapsedSeconds(0);
    clearTimer();
    onClose();
  }, [phase, onClose]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Close on Escape key (only when not downloading)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "downloading") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, phase, handleClose]);

  const handleToggleLogType = (logType: BoothLogType) => {
    setSelectedLogTypes((prev) =>
      prev.includes(logType)
        ? prev.filter((t) => t !== logType)
        : [...prev, logType]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogTypes.length === BOOTH_LOG_TYPES.length) {
      setSelectedLogTypes([]);
    } else {
      setSelectedLogTypes(BOOTH_LOG_TYPES.map((t) => t.value));
    }
  };

  const handleDownload = async () => {
    if (selectedLogTypes.length === 0) {
      setError("Please select at least one log type.");
      return;
    }

    setError(null);
    setPhase("downloading");
    setElapsedSeconds(0);
    cancelledRef.current = false;

    // Clear any existing timer before starting a new one
    clearTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      const response = await downloadLogs({
        boothId,
        data: {
          log_types: selectedLogTypes,
          hours,
        },
      });

      // Ignore response if user cancelled while waiting
      if (cancelledRef.current) return;

      clearTimer();
      setResult(response);
      setPhase("complete");
    } catch (err) {
      // Ignore error if user cancelled while waiting
      if (cancelledRef.current) return;

      clearTimer();
      setError(getErrorMessage(err));
      setPhase("configure");
    }
  };

  const handleCancel = () => {
    cancelledRef.current = true;
    clearTimer();
    setPhase("configure");
    setError("Download cancelled.");
  };

  const handleOpenDownload = () => {
    if (result?.download_url) {
      window.open(result.download_url, "_blank", "noopener,noreferrer");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={phase !== "downloading" ? handleClose : undefined}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-logs-title"
        className="relative w-full max-w-md mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div>
              <h2 id="download-logs-title" className="text-lg font-semibold text-zinc-900 dark:text-white">
                Download Logs
              </h2>
              <p className="text-sm text-zinc-500">{boothName}</p>
            </div>
          </div>
          {phase !== "downloading" && (
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close download logs modal"
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {phase === "configure" && (
            <div className="space-y-4">
              {/* Offline Warning */}
              {isOffline && (
                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex gap-3">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      This booth is currently offline. Log download requires the booth to be online.
                    </p>
                  </div>
                </div>
              )}

              {/* Info Box */}
              {!isOffline && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      The booth will collect, compress, and upload the selected logs. This can take up to 2 minutes.
                    </p>
                  </div>
                </div>
              )}

              {/* Log Types */}
              <fieldset>
                <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Log Types
                </legend>
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-[#069494] hover:text-[#176161] transition-colors ml-auto"
                  >
                    {selectedLogTypes.length === BOOTH_LOG_TYPES.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {BOOTH_LOG_TYPES.map((logType) => (
                    <label
                      key={logType.value}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedLogTypes.includes(logType.value)
                          ? "border-[#069494] bg-[#069494]/5 dark:bg-[#069494]/10"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLogTypes.includes(logType.value)}
                        onChange={() => handleToggleLogType(logType.value)}
                        className="w-4 h-4 rounded border-zinc-300 text-[#069494] focus:ring-[#069494]"
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{logType.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Hours Selection */}
              <div>
                <label htmlFor="time-range-select" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Time Range
                </label>
                <select
                  id="time-range-select"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#069494] focus:border-transparent transition-all"
                >
                  {HOURS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isOffline || selectedLogTypes.length === 0}
                className="w-full py-3 px-4 bg-[#069494] text-white font-medium rounded-xl hover:bg-[#176161] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download Logs
              </button>
            </div>
          )}

          {phase === "downloading" && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center text-center">
                {/* Spinner */}
                <div className="w-16 h-16 mb-4 relative">
                  <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full" />
                  <div className="absolute inset-0 border-4 border-transparent border-t-[#069494] rounded-full animate-spin" />
                </div>
                <p className="text-lg font-medium text-zinc-900 dark:text-white">
                  Collecting logs... {elapsedSeconds}s
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  The booth is gathering and compressing log files. This can take up to 2 minutes.
                </p>
              </div>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {phase === "complete" && result && (
            <div className="space-y-4">
              {/* Success Box */}
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex gap-3">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Logs Ready
                    </p>
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* File Details */}
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {formatFileSize(result.file_size)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium text-zinc-900 dark:text-white">ZIP archive</span>
                </div>
              </div>

              {/* Expiry Note */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Note:</strong> The download link expires in 1 hour.
                </p>
              </div>

              {/* Download Button */}
              <button
                type="button"
                onClick={handleOpenDownload}
                className="w-full py-3 px-4 bg-[#069494] text-white font-medium rounded-xl hover:bg-[#176161] transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download ZIP
              </button>

              {/* Done Button */}
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
