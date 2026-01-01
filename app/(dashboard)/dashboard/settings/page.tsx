"use client";

/**
 * Settings Page
 * 
 * Booth configuration and account settings.
 * Uses demo data matching the mobile app structure.
 * 
 * @see Mobile app - /app/(tabs)/settings.tsx
 */

import { useState } from "react";

// Demo booth data
const demoBooth = {
  id: "booth-1",
  name: "Downtown Mall",
  address: "123 Main Street, Suite 101",
  status: "online" as const,
  credits: 450,
};

// Demo products
const demoProducts = [
  { id: "PhotoStrips", name: "Photo Strips", description: "2x6 photo strip prints", basePrice: 5.00, extraCopyPrice: 2.00, enabled: true },
  { id: "Photo4x6", name: "4x6 Photo", description: "Standard 4x6 photo prints", basePrice: 8.00, extraCopyPrice: 3.00, enabled: true },
  { id: "SmartphonePrint", name: "Smartphone Print", description: "Print from phone gallery", basePrice: 3.00, extraCopyPrice: 1.50, enabled: false },
];

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  showArrow?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}

function SettingsItem({ icon, title, subtitle, value, showArrow = true, destructive = false, onClick }: SettingsItemProps) {
  const accentColor = destructive ? "#EF4444" : "#0891B2";
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-zinc-800 hover:border-zinc-700 transition-all text-left"
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        <div style={{ color: accentColor }}>{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && <span className="text-sm text-zinc-400">{value}</span>}
        {showArrow && (
          <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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

export default function SettingsPage() {
  const [selectedBooth] = useState(demoBooth);
  const [allBoothsMode] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-zinc-400 mt-1">Configure your booth and account preferences</p>
      </div>

      {/* Current Booth Info */}
      {!allBoothsMode && (
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#0891B2]/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{selectedBooth.name}</h3>
                <div className={`w-2 h-2 rounded-full ${selectedBooth.status === "online" ? "bg-green-500" : "bg-red-500"}`} />
              </div>
              <p className="text-sm text-zinc-500">{selectedBooth.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-500">Credits</p>
              <p className="font-semibold text-[#0891B2]">{selectedBooth.credits}</p>
            </div>
          </div>
        </div>
      )}

      {/* All Booths Mode Notice */}
      {allBoothsMode && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
          <svg className="w-5 h-5 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-yellow-200">
            Select a specific booth to access booth settings like credits, products, and pricing.
          </p>
        </div>
      )}

      {/* Credits Section */}
      {!allBoothsMode && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Credits</h2>
          <div className="space-y-3">
            <SettingsItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Add Credits"
              subtitle="Purchase more credits for this booth"
              value={`${selectedBooth.credits} available`}
            />
            <SettingsItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Credit History"
              subtitle="View past credit transactions"
            />
          </div>
        </section>
      )}

      {/* Products & Pricing */}
      {!allBoothsMode && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Products & Pricing</h2>
          <div className="space-y-3">
            {demoProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0891B2]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{product.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.enabled ? "bg-green-500/20 text-green-500" : "bg-zinc-700 text-zinc-400"}`}>
                      {product.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">{product.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">{formatCurrency(product.basePrice)}</p>
                  <p className="text-xs text-zinc-500">+{formatCurrency(product.extraCopyPrice)} extra</p>
                </div>
                <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Booth Management */}
      {!allBoothsMode && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Booth Management</h2>
          <div className="space-y-3">
            <SettingsItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>}
              title="Connection Details"
              subtitle="View API key and QR code"
            />
            <SettingsItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>}
              title="Restart App"
              subtitle="Restart the booth application"
            />
            <SettingsItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>}
              title="Restart System"
              subtitle="Reboot the booth computer"
            />
            <SettingsItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>}
              title="Delete Booth"
              subtitle="Permanently remove this booth"
              destructive
            />
          </div>
        </section>
      )}

      {/* Account */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <div className="space-y-3">
          <SettingsItem
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
            title="Profile"
            subtitle="Manage your account information"
          />
          <SettingsItem
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>}
            title="Notifications"
            subtitle="Configure alert preferences"
          />
          <SettingsItem
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
            title="Security"
            subtitle="Password and two-factor authentication"
          />
        </div>
      </section>

      {/* Legal */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Legal</h2>
        <div className="space-y-3">
          <SettingsItem
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
            title="Terms of Service"
            subtitle="Read our terms and conditions"
          />
          <SettingsItem
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
          />
        </div>
      </section>

      {/* App Info */}
      <section>
        <h2 className="text-lg font-semibold mb-4">App Info</h2>
        <div className="p-5 rounded-2xl bg-[#111111] border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">PhotoBoothX Dashboard</p>
              <p className="text-sm text-zinc-500">Version 1.0.0</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Logout */}
      <section>
        <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-red-500/30 text-red-500 font-medium hover:bg-red-500/10 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign Out
        </button>
      </section>
    </div>
  );
}

