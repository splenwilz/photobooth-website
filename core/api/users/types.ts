/**
 * User Profile API Types
 *
 * Account-level business settings (business name, logo, display-name override).
 * @see /api/v1/users endpoint
 */

/**
 * Response from user profile endpoints
 * @see GET /api/v1/users/{user_id}
 * @see PATCH /api/v1/users/{user_id}
 */
export interface UserProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  /** Account-level business name */
  business_name: string | null;
  /** Presigned S3 URL for the account logo (expires in ~1 hour) */
  logo_url: string | null;
  /** When true, all booths show business_name instead of their per-booth display_name */
  use_display_name_on_booths: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Request body for updating account-level business settings
 * Pass business_name: null to clear the field.
 * @see PATCH /api/v1/users/{user_id}
 */
export interface UpdateBusinessNameRequest {
  /** Business name displayed on all booths (max 255 chars). Pass null to clear. */
  business_name?: string | null;
  /** When true, all booths show business_name instead of per-booth display_name */
  use_display_name_on_booths?: boolean | null;
}

/**
 * Response from logo upload endpoints (account or booth)
 * @see PUT /api/v1/users/{user_id}/logo
 * @see PUT /api/v1/booths/{booth_id}/logo
 */
export interface LogoUploadResponse {
  /** Presigned S3 URL for the uploaded logo */
  logo_url: string;
  /** S3 object key */
  s3_key: string;
}

/**
 * Response from logo delete endpoints (account or booth)
 * @see DELETE /api/v1/users/{user_id}/logo
 * @see DELETE /api/v1/booths/{booth_id}/logo
 */
export interface LogoDeleteResponse {
  message: string;
}
