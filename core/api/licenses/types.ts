/**
 * License API Types
 *
 * TypeScript types for license redemption endpoints.
 */

/**
 * License type options
 */
export type LicenseType = "Trial" | "Perpetual" | "Subscription";

/**
 * Request body for redeeming a license after checkout
 * Called after successful Stripe checkout to get the license key
 */
export interface RedeemLicenseRequest {
  /** The Stripe checkout session ID from successful payment */
  checkout_session_id: string;
  /** Optional machine fingerprint for offline license generation */
  fingerprint?: string;
}

/**
 * Response from license redemption
 */
export interface RedeemLicenseResponse {
  /** Whether the redemption was successful */
  success: boolean;
  /** The generated license key (e.g., "ABCD-1234-EFGH-5678") */
  license_key: string;
  /** The type of license */
  key_type: LicenseType;
  /** Number of days until license expires */
  expires_days: number;
  /** Signed offline license JSON (only returned when fingerprint is provided) */
  license_json: string | null;
  /** Whether this key was already redeemed (prevents duplicates) */
  already_redeemed: boolean;
  /** Human-readable message */
  message: string;
}

/**
 * Response from license regeneration
 * Used when user has lost their license key
 */
export interface RegenerateLicenseResponse {
  /** Whether the regeneration was successful */
  success: boolean;
  /** The new license key */
  new_license_key: string;
  /** The old license key (now invalidated) */
  old_license_key: string;
  /** The type of license */
  key_type: LicenseType;
  /** Number of days until license expires */
  expires_days: number;
  /** Signed offline license JSON (if fingerprint was stored from previous activation) */
  license_json: string | null;
  /** Human-readable message */
  message: string;
}
