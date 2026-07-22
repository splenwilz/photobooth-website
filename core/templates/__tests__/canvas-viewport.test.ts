import { describe, expect, it } from "vitest";
import {
	clampPan,
	computeBaseScale,
	wheelDeltaToZoomFactor,
	zoomToPoint,
} from "../canvas-viewport";

describe("computeBaseScale", () => {
	it("fits by the more constrained axis (letterbox)", () => {
		// A tall Strips layout (600x1800) in a 500x400 viewport is height-bound.
		expect(computeBaseScale(500, 400, 600, 1800)).toBeCloseTo(400 / 1800);
		// A 4x6 layout (1200x1800) in a short-wide 500x1600 viewport is width-bound.
		expect(computeBaseScale(500, 1600, 1200, 1800)).toBeCloseTo(500 / 1200);
	});

	it("returns 0 for unmeasured viewport or degenerate layout", () => {
		expect(computeBaseScale(0, 400, 600, 1800)).toBe(0);
		expect(computeBaseScale(500, 0, 600, 1800)).toBe(0);
		expect(computeBaseScale(500, 400, 0, 1800)).toBe(0);
		expect(computeBaseScale(500, 400, 600, 0)).toBe(0);
	});
});

describe("clampPan", () => {
	it("centers the stage when it is smaller than the viewport", () => {
		expect(clampPan(999, 200, 500)).toBe(150); // (500-200)/2, ignores requested value
		expect(clampPan(-999, 200, 500)).toBe(150);
	});

	it("clamps within bounds when the stage is larger than the viewport", () => {
		// stage 800, viewport 500 → pan in [-300, 0]
		expect(clampPan(0, 800, 500)).toBe(0);
		expect(clampPan(-100, 800, 500)).toBe(-100);
		expect(clampPan(50, 800, 500)).toBe(0); // can't pull left edge inside
		expect(clampPan(-999, 800, 500)).toBe(-300); // can't pull right edge inside
	});
});

describe("wheelDeltaToZoomFactor", () => {
	it("zooms in on negative delta (pinch out) and out on positive delta", () => {
		expect(wheelDeltaToZoomFactor(-10)).toBeGreaterThan(1);
		expect(wheelDeltaToZoomFactor(10)).toBeLessThan(1);
		expect(wheelDeltaToZoomFactor(0)).toBe(1);
	});

	it("clamps large mouse-wheel jumps so a single event is a bounded step", () => {
		// A huge wheel delta (mouse wheel + Ctrl) is clamped to the same factor
		// as maxDelta — it can't produce a runaway zoom jump.
		expect(wheelDeltaToZoomFactor(1000)).toBe(wheelDeltaToZoomFactor(10));
		expect(wheelDeltaToZoomFactor(-1000)).toBe(wheelDeltaToZoomFactor(-10));
	});
});

describe("zoomToPoint", () => {
	const base = {
		panX: 0,
		panY: 0,
		minZoom: 1,
		maxZoom: 8,
		baseScale: 1,
		imageW: 200,
		imageH: 200,
		viewportW: 200,
		viewportH: 200,
	};

	it("keeps the layout point under the cursor fixed while zooming in", () => {
		// At zoom 1 the 200x200 stage exactly fills the 200x200 viewport (pan 0).
		// Zoom 2x toward the cursor at (50,50): that screen point must map to the
		// same content after zoom → new pan = 50 - (50 - 0)*2 = -50.
		const next = zoomToPoint({
			...base,
			zoom: 1,
			factor: 2,
			pointerX: 50,
			pointerY: 50,
		});
		expect(next.zoom).toBe(2);
		expect(next.panX).toBe(-50);
		expect(next.panY).toBe(-50);
	});

	it("respects min/max zoom clamps", () => {
		const maxed = zoomToPoint({
			...base,
			zoom: 8,
			factor: 2,
			pointerX: 100,
			pointerY: 100,
		});
		expect(maxed.zoom).toBe(8); // can't exceed maxZoom

		const minned = zoomToPoint({
			...base,
			zoom: 1,
			factor: 0.5,
			pointerX: 100,
			pointerY: 100,
		});
		expect(minned.zoom).toBe(1); // can't go below fit (minZoom)
	});

	it("re-centers (via clamp) when zoomed back to fit", () => {
		// Zooming out to fit makes the stage == viewport, so pan clamps to center 0.
		const next = zoomToPoint({
			...base,
			zoom: 2,
			panX: -50,
			panY: -50,
			factor: 0.5,
			pointerX: 50,
			pointerY: 50,
		});
		expect(next.zoom).toBe(1);
		expect(next.panX).toBe(0);
		expect(next.panY).toBe(0);
	});
});
