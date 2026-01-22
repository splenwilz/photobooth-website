/**
 * License API Module
 *
 * Exports all license-related types, services, and React Query hooks.
 */

// Types
export type {
  LicenseType,
  RedeemLicenseRequest,
  RedeemLicenseResponse,
  RegenerateLicenseResponse,
} from "./types";

// Services
export { redeemLicense, regenerateLicense } from "./services";

// React Query Hooks
export { useRedeemLicense, useRegenerateLicense } from "./queries";
