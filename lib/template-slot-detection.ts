/**
 * Auto-detect photo slots from a transparent PNG template.
 *
 * Most photo-booth templates are designed as PNGs with transparent regions
 * where the customer's photos will appear at print time. This helper reads
 * the alpha channel, finds connected transparent regions via iterative
 * flood-fill, and returns their bounding boxes so we can populate
 * `photo_areas` for a layout without the operator typing X/Y/W/H by hand.
 *
 * Every detected slot is emitted as a plain rectangle. Shape (rounded
 * corners, circles) is the operator's call — they tune `border_radius`
 * visually via the canvas's radius handle, which is more reliable than
 * any estimate this function could make from area math alone.
 *
 * Everything runs client-side in the browser (createImageBitmap +
 * OffscreenCanvas with a `<canvas>` fallback). No bytes leave the page.
 */

// Pixels with alpha at or below this threshold count as "transparent."
// Anti-aliased edges of placeholder rectangles can sit just above 0; a
// few-unit tolerance keeps flood-fill from missing edge pixels.
const ALPHA_THRESHOLD = 16;

// Slots smaller than this (in pixels) are discarded as noise.
const MIN_SLOT_AREA = 100 * 100;

// Ratio of actual transparent pixels to bounding-box area. Rectangles sit
// near 1.0, circles at π/4 (~0.785), rounded rectangles in between.
// Anything below this floor is an irregular blob (drop-shadow hole,
// decorative cutout) and gets dropped.
const SHAPE_LIKENESS_MIN = 0.65;

export interface DetectedSlot {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface SlotDetectionResult {
	imageWidth: number;
	imageHeight: number;
	slots: DetectedSlot[];
}

/**
 * Detect transparent photo slots in an uploaded template image.
 * Returns image dimensions and any rectangular transparent regions found.
 * Throws if the file can't be decoded as an image.
 */
export async function detectPhotoSlotsFromFile(
	file: File,
): Promise<SlotDetectionResult> {
	const bitmap = await createImageBitmap(file);
	const width = bitmap.width;
	const height = bitmap.height;

	// Bitmaps hold native memory outside the JS heap, so closing them
	// explicitly matters. Wrap everything that uses the bitmap in a
	// try/finally so we don't leak it if drawImage or getImageData throws.
	let imageData: ImageData;
	try {
		const canvas: OffscreenCanvas | HTMLCanvasElement =
			typeof OffscreenCanvas !== "undefined"
				? new OffscreenCanvas(width, height)
				: Object.assign(document.createElement("canvas"), { width, height });
		const ctx = canvas.getContext("2d") as
			| OffscreenCanvasRenderingContext2D
			| CanvasRenderingContext2D
			| null;
		if (!ctx) {
			throw new Error("Could not get 2D canvas context for slot detection.");
		}
		ctx.drawImage(bitmap, 0, 0);
		imageData = ctx.getImageData(0, 0, width, height);
	} finally {
		bitmap.close();
	}

	const pixels = imageData.data;
	const visited = new Uint8Array(width * height);
	const slots: DetectedSlot[] = [];
	const stack: number[] = [];

	const isTransparent = (idx: number): boolean =>
		pixels[idx * 4 + 3] <= ALPHA_THRESHOLD;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const start = y * width + x;
			if (visited[start] || !isTransparent(start)) continue;

			// Iterative flood-fill (stack-based) to avoid recursion limits on
			// large templates. 4-connectivity is sufficient for axis-aligned
			// photo placeholders.
			stack.length = 0;
			stack.push(start);
			visited[start] = 1;
			let minX = x;
			let minY = y;
			let maxX = x;
			let maxY = y;
			let count = 0;

			while (stack.length > 0) {
				const cur = stack.pop() as number;
				count++;
				const cx = cur % width;
				const cy = (cur - cx) / width;
				if (cx < minX) minX = cx;
				else if (cx > maxX) maxX = cx;
				if (cy < minY) minY = cy;
				else if (cy > maxY) maxY = cy;

				if (cx > 0) {
					const n = cur - 1;
					if (!visited[n] && isTransparent(n)) {
						visited[n] = 1;
						stack.push(n);
					}
				}
				if (cx + 1 < width) {
					const n = cur + 1;
					if (!visited[n] && isTransparent(n)) {
						visited[n] = 1;
						stack.push(n);
					}
				}
				if (cy > 0) {
					const n = cur - width;
					if (!visited[n] && isTransparent(n)) {
						visited[n] = 1;
						stack.push(n);
					}
				}
				if (cy + 1 < height) {
					const n = cur + width;
					if (!visited[n] && isTransparent(n)) {
						visited[n] = 1;
						stack.push(n);
					}
				}
			}

			const bboxW = maxX - minX + 1;
			const bboxH = maxY - minY + 1;
			const bboxArea = bboxW * bboxH;
			if (bboxArea < MIN_SLOT_AREA) continue;
			if (count / bboxArea < SHAPE_LIKENESS_MIN) continue;

			slots.push({ x: minX, y: minY, width: bboxW, height: bboxH });
		}
	}

	// Reading order: top-to-bottom, then left-to-right. Two slots count as
	// "the same row" when their vertical centers overlap; that way a strip
	// of three side-by-side photos doesn't get out-of-order because of
	// minor y-pixel differences, and a wide slot stacked centered above a
	// shorter one still ranks above it.
	slots.sort((a, b) => {
		const centerA = a.y + a.height / 2;
		const centerB = b.y + b.height / 2;
		const sameRow =
			Math.abs(centerA - centerB) < Math.min(a.height, b.height) / 2;
		if (sameRow) return a.x - b.x;
		return centerA - centerB;
	});

	return { imageWidth: width, imageHeight: height, slots };
}
