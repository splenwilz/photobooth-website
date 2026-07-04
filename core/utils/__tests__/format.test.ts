import { describe, it, expect } from "vitest";
import {
  PLACEHOLDER,
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
  parseDate,
} from "../format";

describe("parseDate", () => {
  it("returns a Date for a valid ISO string", () => {
    const d = parseDate("2026-07-04T12:00:00Z");
    expect(d).toBeInstanceOf(Date);
    expect(d?.getTime()).toBe(Date.parse("2026-07-04T12:00:00Z"));
  });

  it("returns null for missing/unparseable input", () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
    expect(parseDate("")).toBeNull();
    expect(parseDate("not-a-date")).toBeNull();
  });
});

describe("formatCurrency", () => {
  it("formats whole dollars with two fraction digits", () => {
    expect(formatCurrency(35)).toBe("$35.00");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("does NOT divide by 100 (API sends dollars, not cents)", () => {
    expect(formatCurrency(42)).toBe("$42.00");
  });

  it("returns the placeholder for non-finite input instead of '$NaN'", () => {
    expect(formatCurrency(Number.NaN)).toBe(PLACEHOLDER);
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe(PLACEHOLDER);
  });
});

describe("formatDateTime", () => {
  it("returns the placeholder for null/undefined/invalid", () => {
    expect(formatDateTime(null)).toBe(PLACEHOLDER);
    expect(formatDateTime(undefined)).toBe(PLACEHOLDER);
    expect(formatDateTime("")).toBe(PLACEHOLDER);
    expect(formatDateTime("not-a-date")).toBe(PLACEHOLDER);
  });

  it("renders a real timestamp as a non-placeholder string", () => {
    // Timezone-dependent output, so assert it produced *something* real rather
    // than a specific locale string.
    const out = formatDateTime("2026-07-04T14:35:12Z");
    expect(out).not.toBe(PLACEHOLDER);
    expect(out.length).toBeGreaterThan(0);
    expect(out).toMatch(/2026/);
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-07-04T12:00:00Z");

  it("returns the placeholder for null/invalid", () => {
    expect(formatRelativeTime(null, now)).toBe(PLACEHOLDER);
    expect(formatRelativeTime("nope", now)).toBe(PLACEHOLDER);
  });

  it("formats recent past times", () => {
    expect(formatRelativeTime("2026-07-04T11:58:00Z", now)).toBe(
      "2 minutes ago",
    );
    expect(formatRelativeTime("2026-07-04T10:00:00Z", now)).toBe("2 hours ago");
  });

  it("uses natural phrasing for day boundaries (numeric: auto)", () => {
    expect(formatRelativeTime("2026-07-03T12:00:00Z", now)).toBe("yesterday");
  });

  it("clamps small future clock-skew to 'now'", () => {
    // Booth clock ~30s ahead of the viewer → "now", not "in 30 seconds".
    expect(formatRelativeTime("2026-07-04T12:00:30Z", now)).toBe("now");
  });

  it("still formats genuine future times beyond the skew window", () => {
    expect(formatRelativeTime("2026-07-04T12:05:00Z", now)).toBe(
      "in 5 minutes",
    );
  });
});
