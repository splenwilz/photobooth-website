/**
 * Business Settings API Types
 *
 * Types for account-level business branding and per-booth display settings.
 * @see /api/v1/users/{user_id} and /api/v1/booths/{booth_id}/business-settings
 */

// ============================================================================
// Account-level types
// ============================================================================

/**
 * User profile response including business settings fields
 * GET /api/v1/users/{user_id}
 */
export interface UserProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  business_name: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Request body for updating user profile
 * PUT /api/v1/users/{user_id}
 */
export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  business_name?: string;
}

/**
 * Response from logo upload
 * PUT /api/v1/users/{user_id}/logo
 * PUT /api/v1/booths/{booth_id}/logo
 */
export interface UploadLogoResponse {
  logo_url: string;
  s3_key: string;
}

/**
 * Response from logo deletion
 * DELETE /api/v1/users/{user_id}/logo
 * DELETE /api/v1/booths/{booth_id}/logo
 */
export interface DeleteLogoResponse {
  message: string;
}

// ============================================================================
// Per-booth types
// ============================================================================

/**
 * All business settings for a booth in one call
 * GET /api/v1/booths/{booth_id}/business-settings
 */
export interface BoothBusinessSettingsResponse {
  business_name: string | null;
  logo_url: string | null;
  custom_logo_url: string | null;
  use_custom_logo: boolean;
  show_logo_on_prints: boolean;
  address: string | null;
  show_business_name: boolean;
  show_logo: boolean;
  welcome_subtitle: string | null;
  show_welcome_subtitle: boolean;
}

/**
 * Partial update for per-booth settings
 * PATCH /api/v1/booths/{booth_id}
 */
export interface UpdateBoothSettingsRequest {
  name?: string;
  address?: string;
  use_custom_logo?: boolean;
  show_logo_on_prints?: boolean;
  show_business_name?: boolean;
  show_logo?: boolean;
  welcome_subtitle?: string | null;
  show_welcome_subtitle?: boolean;
}
