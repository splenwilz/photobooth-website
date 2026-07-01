/**
 * Admin Template React Query Hooks
 *
 * React Query hooks for admin template management with caching and mutations.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addPhotoAreaToLayout,
	broadcastSyncCategories,
	broadcastSyncLayouts,
	broadcastSyncTemplates,
	createCategory,
	createLayout,
	createTemplate,
	deleteCategory,
	deleteLayout,
	deletePhotoArea,
	deleteTemplate,
	getAdminTemplate,
	getAdminTemplates,
	getPresignedUrls,
	getTemplateCategories,
	getTemplateLayout,
	getTemplateLayouts,
	updateCategory,
	updateLayout,
	updatePhotoArea,
	updateTemplate,
} from "./admin-services";
import type {
	AdminTemplateCreateRequest,
	AdminTemplatesQueryParams,
	AdminTemplateUpdateRequest,
} from "./admin-types";
import { myTemplateKeys } from "./me-queries";
import { buildUpdateUploadPayload, runTemplateUploadFlow } from "./upload-flow";

// Query keys for cache management
export const adminTemplateKeys = {
	all: ["admin-templates"] as const,
	lists: () => [...adminTemplateKeys.all, "list"] as const,
	list: (params: AdminTemplatesQueryParams) =>
		[...adminTemplateKeys.lists(), params] as const,
	details: () => [...adminTemplateKeys.all, "detail"] as const,
	detail: (id: number) => [...adminTemplateKeys.details(), id] as const,
	categories: ["admin-template-categories"] as const,
	layouts: ["admin-template-layouts"] as const,
};

/**
 * Hook to fetch admin templates with pagination and filters
 */
export function useAdminTemplates(params: AdminTemplatesQueryParams = {}) {
	return useQuery({
		queryKey: adminTemplateKeys.list(params),
		queryFn: () => getAdminTemplates(params),
		staleTime: 60 * 1000, // 1 minute
	});
}

/**
 * Hook to fetch a single template
 */
export function useAdminTemplate(id: number) {
	return useQuery({
		queryKey: adminTemplateKeys.detail(id),
		queryFn: () => getAdminTemplate(id),
		enabled: id > 0,
		staleTime: 60 * 1000,
	});
}

/**
 * Hook to fetch template categories
 */
export function useTemplateCategories(includeInactive = true) {
	return useQuery({
		queryKey: [...adminTemplateKeys.categories, { includeInactive }],
		queryFn: () => getTemplateCategories(includeInactive),
		staleTime: 5 * 60 * 1000, // 5 minutes (categories don't change often)
	});
}

/**
 * Hook to fetch template layouts
 */
export function useTemplateLayouts(includeInactive = true) {
	return useQuery({
		queryKey: [...adminTemplateKeys.layouts, { includeInactive }],
		queryFn: () => getTemplateLayouts(includeInactive),
		staleTime: 5 * 60 * 1000, // 5 minutes (layouts don't change often)
	});
}

/**
 * Hook to create a new template via presigned S3 upload
 *
 * Orchestrates the 3-step flow:
 * 1. Get presigned URLs from backend
 * 2. Upload files directly to S3 (parallel)
 * 3. Create template record with S3 keys
 */
export function useCreateTemplate() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			templateFile: File;
			previewFile: File;
			overlayFile?: File;
			metadata: Omit<
				AdminTemplateCreateRequest,
				"template_s3_key" | "preview_s3_key" | "overlay_s3_key"
			>;
		}) =>
			runTemplateUploadFlow({
				...data,
				presignFn: getPresignedUrls,
				createFn: createTemplate,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.lists() });
		},
	});
}

/**
 * Hook to update a template
 *
 * Supports optional file replacement: if files are provided, they are uploaded
 * to S3 via presigned URLs before patching the template record with new S3 keys.
 */
export function useUpdateTemplate() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
			templateFile,
			previewFile,
			overlayFile,
			removeOverlay,
		}: {
			id: number;
			data: AdminTemplateUpdateRequest;
			templateFile?: File;
			previewFile?: File;
			overlayFile?: File;
			removeOverlay?: boolean;
		}) => {
			const updatePayload = await buildUpdateUploadPayload({
				templateFile,
				previewFile,
				overlayFile,
				removeOverlay,
				basePayload: { ...data },
				presignFn: getPresignedUrls,
			});
			return updateTemplate(id, updatePayload);
		},
		onSuccess: (updatedTemplate) => {
			// Update the specific template in cache
			queryClient.setQueryData(
				adminTemplateKeys.detail(updatedTemplate.id),
				updatedTemplate,
			);
			// Invalidate lists to reflect changes
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.lists() });
		},
	});
}

/**
 * Hook to delete a template
 */
export function useDeleteTemplate() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteTemplate(id),
		onSuccess: (_, deletedId) => {
			// Remove from detail cache
			queryClient.removeQueries({
				queryKey: adminTemplateKeys.detail(deletedId),
			});
			// Invalidate lists
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.lists() });
		},
	});
}

// ============================================================================
// CATEGORY HOOKS
// ============================================================================

/**
 * Hook to create a category
 */
export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Parameters<typeof createCategory>[0]) =>
			createCategory(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.categories });
			// Also nudge the user-side cache so dashboard pickers and lists
			// pick up the change without waiting out the 5-min staleTime.
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.categories });
		},
	});
}

/**
 * Hook to update a category
 */
export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Parameters<typeof updateCategory>[1];
		}) => updateCategory(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.categories });
			// Also nudge the user-side cache so dashboard pickers and lists
			// pick up the change without waiting out the 5-min staleTime.
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.categories });
		},
	});
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.categories });
			// Also nudge the user-side cache so dashboard pickers and lists
			// pick up the change without waiting out the 5-min staleTime.
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.categories });
		},
	});
}

// ============================================================================
// LAYOUT HOOKS
// ============================================================================

/**
 * Hook to fetch a single layout
 */
export function useTemplateLayout(id: string) {
	return useQuery({
		queryKey: [...adminTemplateKeys.layouts, "detail", id],
		queryFn: () => getTemplateLayout(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
	});
}

/**
 * Hook to create a layout
 */
export function useCreateLayout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Parameters<typeof createLayout>[0]) =>
			createLayout(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.layouts });
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

/**
 * Hook to update a layout
 */
export function useUpdateLayout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Parameters<typeof updateLayout>[1];
		}) => updateLayout(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.layouts });
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

/**
 * Hook to delete a layout
 */
export function useDeleteLayout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteLayout(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.layouts });
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

/**
 * Hook to add a photo area to a layout
 */
export function useAddPhotoArea() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			layoutId,
			data,
		}: {
			layoutId: string;
			data: Parameters<typeof addPhotoAreaToLayout>[1];
		}) => addPhotoAreaToLayout(layoutId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.layouts });
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

/**
 * Hook to update a photo area
 */
export function useUpdatePhotoArea() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			layoutId,
			photoAreaId,
			data,
		}: {
			layoutId: string;
			photoAreaId: number;
			data: Parameters<typeof updatePhotoArea>[2];
		}) => updatePhotoArea(layoutId, photoAreaId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.layouts });
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

/**
 * Hook to delete a photo area
 */
export function useDeletePhotoArea() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			layoutId,
			photoAreaId,
		}: {
			layoutId: string;
			photoAreaId: number;
		}) => deletePhotoArea(layoutId, photoAreaId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminTemplateKeys.layouts });
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

// ============================================================================
// BROADCAST SYNC HOOKS
// ============================================================================

/**
 * Hook to broadcast sync layouts to all booths
 */
export function useBroadcastSyncLayouts() {
	return useMutation({
		mutationFn: () => broadcastSyncLayouts(),
	});
}

/**
 * Hook to broadcast sync categories to all booths
 */
export function useBroadcastSyncCategories() {
	return useMutation({
		mutationFn: () => broadcastSyncCategories(),
	});
}

/**
 * Hook to broadcast sync templates to all booths
 */
export function useBroadcastSyncTemplates() {
	return useMutation({
		mutationFn: () => broadcastSyncTemplates(),
	});
}
