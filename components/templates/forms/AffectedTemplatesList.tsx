"use client";

import type { MyTemplate } from "@/core/api/templates/me-types";

interface AffectedTemplatesListProps {
	isLoading: boolean;
	isError: boolean;
	/** The templates returned for this category/layout (may be a partial page). */
	templates: MyTemplate[];
	/** Total count across all pages, used to render the "+N more" affordance. */
	total: number;
}

/**
 * Renders the list of templates that a category/layout delete will affect, for
 * the confirmation dialog. Shows a loading line while the list is fetched and a
 * non-blocking note if it fails (the delete is still safe — the server handles
 * the templates regardless of what we managed to show). Renders nothing when
 * there are no templates; the caller shows a simpler confirm in that case.
 */
export function AffectedTemplatesList({
	isLoading,
	isError,
	templates,
	total,
}: AffectedTemplatesListProps) {
	if (isLoading) {
		return <p className="text-sm text-zinc-500 mb-4">Checking templates…</p>;
	}

	if (isError) {
		return (
			<p className="text-sm text-amber-600 dark:text-amber-500 mb-4">
				Couldn&apos;t load the affected templates, but the delete will still be
				applied correctly.
			</p>
		);
	}

	if (total === 0) return null;

	const hidden = total - templates.length;

	return (
		<ul className="mb-4 max-h-32 overflow-y-auto rounded-lg border border-slate-200 dark:border-zinc-800 divide-y divide-slate-100 dark:divide-zinc-800">
			{templates.map((t) => (
				<li
					key={t.id}
					className="px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 truncate"
				>
					{t.name}
				</li>
			))}
			{hidden > 0 && (
				<li className="px-3 py-2 text-xs text-zinc-400">
					+{hidden} more
				</li>
			)}
		</ul>
	);
}
