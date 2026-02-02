"use client";

/**
 * Emergency Password Modal
 *
 * Modal component for generating emergency passwords for booth recovery.
 * Supports two methods:
 * 1. Cloud Emergency Password (EMR-XXXXXXXX) - requires API access
 * 2. Local Master Password (8 digits) - works offline on booth, generated via API
 */

import { useState, useRef, useEffect } from "react";
import {
  useGenerateEmergencyPassword,
  useGenerateLocalMasterPasswordApi,
  useBaseSecretStatus,
  type GenerateEmergencyPasswordResponse,
  type GenerateLocalMasterPasswordResponse,
  VALIDITY_OPTIONS,
} from "@/core/api/admin/emergency-password";

type PasswordMethod = "cloud" | "local";

interface EmergencyPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  boothId: string;
  boothName: string;
}

export function EmergencyPasswordModal({
  isOpen,
  onClose,
  boothId,
  boothName,
}: EmergencyPasswordModalProps) {
  // Method selection
  const [method, setMethod] = useState<PasswordMethod>("cloud");

  // Cloud method state
  const [validityMinutes, setValidityMinutes] = useState(15);
  const [reason, setReason] = useState("");
  const [generatedCloudPassword, setGeneratedCloudPassword] =
    useState<GenerateEmergencyPasswordResponse | null>(null);

  // Local method state (API-based)
  const [localReason, setLocalReason] = useState("");
  const [generatedLocalPassword, setGeneratedLocalPassword] =
    useState<GenerateLocalMasterPasswordResponse | null>(null);

  // Shared state
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Hooks
  const { mutateAsync: generateCloudPassword, isPending: isCloudPending } =
    useGenerateEmergencyPassword();
  const { mutateAsync: generateLocalPassword, isPending: isLocalPending } =
    useGenerateLocalMasterPasswordApi();
  const { data: baseSecretStatus, isLoading: isBaseSecretLoading } = useBaseSecretStatus();

  const handleGenerateCloud = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for generating the emergency password.");
      return;
    }

    setError(null);
    try {
      const result = await generateCloudPassword({
        boothId,
        data: {
          validity_minutes: validityMinutes,
          reason: reason.trim(),
        },
      });
      setGeneratedCloudPassword(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate emergency password"
      );
    }
  };

  const handleGenerateLocal = async () => {
    if (!localReason.trim()) {
      setError("Please provide a reason for generating the password.");
      return;
    }

    setError(null);
    try {
      const result = await generateLocalPassword({
        boothId,
        data: {
          reason: localReason.trim(),
        },
      });
      setGeneratedLocalPassword(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate local password"
      );
    }
  };

  const handleCopy = async () => {
    const password =
      method === "cloud"
        ? generatedCloudPassword?.password
        : generatedLocalPassword?.password;

    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        // Clear any existing timeout before setting a new one
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        setError("Failed to copy to clipboard. Please select and copy manually.");
      }
    }
  };

  const handleClose = () => {
    setGeneratedCloudPassword(null);
    setGeneratedLocalPassword(null);
    setReason("");
    setLocalReason("");
    setValidityMinutes(15);
    setError(null);
    setCopied(false);
    setMethod("cloud");
    onClose();
  };

  const handleMethodChange = (newMethod: PasswordMethod) => {
    setMethod(newMethod);
    setError(null);
    setGeneratedCloudPassword(null);
    setGeneratedLocalPassword(null);
  };

  if (!isOpen) return null;

  const hasGeneratedPassword =
    (method === "cloud" && generatedCloudPassword) ||
    (method === "local" && generatedLocalPassword);

  const isBaseSecretConfigured = baseSecretStatus?.is_configured ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-500"
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
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Emergency Access
              </h2>
              <p className="text-sm text-zinc-500">{boothName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Method Tabs */}
        {!hasGeneratedPassword && (
          <div className="px-5 pt-4">
            <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <button
                type="button"
                onClick={() => handleMethodChange("cloud")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  method === "cloud"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                </svg>
                Cloud
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange("local")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  method === "local"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
                Local (Offline)
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {!hasGeneratedPassword ? (
            // Generation Forms
            <>
              {method === "cloud" ? (
                // Cloud Method Form
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                      <svg
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
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          Cloud Emergency Password
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 mt-1">
                          Format: <code className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">EMR-XXXXXXXX</code>.
                          Time-limited, revocable, and audited. Requires booth to have internet.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Validity Selection */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Password Validity
                    </label>
                    <select
                      value={validityMinutes}
                      onChange={(e) => setValidityMinutes(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all"
                    >
                      {VALIDITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reason Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Reason for Emergency Access
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g., User locked out, forgot password"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    type="button"
                    onClick={handleGenerateCloud}
                    disabled={isCloudPending}
                    className="w-full py-3 px-4 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCloudPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
                          />
                        </svg>
                        Generate Cloud Password
                      </>
                    )}
                  </button>
                </div>
              ) : (
                // Local Method Form (API-based - simplified)
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
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
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200">
                          Local Master Password
                        </p>
                        <p className="text-amber-700 dark:text-amber-300 mt-1">
                          Format: <code className="font-mono bg-amber-100 dark:bg-amber-800 px-1 rounded">12345678</code> (8 digits).
                          Works offline on booth. Uses booth&apos;s MAC address.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Base Secret Status */}
                  {isBaseSecretLoading ? (
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-500 rounded-full animate-spin" />
                        Checking base secret configuration...
                      </div>
                    </div>
                  ) : !isBaseSecretConfigured ? (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        <strong>Setup Required:</strong> Base secret is not configured.
                        Contact your system administrator to configure it in settings.
                      </p>
                    </div>
                  ) : null}

                  {/* Reason Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Reason for Emergency Access
                    </label>
                    <textarea
                      value={localReason}
                      onChange={(e) => setLocalReason(e.target.value)}
                      placeholder="e.g., User locked out, generating master password"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    type="button"
                    onClick={handleGenerateLocal}
                    disabled={isLocalPending || isBaseSecretLoading || !isBaseSecretConfigured}
                    className="w-full py-3 px-4 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLocalPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
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
                        Generate Local Password
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            // Password Display (both methods)
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex gap-3">
                  <svg
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
                      Password Generated Successfully
                    </p>
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      {method === "cloud" ? (
                        <>
                          Share this password with the user. It will expire in{" "}
                          {generatedCloudPassword?.validity_minutes} minutes.
                        </>
                      ) : (
                        <>
                          Share this password with the user. This is a single-use password
                          that works offline on the booth.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Display Box */}
              <div className="relative">
                <div className="p-4 rounded-xl bg-zinc-900 dark:bg-black border border-zinc-700 font-mono text-center">
                  <span className="text-2xl font-bold tracking-wider text-white select-all">
                    {method === "cloud"
                      ? generatedCloudPassword?.password
                      : generatedLocalPassword?.password}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Details */}
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                {method === "cloud" && generatedCloudPassword && (
                  <>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        Cloud Emergency
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires at:</span>
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {new Date(generatedCloudPassword.expires_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issued by:</span>
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {generatedCloudPassword.issued_by_email}
                      </span>
                    </div>
                  </>
                )}
                {method === "local" && generatedLocalPassword && (
                  <>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        Local Master
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>MAC Address:</span>
                      <span className="font-mono text-zinc-900 dark:text-white">
                        {generatedLocalPassword.mac_address}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Generated by:</span>
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {generatedLocalPassword.generated_by}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Warning for local passwords */}
              {method === "local" && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    <strong>Note:</strong> This password works offline and is single-use.
                    Once used on the booth, it cannot be reused.
                  </p>
                </div>
              )}

              {/* Close Button */}
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
