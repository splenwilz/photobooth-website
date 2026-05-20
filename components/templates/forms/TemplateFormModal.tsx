"use client";

import { useMemo, useRef, useState } from "react";
import { useDialogFocusTrap } from "@/hooks/use-dialog-focus-trap";
import {
	useCreateTemplate,
	useUpdateTemplate,
} from "@/core/api/templates/admin-queries";
import {
	useCreateMyTemplate,
	useUpdateMyTemplate,
} from "@/core/api/templates/me-queries";
import type {
	AdminTemplate,
	AdminTemplateStatus,
	AdminTemplateType,
} from "@/core/api/templates/admin-types";
import { NumberInput } from "./NumberInput";

export interface CategoryOption {
	id: number;
	name: string;
	/** True for caller-owned (Custom) rows; false for admin-global (Built-in). */
	mine?: boolean;
}

export interface LayoutOption {
	id: string;
	name: string;
	layout_key: string;
	product_category_id: number;
	photo_count: number;
	mine?: boolean;
}

interface TemplateFormState {
	name: string;
	description: string;
	category_id: number | null;
	layout_id: string | null;
	template_type: AdminTemplateType;
	status: AdminTemplateStatus;
	price: string;
	sort_order: number;
	tags: string;
}

const DEFAULT_TEMPLATE_FORM: TemplateFormState = {
	name: "",
	description: "",
	category_id: null,
	layout_id: null,
	template_type: "strip",
	status: "draft",
	price: "0.00",
	sort_order: 0,
	tags: "",
};

export interface TemplateFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	mode: "admin" | "me";
	editing: AdminTemplate | null;
	categories: CategoryOption[];
	layouts: LayoutOption[];
}

export function TemplateFormModal(props: TemplateFormModalProps) {
	if (!props.isOpen) return null;
	return <TemplateFormModalContent key={props.editing?.id ?? "new"} {...props} />;
}

function TemplateFormModalContent({
	onClose,
	mode,
	editing,
	categories,
	layouts,
}: TemplateFormModalProps) {
	const isAdmin = mode === "admin";

	const [form, setForm] = useState<TemplateFormState>(() =>
		editing
			? {
					name: editing.name,
					description: editing.description ?? "",
					category_id: editing.category_id,
					layout_id: editing.layout_id,
					template_type: editing.template_type,
					status: editing.status,
					price: editing.price,
					sort_order: editing.sort_order,
					tags: editing.tags ?? "",
				}
			: DEFAULT_TEMPLATE_FORM,
	);
	const [tagInput, setTagInput] = useState("");
	const [templateFile, setTemplateFile] = useState<File | null>(null);
	const [previewFile, setPreviewFile] = useState<File | null>(null);
	const [overlayFile, setOverlayFile] = useState<File | null>(null);
	const [removeOverlay, setRemoveOverlay] = useState(false);
	const [dragActiveTemplate, setDragActiveTemplate] = useState(false);
	const [dragActivePreview, setDragActivePreview] = useState(false);
	const [dragActiveOverlay, setDragActiveOverlay] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const templateFileRef = useRef<HTMLInputElement>(null);
	const previewFileRef = useRef<HTMLInputElement>(null);
	const overlayFileRef = useRef<HTMLInputElement>(null);

	const dialogRef = useDialogFocusTrap<HTMLDivElement>({ open: true, onClose });

	const adminCreate = useCreateTemplate();
	const adminUpdate = useUpdateTemplate();
	const meCreate = useCreateMyTemplate();
	const meUpdate = useUpdateMyTemplate();

	const isPending =
		adminCreate.isPending ||
		adminUpdate.isPending ||
		meCreate.isPending ||
		meUpdate.isPending;

	const availableLayouts = useMemo(() => {
		const productCategoryId = form.template_type === "strip" ? 1 : 2;
		return layouts.filter((l) => l.product_category_id === productCategoryId);
	}, [layouts, form.template_type]);

	const handleTemplateTypeChange = (type: AdminTemplateType) => {
		setForm((prev) => ({ ...prev, template_type: type, layout_id: null }));
	};

	const handleAddTag = () => {
		if (tagInput.trim()) {
			const currentTags = form.tags ? form.tags.split(",").filter(Boolean) : [];
			const newTag = tagInput.trim().toLowerCase();
			if (!currentTags.includes(newTag)) {
				setForm((prev) => ({
					...prev,
					tags: [...currentTags, newTag].join(","),
				}));
			}
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		const currentTags = form.tags.split(",").filter(Boolean);
		setForm((prev) => ({
			...prev,
			tags: currentTags.filter((t) => t !== tagToRemove).join(","),
		}));
	};

	const handleTagKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			handleAddTag();
		}
	};

	const handleDrag = (
		e: React.DragEvent,
		type: "template" | "preview" | "overlay",
	) => {
		e.preventDefault();
		e.stopPropagation();
		const setActive =
			type === "template"
				? setDragActiveTemplate
				: type === "preview"
					? setDragActivePreview
					: setDragActiveOverlay;
		if (e.type === "dragenter" || e.type === "dragover") setActive(true);
		else if (e.type === "dragleave") setActive(false);
	};

	const handleDrop = (
		e: React.DragEvent,
		type: "template" | "preview" | "overlay",
	) => {
		e.preventDefault();
		e.stopPropagation();
		const setActive =
			type === "template"
				? setDragActiveTemplate
				: type === "preview"
					? setDragActivePreview
					: setDragActiveOverlay;
		setActive(false);
		const file = e.dataTransfer.files?.[0];
		if (!file || !file.type.startsWith("image/")) return;
		if (type === "template") setTemplateFile(file);
		else if (type === "preview") setPreviewFile(file);
		else {
			setOverlayFile(file);
			setRemoveOverlay(false);
		}
	};

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "template" | "preview" | "overlay",
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (type === "template") setTemplateFile(file);
		else if (type === "preview") setPreviewFile(file);
		else {
			setOverlayFile(file);
			setRemoveOverlay(false);
		}
	};

	const handleSubmit = async () => {
		setFormError(null);

		const trimmedName = form.name.trim();
		if (!trimmedName) {
			setFormError("Template name is required");
			return;
		}

		// Admins set price; non-admin users don't. Validate as a finite,
		// non-negative number, then format back to a 2dp decimal string for
		// the API (AdminTemplateUpdateRequest.price is `string`).
		let validatedPrice: string | undefined;
		if (isAdmin) {
			const priceRaw = form.price.trim();
			if (priceRaw === "") {
				setFormError("Price is required");
				return;
			}
			const priceNum = Number(priceRaw);
			if (!Number.isFinite(priceNum) || priceNum < 0) {
				setFormError("Price must be a non-negative number");
				return;
			}
			validatedPrice = priceNum.toFixed(2);
		}

		const baseMeta = {
			name: trimmedName,
			description: form.description || undefined,
			category_id: form.category_id ?? undefined,
			layout_id: form.layout_id ?? undefined,
			template_type: form.template_type,
			tags: form.tags || undefined,
		};

		try {
			if (editing) {
				const adminUpdateData = {
					...baseMeta,
					status: form.status,
					price: validatedPrice,
					sort_order: form.sort_order,
				};
				if (isAdmin) {
					await adminUpdate.mutateAsync({
						id: editing.id,
						data: adminUpdateData,
						templateFile: templateFile || undefined,
						previewFile: previewFile || undefined,
						overlayFile: overlayFile || undefined,
						removeOverlay,
					});
				} else {
					await meUpdate.mutateAsync({
						id: editing.id,
						data: baseMeta,
						templateFile: templateFile || undefined,
						previewFile: previewFile || undefined,
						overlayFile: overlayFile || undefined,
						removeOverlay,
					});
				}
				onClose();
				return;
			}

			if (!templateFile || !previewFile) {
				setFormError("Both template file and preview file are required");
				return;
			}

			if (isAdmin) {
				await adminCreate.mutateAsync({
					templateFile,
					previewFile,
					overlayFile: overlayFile || undefined,
					metadata: {
						...baseMeta,
						status: form.status,
						price: validatedPrice,
						sort_order: form.sort_order,
					},
				});
			} else {
				await meCreate.mutateAsync({
					templateFile,
					previewFile,
					overlayFile: overlayFile || undefined,
					metadata: baseMeta,
				});
			}
			onClose();
		} catch (err) {
			setFormError(
				err instanceof Error
					? err.message
					: editing
						? "Failed to update template"
						: "Failed to upload template",
			);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Close"
				tabIndex={-1}
				onClick={onClose}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
			/>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="template-modal-title"
				className="relative w-full max-w-2xl bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors z-10"
					aria-label="Close"
				>
					<svg
						className="w-5 h-5 text-zinc-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<title>Close</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<div className="p-6 border-b border-[var(--border)]">
					<h2 id="template-modal-title" className="text-xl font-bold text-zinc-900 dark:text-white">
						{editing ? "Edit Template" : "Add New Template"}
					</h2>
					<p className="text-zinc-500 mt-1">
						{editing
							? "Update template details"
							: isAdmin
								? "Upload a new template to the marketplace"
								: "Upload a private template synced only to your booths"}
					</p>
				</div>
				<div className="p-6 space-y-6">
					{formError && (
						<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
							{formError}
						</div>
					)}
					<div>
						<label htmlFor="template-name" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
							Template Name *
						</label>
						<input
							id="template-name"
							type="text"
							value={form.name}
							onChange={(e) =>
								setForm((prev) => ({ ...prev, name: e.target.value }))
							}
							className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
							placeholder="Enter template name"
						/>
					</div>
					<div>
						<label htmlFor="template-description" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
							Description
						</label>
						<textarea
							id="template-description"
							value={form.description}
							onChange={(e) =>
								setForm((prev) => ({ ...prev, description: e.target.value }))
							}
							rows={3}
							className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494] resize-none"
							placeholder="Describe the template..."
						/>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label htmlFor="template-type" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
								Template Type
							</label>
							<select
								id="template-type"
								value={form.template_type}
								onChange={(e) =>
									handleTemplateTypeChange(e.target.value as AdminTemplateType)
								}
								className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
							>
								<option value="strip">Strip</option>
								<option value="photo_4x6">4x6 Photo</option>
							</select>
						</div>
						{isAdmin && (
							<div>
								<label htmlFor="template-status" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
									Status
								</label>
								<select
									id="template-status"
									value={form.status}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											status: e.target.value as AdminTemplateStatus,
										}))
									}
									className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
								>
									<option value="draft">Draft</option>
									<option value="active">Active</option>
									<option value="archived">Archived</option>
								</select>
							</div>
						)}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label htmlFor="template-category" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
								Category
							</label>
							<select
								id="template-category"
								value={form.category_id ?? ""}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										category_id: e.target.value ? Number(e.target.value) : null,
									}))
								}
								className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
							>
								<option value="">Select category...</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
										{!isAdmin
											? cat.mine
												? " (Custom)"
												: " (Built-in)"
											: ""}
									</option>
								))}
							</select>
						</div>
						<div>
							<label htmlFor="template-layout" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
								Layout
							</label>
							<select
								id="template-layout"
								value={form.layout_id ?? ""}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										layout_id: e.target.value || null,
									}))
								}
								className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
							>
								<option value="">Select layout...</option>
								{availableLayouts.map((layout) => (
									<option key={layout.id} value={layout.id}>
										{layout.name} ({layout.photo_count} photos)
										{!isAdmin
											? layout.mine
												? " (Custom)"
												: " (Built-in)"
											: ""}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<FileDropzone
							label="Template File"
							required={!editing}
							file={templateFile}
							existingPreviewUrl={editing?.download_url}
							existingFilename={editing?.original_filename}
							inputRef={templateFileRef}
							isDragging={dragActiveTemplate}
							onDrag={(e) => handleDrag(e, "template")}
							onDrop={(e) => handleDrop(e, "template")}
							onFileChange={(e) => handleFileChange(e, "template")}
						/>
						<FileDropzone
							label="Preview Image"
							required={!editing}
							file={previewFile}
							existingPreviewUrl={editing?.preview_url}
							existingFilename="Current preview"
							inputRef={previewFileRef}
							isDragging={dragActivePreview}
							onDrag={(e) => handleDrag(e, "preview")}
							onDrop={(e) => handleDrop(e, "preview")}
							onFileChange={(e) => handleFileChange(e, "preview")}
						/>
					</div>
					<OverlayDropzone
						file={overlayFile}
						editingOverlayUrl={editing?.overlay_url}
						removeOverlay={removeOverlay}
						setRemoveOverlay={setRemoveOverlay}
						setOverlayFile={setOverlayFile}
						inputRef={overlayFileRef}
						isDragging={dragActiveOverlay}
						onDrag={(e) => handleDrag(e, "overlay")}
						onDrop={(e) => handleDrop(e, "overlay")}
						onFileChange={(e) => handleFileChange(e, "overlay")}
					/>
					{isAdmin && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label htmlFor="template-price" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
									Price ($)
								</label>
								<input
									id="template-price"
									type="text"
									value={form.price}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, price: e.target.value }))
									}
									className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
									placeholder="0.00"
								/>
								<p className="text-xs text-zinc-500 mt-1">
									Set to 0.00 for free templates
								</p>
							</div>
							<div>
								<label htmlFor="template-sort-order" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
									Sort Order
								</label>
								<NumberInput
									id="template-sort-order"
									min={0}
									value={form.sort_order}
									onChange={(n) =>
										setForm((prev) => ({ ...prev, sort_order: n }))
									}
									className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
									placeholder="0"
								/>
								<p className="text-xs text-zinc-500 mt-1">
									Lower numbers appear first
								</p>
							</div>
						</div>
					)}
					<div>
						<label htmlFor="template-tags-input" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
							Tags
						</label>
						<div className="flex flex-wrap gap-2 mb-2">
							{(form.tags || "")
								.split(",")
								.filter(Boolean)
								.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300"
									>
										{tag}
										<button
											type="button"
											onClick={() => handleRemoveTag(tag)}
											className="hover:text-red-500"
											aria-label={`Remove ${tag}`}
										>
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
												aria-hidden="true"
											>
												<title>Remove</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>
									</span>
								))}
						</div>
						<div className="flex gap-2">
							<input
								id="template-tags-input"
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={handleTagKeyDown}
								className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
								placeholder="Add tag and press Enter"
							/>
							<button
								type="button"
								onClick={handleAddTag}
								className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
							>
								Add
							</button>
						</div>
					</div>
				</div>
				<div className="p-6 border-t border-[var(--border)] flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isPending}
						className="px-6 py-2.5 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{isPending && (
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						)}
						{editing ? "Save Changes" : "Create Template"}
					</button>
				</div>
			</div>
		</div>
	);
}

interface FileDropzoneProps {
	label: string;
	required: boolean;
	file: File | null;
	existingPreviewUrl?: string | null;
	existingFilename?: string | null;
	inputRef: React.RefObject<HTMLInputElement | null>;
	isDragging: boolean;
	onDrag: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileDropzone({
	label,
	required,
	file,
	existingPreviewUrl,
	existingFilename,
	inputRef,
	isDragging,
	onDrag,
	onDrop,
	onFileChange,
}: FileDropzoneProps) {
	return (
		<div>
			<label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
				{label} {required && "*"}
				{!required && existingPreviewUrl && (
					<span className="text-zinc-400 font-normal"> (Replace)</span>
				)}
			</label>
			<div
				className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
					isDragging
						? "border-[#069494] bg-[#069494]/10"
						: "border-[var(--border)] hover:border-[#069494]/50"
				}`}
				onDragEnter={onDrag}
				onDragLeave={onDrag}
				onDragOver={onDrag}
				onDrop={onDrop}
			>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					onChange={onFileChange}
					className="hidden"
				/>
				{file ? (
					<div className="space-y-2">
						<div className="w-12 h-12 mx-auto rounded-lg bg-[#10B981]/20 flex items-center justify-center">
							<svg
								className="w-6 h-6 text-[#10B981]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<title>Selected</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.5 12.75l6 6 9-13.5"
								/>
							</svg>
						</div>
						<p className="text-sm text-zinc-900 dark:text-white font-medium truncate">
							{file.name}
						</p>
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className="text-sm text-[#069494] hover:underline"
						>
							Change
						</button>
					</div>
				) : existingPreviewUrl ? (
					<div className="space-y-2">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={existingPreviewUrl}
							alt="Current"
							className="w-16 h-24 mx-auto object-contain rounded-lg bg-slate-100 dark:bg-zinc-800"
						/>
						<p className="text-xs text-zinc-500 truncate">{existingFilename}</p>
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className="text-sm text-[#069494] hover:underline"
						>
							Replace
						</button>
					</div>
				) : (
					<div className="space-y-2">
						<div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
							<svg
								className="w-6 h-6 text-zinc-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.5}
								aria-hidden="true"
							>
								<title>Upload</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
								/>
							</svg>
						</div>
						<p className="text-sm text-zinc-500">
							<button
								type="button"
								onClick={() => inputRef.current?.click()}
								className="text-[#069494] hover:underline"
							>
								Upload {label.toLowerCase()}
							</button>
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

interface OverlayDropzoneProps {
	file: File | null;
	editingOverlayUrl?: string | null;
	removeOverlay: boolean;
	setRemoveOverlay: (b: boolean) => void;
	setOverlayFile: (f: File | null) => void;
	inputRef: React.RefObject<HTMLInputElement | null>;
	isDragging: boolean;
	onDrag: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function OverlayDropzone({
	file,
	editingOverlayUrl,
	removeOverlay,
	setRemoveOverlay,
	setOverlayFile,
	inputRef,
	isDragging,
	onDrag,
	onDrop,
	onFileChange,
}: OverlayDropzoneProps) {
	return (
		<div>
			<label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
				Overlay File <span className="text-zinc-400 font-normal">(Optional)</span>
			</label>
			<div
				className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
					isDragging
						? "border-[#069494] bg-[#069494]/10"
						: "border-[var(--border)] hover:border-[#069494]/50"
				}`}
				onDragEnter={onDrag}
				onDragLeave={onDrag}
				onDragOver={onDrag}
				onDrop={onDrop}
			>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					onChange={onFileChange}
					className="hidden"
				/>
				{file ? (
					<div className="flex items-center justify-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
							<svg
								className="w-5 h-5 text-[#10B981]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<title>Selected</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.5 12.75l6 6 9-13.5"
								/>
							</svg>
						</div>
						<p className="text-sm text-zinc-900 dark:text-white font-medium truncate">
							{file.name}
						</p>
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className="text-sm text-[#069494] hover:underline flex-shrink-0"
						>
							Change
						</button>
						<button
							type="button"
							onClick={() => {
								setOverlayFile(null);
								setRemoveOverlay(false);
							}}
							className="text-sm text-red-500 hover:underline flex-shrink-0"
						>
							Remove
						</button>
					</div>
				) : editingOverlayUrl && !removeOverlay ? (
					<div className="flex items-center justify-center gap-3">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={editingOverlayUrl}
							alt="Current overlay"
							className="w-10 h-16 object-contain rounded-lg bg-slate-100 dark:bg-zinc-800 flex-shrink-0"
						/>
						<p className="text-sm text-zinc-500">Current overlay</p>
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className="text-sm text-[#069494] hover:underline flex-shrink-0"
						>
							Replace
						</button>
						<button
							type="button"
							onClick={() => setRemoveOverlay(true)}
							className="text-sm text-red-500 hover:underline flex-shrink-0"
						>
							Remove
						</button>
					</div>
				) : (
					<div className="flex items-center justify-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
							<svg
								className="w-5 h-5 text-zinc-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.5}
								aria-hidden="true"
							>
								<title>Upload</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-5.571 3v7.5M11.25 3l-4.821 2.75L12 8.5l5.571-2.75L12 3z"
								/>
							</svg>
						</div>
						<p className="text-sm text-zinc-500">
							<button
								type="button"
								onClick={() => inputRef.current?.click()}
								className="text-[#069494] hover:underline"
							>
								Upload overlay
							</button>{" "}
							— Decorative elements drawn on top of photos
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
