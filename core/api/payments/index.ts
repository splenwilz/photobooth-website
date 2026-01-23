/**
 * Payment API Module
 *
 * Exports all payment-related types, services, and React Query hooks.
 *
 * @example
 * ```ts
 * // Import types
 * import type { SubscriptionAccessResponse, CheckoutResponse } from '@/core/api/payments';
 *
 * // Import services
 * import { createSubscriptionCheckout, checkSubscriptionAccess } from '@/core/api/payments';
 *
 * // Import hooks
 * import { useSubscriptionAccess, useSubscriptionCheckout } from '@/core/api/payments';
 * ```
 */

// Types
export type {
  // Common types
  CheckoutResponse,
  CheckoutStatus,
  PaymentStatus,
  SubscriptionStatus,

  // Subscription checkout
  CreateSubscriptionCheckoutRequest,

  // Product checkout (single)
  CreateProductCheckoutRequest,

  // Products checkout (multiple/cart)
  CheckoutLineItem,
  CreateProductsCheckoutRequest,

  // Checkout session
  CheckoutSessionResponse,

  // Subscription access
  SubscriptionAccessResponse,

  // Subscription info
  SubscriptionInfoResponse,

  // Cancel subscription
  CancelSubscriptionParams,
  CancelSubscriptionResponse,

  // Customer portal
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,

  // Configuration types
  PriceIds,
  BillingInterval,
  SubscriptionPlan,
  HardwarePackage,

  // Per-booth subscription types
  BoothSubscriptionItem,
  BoothSubscriptionsListResponse,
  CreateBoothCheckoutRequest,
} from "./types";

// Services
export {
  // Checkout services
  createSubscriptionCheckout,
  createProductCheckout,
  createProductsCheckout,
  getCheckoutSession,

  // Subscription access services
  checkSubscriptionAccess,
  getSubscriptionInfo,

  // Subscription management services
  cancelSubscription,

  // Customer portal services
  createPortalSession,

  // Per-booth subscription services
  getBoothSubscriptions,
  getBoothSubscription,
  createBoothCheckout,
  cancelBoothSubscription,
} from "./services";

// React Query Hooks
export {
  // Checkout hooks
  useSubscriptionCheckout,
  useProductCheckout,
  useProductsCheckout,
  useCheckoutSession,

  // Subscription access hooks
  useSubscriptionAccess,
  useSubscriptionInfo,

  // Subscription management hooks
  useCancelSubscription,

  // Customer portal hooks
  useCustomerPortal,

  // Utility hooks
  useSubscriptionStatus,

  // Per-booth subscription hooks
  useBoothSubscriptions,
  useBoothSubscription,
  useCreateBoothCheckout,
  useCancelBoothSubscription,
} from "./queries";
