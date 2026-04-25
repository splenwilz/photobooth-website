import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { refundBoothTransaction } from "../services";

// Mock fetch globally; force the apiClient client-side path so it doesn't
// try to import next/headers in the vitest node runtime.
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockWindow = { location: { href: "" } };
const originalWindow = global.window;

// Save original env values so teardown can restore them — otherwise
// `delete process.env.API_BASE_URL` in beforeEach would leak across files
// that share a vitest worker and happen to depend on the server-side URL.
const originalApiBase = process.env.API_BASE_URL;
const originalPublicApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

describe("refundBoothTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8000";
    global.window = mockWindow as unknown as Window & typeof globalThis;

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        transaction_code: "TX123",
        refunded_at: "2026-04-23T12:00:00Z",
        refunded_by_user_id: "user_1",
        refund_amount: 10,
        refund_method: "cash_till",
        refund_note: null,
      }),
    });
  });

  afterEach(() => {
    global.window = originalWindow;
    // Restore env to its original state so other test files aren't polluted
    if (originalApiBase === undefined) {
      delete process.env.API_BASE_URL;
    } else {
      process.env.API_BASE_URL = originalApiBase;
    }
    if (originalPublicApiBase === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = originalPublicApiBase;
    }
  });

  function getLastBody(): Record<string, unknown> {
    const [, options] = mockFetch.mock.calls[0];
    return JSON.parse(options.body as string);
  }

  it("sends the POST to the per-booth transaction refund URL", async () => {
    await refundBoothTransaction("b1", "TX123", {
      amount: 10,
      method: "cash_till",
    });
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe(
      "/api/proxy?path=" +
        encodeURIComponent("/api/v1/booths/b1/transactions/TX123/refund"),
    );
    expect(options.method).toBe("POST");
  });

  it("URL-encodes the transaction_code path segment", async () => {
    // Transaction codes like "TX/ABC 1" exist in the wild; the path must be encoded.
    await refundBoothTransaction("b1", "TX/ABC 1", {
      amount: 10,
      method: "cash_till",
    });
    const [url] = mockFetch.mock.calls[0];
    // The inner path segment gets encoded, and then the full path gets
    // encoded again by the client's proxy wrapper.
    const innerEncoded = "/api/v1/booths/b1/transactions/TX%2FABC%201/refund";
    expect(url).toBe("/api/proxy?path=" + encodeURIComponent(innerEncoded));
  });

  it("omits the note field when not provided", async () => {
    await refundBoothTransaction("b1", "TX123", {
      amount: 10,
      method: "cash_till",
    });
    const body = getLastBody();
    expect(body).toEqual({ amount: 10, method: "cash_till" });
    expect("note" in body).toBe(false);
  });

  it("omits the note field when passed as empty string", async () => {
    await refundBoothTransaction("b1", "TX123", {
      amount: 10,
      method: "cash_till",
      note: "",
    });
    expect("note" in getLastBody()).toBe(false);
  });

  it("omits whitespace-only notes (contract from app commit c794244)", async () => {
    // Boolean("   ") is truthy — a naive guard would let this leak through
    // and fail the backend's min-length validation.
    await refundBoothTransaction("b1", "TX123", {
      amount: 10,
      method: "cash_till",
      note: "   ",
    });
    expect("note" in getLastBody()).toBe(false);
  });

  it("trims surrounding whitespace on valid notes", async () => {
    await refundBoothTransaction("b1", "TX123", {
      amount: 10,
      method: "cash_till",
      note: "  receipt #9  ",
    });
    expect(getLastBody().note).toBe("receipt #9");
  });

  it("throws when boothId is empty", async () => {
    await expect(
      refundBoothTransaction("", "TX123", { amount: 10, method: "cash_till" }),
    ).rejects.toThrow(/Booth ID is required/);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("throws when transactionCode is empty", async () => {
    await expect(
      refundBoothTransaction("b1", "", { amount: 10, method: "cash_till" }),
    ).rejects.toThrow(/Transaction code is required/);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
