/**
 * Stranded Paid Sessions Utilities
 *
 * Pure helpers for joining and formatting the data powering the
 * "needs attention" screens. Port of photobooth-app/utils/stranded-sessions.ts.
 */

import type {
	BoothCriticalEvent,
	CriticalEventTag,
	StrandedReason,
	SyncedTransaction,
} from "./types";

/**
 * A critical event paired with its matching booth transaction (if any).
 * `transaction` is null when the event's `transaction_code` does not yet
 * match any synced transaction (first sync arrived before the booth re-synced
 * the stranded marker).
 */
export interface StrandedSessionRow {
	event: BoothCriticalEvent;
	transaction: SyncedTransaction | null;
}

/**
 * Join critical events with their matching transactions by `transaction_code`,
 * de-duplicating events on `(tag, occurred_at, transaction_code)` per the API
 * docs (critical events use at-least-once delivery).
 *
 * Preserves API ordering (newest `occurred_at` first — first occurrence of a
 * duplicate wins). When `transaction_code` is null, `event.id` is folded into
 * the dedupe key so distinct null-code events stay distinct.
 */
export function joinCriticalEventsWithTransactions(
	events: BoothCriticalEvent[],
	transactions: SyncedTransaction[],
): StrandedSessionRow[] {
	const byCode = new Map<string, SyncedTransaction>();
	for (const tx of transactions) {
		byCode.set(tx.transaction_code, tx);
	}

	const seen = new Set<string>();
	const rows: StrandedSessionRow[] = [];
	for (const event of events) {
		const codePart = event.transaction_code ?? `null:${event.id}`;
		const dedupeKey = `${event.tag}::${event.occurred_at}::${codePart}`;
		if (seen.has(dedupeKey)) continue;
		seen.add(dedupeKey);

		const transaction = event.transaction_code
			? (byCode.get(event.transaction_code) ?? null)
			: null;
		rows.push({ event, transaction });
	}
	return rows;
}

/**
 * A row is unrefunded when BOTH sources agree there's no refund:
 *   - the server-joined `event.refund` is null
 *   - the transaction's `refunded_at` is null (or transaction isn't joined yet)
 *
 * Reading both sources closes the race window where one query has refetched
 * but the other hasn't, which would otherwise let the UI offer the Refund
 * button on a transaction the server already refunded (409 on submit).
 */
export function isRowUnrefunded(row: StrandedSessionRow): boolean {
	return row.event.refund === null && !row.transaction?.refunded_at;
}

const KNOWN_STRANDED_REASONS: Record<string, string> = {
	payment_completion_handler_exception: "Payment completion failed",
	thank_you_navigation_failure: "Thank-you screen failed",
	print_thank_you_navigation_failure: "Post-print navigation failed",
	extra_prints_completion_failure: "Extra prints failed",
};

const KNOWN_EVENT_TAGS: Record<string, string> = {
	STRANDED_PAID_SESSION: "Stranded",
	PAYMENT_RESULT_INVALID: "Bad Payment",
};

/**
 * Short, badge-friendly label for a critical event tag. Falls back to a
 * Title Cased form for unknown tags so newly introduced cloud tags remain
 * readable without a frontend release.
 */
export function formatCriticalEventTag(tag: CriticalEventTag): string {
	if (tag in KNOWN_EVENT_TAGS) return KNOWN_EVENT_TAGS[tag];
	return tag
		.toLowerCase()
		.split("_")
		.map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
		.join(" ");
}

/**
 * Human-readable label for a stranded-reason tag. Falls back to a
 * title-cased version so new reasons introduced by the cloud stay readable.
 */
export function formatStrandedReason(
	reason: StrandedReason | null | undefined,
): string {
	if (!reason) return "Unknown reason";
	if (reason in KNOWN_STRANDED_REASONS) {
		return KNOWN_STRANDED_REASONS[reason];
	}
	const words = reason.split("_");
	const head = words[0].charAt(0).toUpperCase() + words[0].slice(1);
	const tail = words.length > 1 ? " " + words.slice(1).join(" ") : "";
	return head + tail;
}

/**
 * Default refund method inferred from the transaction's payment method.
 * Mirrors mobile behavior so an operator's choice is pre-filled sensibly.
 */
export function inferRefundMethod(
	paymentMethod: string | null | undefined,
): "cash_till" | "card_void" | "other" {
	const pm = (paymentMethod ?? "").toLowerCase();
	if (pm === "cash") return "cash_till";
	if (pm === "credit" || pm === "card") return "card_void";
	return "other";
}
