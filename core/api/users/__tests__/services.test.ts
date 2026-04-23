import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateBusinessName } from "../services";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Force client-side path in apiClient so it doesn't try to import next/headers
// (which isn't available in the vitest node runtime). Mirrors the pattern in
// core/api/__tests__/client.test.ts.
const mockWindow = { location: { href: "" } };
const originalWindow = global.window;

describe("updateBusinessName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8000";
    global.window = mockWindow as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("sends PATCH with business_name only", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "u1", business_name: "Acme" }),
    });

    await updateBusinessName("u1", { business_name: "Acme" });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    // Client-side routes through the proxy with URL-encoded path
    expect(url).toBe("/api/proxy?path=" + encodeURIComponent("/api/v1/users/u1"));
    expect(options.method).toBe("PATCH");
    expect(JSON.parse(options.body as string)).toEqual({
      business_name: "Acme",
    });
  });

  it("sends PATCH with use_display_name_on_booths only", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "u1", use_display_name_on_booths: true }),
    });

    await updateBusinessName("u1", { use_display_name_on_booths: true });

    const [, options] = mockFetch.mock.calls[0];
    expect(JSON.parse(options.body as string)).toEqual({
      use_display_name_on_booths: true,
    });
  });

  it("sends PATCH with business_name: null to clear the field", async () => {
    // Locks in the contract: operators must be able to clear business_name
    // by sending an explicit null in the payload (not an empty string).
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "u1", business_name: null }),
    });

    await updateBusinessName("u1", { business_name: null });

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body as string);
    expect(body).toEqual({ business_name: null });
    // Explicit: null must survive serialization, not be dropped
    expect("business_name" in body).toBe(true);
    expect(body.business_name).toBeNull();
  });

  it("sends PATCH with both business_name and toggle together", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "u1" }),
    });

    await updateBusinessName("u1", {
      business_name: "Acme",
      use_display_name_on_booths: true,
    });

    const [, options] = mockFetch.mock.calls[0];
    expect(JSON.parse(options.body as string)).toEqual({
      business_name: "Acme",
      use_display_name_on_booths: true,
    });
  });
});
