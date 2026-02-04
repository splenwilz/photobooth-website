"use client";

import { useState, useEffect } from "react";
import type { AuthUser } from "@/core/api/auth/types";

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
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
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
