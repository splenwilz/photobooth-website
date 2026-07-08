import { describe, expect, it } from "vitest";
import { alignAreas, distributeAreas } from "../canvas-align";
import type { PhotoAreaFormData } from "../layout-clipboard";

function area(
	id: string,
	x: number,
	y: number,
	width: number,
	height: number,
): PhotoAreaFormData {
	return {
		_draftId: id,
		photo_index: 1,
		x,
		y,
		width,
		height,
		rotation: 0,
		border_radius: 0,
		shape_type: "rectangle",
	};
}

const canvasW = 1000;
const canvasH = 1000;

describe("alignAreas", () => {
	const a = area("a", 100, 100, 200, 100);
	const b = area("b", 400, 300, 100, 100);

	it("aligns left edges to the selection's min-left", () => {
		const out = alignAreas([a, b], new Set(["a", "b"]), "left", canvasW, canvasH);
		expect(out[0].x).toBe(100);
		expect(out[1].x).toBe(100);
		// y untouched
		expect(out[0].y).toBe(100);
		expect(out[1].y).toBe(300);
	});

	it("aligns horizontal centers to the selection center", () => {
		// bbox: minX 100, maxRight 500 → centerX 300. a.width 200 → x 200; b.width 100 → x 250.
		const out = alignAreas([a, b], new Set(["a", "b"]), "centerX", canvasW, canvasH);
		expect(out[0].x).toBe(200);
		expect(out[1].x).toBe(250);
	});

	it("aligns bottom edges to the selection's max-bottom", () => {
		// maxBottom = max(200, 400) = 400 → a.y = 400-100=300; b.y = 400-100=300.
		const out = alignAreas([a, b], new Set(["a", "b"]), "bottom", canvasW, canvasH);
		expect(out[0].y).toBe(300);
		expect(out[1].y).toBe(300);
	});

	it("leaves non-selected areas untouched and needs ≥2", () => {
		const untouched = alignAreas([a, b], new Set(["a"]), "left", canvasW, canvasH);
		expect(untouched).toEqual([a, b]);
	});
});

describe("distributeAreas", () => {
	it("equalizes horizontal gaps, holding the extremes", () => {
		// Three 100-wide boxes; first at x0, last at x400 (right=500). span=500,
		// total=300, gap=(500-300)/2=100. Middle should start at 0+100+100=200.
		const a = area("a", 0, 0, 100, 50);
		const mid = area("m", 130, 0, 100, 50);
		const c = area("c", 400, 0, 100, 50);
		const out = distributeAreas(
			[a, mid, c],
			new Set(["a", "m", "c"]),
			"horizontal",
			canvasW,
			canvasH,
		);
		const byId = Object.fromEntries(out.map((o) => [o._draftId, o]));
		expect(byId.a.x).toBe(0); // extreme held
		expect(byId.c.x).toBe(400); // extreme held
		expect(byId.m.x).toBe(200); // evenly spaced
	});

	it("requires ≥3 selected", () => {
		const a = area("a", 0, 0, 100, 50);
		const b = area("b", 400, 0, 100, 50);
		const out = distributeAreas([a, b], new Set(["a", "b"]), "horizontal", canvasW, canvasH);
		expect(out).toEqual([a, b]);
	});
});
