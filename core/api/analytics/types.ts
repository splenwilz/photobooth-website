/**
 * Analytics API Types
 *
 * Types for revenue dashboard and analytics data.
 * @see GET /api/v1/analytics/revenue/dashboard
 */

/**
 * Revenue statistics for a time period
 */
export interface RevenuePeriodStats {
	amount: number;
	transactions: number;
	/** Percentage change vs previous period */
	change: number;
}

/**
 * Revenue stats across all time periods
 */
export interface RevenueStats {
	today: RevenuePeriodStats;
	week: RevenuePeriodStats;
	month: RevenuePeriodStats;
	year: RevenuePeriodStats;
}

/**
 * Revenue breakdown by category (product or payment method)
 */
export interface RevenueBreakdownItem {
	name: string;
	value: number;
	percentage: number;
}

/**
 * Chart data point for daily/monthly charts
 */
export interface ChartDataPoint {
	date: string;
	amount: number;
}

/**
 * Transaction in the recent transactions list
 */
export interface RecentTransaction {
	id: string;
	booth_id: string;
	booth_name: string;
	timestamp: string;
	product: string;
	template: string;
	copies: number;
	amount: number;
	payment_method: string;
	payment_status: "pending" | "completed" | "failed";
	print_status: "pending" | "completed" | "failed";
}

/**
 * Pagination info returned by API
 */
export interface PaginationInfo {
	total: number;
	limit: number;
	offset: number;
	has_more: boolean;
}

/**
 * Recent transactions with pagination
 */
export interface RecentTransactionsResponse {
	data: RecentTransaction[];
	pagination: PaginationInfo;
}

/**
 * Complete revenue dashboard response
 * GET /api/v1/analytics/revenue/dashboard
 */
export interface RevenueDashboardResponse {
	stats: RevenueStats;
	by_product: RevenueBreakdownItem[];
	by_payment: RevenueBreakdownItem[];
	daily_chart: ChartDataPoint[];
	monthly_chart: ChartDataPoint[];
	recent_transactions: RecentTransactionsResponse;
}

/**
 * Query parameters for revenue dashboard
 */
export interface RevenueDashboardParams {
	/** Number of recent transactions to return (default: 10) */
	recent_limit?: number;
	/** Offset for pagination (default: 0) */
	recent_offset?: number;
}

// ============================================
// Individual Booth Analytics Types
// GET /api/v1/analytics/revenue/{booth_id}
// ============================================

/**
 * Revenue analytics for a single booth
 * GET /api/v1/analytics/revenue/{booth_id}
 */
export interface BoothRevenueResponse {
	booth_id: string;
	booth_name: string;
	stats: RevenueStats;
	by_product: RevenueBreakdownItem[];
	by_payment: RevenueBreakdownItem[];
	daily_chart: ChartDataPoint[];
	monthly_chart: ChartDataPoint[];
	recent_transactions: RecentTransactionsResponse;
}

/**
 * Query parameters for booth revenue
 */
export interface BoothRevenueParams {
	/** Booth ID to fetch analytics for */
	booth_id: string;
	/** Number of recent transactions to return (default: 10) */
	recent_limit?: number;
	/** Offset for pagination (default: 0) */
	recent_offset?: number;
}

