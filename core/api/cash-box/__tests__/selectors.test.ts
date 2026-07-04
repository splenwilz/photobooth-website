import { describe, it, expect } from "vitest";
import {
  computeRefundGap,
  formatBillAmount,
  isCashBoxStale,
  resolveCollectorName,
} from "../selectors";
import type { CashBox } from "../types";

function cashBox(partial: Partial<CashBox>): CashBox {
  return {
    expected_total: 0,
    bill1_inserted: 0,
    bill2_inserted: 0,
    updated_at: null,
    last_collection: null,
    ...partial,
  };
}

describe("computeRefundGap", () => {
  it("returns the positive gross-minus-expected difference (refunds paid from till)", () => {
    expect(
      computeRefundGap(
        cashBox({ bill1_inserted: 20, bill2_inserted: 15, expected_total: 30 }),
      ),
    ).toBeCloseTo(5, 5);
  });

  it("returns 0 when gross equals expected (no refunds)", () => {
    expect(
      computeRefundGap(
        cashBox({ bill1_inserted: 20, bill2_inserted: 15, expected_total: 35 }),
      ),
    ).toBe(0);
  });

  it("clamps float noise to 0 (no phantom payout)", () => {
    // 0.1 + 0.2 - 0.3 === 5.55e-17 in IEEE-754
    expect(
      computeRefundGap(
        cashBox({ bill1_inserted: 0.1, bill2_inserted: 0.2, expected_total: 0.3 }),
      ),
    ).toBe(0);
  });

  it("never returns a negative gap", () => {
    expect(
      computeRefundGap(
        cashBox({ bill1_inserted: 5, bill2_inserted: 5, expected_total: 20 }),
      ),
    ).toBe(0);
  });

  it("returns 0 for non-finite fields (malformed payload, no phantom line)", () => {
    expect(
      computeRefundGap(
        cashBox({
          bill1_inserted: Number.POSITIVE_INFINITY,
          bill2_inserted: 0,
          expected_total: 0,
        }),
      ),
    ).toBe(0);
  });
});

describe("resolveCollectorName", () => {
  it("returns a real name", () => {
    expect(resolveCollectorName("Alice Operator")).toBe("Alice Operator");
  });

  it("falls back to Unknown for null / empty / whitespace (never renders 'null')", () => {
    expect(resolveCollectorName(null)).toBe("Unknown");
    expect(resolveCollectorName(undefined)).toBe("Unknown");
    expect(resolveCollectorName("   ")).toBe("Unknown");
  });
});

describe("formatBillAmount", () => {
  it("formats a real amount as currency", () => {
    expect(formatBillAmount(30)).toBe("$30.00");
    expect(formatBillAmount(0)).toBe("$0.00");
  });

  it("renders '—' (not $0.00) for null pre-tracking rows", () => {
    expect(formatBillAmount(null)).toBe("—");
    expect(formatBillAmount(undefined)).toBe("—");
  });
});

describe("isCashBoxStale", () => {
  const now = new Date("2026-07-04T12:00:00Z");

  it("is stale whenever the booth is offline (hard signal)", () => {
    expect(isCashBoxStale("2026-07-04T11:59:50Z", "offline", now)).toBe(true);
  });

  it("uses snapshot age (not status) for non-offline booths", () => {
    // A warning/error booth can still heartbeat: a fresh snapshot is NOT stale.
    expect(isCashBoxStale("2026-07-04T11:59:50Z", "error", now)).toBe(false);
    expect(isCashBoxStale("2026-07-04T11:59:50Z", "warning", now)).toBe(false);
  });

  it("is fresh when online and the snapshot is recent", () => {
    expect(isCashBoxStale("2026-07-04T11:59:50Z", "online", now)).toBe(false);
  });

  it("is stale when the snapshot is older than the window", () => {
    expect(isCashBoxStale("2026-07-04T11:50:00Z", "online", now)).toBe(true);
    expect(isCashBoxStale("2026-07-04T11:50:00Z", "warning", now)).toBe(true);
  });

  it("does not assert staleness when the snapshot time is missing/invalid", () => {
    expect(isCashBoxStale(null, "online", now)).toBe(false);
    expect(isCashBoxStale("nope", "online", now)).toBe(false);
  });
});
