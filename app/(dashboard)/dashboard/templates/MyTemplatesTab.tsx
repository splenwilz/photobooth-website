"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDialogFocusTrap } from "@/hooks/use-dialog-focus-trap";
import {
	useDeleteMyTemplate,
	useMyCategories,
	useMyLayouts,
	useMyTemplates,
} from "@/core/api/templates/me-queries";
import type {
	MyTemplate,
	MyTemplateType,
} from "@/core/api/templates/me-types";
import { TemplateFormModal } from "@/components/templates/forms/TemplateFormModal";

type FilterCategory = "all" | string;
type FilterTemplateType = "all" | MyTemplateType;

const TEMPLATE_TYPE_OPTIONS: { value: FilterTemplateType; label: string }[] = [
	{ value: "all", label: "All Types" },
	{ value: "strip", label: "Strips" },
	{ value: "photo_4x6", label: "4x6 Photo" },
];

function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

interface MyTemplatesTabProps {
	onCount?: (count: number) => void;
}

export function MyTemplatesTab({ onCount }: MyTemplatesTabProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
	const [filterTemplateType, setFilterTemplateType] = useState<FilterTemplateType>("all");
	const [page, setPage] = useState(1);

	// When a search is active, fetch a large window so the client-side filter
	// considers all matches across pages. Without this, "search for foo on
	// page 1" silently misses matches on page 2+.
	const isSearching = searchQuery.trim().length > 0;
	const perPage = isSearching ? 100 : 20;

	const queryParams = useMemo(() => {
		const p: Parameters<typeof useMyTemplates>[0] = {
			page: isSearching ? 1 : page,
			per_page: perPage,
		};
		if (filterCategory !== "all") p.category_id = filterCategory;
		if (filterTemplateType !== "all") p.template_type = filterTemplateType;
		return p;
	}, [isSearching, page, perPage, filterCategory, filterTemplateType]);

	const { data, isLoading, isError, refetch } = useMyTemplates(queryParams);
	const del = useDeleteMyTemplate();
	const { reset: resetDel } = del;
	const { data: catsData } = useMyCategories({ includeGlobal: true });
	const { data: layoutsData } = useMyLayouts({ includeGlobal: true });

	const [editing, setEditing] = useState<MyTemplate | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState<MyTemplate | null>(null);

	const templates = data?.templates ?? [];
	const total = data?.total ?? 0;
	const totalPages = data?.total_pages ?? 1;

	useEffect(() => {
		onCount?.(total);
	}, [onCount, total]);

	const deleteDialogRef = useDialogFocusTrap<HTMLDivElement>({
		open: confirmDelete !== null,
		onClose: () => setConfirmDelete(null),
	});

	// Clear any stale mutation error when the modal opens, so a previously
	// failed delete doesn't leak its error into a fresh confirmation.
	useEffect(() => {
		if (confirmDelete !== null) resetDel();
	}, [confirmDelete, resetDel]);

	const filteredTemplates = useMemo(() => {
		if (!searchQuery) return templates;
		const q = searchQuery.toLowerCase();
		return templates.filter(
			(t) =>
				t.name.toLowerCase().includes(q) ||
				(t.description ?? "").toLowerCase().includes(q) ||
				(t.tags ?? "").toLowerCase().includes(q),
		);
	}, [templates, searchQuery]);

	const categoryOptions = useMemo(
		() =>
			(catsData?.categories ?? []).map((c) => ({
				id: c.id,
				name: c.name,
				mine: c.owner_id !== null,
			})),
		[catsData],
	);

	const layoutOptions = useMemo(
		() =>
			(layoutsData?.layouts ?? []).map((l) => ({
				id: l.id,
				name: l.name,
				product_category_id: l.product_category_id,
				photo_count: l.photo_count,
				mine: l.owner_id !== null,
			})),
		[layoutsData],
	);

	const openCreate = () => {
		setEditing(null);
		setIsOpen(true);
	};

	const openEdit = (t: MyTemplate) => {
		setEditing(t);
		setIsOpen(true);
	};

	return (
		<div className="space-y-6">
			{/* Header Actions */}
			<div className="flex items-center justify-end">
				<button
					type="button"
					onClick={openCreate}
					className="flex items-center gap-2 px-4 py-2.5 bg-[#069494] text-white font-medium rounded-xl hover:bg-[#176161] transition-colors"
				>
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
						<title>Add</title>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					Add Template
				</button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3">
				<div className="flex-1 min-w-[200px] relative">
					<svg
						className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<title>Search</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						/>
					</svg>
					<input
						type="text"
						aria-label="Search templates"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search templates..."
						className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] transition-all"
					/>
				</div>
				<select
					value={filterCategory}
					onChange={(e) => {
						setFilterCategory(e.target.value);
						setPage(1);
					}}
					className="px-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
				>
					<option value="all">All Categories</option>
					{categoryOptions.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
							{cat.mine ? " (Custom)" : " (Built-in)"}
						</option>
					))}
				</select>
				<div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
					{TEMPLATE_TYPE_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => {
								setFilterTemplateType(opt.value);
								setPage(1);
							}}
							className={`px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
								filterTemplateType === opt.value
									? "bg-[#069494] text-white"
									: "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
							}`}
						>
							{opt.label}
						</button>
					))}
				</div>
			</div>

			{isLoading && (
				<div className="animate-pulse space-y-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-24 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
					))}
				</div>
			)}

			{isError && !isLoading && (
				<div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
					<p className="text-zinc-500 dark:text-zinc-400 mb-4">Failed to load your templates.</p>
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
				<div className="space-y-3">
					{filteredTemplates.map((template) => (
						<div
							key={template.id}
							className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
						>
							<div className="flex items-center gap-4">
								{/* Preview */}
								<div className="w-16 h-20 rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 relative">
									{template.preview_url ? (
										<Image
											src={template.preview_url}
											alt={template.name}
											fill
											className="object-cover"
											sizes="64px"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<svg
												className="w-6 h-6 text-zinc-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-hidden="true"
											>
												<title>No preview</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
												/>
											</svg>
										</div>
									)}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap">
										<p className="font-medium text-zinc-900 dark:text-white">{template.name}</p>
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#069494]/20 text-[#069494]">
											Custom
										</span>
									</div>
									<p className="text-sm text-zinc-500 mt-0.5">
										{template.category?.name || "No Category"} &bull;{" "}
										{template.layout?.name || template.template_type}
									</p>
									<div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
										<span>{formatFileSize(template.file_size)}</span>
										<span>{template.template_type}</span>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-1">
									<button
										type="button"
										onClick={() => openEdit(template)}
										className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-[#069494] transition-colors"
										aria-label="Edit template"
									>
										<svg
											className="w-5 h-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={1.5}
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
										onClick={() => setConfirmDelete(template)}
										className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
										aria-label="Delete template"
									>
										<svg
											className="w-5 h-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={1.5}
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
							</div>
						</div>
					))}

					{filteredTemplates.length === 0 && (
						<div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
							<p className="text-zinc-500 dark:text-zinc-400">
								{searchQuery
									? "No templates found matching your criteria"
									: "No private templates yet. Create one to get started."}
							</p>
						</div>
					)}
				</div>
			)}

			{data && !isSearching && totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-zinc-500">
						Page {data.page} of {totalPages} ({total} total)
					</p>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						<button
							type="button"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page >= totalPages}
							className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</div>
			)}

			<TemplateFormModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				mode="me"
				editing={editing}
				categories={categoryOptions}
				layouts={layoutOptions}
			/>

			{confirmDelete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<button
						type="button"
						aria-label="Close"
						tabIndex={-1}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
						onClick={() => setConfirmDelete(null)}
					/>
					<div
						ref={deleteDialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="delete-template-title"
						aria-describedby="delete-template-desc"
						className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden"
					>
						<div className="p-6 text-center">
							<div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
								<svg
									className="w-8 h-8 text-red-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									aria-hidden="true"
								>
									<title>Warning</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
									/>
								</svg>
							</div>
							<h3 id="delete-template-title" className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Delete Template</h3>
							<p id="delete-template-desc" className="text-zinc-500 mb-6">
								Are you sure you want to delete{" "}
								<span className="font-medium text-zinc-900 dark:text-white">{confirmDelete.name}</span>?
								This action cannot be undone.
							</p>
							{del.error && (
								<div role="alert" className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500 text-left">
									{del.error.message}
								</div>
							)}
							<div className="flex gap-3 justify-center">
								<button
									type="button"
									onClick={() => setConfirmDelete(null)}
									className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={() =>
										del.mutate(confirmDelete.id, {
											onSuccess: () => setConfirmDelete(null),
										})
									}
									disabled={del.isPending}
									className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
								>
									{del.isPending && (
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									)}
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
