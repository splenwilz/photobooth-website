import type { AdminShapeType } from "@/core/api/templates/admin-types";

export const SHAPE_TYPES: AdminShapeType[] = [
  "rectangle",
  "rounded_rectangle",
  "circle",
  "heart",
  "petal",
];

export interface PhotoAreaFormData {
  photo_index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  border_radius: number;
  shape_type: AdminShapeType;
  // Frontend-only React-key. Generated when a row is created (add /
  // paste / default-init). Stripped from the serialized clipboard
  // payload — the wire format doesn't carry _draftId, but every row in
  // the form state has one. Stable across re-renders so removing /
  // reordering rows doesn't make React re-bind the wrong NumberInput
  // local state to an existing row.
  _draftId?: string;
}

/**
 * Crypto-strong UUID for React keys on photo-area rows. Falls back to
 * a Math.random-based id in environments without crypto.randomUUID
 * (older browsers / jsdom). The id never leaves the client.
 */
export function newDraftId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `area-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export const LAYOUT_CLIPBOARD_TYPE = "boothiq.layout/v1";

export type LayoutClipboardPayload = {
  _type: typeof LAYOUT_CLIPBOARD_TYPE;
  layout_key: string;
  name: string;
  description: string;
  width: number;
  height: number;
  product_category_id: number;
  is_active: boolean;
  sort_order: number;
  photo_areas: PhotoAreaFormData[];
};

// Reject null/undefined and any whitespace-only string ("", "   ", "\t").
// Number("") and Number("   ") and Number(null) all silently coerce to 0,
// which would let empty fields slip through.
function isMissingScalar(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  return false;
}

// Only numbers and non-empty strings should reach Number(). Booleans
// (Number(true) === 1, Number(false) === 0), arrays (Number([]) === 0,
// Number([5]) === 5), and other objects all coerce to plausible numbers
// silently — the JSON shape is wrong and we should reject up front.
function isValidNumericPrimitive(v: unknown): boolean {
  if (typeof v === "number") return true;
  if (typeof v === "string" && v.trim() !== "") return true;
  return false;
}

function requireFiniteNumber(v: unknown, field: string): number {
  if (isMissingScalar(v)) {
    throw new Error(`Field "${field}" is required.`);
  }
  if (!isValidNumericPrimitive(v)) {
    throw new Error(
      `Field "${field}" must be a finite number, got ${JSON.stringify(v)}.`
    );
  }
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) {
    throw new Error(
      `Field "${field}" must be a finite number, got ${JSON.stringify(v)}.`
    );
  }
  return n;
}

function optionalFiniteNumber(v: unknown, fallback: number): number {
  if (isMissingScalar(v)) return fallback;
  if (!isValidNumericPrimitive(v)) return fallback;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function serializeLayoutForClipboard(layout: {
  layout_key: string;
  name: string;
  description: string | null;
  width: number;
  height: number;
  product_category_id: number;
  is_active: boolean;
  sort_order: number;
  photo_areas?: Array<{
    photo_index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    border_radius: number;
    shape_type: AdminShapeType;
  }>;
}): string {
  const payload: LayoutClipboardPayload = {
    _type: LAYOUT_CLIPBOARD_TYPE,
    layout_key: layout.layout_key,
    name: layout.name,
    description: layout.description ?? "",
    width: layout.width,
    height: layout.height,
    product_category_id: layout.product_category_id,
    is_active: layout.is_active,
    sort_order: layout.sort_order,
    photo_areas: (layout.photo_areas ?? []).map((a) => ({
      photo_index: a.photo_index,
      x: a.x,
      y: a.y,
      width: a.width,
      height: a.height,
      rotation: a.rotation,
      border_radius: a.border_radius,
      shape_type: a.shape_type,
    })),
  };
  return JSON.stringify(payload, null, 2);
}

export function parseLayoutFromClipboard(text: string): LayoutClipboardPayload {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Clipboard does not contain valid JSON.");
  }
  if (!raw || typeof raw !== "object") {
    throw new Error("Clipboard JSON is not an object.");
  }
  const obj = raw as Record<string, unknown>;
  if (obj._type !== LAYOUT_CLIPBOARD_TYPE) {
    throw new Error(
      `Clipboard JSON is not a BoothIQ layout (expected _type "${LAYOUT_CLIPBOARD_TYPE}").`
    );
  }
  // `name` must be a non-empty string. Accepting non-string types (numbers,
  // booleans) and silently coercing via `String(...)` would let malformed
  // clipboard payloads through with junk display values; an empty/blank
  // string would let a layout be created with no human-readable name.
  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    throw new Error(`Clipboard layout is missing required field "name".`);
  }

  const photoAreasRaw = Array.isArray(obj.photo_areas) ? obj.photo_areas : [];
  const photo_areas: PhotoAreaFormData[] = photoAreasRaw.map(
    (a: unknown, idx: number) => {
      const area = (a ?? {}) as Record<string, unknown>;
      return {
        photo_index: optionalFiniteNumber(area.photo_index, idx + 1),
        x: optionalFiniteNumber(area.x, 0),
        y: optionalFiniteNumber(area.y, 0),
        width: optionalFiniteNumber(area.width, 400),
        height: optionalFiniteNumber(area.height, 400),
        rotation: optionalFiniteNumber(area.rotation, 0),
        border_radius: optionalFiniteNumber(area.border_radius, 0),
        shape_type:
          typeof area.shape_type === "string" &&
          (SHAPE_TYPES as string[]).includes(area.shape_type)
            ? (area.shape_type as AdminShapeType)
            : "rectangle",
        // Generate a fresh React key per row. Pasted JSON never carries
        // one (it's a frontend-only concern); add/default flows generate
        // their own at row-creation time.
        _draftId: newDraftId(),
      };
    }
  );
  return {
    _type: LAYOUT_CLIPBOARD_TYPE,
    // Trim and collapse to "" if blank, mirroring how `name` is handled.
    // A whitespace-only key would render as a "valid" key client-side
    // but fail backend validation; nip it at parse time.
    layout_key:
      typeof obj.layout_key === "string" ? obj.layout_key.trim() : "",
    name: obj.name.trim(),
    description: typeof obj.description === "string" ? obj.description : "",
    width: requireFiniteNumber(obj.width, "width"),
    height: requireFiniteNumber(obj.height, "height"),
    product_category_id: requireFiniteNumber(
      obj.product_category_id,
      "product_category_id"
    ),
    is_active: typeof obj.is_active === "boolean" ? obj.is_active : true,
    sort_order: optionalFiniteNumber(obj.sort_order, 0),
    photo_areas,
  };
}
