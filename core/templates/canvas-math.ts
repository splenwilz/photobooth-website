/**
 * Shared numeric helpers for the canvas template modules (viewport, snap,
 * align). Kept in one place so the tiny clamp implementation can't drift.
 */

/** Constrain `n` to the inclusive range [min, max]. */
export function clampNum(n: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, n));
}
