/**
 * My Content (user-private) Template API Services
 *
 * Service functions for the /api/v1/me/* endpoints. Mirrors admin-services.ts
 * shape but routes through the owner-scoped surface. Auth is the same WorkOS
 * JWT — apiClient handles it transparently. The backend forces
 * owner_id/status/price/is_featured server-side.
 *
 * S3 keys for uploads are namespaced under user-templates/<user_id>/ — that
 * namespacing is server-controlled (returned in the presign response); the
 * client never constructs keys.
 */

import { apiClient } from "@/core/api/client";
import { uploadFileToS3 } from "./admin-services";
import type {
	MyCategoriesResponse,
	MyCategoryRequest,
	MyColorConfigRequest,
	MyLayoutRequest,
	MyLayoutsResponse,
	MyPresignRequest,
	MyPresignResponse,
	MyTemplate,
	MyTemplateCreateRequest,
	MyTemplateCreateResponse,
	MyTemplateLayout,
	MyTemplatesQueryParams,
	MyTemplatesResponse,
	MyTemplateUpdateRequest,
} from "./me-types";

const ME_BASE = "/api/v1/me";

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

// ============================================================================
// TEMPLATES
// ============================================================================

export async function getMyTemplates(
	params: MyTemplatesQueryParams = {},
): Promise<MyTemplatesResponse> {
	const queryString = buildQueryString(params);
	return apiClient<MyTemplatesResponse>(`${ME_BASE}/templates${queryString}`);
}

export async function getMyTemplate(id: number): Promise<MyTemplate> {
	return apiClient<MyTemplate>(`${ME_BASE}/templates/${id}`);
}

export async function getMyPresignedUrls(
	data: MyPresignRequest,
): Promise<MyPresignResponse> {
	return apiClient<MyPresignResponse>(`${ME_BASE}/templates/presign`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function createMyTemplate(
	data: MyTemplateCreateRequest,
): Promise<MyTemplateCreateResponse> {
	return apiClient<MyTemplateCreateResponse>(`${ME_BASE}/templates`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateMyTemplate(
	id: number,
	data: MyTemplateUpdateRequest,
): Promise<MyTemplate> {
	return apiClient<MyTemplate>(`${ME_BASE}/templates/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function deleteMyTemplate(id: number): Promise<void> {
	return apiClient(`${ME_BASE}/templates/${id}`, { method: "DELETE" });
}

export async function setMyColorConfig(
	templateId: number,
	data: MyColorConfigRequest,
): Promise<void> {
	return apiClient(`${ME_BASE}/templates/${templateId}/color-config`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function deleteMyColorConfig(templateId: number): Promise<void> {
	return apiClient(`${ME_BASE}/templates/${templateId}/color-config`, {
		method: "DELETE",
	});
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * List the caller's private categories. Pass `includeGlobal: true` to also
 * include all active admin/global categories in the same response — used by
 * picker dropdowns where both are valid choices. Each row's `owner_id`
 * distinguishes the two: null = global ("Built-in"), non-null = caller-private
 * ("Custom"). On the union path the server filters both halves to active rows.
 */
export async function getMyCategories(
	options: { includeGlobal?: boolean } = {},
): Promise<MyCategoriesResponse> {
	const queryString = options.includeGlobal ? "?include_global=true" : "";
	return apiClient<MyCategoriesResponse>(
		`${ME_BASE}/categories${queryString}`,
	);
}

export async function createMyCategory(
	data: MyCategoryRequest,
): Promise<{ id: number; name: string }> {
	return apiClient(`${ME_BASE}/categories`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateMyCategory(
	id: number,
	data: Partial<MyCategoryRequest>,
): Promise<{ id: number; name: string }> {
	return apiClient(`${ME_BASE}/categories/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function deleteMyCategory(id: number): Promise<void> {
	return apiClient(`${ME_BASE}/categories/${id}`, {
		method: "DELETE",
	});
}

// ============================================================================
// LAYOUTS
// ============================================================================

/**
 * List the caller's private layouts. Pass `includeGlobal: true` to also
 * include all active admin/global layouts. Same `owner_id` semantics and
 * active-only union behavior as `getMyCategories`.
 */
export async function getMyLayouts(
	options: { includeGlobal?: boolean } = {},
): Promise<MyLayoutsResponse> {
	const queryString = options.includeGlobal ? "?include_global=true" : "";
	return apiClient<MyLayoutsResponse>(`${ME_BASE}/layouts${queryString}`);
}

export async function createMyLayout(
	data: MyLayoutRequest,
): Promise<MyTemplateLayout> {
	return apiClient(`${ME_BASE}/layouts`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateMyLayout(
	id: string,
	data: Partial<MyLayoutRequest>,
): Promise<MyTemplateLayout> {
	return apiClient(`${ME_BASE}/layouts/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function deleteMyLayout(id: string): Promise<void> {
	return apiClient(`${ME_BASE}/layouts/${id}`, {
		method: "DELETE",
	});
}

// ============================================================================
// PHOTO AREAS
// ============================================================================

export async function addMyPhotoAreaToLayout(
	layoutId: string,
	data: {
		photo_index: number;
		x: number;
		y: number;
		width: number;
		height: number;
		rotation?: number;
		border_radius?: number;
		shape_type?: string;
	},
): Promise<{ id: number; layout_id: string }> {
	return apiClient(`${ME_BASE}/layouts/${layoutId}/photo-areas`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateMyPhotoArea(
	layoutId: string,
	photoAreaId: number,
	data: Partial<{
		photo_index: number;
		x: number;
		y: number;
		width: number;
		height: number;
		rotation: number;
		border_radius: number;
		shape_type: string;
	}>,
): Promise<{ id: number; layout_id: string }> {
	return apiClient(
		`${ME_BASE}/layouts/${layoutId}/photo-areas/${photoAreaId}`,
		{
			method: "PATCH",
			body: JSON.stringify(data),
		},
	);
}

export async function deleteMyPhotoArea(
	layoutId: string,
	photoAreaId: number,
): Promise<void> {
	return apiClient(
		`${ME_BASE}/layouts/${layoutId}/photo-areas/${photoAreaId}`,
		{ method: "DELETE" },
	);
}

// Re-export the S3 upload helper so callers don't need to import from
// admin-services. Behaviorally identical — it just PUTs bytes to S3.
export { uploadFileToS3 };
