"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useBoothList } from "@/core/api/booths";
import { useAlerts } from "@/core/api/alerts";
import type { AuthUser } from "@/core/api/auth/types";

/**
 * Dashboard Layout
 *
 * Provides sidebar navigation for authenticated users.
 * @see Mobile app tab navigation - /(tabs)/_layout.tsx
 */

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

// Navigation items matching mobile app tabs
const navItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: (
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
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    name: "Booths",
    href: "/dashboard/booths",
    icon: (
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
          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
        />
      </svg>
    ),
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: (
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
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: (
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
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: (
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
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    name: "Account",
    href: "/dashboard/account",
    icon: (
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
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
];

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [boothSelectorOpen, setBoothSelectorOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Get booth ID from URL search params (null = all booths)
  const selectedBoothId = searchParams.get("booth");

  // Fetch booths from API
  const { data: boothListData } = useBoothList();
  const booths = boothListData?.booths ?? [];

  // Fetch alerts for badge count
  const { data: alertsData } = useAlerts();
  const alertsCount = alertsData?.alerts?.length ?? 0;

  // Load user from cookie on mount
  useEffect(() => {
    setUser(getUserFromCookie());
  }, []);

  // Update URL to select a booth
  const setSelectedBooth = useCallback((boothId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (boothId) {
      params.set("booth", boothId);
    } else {
      params.delete("booth");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  // Get selected booth info
  const selectedBooth = booths.find((b) => b.id === selectedBoothId);
  const isAllBoothsMode = !selectedBoothId;

  // Count online/offline booths
  const onlineCount = booths.filter((b) => b.status === "online").length;
  const offlineCount = booths.length - onlineCount;

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Booth Selector Overlay (closes dropdown when clicking outside) */}
      {boothSelectorOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setBoothSelectorOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-[#111111] border-r border-slate-200 dark:border-zinc-800
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-zinc-900 dark:text-white">
                PhotoBoothX
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              // Preserve booth selection when navigating between tabs
              const href = selectedBoothId
                ? `${item.href}?booth=${selectedBoothId}`
                : item.href;

              return (
                <Link
                  key={item.name}
                  href={href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${
                      isActive
                        ? "bg-[#0891B2]/20 text-[#0891B2]"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/50"
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                  {item.name === "Alerts" && alertsCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {alertsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-sm text-white">
                {getInitials(user)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-zinc-900 dark:text-white">
                  {user
                    ? `${user.first_name} ${user.last_name}`.trim()
                    : "User"}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {user?.email ?? ""}
                </p>
              </div>
              <button
                className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                title="Logout"
                onClick={handleLogout}
              >
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
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Booth Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setBoothSelectorOpen(!boothSelectorOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0891B2]/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#0891B2]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {isAllBoothsMode
                      ? "All Booths"
                      : selectedBooth?.name ?? "Select Booth"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {isAllBoothsMode
                      ? `${onlineCount} online · ${offlineCount} offline`
                      : selectedBooth?.address ?? "No address"}
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 text-zinc-500 ml-2 transition-transform ${
                    boothSelectorOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Booth Selector Dropdown */}
              {boothSelectorOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-700 rounded-xl shadow-lg z-30 overflow-hidden">
                  {/* All Booths Option */}
                  <button
                    onClick={() => {
                      setSelectedBooth(null);
                      setBoothSelectorOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors ${
                      isAllBoothsMode ? "bg-[#0891B2]/10" : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#0891B2]" />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-zinc-900 dark:text-white">
                        All Booths
                      </p>
                      <p className="text-xs text-zinc-500">
                        {onlineCount} online · {offlineCount} offline
                      </p>
                    </div>
                    {isAllBoothsMode && (
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
                  {booths.length > 0 && (
                    <div className="border-t border-slate-200 dark:border-zinc-700" />
                  )}

                  {/* Individual Booths */}
                  {booths.map((booth) => (
                    <button
                      key={booth.id}
                      onClick={() => {
                        setSelectedBooth(booth.id);
                        setBoothSelectorOpen(false);
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

                  {/* No booths message */}
                  {booths.length === 0 && (
                    <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                      No booths found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications - Links to Alerts */}
              <Link
                href={selectedBoothId ? `/dashboard/alerts?booth=${selectedBoothId}` : "/dashboard/alerts"}
                className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                {alertsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>

              {/* Help */}
              <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function DashboardLayoutFallback() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutFallback />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
