/**
 * Shared display formatters.
 *
 * Intl instances are hoisted to module scope and constructed once. Per MDN,
 * building an Intl formatter is comparatively expensive and a single instance
 * can be reused across many `format()` calls, so a data-heavy table should
 * share one formatter rather than `new Intl.*` per value.
 *
 * Timestamp inputs are ISO 8601 UTC strings (`…Z`) from the API and are
 * rendered in the viewer's local timezone.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */

/** Shown for missing / invalid values. */
export const PLACEHOLDER = "—"; // em dash

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Explicit component options (not dateStyle/timeStyle) because `timeZoneName`
// cannot be combined with the *Style shorthands — doing so throws
// "Invalid option" at construction.
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

/**
 * Format a whole-dollar amount as USD (e.g. `35` → `"$35.00"`). The API sends
 * dollars, not cents, so no `/100` conversion is applied. Non-finite input
 * (NaN/Infinity) yields the placeholder rather than `"$NaN"`.
 */
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return PLACEHOLDER;
  return currencyFormatter.format(amount);
}

/** Parse an ISO string into a valid Date, or null when missing/unparseable. */
export function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Absolute local date + time with a timezone abbreviation
 * (e.g. `"Jul 4, 2026, 2:35 PM GMT+1"`). Returns the placeholder when the
 * timestamp is null/invalid.
 */
export function formatDateTime(iso: string | null | undefined): string {
  const d = parseDate(iso);
  return d ? dateTimeFormatter.format(d) : PLACEHOLDER;
}

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

/**
 * Relative time from now (e.g. `"2 hours ago"`, `"yesterday"`). Returns the
 * placeholder when null/invalid. `now` is injectable for deterministic tests.
 */
export function formatRelativeTime(
  iso: string | null | undefined,
  now: Date = new Date(),
): string {
  const d = parseDate(iso);
  if (!d) return PLACEHOLDER;
  let duration = (d.getTime() - now.getTime()) / 1000; // seconds; negative = past
  // Clamp small future skew (booth clock slightly ahead of the viewer) to
  // "now" rather than rendering "in 12 seconds". Genuine future times beyond a
  // minute still format normally so the helper stays reusable.
  if (duration > 0 && duration < 60) duration = 0;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return PLACEHOLDER;
}
