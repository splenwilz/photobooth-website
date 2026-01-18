"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { ApiError } from "@/core/api/client";

/**
 * QueryProvider component that sets up React Query with optimized defaults
 * 
 * Configuration:
 * - staleTime: 5 minutes - Data is considered fresh for 5 minutes
 * - gcTime: 10 minutes - Unused cache is garbage collected after 10 minutes (formerly cacheTime)
 * - retry: 2 - Retry failed requests twice
 * - refetchOnWindowFocus: false - Don't refetch when window regains focus
 * - refetchOnMount: true - Refetch when component mounts (default)
 * - refetchOnReconnect: true - Refetch when network reconnects (default)
 * 
 * Global error handling:
 * - 401 errors from apiClient trigger redirect to /signin
 * - This handles session expiry when refresh token fails
 * 
 * @see https://tanstack.com/query/latest/docs/react/reference/QueryClient
 * @see https://tanstack.com/query/latest/docs/react/guides/important-defaults
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  // Ensures one client per mount to avoid cache loss during Fast Refresh
  // Using useState with function initializer prevents recreation on re-renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time in milliseconds after data is considered stale
            // Data is fresh for 5 minutes, reducing unnecessary refetches
            staleTime: 5 * 60 * 1000, // 5 minutes

            // Time in milliseconds before inactive queries are garbage collected
            // In v5, cacheTime was renamed to gcTime (garbage collection time)
            gcTime: 10 * 60 * 1000, // 10 minutes

            // Number of retry attempts for failed queries
            retry: 2,

            // Refetch behavior configuration
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnMount: true, // Refetch when component mounts (default)
            refetchOnReconnect: true, // Refetch when network reconnects (default)

            // Note: Query errors should be handled at component level
            // Global error handling is only available for mutations
          },
          mutations: {
            // Default mutation options
            retry: 1, // Retry failed mutations once
            // Global error handler for mutations
            // Only redirects on session expiry (not all 401 errors)
            // Other 401 errors (e.g., invalid credentials) should be handled by components
            onError: (error) => {
              if (error instanceof ApiError && error.isSessionExpired) {
                // Only redirect on session expiry, not on other 401 errors
                // This prevents redirecting during login attempts with invalid credentials
                if (typeof window !== 'undefined') {
                  window.location.href = '/signin'
                }
              }
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools - only shown in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
