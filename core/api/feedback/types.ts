/**
 * Feedback API types
 *
 * @see POST /api/v1/feedback/subscription-cancellation
 */

export type CancellationReason =
  | "too_expensive"
  | "missing_features"
  | "switched_competitor"
  | "not_using"
  | "technical_issues"
  | "other";

export interface SubmitCancellationFeedbackRequest {
  /** Stripe subscription ID, e.g. "sub_1PKr2Y062ZLGhSMv9X8K3T7B" */
  stripe_subscription_id: string;
  /** Reason enum value (not the display label) */
  reason: CancellationReason;
  /** Optional free text, max 2000 chars */
  comment?: string;
}

export interface CancellationFeedbackResponse {
  id: number;
  stripe_subscription_id: string;
  reason: CancellationReason;
  comment: string | null;
  /** ISO 8601 UTC timestamp */
  created_at: string;
}
