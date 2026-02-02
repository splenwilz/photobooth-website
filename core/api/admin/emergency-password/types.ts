/**
 * Emergency Password Types
 *
 * TypeScript interfaces for the emergency password API endpoints.
 * Used for master password recovery on booths.
 */

/**
 * Request to generate an emergency password
 */
export interface GenerateEmergencyPasswordRequest {
  validity_minutes: number;
  reason: string;
}

/**
 * Response from generating an emergency password
 * Note: The password is only shown once and not stored in plaintext
 */
export interface GenerateEmergencyPasswordResponse {
  password: string;
  booth_id: string;
  booth_name: string;
  expires_at: string;
  validity_minutes: number;
  issued_by_email: string;
  issued_at: string;
}

/**
 * Emergency password record (for audit log)
 */
export interface EmergencyPasswordRecord {
  id: number;
  booth_id: string;
  booth_name: string;
  issued_by: string;
  issued_by_email: string;
  issued_at: string;
  expires_at: string;
  reason: string;
  used: boolean;
  used_at: string | null;
  revoked: boolean;
  revoked_at: string | null;
  revoked_by: string | null;
}

/**
 * Query parameters for listing emergency passwords
 */
export interface EmergencyPasswordsQueryParams {
  booth_id?: string;
  include_expired?: boolean;
  page?: number;
  per_page?: number;
}

/**
 * Response from listing emergency passwords
 */
export interface EmergencyPasswordsListResponse {
  passwords: EmergencyPasswordRecord[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Validity options for emergency passwords (in minutes)
 */
export const VALIDITY_OPTIONS = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes (Recommended)" },
  { value: 30, label: "30 minutes" },
] as const;

/**
 * Request to generate a local master password via API
 */
export interface GenerateLocalMasterPasswordRequest {
  reason: string;
}

/**
 * Response from generating a local master password via API
 */
export interface GenerateLocalMasterPasswordResponse {
  password: string;
  booth_id: string;
  booth_name: string;
  mac_address: string;
  generated_at: string;
  generated_by: string;
}

/**
 * Base secret configuration status
 */
export interface BaseSecretStatus {
  is_configured: boolean;
  updated_at?: string;
  updated_by?: string;
  base_secret?: string | null; // Only returned if include_secret=true
}

/**
 * Request to configure base secret
 */
export interface ConfigureBaseSecretRequest {
  base_secret: string;
}
