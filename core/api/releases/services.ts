import { apiClient } from "../client";
import type {
  LatestReleaseResponse,
  ReleasesListResponse,
  ReleasesParams,
} from "./types";

/**
 * Releases API Services
 *
 * Service functions for fetching GitHub releases.
 * These endpoints are public (no auth required).
 */

/**
 * Get list of all releases (paginated)
 * @param params - Optional pagination params
 * @returns Promise resolving to releases list with pagination
 * @see GET /api/v1/releases
 */
export async function getReleases(
  params?: ReleasesParams
): Promise<ReleasesListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString());

  const query = searchParams.toString();
  const url = `/api/v1/releases${query ? `?${query}` : ""}`;

  const response = await apiClient<ReleasesListResponse>(url, {
    method: "GET",
    // Public endpoint - no auth needed
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

/**
 * Get the latest stable release
 * @returns Promise resolving to latest release data
 * @see GET /api/v1/releases/latest
 */
export async function getLatestRelease(): Promise<LatestReleaseResponse> {
  const response = await apiClient<LatestReleaseResponse>(
    "/api/v1/releases/latest",
    {
      method: "GET",
      // Public endpoint - no auth needed
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

/**
 * Get download URL for an asset
 * This returns the proxied download URL from the backend
 * @param assetId - The GitHub asset ID
 * @returns The download URL
 */
export function getAssetDownloadUrl(assetId: number): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${baseUrl}/api/v1/releases/download/${assetId}`;
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "85.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get platform display name
 * @param platform - Platform identifier
 * @returns Human-readable platform name
 */
export function getPlatformDisplayName(
  platform: string
): string {
  const names: Record<string, string> = {
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    unknown: "Other",
  };
  return names[platform] || platform;
}

/**
 * Get platform icon name (for use with icon libraries)
 * @param platform - Platform identifier
 * @returns Icon identifier
 */
export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    windows: "windows",
    macos: "apple",
    linux: "linux",
    unknown: "download",
  };
  return icons[platform] || "download";
}
