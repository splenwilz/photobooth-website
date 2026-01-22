/**
 * License React Query Hooks
 *
 * React Query hooks for license-related operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import { redeemLicense, regenerateLicense } from "./services";
import type {
  RedeemLicenseRequest,
  RedeemLicenseResponse,
  RegenerateLicenseResponse,
} from "./types";

/**
 * Hook to redeem a license key after checkout
 *
 * @returns React Query mutation for license redemption
 *
 * @example
 * ```tsx
 * const { mutate: redeem, isPending, data } = useRedeemLicense();
 *
 * useEffect(() => {
 *   if (sessionId) {
 *     redeem({
 *       checkout_session_id: sessionId,
 *     }, {
 *       onSuccess: (data) => {
 *         console.log('License key:', data.license_key);
 *       },
 *     });
 *   }
 * }, [sessionId, redeem]);
 * ```
 */
export function useRedeemLicense() {
  const queryClient = useQueryClient();

  return useMutation<
    RedeemLicenseResponse,
    Error,
    RedeemLicenseRequest
  >({
    mutationFn: (data) => redeemLicense(data),
    onSuccess: () => {
      // Invalidate subscription access to reflect new license
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.access(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.subscription(),
      });
    },
  });
}

/**
 * Hook to regenerate a lost license key
 *
 * @returns React Query mutation for license regeneration
 *
 * @example
 * ```tsx
 * const { mutate: regenerate, isPending, data } = useRegenerateLicense();
 *
 * const handleRegenerate = () => {
 *   regenerate(undefined, {
 *     onSuccess: (data) => {
 *       console.log('New license key:', data.new_license_key);
 *     },
 *   });
 * };
 * ```
 */
export function useRegenerateLicense() {
  const queryClient = useQueryClient();

  return useMutation<RegenerateLicenseResponse, Error, void>({
    mutationFn: () => regenerateLicense(),
    onSuccess: () => {
      // Invalidate subscription access to reflect regenerated license
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.access(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.subscription(),
      });
    },
  });
}
