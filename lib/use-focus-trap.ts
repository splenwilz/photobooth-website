"use client";

/**
 * useFocusTrap
 *
 * Constrains keyboard focus inside the element pointed to by `ref` while the
 * hook is active. On Tab from the last focusable, focus wraps to the first;
 * Shift+Tab from the first wraps to the last. The trap is registered as a
 * keydown listener on the container so it doesn't interfere with other
 * keystrokes (Escape, etc.) handled elsewhere.
 *
 * Pairs with `aria-modal="true"` to make the modality contract real for
 * keyboard users — without this, Tab walks straight into the page underneath.
 *
 * The focusable set is recomputed on each Tab so dynamic content (e.g. a
 * disabled button becoming enabled mid-modal) is handled correctly.
 */

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable]:not([contenteditable='false'])",
].join(",");

export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T | null>,
): void {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        // querySelectorAll doesn't filter visibility. Use getClientRects:
        // returns 0 rects for `display: none` (correctly excluded) but a
        // non-empty list for visible elements including `position: fixed`,
        // which has a null `offsetParent` and would be wrongly dropped by
        // an offsetParent-based check.
        (el) =>
          el === document.activeElement || el.getClientRects().length > 0,
      );

      if (focusables.length === 0) {
        // No focusable inside the container: keep focus on the container
        // itself (assumed to be focusable via tabindex="-1") so Tab is
        // a no-op inside the modal.
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !container.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !container.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [ref]);
}
