/**
 * Emergency Password Services
 *
 * API service functions for emergency password management.
 * Used for master password recovery on booths.
 */

import { apiClient } from "@/core/api/client";
import type {
  GenerateEmergencyPasswordRequest,
  GenerateEmergencyPasswordResponse,
  EmergencyPasswordsQueryParams,
  EmergencyPasswordsListResponse,
  GenerateLocalMasterPasswordRequest,
  GenerateLocalMasterPasswordResponse,
  BaseSecretStatus,
  ConfigureBaseSecretRequest,
} from "./types";

const ADMIN_BASE_URL = "/api/v1/admin";

/**
 * Build query string from parameters object
 */
function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Generate an emergency password for a booth
 *
 * @param boothId - The ID of the booth
 * @param data - Request data including validity_minutes and reason
 * @returns Promise with the generated password (shown only once!)
 *
 * @example
 * const result = await generateEmergencyPassword("booth-uuid", {
 *   validity_minutes: 15,
 *   reason: "User locked out, forgot password"
 * });
 * // result.password = "EMR-A1B2C3D4" (display this to admin once!)
 */
export async function generateEmergencyPassword(
  boothId: string,
  data: GenerateEmergencyPasswordRequest
): Promise<GenerateEmergencyPasswordResponse> {
  return apiClient<GenerateEmergencyPasswordResponse>(
    `${ADMIN_BASE_URL}/booths/${boothId}/emergency-password`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * List emergency passwords with optional filtering
 *
 * @param params - Query parameters for filtering
 * @returns Promise with paginated list of emergency passwords
 *
 * @example
 * const { passwords } = await listEmergencyPasswords({ booth_id: "uuid" });
 */
export async function listEmergencyPasswords(
  params: EmergencyPasswordsQueryParams = {}
): Promise<EmergencyPasswordsListResponse> {
  const queryString = buildQueryString(params);
  return apiClient<EmergencyPasswordsListResponse>(
    `${ADMIN_BASE_URL}/emergency-passwords${queryString}`
  );
}

/**
 * Revoke an emergency password
 *
 * @param passwordId - The ID of the emergency password to revoke
 * @returns Promise that resolves when revoked
 *
 * @example
 * await revokeEmergencyPassword(123);
 */
export async function revokeEmergencyPassword(passwordId: number): Promise<void> {
  return apiClient<void>(
    `${ADMIN_BASE_URL}/emergency-passwords/${passwordId}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * Generate a local master password via API
 *
 * This is the easiest method - the API generates the password using
 * the stored base secret and the booth's MAC address from heartbeat data.
 *
 * @param boothId - The ID of the booth
 * @param data - Request data including reason
 * @returns Promise with the generated 8-digit password
 *
 * @example
 * const result = await generateLocalMasterPasswordApi("booth-uuid", {
 *   reason: "User locked out"
 * });
 * // result.password = "12347891"
 */
export async function generateLocalMasterPasswordApi(
  boothId: string,
  data: GenerateLocalMasterPasswordRequest
): Promise<GenerateLocalMasterPasswordResponse> {
  return apiClient<GenerateLocalMasterPasswordResponse>(
    `${ADMIN_BASE_URL}/booths/${boothId}/local-master-password`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Get base secret configuration status
 *
 * @param includeSecret - Whether to include the actual secret in the response
 * @returns Promise with base secret status
 *
 * @example
 * const status = await getBaseSecretStatus();
 * if (!status.configured) {
 *   // Prompt to configure base secret
 * }
 */
export async function getBaseSecretStatus(
  includeSecret: boolean = false
): Promise<BaseSecretStatus> {
  const queryString = includeSecret ? "?include_secret=true" : "";
  return apiClient<BaseSecretStatus>(
    `${ADMIN_BASE_URL}/settings/base-secret${queryString}`
  );
}

/**
 * Configure the base secret for local master password generation
 *
 * @param data - Request data with the base secret (32+ characters)
 * @returns Promise that resolves when configured
 *
 * @example
 * await configureBaseSecret({
 *   base_secret: "your-32-character-or-longer-secret-here"
 * });
 */
export async function configureBaseSecret(
  data: ConfigureBaseSecretRequest
): Promise<void> {
  return apiClient<void>(
    `${ADMIN_BASE_URL}/settings/base-secret`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}
