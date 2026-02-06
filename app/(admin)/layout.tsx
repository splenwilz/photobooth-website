"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import type { AuthUser } from "@/core/api/auth/types";

/**
 * Admin Dashboard Layout
 *
 * Clean, professional layout matching the user dashboard style.
 * Uses the same design patterns for consistency.
 */

// Get user from auth_user cookie (client-side)
function getUserFromCookie(): AuthUser | null {
	if (typeof window === "undefined") return null;
	try {
		const cookie = document.cookie
			.split(";")
			.map((c) => c.trim())
			.find((row) => row.startsWith("auth_user="));
		if (!cookie) return null;
		// Use indexOf to handle values containing "=" characters
		const eqIndex = cookie.indexOf("=");
		if (eqIndex === -1) return null;
		return JSON.parse(decodeURIComponent(cookie.slice(eqIndex + 1)));
	} catch {
		return null;
	}
}

// Get user initials
function getInitials(user: AuthUser | null): string {
	if (!user) return "A";
	const first = user.first_name?.[0] ?? "";
	const last = user.last_name?.[0] ?? "";
	return (first + last).toUpperCase() || "A";
}

// Navigation items for admin
const navItems = [
	{
		name: "Overview",
		href: "/admin",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
				aria-hidden="true"
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
		name: "Users",
		href: "/admin/users",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
				/>
			</svg>
		),
	},
	{
		name: "Billing",
		href: "/admin/subscriptions",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
				/>
			</svg>
		),
	},
	{
		name: "Booths",
		href: "/admin/booths",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
				aria-hidden="true"
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
		name: "Emergency Access",
		href: "/admin/emergency-access",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
				/>
			</svg>
		),
	},
	{
		name: "Settings",
		href: "/admin/settings",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
				aria-hidden="true"
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
];

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [user, setUser] = useState<AuthUser | null>(null);

	// Load user from cookie on mount (client-side only)
	useEffect(() => {
		const cookieUser = getUserFromCookie();
		if (cookieUser) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- read cookie on mount
			setUser(cookieUser);
		}
	}, []);

	// Handle logout
	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", { method: "POST" });
			if (!response.ok) {
				console.error("Logout request failed:", response.status);
			}
			setUser(null);
			router.replace("/signin");
		} catch (error) {
			console.error("Logout failed:", error);
			setUser(null);
			router.replace("/signin");
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground flex">
			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/60 z-40 lg:hidden cursor-default"
					onClick={() => setSidebarOpen(false)}
					aria-label="Close sidebar"
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-[#111111] border-r border-(--border)
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="p-6 border-b border-(--border)">
						<Link href="/admin" className="flex items-center gap-2.5">
							<div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
									/>
								</svg>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-lg text-zinc-900 dark:text-white">
									PhotoBoothX
								</span>
								<span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#0891B2]/20 text-[#0891B2]">
									ADMIN
								</span>
							</div>
						</Link>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-1">
						{navItems.map((item) => {
							const isActive =
								pathname === item.href ||
								(item.href !== "/admin" && pathname.startsWith(item.href));

							return (
								<Link
									key={item.name}
									href={item.href}
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
								</Link>
							);
						})}
					</nav>

					{/* Admin User Section */}
					<div className="p-4 border-t border-(--border)">
						<div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/50">
							<div className="w-10 h-10 rounded-full bg-linear-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-sm text-white">
								{getInitials(user)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-medium text-sm truncate text-zinc-900 dark:text-white">
									{user
										? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
											"Admin"
										: "Admin"}
								</p>
								<p className="text-xs text-zinc-500 truncate">
									{user?.email ?? ""}
								</p>
							</div>
							<button
								type="button"
								className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
								aria-label="Logout"
								title="Logout"
								onClick={handleLogout}
							>
								<svg
									className="w-5 h-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}
									aria-hidden="true"
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
				<header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-(--border)">
					<div className="flex items-center justify-between px-6 py-4">
						{/* Mobile Menu Button */}
						<button
							type="button"
							className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
							onClick={() => setSidebarOpen(true)}
							aria-label="Open menu"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.5}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
						</button>

						{/* System Status */}
						<div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50">
							<div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
								<svg
									className="w-4 h-4 text-green-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-sm font-medium text-zinc-900 dark:text-white">
									System Status
								</p>
								<p className="text-xs text-zinc-500">
									All services operational
								</p>
							</div>
						</div>

						{/* Right Actions */}
						<div className="flex items-center gap-3">
							{/* Theme Toggle */}
							<ThemeToggle />

							{/* Notifications */}
							<button
								type="button"
								className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
								aria-label="Notifications"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
									/>
								</svg>
								<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
							</button>

							{/* View Site */}
							<Link
								href="/"
								className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
									/>
								</svg>
								View Site
							</Link>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
