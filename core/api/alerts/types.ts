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
 * Alerts list response from API
 * GET /api/v1/analytics/alerts
 */
export interface AlertsResponse {
	alerts: Alert[];
}

/**
 * Query parameters for fetching alerts
 */
export interface AlertsParams {
	/** Filter by severity: critical, warning, info */
	severity?: AlertSeverity;
	/** Filter by category: hardware, supplies, network, revenue */
	category?: AlertCategory;
	/** Maximum alerts to return (default: 50, max: 200) */
	limit?: number;
}



