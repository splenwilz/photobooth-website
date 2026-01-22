"use client";

/**
 * Settings Page
 *
 * Booth configuration and account settings.
 * Matches the structure of the mobile app settings.
 *
 * @see photobooth-app/app/(tabs)/settings.tsx
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useBoothList,
  useBoothPricing,
  useRestartBoothApp,
  useRestartBoothSystem,
  useCancelBoothRestart,
  useDeleteBooth,
} from "@/core/api/booths";
import { useBoothCredits } from "@/core/api/credits";
import type { ProductPricingInfo } from "@/core/api/booths/types";
import type { AuthUser } from "@/core/api/auth/types";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  showArrow?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  value,
  showArrow = true,
  destructive = false,
  disabled = false,
  loading = false,
  onClick,
}: SettingsItemProps) {
  const accentColor = destructive ? "#EF4444" : "#0891B2";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all text-left ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        {loading ? (
          <div
            className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: accentColor, borderTopColor: "transparent" }}
          />
        ) : (
          <div style={{ color: accentColor }}>{icon}</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-zinc-900 dark:text-white">{title}</p>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {value}
          </span>
        )}
        {showArrow && (
          <svg
            className="w-5 h-5 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Get user from auth_user cookie (client-side)
function getUserFromCookie(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_user="));
    if (!cookie) return null;
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return null;
  }
}

// Get user initials
function getInitials(user: AuthUser | null): string {
  if (!user) return "U";
  const first = user.first_name?.[0] ?? "";
  const last = user.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || "U";
}

// Confirmation modal component
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

// Section header component
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
      {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`} />;
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showBoothSelector, setShowBoothSelector] = useState(false);

  // Get booth ID from URL search params (null = all booths)
  const selectedBoothId = searchParams.get("booth");

  // Confirmation modals
  const [restartAppModal, setRestartAppModal] = useState(false);
  const [restartSystemModal, setRestartSystemModal] = useState(false);
  const [deleteBoothModal, setDeleteBoothModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  // API hooks
  const { data: boothListData, isLoading: boothsLoading } = useBoothList();
  const booths = boothListData?.booths ?? [];

  // Check if "All Booths" mode is active OR if user has no booths
  const hasNoBooths = booths.length === 0;
  const isAllBoothsMode = !selectedBoothId || hasNoBooths;

  // Get the actual booth ID (null if "All Booths" mode)
  const effectiveBoothId = isAllBoothsMode ? null : selectedBoothId;

  const { data: creditsData, isLoading: creditsLoading } =
    useBoothCredits(effectiveBoothId);
  const { data: pricingData } = useBoothPricing(effectiveBoothId);

  const { mutate: restartApp, isPending: restartingApp } = useRestartBoothApp();
  const { mutate: restartSystem, isPending: restartingSystem } =
    useRestartBoothSystem();
  const { mutate: cancelRestart, isPending: cancellingRestart } =
    useCancelBoothRestart();
  const { mutate: deleteBooth, isPending: deletingBooth } = useDeleteBooth();

  // Load user from cookie on mount
  useEffect(() => {
    setUser(getUserFromCookie());
  }, []);

  const selectedBooth = booths.find((b) => b.id === selectedBoothId);

  // Update URL to select a booth
  const setSelectedBooth = (boothId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (boothId) {
      params.set("booth", boothId);
    } else {
      params.delete("booth");
    }
    router.push(`/dashboard/settings?${params.toString()}`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/signin");
    }
  };

  // Handle restart app
  const handleRestartApp = () => {
    if (!effectiveBoothId) return;
    restartApp(
      { boothId: effectiveBoothId, delay_seconds: 5 },
      {
        onSuccess: () => {
          setRestartAppModal(false);
        },
      }
    );
  };

  // Handle restart system
  const handleRestartSystem = () => {
    if (!effectiveBoothId) return;
    restartSystem(
      { boothId: effectiveBoothId, delay_seconds: 15 },
      {
        onSuccess: () => {
          setRestartSystemModal(false);
        },
      }
    );
  };

  // Handle cancel restart
  const handleCancelRestart = () => {
    if (!effectiveBoothId) return;
    cancelRestart({ boothId: effectiveBoothId });
  };

  // Handle delete booth
  const handleDeleteBooth = () => {
    if (!effectiveBoothId) return;
    deleteBooth(
      { boothId: effectiveBoothId },
      {
        onSuccess: () => {
          setDeleteBoothModal(false);
          // Reset to "All Booths" mode after deletion
          setSelectedBooth(null);
        },
      }
    );
  };

  // Build products array from pricing data
  const products = pricingData?.pricing
    ? [
        {
          id: "PhotoStrips",
          name: "Photo Strips",
          description: "2x6 photo strip prints",
          pricing: pricingData.pricing.PhotoStrips,
        },
        {
          id: "Photo4x6",
          name: "4x6 Photo",
          description: "Standard 4x6 photo prints",
          pricing: pricingData.pricing.Photo4x6,
        },
        {
          id: "SmartphonePrint",
          name: "Smartphone Print",
          description: "Print from phone gallery",
          pricing: pricingData.pricing.SmartphonePrint,
        },
      ].filter((p) => p.pricing)
    : [];

  // Loading state with skeletons
  if (boothsLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-5 w-72 mt-2 rounded-lg" />
        </div>

        {/* User Profile Section */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-4 w-48 mt-2 rounded" />
            </div>
          </div>
        </div>

        {/* Current Booth Section */}
        <section>
          <div className="mb-3">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-4 w-24 mt-1 rounded-lg" />
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-4 w-48 mt-1 rounded" />
              </div>
              <Skeleton className="w-5 h-5 rounded" />
            </div>
          </div>
        </section>

        {/* Credits Section */}
        <section>
          <div className="mb-3">
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-4 w-36 mt-1 rounded-lg" />
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="text-center mb-6">
              <Skeleton className="h-3 w-28 mx-auto rounded" />
              <Skeleton className="h-12 w-24 mx-auto mt-2 rounded" />
              <Skeleton className="h-4 w-16 mx-auto mt-2 rounded" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="flex-1 h-12 rounded-xl" />
              <Skeleton className="flex-1 h-12 rounded-xl" />
            </div>
          </div>
        </section>

        {/* Booth Management Section */}
        <section>
          <div className="mb-3">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-4 w-48 mt-1 rounded-lg" />
          </div>
          <div className="space-y-3">
            {["item-1", "item-2", "item-3", "item-4"].map((key) => (
              <div key={key} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-36 rounded" />
                    <Skeleton className="h-4 w-48 mt-1 rounded" />
                  </div>
                  <Skeleton className="w-5 h-5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section>
          <div className="mb-3">
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
          <div className="space-y-3">
            {["about-1", "about-2", "about-3", "about-4"].map((key) => (
              <div key={key} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-28 rounded" />
                    <Skeleton className="h-4 w-44 mt-1 rounded" />
                  </div>
                  <Skeleton className="w-5 h-5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Configure your booth and account preferences
        </p>
      </div>

      {/* User Profile Section */}
      <section>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center gap-4">
            {/* Avatar with initials */}
            <div className="w-16 h-16 rounded-full bg-[#0891B2]/15 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#0891B2]">
                {getInitials(user)}
              </span>
            </div>
            {/* User Info */}
            <div className="flex-1">
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {user ? `${user.first_name} ${user.last_name}`.trim() : "User"}
              </p>
              <p className="text-sm text-zinc-500">{user?.email ?? ""}</p>
            </div>
          </div>
        </div>
      </section>

      {/* All Booths Mode / No Booths Notice */}
      {isAllBoothsMode && (
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
              {hasNoBooths ? "No Booths Yet" : "All Booths Mode"}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {hasNoBooths
                ? "Create your first booth from the Booths tab to access booth-specific settings like credits, pricing, and hardware."
                : "Select a specific booth to access booth-specific settings like credits, pricing, and hardware."}
            </p>
          </div>
        </div>
      )}

      {/* Current Booth Section - Only show if booths exist */}
      {!hasNoBooths && (
        <section>
          <SectionHeader
            title="Current Booth"
            subtitle={selectedBooth?.name ?? "All Booths"}
          />

          {/* Booth Selector */}
          <div className="relative">
            <button
              onClick={() => setShowBoothSelector(!showBoothSelector)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0891B2]/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#0891B2]"
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
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    {selectedBooth?.name ?? "All Booths"}
                  </p>
                  {selectedBooth && (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedBooth.status === "online"
                          ? "bg-green-500"
                          : selectedBooth.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                  )}
                </div>
                <p className="text-sm text-zinc-500">
                  {selectedBooth?.address ?? `${booths.length} booth${booths.length !== 1 ? "s" : ""} available`}
                </p>
              </div>
              <svg
                className={`w-5 h-5 text-zinc-500 transition-transform ${
                  showBoothSelector ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* Booth Dropdown */}
            {showBoothSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111111] border border-[var(--border)] rounded-xl shadow-lg z-10 overflow-hidden">
                {/* All Booths Option */}
                <button
                  onClick={() => {
                    setSelectedBooth(null);
                    setShowBoothSelector(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors ${
                    !selectedBoothId ? "bg-[#0891B2]/10" : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#0891B2]" />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-zinc-900 dark:text-white">
                      All Booths
                    </p>
                    <p className="text-xs text-zinc-500">
                      View aggregated data
                    </p>
                  </div>
                  {!selectedBoothId && (
                    <svg
                      className="w-5 h-5 text-[#0891B2]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Individual Booths */}
                {booths.map((booth) => (
                  <button
                    key={booth.id}
                    onClick={() => {
                      setSelectedBooth(booth.id);
                      setShowBoothSelector(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors ${
                      booth.id === selectedBoothId ? "bg-[#0891B2]/10" : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        booth.status === "online"
                          ? "bg-green-500"
                          : booth.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {booth.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {booth.address ?? "No address"}
                      </p>
                    </div>
                    {booth.id === selectedBoothId && (
                      <svg
                        className="w-5 h-5 text-[#0891B2]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Credits Section - Hidden in All Booths mode */}
      {!isAllBoothsMode && selectedBooth && (
        <section>
          <SectionHeader title="Credits" subtitle="Manage booth credits" />

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            {/* Credits Balance */}
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
                {selectedBooth.name} Balance
              </p>
              {creditsLoading ? (
                <p className="text-4xl font-bold text-zinc-400">Loading...</p>
              ) : (
                <p className="text-5xl font-bold text-[#0891B2]">
                  {creditsData?.credit_balance?.toLocaleString() ?? 0}
                </p>
              )}
              <p className="text-sm text-zinc-500 mt-1">credits</p>
            </div>

            {/* Credits Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] transition-colors">
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add Credits
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0891B2]/15 text-[#0891B2] font-medium hover:bg-[#0891B2]/25 transition-colors">
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                History
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Products & Pricing - Hidden in All Booths mode */}
      {!isAllBoothsMode && selectedBooth && products.length > 0 && (
        <section>
          <SectionHeader
            title="Products & Pricing"
            subtitle="Configure available products"
          />
          <div className="space-y-3">
            {products.map((product) => (
              <SettingsItem
                key={product.id}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                }
                title={product.name}
                subtitle={product.description}
                value={formatCurrency(product.pricing!.price)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Booth Management - Hidden in All Booths mode */}
      {!isAllBoothsMode && selectedBooth && (
        <section>
          <SectionHeader
            title="Booth Management"
            subtitle="Connection and system controls"
          />
          <div className="space-y-3">
            <SettingsItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
              }
              title="Connection Details"
              subtitle="View or generate registration code"
            />
            <SettingsItem
              icon={
                <svg
                  className="w-5 h-5"
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
              }
              title="Restart Booth App"
              subtitle={
                restartingApp ? "Sending..." : "Restart the booth software"
              }
              loading={restartingApp}
              onClick={() => setRestartAppModal(true)}
            />
            <SettingsItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
                  />
                </svg>
              }
              title="Reboot System"
              subtitle={
                restartingSystem ? "Sending..." : "Reboot the entire PC"
              }
              loading={restartingSystem}
              onClick={() => setRestartSystemModal(true)}
            />
            <SettingsItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              }
              title="Cancel Restart"
              subtitle={
                cancellingRestart ? "Sending..." : "Cancel pending restart"
              }
              loading={cancellingRestart}
              onClick={handleCancelRestart}
            />
            <SettingsItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              }
              title="Delete Booth"
              subtitle="Permanently remove this booth"
              destructive
              loading={deletingBooth}
              onClick={() => setDeleteBoothModal(true)}
            />
          </div>
        </section>
      )}

      {/* About Section */}
      <section>
        <SectionHeader title="About" />
        <div className="space-y-3">
          <SettingsItem
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            }
            title="App Version"
            value="1.0.0"
            showArrow={false}
          />
          <SettingsItem
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            }
            title="Terms of Service"
            subtitle="Read our terms and conditions"
          />
          <SettingsItem
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            }
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
          />
          <SettingsItem
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            }
            title="Logout"
            subtitle="Sign out of your account"
            destructive
            onClick={() => setLogoutModal(true)}
          />
        </div>
      </section>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={restartAppModal}
        title="Restart Booth App"
        message={`This will restart the booth software on "${selectedBooth?.name}". The booth will be offline for about 30 seconds.`}
        confirmLabel="Restart"
        onConfirm={handleRestartApp}
        onCancel={() => setRestartAppModal(false)}
        isPending={restartingApp}
      />

      <ConfirmModal
        isOpen={restartSystemModal}
        title="Reboot System"
        message={`This will reboot the entire PC for "${selectedBooth?.name}". The booth will be offline for several minutes. Are you sure?`}
        confirmLabel="Reboot"
        onConfirm={handleRestartSystem}
        onCancel={() => setRestartSystemModal(false)}
        isPending={restartingSystem}
      />

      <ConfirmModal
        isOpen={deleteBoothModal}
        title="Delete Booth"
        message={`Are you sure you want to permanently delete "${selectedBooth?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Booth"
        confirmDestructive
        onConfirm={handleDeleteBooth}
        onCancel={() => setDeleteBoothModal(false)}
        isPending={deletingBooth}
      />

      <ConfirmModal
        isOpen={logoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        confirmDestructive
        onConfirm={handleLogout}
        onCancel={() => setLogoutModal(false)}
      />
    </div>
  );
}
