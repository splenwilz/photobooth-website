/**
 * Releases API Types
 *
 * Types for GitHub releases integration.
 * @see /api/v1/releases endpoint
 */

/**
 * Platform detected from asset filename
 */
export type ReleasePlatform = "windows" | "macos" | "linux" | "unknown";

/**
 * Architecture detected from asset filename
 */
export type ReleaseArchitecture = "x64" | "arm64" | "universal" | "unknown";

/**
 * Release asset (downloadable file)
 */
export interface ReleaseAsset {
  /** GitHub asset ID */
  id: number;
  /** Filename (e.g., "PhotoBoothX-1.2.0-win-x64.exe") */
  name: string;
  /** File size in bytes */
  size: number;
  /** Number of times downloaded */
  download_count: number;
  /** Download URL (proxied through backend) */
  browser_download_url: string;
  /** MIME type */
  content_type: string;
  /** Detected platform from filename */
  platform: ReleasePlatform;
  /** Detected architecture from filename */
  architecture: ReleaseArchitecture;
}

/**
 * Release information
 */
export interface Release {
  /** GitHub release ID */
  id: number;
  /** Version tag (e.g., "v1.2.0") */
  tag_name: string;
  /** Release title */
  name: string;
  /** Release notes (markdown) */
  body: string;
  /** Release notes (HTML) - may be null */
  body_html: string | null;
  /** ISO timestamp when published */
  published_at: string;
  /** Whether this is a pre-release */
  prerelease: boolean;
  /** Downloadable assets */
  assets: ReleaseAsset[];
}

/**
 * Pagination info for releases list
 */
export interface ReleasesPagination {
  page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

/**
 * Response from releases list endpoint
 * GET /api/v1/releases
 */
export interface ReleasesListResponse {
  releases: Release[];
  pagination: ReleasesPagination;
}

/**
 * Response from latest release endpoint
 * GET /api/v1/releases/latest
 */
export interface LatestReleaseResponse {
  release: Release;
}

/**
 * Parameters for fetching releases list
 */
export interface ReleasesParams {
  page?: number;
  per_page?: number;
}
