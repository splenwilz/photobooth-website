"use client";

/**
 * useBodyScrollLock
 *
 * While at least one consumer is mounted, sets `document.body.style.overflow`
 * to `hidden` so the page behind a modal doesn't scroll. Uses a module-level
 * counter so nested modals stack: the body stays locked until the last
 * consumer unmounts, at which point the original overflow value is restored.
 *
 * Tests render outside the DOM-bearing path use `vi.mock` if needed; the
 * hook is a no-op without `document` (kept SSR-safe).
 */

import { useEffect } from "react";

let lockCount = 0;
let originalOverflow: string | null = null;

export function useBodyScrollLock(): void {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount++;
    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow ?? "";
        originalOverflow = null;
      }
    };
  }, []);
}
