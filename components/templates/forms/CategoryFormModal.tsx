"use client";

import { useState, type FormEvent } from "react";
import {
	useCreateCategory,
	useUpdateCategory,
} from "@/core/api/templates/admin-queries";
import {
	useCreateMyCategory,
	useUpdateMyCategory,
} from "@/core/api/templates/me-queries";
import type { AdminTemplateCategory } from "@/core/api/templates/admin-types";
import { useDialogFocusTrap } from "@/hooks/use-dialog-focus-trap";
import { NumberInput } from "./NumberInput";

interface CategoryFormState {
	name: string;
	description: string;
	is_active: boolean;
	is_premium: boolean;
	sort_order: number;
	is_seasonal_category: boolean;
	season_start_date: string;
	season_end_date: string;
	seasonal_priority: number;
}

const DEFAULT_CATEGORY_FORM: CategoryFormState = {
	name: "",
	description: "",
	is_active: true,
	is_premium: false,
	sort_order: 0,
	is_seasonal_category: false,
	season_start_date: "",
	season_end_date: "",
	seasonal_priority: 0,
};

export interface CategoryFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	mode: "admin" | "me";
	editing: AdminTemplateCategory | null;
}

export function CategoryFormModal(props: CategoryFormModalProps) {
	if (!props.isOpen) return null;
	return <CategoryFormModalContent key={props.editing?.id ?? "new"} {...props} />;
}

function CategoryFormModalContent({
	onClose,
	mode,
	editing,
}: CategoryFormModalProps) {
	const [form, setForm] = useState<CategoryFormState>(() =>
		editing
			? {
					name: editing.name,
					description: editing.description ?? "",
					is_active: editing.is_active,
					is_premium: editing.is_premium,
					sort_order: editing.sort_order,
					is_seasonal_category: editing.is_seasonal_category,
					season_start_date: editing.season_start_date ?? "",
					season_end_date: editing.season_end_date ?? "",
					seasonal_priority: editing.seasonal_priority ?? 0,
				}
			: DEFAULT_CATEGORY_FORM,
	);

	const adminCreate = useCreateCategory();
	const adminUpdate = useUpdateCategory();
	const meCreate = useCreateMyCategory();
	const meUpdate = useUpdateMyCategory();

	const isAdmin = mode === "admin";
	const create = isAdmin ? adminCreate : meCreate;
	const update = isAdmin ? adminUpdate : meUpdate;
	const isPending = create.isPending || update.isPending;
	const error = create.error || update.error;

	const dialogRef = useDialogFocusTrap<HTMLDivElement>({ open: true, onClose });

	const [validationError, setValidationError] = useState<string | null>(null);
	const displayError = validationError ?? error?.message ?? null;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setValidationError(null);

		const trimmedName = form.name.trim();
		if (!trimmedName) {
			setValidationError("Category name is required");
			return;
		}

		const seasonal = form.is_seasonal_category
			? {
					season_start_date: form.season_start_date || undefined,
					season_end_date: form.season_end_date || undefined,
					...(isAdmin
						? { seasonal_priority: form.seasonal_priority }
						: {}),
				}
			: {};

		const adminPayload = {
			name: trimmedName,
			description: form.description || undefined,
			is_active: form.is_active,
			is_premium: form.is_premium,
			sort_order: form.sort_order,
			is_seasonal_category: form.is_seasonal_category,
			...seasonal,
		};
		const mePayload = {
			name: trimmedName,
			description: form.description || undefined,
			is_seasonal_category: form.is_seasonal_category,
			...seasonal,
		};

		try {
			if (editing) {
				if (isAdmin) {
					await adminUpdate.mutateAsync({ id: editing.id, data: adminPayload });
				} else {
					await meUpdate.mutateAsync({ id: editing.id, data: mePayload });
				}
			} else {
				if (isAdmin) {
					await adminCreate.mutateAsync(adminPayload);
				} else {
					await meCreate.mutateAsync(mePayload);
				}
			}
			onClose();
		} catch {
			// error surfaced below
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Close"
				tabIndex={-1}
				onClick={onClose}
				className="absolute inset-0 bg-black/60 cursor-default"
			/>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="category-modal-title"
				className="relative w-full max-w-lg bg-white dark:bg-[#111111] rounded-2xl shadow-xl overflow-hidden"
			>
				<div className="p-6 border-b border-slate-200 dark:border-zinc-800">
					<h2 id="category-modal-title" className="text-lg font-bold text-zinc-900 dark:text-white">
						{editing ? "Edit Category" : "Create Category"}
					</h2>
					{!isAdmin && (
						<p className="text-sm text-zinc-500 mt-1">
							Private category visible only on your booths
						</p>
					)}
				</div>
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{displayError && (
						<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
							{displayError}
						</div>
					)}
					<div>
						<label htmlFor="category-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
							Name
						</label>
						<input
							id="category-name"
							type="text"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							required
							className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
						/>
					</div>
					<div>
						<label htmlFor="category-description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
							Description
						</label>
						<textarea
							id="category-description"
							value={form.description}
							onChange={(e) =>
								setForm({ ...form, description: e.target.value })
							}
							rows={2}
							className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
						/>
					</div>
					{isAdmin && (
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="category-sort-order" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
									Sort Order
								</label>
								<NumberInput
									id="category-sort-order"
									value={form.sort_order}
									onChange={(n) => setForm({ ...form, sort_order: n })}
									className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
								/>
							</div>
							<div>
								<label htmlFor="category-priority" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
									Priority
								</label>
								<NumberInput
									id="category-priority"
									value={form.seasonal_priority}
									onChange={(n) => setForm({ ...form, seasonal_priority: n })}
									className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
								/>
							</div>
						</div>
					)}
					<div className="flex items-center gap-6">
						{isAdmin && (
							<>
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={form.is_active}
										onChange={(e) =>
											setForm({ ...form, is_active: e.target.checked })
										}
										className="w-4 h-4 rounded border-slate-300 text-[#069494] focus:ring-[#069494]"
									/>
									<span className="text-sm text-zinc-700 dark:text-zinc-300">
										Active
									</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={form.is_premium}
										onChange={(e) =>
											setForm({ ...form, is_premium: e.target.checked })
										}
										className="w-4 h-4 rounded border-slate-300 text-[#069494] focus:ring-[#069494]"
									/>
									<span className="text-sm text-zinc-700 dark:text-zinc-300">
										Premium
									</span>
								</label>
							</>
						)}
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={form.is_seasonal_category}
								onChange={(e) =>
									setForm({
										...form,
										is_seasonal_category: e.target.checked,
									})
								}
								className="w-4 h-4 rounded border-slate-300 text-[#069494] focus:ring-[#069494]"
							/>
							<span className="text-sm text-zinc-700 dark:text-zinc-300">
								Seasonal
							</span>
						</label>
					</div>
					{form.is_seasonal_category && (
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="category-season-start" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
									Start Date (MM-DD)
								</label>
								<input
									id="category-season-start"
									type="text"
									value={form.season_start_date}
									onChange={(e) =>
										setForm({ ...form, season_start_date: e.target.value })
									}
									placeholder="12-01"
									className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
								/>
							</div>
							<div>
								<label htmlFor="category-season-end" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
									End Date (MM-DD)
								</label>
								<input
									id="category-season-end"
									type="text"
									value={form.season_end_date}
									onChange={(e) =>
										setForm({ ...form, season_end_date: e.target.value })
									}
									placeholder="12-26"
									className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
								/>
							</div>
						</div>
					)}
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="flex-1 px-4 py-2.5 rounded-lg bg-[#069494] text-white font-medium hover:bg-[#176161] disabled:opacity-50"
						>
							{isPending ? "Saving..." : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
