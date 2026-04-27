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

/**
 * Lean shape returned by the catalog list endpoint (`GET /templates`).
 * The detail endpoints (`/templates/{id}`, `/templates/by-slug/{slug}`)
 * return the full `Template`, which extends this with the heavy
 * category/layout objects, file metadata, and audit fields.
 *
 * The catalog grid + Quick View modal both render purely from this lean
 * shape — no detail-endpoint roundtrip needed.
 */
export interface TemplateListItem {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  template_type: TemplateType;
  price: string;
  original_price: string | null;
  tags: string | null;
  is_new: boolean;
  rating_average: string;
  review_count: number;
  download_count: number;
  // Nullable on catalog endpoints when the viewer doesn't own the paid
  // template (anonymous, signed-in non-owner). Always set for free
  // templates and for owners. Use `download_url != null` as a "viewable
  // by this user" check; don't rely on it for paid-vs-free (use price).
  download_url: string | null;
  preview_url: string;
  overlay_url: string | null;
  // Flat references — full nested objects only on the detail response.
  // All three are nullable to match the backend's `Optional[…]` schema
  // (a template can theoretically have no category and no layout).
  category_id: number | null;
  layout_id: string | null;
  layout_photo_count: number | null;
}

/**
 * Full template returned by the detail endpoints. Adds heavy fields the
 * catalog grid doesn't need (full nested category/layout, file metadata,
 * audit timestamps, admin-only flags).
 */
export interface Template extends TemplateListItem {
  category: TemplateCategory | null;
  layout: TemplateLayout | null;
  status: string;
  is_active: boolean;
  sort_order: number;
  file_size: number;
  file_type: string;
  original_filename: string;
  width: number | null;
  height: number | null;
  is_featured: boolean;
  color_config: unknown;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TemplatesResponse {
  templates: TemplateListItem[];
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
  // Display name and avatar are populated server-side from a cached
  // WorkOS lookup (10-min TTL, deduped across reviewers). Both can be
  // null when the WorkOS user has no name/picture set, or when the
  // lookup fails — render with neutral fallbacks rather than fabricating
  // a value. Format: "First L." (privacy-respecting initial-only surname).
  reviewer_display_name: string | null;
  reviewer_avatar_url: string | null;
  // True when the current authenticated viewer authored this review.
  // Always false for anonymous viewers. Pure UX hint — the backend
  // enforces ownership on PATCH/DELETE regardless of this flag.
  is_own_review: boolean;
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
  booth_id: string;
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

// Membership-check endpoint: which of these template_ids does the
// supplied booth already own? Bounded by request size, no pagination.
// See POST /api/v1/templates/owned-from.
export interface OwnedFromRequest {
  booth_id: string;
  template_ids: number[];
}

export interface OwnedFromResponse {
  owned_template_ids: number[];
}

// Cart types (client-side only). Cart items are sourced from the catalog
// grid, which only has the lean shape — no detail roundtrip needed.
export interface CartItem {
  template: TemplateListItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}
