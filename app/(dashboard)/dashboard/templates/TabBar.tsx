"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type TemplatesTab = "purchased" | "mine" | "categories" | "layouts";

interface TabSpec {
	key: TemplatesTab;
	label: string;
}

const TABS: TabSpec[] = [
	{ key: "purchased", label: "Purchased" },
	{ key: "mine", label: "My Templates" },
	{ key: "categories", label: "My Categories" },
	{ key: "layouts", label: "My Layouts" },
];

const VALID_TABS = new Set<string>(TABS.map((t) => t.key));

function isValidTab(value: string | null): value is TemplatesTab {
	return value !== null && VALID_TABS.has(value);
}

export function useActiveTab(): TemplatesTab {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const raw = searchParams.get("tab");

	// Drop an invalid ?tab= value from the URL on mount instead of silently
	// rendering the default — leaving a bad value in the URL would confuse
	// users sharing/bookmarking it.
	useEffect(() => {
		if (raw !== null && !isValidTab(raw)) {
			const params = new URLSearchParams(searchParams.toString());
			params.delete("tab");
			const qs = params.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		}
	}, [raw, pathname, router, searchParams]);

	return isValidTab(raw) ? raw : "purchased";
}

interface TabBarProps {
	counts: Partial<Record<TemplatesTab, number>>;
	active: TemplatesTab;
}

export function TabBar({ counts, active }: TabBarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setTab = (next: TemplatesTab) => {
		const params = new URLSearchParams(searchParams.toString());
		if (next === "purchased") {
			params.delete("tab");
		} else {
			params.set("tab", next);
		}
		const qs = params.toString();
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	};

	// WAI-ARIA tab pattern: roving tabindex. Inactive tabs have tabIndex=-1
	// so Tab moves past the whole tablist; ArrowLeft/Right (and Home/End)
	// move focus between tabs, with the focused tab also becoming active.
	const handleTabKeyDown = (
		e: React.KeyboardEvent<HTMLButtonElement>,
		currentKey: TemplatesTab,
	) => {
		const currentIdx = TABS.findIndex((t) => t.key === currentKey);
		let nextIdx = -1;
		if (e.key === "ArrowRight") nextIdx = (currentIdx + 1) % TABS.length;
		else if (e.key === "ArrowLeft")
			nextIdx = (currentIdx - 1 + TABS.length) % TABS.length;
		else if (e.key === "Home") nextIdx = 0;
		else if (e.key === "End") nextIdx = TABS.length - 1;
		if (nextIdx === -1) return;
		e.preventDefault();
		const nextKey = TABS[nextIdx].key;
		setTab(nextKey);
		document.getElementById(`${nextKey}-tab`)?.focus();
	};

	return (
		<div className="border-b border-[var(--border)]">
			<nav
				role="tablist"
				aria-label="Templates sections"
				className="-mb-px flex gap-6 overflow-x-auto"
			>
				{TABS.map((t) => {
					const isActive = active === t.key;
					const count = counts[t.key];
					return (
						<button
							key={t.key}
							type="button"
							role="tab"
							id={`${t.key}-tab`}
							aria-selected={isActive}
							aria-controls={`${t.key}-panel`}
							tabIndex={isActive ? 0 : -1}
							onClick={() => setTab(t.key)}
							onKeyDown={(e) => handleTabKeyDown(e, t.key)}
							className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
								isActive
									? "border-[#069494] text-[#069494]"
									: "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
							}`}
						>
							{t.label}
							{count !== undefined && (
								<span
									className={`px-2 py-0.5 rounded-full text-xs ${
										isActive
											? "bg-[#069494]/20 text-[#069494]"
											: "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
									}`}
								>
									{count}
								</span>
							)}
						</button>
					);
				})}
			</nav>
		</div>
	);
}
