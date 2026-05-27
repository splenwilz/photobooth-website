/**
 * My Content (user-private) Template React Query Hooks
 *
 * Mirrors admin-queries.ts against the /api/v1/me/* surface. Separate
 * query-key namespace (myTemplateKeys) so user mutations don't invalidate
 * admin caches and vice versa.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addMyPhotoAreaToLayout,
	createMyCategory,
	createMyLayout,
	createMyTemplate,
	deleteMyCategory,
	deleteMyColorConfig,
	deleteMyLayout,
	deleteMyPhotoArea,
	deleteMyTemplate,
	getMyCategories,
	getMyLayouts,
	getMyPresignedUrls,
	getMyTemplates,
	setMyColorConfig,
	updateMyCategory,
	updateMyLayout,
	updateMyPhotoArea,
	updateMyTemplate,
} from "./me-services";
import type {
	MyCategoryRequest,
	MyColorConfigRequest,
	MyLayoutRequest,
	MyTemplateCreateRequest,
	MyTemplatesQueryParams,
	MyTemplateUpdateRequest,
} from "./me-types";
import { buildUpdateUploadPayload, runTemplateUploadFlow } from "./upload-flow";

export const myTemplateKeys = {
	all: ["my-templates"] as const,
	lists: () => [...myTemplateKeys.all, "list"] as const,
	list: (params: MyTemplatesQueryParams) =>
		[...myTemplateKeys.lists(), params] as const,
	details: () => [...myTemplateKeys.all, "detail"] as const,
	detail: (id: number) => [...myTemplateKeys.details(), id] as const,
	categories: ["my-template-categories"] as const,
	layouts: ["my-template-layouts"] as const,
};

// ============================================================================
// TEMPLATES
// ============================================================================

export function useMyTemplates(params: MyTemplatesQueryParams = {}) {
	return useQuery({
		queryKey: myTemplateKeys.list(params),
		queryFn: () => getMyTemplates(params),
		staleTime: 60 * 1000,
	});
}

// Detail-key plumbing (myTemplateKeys.detail, setQueryData in mutation onSuccess)
// is kept for forward use when a per-template view is added. There is no
// useMyTemplate(id) consumer today.

export function useCreateMyTemplate() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			templateFile: File;
			previewFile: File;
			overlayFile?: File;
			metadata: Omit<
				MyTemplateCreateRequest,
				"template_s3_key" | "preview_s3_key" | "overlay_s3_key"
			>;
		}) =>
			runTemplateUploadFlow({
				...data,
				presignFn: getMyPresignedUrls,
				createFn: createMyTemplate,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.lists() });
		},
	});
}

export function useUpdateMyTemplate() {
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
			data: MyTemplateUpdateRequest;
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
				presignFn: getMyPresignedUrls,
			});
			return updateMyTemplate(id, updatePayload);
		},
		onSuccess: (updatedTemplate) => {
			queryClient.setQueryData(
				myTemplateKeys.detail(updatedTemplate.id),
				updatedTemplate,
			);
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.lists() });
		},
	});
}

export function useDeleteMyTemplate() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteMyTemplate(id),
		onSuccess: (_, deletedId) => {
			queryClient.removeQueries({ queryKey: myTemplateKeys.detail(deletedId) });
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.lists() });
		},
	});
}

export function useSetMyColorConfig() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			templateId,
			data,
		}: {
			templateId: number;
			data: MyColorConfigRequest;
		}) => setMyColorConfig(templateId, data),
		onSuccess: (_, { templateId }) => {
			queryClient.invalidateQueries({
				queryKey: myTemplateKeys.detail(templateId),
			});
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.lists() });
		},
	});
}

export function useDeleteMyColorConfig() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (templateId: number) => deleteMyColorConfig(templateId),
		onSuccess: (_, templateId) => {
			queryClient.invalidateQueries({
				queryKey: myTemplateKeys.detail(templateId),
			});
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.lists() });
		},
	});
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Fetch the caller's private categories. Pass `{ includeGlobal: true }` to
 * also receive all active global ones in the same call — used by template
 * picker dropdowns. Each row's `owner_id` distinguishes the two.
 */
export function useMyCategories(options: { includeGlobal?: boolean } = {}) {
	const includeGlobal = options.includeGlobal ?? false;
	return useQuery({
		queryKey: [...myTemplateKeys.categories, { includeGlobal }],
		queryFn: () => getMyCategories({ includeGlobal }),
		staleTime: 5 * 60 * 1000,
	});
}

export function useCreateMyCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: MyCategoryRequest) => createMyCategory(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.categories });
		},
	});
}

export function useUpdateMyCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: Partial<MyCategoryRequest>;
		}) => updateMyCategory(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.categories });
		},
	});
}

export function useDeleteMyCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteMyCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.categories });
		},
	});
}

// ============================================================================
// LAYOUTS
// ============================================================================

/**
 * Fetch the caller's private layouts. Pass `{ includeGlobal: true }` to also
 * receive all active global layouts. See `useMyCategories` for the `owner_id`
 * semantics on union responses.
 */
export function useMyLayouts(options: { includeGlobal?: boolean } = {}) {
	const includeGlobal = options.includeGlobal ?? false;
	return useQuery({
		queryKey: [...myTemplateKeys.layouts, { includeGlobal }],
		queryFn: () => getMyLayouts({ includeGlobal }),
		staleTime: 5 * 60 * 1000,
	});
}

export function useCreateMyLayout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: MyLayoutRequest) => createMyLayout(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

export function useUpdateMyLayout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Partial<MyLayoutRequest>;
		}) => updateMyLayout(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

export function useDeleteMyLayout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteMyLayout(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

export function useAddMyPhotoArea() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			layoutId,
			data,
		}: {
			layoutId: string;
			data: Parameters<typeof addMyPhotoAreaToLayout>[1];
		}) => addMyPhotoAreaToLayout(layoutId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

export function useUpdateMyPhotoArea() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			layoutId,
			photoAreaId,
			data,
		}: {
			layoutId: string;
			photoAreaId: number;
			data: Parameters<typeof updateMyPhotoArea>[2];
		}) => updateMyPhotoArea(layoutId, photoAreaId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}

export function useDeleteMyPhotoArea() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			layoutId,
			photoAreaId,
		}: {
			layoutId: string;
			photoAreaId: number;
		}) => deleteMyPhotoArea(layoutId, photoAreaId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: myTemplateKeys.layouts });
		},
	});
}
