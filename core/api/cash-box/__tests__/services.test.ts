import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getBoothCashCollections } from "../services";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Force client-side path in apiClient so it doesn't import next/headers (not
// available in the vitest node runtime). Mirrors core/api/users/__tests__.
const mockWindow = { location: { href: "" } };
const originalWindow = global.window;

function mockJson(body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => body,
  });
}

describe("getBoothCashCollections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8000";
    global.window = mockWindow as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("GETs the collections path with default limit/offset through the proxy", async () => {
    mockJson({ booth_id: "b1", booth_name: "X", collections: [], total: 0, limit: 50, offset: 0 });

    await getBoothCashCollections("b1");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe(
      "/api/proxy?path=" +
        encodeURIComponent("/api/v1/booths/b1/cash-collections?limit=50&offset=0"),
    );
    expect(options.method).toBe("GET");
  });

  it("passes through provided limit and offset", async () => {
    mockJson({ booth_id: "b1", booth_name: "X", collections: [], total: 0, limit: 20, offset: 40 });

    await getBoothCashCollections("b1", { limit: 20, offset: 40 });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe(
      "/api/proxy?path=" +
        encodeURIComponent("/api/v1/booths/b1/cash-collections?limit=20&offset=40"),
    );
  });

  it("returns the parsed response body", async () => {
    const body = {
      booth_id: "b1",
      booth_name: "Downtown",
      collections: [{ id: "c1", local_id: 12, total_amount: 42, bill1_amount: 30, bill2_amount: 12, collected_by_name: "Alice", note: null, collected_at: "2026-06-28T09:12:00Z", synced_at: "2026-06-28T09:12:31Z" }],
      total: 1,
      limit: 50,
      offset: 0,
    };
    mockJson(body);

    const result = await getBoothCashCollections("b1");
    expect(result).toEqual(body);
  });

  it("throws before fetching when boothId is empty", async () => {
    await expect(getBoothCashCollections("")).rejects.toThrow(
      "Booth ID is required",
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
