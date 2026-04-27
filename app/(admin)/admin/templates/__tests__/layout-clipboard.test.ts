import { describe, expect, it } from "vitest";
import {
  LAYOUT_CLIPBOARD_TYPE,
  parseLayoutFromClipboard,
  serializeLayoutForClipboard,
  type LayoutClipboardPayload,
} from "../layout-clipboard";
import type { AdminShapeType } from "@/core/api/templates/admin-types";

const minimalLayout = {
  layout_key: "strip-3-up",
  name: "Strip 3-up",
  description: "Three rectangular photos.",
  width: 600,
  height: 1800,
  product_category_id: 1,
  is_active: true,
  sort_order: 2,
  photo_areas: [
    {
      photo_index: 1,
      x: 30,
      y: 40,
      width: 540,
      height: 540,
      rotation: 0,
      border_radius: 0,
      shape_type: "rectangle" as AdminShapeType,
    },
    {
      photo_index: 2,
      x: 30,
      y: 600,
      width: 540,
      height: 540,
      rotation: 1.5,
      border_radius: 12,
      shape_type: "rounded_rectangle" as AdminShapeType,
    },
  ],
};

describe("serializeLayoutForClipboard", () => {
  it("emits the tagged JSON shape with all fields", () => {
    const json = serializeLayoutForClipboard(minimalLayout);
    const parsed = JSON.parse(json) as LayoutClipboardPayload;
    expect(parsed._type).toBe(LAYOUT_CLIPBOARD_TYPE);
    expect(parsed.layout_key).toBe("strip-3-up");
    expect(parsed.photo_areas).toHaveLength(2);
    expect(parsed.photo_areas[1].shape_type).toBe("rounded_rectangle");
  });

  it("treats null description as empty string", () => {
    const json = serializeLayoutForClipboard({ ...minimalLayout, description: null });
    const parsed = JSON.parse(json) as LayoutClipboardPayload;
    expect(parsed.description).toBe("");
  });

  it("treats missing photo_areas as empty array", () => {
    const { photo_areas: _omit, ...rest } = minimalLayout;
    void _omit;
    const json = serializeLayoutForClipboard(rest);
    const parsed = JSON.parse(json) as LayoutClipboardPayload;
    expect(parsed.photo_areas).toEqual([]);
  });
});

describe("parseLayoutFromClipboard", () => {
  it("round-trips a serialized layout", () => {
    const json = serializeLayoutForClipboard(minimalLayout);
    const parsed = parseLayoutFromClipboard(json);
    expect(parsed).toEqual({
      _type: LAYOUT_CLIPBOARD_TYPE,
      layout_key: "strip-3-up",
      name: "Strip 3-up",
      description: "Three rectangular photos.",
      width: 600,
      height: 1800,
      product_category_id: 1,
      is_active: true,
      sort_order: 2,
      photo_areas: minimalLayout.photo_areas,
    });
  });

  it("rejects invalid JSON", () => {
    expect(() => parseLayoutFromClipboard("not json")).toThrow(/valid JSON/);
  });

  it("rejects JSON that is not an object", () => {
    expect(() => parseLayoutFromClipboard('"a string"')).toThrow(/not an object/);
    expect(() => parseLayoutFromClipboard("null")).toThrow(/not an object/);
    expect(() => parseLayoutFromClipboard("[]")).toThrow(/BoothIQ layout/);
  });

  it("rejects payloads with a wrong _type tag", () => {
    expect(() =>
      parseLayoutFromClipboard(JSON.stringify({ _type: "boothiq.layout/v2", name: "x" }))
    ).toThrow(/BoothIQ layout/);
  });

  it("rejects payloads missing required fields", () => {
    expect(() =>
      parseLayoutFromClipboard(JSON.stringify({ _type: LAYOUT_CLIPBOARD_TYPE }))
    ).toThrow(/missing required field "name"/);
  });

  it("rejects non-string and blank names", () => {
    // number — would have been silently coerced to "42" by String()
    expect(() =>
      parseLayoutFromClipboard(
        JSON.stringify({ _type: LAYOUT_CLIPBOARD_TYPE, name: 42 })
      )
    ).toThrow(/missing required field "name"/);
    // empty string
    expect(() =>
      parseLayoutFromClipboard(
        JSON.stringify({ _type: LAYOUT_CLIPBOARD_TYPE, name: "" })
      )
    ).toThrow(/missing required field "name"/);
    // whitespace-only
    expect(() =>
      parseLayoutFromClipboard(
        JSON.stringify({ _type: LAYOUT_CLIPBOARD_TYPE, name: "   " })
      )
    ).toThrow(/missing required field "name"/);
  });

  it("trims surrounding whitespace from a valid name", () => {
    const parsed = parseLayoutFromClipboard(
      JSON.stringify({
        _type: LAYOUT_CLIPBOARD_TYPE,
        name: "  Halloween  ",
        width: 100,
        height: 100,
        product_category_id: 1,
      })
    );
    expect(parsed.name).toBe("Halloween");
  });

  it("rejects whitespace-only strings on required numeric fields", () => {
    // Number("   ") === 0 (finite) — a previous version of the validator
    // let whitespace strings slip through as zeros.
    expect(() =>
      parseLayoutFromClipboard(
        JSON.stringify({
          _type: LAYOUT_CLIPBOARD_TYPE,
          name: "x",
          width: "   ",
          height: 1,
          product_category_id: 1,
        })
      )
    ).toThrow(/"width"/);
    expect(() =>
      parseLayoutFromClipboard(
        JSON.stringify({
          _type: LAYOUT_CLIPBOARD_TYPE,
          name: "x",
          width: 1,
          height: "\t\n",
          product_category_id: 1,
        })
      )
    ).toThrow(/"height"/);
  });

  it("rejects non-finite numeric fields (the H1 bug)", () => {
    expect(() =>
      parseLayoutFromClipboard(
        JSON.stringify({
          _type: LAYOUT_CLIPBOARD_TYPE,
          name: "x",
          width: "abc",
          height: 1,
          product_category_id: 1,
        })
      )
    ).toThrow(/"width" must be a finite number/);

    expect(() =>
      parseLayoutFromClipboard(
        JSON.stringify({
          _type: LAYOUT_CLIPBOARD_TYPE,
          name: "x",
          width: 1,
          height: 1,
          product_category_id: null,
        })
      )
    ).toThrow(/"product_category_id"/);
  });

  it("falls back to 'rectangle' for unknown shape types", () => {
    const parsed = parseLayoutFromClipboard(
      JSON.stringify({
        _type: LAYOUT_CLIPBOARD_TYPE,
        name: "x",
        width: 100,
        height: 100,
        product_category_id: 1,
        photo_areas: [{ x: 0, y: 0, width: 50, height: 50, shape_type: "trapezoid" }],
      })
    );
    expect(parsed.photo_areas[0].shape_type).toBe("rectangle");
  });

  it("fills missing photo area numeric fields with sensible defaults", () => {
    const parsed = parseLayoutFromClipboard(
      JSON.stringify({
        _type: LAYOUT_CLIPBOARD_TYPE,
        name: "x",
        width: 100,
        height: 100,
        product_category_id: 1,
        photo_areas: [{ shape_type: "circle" }, {}],
      })
    );
    expect(parsed.photo_areas[0]).toMatchObject({
      photo_index: 1,
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      rotation: 0,
      border_radius: 0,
      shape_type: "circle",
    });
    expect(parsed.photo_areas[1].photo_index).toBe(2);
  });

  it("treats empty-string photo area fields as fallback (Number(\"\") === 0 trap)", () => {
    const parsed = parseLayoutFromClipboard(
      JSON.stringify({
        _type: LAYOUT_CLIPBOARD_TYPE,
        name: "x",
        width: 100,
        height: 100,
        product_category_id: 1,
        photo_areas: [{ photo_index: "", x: "", width: "" }],
      })
    );
    // photo_index falls back to idx + 1 (= 1), x falls back to 0, width
    // falls back to 400. Without the empty-string guard these would all
    // silently coerce to 0 via Number("").
    expect(parsed.photo_areas[0].photo_index).toBe(1);
    expect(parsed.photo_areas[0].x).toBe(0);
    expect(parsed.photo_areas[0].width).toBe(400);
  });

  it("treats NaN inside photo area fields as fallback (not as commit)", () => {
    const parsed = parseLayoutFromClipboard(
      JSON.stringify({
        _type: LAYOUT_CLIPBOARD_TYPE,
        name: "x",
        width: 100,
        height: 100,
        product_category_id: 1,
        photo_areas: [{ x: "oops", y: 5 }],
      })
    );
    expect(parsed.photo_areas[0].x).toBe(0);
    expect(parsed.photo_areas[0].y).toBe(5);
  });

  it("defaults missing optional fields", () => {
    const parsed = parseLayoutFromClipboard(
      JSON.stringify({
        _type: LAYOUT_CLIPBOARD_TYPE,
        name: "x",
        width: 100,
        height: 100,
        product_category_id: 1,
      })
    );
    expect(parsed.layout_key).toBe("");
    expect(parsed.description).toBe("");
    expect(parsed.is_active).toBe(true);
    expect(parsed.sort_order).toBe(0);
    expect(parsed.photo_areas).toEqual([]);
  });
});
