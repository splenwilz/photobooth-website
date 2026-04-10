/**
 * Payment React Query Hooks
 *
 * React Query hooks for payment-related operations. Covers checkout
 * session verification, customer portal, per-booth subscriptions, and
 * template purchases.
 *
 * Note: a number of hooks used to live here for the OLD global Pro
 * subscription flow (single plan + 14-day trial) and for hardware
 * package sales. Both features were removed at the client's request.
 *
 * @see https://tanstack.com/query/latest/docs/react/overview
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import {
  cancelBoothSubscription,
  createBoothCheckout,
  createPortalSession,
  createTemplateCheckout,
  getBoothSubscription,
  getCheckoutSession,
} from "./services";
import type {
  BoothSubscriptionItem,
  CheckoutResponse,
  CheckoutSessionResponse,
  CreateBoothCheckoutRequest,
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,
  CreateTemplateCheckoutRequest,
} from "./types";

// ============================================================================
// CHECKOUT HOOKS
// ============================================================================

/**
 * Hook to create a template checkout session
 * Uses database prices instead of Stripe Price IDs
 */
export function useTemplateCheckout() {
  return useMutation<CheckoutResponse, Error, CreateTemplateCheckoutRequest>({
    mutationFn: (data) => createTemplateCheckout(data),
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
 * ```
 */
export function useCustomerPortal() {
  return useMutation<CreatePortalSessionResponse, Error, CreatePortalSessionRequest>({
    mutationFn: (data) => createPortalSession(data),
  });
}

// ============================================================================
// PER-BOOTH SUBSCRIPTION HOOKS
// ============================================================================

/**
 * Hook to get single booth subscription status
 * Returns subscription details for a specific booth
 * Automatically disabled when boothId is null
 *
 * @param boothId - Booth ID to get subscription for (null to disable)
 * @returns React Query result with booth subscription status
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useBoothSubscription(selectedBoothId);
 * if (data?.is_active) {
 *   // Booth has active subscription
 * }
 * ```
 */
export function useBoothSubscription(boothId: string | null) {
  return useQuery<BoothSubscriptionItem>({
    queryKey: queryKeys.payments.boothSubscription(boothId ?? ""),
    queryFn: () => getBoothSubscription(boothId!),
    enabled: !!boothId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create booth subscription checkout session
 * Creates a Stripe checkout session for a specific booth
 *
 * @returns React Query mutation for creating booth checkout
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateBoothCheckout();
 *
 * const handleSubscribe = (boothId: string) => {
 *   mutate({
 *     booth_id: boothId,
 *     success_url: `${window.location.origin}/checkout/success`,
 *     cancel_url: `${window.location.origin}/pricing`,
 *   }, {
 *     onSuccess: (data) => {
 *       window.location.href = data.checkout_url;
 *     },
 *   });
 * };
 * ```
 */
export function useCreateBoothCheckout() {
  // Note: this hook uses the older `createBoothCheckout` from
  // ./services. There's also a newer `createSubscriptionCheckout`
  // in `core/api/pricing/services.ts` that handles the same backend
  // endpoint but injects `booth_id` into the body for the SubscribeBoothModal
  // flow. The two are functional duplicates — consider unifying them
  // in a future cleanup.
  return useMutation<CheckoutResponse, Error, CreateBoothCheckoutRequest>({
    mutationFn: (data) => createBoothCheckout(data),
  });
}

/**
 * Hook to cancel booth subscription
 * Cancels subscription for a specific booth
 *
 * @returns React Query mutation for cancelling booth subscription
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCancelBoothSubscription();
 *
 * const handleCancel = (boothId: string) => {
 *   mutate({ boothId, immediately: false }, {
 *     onSuccess: () => alert('Subscription will cancel at end of period'),
 *   });
 * };
 * ```
 */
export function useCancelBoothSubscription() {
  const queryClient = useQueryClient();

  return useMutation<
    BoothSubscriptionItem,
    Error,
    { boothId: string; immediately?: boolean }
  >({
    mutationFn: ({ boothId, immediately = false }) =>
      cancelBoothSubscription(boothId, immediately),
    onSuccess: (_, variables) => {
      // Invalidate booth subscription queries to refetch updated status
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.boothSubscriptions(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.boothSubscription(variables.boothId),
      });
    },
  });
}
