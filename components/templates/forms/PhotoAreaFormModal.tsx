"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
	useAddPhotoArea,
	useUpdatePhotoArea,
} from "@/core/api/templates/admin-queries";
import {
	useAddMyPhotoArea,
	useUpdateMyPhotoArea,
} from "@/core/api/templates/me-queries";
import type { AdminShapeType } from "@/core/api/templates/admin-types";
import { NumberInput } from "./NumberInput";

const SHAPE_OPTIONS: AdminShapeType[] = [
	"rectangle",
	"rounded_rectangle",
	"circle",
	"heart",
	"petal",
];

export interface PhotoAreaInput {
	id?: number;
	photo_index: number;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	border_radius: number;
	shape_type: AdminShapeType;
}

const DEFAULT_PHOTO_AREA: PhotoAreaInput = {
	photo_index: 1,
	x: 0,
	y: 0,
	width: 400,
	height: 400,
	rotation: 0,
	border_radius: 0,
	shape_type: "rectangle",
};

export interface PhotoAreaFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	mode: "admin" | "me";
	layoutId: string;
	editing: PhotoAreaInput | null;
	/** Called after a successful save (admin uses this to sync photo_count). */
	onSaved?: () => void;
}

export function PhotoAreaFormModal(props: PhotoAreaFormModalProps) {
	if (!props.isOpen) return null;
	return (
		<PhotoAreaFormModalContent
			key={props.editing?.id ?? "new"}
			{...props}
		/>
	);
}

function PhotoAreaFormModalContent({
	onClose,
	mode,
	layoutId,
	editing,
	onSaved,
}: PhotoAreaFormModalProps) {
	const [form, setForm] = useState<PhotoAreaInput>(
		() => editing ?? DEFAULT_PHOTO_AREA,
	);

	const adminAdd = useAddPhotoArea();
	const adminUpdate = useUpdatePhotoArea();
	const meAdd = useAddMyPhotoArea();
	const meUpdate = useUpdateMyPhotoArea();

	const add = mode === "admin" ? adminAdd : meAdd;
	const update = mode === "admin" ? adminUpdate : meUpdate;

	const isPending = add.isPending || update.isPending;
	const error = add.error || update.error;
	const [validationError, setValidationError] = useState<string | null>(null);
	const displayError = validationError ?? error?.message ?? null;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setValidationError(null);

		if (form.width <= 0 || form.height <= 0) {
			setValidationError("Width and height must be greater than zero");
			return;
		}

		try {
			if (editing?.id !== undefined) {
				await update.mutateAsync({
					layoutId,
					photoAreaId: editing.id,
					data: form,
				});
			} else {
				await add.mutateAsync({ layoutId, data: form });
			}
			onSaved?.();
			onClose();
		} catch {
			// Error surfaces via the `error` field rendered below.
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
			<div className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-xl overflow-hidden">
				<div className="p-6 border-b border-slate-200 dark:border-zinc-800">
					<h2 className="text-lg font-bold text-zinc-900 dark:text-white">
						{editing ? "Edit Photo Area" : "Add Photo Area"}
					</h2>
				</div>
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{displayError && (
						<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
							{displayError}
						</div>
					)}
					<div className="grid grid-cols-2 gap-4">
						<Field label="Photo Index">
							<NumberInput
								value={form.photo_index}
								onChange={(n) => setForm({ ...form, photo_index: n })}
								min={1}
								emptyValue={1}
								required
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</Field>
						<Field label="Shape">
							<select
								value={form.shape_type}
								onChange={(e) =>
									setForm({
										...form,
										shape_type: e.target.value as AdminShapeType,
									})
								}
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							>
								{SHAPE_OPTIONS.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</Field>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<Field label="X Position">
							<NumberInput
								value={form.x}
								onChange={(n) => setForm({ ...form, x: n })}
								required
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</Field>
						<Field label="Y Position">
							<NumberInput
								value={form.y}
								onChange={(n) => setForm({ ...form, y: n })}
								required
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</Field>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<Field label="Width">
							<NumberInput
								value={form.width}
								onChange={(n) => setForm({ ...form, width: n })}
								required
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</Field>
						<Field label="Height">
							<NumberInput
								value={form.height}
								onChange={(n) => setForm({ ...form, height: n })}
								required
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</Field>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<Field label="Rotation (°)">
							<NumberInput
								float
								value={form.rotation}
								onChange={(n) => setForm({ ...form, rotation: n })}
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</Field>
						<Field label="Border Radius">
							<NumberInput
								value={form.border_radius}
								onChange={(n) => setForm({ ...form, border_radius: n })}
								className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
							/>
						</Field>
					</div>
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
							{isPending
								? editing
									? "Saving..."
									: "Adding..."
								: editing
									? "Save Changes"
									: "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div>
			<label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
				{label}
			</label>
			{children}
		</div>
	);
}
