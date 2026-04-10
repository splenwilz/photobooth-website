/**
 * Payment API Module
 *
 * Exports payment-related types, services, and React Query hooks.
 *
 * @example
 * ```ts
 * import type { CheckoutSessionResponse } from '@/core/api/payments';
 * import { getCheckoutSession, getBoothSubscription } from '@/core/api/payments';
 * import { useCheckoutSession, useBoothSubscription } from '@/core/api/payments';
 * ```
 */

// Types
export type {
  // Common types
  CheckoutResponse,
  CheckoutStatus,
  PaymentStatus,
  SubscriptionStatus,

  // Template checkout (database prices)
  TemplateCheckoutLineItem,
  CreateTemplateCheckoutRequest,

  // Checkout session
  CheckoutSessionResponse,

  // Customer portal
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,

  // Per-booth subscription types
  BoothSubscriptionItem,
  CreateBoothCheckoutRequest,
} from "./types";

// Services
export {
  // Checkout services
  createTemplateCheckout,
  getCheckoutSession,

  // Customer portal services
  createPortalSession,

  // Per-booth subscription services
  getBoothSubscription,
  createBoothCheckout,
  cancelBoothSubscription,
} from "./services";

// React Query Hooks
export {
  // Checkout hooks
  useTemplateCheckout,
  useCheckoutSession,

  // Customer portal hooks
  useCustomerPortal,

  // Per-booth subscription hooks
  useBoothSubscription,
  useCreateBoothCheckout,
  useCancelBoothSubscription,
} from "./queries";
