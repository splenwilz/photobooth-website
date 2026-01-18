import { useMutation, useQueryClient, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";

/**
 * Factory function to create React Query mutation hooks with queryClient
 * 
 * Abstracts the common pattern of:
 * - useMutation + useQueryClient
 * - Spreading mutation result with queryClient
 * 
 * @param mutationFn - The async function to call for the mutation
 * @param options - Optional React Query mutation options
 * @returns A hook that returns mutation result and queryClient
 * 
 * @example
 * ```ts
 * export const useOAuth = createMutationHook<OAuthRequest, OAuthResponse>(oauth);
 * ```
 */
export function createMutationHook<TRequest, TResponse>(
    mutationFn: (data: TRequest) => Promise<TResponse>,
    options?: Omit<UseMutationOptions<TResponse, Error, TRequest, unknown>, 'mutationFn'>
) {
    return function useMutationHook(): UseMutationResult<TResponse, Error, TRequest, unknown> & { queryClient: ReturnType<typeof useQueryClient> } {
        const queryClient = useQueryClient();

        const mutation = useMutation({
            mutationFn,
            ...options,
        });

        return {
            ...mutation,
            queryClient,
        };
    };
}

