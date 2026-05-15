/**
 * My Content (user-private) Template API Types
 *
 * Types for the /api/v1/me/* endpoints. Schemas match the admin API
 * (re-aliased here for self-documenting call sites). Request types omit
 * server-forced fields (owner_id, status, price, is_featured, sort_order)
 * so user-facing forms can't accidentally surface them.
 */

import type {
	AdminCategoriesResponse,
	AdminCategoryRequest,
	AdminColorConfigRequest,
	AdminLayoutRequest,
	AdminLayoutsResponse,
	AdminLogoFitMode,
	AdminPhotoArea,
	AdminPresignRequest,
	AdminPresignResponse,
	AdminShapeType,
	AdminTemplate,
	AdminTemplateCategory,
	AdminTemplateColorConfig,
	AdminTemplateCreateRequest,
	AdminTemplateCreateResponse,
	AdminTemplateLayout,
	AdminTemplateStatus,
	AdminTemplatesQueryParams,
	AdminTemplatesResponse,
	AdminTemplateType,
	AdminTemplateUpdateRequest,
} from "./admin-types";

export type MyTemplateStatus = AdminTemplateStatus;
export type MyTemplateType = AdminTemplateType;
export type MyShapeType = AdminShapeType;
export type MyLogoFitMode = AdminLogoFitMode;

export type MyTemplate = AdminTemplate;
export type MyTemplateCategory = AdminTemplateCategory;
export type MyTemplateLayout = AdminTemplateLayout;
export type MyPhotoArea = AdminPhotoArea;
export type MyTemplateColorConfig = AdminTemplateColorConfig;

export type MyTemplatesResponse = AdminTemplatesResponse;
export type MyCategoriesResponse = AdminCategoriesResponse;
export type MyLayoutsResponse = AdminLayoutsResponse;
export type MyTemplateCreateResponse = AdminTemplateCreateResponse;
export type MyTemplatesQueryParams = AdminTemplatesQueryParams;

export type MyPresignRequest = AdminPresignRequest;
export type MyPresignResponse = AdminPresignResponse;

/**
 * Forced server-side: status="active", price=0, sort_order=0, owner_id=current user.
 * Stripped from the TS contract as defense-in-depth.
 */
export type MyTemplateCreateRequest = Omit<
	AdminTemplateCreateRequest,
	"status" | "price" | "sort_order"
>;

/**
 * PATCH on /me/templates strips status/price/sort_order/is_active server-side.
 * Stripped here too so the user-facing edit form can't try to send them.
 */
export type MyTemplateUpdateRequest = Omit<
	AdminTemplateUpdateRequest,
	"status" | "price" | "sort_order" | "is_active"
>;

/**
 * Categories and layouts have no forced fields beyond owner_id (which the
 * server attaches from the JWT, never from the body). User UI hides
 * is_active/is_premium for categories — those are marketplace concepts —
 * but the request shape is otherwise the same.
 */
export type MyCategoryRequest = Omit<
	AdminCategoryRequest,
	"is_premium" | "is_active" | "sort_order"
>;
export type MyLayoutRequest = AdminLayoutRequest;
export type MyColorConfigRequest = AdminColorConfigRequest;
