"use client";

import { useState, useEffect } from "react";
import type { AuthUser } from "@/core/api/auth/types";

/**
 * Back-compat: cookies set before business-settings fields existed can lack
 * use_display_name_on_booths. Normalize to `false` so downstream code can
 * treat it as a concrete boolean instead of undefined.
 */
export function normalizeAuthUser(raw: Record<string, unknown>): AuthUser {
  return {
    ...(raw as unknown as AuthUser),
    use_display_name_on_booths:
      typeof raw.use_display_name_on_booths === "boolean"
        ? raw.use_display_name_on_booths
        : false,
  };
}

/**
 * Get user from auth_user cookie (client-side)
 */
function getUserFromCookie(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_user="));
    if (!cookie) return null;
    return normalizeAuthUser(JSON.parse(decodeURIComponent(cookie.split("=")[1])));
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated (has auth cookie)
 * Note: We check for auth_user cookie since auth_access_token is httpOnly
 * and cannot be read by JavaScript
 */
function isAuthenticatedFromCookie(): boolean {
  if (typeof window === "undefined") return false;
  // auth_user cookie is set alongside auth_access_token but is not httpOnly
  return document.cookie.includes("auth_user=");
}

/**
 * Hook to get current user from auth cookies
 *
 * @returns Object containing user data and authentication state
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, isLoading } = useUser();
 *
 * if (isLoading) return <Loading />;
 * if (!isAuthenticated) return <LoginPrompt />;
 * return <Dashboard user={user} />;
 * ```
 */
export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read cookie on mount
    setUser(getUserFromCookie());
    setIsAuthenticated(isAuthenticatedFromCookie());
    setIsLoading(false);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
