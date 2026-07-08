"use client";

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type KeyboardEvent as ReactKeyboardEvent,
	type PointerEvent as ReactPointerEvent,
} from "react";
import type { PhotoAreaFormData } from "@/core/templates/layout-clipboard";
import {
	clampPan,
	computeBaseScale,
	wheelDeltaToZoomFactor,
	zoomToPoint,
} from "@/core/templates/canvas-viewport";
import {
	computeMoveSnap,
	computeResizeSnap,
	type SnapGuideLine,
} from "@/core/templates/canvas-snap";
import {
	type AlignOp,
	alignAreas,
	type DistributeAxis,
	distributeAreas,
} from "@/core/templates/canvas-align";
import {
	AlignCenterHorizontal,
	AlignCenterVertical,
	AlignEndHorizontal,
	AlignEndVertical,
	AlignHorizontalDistributeCenter,
	AlignStartHorizontal,
	AlignStartVertical,
	AlignVerticalDistributeCenter,
} from "lucide-react";

interface LayoutCanvasEditorProps {
	/** Object URL or remote URL for the template image. Null = no backdrop. */
	imageSrc: string | null;
	/** Layout coordinate space (matches form.width / form.height). */
	imageWidth: number;
	imageHeight: number;
	photoAreas: PhotoAreaFormData[];
	onAreasChange: (next: PhotoAreaFormData[]) => void;
	/** Called when the user presses Cmd/Ctrl+D on a focused rectangle. */
	onDuplicate?: (idx: number) => void;
	/**
	 * If set, the rectangle whose `_draftId` matches receives focus on the
	 * next render. Used after duplicate so the operator can immediately
	 * drag/nudge the new rectangle. Parent should clear it via
	 * `onFocusApplied` once we've taken focus.
	 */
	pendingFocusDraftId?: string | null;
	onFocusApplied?: () => void;
	/**
	 * When the parent modal is in full-screen mode, let the canvas grow to fill
	 * the available height instead of the compact modal size.
	 */
	fullscreen?: boolean;
}

type Corner = "nw" | "ne" | "sw" | "se";

/** Start snapshot of one area being moved (image space). */
type MoveStart = { id: string; x: number; y: number; width: number; height: number };

/** Rubber-band selection rectangle, corners in image space. */
type MarqueeState = {
	startClientX: number;
	startClientY: number;
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	additive: boolean;
};

type DragState =
	| {
			type: "move";
			// Move is group-aware: `start` snapshots every selected area, `primaryId`
			// is the grabbed one (used for snapping). Single-select is just length 1.
			primaryId: string;
			startClientX: number;
			startClientY: number;
			start: MoveStart[];
	  }
	| {
			type: "resize";
			idx: number;
			corner: Corner;
			startClientX: number;
			startClientY: number;
			startArea: PhotoAreaFormData;
	  }
	| {
			type: "radius";
			idx: number;
			startClientX: number;
			startArea: PhotoAreaFormData;
	  };

// A drag of the empty canvas to pan the (zoomed) view. Distinct from area drags.
type PanDragState = {
	startClientX: number;
	startClientY: number;
	startPanX: number;
	startPanY: number;
};

const MIN_DIM = 20;
// Grid step (image-space px) for Shift-snap. 10 is a forgiving size that
// lines up the typical photo-strip slots within a pixel or two.
const SNAP_STEP = 10;
// Keyboard nudge step (Shift+arrow uses this; plain arrow uses 1).
const KEY_NUDGE_BIG = 10;
// Zoom bounds are relative to fit: 1 = whole layout visible (the natural floor),
// 8 = 8x magnification for pixel-precise edge checking.
const ZOOM_MIN = 1;
const ZOOM_MAX = 8;
const ZOOM_BTN_STEP = 1.25;
// Smart-snap tolerance in *display* px. Converted to image px per drag via
// `/effectiveScale`, so snapping gets tighter (more precise) as you zoom in.
const SNAP_DISPLAY_PX = 6;

const ALIGN_CONTROLS: {
	op: AlignOp;
	label: string;
	Icon: typeof AlignStartVertical;
}[] = [
	{ op: "left", label: "Align left edges", Icon: AlignStartVertical },
	{ op: "centerX", label: "Align horizontal centers", Icon: AlignCenterVertical },
	{ op: "right", label: "Align right edges", Icon: AlignEndVertical },
	{ op: "top", label: "Align top edges", Icon: AlignStartHorizontal },
	{ op: "centerY", label: "Align vertical centers", Icon: AlignCenterHorizontal },
	{ op: "bottom", label: "Align bottom edges", Icon: AlignEndHorizontal },
];

const DISTRIBUTE_CONTROLS: {
	axis: DistributeAxis;
	label: string;
	Icon: typeof AlignStartVertical;
}[] = [
	{
		axis: "horizontal",
		label: "Distribute horizontally (equal gaps)",
		Icon: AlignHorizontalDistributeCenter,
	},
	{
		axis: "vertical",
		label: "Distribute vertically (equal gaps)",
		Icon: AlignVerticalDistributeCenter,
	},
];

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

function snapTo(n: number, step: number) {
	return Math.round(n / step) * step;
}

// useLayoutEffect logs a warning during SSR. The canvas is client-only (it lives
// behind a closed modal, so it isn't in the server render), but guard anyway so
// it can never warn on the server.
const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Visual canvas for placing and resizing photo areas on top of a template
 * image. All *stored* coordinate math runs in the layout's pixel space (image
 * space) — the same space `form.width/height` and each area's `x/y/width/height`
 * use — so values written back via `onAreasChange` stay directly usable by the
 * rest of the form and the backend.
 *
 * Zoom + pan are a purely display-layer concern: a fixed-size viewport holds a
 * `stage` sized `imageW·effectiveScale × imageH·effectiveScale` and translated by
 * `pan`. `effectiveScale = baseScale·zoom`, where `baseScale` fits the layout to
 * the viewport (ResizeObserver). The stage is *sized*, never CSS-`transform:
 * scale()`-d, so borders/handles/labels stay a constant on-screen size at any
 * zoom (Figma/Canva behavior). Zoom/pan never mutate stored coordinates.
 *
 * The wheel listener is attached natively with `{ passive:false }` because
 * React's synthetic `onWheel` is passive and can't `preventDefault()` the
 * browser's page-zoom (facebook/react#22794).
 */
export function LayoutCanvasEditor({
	imageSrc,
	imageWidth,
	imageHeight,
	photoAreas,
	onAreasChange,
	onDuplicate,
	pendingFocusDraftId,
	onFocusApplied,
	fullscreen = false,
}: LayoutCanvasEditorProps) {
	const viewportRef = useRef<HTMLDivElement>(null);
	const [viewport, setViewport] = useState({ w: 0, h: 0 });
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [drag, setDrag] = useState<DragState | null>(null);
	const [panDrag, setPanDrag] = useState<PanDragState | null>(null);
	// Tracks the layout dimensions the view was last framed for, so we can
	// re-fit when they change (new product category / freshly detected image).
	const [framedDims, setFramedDims] = useState(`${imageWidth}x${imageHeight}`);
	// Off by default: a translucent fill recolors the template slot underneath,
	// which makes it hard to see whether the rectangle's edges sit exactly on
	// the template's photo-slot edges. With fill off the operator sees the
	// template through the rectangle and aligns edge-to-edge. Toggle brings the
	// solid area view back for those who prefer it.
	const [showFill, setShowFill] = useState(false);
	// Smart alignment guides (Figma/Canva-style). On by default; Alt bypasses
	// per-drag, Shift falls back to the fixed 10px grid. `guides` holds the lines
	// to draw for the in-progress drag and is cleared on pointer-up.
	const [smartSnap, setSmartSnap] = useState(true);
	const [guides, setGuides] = useState<SnapGuideLine[]>([]);
	// Multi-select for align/distribute (keyed by _draftId). Marquee is the
	// in-progress rubber-band selection rectangle.
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [marquee, setMarquee] = useState<MarqueeState | null>(null);
	// Live map of draftId → DOM node, populated via ref callbacks on each
	// rectangle. Used by the pendingFocusDraftId effect to move focus onto
	// the newly-duplicated rectangle as soon as it mounts.
	const areaRefs = useRef(new Map<string, HTMLDivElement>());

	const baseScale = computeBaseScale(
		viewport.w,
		viewport.h,
		imageWidth,
		imageHeight,
	);
	const effectiveScale = baseScale * zoom;
	const stageW = imageWidth * effectiveScale;
	const stageH = imageHeight * effectiveScale;
	const translateX = clampPan(pan.x, stageW, viewport.w);
	const translateY = clampPan(pan.y, stageH, viewport.h);
	// Panning only makes sense once the stage overflows the viewport.
	const canPan = stageW > viewport.w + 0.5 || stageH > viewport.h + 0.5;

	// Only count selections that still exist (areas may have been deleted).
	const selectedCount = photoAreas.reduce(
		(n, a) => (a._draftId != null && selected.has(a._draftId) ? n + 1 : n),
		0,
	);

	// Convert a client point to image (layout) coordinates, accounting for the
	// current pan + zoom. Used by the marquee.
	const clientToImage = (clientX: number, clientY: number) => {
		const rect = viewportRef.current?.getBoundingClientRect();
		if (!rect || effectiveScale <= 0) return { x: 0, y: 0 };
		return {
			x: (clientX - rect.left - translateX) / effectiveScale,
			y: (clientY - rect.top - translateY) / effectiveScale,
		};
	};

	// Latest values for the native wheel listener + button/pan handlers, which
	// are attached/created once (so they can't be stale closures). Synced after
	// each commit via the effect below (updating a ref during render is unsafe).
	const stateRef = useRef({
		zoom,
		pan,
		baseScale,
		viewport,
		imageWidth,
		imageHeight,
	});
	useEffect(() => {
		stateRef.current = {
			zoom,
			pan,
			baseScale,
			viewport,
			imageWidth,
			imageHeight,
		};
	});

	useEffect(() => {
		if (!pendingFocusDraftId) return;
		const el = areaRefs.current.get(pendingFocusDraftId);
		if (el) {
			el.focus();
			onFocusApplied?.();
		}
	}, [pendingFocusDraftId, photoAreas, onFocusApplied]);

	// Measure the viewport (before paint, to avoid a first-frame flash) and keep
	// it in sync on resize / fullscreen toggle.
	useIsomorphicLayoutEffect(() => {
		const el = viewportRef.current;
		if (!el) return;
		const measure = () => {
			const r = el.getBoundingClientRect();
			setViewport((prev) =>
				prev.w === r.width && prev.h === r.height
					? prev
					: { w: r.width, h: r.height },
			);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Reset to fit whenever the layout's dimensions change (new product category
	// or a freshly detected image) so the operator always starts framed.
	// Adjusting state during render (guarded) is React's recommended pattern for
	// "reset state when a prop changes" — avoids a setState-in-effect.
	const dimsKey = `${imageWidth}x${imageHeight}`;
	if (dimsKey !== framedDims) {
		setFramedDims(dimsKey);
		setZoom(1);
		setPan({ x: 0, y: 0 });
	}

	// Drop selection ids whose area no longer exists (e.g. after a delete from
	// here or the parent's Remove button). Guarded setState-during-render, the
	// same converging pattern as the fit reset above.
	if (selected.size > 0) {
		const live = new Set(
			photoAreas
				.map((a) => a._draftId)
				.filter((id): id is string => id != null),
		);
		let hasStale = false;
		for (const id of selected) {
			if (!live.has(id)) {
				hasStale = true;
				break;
			}
		}
		if (hasStale) {
			setSelected(new Set([...selected].filter((id) => live.has(id))));
		}
	}

	// Native, non-passive wheel handler: Ctrl/Cmd + wheel (or trackpad pinch,
	// which the browser reports with ctrlKey=true) zooms toward the cursor;
	// a plain two-finger scroll pans. Attached once; reads latest state via ref.
	useEffect(() => {
		const el = viewportRef.current;
		if (!el) return;
		const onWheel = (e: WheelEvent) => {
			const st = stateRef.current;
			if (st.baseScale <= 0) return;
			e.preventDefault();
			const rect = el.getBoundingClientRect();
			if (e.ctrlKey || e.metaKey) {
				const next = zoomToPoint({
					zoom: st.zoom,
					panX: st.pan.x,
					panY: st.pan.y,
					factor: wheelDeltaToZoomFactor(e.deltaY),
					pointerX: e.clientX - rect.left,
					pointerY: e.clientY - rect.top,
					minZoom: ZOOM_MIN,
					maxZoom: ZOOM_MAX,
					baseScale: st.baseScale,
					imageW: st.imageWidth,
					imageH: st.imageHeight,
					viewportW: st.viewport.w,
					viewportH: st.viewport.h,
				});
				setZoom(next.zoom);
				setPan({ x: next.panX, y: next.panY });
			} else {
				const sw = st.imageWidth * st.baseScale * st.zoom;
				const sh = st.imageHeight * st.baseScale * st.zoom;
				setPan({
					x: clampPan(st.pan.x - e.deltaX, sw, st.viewport.w),
					y: clampPan(st.pan.y - e.deltaY, sh, st.viewport.h),
				});
			}
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, []);

	// Zoom via the on-screen buttons, toward the viewport center. Reads latest
	// state from the ref so it's a stable callback.
	const zoomByButton = useCallback((factor: number) => {
		const st = stateRef.current;
		if (st.baseScale <= 0) return;
		const next = zoomToPoint({
			zoom: st.zoom,
			panX: st.pan.x,
			panY: st.pan.y,
			factor,
			pointerX: st.viewport.w / 2,
			pointerY: st.viewport.h / 2,
			minZoom: ZOOM_MIN,
			maxZoom: ZOOM_MAX,
			baseScale: st.baseScale,
			imageW: st.imageWidth,
			imageH: st.imageHeight,
			viewportW: st.viewport.w,
			viewportH: st.viewport.h,
		});
		setZoom(next.zoom);
		setPan({ x: next.panX, y: next.panY });
	}, []);

	const fitToView = useCallback(() => {
		setZoom(1);
		setPan({ x: 0, y: 0 });
	}, []);

	// Align / distribute the current selection (image-space; writes back).
	const applyAlign = (op: AlignOp) => {
		onAreasChange(alignAreas(photoAreas, selected, op, imageWidth, imageHeight));
	};
	const applyDistribute = (axis: DistributeAxis) => {
		onAreasChange(
			distributeAreas(photoAreas, selected, axis, imageWidth, imageHeight),
		);
	};

	// Press on the empty canvas: middle-mouse pans (when zoomed); the primary
	// button starts a marquee rubber-band select. Other buttons (e.g. right-click)
	// are ignored. Areas/handles/controls are excluded, so this only runs on the
	// bare stage.
	const onViewportPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).closest("[data-area],[data-no-drag],button"))
			return;
		if (e.button === 1 && canPan) {
			// Suppress the OS middle-click action (Windows autoscroll / Linux paste).
			e.preventDefault();
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
			setPanDrag({
				startClientX: e.clientX,
				startClientY: e.clientY,
				startPanX: translateX,
				startPanY: translateY,
			});
			return;
		}
		// Marquee on the primary (left) button only.
		if (e.button !== 0) return;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		const p = clientToImage(e.clientX, e.clientY);
		setMarquee({
			startClientX: e.clientX,
			startClientY: e.clientY,
			x0: p.x,
			y0: p.y,
			x1: p.x,
			y1: p.y,
			additive: e.shiftKey || e.metaKey,
		});
	};

	const onViewportPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (panDrag) {
			setPan({
				x: clampPan(
					panDrag.startPanX + (e.clientX - panDrag.startClientX),
					stageW,
					viewport.w,
				),
				y: clampPan(
					panDrag.startPanY + (e.clientY - panDrag.startClientY),
					stageH,
					viewport.h,
				),
			});
			return;
		}
		if (marquee) {
			const p = clientToImage(e.clientX, e.clientY);
			setMarquee({ ...marquee, x1: p.x, y1: p.y });
		}
	};

	const onViewportPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			// Some browsers throw if the pointer wasn't actually captured.
		}
		if (panDrag) {
			setPanDrag(null);
			return;
		}
		if (marquee) {
			const movedPx = Math.hypot(
				e.clientX - marquee.startClientX,
				e.clientY - marquee.startClientY,
			);
			if (movedPx < 4) {
				// A click on empty canvas clears the selection (unless additive).
				if (!marquee.additive) setSelected(new Set());
			} else {
				const minX = Math.min(marquee.x0, marquee.x1);
				const maxX = Math.max(marquee.x0, marquee.x1);
				const minY = Math.min(marquee.y0, marquee.y1);
				const maxY = Math.max(marquee.y0, marquee.y1);
				const hit = new Set<string>(marquee.additive ? selected : []);
				for (const a of photoAreas) {
					if (a._draftId == null) continue;
					// Rectangle-overlap test in image space.
					if (
						a.x < maxX &&
						a.x + a.width > minX &&
						a.y < maxY &&
						a.y + a.height > minY
					) {
						hit.add(a._draftId);
					}
				}
				setSelected(hit);
			}
			setMarquee(null);
		}
	};

	const beginDrag = (
		e: ReactPointerEvent<HTMLDivElement>,
		idx: number,
		corner: Corner | null,
	) => {
		// Primary button only; let middle/right-click bubble (to pan / be ignored).
		if (e.button !== 0) return;
		// Don't start a drag if the user clicks on the delete X. Buttons
		// stop propagation themselves, but defense in depth.
		if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
		e.stopPropagation();
		const area = photoAreas[idx];
		const id = area?._draftId ?? String(idx);

		// Resize stays single-area regardless of selection.
		if (corner !== null) {
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
			setDrag({
				type: "resize",
				idx,
				corner,
				startClientX: e.clientX,
				startClientY: e.clientY,
				startArea: { ...area },
			});
			return;
		}

		// Shift/⌘-click toggles this area's selection membership (no move).
		if (e.shiftKey || e.metaKey) {
			setSelected((prev) => {
				const n = new Set(prev);
				if (n.has(id)) n.delete(id);
				else n.add(id);
				return n;
			});
			return;
		}

		// Move the whole selection if this area is part of a multi-selection;
		// otherwise select just this area and move it.
		let movingIds: string[];
		if (selected.has(id) && selectedCount > 1) {
			movingIds = photoAreas
				.filter((a) => a._draftId != null && selected.has(a._draftId))
				.map((a) => a._draftId as string);
		} else {
			movingIds = [id];
			setSelected(new Set([id]));
		}
		const idset = new Set(movingIds);
		const start: MoveStart[] = photoAreas
			.filter((a) => a._draftId != null && idset.has(a._draftId))
			.map((a) => ({
				id: a._draftId as string,
				x: a.x,
				y: a.y,
				width: a.width,
				height: a.height,
			}));

		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setDrag({
			type: "move",
			primaryId: id,
			startClientX: e.clientX,
			startClientY: e.clientY,
			start,
		});
	};

	const beginRadiusDrag = (
		e: ReactPointerEvent<HTMLDivElement>,
		idx: number,
	) => {
		if (e.button !== 0) return;
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setDrag({
			type: "radius",
			idx,
			startClientX: e.clientX,
			startArea: { ...photoAreas[idx] },
		});
	};

	const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (!drag || effectiveScale <= 0) return;
		// Client-pixel deltas → image-space via the effective (zoomed) scale.
		const dx = (e.clientX - drag.startClientX) / effectiveScale;

		// Hold Shift while dragging to snap to the grid step. Lets operators
		// align rectangles without pixel-hunting.
		const snap = e.shiftKey;
		const round = (n: number) => (snap ? snapTo(n, SNAP_STEP) : Math.round(n));

		// Radius drag (single area): move the top-edge handle to grow / shrink the
		// corner radius. shape_type auto-flips rectangle ↔ rounded_rectangle.
		if (drag.type === "radius") {
			const s = drag.startArea;
			const maxR = Math.floor(Math.min(s.width, s.height) / 2);
			const nextRadius = clamp(round(s.border_radius + dx), 0, maxR);
			const nextShape: PhotoAreaFormData["shape_type"] =
				nextRadius > 0 && s.shape_type === "rectangle"
					? "rounded_rectangle"
					: nextRadius === 0 && s.shape_type === "rounded_rectangle"
						? "rectangle"
						: s.shape_type;
			const updated = [...photoAreas];
			updated[drag.idx] = {
				...s,
				border_radius: nextRadius,
				shape_type: nextShape,
			};
			onAreasChange(updated);
			return;
		}

		const dy = (e.clientY - drag.startClientY) / effectiveScale;
		const threshold = SNAP_DISPLAY_PX / effectiveScale;
		const smart = smartSnap && !e.altKey && !e.shiftKey;

		// Resize drag (single area).
		if (drag.type === "resize") {
			const s = drag.startArea;
			let x = s.x;
			let y = s.y;
			let w = s.width;
			let h = s.height;
			const c = drag.corner;
			if (c === "ne" || c === "se") {
				w = clamp(s.width + dx, MIN_DIM, imageWidth - s.x);
			}
			if (c === "sw" || c === "se") {
				h = clamp(s.height + dy, MIN_DIM, imageHeight - s.y);
			}
			if (c === "nw" || c === "sw") {
				const newX = clamp(s.x + dx, 0, s.x + s.width - MIN_DIM);
				w = s.width + (s.x - newX);
				x = newX;
			}
			if (c === "nw" || c === "ne") {
				const newY = clamp(s.y + dy, 0, s.y + s.height - MIN_DIM);
				h = s.height + (s.y - newY);
				y = newY;
			}
			const newMaxR = Math.floor(Math.min(round(w), round(h)) / 2);
			let next: PhotoAreaFormData = {
				...s,
				x: round(x),
				y: round(y),
				width: round(w),
				height: round(h),
				border_radius: Math.min(s.border_radius, newMaxR),
			};
			let activeGuides: SnapGuideLine[] = [];
			if (smart) {
				const others = photoAreas
					.filter((_, i) => i !== drag.idx)
					.map((a) => ({ x: a.x, y: a.y, width: a.width, height: a.height }));
				const r = computeResizeSnap(
					next,
					c,
					others,
					imageWidth,
					imageHeight,
					threshold,
					MIN_DIM,
				);
				const maxR = Math.floor(Math.min(r.width, r.height) / 2);
				next = {
					...next,
					x: r.x,
					y: r.y,
					width: r.width,
					height: r.height,
					border_radius: Math.min(next.border_radius, maxR),
				};
				activeGuides = r.guides;
			}
			setGuides(activeGuides);
			const updated = [...photoAreas];
			updated[drag.idx] = next;
			onAreasChange(updated);
			return;
		}

		// Move drag (group-aware). Compute a single delta, clamp it so no member
		// leaves the canvas, then apply to all moving areas.
		const start = drag.start;
		const startById = new Map(start.map((m) => [m.id, m]));
		const primary = startById.get(drag.primaryId);
		if (!primary) return;
		const minDx = Math.max(...start.map((m) => -m.x));
		const maxDx = Math.min(...start.map((m) => imageWidth - m.width - m.x));
		const minDy = Math.max(...start.map((m) => -m.y));
		const maxDy = Math.min(...start.map((m) => imageHeight - m.height - m.y));
		let ddx = clamp(round(dx), minDx, maxDx);
		let ddy = clamp(round(dy), minDy, maxDy);

		// Snap only for a single-area move (snapping a whole group is ambiguous).
		let activeGuides: SnapGuideLine[] = [];
		if (start.length === 1 && smart) {
			const others = photoAreas
				.filter((a) => a._draftId !== primary.id)
				.map((a) => ({ x: a.x, y: a.y, width: a.width, height: a.height }));
			const r = computeMoveSnap(
				{ x: primary.x + ddx, y: primary.y + ddy, width: primary.width, height: primary.height },
				others,
				imageWidth,
				imageHeight,
				threshold,
			);
			ddx = clamp(r.x - primary.x, minDx, maxDx);
			ddy = clamp(r.y - primary.y, minDy, maxDy);
			activeGuides = r.guides;
		}
		setGuides(activeGuides);

		const updated = photoAreas.map((a) => {
			if (a._draftId == null || !startById.has(a._draftId)) return a;
			const m = startById.get(a._draftId) as MoveStart;
			return { ...a, x: m.x + ddx, y: m.y + ddy };
		});
		onAreasChange(updated);
	};

	const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			// Some browsers throw if the pointer wasn't actually captured.
		}
		setDrag(null);
		setGuides([]);
	};

	// Keyboard nudge + delete on the focused photo area. Tab cycles through
	// the rectangles (each has tabIndex=0); arrow keys move by 1px (10px
	// with Shift); Delete/Backspace removes the focused rectangle. To match
	// the existing "Remove" button, we don't auto-renumber photo_index on
	// delete — the submit-time validation surfaces any gaps.
	const onAreaKeyDown = (
		e: ReactKeyboardEvent<HTMLDivElement>,
		idx: number,
	) => {
		const step = e.shiftKey ? KEY_NUDGE_BIG : 1;
		const current = photoAreas[idx];
		if (!current) return;
		const move = (dx: number, dy: number) => {
			const updated = [...photoAreas];
			updated[idx] = {
				...current,
				x: clamp(
					current.x + dx,
					0,
					Math.max(0, imageWidth - current.width),
				),
				y: clamp(
					current.y + dy,
					0,
					Math.max(0, imageHeight - current.height),
				),
			};
			onAreasChange(updated);
		};
		switch (e.key) {
			case "ArrowLeft":
				e.preventDefault();
				move(-step, 0);
				break;
			case "ArrowRight":
				e.preventDefault();
				move(step, 0);
				break;
			case "ArrowUp":
				e.preventDefault();
				move(0, -step);
				break;
			case "ArrowDown":
				e.preventDefault();
				move(0, step);
				break;
			case "Delete":
			case "Backspace":
				e.preventDefault();
				onAreasChange(photoAreas.filter((_, i) => i !== idx));
				break;
			default:
				// Cmd/Ctrl+D duplicates the focused rectangle. preventDefault
				// to stop the browser's "Bookmark page" shortcut. Compare
				// against lowercase key so caps-lock doesn't drop the binding.
				if (
					(e.metaKey || e.ctrlKey) &&
					!e.altKey &&
					e.key.toLowerCase() === "d"
				) {
					e.preventDefault();
					onDuplicate?.(idx);
				}
		}
	};

	// Defensive: a 0 width/height would produce NaN percentages below.
	// Bail with a placeholder rather than silently rendering broken positions.
	if (imageWidth <= 0 || imageHeight <= 0) {
		return (
			<div className="w-full rounded-lg border border-dashed border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 px-4 py-8 text-center text-xs text-zinc-400">
				Set a positive layout width and height to enable the visual editor.
			</div>
		);
	}

	return (
		<div className="space-y-1">
			<div
				ref={viewportRef}
				onPointerDown={onViewportPointerDown}
				onPointerMove={onViewportPointerMove}
				onPointerUp={onViewportPointerUp}
				onPointerCancel={onViewportPointerUp}
				className="relative w-full overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 select-none touch-none"
				style={{
					// Fill most of the screen in full-screen mode; stay compact
					// inside the modal so the other form fields remain reachable.
					height: fullscreen
						? "min(85vh, 1100px)"
						: "clamp(320px, 55vh, 620px)",
					cursor: panDrag ? "grabbing" : "default",
				}}
			>
				{!imageSrc && (
					<div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400 pointer-events-none px-4 text-center">
						No reference image — upload one above to see the template behind your photo areas.
					</div>
				)}

				{/* Stage: explicitly sized (imageW·effectiveScale) and translated by
				    pan. Not CSS-scaled, so chrome inside stays constant-size. */}
				<div
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						width: `${stageW}px`,
						height: `${stageH}px`,
						transform: `translate(${translateX}px, ${translateY}px)`,
						willChange: "transform",
					}}
				>
					{imageSrc && (
						// biome-ignore lint/performance/noImgElement: object URLs from
						// the operator's local file picker can't go through next/image.
						<img
							src={imageSrc}
							alt=""
							aria-hidden="true"
							draggable={false}
							className="absolute inset-0 w-full h-full object-contain pointer-events-none"
						/>
					)}

					{photoAreas.map((area, idx) => {
						const leftPct = (area.x / imageWidth) * 100;
						const topPct = (area.y / imageHeight) * 100;
						const widthPct = (area.width / imageWidth) * 100;
						const heightPct = (area.height / imageHeight) * 100;
						const isSelected =
							area._draftId != null && selected.has(area._draftId);
						// Visualize the shape so the canvas matches what the operator
						// ultimately prints. Circles use 50% so the radius tracks the
						// rectangle's smaller side; rounded rectangles convert the
						// image-space border_radius to display pixels via effectiveScale.
						// Heart/petal fall back to a plain rectangle outline — the
						// canvas hints at the bounding box, and the operator masks the
						// real cutout via the template overlay.
						const borderRadius =
							area.shape_type === "circle"
								? "50%"
								: area.shape_type === "rounded_rectangle"
									? `${area.border_radius * effectiveScale}px`
									: undefined;
						return (
							<div
								key={area._draftId ?? idx}
								data-area
								ref={(el) => {
									const id = area._draftId;
									if (!id) return;
									if (el) areaRefs.current.set(id, el);
									else areaRefs.current.delete(id);
								}}
								tabIndex={0}
								role="button"
								aria-label={`Photo area ${area.photo_index} at ${area.x}, ${area.y}, size ${area.width} by ${area.height}, shape ${area.shape_type}. Arrow keys to move, Delete to remove, Cmd or Ctrl D to duplicate.`}
								onPointerDown={(e) => beginDrag(e, idx, null)}
								onPointerMove={onPointerMove}
								onPointerUp={onPointerUp}
								onPointerCancel={onPointerUp}
								onKeyDown={(e) => onAreaKeyDown(e, idx)}
								className={`absolute cursor-move focus-visible:ring-2 focus-visible:ring-[#0EC7C7] ${
									isSelected
										? "border-2 border-[#0EC7C7]"
										: "border border-[#069494]"
								} ${showFill ? "bg-[#069494]/15" : "bg-transparent"}`}
								style={{
									left: `${leftPct}%`,
									top: `${topPct}%`,
									width: `${widthPct}%`,
									height: `${heightPct}%`,
									borderRadius,
									// 1px white ring hugging the teal border so the edge
									// stays a crisp, precise line on any template background
									// (dark strip, light 4x6, or a teal-ish design). Uses
									// outline (not box-shadow) to leave the focus ring intact.
									outline: "1px solid rgba(255,255,255,0.75)",
									outlineOffset: "0px",
								}}
							>
								<span className="absolute -top-6 left-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#069494] text-white">
									{area.photo_index}
								</span>
								{/*
								 * Corner-radius handle. Sits on the top edge at a
								 * position proportional to the current radius. Drag
								 * inward (rightward) to round more; back to the
								 * corner to flatten. Cap is min(W,H)/2 — which
								 * renders as a circle. Only shown when the shape is
								 * actually rectangle-derived; circle / heart / petal
								 * don't use a numeric border_radius. Rendered before
								 * the corner handles so the corner handles stack on
								 * top — keeps the resize handles fully clickable.
								 */}
								{(area.shape_type === "rectangle" ||
									area.shape_type === "rounded_rectangle") && (
									<div
										onPointerDown={(e) => beginRadiusDrag(e, idx)}
										onPointerMove={onPointerMove}
										onPointerUp={onPointerUp}
										onPointerCancel={onPointerUp}
										title="Drag to round corners"
										aria-label="Corner radius handle"
										className="absolute w-3 h-3 bg-white border-2 border-[#0EC7C7] rounded-full"
										style={{
											top: "-6px",
											left: `${Math.max(10, area.border_radius * effectiveScale)}px`,
											transform: "translateX(-50%)",
											cursor: "ew-resize",
										}}
									/>
								)}
								{(["nw", "ne", "sw", "se"] as const).map((corner) => (
									<div
										key={corner}
										onPointerDown={(e) => beginDrag(e, idx, corner)}
										onPointerMove={onPointerMove}
										onPointerUp={onPointerUp}
										onPointerCancel={onPointerUp}
										className="absolute w-3 h-3 bg-white border-2 border-[#069494] rounded-sm"
										style={cornerStyle(corner)}
									/>
								))}
							</div>
						);
					})}

					{/* Smart alignment guides for the in-progress drag. Fixed 1px
					    dashed lines (constant on-screen size at any zoom), drawn in
					    image %-space so they track the stage. */}
					{guides.map((g, i) => (
						<div
							key={`guide-${g.axis}-${g.pos}-${i}`}
							aria-hidden="true"
							style={
								g.axis === "x"
									? {
											position: "absolute",
											left: `${(g.pos / imageWidth) * 100}%`,
											top: 0,
											bottom: 0,
											borderLeft: "1px dashed #F43F5E",
											transform: "translateX(-0.5px)",
											pointerEvents: "none",
										}
									: {
											position: "absolute",
											top: `${(g.pos / imageHeight) * 100}%`,
											left: 0,
											right: 0,
											borderTop: "1px dashed #F43F5E",
											transform: "translateY(-0.5px)",
											pointerEvents: "none",
										}
							}
						/>
					))}

					{marquee && (
						<div
							aria-hidden="true"
							style={{
								position: "absolute",
								left: `${(Math.min(marquee.x0, marquee.x1) / imageWidth) * 100}%`,
								top: `${(Math.min(marquee.y0, marquee.y1) / imageHeight) * 100}%`,
								width: `${(Math.abs(marquee.x1 - marquee.x0) / imageWidth) * 100}%`,
								height: `${(Math.abs(marquee.y1 - marquee.y0) / imageHeight) * 100}%`,
								border: "1px dashed #0EC7C7",
								background: "rgba(14, 199, 199, 0.08)",
								pointerEvents: "none",
							}}
						/>
					)}
				</div>

				{/* Align / distribute toolbar — shown when 2+ areas are selected. */}
				{selectedCount >= 2 && (
					<div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 rounded-lg bg-white/95 dark:bg-zinc-800/95 border border-slate-200 dark:border-zinc-700 shadow-sm px-1 py-0.5 text-zinc-600 dark:text-zinc-300">
						{ALIGN_CONTROLS.map(({ op, label, Icon }) => (
							<button
								key={op}
								type="button"
								onClick={() => applyAlign(op)}
								aria-label={label}
								title={label}
								className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-700"
							>
								<Icon className="w-4 h-4" aria-hidden="true" />
							</button>
						))}
						<span className="mx-0.5 w-px h-4 bg-slate-200 dark:bg-zinc-600" />
						{DISTRIBUTE_CONTROLS.map(({ axis, label, Icon }) => (
							<button
								key={axis}
								type="button"
								onClick={() => applyDistribute(axis)}
								disabled={selectedCount < 3}
								aria-label={label}
								title={
									selectedCount < 3 ? "Select 3+ areas to distribute" : label
								}
								className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-default"
							>
								<Icon className="w-4 h-4" aria-hidden="true" />
							</button>
						))}
					</div>
				)}

				<div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1">
					<button
						type="button"
						onClick={() => setShowFill((v) => !v)}
						aria-pressed={showFill}
						title={
							showFill
								? "Hide the area fill so you can align each edge to the template's photo-slot edge"
								: "Show a translucent fill inside each photo area"
						}
						className="text-[10px] font-medium px-2 py-1 rounded-md bg-white/90 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-white dark:hover:bg-zinc-800"
					>
						{showFill ? "Fill: on" : "Fill: off"}
					</button>
					<button
						type="button"
						onClick={() => setSmartSnap((v) => !v)}
						aria-pressed={smartSnap}
						title={
							smartSnap
								? "Turn off smart alignment guides (hold Alt while dragging to bypass temporarily)"
								: "Turn on smart alignment guides that snap to other areas and the canvas"
						}
						className="text-[10px] font-medium px-2 py-1 rounded-md bg-white/90 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-white dark:hover:bg-zinc-800"
					>
						{smartSnap ? "Snap: on" : "Snap: off"}
					</button>
				</div>

				{/* Zoom controls — always visible so non-technical operators who
				    won't guess pinch have an obvious way to zoom / reset. */}
				<div className="absolute bottom-2 left-2 z-20 flex items-center gap-0.5 rounded-lg bg-white/90 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 shadow-sm px-1 py-0.5 text-zinc-600 dark:text-zinc-300">
					<button
						type="button"
						onClick={() => zoomByButton(1 / ZOOM_BTN_STEP)}
						disabled={zoom <= ZOOM_MIN}
						aria-label="Zoom out"
						className="px-1.5 py-0.5 rounded text-sm leading-none hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-default"
					>
						−
					</button>
					<span className="min-w-[3.5ch] text-center text-[10px] tabular-nums">
						{Math.round(zoom * 100)}%
					</span>
					<button
						type="button"
						onClick={() => zoomByButton(ZOOM_BTN_STEP)}
						disabled={zoom >= ZOOM_MAX}
						aria-label="Zoom in"
						className="px-1.5 py-0.5 rounded text-sm leading-none hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-default"
					>
						+
					</button>
					<span className="mx-0.5 w-px h-3.5 bg-slate-200 dark:bg-zinc-600" />
					<button
						type="button"
						onClick={fitToView}
						disabled={zoom === ZOOM_MIN}
						aria-label="Fit layout to view"
						className="px-1.5 py-0.5 rounded text-[10px] font-medium hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-default"
					>
						Fit
					</button>
				</div>
			</div>
			<p className="text-[10px] text-zinc-500">
				Pinch or ⌘/Ctrl-scroll to zoom · two-finger scroll or middle-drag to
				pan · drag empty space to select, Shift-click for multiple · areas snap
				to align (hold Alt to bypass, Shift for the 10px grid).
			</p>
		</div>
	);
}

function cornerStyle(corner: Corner): CSSProperties {
	const isW = corner === "nw" || corner === "sw";
	const isN = corner === "nw" || corner === "ne";
	return {
		left: isW ? "-6px" : "auto",
		right: !isW ? "-6px" : "auto",
		top: isN ? "-6px" : "auto",
		bottom: !isN ? "-6px" : "auto",
		cursor:
			corner === "nw" || corner === "se" ? "nwse-resize" : "nesw-resize",
	};
}
