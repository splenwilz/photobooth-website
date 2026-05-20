"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Options {
	open: boolean;
	onClose: () => void;
}

/**
 * Focus management for modal dialogs.
 *
 * When `open` flips to true:
 *   - records the element that had focus (the opener) so we can restore it,
 *   - moves focus to the first focusable element inside the dialog,
 *   - traps Tab / Shift+Tab inside the dialog,
 *   - closes the dialog on Escape via `onClose`.
 *
 * When `open` flips back to false (or the component unmounts), focus
 * returns to the recorded opener if it's still in the DOM.
 *
 * Attach the returned ref to the dialog panel element.
 */
export function useDialogFocusTrap<T extends HTMLElement = HTMLDivElement>({
	open,
	onClose,
}: Options) {
	const containerRef = useRef<T | null>(null);
	// Keep onClose in a ref so we don't tear down the listener on every
	// parent re-render when the closure changes.
	const onCloseRef = useRef(onClose);
	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (!open) return;
		const container = containerRef.current;
		if (!container) return;
		const opener = document.activeElement as HTMLElement | null;

		const focusables = () =>
			Array.from(
				container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
			).filter(
				(el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
			);

		focusables()[0]?.focus();

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				onCloseRef.current();
				return;
			}
			if (e.key !== "Tab") return;
			const list = focusables();
			if (list.length === 0) {
				e.preventDefault();
				return;
			}
			const first = list[0];
			const last = list[list.length - 1];
			const active = document.activeElement as HTMLElement | null;
			// If focus is somehow outside the dialog (e.g. user clicked the
			// backdrop and Tab'd from <body>), pull it back in so it can't
			// escape past the modal.
			if (!active || !list.includes(active)) {
				e.preventDefault();
				(e.shiftKey ? last : first).focus();
				return;
			}
			if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("keydown", onKey);
			if (opener && document.contains(opener)) {
				opener.focus();
			}
		};
	}, [open]);

	return containerRef;
}
