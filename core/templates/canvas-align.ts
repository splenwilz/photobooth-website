/**
 * Pure align & distribute operations for the layout canvas editor.
 *
 * All math is in image (layout) space and returns a new `photo_areas` array, so
 * results are written straight back into form state via `onAreasChange`. Areas
 * are identified by `_draftId` (always present in create mode). Pure and
 * dependency-free so the geometry is unit-testable.
 */

import { clampNum } from "./canvas-math";
import type { PhotoAreaFormData } from "./layout-clipboard";

export type AlignOp =
	| "left"
	| "centerX"
	| "right"
	| "top"
	| "centerY"
	| "bottom";

export type DistributeAxis = "horizontal" | "vertical";

function selected(
	areas: PhotoAreaFormData[],
	ids: ReadonlySet<string>,
): PhotoAreaFormData[] {
	return areas.filter((a) => a._draftId != null && ids.has(a._draftId));
}

/**
 * Align every selected area to the selection's bounding box on one axis.
 * Needs ≥2 selected; otherwise returns the input unchanged. Only the relevant
 * axis moves (e.g. "left" changes x, leaves y). Results are clamped to canvas.
 */
export function alignAreas(
	areas: PhotoAreaFormData[],
	ids: ReadonlySet<string>,
	op: AlignOp,
	canvasW: number,
	canvasH: number,
): PhotoAreaFormData[] {
	const sel = selected(areas, ids);
	if (sel.length < 2) return areas;

	const minX = Math.min(...sel.map((a) => a.x));
	const maxRight = Math.max(...sel.map((a) => a.x + a.width));
	const minY = Math.min(...sel.map((a) => a.y));
	const maxBottom = Math.max(...sel.map((a) => a.y + a.height));
	const centerX = (minX + maxRight) / 2;
	const centerY = (minY + maxBottom) / 2;

	return areas.map((a) => {
		if (a._draftId == null || !ids.has(a._draftId)) return a;
		let { x, y } = a;
		switch (op) {
			case "left":
				x = minX;
				break;
			case "right":
				x = maxRight - a.width;
				break;
			case "centerX":
				x = centerX - a.width / 2;
				break;
			case "top":
				y = minY;
				break;
			case "bottom":
				y = maxBottom - a.height;
				break;
			case "centerY":
				y = centerY - a.height / 2;
				break;
		}
		return {
			...a,
			x: Math.round(clampNum(x, 0, Math.max(0, canvasW - a.width))),
			y: Math.round(clampNum(y, 0, Math.max(0, canvasH - a.height))),
		};
	});
}

/**
 * Distribute selected areas so the gaps between their boxes are equal along the
 * axis (Figma "distribute spacing"). Holds the two extreme areas in place and
 * spaces the rest between them. Needs ≥3 selected; otherwise returns unchanged.
 */
export function distributeAreas(
	areas: PhotoAreaFormData[],
	ids: ReadonlySet<string>,
	axis: DistributeAxis,
	canvasW: number,
	canvasH: number,
): PhotoAreaFormData[] {
	const sel = selected(areas, ids);
	if (sel.length < 3) return areas;

	const horizontal = axis === "horizontal";
	const start = (a: PhotoAreaFormData) => (horizontal ? a.x : a.y);
	const size = (a: PhotoAreaFormData) => (horizontal ? a.width : a.height);

	const sorted = [...sel].sort((a, b) => start(a) - start(b));
	const first = sorted[0];
	const last = sorted[sorted.length - 1];
	const startEdge = start(first);
	const endEdge = start(last) + size(last);
	const span = endEdge - startEdge;
	const totalSize = sorted.reduce((s, a) => s + size(a), 0);
	const gap = (span - totalSize) / (sorted.length - 1);

	const nextStart = new Map<string, number>();
	let cursor = startEdge;
	for (const a of sorted) {
		if (a._draftId != null) nextStart.set(a._draftId, cursor);
		cursor += size(a) + gap;
	}

	return areas.map((a) => {
		if (a._draftId == null || !nextStart.has(a._draftId)) return a;
		const pos = Math.round(nextStart.get(a._draftId) as number);
		if (horizontal) {
			return { ...a, x: clampNum(pos, 0, Math.max(0, canvasW - a.width)) };
		}
		return { ...a, y: clampNum(pos, 0, Math.max(0, canvasH - a.height)) };
	});
}
