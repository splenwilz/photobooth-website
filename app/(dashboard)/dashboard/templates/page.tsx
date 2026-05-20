"use client";

import Link from "next/link";
import { Suspense, useCallback, useState } from "react";
import { MyCategoriesTab } from "./MyCategoriesTab";
import { MyLayoutsTab } from "./MyLayoutsTab";
import { MyTemplatesTab } from "./MyTemplatesTab";
import { PurchasedTab } from "./PurchasedTab";
import { TabBar, useActiveTab, type TemplatesTab } from "./TabBar";

function TemplatesPageInner() {
	const active = useActiveTab();
	const [counts, setCounts] = useState<Partial<Record<TemplatesTab, number>>>({});

	// One stable handler per tab. A curried factory would return a fresh
	// closure each render, defeating any useEffect(..., [onCount, n]) the
	// children rely on.
	const onCountMine = useCallback(
		(n: number) =>
			setCounts((prev) => (prev.mine === n ? prev : { ...prev, mine: n })),
		[],
	);
	const onCountCategories = useCallback(
		(n: number) =>
			setCounts((prev) =>
				prev.categories === n ? prev : { ...prev, categories: n },
			),
		[],
	);
	const onCountLayouts = useCallback(
		(n: number) =>
			setCounts((prev) =>
				prev.layouts === n ? prev : { ...prev, layouts: n },
			),
		[],
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Templates</h1>
					<p className="text-zinc-500 dark:text-zinc-400 mt-1">
						Manage purchased and private templates, categories, and layouts
					</p>
				</div>
				{active === "purchased" && (
					<Link
						href="/templates"
						className="px-4 py-2.5 rounded-xl bg-[#069494] text-white text-sm font-semibold hover:bg-[#176161] transition-colors"
					>
						Browse Marketplace
					</Link>
				)}
			</div>

			<TabBar counts={counts} />

			{active === "purchased" && <PurchasedTab />}
			{active === "mine" && <MyTemplatesTab onCount={onCountMine} />}
			{active === "categories" && <MyCategoriesTab onCount={onCountCategories} />}
			{active === "layouts" && <MyLayoutsTab onCount={onCountLayouts} />}
		</div>
	);
}

export default function DashboardTemplatesPage() {
	return (
		<Suspense
			fallback={
				<div className="animate-pulse space-y-4">
					<div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded" />
					<div className="h-12 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
				</div>
			}
		>
			<TemplatesPageInner />
		</Suspense>
	);
}
