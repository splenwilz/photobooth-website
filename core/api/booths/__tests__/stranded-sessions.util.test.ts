import { describe, expect, it } from "vitest";
import {
  formatCriticalEventTag,
  formatStrandedReason,
  inferRefundMethod,
  isRowUnrefunded,
  joinCriticalEventsWithTransactions,
} from "../stranded-sessions-util";
import type {
  BoothCriticalEvent,
  SyncedTransaction,
} from "../types";

function makeEvent(overrides: Partial<BoothCriticalEvent> = {}): BoothCriticalEvent {
  return {
    id: 1,
    tag: "STRANDED_PAID_SESSION",
    details: "",
    transaction_code: "TX1",
    occurred_at: "2026-04-23T12:00:00Z",
    received_at: "2026-04-23T12:00:01Z",
    transaction_total_price: 10,
    refund: null,
    ...overrides,
  };
}

function makeTx(overrides: Partial<SyncedTransaction> = {}): SyncedTransaction {
  return {
    id: "t1",
    local_id: 1,
    transaction_code: "TX1",
    product_type: "strips",
    template_name: null,
    quantity: 1,
    base_price: 10,
    total_price: 10,
    payment_method: "cash",
    payment_status: "completed",
    local_created_at: "2026-04-23T12:00:00Z",
    synced_at: "2026-04-23T12:00:01Z",
    stranded_at: "2026-04-23T12:00:02Z",
    stranded_reason: "payment_completion_handler_exception",
    refunded_at: null,
    refunded_by_user_id: null,
    refund_amount: null,
    refund_method: null,
    refund_note: null,
    ...overrides,
  };
}

describe("joinCriticalEventsWithTransactions", () => {
  it("matches events to transactions by transaction_code", () => {
    const event = makeEvent({ transaction_code: "TX1" });
    const tx = makeTx({ transaction_code: "TX1" });
    const rows = joinCriticalEventsWithTransactions([event], [tx]);
    expect(rows).toHaveLength(1);
    expect(rows[0].transaction).toBe(tx);
  });

  it("returns null transaction when no code match", () => {
    const event = makeEvent({ transaction_code: "NONEXIST" });
    const tx = makeTx({ transaction_code: "TX1" });
    const rows = joinCriticalEventsWithTransactions([event], [tx]);
    expect(rows[0].transaction).toBeNull();
  });

  it("dedupes on (tag, occurred_at, transaction_code)", () => {
    // At-least-once delivery can produce duplicate events.
    const dup1 = makeEvent({ id: 1 });
    const dup2 = makeEvent({ id: 2 }); // same tag/occurred_at/code
    const rows = joinCriticalEventsWithTransactions([dup1, dup2], []);
    expect(rows).toHaveLength(1);
    expect(rows[0].event.id).toBe(1); // first occurrence wins
  });

  it("keeps distinct null-code events distinct via event.id fold-in", () => {
    const e1 = makeEvent({ id: 1, transaction_code: null });
    const e2 = makeEvent({ id: 2, transaction_code: null });
    const rows = joinCriticalEventsWithTransactions([e1, e2], []);
    expect(rows).toHaveLength(2);
  });

  it("folds null code into dedupe key so null-code duplicates still collapse", () => {
    // Same event.id + null code = same dedupe key.
    const e1 = makeEvent({ id: 1, transaction_code: null });
    const e2 = makeEvent({ id: 1, transaction_code: null });
    const rows = joinCriticalEventsWithTransactions([e1, e2], []);
    expect(rows).toHaveLength(1);
  });

  it("preserves API ordering (first-seen wins)", () => {
    const a = makeEvent({ id: 1, occurred_at: "2026-04-23T12:00:00Z", transaction_code: "A" });
    const b = makeEvent({ id: 2, occurred_at: "2026-04-23T11:00:00Z", transaction_code: "B" });
    const rows = joinCriticalEventsWithTransactions([a, b], []);
    expect(rows.map((r) => r.event.transaction_code)).toEqual(["A", "B"]);
  });
});

describe("isRowUnrefunded", () => {
  it("returns true when both sources show no refund", () => {
    const row = {
      event: makeEvent({ refund: null }),
      transaction: makeTx({ refunded_at: null }),
    };
    expect(isRowUnrefunded(row)).toBe(true);
  });

  it("returns false when event.refund is present", () => {
    const row = {
      event: makeEvent({
        refund: {
          refunded_at: "2026-04-23T12:00:00Z",
          refunded_by_user_id: "u1",
          refund_amount: 10,
          refund_method: "cash_till",
        },
      }),
      transaction: makeTx({ refunded_at: null }),
    };
    expect(isRowUnrefunded(row)).toBe(false);
  });

  it("returns false when transaction.refunded_at is present (event hasn't caught up)", () => {
    // This is the race-window close: the transaction query has refetched
    // but the criticalEvents query hasn't, so event.refund is still null
    // but the transaction knows about the refund.
    const row = {
      event: makeEvent({ refund: null }),
      transaction: makeTx({ refunded_at: "2026-04-23T12:00:00Z" }),
    };
    expect(isRowUnrefunded(row)).toBe(false);
  });

  it("treats null transaction as unrefunded-compatible (event.refund is authoritative)", () => {
    const row = { event: makeEvent({ refund: null }), transaction: null };
    expect(isRowUnrefunded(row)).toBe(true);
  });
});

describe("formatStrandedReason", () => {
  it("maps known reasons to friendly labels", () => {
    expect(formatStrandedReason("payment_completion_handler_exception")).toBe(
      "Payment completion failed",
    );
    expect(formatStrandedReason("thank_you_navigation_failure")).toBe(
      "Thank-you screen failed",
    );
  });

  it("falls back to title-cased form for unknown reasons", () => {
    expect(formatStrandedReason("some_new_reason")).toBe("Some new reason");
  });

  it("returns fallback for null/undefined", () => {
    expect(formatStrandedReason(null)).toBe("Unknown reason");
    expect(formatStrandedReason(undefined)).toBe("Unknown reason");
  });
});

describe("formatCriticalEventTag", () => {
  it("maps known tags", () => {
    expect(formatCriticalEventTag("STRANDED_PAID_SESSION")).toBe("Stranded");
    expect(formatCriticalEventTag("PAYMENT_RESULT_INVALID")).toBe("Bad Payment");
  });

  it("falls back to Title Case for unknowns", () => {
    expect(formatCriticalEventTag("FUTURE_CLOUD_TAG")).toBe("Future Cloud Tag");
  });
});

describe("inferRefundMethod", () => {
  it("maps cash to cash_till", () => {
    expect(inferRefundMethod("cash")).toBe("cash_till");
  });

  it("maps credit and card to card_void", () => {
    expect(inferRefundMethod("credit")).toBe("card_void");
    expect(inferRefundMethod("card")).toBe("card_void");
    expect(inferRefundMethod("CARD")).toBe("card_void"); // case-insensitive
  });

  it("handles multi-word payment methods via substring match", () => {
    // Backend may emit "Credit Card" or "Debit Card" rather than "credit"/"card".
    // Strict equality would miss these and pre-select "Other" as the refund
    // method, which would confuse operators.
    expect(inferRefundMethod("Credit Card")).toBe("card_void");
    expect(inferRefundMethod("Debit Card")).toBe("card_void");
    expect(inferRefundMethod("Cash Register")).toBe("cash_till");
  });

  it("falls through to other for unknown or missing methods", () => {
    expect(inferRefundMethod("manual")).toBe("other");
    expect(inferRefundMethod(null)).toBe("other");
    expect(inferRefundMethod(undefined)).toBe("other");
  });
});
