import { describe, expect, it } from "vitest";
import { generatePreset } from "../canvas-presets";

const stripW = 600;
const stripH = 1800;

describe("generatePreset", () => {
	it("creates N stacked, in-bounds, 1-indexed slots for an N-up strip", () => {
		const slots = generatePreset("3-up", stripW, stripH);
		expect(slots).toHaveLength(3);
		expect(slots.map((s) => s.photo_index)).toEqual([1, 2, 3]);
		for (const s of slots) {
			expect(s.x).toBeGreaterThanOrEqual(0);
			expect(s.y).toBeGreaterThanOrEqual(0);
			expect(s.x + s.width).toBeLessThanOrEqual(stripW);
			expect(s.y + s.height).toBeLessThanOrEqual(stripH);
			expect(s.width).toBeGreaterThan(0);
			expect(s.height).toBeGreaterThan(0);
			expect(s._draftId).toBeTruthy();
			expect(s.shape_type).toBe("rectangle");
		}
	});

	it("stacks vertical slots with equal gaps", () => {
		const slots = generatePreset("3-up", stripW, stripH);
		const gap1 = slots[1].y - (slots[0].y + slots[0].height);
		const gap2 = slots[2].y - (slots[1].y + slots[1].height);
		expect(Math.abs(gap1 - gap2)).toBeLessThanOrEqual(1);
	});

	it("2x2 produces a 4-slot grid", () => {
		const slots = generatePreset("2x2", 1200, 1800);
		expect(slots).toHaveLength(4);
		// two distinct columns and two distinct rows
		expect(new Set(slots.map((s) => s.x)).size).toBe(2);
		expect(new Set(slots.map((s) => s.y)).size).toBe(2);
	});

	it("gives every slot a unique _draftId", () => {
		const slots = generatePreset("4-up", stripW, stripH);
		expect(new Set(slots.map((s) => s._draftId)).size).toBe(4);
	});

	it("returns nothing for a degenerate canvas", () => {
		expect(generatePreset("2-up", 0, 100)).toEqual([]);
	});
});
