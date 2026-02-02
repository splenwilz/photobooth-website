/**
 * Emergency Password React Query Hooks
 *
 * Custom hooks for fetching and managing emergency password data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateEmergencyPassword,
  listEmergencyPasswords,
  revokeEmergencyPassword,
  generateLocalMasterPasswordApi,
  getBaseSecretStatus,
  configureBaseSecret,
} from "./services";
import type {
  GenerateEmergencyPasswordRequest,
  GenerateLocalMasterPasswordRequest,
  ConfigureBaseSecretRequest,
  EmergencyPasswordsQueryParams,
} from "./types";

/**
 * Query keys for emergency passwords
 *
 * Hierarchical key structure for cache invalidation:
 * - all: invalidates everything
 * - lists: invalidates all list queries
 * - list(params): invalidates specific filtered list
 */
export const emergencyPasswordKeys = {
  all: ["emergency-passwords"] as const,
  lists: () => [...emergencyPasswordKeys.all, "list"] as const,
  list: (params?: EmergencyPasswordsQueryParams) =>
    [...emergencyPasswordKeys.lists(), params] as const,
};

/**
 * Hook to fetch emergency passwords list
 *
 * @param params - Query parameters for filtering
 * @returns Query result with emergency passwords data
 *
 * @example
 * const { data, isLoading } = useEmergencyPasswords({ booth_id: "uuid" });
 */
export function useEmergencyPasswords(params: EmergencyPasswordsQueryParams = {}) {
  return useQuery({
    queryKey: emergencyPasswordKeys.list(params),
    queryFn: () => listEmergencyPasswords(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to generate an emergency password
 *
 * @returns Mutation for generating emergency passwords
 *
 * @example
 * const { mutateAsync, isPending } = useGenerateEmergencyPassword();
 * const result = await mutateAsync({
 *   boothId: "uuid",
 *   data: { validity_minutes: 15, reason: "User locked out" }
 * });
 */
export function useGenerateEmergencyPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boothId,
      data,
    }: {
      boothId: string;
      data: GenerateEmergencyPasswordRequest;
    }) => generateEmergencyPassword(boothId, data),
    onSuccess: () => {
      // Invalidate emergency passwords list to show new entry
      queryClient.invalidateQueries({
        queryKey: emergencyPasswordKeys.all,
      });
    },
  });
}

/**
 * Hook to revoke an emergency password
 *
 * @returns Mutation for revoking emergency passwords
 *
 * @example
 * const { mutateAsync, isPending } = useRevokeEmergencyPassword();
 * await mutateAsync(123);
 */
export function useRevokeEmergencyPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passwordId: number) => revokeEmergencyPassword(passwordId),
    onSuccess: () => {
      // Invalidate emergency passwords list to reflect revocation
      queryClient.invalidateQueries({
        queryKey: emergencyPasswordKeys.all,
      });
    },
  });
}

/**
 * Query keys for base secret status
 */
export const baseSecretKeys = {
  all: ["base-secret"] as const,
  status: () => [...baseSecretKeys.all, "status"] as const,
};

/**
 * Hook to fetch base secret configuration status
 *
 * @returns Query result with base secret status
 *
 * @example
 * const { data, isLoading } = useBaseSecretStatus();
 * if (data && !data.configured) {
 *   // Show setup prompt
 * }
 */
export function useBaseSecretStatus() {
  return useQuery({
    queryKey: baseSecretKeys.status(),
    queryFn: () => getBaseSecretStatus(false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to generate a local master password via API
 *
 * This is the easiest method - the API handles everything using
 * the stored base secret and booth's MAC address.
 *
 * @returns Mutation for generating local master passwords
 *
 * @example
 * const { mutateAsync, isPending } = useGenerateLocalMasterPasswordApi();
 * const result = await mutateAsync({
 *   boothId: "uuid",
 *   data: { reason: "User locked out" }
 * });
 */
export function useGenerateLocalMasterPasswordApi() {
  return useMutation({
    mutationFn: ({
      boothId,
      data,
    }: {
      boothId: string;
      data: GenerateLocalMasterPasswordRequest;
    }) => generateLocalMasterPasswordApi(boothId, data),
  });
}

/**
 * Hook to configure base secret
 *
 * @returns Mutation for configuring base secret
 *
 * @example
 * const { mutateAsync, isPending } = useConfigureBaseSecret();
 * await mutateAsync({ base_secret: "your-32-char-secret" });
 */
export function useConfigureBaseSecret() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfigureBaseSecretRequest) => configureBaseSecret(data),
    onSuccess: () => {
      // Invalidate base secret status
      queryClient.invalidateQueries({
        queryKey: baseSecretKeys.all,
      });
    },
  });
}
