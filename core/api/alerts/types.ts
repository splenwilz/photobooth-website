/**
 * Alerts API Types
 *
 * Types for alerts and notifications from the API.
 * @see GET /api/v1/analytics/alerts
 */

/**
 * Alert severity levels
 * Maps to UI severity indicators
 */
export type AlertSeverity = "critical" | "warning" | "info";

/**
 * Alert categories for filtering
 * - hardware: Camera, printer, system issues
 * - supplies: Paper, ink levels
 * - network: Connectivity issues
 * - revenue: Sales milestones, payment issues
 */
export type AlertCategory = "hardware" | "supplies" | "network" | "revenue";

/**
 * Alert entity from API
 */
export interface Alert {
	id: string;
	/** Alert type identifier (e.g., "printer_offline", "pcb_error") */
	type: string;
	severity: AlertSeverity;
	category: AlertCategory;
	title: string;
	message: string;
	booth_id: string;
	booth_name: string;
	timestamp: string;
	is_read: boolean;
}

/**
 * Alert summary counts by severity
 */
export interface AlertsSummary {
	critical: number;
	warning: number;
	info: number;
}

/**
 * Alerts list response from API
 * GET /api/v1/analytics/alerts
 * GET /api/v1/analytics/alerts/{booth_id}
 */
export interface AlertsResponse {
	summary: AlertsSummary;
	alerts: Alert[];
	/** Total count after filtering (before limit) */
	total: number;
	/** Number of alerts returned (after limit) */
	returned: number;
}

/**
 * Query parameters for fetching alerts
 */
export interface AlertsParams {
	/** Filter by severity: critical, warning, info */
	severity?: AlertSeverity;
	/** Filter by category: hardware, supplies, network, revenue */
	category?: AlertCategory;
	/** Maximum alerts to return (default: 50, max: 100) */
	limit?: number;
}

/**
 * Query parameters for fetching booth-specific alerts
 */
export interface BoothAlertsParams extends AlertsParams {
	/** Booth ID (path parameter) */
	booth_id: string;
}
