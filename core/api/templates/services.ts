/**
 * Public Template API Services
 */

import { apiClient } from "@/core/api/client";
import type {
  TemplatesResponse,
  TemplatesQueryParams,
  CategoriesResponse,
  LayoutsResponse,
  Template,
  TemplateReview,
  ReviewsResponse,
  PurchasesResponse,
} from "./types";

const BASE = "/api/v1/templates";

function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export async function getTemplates(
  params: TemplatesQueryParams = {}
): Promise<TemplatesResponse> {
  const qs = buildQueryString(params);
  return apiClient<TemplatesResponse>(`${BASE}${qs}`);
}

export async function getTemplateById(id: number): Promise<Template> {
  return apiClient<Template>(`${BASE}/${id}`);
}

export async function getTemplateBySlug(slug: string): Promise<Template> {
  return apiClient<Template>(`${BASE}/by-slug/${slug}`);
}

export async function downloadTemplate(
  id: number
): Promise<{ download_url: string }> {
  return apiClient<{ download_url: string }>(`${BASE}/${id}/download`, {
    method: "POST",
  });
}

export async function getCategories(): Promise<CategoriesResponse> {
  return apiClient<CategoriesResponse>(`${BASE}/categories`);
}

export async function getLayouts(): Promise<LayoutsResponse> {
  return apiClient<LayoutsResponse>(`${BASE}/layouts`);
}

export async function getTemplateReviews(
  templateId: number,
  params: { page?: number; per_page?: number } = {}
): Promise<ReviewsResponse> {
  const qs = buildQueryString(params);
  return apiClient<ReviewsResponse>(`${BASE}/${templateId}/reviews${qs}`);
}

export async function submitReview(
  templateId: number,
  data: { rating: number; title?: string; comment?: string }
): Promise<void> {
  return apiClient(`${BASE}/${templateId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReview(
  templateId: number,
  reviewId: number,
  data: { rating?: number; title?: string; comment?: string }
): Promise<TemplateReview> {
  return apiClient<TemplateReview>(
    `${BASE}/${templateId}/reviews/${reviewId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteReview(
  templateId: number,
  reviewId: number
): Promise<void> {
  return apiClient(`${BASE}/${templateId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

export async function getPurchasedTemplates(
  params: { booth_id: string; page?: number; per_page?: number }
): Promise<PurchasesResponse> {
  const qs = buildQueryString(params);
  return apiClient<PurchasesResponse>(`${BASE}/purchased${qs}`);
}
