/**
 * Admin Template React Query Hooks
 *
 * React Query hooks for admin template management with caching and mutations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminTemplates,
  getAdminTemplate,
  getTemplateCategories,
  getTemplateLayouts,
  getPresignedUrls,
  uploadFileToS3,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "./admin-services";
import type {
  AdminTemplatesQueryParams,
  AdminTemplateCreateRequest,
  AdminTemplateUpdateRequest,
} from "./admin-types";

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
    mutationFn: async (data: {
      templateFile: File;
      previewFile: File;
      metadata: Omit<AdminTemplateCreateRequest, "template_s3_key" | "preview_s3_key">;
    }) => {
      // Step 1: Get presigned URLs
      const presign = await getPresignedUrls({
        template_filename: data.templateFile.name,
        preview_filename: data.previewFile.name,
      });

      // Step 2: Upload files to S3 in parallel
      await Promise.all([
        uploadFileToS3(presign.template_upload_url, data.templateFile),
        uploadFileToS3(presign.preview_upload_url, data.previewFile),
      ]);

      // Step 3: Create template record
      const createPayload = {
        ...data.metadata,
        template_s3_key: presign.template_s3_key,
        preview_s3_key: presign.preview_s3_key,
        file_size: data.templateFile.size,
      };
      console.log("[DEBUG] Create template payload:", JSON.stringify(createPayload, null, 2));
      const result = await createTemplate(createPayload);
      console.log("[DEBUG] Create template response:", JSON.stringify(result, null, 2));
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTemplateKeys.lists() });
    },
  });
}

/**
 * Hook to update a template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminTemplateUpdateRequest }) =>
      updateTemplate(id, data),
    onSuccess: (updatedTemplate) => {
      // Update the specific template in cache
      queryClient.setQueryData(
        adminTemplateKeys.detail(updatedTemplate.id),
        updatedTemplate
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
      queryClient.removeQueries({ queryKey: adminTemplateKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: adminTemplateKeys.lists() });
    },
  });
}
