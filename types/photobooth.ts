/**
 * Photobooth App Types
 *
 * Application-level types (camelCase) used throughout the frontend.
 * These are transformed from API types (snake_case).
 */

/**
 * Alert severity levels
 */
export type AlertSeverity = "critical" | "warning" | "info";

/**
 * Alert categories
 */
export type AlertCategory = "hardware" | "supplies" | "network" | "revenue";

/**
 * Alert entity (app format - camelCase)
 */
export interface Alert {
	id: string;
	type: string;
	severity: AlertSeverity;
	category: AlertCategory;
	title: string;
	message: string;
	boothId: string;
	boothName: string;
	timestamp: string;
	isRead: boolean;
}
