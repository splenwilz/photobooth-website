"use client";

/**
 * ConnectionDetailsModal
 *
 * View or refresh a booth's registration credentials. Mirrors the mobile
 * app's ConnectionDetailsModal: registration code is the primary connection
 * method, API key is shown as a fallback for manual configuration.
 *
 * @see GET /api/v1/booths/{booth_id}/credentials
 * @see POST /api/v1/booths/{booth_id}/generate-code
 */

import { useEffect, useId, useRef, useState } from "react";
import { useBoothCredentials, useGenerateBoothCode } from "@/core/api/booths";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useFocusTrap } from "@/lib/use-focus-trap";

interface ConnectionDetailsModalProps {
  /**
   * Booth to fetch credentials for. The modal expects to be mounted only
   * when the user wants to see them; the parent controls visibility via
   * conditional rendering so each open is a fresh mount with reset state.
   */
  boothId: string | null;
  boothName?: string;
  onClose: () => void;
}

type CopyKey = "code" | "key";

export function ConnectionDetailsModal({
  boothId,
  boothName,
  onClose,
}: ConnectionDetailsModalProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;

  // A freshly minted code via the regenerate button takes precedence over
  // whatever the credentials endpoint returned. Resets naturally on
  // unmount because the parent conditionally renders the modal.
  const [generatedCode, setGeneratedCode] = useState<{
    code: string;
    expires_at: string;
  } | null>(null);

  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [copyError, setCopyError] = useState<CopyKey | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock background scroll and trap Tab focus while the modal is mounted.
  useBodyScrollLock();
  useFocusTrap(dialogRef);

  const {
    data: credentials,
    isLoading,
    error,
    refetch,
  } = useBoothCredentials(boothId);

  const {
    mutate: generateCode,
    isPending: isGeneratingCode,
    error: generateCodeError,
  } = useGenerateBoothCode();

  const currentCode = generatedCode?.code ?? credentials?.registration_code;
  const currentExpiry =
    generatedCode?.expires_at ?? credentials?.code_expires_at;

  // Focus management: pull focus into the modal on mount, restore on unmount.
  // Escape closes (unless a generate is in flight).
  const isGeneratePendingRef = useRef(isGeneratingCode);
  useEffect(() => {
    isGeneratePendingRef.current = isGeneratingCode;
  }, [isGeneratingCode]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isGeneratePendingRef.current) {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  const copyToClipboard = async (text: string, key: CopyKey) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setCopyError(null);
      setTimeout(() => setCopied((prev) => (prev === key ? null : prev)), 2000);
    } catch (err) {
      // Surface failure to the user instead of silent console.error. The
      // clipboard API can be denied (permissions, http origin, sandboxed
      // iframes); without feedback the user assumes it worked.
      console.error("[ConnectionDetailsModal] Copy failed:", err);
      setCopied(null);
      setCopyError(key);
      setTimeout(
        () => setCopyError((prev) => (prev === key ? null : prev)),
        2000,
      );
    }
  };

  const handleGenerateCode = () => {
    if (!boothId) return;
    generateCode(
      { boothId },
      {
        onSuccess: (data) => {
          setGeneratedCode({ code: data.code, expires_at: data.expires_at });
        },
      },
    );
  };

  const copyLabel = (key: CopyKey): string => {
    if (copyError === key) return "Copy failed";
    if (copied === key) return "Copied!";
    return "Copy";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close connection details"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-lg mx-4 max-h-[90vh] flex flex-col bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-xl font-semibold text-zinc-900 dark:text-white"
            >
              Connection Details
            </h2>
            {boothName && (
              <p className="text-sm text-zinc-500 mt-1 truncate">{boothName}</p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <title>Close</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-[#069494] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-zinc-500">Loading credentials...</p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <title>Error</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-zinc-900 dark:text-white">
                Failed to load credentials
              </p>
              <p className="text-sm text-zinc-500 text-center">
                {error.message || "An error occurred while fetching credentials."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 px-4 py-2 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Credentials */}
          {credentials && !isLoading && !error && (
            <>
              {/* Registration Code */}
              <section className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-zinc-900/40">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Registration Code
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Enter this 6-digit code on your booth touchscreen to connect.
                  </p>
                </div>

                {currentCode ? (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentCode, "code")}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#069494]/10 border border-[#069494]/30 hover:bg-[#069494]/15 transition-colors"
                  >
                    <span className="font-mono text-2xl tracking-widest text-zinc-900 dark:text-white">
                      {currentCode}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        copyError === "code"
                          ? "text-red-500"
                          : "text-[#069494]"
                      }`}
                    >
                      {copyLabel("code")}
                    </span>
                  </button>
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-sm text-zinc-500 text-center">
                    No active code
                  </div>
                )}

                {currentExpiry && (
                  <p className="text-xs text-zinc-500">
                    Valid until: {new Date(currentExpiry).toLocaleString()}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleGenerateCode}
                  disabled={isGeneratingCode || !boothId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#069494] text-white text-sm font-medium hover:bg-[#176161] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingCode ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate New Code"
                  )}
                </button>

                {generateCodeError && (
                  <p className="text-xs text-red-500">
                    Failed to generate code. Please try again.
                  </p>
                )}

                <p className="text-xs text-zinc-500">
                  Codes are valid for 15 minutes and can only be used once.
                </p>
              </section>

              {/* API Key */}
              <section className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-zinc-900/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      API Key
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Use this key for manual configuration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(credentials.api_key, "key")}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      copyError === "key"
                        ? "text-red-500 bg-red-500/10 hover:bg-red-500/15"
                        : "text-[#069494] bg-[#069494]/10 hover:bg-[#069494]/15"
                    }`}
                  >
                    {copyLabel("key")}
                  </button>
                </div>
                <code className="block w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap">
                  {credentials.api_key}
                </code>
              </section>

              {/* How to Connect */}
              <section className="space-y-3 p-4 rounded-xl border border-[var(--border)]">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  How to Connect
                </h3>
                <ol className="space-y-2.5">
                  {[
                    "Open the PhotoBooth application on your booth PC.",
                    "Go to Settings → Connection and enter the 6-digit code shown above.",
                    "Your booth will connect automatically once the code is verified.",
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[#069494] text-white text-xs font-semibold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Security warning */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <svg
                  className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <title>Warning</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Keep these credentials secure. Anyone with access can control your booth.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
