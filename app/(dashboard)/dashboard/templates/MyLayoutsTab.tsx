"use client";

import { useEffect, useState } from "react";
import { useDialogFocusTrap } from "@/hooks/use-dialog-focus-trap";
import {
	useDeleteMyLayout,
	useDeleteMyPhotoArea,
	useMyLayouts,
} from "@/core/api/templates/me-queries";
import type {
	MyPhotoArea,
	MyTemplateLayout,
} from "@/core/api/templates/me-types";
import { LayoutFormModal } from "@/components/templates/forms/LayoutFormModal";
import { PhotoAreaFormModal } from "@/components/templates/forms/PhotoAreaFormModal";

interface MyLayoutsTabProps {
	onCount?: (count: number) => void;
}

export function MyLayoutsTab({ onCount }: MyLayoutsTabProps) {
	// Default to private-only; user can opt in to built-ins via toggle.
	const [showBuiltIns, setShowBuiltIns] = useState(false);
	const { data, isLoading, isError, refetch } = useMyLayouts({
		includeGlobal: showBuiltIns,
	});
	const delLayout = useDeleteMyLayout();
	const delArea = useDeleteMyPhotoArea();

	const [editingLayout, setEditingLayout] = useState<MyTemplateLayout | null>(null);
	const [layoutModalOpen, setLayoutModalOpen] = useState(false);
	const [photoAreaModalLayoutId, setPhotoAreaModalLayoutId] = useState<string | null>(null);
	const [editingPhotoArea, setEditingPhotoArea] = useState<MyPhotoArea | null>(null);
	const [expandedLayoutId, setExpandedLayoutId] = useState<string | null>(null);
	const [confirmDeleteLayoutId, setConfirmDeleteLayoutId] = useState<string | null>(null);
	const [confirmDeleteArea, setConfirmDeleteArea] = useState<{
		layoutId: string;
		photoAreaId: number;
	} | null>(null);

	const layouts = data?.layouts ?? [];
	const mineCount = layouts.filter((l) => l.owner_id !== null).length;

	useEffect(() => {
		// Tab chip always shows owned count regardless of toggle.
		onCount?.(mineCount);
	}, [onCount, mineCount]);

	const deleteLayoutDialogRef = useDialogFocusTrap<HTMLDivElement>({
		open: confirmDeleteLayoutId !== null,
		onClose: () => setConfirmDeleteLayoutId(null),
	});
	const deleteAreaDialogRef = useDialogFocusTrap<HTMLDivElement>({
		open: confirmDeleteArea !== null,
		onClose: () => setConfirmDeleteArea(null),
	});

	const { reset: resetDelLayout } = delLayout;
	const { reset: resetDelArea } = delArea;

	// Clear stale mutation errors when each dialog opens.
	useEffect(() => {
		if (confirmDeleteLayoutId !== null) resetDelLayout();
	}, [confirmDeleteLayoutId, resetDelLayout]);
	useEffect(() => {
		if (confirmDeleteArea !== null) resetDelArea();
	}, [confirmDeleteArea, resetDelArea]);

	const openCreateLayout = () => {
		setEditingLayout(null);
		setLayoutModalOpen(true);
	};

	const openEditLayout = (l: MyTemplateLayout) => {
		setEditingLayout(l);
		setLayoutModalOpen(true);
	};

	const openAddArea = (layoutId: string) => {
		setPhotoAreaModalLayoutId(layoutId);
		setEditingPhotoArea(null);
	};

	const openEditArea = (layoutId: string, area: MyPhotoArea) => {
		setPhotoAreaModalLayoutId(layoutId);
		setEditingPhotoArea(area);
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
					Show built-in layouts
				</label>
				<button
					type="button"
					onClick={openCreateLayout}
					className="flex items-center gap-2 px-4 py-2.5 bg-[#069494] text-white font-medium rounded-xl hover:bg-[#176161] transition-colors"
				>
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
						<title>Add</title>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					Add Layout
				</button>
			</div>

			{isLoading && (
				<div className="animate-pulse space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-20 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
					))}
				</div>
			)}

			{isError && !isLoading && (
				<div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
					<p className="text-zinc-500 dark:text-zinc-400 mb-4">Failed to load layouts.</p>
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
				<div className="space-y-4">
					{layouts.map((layout) => {
						const isMine = layout.owner_id !== null;
						const isExpanded = expandedLayoutId === layout.id;
						return (
							<div
								key={layout.id}
								className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden"
							>
								<div className="p-4 flex items-center justify-between">
									<div className="flex items-center gap-4">
										<button
											type="button"
											onClick={() =>
												setExpandedLayoutId(isExpanded ? null : layout.id)
											}
											className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800"
											aria-label={
												isExpanded
													? `Collapse ${layout.name}`
													: `Expand ${layout.name}`
											}
											aria-expanded={isExpanded}
											aria-controls={`panel-${layout.id}`}
										>
											<svg
												className={`w-5 h-5 text-zinc-500 transition-transform ${
													isExpanded ? "rotate-90" : ""
												}`}
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
												aria-hidden="true"
											>
												<title>Toggle</title>
												<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
											</svg>
										</button>
										<div>
											<div className="flex items-center gap-2">
												<p className="font-semibold text-zinc-900 dark:text-white">
													{layout.name}
												</p>
												<span
													className={`text-xs font-medium px-2 py-0.5 rounded-full ${
														isMine
															? "bg-[#069494]/20 text-[#069494]"
															: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
													}`}
												>
													{isMine ? "Custom" : "Built-in"}
												</span>
											</div>
											<p className="text-sm text-zinc-500">{layout.layout_key}</p>
										</div>
									</div>
									<div className="flex items-center gap-6">
										<div className="text-sm text-zinc-500">
											<span className="font-medium text-zinc-700 dark:text-zinc-300">
												{layout.width}
											</span>{" "}
											x{" "}
											<span className="font-medium text-zinc-700 dark:text-zinc-300">
												{layout.height}
											</span>
										</div>
										<div className="text-sm">
											<span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
												{layout.photo_areas?.length ?? layout.photo_count} photos
											</span>
										</div>
										{isMine && (
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() => openEditLayout(layout)}
													className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
													aria-label={`Edit ${layout.name}`}
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
													onClick={() => setConfirmDeleteLayoutId(layout.id)}
													className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-500 hover:text-red-600"
													aria-label={`Delete ${layout.name}`}
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
										)}
									</div>
								</div>

								{isExpanded && (
									<div
										id={`panel-${layout.id}`}
										role="region"
										aria-label={`Photo areas for ${layout.name}`}
										className="border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 p-4"
									>
										<div className="flex items-center justify-between mb-4">
											<h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
												Photo Areas
											</h4>
											{isMine && (
												<button
													type="button"
													onClick={() => openAddArea(layout.id)}
													className="text-sm text-[#069494] hover:underline font-medium"
												>
													+ Add Photo Area
												</button>
											)}
										</div>
										{layout.photo_areas && layout.photo_areas.length > 0 ? (
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
												{layout.photo_areas.map((area) => (
													<div
														key={area.id}
														className="bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700 p-3"
													>
														<div className="flex items-center justify-between mb-2">
															<span className="text-sm font-medium text-zinc-900 dark:text-white">
																Photo #{area.photo_index}
															</span>
															<div className="flex items-center gap-1">
																<span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-500">
																	{area.shape_type}
																</span>
																{isMine && (
																	<>
																		<button
																			type="button"
																			onClick={() => openEditArea(layout.id, area)}
																			className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-[#069494]"
																			aria-label={`Edit photo area ${area.photo_index}`}
																		>
																			<svg
																				className="w-3.5 h-3.5"
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
																			onClick={() =>
																				setConfirmDeleteArea({
																					layoutId: layout.id,
																					photoAreaId: area.id,
																				})
																			}
																			className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-600"
																			aria-label={`Delete photo area ${area.photo_index}`}
																		>
																			<svg
																				className="w-3.5 h-3.5"
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
																	</>
																)}
															</div>
														</div>
														<div className="text-xs text-zinc-500 space-y-1">
															<p>
																Position: ({area.x}, {area.y})
															</p>
															<p>
																Size: {area.width} x {area.height}
															</p>
															{area.rotation !== 0 && <p>Rotation: {area.rotation}°</p>}
															{area.border_radius > 0 && (
																<p>Radius: {area.border_radius}px</p>
															)}
														</div>
													</div>
												))}
											</div>
										) : (
											<p className="text-sm text-zinc-500">No photo areas defined.</p>
										)}
									</div>
								)}
							</div>
						);
					})}

					{layouts.length === 0 && (
						<div className="text-center py-12 bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-zinc-800">
							<p className="text-zinc-500">No layouts yet. Create one to get started.</p>
						</div>
					)}
				</div>
			)}

			<LayoutFormModal
				isOpen={layoutModalOpen}
				onClose={() => setLayoutModalOpen(false)}
				mode="me"
				editing={editingLayout}
			/>

			<PhotoAreaFormModal
				isOpen={photoAreaModalLayoutId !== null}
				onClose={() => {
					setPhotoAreaModalLayoutId(null);
					setEditingPhotoArea(null);
				}}
				mode="me"
				layoutId={photoAreaModalLayoutId ?? ""}
				editing={editingPhotoArea}
			/>

			{confirmDeleteLayoutId !== null && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<button
						type="button"
						aria-label="Close"
						tabIndex={-1}
						className="absolute inset-0 bg-black/60 cursor-default"
						onClick={() => setConfirmDeleteLayoutId(null)}
					/>
					<div
						ref={deleteLayoutDialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="delete-layout-title"
						aria-describedby="delete-layout-desc"
						className="relative w-full max-w-sm bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-6"
					>
						<h3 id="delete-layout-title" className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Delete Layout</h3>
						<p id="delete-layout-desc" className="text-sm text-zinc-500 mb-6">
							This will also delete all photo areas in this layout. This action cannot be undone.
						</p>
						{delLayout.error && (
							<div role="alert" className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
								{delLayout.error.message}
							</div>
						)}
						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setConfirmDeleteLayoutId(null)}
								className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() =>
									delLayout.mutate(confirmDeleteLayoutId, {
										onSuccess: () => setConfirmDeleteLayoutId(null),
									})
								}
								disabled={delLayout.isPending}
								className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
							>
								{delLayout.isPending ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{confirmDeleteArea !== null && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<button
						type="button"
						aria-label="Close"
						tabIndex={-1}
						className="absolute inset-0 bg-black/60 cursor-default"
						onClick={() => setConfirmDeleteArea(null)}
					/>
					<div
						ref={deleteAreaDialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="delete-area-title"
						aria-describedby="delete-area-desc"
						className="relative w-full max-w-sm bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-6"
					>
						<h3 id="delete-area-title" className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Delete Photo Area</h3>
						<p id="delete-area-desc" className="text-sm text-zinc-500 mb-6">
							Are you sure you want to delete this photo area? This action cannot be undone.
						</p>
						{delArea.error && (
							<div role="alert" className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
								{delArea.error.message}
							</div>
						)}
						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setConfirmDeleteArea(null)}
								className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() =>
									delArea.mutate(confirmDeleteArea, {
										onSuccess: () => setConfirmDeleteArea(null),
									})
								}
								disabled={delArea.isPending}
								className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
							>
								{delArea.isPending ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
