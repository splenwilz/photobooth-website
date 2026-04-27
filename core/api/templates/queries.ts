/**
 * Public Template React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "./services";
import type { TemplatesQueryParams, ReviewsResponse } from "./types";

export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (params: TemplatesQueryParams) =>
    [...templateKeys.lists(), params] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: number) => [...templateKeys.details(), id] as const,
  slug: (slug: string) => [...templateKeys.all, "slug", slug] as const,
  categories: ["template-categories"] as const,
  layouts: ["template-layouts"] as const,
  reviews: (templateId: number) =>
    [...templateKeys.all, "reviews", templateId] as const,
  purchased: (params: { booth_id: string; page?: number; per_page?: number }) =>
    [...templateKeys.all, "purchased", params] as const,
};

export function useTemplates(params: TemplatesQueryParams = {}) {
  return useQuery({
    queryKey: templateKeys.list(params),
    queryFn: () => getTemplates(params),
    staleTime: 60 * 1000,
  });
}

export function useTemplateById(id: number) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => getTemplateById(id),
    enabled: id > 0,
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

export function useTemplateReviews(
  templateId: number,
  params: { page?: number; per_page?: number } = {}
) {
  return useQuery({
    queryKey: [...templateKeys.reviews(templateId), params],
    queryFn: () => getTemplateReviews(templateId, params),
    enabled: templateId > 0,
    staleTime: 60 * 1000,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: number;
      data: { rating: number; title?: string; comment?: string };
    }) => submitReview(templateId, data),
    onSuccess: (newReview, { templateId }) => {
      // Optimistically prepend the new review to the FIRST page only —
      // prepending to page 2+ would shove a non-page-2 row to the top
      // and double-count once page 1 next refetches. The QuickViewModal
      // currently uses default params (single page), so this matches
      // today's UI; the predicate makes it safe when pagination ships.
      // Other pages get the new review when they refetch (their
      // staleTime is 60s, see useTemplateReviews), or via a manual
      // invalidation from the caller if instant consistency matters.
      queryClient.setQueriesData<ReviewsResponse>(
        {
          queryKey: templateKeys.reviews(templateId),
          predicate: (q) => {
            const params = q.queryKey[3] as { page?: number } | undefined;
            return !params || params.page === undefined || params.page === 1;
          },
        },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            reviews: [newReview, ...old.reviews],
            total: old.total + 1,
          };
        }
      );
      // Detail + list views still need a refetch to pick up the new
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
      templateId: number;
      reviewId: number;
      data: { rating?: number; title?: string; comment?: string };
    }) => updateReview(templateId, reviewId, data),
    onSuccess: (updatedReview, { templateId }) => {
      // Replace the existing entry in every cached reviews page. The
      // PATCH response already has populated identity fields, so the
      // refetch is unnecessary for the reviews list itself.
      queryClient.setQueriesData<ReviewsResponse>(
        { queryKey: templateKeys.reviews(templateId) },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            reviews: old.reviews.map((r) =>
              r.id === updatedReview.id ? updatedReview : r
            ),
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
      templateId: number;
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

export function useDownloadTemplate() {
  return useMutation({
    mutationFn: (id: number) => downloadTemplate(id),
  });
}
