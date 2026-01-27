/**
 * Admin Template API Services
 *
 * Service functions for admin template management.
 * Uses apiClient for JSON requests and dedicated upload route for file uploads.
 */

import { apiClient } from "@/core/api/client";
import type {
  AdminTemplate,
  AdminTemplatesResponse,
  AdminTemplatesQueryParams,
  AdminCategoriesResponse,
  AdminLayoutsResponse,
  AdminPresignRequest,
  AdminPresignResponse,
  AdminTemplateCreateRequest,
  AdminTemplateCreateResponse,
  AdminTemplateUpdateRequest,
  AdminTemplateDeleteResponse,
} from "./admin-types";

const TEMPLATES_BASE = "/api/v1/templates";

/**
 * Build query string from params object
 */
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

/**
 * Fetch all templates (admin endpoint)
 * Returns templates including drafts and archived
 */
export async function getAdminTemplates(
  params: AdminTemplatesQueryParams = {}
): Promise<AdminTemplatesResponse> {
  const queryString = buildQueryString(params);
  return apiClient<AdminTemplatesResponse>(
    `${TEMPLATES_BASE}/admin/all${queryString}`
  );
}

/**
 * Fetch a single template by ID
 */
export async function getAdminTemplate(id: number): Promise<AdminTemplate> {
  return apiClient<AdminTemplate>(`${TEMPLATES_BASE}/${id}`);
}

/**
 * Fetch all template categories
 * @param includeInactive - Include inactive categories (admin use)
 */
export async function getTemplateCategories(
  includeInactive = true
): Promise<AdminCategoriesResponse> {
  const queryString = buildQueryString({ include_inactive: includeInactive });
  return apiClient<AdminCategoriesResponse>(
    `${TEMPLATES_BASE}/categories${queryString}`
  );
}

/**
 * Fetch all template layouts
 * @param includeInactive - Include inactive layouts
 */
export async function getTemplateLayouts(
  includeInactive = true
): Promise<AdminLayoutsResponse> {
  const queryString = buildQueryString({ include_inactive: includeInactive });
  return apiClient<AdminLayoutsResponse>(
    `${TEMPLATES_BASE}/layouts${queryString}`
  );
}

/**
 * Step 1: Get presigned S3 upload URLs
 */
export async function getPresignedUrls(
  data: AdminPresignRequest
): Promise<AdminPresignResponse> {
  return apiClient<AdminPresignResponse>(`${TEMPLATES_BASE}/presign`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Step 2: Upload a file directly to S3 using a presigned URL
 */
export async function uploadFileToS3(url: string, file: File): Promise<void> {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.statusText}`);
  }
}

/**
 * Step 3: Create template record after files are uploaded to S3
 */
export async function createTemplate(
  data: AdminTemplateCreateRequest
): Promise<AdminTemplateCreateResponse> {
  return apiClient<AdminTemplateCreateResponse>(TEMPLATES_BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing template
 * @param id - Template ID
 * @param data - Fields to update (partial update)
 */
export async function updateTemplate(
  id: number,
  data: AdminTemplateUpdateRequest
): Promise<AdminTemplate> {
  return apiClient<AdminTemplate>(`${TEMPLATES_BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a template
 * @param id - Template ID
 */
export async function deleteTemplate(
  id: number
): Promise<AdminTemplateDeleteResponse> {
  return apiClient<AdminTemplateDeleteResponse>(`${TEMPLATES_BASE}/${id}`, {
    method: "DELETE",
  });
}

/**
 * Create a new category (admin)
 */
export async function createCategory(data: {
  name: string;
  description?: string;
  is_active?: boolean;
  is_premium?: boolean;
  sort_order?: number;
  is_seasonal_category?: boolean;
  season_start_date?: string;
  season_end_date?: string;
  seasonal_priority?: number;
}): Promise<{ id: number; name: string }> {
  return apiClient(`${TEMPLATES_BASE}/categories`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update a category (admin)
 */
export async function updateCategory(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    is_active: boolean;
    is_premium: boolean;
    sort_order: number;
    is_seasonal_category: boolean;
    season_start_date: string;
    season_end_date: string;
    seasonal_priority: number;
  }>
): Promise<{ id: number; name: string }> {
  return apiClient(`${TEMPLATES_BASE}/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a category (admin)
 */
export async function deleteCategory(id: number): Promise<void> {
  return apiClient(`${TEMPLATES_BASE}/categories/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get a single layout by ID
 */
export async function getTemplateLayout(
  id: string
): Promise<AdminLayoutsResponse["layouts"][0]> {
  return apiClient(`${TEMPLATES_BASE}/layouts/${id}`);
}

/**
 * Create a new layout (admin)
 */
export async function createLayout(data: {
  layout_key: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  photo_count: number;
  product_category_id: number;
  is_active?: boolean;
  sort_order?: number;
  photo_areas?: Array<{
    photo_index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    border_radius?: number;
    shape_type?: string;
  }>;
}): Promise<AdminLayoutsResponse["layouts"][0]> {
  return apiClient(`${TEMPLATES_BASE}/layouts`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update a layout (admin)
 */
export async function updateLayout(
  id: string,
  data: Partial<{
    layout_key: string;
    name: string;
    description: string;
    width: number;
    height: number;
    photo_count: number;
    product_category_id: number;
    is_active: boolean;
    sort_order: number;
  }>
): Promise<AdminLayoutsResponse["layouts"][0]> {
  return apiClient(`${TEMPLATES_BASE}/layouts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a layout (admin)
 */
export async function deleteLayout(id: string): Promise<void> {
  return apiClient(`${TEMPLATES_BASE}/layouts/${id}`, {
    method: "DELETE",
  });
}

/**
 * Set color config for a template (strip templates only)
 */
export async function setColorConfig(
  templateId: number,
  data: {
    is_enabled_for_color: boolean;
    logo_area_x: number;
    logo_area_y: number;
    logo_area_width: number;
    logo_area_height: number;
    logo_area_rotation?: number;
    logo_area_border_radius?: number;
    logo_area_shape_type?: string;
    logo_fit_mode?: string;
  }
): Promise<void> {
  return apiClient(`${TEMPLATES_BASE}/${templateId}/color-config`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete color config for a template
 */
export async function deleteColorConfig(templateId: number): Promise<void> {
  return apiClient(`${TEMPLATES_BASE}/${templateId}/color-config`, {
    method: "DELETE",
  });
}
