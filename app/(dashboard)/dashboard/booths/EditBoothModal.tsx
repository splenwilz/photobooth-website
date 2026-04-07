"use client";

/**
 * EditBoothModal
 *
 * Focused modal for editing a booth's name and address.
 * Triggered from the booth row on the booths list page.
 *
 * The parent should remount this component per booth via `key={boothId}`,
 * so initial form state is always taken from the latest props.
 *
 * @see PATCH /api/v1/booths/{booth_id}
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useUpdateBoothSettings } from "@/core/api/booths";

interface EditBoothModalProps {
  isOpen: boolean;
  boothId: string | null;
  initialName: string;
  initialAddress: string;
  onClose: () => void;
}

export function EditBoothModal({
  isOpen,
  boothId,
  initialName,
  initialAddress,
  onClose,
}: EditBoothModalProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const nameId = `${reactId}-name`;
  const addressId = `${reactId}-address`;

  const [name, setName] = useState(initialName);
  const [address, setAddress] = useState(initialAddress);

  const { mutate: updateBooth, isPending, error } = useUpdateBoothSettings();

  // Track open state to ignore stale onSuccess callbacks if the modal closes
  // mid-mutation.
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Refs for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const trimmedName = name.trim();
  const trimmedAddress = address.trim();
  const hasNameChange = trimmedName !== initialName.trim();
  const hasAddressChange = trimmedAddress !== initialAddress.trim();
  const hasAnyChange = hasNameChange || hasAddressChange;
  const canSave = hasAnyChange && trimmedName.length > 0 && !isPending;

  const handleClose = useCallback(() => {
    if (isPending) return;
    onClose();
  }, [isPending, onClose]);

  // Escape to close, focus into modal on open, restore focus on close
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    nameInputRef.current?.focus();
    nameInputRef.current?.select();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boothId || !canSave) return;

    updateBooth(
      {
        boothId,
        ...(hasNameChange ? { name: trimmedName } : {}),
        ...(hasAddressChange ? { address: trimmedAddress } : {}),
      },
      {
        onSuccess: () => {
          if (isOpenRef.current) {
            onClose();
          }
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close edit booth modal"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={handleClose}
        tabIndex={-1}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg mx-4 bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2
              id={titleId}
              className="text-xl font-semibold text-zinc-900 dark:text-white"
            >
              Edit Booth
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Update the booth name and address
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500">{error.message}</p>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor={nameId}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Booth Name
            </label>
            <input
              id={nameId}
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Downtown Mall Booth"
              required
              minLength={1}
              maxLength={100}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50"
            />
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <label
              htmlFor={addressId}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Address
            </label>
            <input
              id={addressId}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., 123 Main Street, City, State"
              maxLength={200}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="flex-1 px-4 py-3 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
