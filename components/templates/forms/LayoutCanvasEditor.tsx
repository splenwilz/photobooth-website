"use client";

import {
	useEffect,
	useRef,
	useState,
	type CSSProperties,
	type KeyboardEvent as ReactKeyboardEvent,
	type PointerEvent as ReactPointerEvent,
} from "react";
import type { PhotoAreaFormData } from "@/core/templates/layout-clipboard";

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
}

type Corner = "nw" | "ne" | "sw" | "se";

type DragState =
	| {
			type: "move";
			idx: number;
			startClientX: number;
			startClientY: number;
			startArea: PhotoAreaFormData;
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

const MIN_DIM = 20;
// Grid step (image-space px) for Shift-snap. 10 is a forgiving size that
// lines up the typical photo-strip slots within a pixel or two.
const SNAP_STEP = 10;
// Keyboard nudge step (Shift+arrow uses this; plain arrow uses 1).
const KEY_NUDGE_BIG = 10;

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

function snapTo(n: number, step: number) {
	return Math.round(n / step) * step;
}

/**
 * Visual canvas for placing and resizing photo areas on top of a template
 * image. All coordinate math runs in the layout's pixel space (the same
 * space `form.width`, `form.height`, and each area's `x/y/width/height`
 * use), so values written back into `onAreasChange` are immediately usable
 * by the rest of the form and the backend.
 *
 * Pointer events with `setPointerCapture` keep drag working even when the
 * cursor leaves the canvas — needed for fast drags off the right/bottom
 * edges. Window resize is handled by a ResizeObserver that recomputes the
 * display-px → image-px scale.
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
}: LayoutCanvasEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const [drag, setDrag] = useState<DragState | null>(null);
	// Live map of draftId → DOM node, populated via ref callbacks on each
	// rectangle. Used by the pendingFocusDraftId effect to move focus onto
	// the newly-duplicated rectangle as soon as it mounts.
	const areaRefs = useRef(new Map<string, HTMLDivElement>());

	useEffect(() => {
		if (!pendingFocusDraftId) return;
		const el = areaRefs.current.get(pendingFocusDraftId);
		if (el) {
			el.focus();
			onFocusApplied?.();
		}
	}, [pendingFocusDraftId, photoAreas, onFocusApplied]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const update = () => {
			const w = el.getBoundingClientRect().width;
			if (w > 0 && imageWidth > 0) setScale(w / imageWidth);
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, [imageWidth]);

	const beginDrag = (
		e: ReactPointerEvent<HTMLDivElement>,
		idx: number,
		corner: Corner | null,
	) => {
		// Don't start a drag if the user clicks on the delete X. Buttons
		// stop propagation themselves, but defense in depth.
		if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		const startArea = { ...photoAreas[idx] };
		setDrag(
			corner === null
				? {
						type: "move",
						idx,
						startClientX: e.clientX,
						startClientY: e.clientY,
						startArea,
					}
				: {
						type: "resize",
						idx,
						corner,
						startClientX: e.clientX,
						startClientY: e.clientY,
						startArea,
					},
		);
	};

	const beginRadiusDrag = (
		e: ReactPointerEvent<HTMLDivElement>,
		idx: number,
	) => {
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
		if (!drag || scale === 0) return;
		const dx = (e.clientX - drag.startClientX) / scale;
		const s = drag.startArea;

		// Hold Shift while dragging to snap to the grid step. Lets operators
		// align rectangles without pixel-hunting.
		const snap = e.shiftKey;
		const round = (n: number) => (snap ? snapTo(n, SNAP_STEP) : Math.round(n));

		// Radius drag: move the small handle on the top edge to grow / shrink
		// the corner radius. Max R is half the shorter side (renders as a
		// circle). shape_type auto-flips between rectangle and
		// rounded_rectangle so the form stays consistent.
		if (drag.type === "radius") {
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

		const dy = (e.clientY - drag.startClientY) / scale;

		let next: PhotoAreaFormData;
		if (drag.type === "move") {
			const x = clamp(s.x + dx, 0, Math.max(0, imageWidth - s.width));
			const y = clamp(s.y + dy, 0, Math.max(0, imageHeight - s.height));
			next = { ...s, x: round(x), y: round(y) };
		} else {
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
			// Shrinking the rectangle below 2× the existing radius would
			// leave border_radius > max(W,H)/2, which is geometrically
			// invalid (CSS clamps visually but the form state is wrong).
			// Clamp it in lockstep with the new dimensions.
			const newMaxR = Math.floor(Math.min(round(w), round(h)) / 2);
			next = {
				...s,
				x: round(x),
				y: round(y),
				width: round(w),
				height: round(h),
				border_radius: Math.min(s.border_radius, newMaxR),
			};
		}

		const updated = [...photoAreas];
		updated[drag.idx] = next;
		onAreasChange(updated);
	};

	const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			// Some browsers throw if the pointer wasn't actually captured.
		}
		setDrag(null);
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

	// Defensive: a 0 width/height would produce NaN percentages below and
	// an invalid CSS aspectRatio. Bail with a placeholder rather than
	// silently rendering broken positions.
	if (imageWidth <= 0 || imageHeight <= 0) {
		return (
			<div className="w-full rounded-lg border border-dashed border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 px-4 py-8 text-center text-xs text-zinc-400">
				Set a positive layout width and height to enable the visual editor.
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="relative w-full overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 select-none touch-none"
			style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
		>
			{imageSrc ? (
				// biome-ignore lint/performance/noImgElement: object URLs from
				// the operator's local file picker can't go through next/image.
				<img
					src={imageSrc}
					alt=""
					aria-hidden="true"
					draggable={false}
					className="absolute inset-0 w-full h-full object-contain pointer-events-none"
				/>
			) : (
				<div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">
					No reference image — upload one above to see the template behind your photo areas.
				</div>
			)}

			{photoAreas.map((area, idx) => {
				const leftPct = (area.x / imageWidth) * 100;
				const topPct = (area.y / imageHeight) * 100;
				const widthPct = (area.width / imageWidth) * 100;
				const heightPct = (area.height / imageHeight) * 100;
				// Visualize the shape so the canvas matches what the operator
				// ultimately prints. Circles use 50% so the radius tracks the
				// rectangle's smaller side; rounded rectangles convert the
				// image-space border_radius to display pixels via `scale`.
				// Heart/petal fall back to a plain rectangle outline — the
				// canvas hints at the bounding box, and the operator masks the
				// real cutout via the template overlay.
				const borderRadius =
					area.shape_type === "circle"
						? "50%"
						: area.shape_type === "rounded_rectangle"
							? `${area.border_radius * scale}px`
							: undefined;
				return (
					<div
						key={area._draftId ?? idx}
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
						className="absolute border-2 border-[#069494] bg-[#069494]/15 cursor-move outline-none focus-visible:ring-2 focus-visible:ring-[#0EC7C7] focus-visible:ring-offset-1"
						style={{
							left: `${leftPct}%`,
							top: `${topPct}%`,
							width: `${widthPct}%`,
							height: `${heightPct}%`,
							borderRadius,
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
									left: `${Math.max(10, area.border_radius * scale)}px`,
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
