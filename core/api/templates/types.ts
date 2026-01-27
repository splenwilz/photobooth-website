/**
 * Public Template Types
 *
 * Types matching the backend Template API for the public marketplace.
 * Uses the same model as AdminTemplate but exposed for public components.
 */

export type TemplateType = "strip" | "photo_4x6";

export interface TemplateCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  is_premium: boolean;
  sort_order: number;
  is_seasonal_category: boolean;
  season_start_date: string | null;
  season_end_date: string | null;
  seasonal_priority: number;
  created_at: string;
}

export interface TemplateLayout {
  id: string;
  layout_key: string;
  name: string;
  description: string;
  width: number;
  height: number;
  photo_count: number;
  product_category_id: number;
  is_active: boolean;
  sort_order: number;
  photo_areas: TemplatePhotoArea[];
  created_at: string;
}

export interface TemplatePhotoArea {
  id: number;
  layout_id: string;
  photo_index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  border_radius: number;
  shape_type: string;
}

export interface Template {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number;
  category: TemplateCategory;
  layout_id: string | null;
  layout: TemplateLayout | null;
  template_type: TemplateType;
  status: string;
  is_active: boolean;
  sort_order: number;
  price: string;
  original_price: string | null;
  file_size: number;
  file_type: string;
  original_filename: string;
  width: number | null;
  height: number | null;
  tags: string | null;
  is_featured: boolean;
  is_new: boolean;
  download_count: number;
  rating_average: string;
  review_count: number;
  download_url: string;
  preview_url: string;
  color_config: unknown;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TemplatesResponse {
  templates: Template[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface TemplatesQueryParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  layout_id?: string;
  template_type?: TemplateType;
  is_featured?: boolean;
  is_new?: boolean;
  is_free?: boolean;
  sort_by?: string;
  search?: string;
}

export interface CategoriesResponse {
  categories: TemplateCategory[];
  total: number;
}

export interface LayoutsResponse {
  layouts: TemplateLayout[];
  total: number;
}

export interface TemplateReview {
  id: number;
  template_id: number;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface ReviewsResponse {
  reviews: TemplateReview[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Purchase types
export interface TemplatePurchase {
  id: number;
  template_id: number;
  template: Template;
  quantity: number;
  amount_paid: string;
  payment_intent_id: string;
  checkout_session_id: string;
  purchased_at: string;
}

export interface PurchasesResponse {
  purchases: TemplatePurchase[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Cart types (client-side only)
export interface CartItem {
  template: Template;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}
