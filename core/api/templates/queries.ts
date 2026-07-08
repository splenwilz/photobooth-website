/**
 * Public Template React Query Hooks
 */

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  getTemplates,
  getTemplateById,
  getTemplateBySlug,
  getCategories,
  getLayouts,
  getTemplateReviews,
  submitReview,
  updateReview,
  deleteReview,
  downloadTemplate,
  getPurchasedTemplates,
  getOwnedFrom,
} from "./services";
import type { TemplatesQueryParams, ReviewsResponse } from "./types";

export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (params: TemplatesQueryParams) =>
    [...templateKeys.lists(), params] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
  slug: (slug: string) => [...templateKeys.all, "slug", slug] as const,
  categories: ["template-categories"] as const,
  layouts: ["template-layouts"] as const,
  reviews: (templateId: string) =>
    [...templateKeys.all, "reviews", templateId] as const,
  purchased: (params: { booth_id: string; page?: number; per_page?: number }) =>
    [...templateKeys.all, "purchased", params] as const,
  ownedFrom: (boothId: string, sortedTemplateIds: readonly string[]) =>
    [...templateKeys.all, "owned-from", boothId, sortedTemplateIds] as const,
};

export function useTemplates(params: TemplatesQueryParams = {}) {
  return useQuery({
    queryKey: templateKeys.list(params),
    queryFn: () => getTemplates(params),
    staleTime: 60 * 1000,
  });
}

export function useTemplateById(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => getTemplateById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useTemplateBySlug(slug: string) {
  return useQuery({
    queryKey: templateKeys.slug(slug),
    queryFn: () => getTemplateBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}

export function usePublicCategories() {
  return useQuery({
    queryKey: templateKeys.categories,
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicLayouts() {
  return useQuery({
    queryKey: templateKeys.layouts,
    queryFn: () => getLayouts(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Paginated reviews for a template. Uses an infinite query so the modal can
 * show a small initial batch and reveal the rest with a "Load more" button —
 * the usability-preferred pattern over pagination or a nested scroll area.
 */
export function useTemplateReviews(
  templateId: string,
  params: { per_page?: number } = {}
) {
  const perPage = params.per_page ?? 10;
  return useInfiniteQuery({
    queryKey: [...templateKeys.reviews(templateId), { per_page: perPage }],
    queryFn: ({ pageParam }) =>
      getTemplateReviews(templateId, { page: pageParam, per_page: perPage }),
    enabled: !!templateId,
    staleTime: 60 * 1000,
    initialPageParam: 1,
    // Derive the next page from how much we've loaded vs the server total,
    // not from the echoed `page` field — that way "Load more" can't loop even
    // if the endpoint mis-reports `page`. Mirrors core/api/credits/queries.ts.
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.reviews.length, 0);
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data: { rating: number; title?: string; comment?: string };
    }) => submitReview(templateId, data),
    onSuccess: (_newReview, { templateId }) => {
      // Refetch the (paginated) reviews so the new review shows in the
      // correct order and per-page counts stay consistent. An optimistic
      // prepend into an infinite list risks page-boundary duplicates once
      // pages refetch, so we invalidate instead — the "Review submitted"
      // banner covers the brief refetch.
      queryClient.invalidateQueries({
        queryKey: templateKeys.reviews(templateId),
      });
      // Detail + list views also need a refetch to pick up the new
      // review_count / rating_average computed by the backend.
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(templateId),
      });
      queryClient.invalidateQueries({
        queryKey: templateKeys.lists(),
      });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      reviewId,
      data,
    }: {
      templateId: string;
      reviewId: number;
      data: { rating?: number; title?: string; comment?: string };
    }) => updateReview(templateId, reviewId, data),
    onSuccess: (updatedReview, { templateId }) => {
      // Replace the existing entry across every loaded reviews page. The
      // PATCH response already has populated identity fields, so no refetch
      // is needed for the reviews list itself (an in-place swap can't shift
      // page boundaries the way an insert would).
      queryClient.setQueriesData<InfiniteData<ReviewsResponse>>(
        { queryKey: templateKeys.reviews(templateId) },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              reviews: page.reviews.map((r) =>
                r.id === updatedReview.id ? updatedReview : r
              ),
            })),
          };
        }
      );
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(templateId),
      });
      queryClient.invalidateQueries({
        queryKey: templateKeys.lists(),
      });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      reviewId,
    }: {
      templateId: string;
      reviewId: number;
    }) => deleteReview(templateId, reviewId),
    onSuccess: (_, { templateId }) => {
      queryClient.invalidateQueries({
        queryKey: templateKeys.reviews(templateId),
      });
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(templateId),
      });
      queryClient.invalidateQueries({
        queryKey: templateKeys.lists(),
      });
    },
  });
}

export function usePurchasedTemplates(
  params: { booth_id: string; page?: number; per_page?: number }
) {
  return useQuery({
    queryKey: templateKeys.purchased(params),
    queryFn: () => getPurchasedTemplates(params),
    enabled: !!params.booth_id,
    staleTime: 60 * 1000,
  });
}

/**
 * Membership check: which of the supplied template_ids has the booth
 * already purchased? Use this for duplicate-purchase warnings — bounded
 * by the input list size, not by booth purchase history. The IDs are
 * sorted for the cache key so reordered carts hit the same entry.
 *
 * staleTime is 0 because this hook gates a payment flow — if the user
 * bought a template in another tab (or via the kiosk), we want the next
 * Pay-button click to reflect that. Network cost is bounded (cart size).
 */
export function useOwnedFrom(params: { booth_id: string; template_ids: string[] }) {
  // Sort to keep the cache key stable across cart reorderings.
  const sortedIds = [...params.template_ids].sort();
  return useQuery({
    queryKey: templateKeys.ownedFrom(params.booth_id, sortedIds),
    queryFn: () =>
      getOwnedFrom({
        booth_id: params.booth_id,
        template_ids: sortedIds,
      }),
    // Don't fire when there's no booth selected or the cart is empty —
    // the response would always be `owned_template_ids: []` anyway.
    enabled: !!params.booth_id && sortedIds.length > 0,
    staleTime: 0,
  });
}

export function useDownloadTemplate() {
  return useMutation({
    mutationFn: (id: string) => downloadTemplate(id),
  });
}
