/**
 * Feedback API services
 *
 * @see POST /api/v1/feedback/subscription-cancellation
 */

import { apiClient } from "../client";
import type {
  CancellationFeedbackResponse,
  SubmitCancellationFeedbackRequest,
} from "./types";

/**
 * Submit churn-reason feedback for a recently cancelled subscription.
 *
 * Backend eligibility: caller must own the subscription, it must be in a
 * cancelled state (or scheduled to cancel at period end) within the last
 * 60 days, and the user must not have already submitted feedback for it.
 * Returns 409 if already submitted - treat as success for UX.
 */
export async function submitCancellationFeedback(
  data: SubmitCancellationFeedbackRequest,
): Promise<CancellationFeedbackResponse> {
  return apiClient<CancellationFeedbackResponse>(
    "/api/v1/feedback/subscription-cancellation",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}
