/**
 * Query Keys
 *
 * Centralized query key factory for React Query.
 * Ensures consistent cache invalidation across the app.
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys
 */

import type { AdminTransactionsQueryParams } from "../admin/billing/types";
import type { AdminBoothsQueryParams } from "../admin/booths/types";
import type { AdminTicketsQueryParams } from "../admin/tickets/types";
import type { AdminUsersQueryParams } from "../admin/users/types";
import type { AlertsParams } from "../alerts/types";
import type { BoothRevenueParams, RevenueDashboardParams } from "../analytics/types";
import type { CreditsHistoryParams } from "../credits/types";
import type { NotificationHistoryParams } from "../notifications/types";
import type { ReleasesParams } from "../releases/types";
import type { TicketsQueryParams } from "../tickets/types";

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

	// Notification preferences & history queries
	notifications: {
		all: () => ['notifications'] as const,
		preferences: () => ['notifications', 'preferences'] as const,
		history: (params?: NotificationHistoryParams) => ['notifications', 'history', params] as const,
	},

	// Credits queries
	credits: {
		all: () => ['credits'] as const,
		balance: (boothId: string) => ['credits', 'balance', boothId] as const,
		history: (boothId: string, params?: CreditsHistoryParams) => ['credits', 'history', boothId, params] as const,
	},

	// User-related queries (for admin)
	users: {
		all: () => ['admin-users'] as const,
		lists: () => ['admin-users', 'list'] as const,
		list: (params?: AdminUsersQueryParams) => ['admin-users', 'list', params] as const,
		details: () => ['admin-users', 'detail'] as const,
		detail: (userId: string) => ['admin-users', 'detail', userId] as const,
	},

	// Billing queries (for admin)
	billing: {
		all: () => ['admin-billing'] as const,
		overview: () => ['admin-billing', 'overview'] as const,
		transactions: (params?: AdminTransactionsQueryParams) => ['admin-billing', 'transactions', params] as const,
		issues: () => ['admin-billing', 'issues'] as const,
	},

	// Admin tickets queries
	adminTickets: {
		all: () => ['admin-tickets'] as const,
		lists: () => ['admin-tickets', 'list'] as const,
		list: (params?: AdminTicketsQueryParams) => ['admin-tickets', 'list', params] as const,
		details: () => ['admin-tickets', 'detail'] as const,
		detail: (ticketId: number) => ['admin-tickets', 'detail', ticketId] as const,
	},

	// Admin booths queries
	adminBooths: {
		all: () => ['admin-booths'] as const,
		lists: () => ['admin-booths', 'list'] as const,
		list: (params?: AdminBoothsQueryParams) => ['admin-booths', 'list', params] as const,
	},

	// Subscription queries (for admin)
	subscriptions: {
		all: () => ['subscriptions'] as const,
		list: () => ['subscriptions', 'list'] as const,
		plans: () => ['subscriptions', 'plans'] as const,
		detail: (subscriptionId: string) => ['subscriptions', 'detail', subscriptionId] as const,
	},

	// Support tickets queries (for user dashboard)
	tickets: {
		all: () => ['tickets'] as const,
		lists: () => ['tickets', 'list'] as const,
		list: (params?: TicketsQueryParams) => ['tickets', 'list', params] as const,
		details: () => ['tickets', 'detail'] as const,
		detail: (ticketId: number) => ['tickets', 'detail', ticketId] as const,
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
