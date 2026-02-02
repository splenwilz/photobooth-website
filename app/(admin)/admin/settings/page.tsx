"use client";

/**
 * Admin Settings Page
 *
 * Platform configuration with clean card design.
 */

import { useState } from "react";
import { BaseSecretConfig } from "@/components/admin/BaseSecretConfig";

type Tab = "general" | "pricing" | "notifications" | "security";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const tabs: { id: Tab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "pricing", label: "Pricing Plans" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Configure platform settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-[#0891B2] text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Platform Name</label>
            <input
              type="text"
              defaultValue="PhotoBoothX"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
            />
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Support Email</label>
            <input
              type="email"
              defaultValue="support@photoboothx.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
            />
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">Maintenance Mode</p>
                <p className="text-sm text-zinc-500">Show maintenance page to all users</p>
              </div>
              <button type="button" className="relative w-12 h-6 rounded-full bg-slate-300 dark:bg-zinc-700 transition-colors">
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform" />
              </button>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">Allow New Signups</p>
                <p className="text-sm text-zinc-500">Enable public registration</p>
              </div>
              <button type="button" className="relative w-12 h-6 rounded-full bg-[#0891B2] transition-colors">
                <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      {activeTab === "pricing" && (
        <div className="space-y-4">
          {[
            { name: "Starter", price: 29, booths: 5, features: ["Basic analytics", "Email support"] },
            { name: "Pro", price: 99, booths: 20, features: ["Advanced analytics", "Priority support", "Custom templates"] },
            { name: "Enterprise", price: 299, booths: "Unlimited", features: ["Full analytics", "24/7 support", "Custom branding", "API access"] },
          ].map((plan) => (
            <div key={plan.name} className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">{plan.name}</h3>
                  <p className="text-sm text-zinc-500">{plan.booths} booths</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">${plan.price}<span className="text-sm text-zinc-500">/mo</span></p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {plan.features.map((feature) => (
                  <span key={feature} className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
                <button type="button" className="text-sm font-medium text-[#0891B2] hover:text-[#22D3EE]">
                  Edit Plan
                </button>
              </div>
            </div>
          ))}

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Commission Rate (%)</label>
            <input
              type="number"
              defaultValue="1"
              min="0"
              max="100"
              step="0.1"
              className="w-32 px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
            />
            <p className="text-xs text-zinc-500 mt-2">Percentage taken from each transaction</p>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-3">
          {[
            { label: "New User Registration", description: "Receive email when a new user signs up", enabled: true },
            { label: "New Subscription", description: "Notification for new paid subscriptions", enabled: true },
            { label: "Support Tickets", description: "Alert for new support tickets", enabled: true },
            { label: "Payout Completed", description: "Confirmation when payouts are processed", enabled: false },
            { label: "Weekly Report", description: "Weekly platform performance summary", enabled: false },
          ].map((notif) => (
            <div key={notif.label} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{notif.label}</p>
                  <p className="text-sm text-zinc-500">{notif.description}</p>
                </div>
                <button
                  type="button"
                  className={`relative w-12 h-6 rounded-full transition-colors ${notif.enabled ? "bg-[#0891B2]" : "bg-slate-300 dark:bg-zinc-700"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notif.enabled ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-zinc-500">Require 2FA for all admin accounts</p>
              </div>
              <button type="button" className="relative w-12 h-6 rounded-full bg-[#0891B2]">
                <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
            <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Session Timeout (minutes)</label>
            <input
              type="number"
              defaultValue="60"
              min="5"
              max="480"
              className="w-32 px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
            />
          </div>

          {/* Base Secret for Emergency Access */}
          <BaseSecretConfig />

          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Danger Zone</p>
                <p className="text-sm text-red-500/60 dark:text-red-400/60">Reset all admin sessions</p>
              </div>
              <button type="button" className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                Force Logout All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-[var(--border)]">
        <button type="button" className="px-6 py-3 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
