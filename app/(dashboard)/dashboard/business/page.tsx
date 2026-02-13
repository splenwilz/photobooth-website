"use client";

/**
 * Business Settings Page
 *
 * Account-level branding (business name, logo) and per-booth display settings
 * (custom logo, welcome screen text, visibility toggles).
 */

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import {
  useUserProfile,
  useUpdateUserProfile,
  useUploadAccountLogo,
  useDeleteAccountLogo,
  useBoothBusinessSettings,
  useUpdateBoothSettings,
  useUploadBoothLogo,
  useDeleteBoothLogo,
} from "@/core/api/business-settings";
import { useBoothList } from "@/core/api/booths";

// ============================================================================
// Shared Components
// ============================================================================

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`}
    />
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
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

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmDestructive = false,
  onConfirm,
  onCancel,
  isPending = false,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)] p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 mt-2">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              confirmDestructive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-[#0891B2] text-white hover:bg-[#0E7490]"
            } disabled:opacity-50`}
          >
            {isPending && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Logo Upload Component
// ============================================================================

function LogoUploadArea({
  logoUrl,
  onUpload,
  onRemove,
  isUploading,
  isRemoving,
  label,
}: {
  logoUrl: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isUploading: boolean;
  isRemoving: boolean;
  label: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeModal, setRemoveModal] = useState(false);
  const wasUploadingRef = useRef(false);

  // Clear preview when upload transitions from uploading -> done
  useEffect(() => {
    if (wasUploadingRef.current && !isUploading && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cleanup after async upload completes
      setPreviewUrl(null);
    }
    wasUploadingRef.current = isUploading;
  }, [isUploading, previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a PNG or JPG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    onUpload(file);

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUrl = previewUrl || logoUrl;

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Logo preview */}
        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--border)] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-900 shrink-0">
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
          ) : displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- presigned S3 URLs with dynamic domains
            <img
              src={displayUrl}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
          )}
        </div>

        {/* Actions */}
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            {label}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">PNG or JPG, max 5MB</p>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : displayUrl ? "Replace" : "Upload"}
            </button>
            {logoUrl && (
              <button
                type="button"
                onClick={() => setRemoveModal(true)}
                disabled={isRemoving || isUploading}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <ConfirmModal
        isOpen={removeModal}
        title="Remove Logo"
        message={`Are you sure you want to remove this logo? ${label === "Account Logo" ? "All booths using the account logo will have no logo." : "This booth will revert to using the account logo."}`}
        confirmLabel="Remove"
        confirmDestructive
        onConfirm={() => {
          setRemoveModal(false);
          onRemove();
        }}
        onCancel={() => setRemoveModal(false)}
        isPending={isRemoving}
      />
    </>
  );
}

// ============================================================================
// Inline Editable Text Field
// ============================================================================

function EditableField({
  label,
  value,
  onSave,
  isSaving,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
  isSaving: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  const [editValue, setEditValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  // Sync external value changes when not actively editing
  useEffect(() => {
    if (!isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync prop -> state when not editing
      setEditValue(value);
    }
  }, [value, isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            if (!isEditing) setIsEditing(true);
          }}
          onFocus={() => setIsEditing(true)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-all text-sm"
        />
        {isEditing && editValue.trim() !== value && (
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-2.5 rounded-xl bg-[#0891B2] text-white text-sm font-medium hover:bg-[#0E7490] transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Account Settings Section
// ============================================================================

function AccountSettingsSection({ userId }: { userId: string | null }) {
  const { data: profile, isLoading, error } = useUserProfile(userId);
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateUserProfile();
  const { mutate: uploadLogo, isPending: isUploadingLogo } =
    useUploadAccountLogo();
  const { mutate: deleteLogo, isPending: isDeletingLogo } =
    useDeleteAccountLogo();

  if (!userId) {
    return null;
  }

  if (isLoading) {
    return (
      <section>
        <div className="mb-3">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="h-4 w-56 mt-1 rounded-lg" />
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-xl" />
            <div>
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-32 mt-1 rounded" />
              <Skeleton className="h-7 w-16 mt-2 rounded-lg" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-28 rounded mb-1.5" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <SectionHeader
          title="Account Settings"
          subtitle="Business name and logo for all booths"
        />
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load account settings. Please try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        title="Account Settings"
        subtitle="Business name and logo applied to all booths by default"
      />
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-6">
        {/* Account Logo */}
        <LogoUploadArea
          logoUrl={profile?.logo_url ?? null}
          onUpload={(file) => uploadLogo({ userId, file })}
          onRemove={() => deleteLogo({ userId })}
          isUploading={isUploadingLogo}
          isRemoving={isDeletingLogo}
          label="Account Logo"
        />

        {/* Divider */}
        <div className="border-t border-[var(--border)]" />

        {/* Business Name */}
        <EditableField
          label="Business Name"
          value={profile?.business_name ?? ""}
          placeholder="Enter your business name"
          maxLength={255}
          isSaving={isUpdating}
          onSave={(value) =>
            updateProfile({ userId, business_name: value })
          }
        />
      </div>
    </section>
  );
}

// ============================================================================
// Booth Settings Section
// ============================================================================

function BoothSettingsSection({ boothId }: { boothId: string }) {
  const { data: settings, isLoading, error } =
    useBoothBusinessSettings(boothId);
  const { mutate: updateSettings } = useUpdateBoothSettings();
  const { mutate: uploadLogo, isPending: isUploadingLogo } =
    useUploadBoothLogo();
  const { mutate: deleteLogo, isPending: isDeletingLogo } =
    useDeleteBoothLogo();

  if (isLoading) {
    return (
      <>
        {/* Logo section skeleton */}
        <section>
          <div className="mb-3">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-4 w-48 mt-1 rounded-lg" />
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-xl" />
              <div>
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-32 mt-1 rounded" />
                <Skeleton className="h-7 w-16 mt-2 rounded-lg" />
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
          </div>
        </section>
        {/* Welcome section skeleton */}
        <section>
          <div className="mb-3">
            <Skeleton className="h-6 w-36 rounded-lg" />
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <section>
        <SectionHeader
          title="Booth Branding"
          subtitle="Per-booth logo and display settings"
        />
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load booth settings. Please try again.
          </p>
        </div>
      </section>
    );
  }

  if (!settings) return null;

  const handleToggle = (
    field: string,
    value: boolean,
  ) => {
    updateSettings({ boothId, [field]: value });
  };

  return (
    <>
      {/* Logo Settings */}
      <section>
        <SectionHeader
          title="Booth Logo"
          subtitle="Override the account logo for this booth"
        />
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-5">
          {/* Custom Booth Logo Upload */}
          <LogoUploadArea
            logoUrl={settings.custom_logo_url}
            onUpload={(file) => uploadLogo({ boothId, file })}
            onRemove={() => deleteLogo({ boothId })}
            isUploading={isUploadingLogo}
            isRemoving={isDeletingLogo}
            label="Custom Booth Logo"
          />

          {/* Divider */}
          <div className="border-t border-[var(--border)]" />

          {/* Logo Toggles */}
          <div className="divide-y divide-[var(--border)]">
            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <p className="font-medium text-zinc-900 dark:text-white">
                  Use Custom Logo
                </p>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Override the account logo with this booth&apos;s custom logo
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.use_custom_logo}
                ariaLabel="Toggle use custom logo"
                onChange={(enabled) => handleToggle("use_custom_logo", enabled)}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <p className="font-medium text-zinc-900 dark:text-white">
                  Show Logo on Welcome Screen
                </p>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Display the logo on the booth&apos;s welcome screen
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.show_logo}
                ariaLabel="Toggle show logo on welcome screen"
                onChange={(enabled) => handleToggle("show_logo", enabled)}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <p className="font-medium text-zinc-900 dark:text-white">
                  Show Logo on Prints
                </p>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Include the logo on printed photos
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.show_logo_on_prints}
                ariaLabel="Toggle show logo on prints"
                onChange={(enabled) =>
                  handleToggle("show_logo_on_prints", enabled)
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Screen Settings */}
      <section>
        <SectionHeader
          title="Welcome Screen"
          subtitle="Customize what appears on the booth welcome screen"
        />
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] space-y-5">
          <div className="divide-y divide-[var(--border)]">
            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <p className="font-medium text-zinc-900 dark:text-white">
                  Show Business Name
                </p>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Display the business name on the welcome screen
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.show_business_name}
                ariaLabel="Toggle show business name"
                onChange={(enabled) =>
                  handleToggle("show_business_name", enabled)
                }
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <p className="font-medium text-zinc-900 dark:text-white">
                  Show Welcome Subtitle
                </p>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Display a custom tagline on the welcome screen
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.show_welcome_subtitle}
                ariaLabel="Toggle show welcome subtitle"
                onChange={(enabled) =>
                  handleToggle("show_welcome_subtitle", enabled)
                }
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border)]" />

          {/* Welcome Subtitle */}
          <EditableField
            label="Welcome Subtitle"
            value={settings.welcome_subtitle ?? ""}
            placeholder="e.g., Create Amazing Photo Memories"
            maxLength={255}
            isSaving={false}
            onSave={(value) =>
              updateSettings({
                boothId,
                welcome_subtitle: value || null,
              })
            }
          />
        </div>
      </section>

      {/* Location Settings */}
      <section>
        <SectionHeader
          title="Location"
          subtitle="Booth physical address"
        />
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <EditableField
            label="Address"
            value={settings.address ?? ""}
            placeholder="e.g., 123 Main Street, Downtown"
            maxLength={500}
            isSaving={false}
            onSave={(value) =>
              updateSettings({ boothId, address: value })
            }
          />
        </div>
      </section>
    </>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function BusinessSettingsPage() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const selectedBoothId = searchParams.get("booth");

  // Get booth list for the info notice
  const { data: boothListData } = useBoothList();
  const booths = boothListData?.booths ?? [];
  const selectedBooth = booths.find((b) => b.id === selectedBoothId);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Business Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Customize your business branding and booth display options
        </p>
      </div>

      {/* Account Settings (always visible) */}
      <AccountSettingsSection userId={user?.id ?? null} />

      {/* Booth-specific sections */}
      {selectedBoothId && selectedBooth ? (
        <>
          {/* Booth name indicator */}
          <div className="flex items-center gap-2 pt-2">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-sm font-medium text-zinc-500 px-2">
              {selectedBooth.name} Settings
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <BoothSettingsSection boothId={selectedBoothId} />
        </>
      ) : (
        /* Info notice to select a booth */
        <div className="p-4 rounded-xl bg-[#0891B2]/10 border border-[#0891B2]/30 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-[#0891B2] mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">
              Select a Booth
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              Choose a booth from the top bar to configure per-booth branding
              settings like custom logo, welcome screen text, and display
              toggles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
