/**
 * Releases API Module
 *
 * Public API for fetching GitHub release metadata (version, assets, changelog).
 */

// Types
export type {
  Release,
  ReleaseAsset,
  ReleaseArchitecture,
  ReleasePlatform,
  ReleasesPagination,
  ReleasesListResponse,
  LatestReleaseResponse,
  ReleasesParams,
} from "./types";

// Services
export {
  getReleases,
  getLatestRelease,
  getAssetDownloadUrl,
  formatFileSize,
  getPlatformDisplayName,
  getPlatformIcon,
} from "./services";

// React Query Hooks
export { useReleases, useLatestRelease } from "./queries";
