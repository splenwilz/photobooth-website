/**
 * Shared authentication response types
 * Used across signin, signup, and other auth operations
 */

/**
 * User object structure returned from authentication endpoints
 */


export interface AuthUser {
  object: string;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  profile_picture_url: string;
  role?: string;
  created_at: string;
  updated_at: string;
  /** Account-level business name shown across all booths (null if unset) */
  business_name?: string | null;
  /** Presigned URL for the account logo (null if none uploaded) */
  logo_url?: string | null;
  /** When true, all booths display business_name instead of per-booth display_name */
  use_display_name_on_booths?: boolean;
}

/**
 * Impersonator information (when applicable)
 */
export interface Impersonator {
  email: string;
  reason: string;
}

/**
 * Complete authentication response from the API
 * This is the standard response format for signin, signup, and token refresh operations
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  authentication_method: string;
  impersonator?: Impersonator;
  organization_id?: string;
  role?: string;
  user: AuthUser;
  sealed_session: string;
}

