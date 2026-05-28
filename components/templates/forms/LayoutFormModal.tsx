"use client";

import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type FormEvent,
	type ReactNode,
} from "react";
import { useDialogFocusTrap } from "@/hooks/use-dialog-focus-trap";
import { detectPhotoSlotsFromFile } from "@/lib/template-slot-detection";
import { LayoutCanvasEditor } from "./LayoutCanvasEditor";
import {
	useCreateLayout,
	useUpdateLayout,
} from "@/core/api/templates/admin-queries";
import {
	useCreateMyLayout,
	useUpdateMyLayout,
} from "@/core/api/templates/me-queries";
import type {
	AdminShapeType,
	AdminTemplateLayout,
} from "@/core/api/templates/admin-types";
import {
	newDraftId,
	parseLayoutFromClipboard,
	serializeLayoutForClipboard,
	type PhotoAreaFormData,
} from "@/core/templates/layout-clipboard";
import { NumberInput } from "./NumberInput";

interface LayoutFormState {
	layout_key: string;
	name: string;
	description: string;
	width: number;
	height: number;
	photo_count: number;
	product_category_id: number;
	is_active: boolean;
	sort_order: number;
	photo_areas: PhotoAreaFormData[];
}

const PRODUCT_CATEGORIES = [
	{ id: 1, name: "Strips" },
	{ id: 2, name: "4x6" },
	{ id: 3, name: "Smartphone" },
];

const DEFAULT_PHOTO_AREA: PhotoAreaFormData = {
	photo_index: 1,
	x: 0,
	y: 0,
	width: 400,
	height: 400,
	rotation: 0,
	border_radius: 0,
	shape_type: "rectangle",
};

const DEFAULT_LAYOUT_FORM: LayoutFormState = {
	layout_key: "",
	name: "",
	description: "",
	width: 603,
	height: 1803,
	photo_count: 0,
	product_category_id: 1,
	is_active: true,
	sort_order: 0,
	photo_areas: [],
};

export interface LayoutFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	mode: "admin" | "me";
	editing: AdminTemplateLayout | null;
}

export function LayoutFormModal(props: LayoutFormModalProps) {
	if (!props.isOpen) return null;
	return <LayoutFormModalContent key={props.editing?.id ?? "new"} {...props} />;
}

function LayoutFormModalContent({
	onClose,
	mode,
	editing,
}: LayoutFormModalProps) {
	const isAdmin = mode === "admin";
	const [form, setForm] = useState<LayoutFormState>(() =>
		editing
			? {
					layout_key: editing.layout_key,
					name: editing.name,
					description: editing.description ?? "",
					width: editing.width,
					height: editing.height,
					photo_count: editing.photo_count,
					product_category_id: editing.product_category_id,
					is_active: editing.is_active,
					sort_order: editing.sort_order,
					photo_areas: [],
				}
			: DEFAULT_LAYOUT_FORM,
	);
	const [pasteMessage, setPasteMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const adminCreate = useCreateLayout();
	const adminUpdate = useUpdateLayout();
	const meCreate = useCreateMyLayout();
	const meUpdate = useUpdateMyLayout();
	const create = isAdmin ? adminCreate : meCreate;
	const update = isAdmin ? adminUpdate : meUpdate;
	const [validationError, setValidationError] = useState<string | null>(null);
	const isPending = create.isPending || update.isPending;
	const error = create.error || update.error;
	const displayError = validationError ?? error?.message ?? null;

	// Block user-initiated dismissal while a save is in flight. handleSubmit
	// still calls onClose() itself once mutateAsync resolves successfully.
	const guardedClose = () => {
		if (!isPending) onClose();
	};

	const dialogRef = useDialogFocusTrap<HTMLDivElement>({
		open: true,
		onClose: guardedClose,
	});

	// Hidden file input wired to the "Detect from image" button below.
	const slotImageInputRef = useRef<HTMLInputElement>(null);
	const [isDetectingSlots, setIsDetectingSlots] = useState(false);
	// Monotonic detection id so that if the operator picks file B before
	// file A's detection promise resolves, A's stale result is dropped on
	// the floor instead of overwriting B's photo_areas.
	const detectionIdRef = useRef(0);
	// Object URL of the template image. Used as the visual editor's backdrop
	// and as the auto-detect source. Held in state because it's purely a
	// client-side editor aid — layouts don't persist a reference image.
	const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(
		null,
	);
	// Ref mirror so the unmount cleanup can revoke the URL without depending
	// on the latest state.
	const referenceImageUrlRef = useRef<string | null>(null);
	useEffect(() => {
		referenceImageUrlRef.current = referenceImageUrl;
	}, [referenceImageUrl]);
	useEffect(() => {
		return () => {
			if (referenceImageUrlRef.current) {
				URL.revokeObjectURL(referenceImageUrlRef.current);
			}
		};
	}, []);

	const handleSlotImagePicked = async (
		e: ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		// Reset so picking the same file twice still triggers onChange.
		e.target.value = "";
		if (!file || !file.type.startsWith("image/")) return;
		setValidationError(null);
		setIsDetectingSlots(true);
		// Bump the detection id; the awaited block below bails if a newer
		// detection has superseded ours.
		detectionIdRef.current += 1;
		const myDetectionId = detectionIdRef.current;
		// Replace any prior reference image. Revoke the previous URL to
		// free the underlying blob.
		const url = URL.createObjectURL(file);
		setReferenceImageUrl((prev) => {
			if (prev) URL.revokeObjectURL(prev);
			return url;
		});
		try {
			const result = await detectPhotoSlotsFromFile(file);
			// Race guard: a newer file was picked while we were awaiting.
			// Drop this result — the newer call will own the form state and
			// the backdrop image.
			if (myDetectionId !== detectionIdRef.current) return;
			if (result.slots.length === 0) {
				setValidationError(
					"No transparent photo slots found in this image. The image is loaded as a backdrop — define photo areas manually or upload a PNG with transparent regions.",
				);
				// Still adopt the image's dimensions for the layout so the
				// canvas matches the template's aspect ratio.
				setForm((prev) => ({
					...prev,
					width: result.imageWidth,
					height: result.imageHeight,
				}));
				return;
			}
			setForm((prev) => ({
				...prev,
				width: result.imageWidth,
				height: result.imageHeight,
				photo_count: result.slots.length,
				photo_areas: result.slots.map((slot, idx) => ({
					...DEFAULT_PHOTO_AREA,
					photo_index: idx + 1,
					x: slot.x,
					y: slot.y,
					width: slot.width,
					height: slot.height,
					_draftId: newDraftId(),
				})),
			}));
		} catch (err) {
			// Suppress stale errors too.
			if (myDetectionId !== detectionIdRef.current) return;
			setValidationError(
				err instanceof Error
					? `Could not read image: ${err.message}`
					: "Could not read image.",
			);
		} finally {
			if (myDetectionId === detectionIdRef.current) {
				setIsDetectingSlots(false);
			}
		}
	};

	const handleAreasFromCanvas = (next: PhotoAreaFormData[]) => {
		setForm((prev) => ({ ...prev, photo_areas: next }));
	};

	// Tracks the draftId of the most recently duplicated photo area so the
	// canvas can move focus onto it (matching user expectation: "I just
	// hit Cmd+D, now I want to drag the copy"). Set by duplicateArea,
	// cleared by the canvas once focus has been applied.
	const [pendingFocusDraftId, setPendingFocusDraftId] = useState<string | null>(
		null,
	);

	// Clone an existing photo area. The copy is offset by 20px so it lands
	// just below-right of the original (clamped to the layout's bounds) and
	// gets a fresh photo_index (max+1) plus a fresh _draftId so React keys
	// stay stable. Wired to both the per-row "Duplicate" button and the
	// Cmd/Ctrl+D shortcut in the canvas.
	const duplicateArea = (idx: number) => {
		if (!form.photo_areas[idx]) return;
		// Generate the new draftId here so we can both put it on the new
		// area inside the setForm closure AND remember it for focus.
		const newId = newDraftId();
		setForm((prev) => {
			const original = prev.photo_areas[idx];
			if (!original) return prev;
			const OFFSET = 20;
			const newX = Math.max(
				0,
				Math.min(original.x + OFFSET, prev.width - original.width),
			);
			const newY = Math.max(
				0,
				Math.min(original.y + OFFSET, prev.height - original.height),
			);
			const maxIndex = prev.photo_areas.reduce(
				(m, a) => Math.max(m, a.photo_index),
				0,
			);
			return {
				...prev,
				photo_areas: [
					...prev.photo_areas,
					{
						...original,
						photo_index: maxIndex + 1,
						x: newX,
						y: newY,
						_draftId: newId,
					},
				],
			};
		});
		setPendingFocusDraftId(newId);
	};

	// "Full-screen mode" — same modal component, swaps sizing classes so the
	// canvas editor gets the whole viewport. Toggle via the button in the
	// header.
	const [isFullscreen, setIsFullscreen] = useState(false);

	const handlePasteLayout = async () => {
		try {
			if (!navigator.clipboard?.readText) {
				throw new Error(
					"Clipboard API is unavailable. This page must run on HTTPS or localhost.",
				);
			}
			const text = await navigator.clipboard.readText();
			const parsed = parseLayoutFromClipboard(text);
			setForm({
				layout_key: parsed.layout_key,
				name: parsed.name,
				description: parsed.description,
				width: parsed.width,
				height: parsed.height,
				photo_count: parsed.photo_areas.length,
				product_category_id: parsed.product_category_id,
				is_active: parsed.is_active,
				sort_order: parsed.sort_order,
				photo_areas: parsed.photo_areas,
			});
			const areaCount = parsed.photo_areas.length;
			setPasteMessage({
				type: "success",
				text: `Pasted layout with ${areaCount} photo area${areaCount === 1 ? "" : "s"}.${parsed.layout_key ? " Layout key was copied — change it if you want a new layout in the same environment." : ""}`,
			});
		} catch (err) {
			const isPermissionError =
				err instanceof Error &&
				(err.name === "NotAllowedError" || /not allowed/i.test(err.message));
			setPasteMessage({
				type: "error",
				text: isPermissionError
					? "Clipboard access was blocked. Allow clipboard access for this site in your browser settings and try again."
					: err instanceof Error
						? err.message
						: "Failed to read clipboard.",
			});
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setValidationError(null);

		const trimmedName = form.name.trim();
		const trimmedKey = form.layout_key.trim();
		if (!trimmedName) {
			setValidationError("Layout name is required");
			return;
		}
		if (!trimmedKey) {
			setValidationError("Layout key is required");
			return;
		}

		// Photo areas must have distinct photo_index values within the
		// 1..N range, and positive width/height. The backend keys areas by
		// index (so duplicates collide), and zero/negative geometry would
		// render as an invisible or inverted slot in the downstream layout
		// grid. Catch all three here before the round-trip.
		if (!editing && form.photo_areas.length > 0) {
			const count = form.photo_areas.length;
			const indexes = form.photo_areas.map((a) => a.photo_index);
			const outOfRange = indexes.some(
				(i) => !Number.isInteger(i) || i < 1 || i > count,
			);
			if (outOfRange) {
				setValidationError(
					`Each photo area's Index must be a whole number between 1 and ${count}.`,
				);
				return;
			}
			if (new Set(indexes).size !== indexes.length) {
				setValidationError(
					"Each photo area must have a unique Index. Adjust the duplicates and try again.",
				);
				return;
			}
			const badGeometry = form.photo_areas.some(
				(a) => a.width <= 0 || a.height <= 0,
			);
			if (badGeometry) {
				setValidationError(
					"Each photo area must have positive width and height.",
				);
				return;
			}
		}

		// User-editable fields shared between admin and me variants.
		const meUpdateData = {
			layout_key: trimmedKey,
			name: trimmedName,
			description: form.description,
			width: form.width,
			height: form.height,
			product_category_id: form.product_category_id,
		};
		// Admin-only adds is_active and sort_order; the me-side endpoint
		// strips those server-side, so we don't send them.
		const adminUpdateData = {
			...meUpdateData,
			is_active: form.is_active,
			sort_order: form.sort_order,
		};

		try {
			if (editing) {
				if (isAdmin) {
					await adminUpdate.mutateAsync({ id: editing.id, data: adminUpdateData });
				} else {
					await meUpdate.mutateAsync({ id: editing.id, data: meUpdateData });
				}
			} else {
				const meCreateData = {
					...meUpdateData,
					photo_count: form.photo_areas.length,
					photo_areas: form.photo_areas,
				};
				const adminCreateData = {
					...adminUpdateData,
					photo_count: form.photo_areas.length,
					photo_areas: form.photo_areas,
				};
				if (isAdmin) {
					await adminCreate.mutateAsync(adminCreateData);
				} else {
					await meCreate.mutateAsync(meCreateData);
				}
			}
			onClose();
		} catch {
			// error rendered below
		}
	};

	const updateArea = (idx: number, patch: Partial<PhotoAreaFormData>) => {
		setForm((prev) => ({
			...prev,
			photo_areas: prev.photo_areas.map((a, i) =>
				i === idx ? { ...a, ...patch } : a,
			),
		}));
	};

	return (
		<div
			className={
				isFullscreen
					? "fixed inset-0 z-50"
					: "fixed inset-0 z-50 flex items-center justify-center p-4"
			}
		>
			<button
				type="button"
				aria-label="Close"
				tabIndex={-1}
				onClick={guardedClose}
				className="absolute inset-0 bg-black/60 cursor-default"
			/>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="layout-modal-title"
				className={
					isFullscreen
						? "relative w-full h-full bg-white dark:bg-[#111111] overflow-y-auto"
						: "relative w-full max-w-xl bg-white dark:bg-[#111111] rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
				}
			>
				<div className="p-6 border-b border-slate-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-[#111111]">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 id="layout-modal-title" className="text-lg font-bold text-zinc-900 dark:text-white">
								{editing ? "Edit Layout" : "Create Layout"}
							</h2>
							{!isAdmin && (
								<p className="text-sm text-zinc-500 mt-0.5">
									Private layout for your own templates
								</p>
							)}
						</div>
						<div className="flex items-center gap-2">
							{isAdmin && !editing && (
								<button
									type="button"
									onClick={handlePasteLayout}
									className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
									title="Fill the form from a copied layout JSON"
								>
									<svg
										className="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
										aria-hidden="true"
									>
										<title>Paste</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
										/>
									</svg>
									Paste from clipboard
								</button>
							)}
							<button
								type="button"
								onClick={() => setIsFullscreen((v) => !v)}
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
								aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
								title={
									isFullscreen
										? "Shrink back to modal view"
										: "Expand to full screen for easier editing"
								}
							>
								<svg
									className="w-3.5 h-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									aria-hidden="true"
								>
									<title>{isFullscreen ? "Exit full screen" : "Full screen"}</title>
									{isFullscreen ? (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
										/>
									) : (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
										/>
									)}
								</svg>
								{isFullscreen ? "Modal view" : "Full screen"}
							</button>
						</div>
					</div>
					{pasteMessage && !editing && isAdmin && (
						<div
							role="alert"
							aria-live={pasteMessage.type === "error" ? "assertive" : "polite"}
							className={`mt-3 px-3 py-2 rounded-lg text-xs ${
								pasteMessage.type === "success"
									? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
									: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
							}`}
						>
							{pasteMessage.text}
						</div>
					)}
				</div>
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{displayError && (
						<div role="alert" className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
							{displayError}
						</div>
					)}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="layout-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
								Name
							</label>
							<input
								id="layout-name"
								type="text"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								required
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</div>
						<div>
							<label htmlFor="layout-key" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
								Layout Key
							</label>
							<input
								id="layout-key"
								type="text"
								value={form.layout_key}
								onChange={(e) =>
									setForm({ ...form, layout_key: e.target.value })
								}
								required
								placeholder="Strip-3-Shot-Custom"
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<label htmlFor="layout-description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
							Description
						</label>
						<textarea
							id="layout-description"
							value={form.description}
							onChange={(e) =>
								setForm({ ...form, description: e.target.value })
							}
							rows={2}
							className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
						/>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<div>
							<label htmlFor="layout-width" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
								Width (px)
							</label>
							<NumberInput
								id="layout-width"
								value={form.width}
								onChange={(n) => setForm({ ...form, width: n })}
								required
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</div>
						<div>
							<label htmlFor="layout-height" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
								Height (px)
							</label>
							<NumberInput
								id="layout-height"
								value={form.height}
								onChange={(n) => setForm({ ...form, height: n })}
								required
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
								Photo Count
							</label>
							<div className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white">
								{editing ? form.photo_count : form.photo_areas.length}
							</div>
							<p className="text-xs text-zinc-500 mt-1">
								{editing
									? "Managed via photo areas in the expanded view"
									: "Auto-set from photo areas below"}
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="layout-product-type" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
								Product Type
							</label>
							<select
								id="layout-product-type"
								value={form.product_category_id}
								onChange={(e) =>
									setForm({
										...form,
										product_category_id: parseInt(e.target.value, 10),
									})
								}
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							>
								{PRODUCT_CATEGORIES.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
						</div>
						{isAdmin && (
							<div>
								<label htmlFor="layout-sort-order" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
									Sort Order
								</label>
								<NumberInput
									id="layout-sort-order"
									value={form.sort_order}
									onChange={(n) => setForm({ ...form, sort_order: n })}
									className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
								/>
							</div>
						)}
					</div>
					{isAdmin && (
						<div>
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
						</div>
					)}
					{!editing && (
						<div>
							<div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
								<label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
									Photo Areas ({form.photo_areas.length})
								</label>
								<div className="flex items-center gap-2">
									<input
										ref={slotImageInputRef}
										type="file"
										accept="image/png,image/webp"
										className="sr-only"
										onChange={handleSlotImagePicked}
									/>
									<button
										type="button"
										onClick={() => slotImageInputRef.current?.click()}
										disabled={isDetectingSlots}
										className="text-xs px-2.5 py-1 rounded-lg border border-[#069494]/40 text-[#069494] hover:bg-[#069494]/10 disabled:opacity-50"
										title="Upload a transparent PNG; we'll auto-detect the photo slots from its transparent regions."
									>
										{isDetectingSlots ? "Detecting…" : "Auto-detect from image"}
									</button>
									<button
										type="button"
										onClick={() =>
											setForm((prev) => {
												// Use max(existing) + 1 instead of length + 1 so
												// the new index doesn't collide with surviving
												// indexes after a middle-row delete (e.g., delete
												// #2 from [1,2,3] → adding "length+1" yields 3,
												// which collides with the surviving #3).
												const nextIndex =
													prev.photo_areas.reduce(
														(m, a) => Math.max(m, a.photo_index),
														0,
													) + 1;
												return {
													...prev,
													photo_areas: [
														...prev.photo_areas,
														{
															...DEFAULT_PHOTO_AREA,
															photo_index: nextIndex,
															_draftId: newDraftId(),
														},
													],
												};
											})
										}
										className="text-xs px-2.5 py-1 rounded-lg bg-[#069494] text-white hover:bg-[#176161]"
									>
										+ Add Photo Area
									</button>
								</div>
							</div>
							{form.photo_areas.length === 0 && !referenceImageUrl && (
								<p className="text-xs text-zinc-400 italic py-3 text-center border border-dashed border-slate-200 dark:border-zinc-700 rounded-lg">
									No photo areas added yet. Use &quot;Auto-detect from image&quot; or &quot;+ Add Photo Area&quot; to get started.
								</p>
							)}
							{(form.photo_areas.length > 0 || referenceImageUrl) && (
								<div className="mb-4">
									<LayoutCanvasEditor
										imageSrc={referenceImageUrl}
										imageWidth={form.width}
										imageHeight={form.height}
										photoAreas={form.photo_areas}
										onAreasChange={handleAreasFromCanvas}
										onDuplicate={duplicateArea}
										pendingFocusDraftId={pendingFocusDraftId}
										onFocusApplied={() => setPendingFocusDraftId(null)}
									/>
									<p className="text-[10px] text-zinc-500 mt-1">
										Drag to move, corners to resize, the small handle on the top edge to round corners (drag to the middle to make a circle). Hold Shift to snap to 10px. Tab into a rectangle, then arrow keys to nudge (Shift+arrow for 10px), Delete to remove, Cmd/Ctrl+D to duplicate. For heart, petal, or custom cutouts, define a rectangular slot here and mask the visible cutout via the template overlay PNG when creating the template.
									</p>
								</div>
							)}
							<div className="space-y-3">
								{form.photo_areas.map((area, idx) => (
									<div
										key={area._draftId ?? idx}
										className="p-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900"
									>
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
												Photo Area #{area.photo_index}
											</span>
											<div className="flex items-center gap-3">
												<button
													type="button"
													onClick={() => duplicateArea(idx)}
													className="text-xs text-[#069494] hover:underline"
												>
													Duplicate
												</button>
												<button
													type="button"
													onClick={() =>
														setForm((prev) => ({
															...prev,
															photo_areas: prev.photo_areas.filter(
																(_, i) => i !== idx,
															),
														}))
													}
													className="text-xs text-red-500 hover:underline"
												>
													Remove
												</button>
											</div>
										</div>
										<div className="grid grid-cols-4 gap-2">
											<MiniField label="Index" htmlFor={`pa-${idx}-index`}>
												<NumberInput
													id={`pa-${idx}-index`}
													min={1}
													emptyValue={1}
													value={area.photo_index}
													onChange={(n) => updateArea(idx, { photo_index: n })}
													className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
												/>
											</MiniField>
											<MiniField label="Shape" htmlFor={`pa-${idx}-shape`}>
												<select
													id={`pa-${idx}-shape`}
													value={area.shape_type}
													onChange={(e) =>
														updateArea(idx, {
															shape_type: e.target.value as AdminShapeType,
														})
													}
													className="w-full px-1 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
												>
													<option value="rectangle">Rect</option>
													<option value="rounded_rectangle">Rounded</option>
													<option value="circle">Circle</option>
													<option value="heart">Heart</option>
													<option value="petal">Petal</option>
												</select>
											</MiniField>
											<MiniField label="X" htmlFor={`pa-${idx}-x`}>
												<NumberInput
													id={`pa-${idx}-x`}
													value={area.x}
													onChange={(n) => updateArea(idx, { x: n })}
													className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
												/>
											</MiniField>
											<MiniField label="Y" htmlFor={`pa-${idx}-y`}>
												<NumberInput
													id={`pa-${idx}-y`}
													value={area.y}
													onChange={(n) => updateArea(idx, { y: n })}
													className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
												/>
											</MiniField>
											<MiniField label="Width" htmlFor={`pa-${idx}-width`}>
												<NumberInput
													id={`pa-${idx}-width`}
													value={area.width}
													onChange={(n) => updateArea(idx, { width: n })}
													className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
												/>
											</MiniField>
											<MiniField label="Height" htmlFor={`pa-${idx}-height`}>
												<NumberInput
													id={`pa-${idx}-height`}
													value={area.height}
													onChange={(n) => updateArea(idx, { height: n })}
													className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
												/>
											</MiniField>
											<MiniField label="Rotation" htmlFor={`pa-${idx}-rotation`}>
												<NumberInput
													id={`pa-${idx}-rotation`}
													float
													value={area.rotation}
													onChange={(n) => updateArea(idx, { rotation: n })}
													className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
												/>
											</MiniField>
											<MiniField label="Radius" htmlFor={`pa-${idx}-radius`}>
												<NumberInput
													id={`pa-${idx}-radius`}
													value={area.border_radius}
													onChange={(n) =>
														updateArea(idx, { border_radius: n })
													}
													className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
												/>
											</MiniField>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={guardedClose}
							disabled={isPending}
							className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50"
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

function MiniField({
	label,
	htmlFor,
	children,
}: {
	label: string;
	htmlFor: string;
	children: ReactNode;
}) {
	return (
		<div>
			<label htmlFor={htmlFor} className="block text-[10px] text-zinc-500 mb-0.5">{label}</label>
			{children}
		</div>
	);
}

// Re-export so callers can use the same util the admin page does without importing it.
export { serializeLayoutForClipboard };
