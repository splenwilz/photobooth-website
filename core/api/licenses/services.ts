/**
 * License API Services
 *
 * Service functions for license-related API endpoints.
 */

import { apiClient } from "../client";
import type {
  RedeemLicenseRequest,
  RedeemLicenseResponse,
  RegenerateLicenseResponse,
} from "./types";

/**
 * Redeem a license key after successful Stripe checkout
 *
 * This is called on the checkout success page to get the license key.
 * The endpoint verifies payment with Stripe and prevents duplicate redemption.
 *
 * @param data - License redemption request with checkout session ID
 * @returns Promise resolving to license key and details
 * @see POST /api/v1/licensing/redeem
 *
 * @example
 * ```ts
 * const result = await redeemLicense({
 *   checkout_session_id: 'cs_xxx',
 * });
 * console.log(result.license_key); // "ABCD-1234-EFGH-5678"
 * console.log(result.key_type); // "Subscription"
 * console.log(result.expires_days); // 365
 * ```
 */
export async function redeemLicense(
  data: RedeemLicenseRequest
): Promise<RedeemLicenseResponse> {
  return apiClient<RedeemLicenseResponse>(
    "/api/v1/licensing/redeem",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Regenerate a license key if the original was lost
 *
 * This endpoint automatically:
 * 1. Finds your license key by your email
 * 2. Uses your stored fingerprint (from previous activation)
 * 3. Invalidates the old key
 * 4. Creates a new key with the same parameters
 * 5. Generates offline license (if fingerprint was stored)
 *
 * @returns Promise resolving to new license key and details
 * @see POST /api/v1/licensing/regenerate
 *
 * @example
 * ```ts
 * const result = await regenerateLicense();
 * console.log(result.new_license_key); // "ADCE-E87Q-FDG8-5JUD"
 * console.log(result.old_license_key); // "EPZQ-43BN-ABBR-P3ZJ" (now invalid)
 * ```
 */
export async function regenerateLicense(): Promise<RegenerateLicenseResponse> {
  return apiClient<RegenerateLicenseResponse>(
    "/api/v1/licensing/regenerate",
    {
      method: "POST",
    }
  );
}
