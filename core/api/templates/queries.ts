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
import type { TemplatesQueryParams } from "./types";

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
