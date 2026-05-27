"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	useDownloadTemplate,
	usePurchasedTemplates,
} from "@/core/api/templates/queries";
import type { TemplatePurchase } from "@/core/api/templates/types";
import { downloadTemplateAsZip } from "@/lib/download-zip";

function Skeleton({ className = "" }: { className?: string }) {
	return (
		<div
			className={`animate-pulse bg-slate-200 dark:bg-zinc-800 rounded ${className}`}
		/>
	);
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function PurchasedTab() {
	const searchParams = useSearchParams();
	const boothId = searchParams.get("booth") ?? "";
	const [page, setPage] = useState(1);
	const perPage = 20;

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset page when boothId changes
	useEffect(() => {
		setPage(1);
	}, [boothId]);

	const { data, isLoading, isError, refetch } = usePurchasedTemplates({
		booth_id: boothId,
		page,
		per_page: perPage,
	});
	const downloadMutation = useDownloadTemplate();

	const purchases = data?.purchases ?? [];
	const totalPages = data?.total_pages ?? 1;

	const [downloadingId, setDownloadingId] = useState<number | null>(null);
	const [downloadError, setDownloadError] = useState<string | null>(null);

	const handleDownload = async (purchase: TemplatePurchase) => {
		// Block overlapping downloads so a slow first request can't have its
		// loading state cleared by a second click on a different template.
		if (downloadingId !== null) {
			setDownloadError("Another download is in progress. Please wait.");
			return;
		}
		const startedId = purchase.template.id;
		setDownloadingId(startedId);
		setDownloadError(null);
		try {
			const result = await downloadMutation.mutateAsync(startedId);
			if (!result.download_url) {
				setDownloadError("Download link not available. Please try again.");
				return;
			}
			await downloadTemplateAsZip({
				name: purchase.template.name,
				downloadUrl: result.download_url,
				previewUrl: purchase.template.preview_url,
				overlayUrl: purchase.template.overlay_url,
				fileType: purchase.template.file_type,
			});
		} catch {
			setDownloadError("Failed to download template. Please try again.");
		} finally {
			// Only clear if our own download is still the in-flight one.
			setDownloadingId((current) => (current === startedId ? null : current));
		}
	};

	return (
		<div>
			{!boothId && (
				<div className="text-center py-16">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-zinc-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
						Select a booth
					</h3>
					<p className="text-sm text-zinc-500">
						Choose a booth from the dropdown above to view its purchased
						templates.
					</p>
				</div>
			)}

			{boothId && downloadError && (
				<div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 flex items-center justify-between">
					<span>{downloadError}</span>
					<button
						type="button"
						onClick={() => setDownloadError(null)}
						className="ml-2 font-medium hover:underline"
					>
						Dismiss
					</button>
				</div>
			)}

			{boothId && isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden"
						>
							<Skeleton className="w-full h-[350px]" />
							<div className="p-4 space-y-2">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</div>
						</div>
					))}
				</div>
			)}

			{boothId && isError && !isLoading && (
				<div className="text-center py-16">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-red-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
						Failed to load templates
					</h3>
					<p className="text-sm text-zinc-500 mb-4">Please try again later.</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="px-4 py-2.5 rounded-xl bg-[#069494] text-white text-sm font-semibold hover:bg-[#176161] transition-colors"
					>
						Try Again
					</button>
				</div>
			)}

			{boothId && !isLoading && !isError && purchases.length === 0 && (
				<div className="text-center py-16">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-zinc-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v12a2.25 2.25 0 002.25 2.25z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
						No purchased templates yet
					</h3>
					<p className="text-sm text-zinc-500 mb-6">
						Purchase templates from the marketplace to see them here.
					</p>
					<Link
						href="/templates"
						className="inline-flex px-6 py-3 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-colors"
					>
						Browse Templates
					</Link>
				</div>
			)}

			{boothId && !isLoading && !isError && purchases.length > 0 && (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{purchases.map((purchase) => (
							<div
								key={purchase.id}
								className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden group"
							>
								<div className="relative h-[350px] bg-slate-100 dark:bg-zinc-900">
									<Image
										src={purchase.template.preview_url}
										alt={purchase.template.name}
										fill
										className="object-contain p-1"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
									/>
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
										<button
											type="button"
											onClick={() => handleDownload(purchase)}
											disabled={downloadingId === purchase.template.id}
											className="px-4 py-2.5 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 disabled:opacity-50 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#069494] focus-visible:ring-offset-2"
										>
											{downloadingId === purchase.template.id ? (
												<svg
													aria-hidden="true"
													className="w-4 h-4 animate-spin"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													/>
												</svg>
											) : (
												<svg
													aria-hidden="true"
													className="w-4 h-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={2}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
													/>
												</svg>
											)}
											Download
										</button>
									</div>
								</div>
								<div className="p-4">
									<h3 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
										{purchase.template.name}
									</h3>
									<div className="flex items-center justify-between mt-2">
										<span className="text-xs text-zinc-500">
											Purchased {formatDate(purchase.purchased_at)}
										</span>
										<span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
											${parseFloat(purchase.amount_paid).toFixed(2)}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>

					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-3 mt-8">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								Previous
							</button>
							<span className="text-sm text-zinc-500">
								Page {page} of {totalPages}
							</span>
							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
