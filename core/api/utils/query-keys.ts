/**
 * Query Keys
 *
 * Centralized query key factory for React Query.
 * Ensures consistent cache invalidation across the app.
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys
 */

import type { AlertsParams } from "../alerts/types";
import type { BoothRevenueParams, RevenueDashboardParams } from "../analytics/types";
import type { CreditsHistoryParams } from "../credits/types";
import type { ReleasesParams } from "../releases/types";

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
		boothRevenue: (boothId: string, params?: Omit<BoothRevenueParams, 'booth_id'>) => ['analytics', 'booth', boothId, params] as const,
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

	// Payment queries
	payments: {
		all: () => ['payments'] as const,
		access: () => ['payments', 'access'] as const,
		subscription: () => ['payments', 'subscription'] as const,
		checkoutSession: (sessionId: string) => ['payments', 'checkout', sessionId] as const,
		// Per-booth subscription queries
		boothSubscriptions: () => ['payments', 'booths', 'subscriptions'] as const,
		boothSubscription: (boothId: string) => ['payments', 'booths', 'subscription', boothId] as const,
	},

	// Releases queries (public - GitHub releases)
	releases: {
		all: () => ['releases'] as const,
		list: (params?: ReleasesParams) => ['releases', 'list', params] as const,
		latest: () => ['releases', 'latest'] as const,
	},
} as const;
