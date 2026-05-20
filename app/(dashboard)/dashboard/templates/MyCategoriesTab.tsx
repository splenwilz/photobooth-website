"use client";

import { useEffect, useState } from "react";
import {
	useDeleteMyCategory,
	useMyCategories,
} from "@/core/api/templates/me-queries";
import type { MyTemplateCategory } from "@/core/api/templates/me-types";
import { CategoryFormModal } from "@/components/templates/forms/CategoryFormModal";

interface MyCategoriesTabProps {
	onCount?: (count: number) => void;
}

export function MyCategoriesTab({ onCount }: MyCategoriesTabProps) {
	// Default to private-only on the management surface — Built-in rows are
	// read-only here and clutter the table once the global catalog grows.
	// User can opt in via the "Show built-ins" toggle below.
	const [showBuiltIns, setShowBuiltIns] = useState(false);
	const { data, isLoading, isError, refetch } = useMyCategories({
		includeGlobal: showBuiltIns,
	});
	const del = useDeleteMyCategory();

	const [editing, setEditing] = useState<MyTemplateCategory | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

	const categories = data?.categories ?? [];
	const mineCount = categories.filter((c) => c.owner_id !== null).length;

	useEffect(() => {
		// The tab chip should always reflect the user's own count, not the
		// union. Otherwise toggling "Show built-ins" would change the chip.
		onCount?.(mineCount);
	}, [onCount, mineCount]);

	useEffect(() => {
		if (confirmDeleteId === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setConfirmDeleteId(null);
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [confirmDeleteId]);

	const openCreate = () => {
		setEditing(null);
		setIsOpen(true);
	};

	const openEdit = (c: MyTemplateCategory) => {
		setEditing(c);
		setIsOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3 flex-wrap">
				<label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-600 dark:text-zinc-400">
					<input
						type="checkbox"
						checked={showBuiltIns}
						onChange={(e) => setShowBuiltIns(e.target.checked)}
						className="w-4 h-4 rounded border-slate-300 text-[#069494] focus:ring-[#069494]"
					/>
					Show built-in categories
				</label>
				<button
					type="button"
					onClick={openCreate}
					className="flex items-center gap-2 px-4 py-2.5 bg-[#069494] text-white font-medium rounded-xl hover:bg-[#176161] transition-colors"
				>
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
						<title>Add</title>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					Add Category
				</button>
			</div>

			{isLoading && (
				<div className="animate-pulse space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-16 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
					))}
				</div>
			)}

			{isError && !isLoading && (
				<div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
					<p className="text-zinc-500 dark:text-zinc-400 mb-4">Failed to load categories.</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="px-4 py-2.5 rounded-xl bg-[#069494] text-white text-sm font-semibold hover:bg-[#176161] transition-colors"
					>
						Try Again
					</button>
				</div>
			)}

			{!isLoading && !isError && (
				<div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
					<table className="w-full">
						<thead className="bg-slate-50 dark:bg-zinc-900">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
									Source
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
									Season
								</th>
								<th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
							{categories.map((category) => {
								const isMine = category.owner_id !== null;
								return (
									<tr
										key={category.id}
										className="hover:bg-slate-50 dark:hover:bg-zinc-900/50"
									>
										<td className="px-6 py-4">
											<div>
												<p className="font-medium text-zinc-900 dark:text-white">
													{category.name}
												</p>
												{category.description && (
													<p className="text-sm text-zinc-500 truncate max-w-xs">
														{category.description}
													</p>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
													isMine
														? "bg-[#069494]/20 text-[#069494]"
														: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
												}`}
											>
												{isMine ? "Custom" : "Built-in"}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
											{category.is_seasonal_category ? (
												<span>
													{category.season_start_date} - {category.season_end_date}
												</span>
											) : (
												<span className="text-zinc-400">Always</span>
											)}
										</td>
										<td className="px-6 py-4 text-right">
											{isMine ? (
												<div className="flex items-center justify-end gap-2">
													<button
														type="button"
														onClick={() => openEdit(category)}
														className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
														aria-label={`Edit ${category.name}`}
													>
														<svg
															className="w-4 h-4"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
															strokeWidth={2}
															aria-hidden="true"
														>
															<title>Edit</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
															/>
														</svg>
													</button>
													<button
														type="button"
														onClick={() => setConfirmDeleteId(category.id)}
														className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-500 hover:text-red-600"
														aria-label={`Delete ${category.name}`}
													>
														<svg
															className="w-4 h-4"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
															strokeWidth={2}
															aria-hidden="true"
														>
															<title>Delete</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															/>
														</svg>
													</button>
												</div>
											) : (
												<span className="text-xs text-zinc-400 italic">Read-only</span>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>

					{categories.length === 0 && (
						<div className="text-center py-12">
							<p className="text-zinc-500">No categories yet. Create one to get started.</p>
						</div>
					)}
				</div>
			)}

			<CategoryFormModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				mode="me"
				editing={editing}
			/>

			{confirmDeleteId !== null && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<button
						type="button"
						aria-label="Close"
						tabIndex={-1}
						className="absolute inset-0 bg-black/60 cursor-default"
						onClick={() => setConfirmDeleteId(null)}
					/>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="delete-category-title"
						aria-describedby="delete-category-desc"
						className="relative w-full max-w-sm bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-6"
					>
						<h3 id="delete-category-title" className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Delete Category</h3>
						<p id="delete-category-desc" className="text-sm text-zinc-500 mb-6">
							Are you sure you want to delete this category? This action cannot be undone.
						</p>
						{del.error && (
							<div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
								{del.error.message}
							</div>
						)}
						<div className="flex gap-3">
							<button
								type="button"
								autoFocus
								onClick={() => setConfirmDeleteId(null)}
								className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() =>
									del.mutate(confirmDeleteId, {
										onSuccess: () => setConfirmDeleteId(null),
									})
								}
								disabled={del.isPending}
								className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
							>
								{del.isPending ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
