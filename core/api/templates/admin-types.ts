/**
 * Admin Template API Types
 *
 * Types matching the backend Template API for admin operations.
 */

// Template status from backend
export type AdminTemplateStatus = "draft" | "active" | "archived";

// Template type from backend
export type AdminTemplateType = "strip" | "photo_4x6";

// Photo area shape types
export type AdminShapeType = "rectangle" | "rounded_rectangle" | "circle" | "heart" | "petal";

// Logo fit modes for color config
export type AdminLogoFitMode = "fill" | "fit" | "center";

/**
 * Template Category from backend (seasonal categories)
 */
export interface AdminTemplateCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  is_premium: boolean;
  sort_order: number;
  is_seasonal_category: boolean;
  season_start_date: string | null; // "MM-DD" format
  season_end_date: string | null; // "MM-DD" format
  seasonal_priority: number;
  created_at: string;
}

/**
 * Photo area within a layout
 */
export interface AdminPhotoArea {
  id: number;
  layout_id: string;
  photo_index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  border_radius: number;
  shape_type: AdminShapeType;
}

/**
 * Template Layout from backend (with photo areas)
 */
export interface AdminTemplateLayout {
  id: string; // UUID
  layout_key: string;
  name: string;
  description: string;
  width: number;
  height: number;
  photo_count: number;
  product_category_id: number; // 1=Strips, 2=4x6, 3=Smartphone
  is_active: boolean;
  sort_order: number;
  photo_areas: AdminPhotoArea[];
  created_at: string;
}

/**
 * Color configuration for strip templates (logo placement)
 */
export interface AdminTemplateColorConfig {
  id: number;
  template_id: number;
  is_enabled_for_color: boolean;
  logo_area_x: number;
  logo_area_y: number;
  logo_area_width: number;
  logo_area_height: number;
  logo_area_rotation: number;
  logo_area_border_radius: number;
  logo_area_shape_type: AdminShapeType;
  logo_fit_mode: AdminLogoFitMode;
}

/**
 * Template from backend
 */
export interface AdminTemplate {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category: AdminTemplateCategory;
  layout_id: string;
  layout: AdminTemplateLayout;
  template_type: AdminTemplateType;
  status: AdminTemplateStatus;
  is_active: boolean;
  sort_order: number;
  price: string; // decimal as string (e.g., "9.99")
  file_size: number;
  file_type: string;
  original_filename: string;
  width: number | null;
  height: number | null;
  tags: string; // comma-separated
  download_url: string;
  preview_url: string;
  color_config: AdminTemplateColorConfig | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/**
 * Paginated templates response
 */
export interface AdminTemplatesResponse {
  templates: AdminTemplate[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Categories list response
 */
export interface AdminCategoriesResponse {
  categories: AdminTemplateCategory[];
  total: number;
}

/**
 * Layouts list response
 */
export interface AdminLayoutsResponse {
  layouts: AdminTemplateLayout[];
  total: number;
}

/**
 * Presigned URL request (Step 1 of upload)
 */
export interface AdminPresignRequest {
  template_filename: string;
  preview_filename: string;
}

/**
 * Presigned URL response
 */
export interface AdminPresignResponse {
  template_upload_url: string;
  template_s3_key: string;
  preview_upload_url: string;
  preview_s3_key: string;
  expires_in: number;
}

/**
 * Template create request (Step 3 of upload — after S3 upload)
 */
export interface AdminTemplateCreateRequest {
  template_s3_key: string;
  preview_s3_key: string;
  name: string;
  description?: string;
  category_id?: number;
  layout_id?: string;
  template_type?: AdminTemplateType;
  status?: AdminTemplateStatus;
  price?: string;
  sort_order?: number;
  tags?: string;
  width?: number;
  height?: number;
  file_size?: number;
}

/**
 * Template create response
 */
export interface AdminTemplateCreateResponse {
  success: boolean;
  template: AdminTemplate;
  message: string;
}

/**
 * Template update request (partial update)
 */
export interface AdminTemplateUpdateRequest {
  name?: string;
  description?: string;
  category_id?: number;
  layout_id?: string;
  template_type?: AdminTemplateType;
  status?: AdminTemplateStatus;
  is_active?: boolean;
  sort_order?: number;
  price?: string;
  tags?: string;
  width?: number;
  height?: number;
}

/**
 * Template delete response
 */
export interface AdminTemplateDeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Query parameters for fetching templates
 */
export interface AdminTemplatesQueryParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  layout_id?: string;
  template_type?: AdminTemplateType;
  status?: AdminTemplateStatus;
}

/**
 * Category create/update request
 */
export interface AdminCategoryRequest {
  name: string;
  description?: string;
  is_active?: boolean;
  is_premium?: boolean;
  sort_order?: number;
  is_seasonal_category?: boolean;
  season_start_date?: string;
  season_end_date?: string;
  seasonal_priority?: number;
}

/**
 * Layout create request
 */
export interface AdminLayoutRequest {
  layout_key: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  photo_count: number;
  product_category_id: number;
  is_active?: boolean;
  sort_order?: number;
  photo_areas?: Omit<AdminPhotoArea, "id" | "layout_id">[];
}

/**
 * Color config request
 */
export interface AdminColorConfigRequest {
  is_enabled_for_color: boolean;
  logo_area_x: number;
  logo_area_y: number;
  logo_area_width: number;
  logo_area_height: number;
  logo_area_rotation?: number;
  logo_area_border_radius?: number;
  logo_area_shape_type?: AdminShapeType;
  logo_fit_mode?: AdminLogoFitMode;
}
