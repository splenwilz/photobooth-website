import { describe, expect, it } from "vitest";
import {
	computeMoveSnap,
	computeResizeSnap,
	type SnapRect,
} from "../canvas-snap";

const canvasW = 1000;
const canvasH = 1000;

describe("computeMoveSnap", () => {
	it("snaps a left edge to another area's left edge within threshold", () => {
		const other: SnapRect = { x: 100, y: 500, width: 200, height: 100 };
		// Moving area's left is at 103 — 3px from other's left (100), within 5.
		const res = computeMoveSnap(
			{ x: 103, y: 50, width: 200, height: 100 },
			[other],
			canvasW,
			canvasH,
			5,
		);
		expect(res.x).toBe(100);
		expect(res.guides).toContainEqual({ axis: "x", pos: 100 });
	});

	it("snaps center to the canvas center", () => {
		// Center x should land on canvasW/2 = 500 → x = 500 - width/2 = 400.
		const res = computeMoveSnap(
			{ x: 397, y: 200, width: 200, height: 100 },
			[],
			canvasW,
			canvasH,
			5,
		);
		expect(res.x).toBe(400);
		expect(res.guides).toContainEqual({ axis: "x", pos: 500 });
	});

	it("does not snap when nothing is within threshold", () => {
		const other: SnapRect = { x: 100, y: 500, width: 200, height: 100 };
		// Deliberately off every guide: left/center/right = 412/512/612 and
		// top/center/bottom = 53/103/153 are all >5px from canvas + other guides.
		const res = computeMoveSnap(
			{ x: 412, y: 53, width: 200, height: 100 },
			[other],
			canvasW,
			canvasH,
			5,
		);
		expect(res.x).toBe(412);
		expect(res.y).toBe(53);
		expect(res.guides).toHaveLength(0);
	});

	it("snaps both axes independently", () => {
		const other: SnapRect = { x: 300, y: 300, width: 100, height: 100 };
		// left 302→300, top 303→300
		const res = computeMoveSnap(
			{ x: 302, y: 303, width: 100, height: 100 },
			[other],
			canvasW,
			canvasH,
			5,
		);
		expect(res.x).toBe(300);
		expect(res.y).toBe(300);
		expect(res.guides).toHaveLength(2);
	});

	it("tighter threshold (zoomed in) rejects a snap that a looser one accepts", () => {
		const other: SnapRect = { x: 100, y: 0, width: 100, height: 100 };
		const moving = { x: 104, y: 500, width: 100, height: 100 }; // 4px off
		expect(computeMoveSnap(moving, [other], canvasW, canvasH, 5).x).toBe(100);
		// At threshold 2 (zoomed in), 4px is out of range → no snap.
		expect(computeMoveSnap(moving, [other], canvasW, canvasH, 2).x).toBe(104);
	});
});

describe("computeResizeSnap", () => {
	it("snaps the right edge (se corner) to another area's right edge", () => {
		const other: SnapRect = { x: 0, y: 0, width: 300, height: 100 }; // right = 300
		// Moving rect right = 100+197 = 297, 3px from 300.
		const res = computeResizeSnap(
			{ x: 100, y: 400, width: 197, height: 100 },
			"se",
			[other],
			canvasW,
			canvasH,
			5,
			20,
		);
		expect(res.x).toBe(100); // left unchanged for an 'se' drag
		expect(res.width).toBe(200); // right snapped to 300 → width 200
		expect(res.guides).toContainEqual({ axis: "x", pos: 300 });
	});

	it("snaps the left edge (nw corner) and grows width accordingly", () => {
		const other: SnapRect = { x: 100, y: 0, width: 50, height: 50 }; // left = 100
		// Moving rect left = 97 (3px from 100), right stays at 300.
		const res = computeResizeSnap(
			{ x: 97, y: 400, width: 203, height: 100 },
			"nw",
			[other],
			canvasW,
			canvasH,
			5,
			20,
		);
		expect(res.x).toBe(100);
		expect(res.width).toBe(200); // right (300) - new left (100)
		expect(res.guides).toContainEqual({ axis: "x", pos: 100 });
	});

	it("does not snap the non-moving edges", () => {
		// 'se' moves right/bottom; a guide aligned with the LEFT edge must be ignored.
		const other: SnapRect = { x: 100, y: 0, width: 10, height: 10 }; // left = 100
		const res = computeResizeSnap(
			{ x: 102, y: 400, width: 300, height: 100 },
			"se",
			[other],
			canvasW,
			canvasH,
			5,
			20,
		);
		expect(res.x).toBe(102); // left untouched
	});
});
