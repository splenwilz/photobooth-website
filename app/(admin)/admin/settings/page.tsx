"use client";

/**
 * Admin Settings Page
 *
 * Dynamic platform configuration using the Settings API.
 */

import { useState, useEffect } from "react";
import {
  useAdminSettingsByCategory,
  useUpdateSetting,
  useResetSetting,
  type SettingCategory,
  type AdminSetting,
} from "@/core/api/admin/settings";
import {
  useAdminPricingPlans,
  type PricingPlan,
} from "@/core/api/admin/pricing-plans";

// Tab type that includes pricing
type TabId = SettingCategory | "pricing";

// Tab configuration - phased rollout
// Currently implemented: operational settings + pricing plans
// Future categories (billing, support, security, templates, notifications) will be added as needed
const TABS: { id: TabId; label: string }[] = [
  { id: "operational", label: "Operational" },
  { id: "pricing", label: "Pricing Plans" },
];

// Loading skeleton
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`} />
  );
}

// Setting input component based on data type
function SettingInput({
  setting,
  onUpdate,
  isUpdating,
}: {
  setting: AdminSetting;
  onUpdate: (value: number | boolean | string) => void;
  isUpdating: boolean;
}) {
  const [localValue, setLocalValue] = useState(setting.current_value);

  // Sync local value when setting changes from server (e.g., after reset)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync state with props
    setLocalValue(setting.current_value);
  }, [setting.current_value]);

  // Handle input change for different types
  const handleChange = (newValue: number | boolean | string) => {
    setLocalValue(newValue);
  };

  // Commit change on blur for text/number inputs
  const handleBlur = () => {
    if (localValue !== setting.current_value) {
      onUpdate(localValue);
    }
  };

  // Immediate update for boolean toggles
  const handleToggle = () => {
    const newValue = !localValue;
    setLocalValue(newValue);
    onUpdate(newValue);
  };

  // Render based on data type
  switch (setting.data_type) {
    case "boolean":
      return (
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            localValue ? "bg-[#0891B2]" : "bg-slate-300 dark:bg-zinc-700"
          } ${isUpdating ? "opacity-50" : ""}`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              localValue ? "left-7" : "left-1"
            }`}
          />
        </button>
      );

    case "integer": {
      const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value) || 0;
        setLocalValue(newValue);
        // Track change immediately (for spinner buttons that don't trigger blur)
        if (newValue !== setting.current_value) {
          onUpdate(newValue);
        }
      };
      return (
        <input
          type="number"
          value={localValue as number}
          min={setting.validation?.min}
          max={setting.validation?.max}
          onChange={handleNumberChange}
          disabled={isUpdating}
          className="w-32 px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2] disabled:opacity-50"
        />
      );
    }

    case "string":
      // Check if it's an enum (dropdown)
      if (setting.validation?.enum) {
        return (
          <select
            value={localValue as string}
            onChange={(e) => {
              handleChange(e.target.value);
              onUpdate(e.target.value);
            }}
            disabled={isUpdating}
            className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2] disabled:opacity-50"
          >
            {setting.validation.enum.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      }
      // Regular text input
      return (
        <input
          type="text"
          value={localValue as string}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          disabled={isUpdating}
          className="w-full max-w-md px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2] disabled:opacity-50"
        />
      );

    default:
      return null;
  }
}

// Single setting row component
function SettingRow({
  setting,
  onUpdate,
  onReset,
  isUpdating,
}: {
  setting: AdminSetting;
  onUpdate: (value: number | boolean | string) => void;
  onReset: () => void;
  isUpdating: boolean;
}) {
  const displayName = setting.name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Format validation info
  const validationInfo = setting.validation
    ? setting.data_type === "integer" && setting.validation.min !== undefined
      ? `Range: ${setting.validation.min} - ${setting.validation.max}`
      : null
    : null;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-zinc-900 dark:text-white">
              {displayName}
            </label>
            {!setting.is_default && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#0891B2]/20 text-[#0891B2]">
                Modified
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500 mt-1">{setting.description}</p>
          {validationInfo && (
            <p className="text-xs text-zinc-400 mt-1">{validationInfo}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <SettingInput
            setting={setting}
            onUpdate={onUpdate}
            isUpdating={isUpdating}
          />
          {!setting.is_default && (
            <button
              type="button"
              onClick={onReset}
              disabled={isUpdating}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-50"
              title={`Reset to default (${setting.default_value})`}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {setting.updated_at && (
        <p className="text-xs text-zinc-400 mt-3 pt-3 border-t border-[var(--border)]">
          Last updated by {setting.updated_by} on{" "}
          {new Date(setting.updated_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// Pricing plan card component (read-only)
function PlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {plan.name}
          </h3>
          <p className="text-sm text-zinc-500 mt-1">{plan.description || "No description"}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-lg text-zinc-900 dark:text-white">
              {plan.price_display}
            </span>
            {plan.has_annual_option && plan.annual_price_display && (
              <>
                <span className="text-zinc-400">|</span>
                <span className="text-green-600 dark:text-green-400">
                  {plan.annual_price_display}
                  {plan.annual_savings_display && (
                    <span className="text-xs ml-1">({plan.annual_savings_display})</span>
                  )}
                </span>
              </>
            )}
          </div>
          {plan.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {plan.features.map((feature) => (
                <span
                  key={feature}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Pricing plans settings component (read-only view)
function PricingPlansSettings() {
  const { data, isLoading, error } = useAdminPricingPlans();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={`plan-skeleton-${i}`} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-72 h-4 mb-4" />
            <Skeleton className="w-32 h-8" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
        <p className="text-red-600 dark:text-red-400">
          Failed to load pricing plans. Please try again.
        </p>
      </div>
    );
  }

  const plans = data?.plans ?? [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        View subscription plans configured in Stripe.
      </p>

      {/* Plans list */}
      {plans.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
          <p className="text-zinc-500">No pricing plans found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}

// Settings list for a category
function CategorySettings({ category }: { category: SettingCategory }) {
  const { data, isLoading, error } = useAdminSettingsByCategory(category);
  const updateMutation = useUpdateSetting();
  const resetMutation = useResetSetting();

  // Track pending changes locally
  const [pendingChanges, setPendingChanges] = useState<
    Record<string, number | boolean | string>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track a local change (doesn't save immediately)
  const handleLocalChange = (setting: AdminSetting, value: number | boolean | string) => {
    setPendingChanges((prev) => ({
      ...prev,
      [setting.name]: value,
    }));
    setSaveSuccess(false);
  };

  // Save all pending changes
  const handleSaveAll = async () => {
    if (!data?.settings) return;

    setIsSaving(true);
    setSaveSuccess(false);

    const promises = Object.entries(pendingChanges).map(([key, value]) => {
      const setting = data.settings.find((s) => s.name === key);
      if (!setting) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        updateMutation.mutate(
          {
            category: setting.category,
            key: setting.name,
            value,
          },
          {
            onSuccess: () => resolve(),
            onError: () => reject(),
          }
        );
      });
    });

    try {
      await Promise.all(promises);
      setPendingChanges({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Error handled by mutation
    } finally {
      setIsSaving(false);
    }
  };

  // Discard all pending changes
  const handleDiscardChanges = () => {
    setPendingChanges({});
    setSaveSuccess(false);
  };

  const handleReset = (setting: AdminSetting) => {
    // Remove from pending changes if exists
    setPendingChanges((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [setting.name]: _removed, ...rest } = prev;
      return rest;
    });
    resetMutation.mutate({
      category: setting.category,
      key: setting.name,
    });
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={`setting-skeleton-${i}`} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <Skeleton className="w-48 h-5 mb-2" />
            <Skeleton className="w-72 h-4 mb-4" />
            <Skeleton className="w-32 h-10" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
        <p className="text-red-600 dark:text-red-400">
          Failed to load settings. Please try again.
        </p>
      </div>
    );
  }

  if (!data?.settings?.length) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
        <p className="text-zinc-500">No settings found for this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category description */}
      {data.description && (
        <p className="text-sm text-zinc-500 mb-4">{data.description}</p>
      )}

      {/* Settings list */}
      {data.settings.map((setting) => (
        <SettingRow
          key={setting.key}
          setting={{
            ...setting,
            // Show pending value if exists
            current_value:
              setting.name in pendingChanges
                ? pendingChanges[setting.name]
                : setting.current_value,
          }}
          onUpdate={(value) => handleLocalChange(setting, value)}
          onReset={() => handleReset(setting)}
          isUpdating={
            resetMutation.isPending &&
            resetMutation.variables?.key === setting.name
          }
        />
      ))}

      {/* Save button bar */}
      <div
        className={`sticky bottom-4 transition-all ${
          hasPendingChanges || saveSuccess ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] shadow-lg">
          {saveSuccess ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Settings saved successfully</span>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              You have {Object.keys(pendingChanges).length} unsaved change
              {Object.keys(pendingChanges).length !== 1 ? "s" : ""}
            </p>
          )}
          {!saveSuccess && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-[#0891B2] text-white hover:bg-[#0E7490] disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Show mutation errors */}
      {updateMutation.isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to update setting. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("operational");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Configure platform settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#0891B2] text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      {activeTab === "pricing" ? (
        <PricingPlansSettings />
      ) : (
        <CategorySettings category={activeTab} />
      )}

      {/* Security tab extras */}
    </div>
  );
}
