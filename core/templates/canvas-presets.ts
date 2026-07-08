/**
 * Pure layout-preset generators for the canvas editor: drop in N evenly-spaced
 * photo slots sized to the current template. Lets non-technical operators start
 * from a standard strip/grid instead of hand-placing rectangles.
 *
 * Output is image (layout) space `PhotoAreaFormData[]`, ready to become
 * `form.photo_areas`. Slots are 1-indexed, within bounds, evenly gapped.
 */

import { newDraftId, type PhotoAreaFormData } from "./layout-clipboard";

export type PresetKind = "2-up" | "3-up" | "4-up" | "2x2";

export const PRESETS: { kind: PresetKind; label: string }[] = [
	{ kind: "2-up", label: "2-up" },
	{ kind: "3-up", label: "3-up" },
	{ kind: "4-up", label: "4-up" },
	{ kind: "2x2", label: "2×2" },
];

/**
 * Build a rows×cols grid of slots with a uniform outer margin and inter-slot
 * gap (both ~5% of the shorter side). Row-major photo_index (1..rows*cols).
 */
function grid(
	rows: number,
	cols: number,
	canvasW: number,
	canvasH: number,
): PhotoAreaFormData[] {
	const margin = Math.round(Math.min(canvasW, canvasH) * 0.05);
	const gap = margin;
	const slotW = Math.floor((canvasW - 2 * margin - (cols - 1) * gap) / cols);
	const slotH = Math.floor((canvasH - 2 * margin - (rows - 1) * gap) / rows);
	if (slotW <= 0 || slotH <= 0) return [];

	const out: PhotoAreaFormData[] = [];
	let idx = 1;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			out.push({
				photo_index: idx++,
				x: margin + c * (slotW + gap),
				y: margin + r * (slotH + gap),
				width: slotW,
				height: slotH,
				rotation: 0,
				border_radius: 0,
				shape_type: "rectangle",
				_draftId: newDraftId(),
			});
		}
	}
	return out;
}

export function generatePreset(
	kind: PresetKind,
	canvasW: number,
	canvasH: number,
): PhotoAreaFormData[] {
	if (canvasW <= 0 || canvasH <= 0) return [];
	switch (kind) {
		case "2-up":
			return grid(2, 1, canvasW, canvasH);
		case "3-up":
			return grid(3, 1, canvasW, canvasH);
		case "4-up":
			return grid(4, 1, canvasW, canvasH);
		case "2x2":
			return grid(2, 2, canvasW, canvasH);
	}
}
