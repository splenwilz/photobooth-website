import { describe, it, expect } from "vitest";
import { normalizeAuthUser } from "../use-user";

/**
 * Regression tests for backward-compat: existing cookies set before the
 * business-settings fields existed must normalize cleanly so downstream
 * code can treat `use_display_name_on_booths` as a concrete boolean.
 */

const BASE_COOKIE_SHAPE = {
  object: "user",
  id: "u1",
  email: "jane@example.com",
  first_name: "Jane",
  last_name: "Doe",
  email_verified: true,
  profile_picture_url: "",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("normalizeAuthUser", () => {
  it("defaults use_display_name_on_booths to false when missing", () => {
    // Simulates a user whose auth_user cookie was written before the field existed
    const result = normalizeAuthUser(BASE_COOKIE_SHAPE);
    expect(result.use_display_name_on_booths).toBe(false);
  });

  it("preserves use_display_name_on_booths when it is true", () => {
    const result = normalizeAuthUser({
      ...BASE_COOKIE_SHAPE,
      use_display_name_on_booths: true,
    });
    expect(result.use_display_name_on_booths).toBe(true);
  });

  it("preserves use_display_name_on_booths when it is false", () => {
    const result = normalizeAuthUser({
      ...BASE_COOKIE_SHAPE,
      use_display_name_on_booths: false,
    });
    expect(result.use_display_name_on_booths).toBe(false);
  });

  it("coerces non-boolean values to false", () => {
    // Defensive: if the cookie somehow contains null/undefined/string,
    // downstream code should still see a concrete boolean.
    const result = normalizeAuthUser({
      ...BASE_COOKIE_SHAPE,
      use_display_name_on_booths: null as unknown as boolean,
    });
    expect(result.use_display_name_on_booths).toBe(false);
  });

  it("leaves other fields untouched", () => {
    const result = normalizeAuthUser(BASE_COOKIE_SHAPE);
    expect(result.email).toBe("jane@example.com");
    expect(result.first_name).toBe("Jane");
    expect(result.id).toBe("u1");
  });
});
