/**
 * Cash Box API Index
 *
 * Live balance rides the booth overview (`cash_box` on BoothDetailResponse);
 * this module owns the collection-history endpoint and the display selectors.
 *
 * @example
 * import { useBoothCashCollections, computeRefundGap } from "@/core/api/cash-box";
 */

export * from "./types";
export * from "./services";
export * from "./selectors";
export * from "./queries";
