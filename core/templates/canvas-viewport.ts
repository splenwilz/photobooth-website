/**
 * Pure geometry helpers for the layout canvas viewport (zoom + pan).
 *
 * These are display-only transforms: they never touch the stored photo-area
 * coordinates (which live in image/layout space). Keeping them pure makes the
 * zoom-to-cursor and clamping math unit-testable in isolation.
 *
 * Coordinate spaces:
 *  - viewport: the fixed-size on-screen window (px), origin at its top-left.
 *  - stage:    the layout rendered at `imageW*effectiveScale × imageH*effectiveScale` px,
 *              positioned inside the viewport by a `pan` translate (its top-left).
 *  - effectiveScale = baseScale * zoom, where baseScale fits the layout to the viewport.
 */

import { clampNum } from "./canvas-math";

/**
 * Fit-to-viewport scale: the largest scale at which the whole layout fits
 * inside the viewport (letterboxed on the longer axis). 0 when any input is
 * non-positive (viewport not measured yet / degenerate layout).
 */
export function computeBaseScale(
	viewportW: number,
	viewportH: number,
	imageW: number,
	imageH: number,
): number {
	if (viewportW <= 0 || viewportH <= 0 || imageW <= 0 || imageH <= 0) return 0;
	return Math.min(viewportW / imageW, viewportH / imageH);
}

/**
 * Constrain one axis of the pan (stage top-left, in viewport px):
 *  - stage smaller than the viewport → center it (ignores the requested value).
 *  - stage larger → clamp so its edges can't be dragged inside the viewport.
 * This is what makes "Fit" auto-center and prevents losing the layout off-screen.
 */
export function clampPan(
	value: number,
	stageSize: number,
	viewportSize: number,
): number {
	if (stageSize <= viewportSize) return (viewportSize - stageSize) / 2;
	// stageSize > viewportSize: value in [viewportSize - stageSize, 0]
	return clampNum(value, viewportSize - stageSize, 0);
}

/**
 * Convert a wheel `deltaY` into a multiplicative zoom factor. Clamps the delta
 * first so a mouse wheel + Ctrl (big discrete ~100 jumps) and a trackpad pinch
 * (tiny ~1 deltas) both produce a smooth, bounded step per event.
 */
export function wheelDeltaToZoomFactor(deltaY: number, maxDelta = 10): number {
	const clamped = clampNum(deltaY, -maxDelta, maxDelta);
	return 2 ** (-clamped * 0.01);
}

export interface ViewportState {
	zoom: number;
	panX: number;
	panY: number;
}

export interface ZoomToPointInput extends ViewportState {
	/** Multiplicative zoom change (e.g. from wheelDeltaToZoomFactor, or 1.25 for a button). */
	factor: number;
	/** Pointer position relative to the viewport top-left (px). Use viewport center for buttons. */
	pointerX: number;
	pointerY: number;
	minZoom: number;
	maxZoom: number;
	baseScale: number;
	imageW: number;
	imageH: number;
	viewportW: number;
	viewportH: number;
}

/**
 * Zoom toward a point, keeping the layout coordinate under that point fixed on
 * screen (the "zoom-to-cursor" behavior). Returns the next clamped viewport
 * state. Pure — safe to unit test and to call from both wheel and buttons.
 */
export function zoomToPoint(input: ZoomToPointInput): ViewportState {
	const {
		zoom,
		panX,
		panY,
		factor,
		pointerX,
		pointerY,
		minZoom,
		maxZoom,
		baseScale,
		imageW,
		imageH,
		viewportW,
		viewportH,
	} = input;

	const stageW = imageW * baseScale * zoom;
	const stageH = imageH * baseScale * zoom;
	const curX = clampPan(panX, stageW, viewportW);
	const curY = clampPan(panY, stageH, viewportH);

	const newZoom = clampNum(zoom * factor, minZoom, maxZoom);
	if (newZoom === zoom || baseScale <= 0) {
		return { zoom, panX: curX, panY: curY };
	}

	const ratio = newZoom / zoom;
	const rawX = pointerX - (pointerX - curX) * ratio;
	const rawY = pointerY - (pointerY - curY) * ratio;
	const newStageW = imageW * baseScale * newZoom;
	const newStageH = imageH * baseScale * newZoom;
	return {
		zoom: newZoom,
		panX: clampPan(rawX, newStageW, viewportW),
		panY: clampPan(rawY, newStageH, viewportH),
	};
}
