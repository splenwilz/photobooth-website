import { createMutationHook } from "../../utils/query-helpers";
  import { oauth } from "./services";
import type { OAuthRequest, OAuthResponse } from "./types";

/**
 * Hook to initiate OAuth flow
 * 
 * React Query v5 pattern: Returns mutation and queryClient for component-level handling.
 * Components should handle cache invalidation using mutation state without useEffect.
 * 
 * @returns React Query mutation object and queryClient for cache management
 * @see https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5
 * @see https://tanstack.com/query/latest/docs/react/reference/useMutation
 */
export const useOAuth = createMutationHook<OAuthRequest, OAuthResponse>(oauth);

