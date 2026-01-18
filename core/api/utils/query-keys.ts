/**
 * Query Keys
 *
 * Centralized query key factory for React Query.
 * Ensures consistent cache invalidation across the app.
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys
 */

import type { AlertsParams } from "../alerts/types";
import type { RevenueDashboardParams } from "../analytics/types";
import type { CreditsHistoryParams } from "../credits/types";

export const queryKeys = {
	// Booth-related queries
	booths: {
		all: () => ['booths'] as const,
		list: () => ['booths', 'list'] as const,
		detail: (boothId: string) => ['booths', 'detail', boothId] as const,
		pricing: (boothId: string) => ['booths', 'pricing', boothId] as const,
		credentials: (boothId: string) => ['booths', 'credentials', boothId] as const,
	},

	// Dashboard queries
	dashboard: {
		all: () => ['dashboard'] as const,
		overview: () => ['dashboard', 'overview'] as const,
	},

	// Analytics queries
	analytics: {
		all: () => ['analytics'] as const,
		dashboard: (params?: RevenueDashboardParams) => ['analytics', 'dashboard', params] as const,
		transactions: (pageSize: number) => ['analytics', 'transactions', pageSize] as const,
		boothRevenue: (boothId: string) => ['analytics', 'booth', boothId] as const,
	},

	// Alerts queries
	alerts: {
		all: () => ['alerts'] as const,
		list: (params?: AlertsParams) => ['alerts', 'list', params] as const,
	},

	// Credits queries
	credits: {
		all: () => ['credits'] as const,
		balance: (boothId: string) => ['credits', 'balance', boothId] as const,
		history: (boothId: string, params?: CreditsHistoryParams) => ['credits', 'history', boothId, params] as const,
	},

	// User-related queries (for admin)
	users: {
		all: () => ['users'] as const,
		list: () => ['users', 'list'] as const,
		detail: (userId: string) => ['users', 'detail', userId] as const,
	},

	// Subscription queries (for admin)
	subscriptions: {
		all: () => ['subscriptions'] as const,
		list: () => ['subscriptions', 'list'] as const,
		plans: () => ['subscriptions', 'plans'] as const,
		detail: (subscriptionId: string) => ['subscriptions', 'detail', subscriptionId] as const,
	},

	// Support tickets queries (for admin)
	tickets: {
		all: () => ['tickets'] as const,
		list: () => ['tickets', 'list'] as const,
		detail: (ticketId: string) => ['tickets', 'detail', ticketId] as const,
	},

	// Logs/audit queries (for admin)
	logs: {
		all: () => ['logs'] as const,
		list: () => ['logs', 'list'] as const,
	},

	// Revenue/analytics queries (for admin)
	revenue: {
		all: () => ['revenue'] as const,
		overview: () => ['revenue', 'overview'] as const,
		reports: () => ['revenue', 'reports'] as const,
	},

	// Settings queries (for admin)
	settings: {
		all: () => ['settings'] as const,
	},
} as const;
