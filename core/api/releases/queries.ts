import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";
import { getLatestRelease, getReleases } from "./services";
import type {
  LatestReleaseResponse,
  ReleasesListResponse,
  ReleasesParams,
} from "./types";

/**
 * Releases React Query Hooks
 *
 * React Query hooks for fetching GitHub releases.
 * These are public endpoints (no auth required).
 */

/**
 * Hook to fetch list of releases
 * Used for displaying release history and all available downloads
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error } = useReleases({ page: 1, per_page: 10 });
 * console.log(data?.releases, data?.pagination);
 * ```
 *
 * @param params - Optional pagination params
 * @returns React Query result with releases list
 * @see GET /api/v1/releases
 */
export function useReleases(params?: ReleasesParams) {
  return useQuery<ReleasesListResponse>({
    queryKey: queryKeys.releases.list(params),
    queryFn: () => getReleases(params),
    // Cache for 5 minutes - releases don't change often
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch the latest stable release
 * Used for the main download page to show the current version
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error } = useLatestRelease();
 * console.log(data?.release.tag_name, data?.release.assets);
 * ```
 *
 * @returns React Query result with latest release data
 * @see GET /api/v1/releases/latest
 */
export function useLatestRelease() {
  return useQuery<LatestReleaseResponse>({
    queryKey: queryKeys.releases.latest(),
    queryFn: getLatestRelease,
    // Cache for 5 minutes - releases don't change often
    staleTime: 5 * 60 * 1000,
  });
}
