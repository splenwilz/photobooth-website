/**
 * Pure smart-alignment (snap-to-guides) math for the layout canvas editor.
 *
 * Canva/Figma-style: while an area is moved or resized, its edges and center
 * are compared against every other area's edges/centers and the canvas
 * edges/center. When a moving reference point lands within `threshold` of a
 * guide it snaps to it, and the guide line is surfaced for rendering.
 *
 * All math is in image (layout) space — the same space the stored
 * `area.x/y/width/height` use — so results are written straight back into form
 * state. The caller supplies `threshold` already converted from display px to
 * image px (i.e. `displayPx / effectiveScale`), which makes snapping tighter as
 * the operator zooms in. Pure and dependency-free so it's unit-testable.
 */

export interface SnapRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export type Corner = "nw" | "ne" | "sw" | "se";

export type GuideAxis = "x" | "y";

/** A guide line to render, in image space. `x` = vertical line, `y` = horizontal. */
export interface SnapGuideLine {
	axis: GuideAxis;
	pos: number;
}

function clampNum(n: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, n));
}

/** Candidate vertical guide positions (x coords): canvas + every other area. */
function guidesX(others: SnapRect[], canvasW: number): number[] {
	const g = [0, canvasW / 2, canvasW];
	for (const o of others) g.push(o.x, o.x + o.width / 2, o.x + o.width);
	return g;
}

/** Candidate horizontal guide positions (y coords): canvas + every other area. */
function guidesY(others: SnapRect[], canvasH: number): number[] {
	const g = [0, canvasH / 2, canvasH];
	for (const o of others) g.push(o.y, o.y + o.height / 2, o.y + o.height);
	return g;
}

/** Closest (guide - ref) delta within threshold, or null. Ties → smallest |delta|. */
function bestSnap(
	refs: number[],
	guides: number[],
	threshold: number,
): { delta: number; pos: number } | null {
	let best: { delta: number; pos: number } | null = null;
	for (const r of refs) {
		for (const g of guides) {
			const d = g - r;
			if (Math.abs(d) <= threshold && (!best || Math.abs(d) < Math.abs(best.delta))) {
				best = { delta: d, pos: g };
			}
		}
	}
	return best;
}

/** Does a vertical guide at `pos` still line up with a ref of the given rect? */
function holdsX(x: number, width: number, pos: number): boolean {
	return [x, x + width / 2, x + width].some((r) => Math.abs(r - pos) < 0.5);
}

function holdsY(y: number, height: number, pos: number): boolean {
	return [y, y + height / 2, y + height].some((r) => Math.abs(r - pos) < 0.5);
}

export interface MoveSnapResult {
	x: number;
	y: number;
	guides: SnapGuideLine[];
}

/**
 * Snap a moved rectangle. Considers left/centerX/right against vertical guides
 * and top/centerY/bottom against horizontal guides, picking the closest per
 * axis. Result is re-clamped to the canvas; a guide is only returned if it
 * still holds after clamping.
 */
export function computeMoveSnap(
	moving: SnapRect,
	others: SnapRect[],
	canvasW: number,
	canvasH: number,
	threshold: number,
): MoveSnapResult {
	const gx = guidesX(others, canvasW);
	const gy = guidesY(others, canvasH);

	const sx = bestSnap(
		[moving.x, moving.x + moving.width / 2, moving.x + moving.width],
		gx,
		threshold,
	);
	const sy = bestSnap(
		[moving.y, moving.y + moving.height / 2, moving.y + moving.height],
		gy,
		threshold,
	);

	const x = clampNum(
		sx ? moving.x + sx.delta : moving.x,
		0,
		Math.max(0, canvasW - moving.width),
	);
	const y = clampNum(
		sy ? moving.y + sy.delta : moving.y,
		0,
		Math.max(0, canvasH - moving.height),
	);

	const guides: SnapGuideLine[] = [];
	if (sx && holdsX(x, moving.width, sx.pos)) guides.push({ axis: "x", pos: sx.pos });
	if (sy && holdsY(y, moving.height, sy.pos)) guides.push({ axis: "y", pos: sy.pos });
	return { x, y, guides };
}

export interface ResizeSnapResult extends SnapRect {
	guides: SnapGuideLine[];
}

/**
 * Snap a resized rectangle by aligning only the edge(s) the dragged corner
 * moves: 'e'/'w' → the right/left edge to a vertical guide, 's'/'n' → the
 * bottom/top edge to a horizontal guide. Keeps width/height ≥ minDim and within
 * the canvas; only returns a guide when the snapped edge actually holds.
 */
export function computeResizeSnap(
	moving: SnapRect,
	corner: Corner,
	others: SnapRect[],
	canvasW: number,
	canvasH: number,
	threshold: number,
	minDim: number,
): ResizeSnapResult {
	let { x, y, width, height } = moving;
	const guides: SnapGuideLine[] = [];
	const gx = guidesX(others, canvasW);
	const gy = guidesY(others, canvasH);

	const movesRight = corner === "ne" || corner === "se";
	const movesLeft = corner === "nw" || corner === "sw";
	const movesBottom = corner === "sw" || corner === "se";
	const movesTop = corner === "nw" || corner === "ne";

	if (movesRight) {
		const right = x + width;
		const s = bestSnap([right], gx, threshold);
		if (s) {
			const newWidth = clampNum(right + s.delta - x, minDim, canvasW - x);
			if (Math.abs(x + newWidth - s.pos) < 0.5) {
				width = newWidth;
				guides.push({ axis: "x", pos: s.pos });
			}
		}
	} else if (movesLeft) {
		const s = bestSnap([x], gx, threshold);
		if (s) {
			const right = x + width;
			const newX = clampNum(x + s.delta, 0, right - minDim);
			if (Math.abs(newX - s.pos) < 0.5) {
				x = newX;
				width = right - newX;
				guides.push({ axis: "x", pos: s.pos });
			}
		}
	}

	if (movesBottom) {
		const bottom = y + height;
		const s = bestSnap([bottom], gy, threshold);
		if (s) {
			const newHeight = clampNum(bottom + s.delta - y, minDim, canvasH - y);
			if (Math.abs(y + newHeight - s.pos) < 0.5) {
				height = newHeight;
				guides.push({ axis: "y", pos: s.pos });
			}
		}
	} else if (movesTop) {
		const s = bestSnap([y], gy, threshold);
		if (s) {
			const bottom = y + height;
			const newY = clampNum(y + s.delta, 0, bottom - minDim);
			if (Math.abs(newY - s.pos) < 0.5) {
				y = newY;
				height = bottom - newY;
				guides.push({ axis: "y", pos: s.pos });
			}
		}
	}

	return { x, y, width, height, guides };
}
