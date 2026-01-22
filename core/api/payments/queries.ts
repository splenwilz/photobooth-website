/**
 * Payment React Query Hooks
 *
 * React Query hooks for payment-related operations.
 * Includes checkout, subscription management, and access checking.
 *
 * @see https://tanstack.com/query/latest/docs/react/overview
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import {
  cancelSubscription,
  checkSubscriptionAccess,
  createPortalSession,
  createProductCheckout,
  createProductsCheckout,
  createSubscriptionCheckout,
  getCheckoutSession,
  getSubscriptionInfo,
} from "./services";
import type {
  CancelSubscriptionParams,
  CancelSubscriptionResponse,
  CheckoutResponse,
  CheckoutSessionResponse,
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,
  CreateProductCheckoutRequest,
  CreateProductsCheckoutRequest,
  CreateSubscriptionCheckoutRequest,
  SubscriptionAccessResponse,
  SubscriptionInfoResponse,
} from "./types";

// ============================================================================
// CHECKOUT HOOKS
// ============================================================================

/**
 * Hook to create a subscription checkout session
 * Returns mutation for initiating subscription checkout flow
 *
 * @returns React Query mutation for subscription checkout
 *
 * @example
 * ```tsx
 * const { mutate: checkout, isPending } = useSubscriptionCheckout();
 *
 * const handleSubscribe = () => {
 *   checkout({
 *     price_id: 'price_pro_monthly_xxx',
 *     success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
 *     cancel_url: `${window.location.origin}/pricing`,
 *     trial_period_days: 14,
 *   }, {
 *     onSuccess: ({ checkout_url }) => {
 *       window.location.href = checkout_url;
 *     },
 *   });
 * };
 * ```
 */
export function useSubscriptionCheckout() {
  return useMutation<CheckoutResponse, Error, CreateSubscriptionCheckoutRequest>({
    mutationFn: (data) => createSubscriptionCheckout(data),
  });
}

/**
 * Hook to create a single product checkout session
 * Used for one-time purchases like hardware packages
 *
 * @returns React Query mutation for product checkout
 *
 * @example
 * ```tsx
 * const { mutate: checkout, isPending } = useProductCheckout();
 *
 * const handleBuyHardware = () => {
 *   checkout({
 *     price_id: 'price_booth_professional_xxx',
 *     success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
 *     cancel_url: `${window.location.origin}/pricing`,
 *     metadata: { package: 'professional' },
 *   }, {
 *     onSuccess: ({ checkout_url }) => {
 *       window.location.href = checkout_url;
 *     },
 *   });
 * };
 * ```
 */
export function useProductCheckout() {
  return useMutation<CheckoutResponse, Error, CreateProductCheckoutRequest>({
    mutationFn: (data) => createProductCheckout(data),
  });
}

/**
 * Hook to create a multi-product checkout session (cart checkout)
 * Used for purchasing multiple items like templates
 *
 * @returns React Query mutation for products checkout
 *
 * @example
 * ```tsx
 * const { mutate: checkout, isPending } = useProductsCheckout();
 *
 * const handleCartCheckout = () => {
 *   checkout({
 *     items: [
 *       { price_id: 'price_template_heart_trio', quantity: 1 },
 *       { price_id: 'price_template_classic_quad', quantity: 1 },
 *     ],
 *     success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
 *     cancel_url: `${window.location.origin}/templates`,
 *   }, {
 *     onSuccess: ({ checkout_url }) => {
 *       window.location.href = checkout_url;
 *     },
 *   });
 * };
 * ```
 */
export function useProductsCheckout() {
  return useMutation<CheckoutResponse, Error, CreateProductsCheckoutRequest>({
    mutationFn: (data) => createProductsCheckout(data),
  });
}

/**
 * Hook to fetch checkout session status
 * Used on success page to verify payment completion
 *
 * @param sessionId - The Stripe checkout session ID (from URL)
 * @param options - Query options (enabled, etc.)
 * @returns React Query result with session status
 *
 * @example
 * ```tsx
 * // On /checkout/success page
 * const searchParams = useSearchParams();
 * const sessionId = searchParams.get('session_id');
 *
 * const { data: session, isLoading } = useCheckoutSession(sessionId);
 *
 * if (session?.payment_status === 'paid') {
 *   return <ThankYouMessage />;
 * }
 * ```
 */
export function useCheckoutSession(
  sessionId: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery<CheckoutSessionResponse>({
    queryKey: sessionId
      ? queryKeys.payments.checkoutSession(sessionId)
      : ["payments", "checkout", null],
    queryFn: () => getCheckoutSession(sessionId!),
    enabled: !!sessionId && (options?.enabled ?? true),
    staleTime: 0, // Always fetch fresh data for payment status
  });
}

// ============================================================================
// SUBSCRIPTION ACCESS HOOKS
// ============================================================================

/**
 * Hook to check subscription access
 * Used for feature gating throughout the app
 *
 * @param options - Query options (enabled, etc.)
 * @returns React Query result with access status
 *
 * @example
 * ```tsx
 * const { data: access, isLoading } = useSubscriptionAccess();
 *
 * if (access?.has_access) {
 *   return <PremiumFeatures />;
 * } else {
 *   return <UpgradePrompt />;
 * }
 * ```
 */
export function useSubscriptionAccess(options?: { enabled?: boolean }) {
  return useQuery<SubscriptionAccessResponse>({
    queryKey: queryKeys.payments.access(),
    queryFn: checkSubscriptionAccess,
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to fetch detailed subscription information
 * Used in settings/account pages to show subscription details
 *
 * @param options - Query options (enabled, etc.)
 * @returns React Query result with subscription details
 *
 * @example
 * ```tsx
 * const { data: subscription, isLoading } = useSubscriptionInfo();
 *
 * if (subscription?.status === 'active') {
 *   return (
 *     <div>
 *       <p>Status: Active</p>
 *       <p>Next billing: {subscription.current_period_end}</p>
 *       {subscription.cancel_at_period_end && <p>Cancels at period end</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSubscriptionInfo(options?: { enabled?: boolean }) {
  return useQuery<SubscriptionInfoResponse>({
    queryKey: queryKeys.payments.subscription(),
    queryFn: getSubscriptionInfo,
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000, // Cache for 1 minute
  });
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook to cancel subscription
 * Invalidates subscription and access queries after cancellation
 *
 * @returns React Query mutation for subscription cancellation
 *
 * @example
 * ```tsx
 * const { mutate: cancel, isPending } = useCancelSubscription();
 *
 * const handleCancel = () => {
 *   if (confirm('Are you sure you want to cancel?')) {
 *     cancel({ cancel_immediately: false }, {
 *       onSuccess: (subscription) => {
 *         if (subscription.cancel_at_period_end) {
 *           alert('Your subscription will end at the billing period');
 *         }
 *       },
 *     });
 *   }
 * };
 * ```
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation<CancelSubscriptionResponse, Error, CancelSubscriptionParams | undefined>({
    mutationFn: (params) => cancelSubscription(params),
    onSuccess: () => {
      // Invalidate subscription queries to reflect cancellation
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.subscription(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.access(),
      });
    },
  });
}

// ============================================================================
// CUSTOMER PORTAL HOOKS
// ============================================================================

/**
 * Hook to create a Stripe Customer Portal session
 * Redirects user to Stripe's self-service billing portal
 *
 * @returns React Query mutation for portal session creation
 *
 * @example
 * ```tsx
 * const { mutate: openPortal, isPending } = useCustomerPortal();
 *
 * const handleManageBilling = () => {
 *   openPortal({
 *     return_url: `${window.location.origin}/dashboard/settings`,
 *   }, {
 *     onSuccess: ({ portal_url }) => {
 *       window.location.href = portal_url;
 *     },
 *   });
 * };
 *
 * return (
 *   <button onClick={handleManageBilling} disabled={isPending}>
 *     {isPending ? 'Loading...' : 'Manage Billing'}
 *   </button>
 * );
 * ```
 */
export function useCustomerPortal() {
  return useMutation<CreatePortalSessionResponse, Error, CreatePortalSessionRequest>({
    mutationFn: (data) => createPortalSession(data),
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook that combines access check with subscription info
 * Convenient for pages that need both
 *
 * @returns Combined access and subscription data
 *
 * @example
 * ```tsx
 * const { hasAccess, subscription, isLoading } = useSubscriptionStatus();
 *
 * if (isLoading) return <Loading />;
 *
 * return hasAccess ? (
 *   <SubscriptionDetails subscription={subscription} />
 * ) : (
 *   <UpgradePrompt />
 * );
 * ```
 */
export function useSubscriptionStatus() {
  const accessQuery = useSubscriptionAccess();
  const subscriptionQuery = useSubscriptionInfo({
    // Only fetch subscription details if user might have access
    enabled: accessQuery.data?.has_access ?? false,
  });

  return {
    hasAccess: accessQuery.data?.has_access ?? false,
    accessStatus: accessQuery.data?.subscription_status,
    expiresAt: accessQuery.data?.expires_at,
    subscription: subscriptionQuery.data,
    isLoading: accessQuery.isLoading || subscriptionQuery.isLoading,
    isError: accessQuery.isError || subscriptionQuery.isError,
    error: accessQuery.error || subscriptionQuery.error,
    refetch: () => {
      accessQuery.refetch();
      subscriptionQuery.refetch();
    },
  };
}
