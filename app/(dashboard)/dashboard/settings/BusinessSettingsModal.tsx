"use client";

/**
 * BusinessSettingsModal
 *
 * Comprehensive branding surface for operators. Manages account-level settings
 * (business name, display-name-on-booths toggle, account logo) and booth-level
 * settings (booth name, display name, address, custom booth logo).
 *
 * Mirrors the mobile app's BusinessSettingsModal: toggle saves immediately with
 * revert-on-error, text fields are batched on Save, and logo upload/delete are
 * independent mutations with their own inline feedback.
 *
 * @see PATCH /api/v1/users/{user_id}
 * @see PATCH /api/v1/booths/{booth_id}
 * @see PUT/DELETE /api/v1/users/{user_id}/logo
 * @see PUT/DELETE /api/v1/booths/{booth_id}/logo
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  useBoothBusinessSettings,
  useDeleteBoothLogo,
  useUpdateBoothSettings,
  useUploadBoothLogo,
} from "@/core/api/booths";
import {
  useDeleteAccountLogo,
  useUpdateBusinessName,
  useUploadAccountLogo,
  useUserProfile,
} from "@/core/api/users";

interface BusinessSettingsModalProps {
  isOpen: boolean;
  userId: string | null;
  /** When null, the modal only exposes account-level fields */
  boothId: string | null;
  /** Current booth name (for initial form value) */
  boothName?: string;
  onClose: () => void;
}

type LogoTarget = "account" | "booth";

export function BusinessSettingsModal({
  isOpen,
  userId,
  boothId,
  boothName: initialBoothName,
  onClose,
}: BusinessSettingsModalProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const businessNameId = `${reactId}-business-name`;
  const boothNameId = `${reactId}-booth-name`;
  const displayNameId = `${reactId}-display-name`;
  const addressId = `${reactId}-address`;

  // ── Data ─────────────────────────────────────────────────────────────
  const { data: userProfile } = useUserProfile(isOpen ? userId : null);
  const { data: boothSettings, isFetching: isBoothSettingsFetching } =
    useBoothBusinessSettings(isOpen ? boothId : null);

  // ── Mutations ────────────────────────────────────────────────────────
  const updateBusinessNameMutation = useUpdateBusinessName();
  const updateBoothSettingsMutation = useUpdateBoothSettings();
  const uploadAccountLogoMutation = useUploadAccountLogo();
  const deleteAccountLogoMutation = useDeleteAccountLogo();
  const uploadBoothLogoMutation = useUploadBoothLogo();
  const deleteBoothLogoMutation = useDeleteBoothLogo();

  // ── Form state ───────────────────────────────────────────────────────
  const [businessName, setBusinessName] = useState("");
  const [boothName, setBoothName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [address, setAddress] = useState("");
  const [useDisplayNameOnBooths, setUseDisplayNameOnBooths] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Logo preview object URLs (optimistic, cleared after upload completes/fails)
  const [accountLogoPreview, setAccountLogoPreview] = useState<string | null>(
    null,
  );
  const [boothLogoPreview, setBoothLogoPreview] = useState<string | null>(null);

  const hasPopulated = useRef(false);
  const populatedForBoothId = useRef<string | null>(null);
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Focus management
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Populate form once data is fresh ─────────────────────────────────
  // Reset on close + populate once from async queries. Gated by hasPopulated
  // and !isOpen so this runs at most twice per modal lifecycle.
  useEffect(() => {
    if (!isOpen) {
      hasPopulated.current = false;
      populatedForBoothId.current = null;
      /* eslint-disable react-hooks/set-state-in-effect -- form reset on close */
      setBusinessName("");
      setBoothName("");
      setDisplayName("");
      setAddress("");
      setUseDisplayNameOnBooths(false);
      setFormError(null);
      // Drop any unsaved logo previews so re-opening doesn't show a stale
      // local object URL shadowing the server's logo_url. The modal component
      // itself isn't unmounted (parent keeps it rendered), so state survives
      // close unless we reset it explicitly.
      if (accountLogoPreview) {
        URL.revokeObjectURL(accountLogoPreview);
        setAccountLogoPreview(null);
      }
      if (boothLogoPreview) {
        URL.revokeObjectURL(boothLogoPreview);
        setBoothLogoPreview(null);
      }
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    // Re-populate if the booth changed while the modal stayed open
    // (e.g. the parent's booth selector flipped underneath us).
    if (
      hasPopulated.current &&
      populatedForBoothId.current !== (boothId ?? null)
    ) {
      hasPopulated.current = false;
    }

    if (hasPopulated.current) return;
    if (isBoothSettingsFetching) return;

    const hasUserData = !!userProfile;
    const hasBoothData = !boothId || !!boothSettings;
    if (!hasUserData || !hasBoothData) return;

    setBusinessName(userProfile?.business_name ?? "");
    setBoothName(initialBoothName ?? "");
    setDisplayName(boothSettings?.display_name ?? "");
    setAddress(boothSettings?.address ?? "");
    setUseDisplayNameOnBooths(
      boothSettings?.use_display_name_on_booths ??
        userProfile?.use_display_name_on_booths ??
        false,
    );
    hasPopulated.current = true;
    populatedForBoothId.current = boothId ?? null;
  }, [
    isOpen,
    userProfile,
    boothSettings,
    boothId,
    isBoothSettingsFetching,
    initialBoothName,
    accountLogoPreview,
    boothLogoPreview,
  ]);

  // ── Cleanup logo preview object URLs to avoid memory leaks ───────────
  useEffect(() => {
    return () => {
      if (accountLogoPreview) URL.revokeObjectURL(accountLogoPreview);
      if (boothLogoPreview) URL.revokeObjectURL(boothLogoPreview);
    };
  }, [accountLogoPreview, boothLogoPreview]);

  // ── Change detection ─────────────────────────────────────────────────
  const trimmedBusinessName = businessName.trim();
  const trimmedBoothName = boothName.trim();
  const trimmedDisplayName = displayName.trim();
  const trimmedAddress = address.trim();

  const hasBusinessNameChange =
    trimmedBusinessName !== (userProfile?.business_name ?? "").trim();
  const hasBoothNameChange =
    boothId != null && trimmedBoothName !== (initialBoothName ?? "").trim();
  const hasDisplayNameChange =
    boothId != null &&
    trimmedDisplayName !== (boothSettings?.display_name ?? "").trim();
  const hasAddressChange =
    boothId != null &&
    trimmedAddress !== (boothSettings?.address ?? "").trim();

  const hasBoothSettingsChange =
    hasBoothNameChange || hasDisplayNameChange || hasAddressChange;
  const hasAnyChange = hasBusinessNameChange || hasBoothSettingsChange;

  const isTogglePending = updateBusinessNameMutation.isPending;
  const isSaving =
    updateBusinessNameMutation.isPending ||
    updateBoothSettingsMutation.isPending;
  const isLogoPending =
    uploadAccountLogoMutation.isPending ||
    deleteAccountLogoMutation.isPending ||
    uploadBoothLogoMutation.isPending ||
    deleteBoothLogoMutation.isPending;
  const isProcessing = isSaving || isLogoPending;

  const canSave =
    hasAnyChange &&
    !isSaving &&
    (!hasBoothNameChange || trimmedBoothName.length > 0);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (isProcessing) return;
    onClose();
  }, [isProcessing, onClose]);

  // Escape to close, focus management
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    firstInputRef.current?.focus();

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

  const handleToggleUseDisplayName = async (next: boolean) => {
    if (!userId || isSaving) return;
    const previous = useDisplayNameOnBooths;
    setUseDisplayNameOnBooths(next);
    try {
      await updateBusinessNameMutation.mutateAsync({
        userId,
        use_display_name_on_booths: next,
      });
    } catch (error) {
      setUseDisplayNameOnBooths(previous);
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to update display name setting.",
      );
    }
  };

  const handlePickLogo = async (
    target: LogoTarget,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // Reset so picking the same file twice re-fires onChange
    if (!file) return;

    // Guard identifiers up front so we don't create an object URL we can't use
    if (target === "account" && !userId) return;
    if (target === "booth" && !boothId) return;

    const previewUrl = URL.createObjectURL(file);
    if (target === "account") {
      if (accountLogoPreview) URL.revokeObjectURL(accountLogoPreview);
      setAccountLogoPreview(previewUrl);
    } else {
      if (boothLogoPreview) URL.revokeObjectURL(boothLogoPreview);
      setBoothLogoPreview(previewUrl);
    }

    try {
      if (target === "account") {
        await uploadAccountLogoMutation.mutateAsync({ userId: userId!, file });
      } else {
        await uploadBoothLogoMutation.mutateAsync({ boothId: boothId!, file });
      }
      // Clear the local preview so the fresh presigned URL from the refetched
      // query takes over rendering. Otherwise the local object URL permanently
      // shadows the server-side logo_url until the modal is reopened.
      if (target === "account") {
        URL.revokeObjectURL(previewUrl);
        setAccountLogoPreview(null);
      } else {
        URL.revokeObjectURL(previewUrl);
        setBoothLogoPreview(null);
      }
      setFormError(null);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to upload logo.",
      );
      URL.revokeObjectURL(previewUrl);
      if (target === "account") {
        setAccountLogoPreview(null);
      } else {
        setBoothLogoPreview(null);
      }
    }
  };

  const handleDeleteLogo = async (target: LogoTarget) => {
    try {
      if (target === "account") {
        if (!userId) return;
        await deleteAccountLogoMutation.mutateAsync({ userId });
        if (accountLogoPreview) {
          URL.revokeObjectURL(accountLogoPreview);
          setAccountLogoPreview(null);
        }
      } else {
        if (!boothId) return;
        await deleteBoothLogoMutation.mutateAsync({ boothId });
        if (boothLogoPreview) {
          URL.revokeObjectURL(boothLogoPreview);
          setBoothLogoPreview(null);
        }
      }
      setFormError(null);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to remove logo.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    setFormError(null);

    const errors: string[] = [];

    // Save booth settings first so display_name/address persist before the
    // account mutation invalidates booth caches.
    if (hasBoothSettingsChange && boothId) {
      try {
        await updateBoothSettingsMutation.mutateAsync({
          boothId,
          ...(hasBoothNameChange ? { name: trimmedBoothName } : {}),
          ...(hasDisplayNameChange
            ? { display_name: trimmedDisplayName }
            : {}),
          ...(hasAddressChange ? { address: trimmedAddress } : {}),
        });
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error.message
            : "Failed to save booth settings.",
        );
      }
    }

    if (hasBusinessNameChange && userId) {
      try {
        await updateBusinessNameMutation.mutateAsync({
          userId,
          // Empty string clears the field — send null so the backend treats it as clear
          business_name: trimmedBusinessName.length === 0 ? null : trimmedBusinessName,
        });
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error.message
            : "Failed to save business name.",
        );
      }
    }

    if (errors.length > 0) {
      setFormError(errors.join(" "));
      return;
    }

    if (isOpenRef.current) onClose();
  };

  if (!isOpen) return null;

  const effectiveAccountLogo =
    accountLogoPreview ?? userProfile?.logo_url ?? null;
  const effectiveBoothLogo =
    boothLogoPreview ?? boothSettings?.custom_logo_url ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close business settings"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={handleClose}
        tabIndex={-1}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[var(--border)] bg-white dark:bg-[#111111]">
          <div>
            <h2
              id={titleId}
              className="text-xl font-semibold text-zinc-900 dark:text-white"
            >
              Business Settings
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {boothId
                ? "Manage your business branding and this booth's settings"
                : "Manage your business branding"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
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

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {formError && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <p className="text-sm text-red-500">{formError}</p>
            </div>
          )}

          {/* Account Section */}
          <section className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Account
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Shared across every booth on your account
              </p>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <label
                htmlFor={businessNameId}
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Business Name
              </label>
              <input
                id={businessNameId}
                ref={firstInputRef}
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Joe's Photo Studio"
                maxLength={255}
                disabled={isSaving}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50"
              />
              <p className="text-xs text-zinc-500">
                Leave blank to clear. Shown on booths when the toggle below is on.
              </p>
            </div>

            {/* Use Business Name on All Booths toggle */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-[var(--border)]">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Use Business Name on All Booths
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  When on, every booth displays your business name instead of its own display name.
                </p>
              </div>
              <ToggleSwitch
                enabled={useDisplayNameOnBooths}
                onChange={handleToggleUseDisplayName}
                disabled={isTogglePending || isSaving}
                ariaLabel="Use business name on all booths"
              />
            </div>

            {/* Account Logo */}
            <LogoField
              label="Account Logo"
              description="Default logo applied to every booth unless overridden."
              logoUrl={effectiveAccountLogo}
              onPick={(event) => handlePickLogo("account", event)}
              onDelete={() => handleDeleteLogo("account")}
              isUploading={uploadAccountLogoMutation.isPending}
              isDeleting={deleteAccountLogoMutation.isPending}
              disabled={!userId || isSaving}
            />
          </section>

          {/* Booth Section */}
          {boothId && (
            <section className="space-y-5 pt-2 border-t border-[var(--border)]">
              <div className="pt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  This Booth
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Settings for the currently selected booth
                </p>
              </div>

              {/* Booth Name */}
              <div className="space-y-2">
                <label
                  htmlFor={boothNameId}
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Booth Name
                </label>
                <input
                  id={boothNameId}
                  type="text"
                  value={boothName}
                  onChange={(e) => setBoothName(e.target.value)}
                  placeholder="e.g., Downtown Mall Booth"
                  required
                  minLength={1}
                  maxLength={100}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50"
                />
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <label
                  htmlFor={displayNameId}
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Display Name
                </label>
                <input
                  id={displayNameId}
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Shown on the welcome screen"
                  maxLength={255}
                  disabled={useDisplayNameOnBooths || isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50"
                />
                <p className="text-xs text-zinc-500">
                  {useDisplayNameOnBooths
                    ? "Disabled because your business name is being used on all booths."
                    : "Shown on this booth's welcome screen."}
                </p>
              </div>

              {/* Address */}
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
                  maxLength={500}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50"
                />
              </div>

              {/* Booth Logo */}
              <LogoField
                label="Booth Logo"
                description="Overrides the account logo for this booth only."
                logoUrl={effectiveBoothLogo}
                onPick={(event) => handlePickLogo("booth", event)}
                onDelete={() => handleDeleteLogo("booth")}
                isUploading={uploadBoothLogoMutation.isPending}
                isDeleting={deleteBoothLogoMutation.isPending}
                disabled={isSaving}
              />
            </section>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-[#111111]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="flex-1 px-4 py-3 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? (
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

// ============================================================================
// Helper components
// ============================================================================

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
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#069494] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0a0a0a] ${
        enabled ? "bg-[#069494]" : "bg-zinc-300 dark:bg-zinc-600"
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

function LogoField({
  label,
  description,
  logoUrl,
  onPick,
  onDelete,
  isUploading,
  isDeleting,
  disabled,
}: {
  label: string;
  description: string;
  logoUrl: string | null;
  onPick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  isUploading: boolean;
  isDeleting: boolean;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const isBusy = isUploading || isDeleting;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      </div>
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-[var(--border)]">
        <div className="w-20 h-20 shrink-0 rounded-xl bg-white dark:bg-zinc-800 border border-[var(--border)] overflow-hidden flex items-center justify-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- presigned S3 URL, not optimizable
            <img
              src={logoUrl}
              alt={label}
              className="w-full h-full object-contain"
            />
          ) : (
            <svg
              className="w-8 h-8 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <title>No logo</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-xs text-zinc-500">{description}</p>
          <div className="flex gap-2">
            <input
              id={inputId}
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onPick}
              disabled={disabled || isBusy}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isBusy}
              className="px-3 py-2 rounded-lg bg-[#069494]/15 text-[#069494] text-sm font-medium hover:bg-[#069494]/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-3 h-3 border-2 border-[#069494] border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : logoUrl ? (
                "Replace"
              ) : (
                "Upload"
              )}
            </button>
            {logoUrl && (
              <button
                type="button"
                onClick={onDelete}
                disabled={disabled || isBusy}
                className="px-3 py-2 rounded-lg border border-[var(--border)] text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
