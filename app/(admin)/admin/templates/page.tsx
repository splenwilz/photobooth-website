"use client";

/**
 * Admin Templates Management Page
 *
 * Manage template marketplace content with CRUD operations.
 * Includes sub-tabs for Templates, Categories, and Layouts management.
 */

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  useAdminTemplates,
  useTemplateCategories,
  useTemplateLayouts,
  useDeleteTemplate,
  useUpdateTemplate,
  useDeleteCategory,
  useUpdateLayout,
  useDeleteLayout,
  useDeletePhotoArea,
  useBroadcastSyncCategories,
  useBroadcastSyncLayouts,
  useBroadcastSyncTemplates,
  adminTemplateKeys,
} from "@/core/api/templates/admin-queries";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/core/api/client";
import type {
  AdminTemplate,
  AdminTemplateCategory,
  AdminTemplateLayout,
  AdminTemplateStatus,
  AdminTemplateType,
  AdminTemplatesQueryParams,
  AdminLayoutsResponse,
  AdminPhotoArea,
} from "@/core/api/templates/admin-types";
import { serializeLayoutForClipboard } from "@/core/templates/layout-clipboard";
import { TemplateFormModal } from "@/components/templates/forms/TemplateFormModal";
import { CategoryFormModal } from "@/components/templates/forms/CategoryFormModal";
import { LayoutFormModal } from "@/components/templates/forms/LayoutFormModal";
import { PhotoAreaFormModal } from "@/components/templates/forms/PhotoAreaFormModal";

// ============================================================================
// TYPES
// ============================================================================

type ActiveTab = "templates" | "categories" | "layouts";
type FilterStatus = "all" | AdminTemplateStatus;
type FilterCategory = "all" | number;
type FilterTemplateType = "all" | AdminTemplateType;

// ============================================================================
// UTILITIES
// ============================================================================

function formatCurrency(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminTemplatesPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>("templates");

  // Template filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterTemplateType, setFilterTemplateType] = useState<FilterTemplateType>("all");
  const [page, setPage] = useState(1);
  const perPage = 20;

  // Template modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);
  const [isDeleteTemplateModalOpen, setIsDeleteTemplateModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<AdminTemplate | null>(null);
  const [deleteTemplateError, setDeleteTemplateError] = useState<string | null>(null);

  // Category state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminTemplateCategory | null>(null);
  const [deleteCategoryConfirmId, setDeleteCategoryConfirmId] = useState<number | null>(null);

  // Layout state
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState<AdminTemplateLayout | null>(null);
  const [deleteLayoutConfirmId, setDeleteLayoutConfirmId] = useState<string | null>(null);
  const [expandedLayoutId, setExpandedLayoutId] = useState<string | null>(null);
  const [photoAreaModalLayoutId, setPhotoAreaModalLayoutId] = useState<string | null>(null);
  const [editingPhotoAreaState, setEditingPhotoAreaState] = useState<AdminPhotoArea | null>(null);
  const [deletePhotoAreaConfirm, setDeletePhotoAreaConfirm] = useState<{ layoutId: string; photoAreaId: number } | null>(null);
  const [copiedLayoutId, setCopiedLayoutId] = useState<string | null>(null);
  const [copyErrorMessage, setCopyErrorMessage] = useState<string | null>(null);

  // Sync result state
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  // Build query params
  const queryParams: AdminTemplatesQueryParams = useMemo(() => {
    const params: AdminTemplatesQueryParams = {
      page,
      per_page: perPage,
    };
    if (filterCategory !== "all") params.category_id = filterCategory;
    if (filterStatus !== "all") params.status = filterStatus;
    if (filterTemplateType !== "all") params.template_type = filterTemplateType;
    return params;
  }, [page, filterCategory, filterStatus, filterTemplateType]);

  const queryClient = useQueryClient();

  // Fetch data
  const { data: templatesData, isLoading: templatesLoading, error: templatesError } = useAdminTemplates(queryParams);
  const { data: categoriesData, isLoading: categoriesLoading } = useTemplateCategories();
  const { data: layoutsData, isLoading: layoutsLoading } = useTemplateLayouts();

  // Mutations (only those used directly on this page; form modals own their own)
  const deleteTemplateMutation = useDeleteTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const broadcastSyncTemplatesMutation = useBroadcastSyncTemplates();
  const deleteCategoryMutation = useDeleteCategory();
  const broadcastSyncCategoriesMutation = useBroadcastSyncCategories();
  const updateLayoutMutation = useUpdateLayout();
  const deleteLayoutMutation = useDeleteLayout();
  const deletePhotoAreaMutation = useDeletePhotoArea();
  const broadcastSyncLayoutsMutation = useBroadcastSyncLayouts();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterCategory, filterStatus, filterTemplateType]);

  // Client-side search filtering
  const filteredTemplates = useMemo(() => {
    if (!templatesData?.templates) return [];
    if (!searchQuery) return templatesData.templates;

    const query = searchQuery.toLowerCase();
    return templatesData.templates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.toLowerCase().includes(query)
    );
  }, [templatesData, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const templates = templatesData?.templates || [];
    return {
      total: templatesData?.total || 0,
      active: templates.filter((t) => t.status === "active").length,
      draft: templates.filter((t) => t.status === "draft").length,
      free: templates.filter((t) => parseFloat(t.price) === 0).length,
    };
  }, [templatesData]);

  const categories = categoriesData?.categories ?? [];
  const layouts = layoutsData?.layouts ?? [];

  // Build the picker options the TemplateFormModal expects.
  const templateModalCategories = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories],
  );
  const templateModalLayouts = useMemo(
    () =>
      layouts.map((l) => ({
        id: l.id,
        name: l.name,
        layout_key: l.layout_key,
        product_category_id: l.product_category_id,
        photo_count: l.photo_count,
      })),
    [layouts],
  );

  // ============================================================================
  // TEMPLATE HANDLERS
  // ============================================================================

  const openAddTemplateModal = () => {
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const openEditTemplateModal = (template: AdminTemplate) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const openDeleteTemplateModal = (template: AdminTemplate) => {
    setTemplateToDelete(template);
    setDeleteTemplateError(null);
    setIsDeleteTemplateModalOpen(true);
  };

  const closeDeleteTemplateModal = () => {
    setIsDeleteTemplateModalOpen(false);
    setTemplateToDelete(null);
    setDeleteTemplateError(null);
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    setDeleteTemplateError(null);
    try {
      await deleteTemplateMutation.mutateAsync(templateToDelete.id);
      closeDeleteTemplateModal();
    } catch (error) {
      // 409 from the delete-gate carries `{ can_delete, purchase_count, reason }`.
      // Surface `reason` to the admin and keep the modal open so they can
      // pivot to the retire flow without a second click into the row.
      if (error instanceof ApiError && error.status === 409) {
        setDeleteTemplateError(error.message);
        if (error.detail && typeof error.detail === "object") {
          const d = error.detail as { purchase_count?: number; can_delete?: boolean };
          setTemplateToDelete((prev) =>
            prev
              ? {
                  ...prev,
                  purchase_count: d.purchase_count ?? prev.purchase_count,
                  can_delete: d.can_delete ?? prev.can_delete,
                }
              : prev,
          );
        }
        return;
      }
      setDeleteTemplateError(
        error instanceof Error ? error.message : "Failed to delete template",
      );
    }
  };

  const handleRetireTemplate = async () => {
    if (!templateToDelete) return;
    setDeleteTemplateError(null);
    try {
      await updateTemplateMutation.mutateAsync({
        id: templateToDelete.id,
        data: { is_active: false },
      });
      closeDeleteTemplateModal();
    } catch (error) {
      setDeleteTemplateError(
        error instanceof Error ? error.message : "Failed to retire template",
      );
    }
  };

  const handleBroadcastSyncTemplates = async () => {
    setSyncResult(null);
    try {
      const result = await broadcastSyncTemplatesMutation.mutateAsync();
      setSyncResult({ success: true, message: result.message });
    } catch {
      setSyncResult({ success: false, message: "Failed to sync templates to booths" });
    }
  };

  // ============================================================================
  // CATEGORY HANDLERS
  // ============================================================================

  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: AdminTemplateCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
      setDeleteCategoryConfirmId(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleBroadcastSyncCategories = async () => {
    setSyncResult(null);
    try {
      const result = await broadcastSyncCategoriesMutation.mutateAsync();
      setSyncResult({ success: true, message: result.message });
    } catch {
      setSyncResult({ success: false, message: "Failed to sync categories to booths" });
    }
  };

  // ============================================================================
  // LAYOUT HANDLERS
  // ============================================================================

  const openCreateLayoutModal = () => {
    setEditingLayout(null);
    setIsLayoutModalOpen(true);
  };

  const openEditLayoutModal = (layout: AdminTemplateLayout) => {
    setEditingLayout(layout);
    setIsLayoutModalOpen(true);
  };

  const handleCopyLayout = async (layout: AdminTemplateLayout) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is unavailable. This page must run on HTTPS or localhost.");
      }
      const json = serializeLayoutForClipboard(layout);
      await navigator.clipboard.writeText(json);
      setCopyErrorMessage(null);
      setCopiedLayoutId(layout.id);
      setTimeout(() => {
        setCopiedLayoutId((prev) => (prev === layout.id ? null : prev));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy layout:", error);
      const text = error instanceof Error ? error.message : "Failed to copy layout to clipboard.";
      setCopyErrorMessage(text);
      setTimeout(() => {
        setCopyErrorMessage((prev) => (prev === text ? null : prev));
      }, 5000);
    }
  };

  const handleDeleteLayout = async (id: string) => {
    try {
      await deleteLayoutMutation.mutateAsync(id);
      setDeleteLayoutConfirmId(null);
    } catch (error) {
      console.error("Failed to delete layout:", error);
    }
  };

  /**
   * After the photo-area modal saves (add or update), sync the parent
   * layout's `photo_count` to match the actual photo_areas length. The
   * backend doesn't auto-update photo_count, so we refetch fresh layouts
   * and patch it best-effort.
   */
  const syncLayoutPhotoCount = (layoutId: string) => {
    queryClient
      .fetchQuery<AdminLayoutsResponse>({
        queryKey: [...adminTemplateKeys.layouts, { includeInactive: true }],
      })
      .then((fresh) => {
        const freshLayout = fresh.layouts.find((l) => l.id === layoutId);
        if (freshLayout) {
          updateLayoutMutation.mutate({
            id: layoutId,
            data: { photo_count: freshLayout.photo_areas?.length ?? 0 },
          });
        }
      })
      .catch((err) => console.error("Failed to sync photo_count:", err));
  };

  const openAddPhotoAreaModal = (layoutId: string) => {
    setPhotoAreaModalLayoutId(layoutId);
    setEditingPhotoAreaState(null);
  };

  const openEditPhotoAreaModal = (layoutId: string, area: AdminPhotoArea) => {
    setPhotoAreaModalLayoutId(layoutId);
    setEditingPhotoAreaState(area);
  };

  const closePhotoAreaModal = () => {
    setPhotoAreaModalLayoutId(null);
    setEditingPhotoAreaState(null);
  };

  const handleDeletePhotoArea = async (layoutId: string, photoAreaId: number) => {
    try {
      await deletePhotoAreaMutation.mutateAsync({ layoutId, photoAreaId });
      setDeletePhotoAreaConfirm(null);
      syncLayoutPhotoCount(layoutId);
    } catch (error) {
      console.error("Failed to delete photo area:", error);
    }
  };

  const handleBroadcastSyncLayouts = async () => {
    setSyncResult(null);
    try {
      const result = await broadcastSyncLayoutsMutation.mutateAsync();
      setSyncResult({ success: true, message: result.message });
    } catch {
      setSyncResult({ success: false, message: "Failed to sync layouts to booths" });
    }
  };

  // ============================================================================
  // FILTER OPTIONS
  // ============================================================================

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  const templateTypeOptions: { value: FilterTemplateType; label: string }[] = [
    { value: "all", label: "All Types" },
    { value: "strip", label: "Strips" },
    { value: "photo_4x6", label: "4x6 Photo" },
  ];

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (templatesLoading && !templatesData && activeTab === "templates") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#069494] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================

  if (templatesError && activeTab === "templates") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="text-zinc-900 dark:text-white font-medium mb-2">Failed to load templates</p>
          <p className="text-zinc-500 text-sm">{templatesError.message}</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Templates</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage templates, categories, and layouts</p>
        </div>
      </div>

      {/* Sync Result */}
      {syncResult && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center justify-between ${
            syncResult.success
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          }`}
        >
          <span>{syncResult.message}</span>
          <button onClick={() => setSyncResult(null)} className="font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-[var(--border)]">
        <nav className="-mb-px flex gap-6">
          {[
            { id: "templates" as const, label: "Templates", count: stats.total },
            { id: "categories" as const, label: "Categories", count: categories.length },
            { id: "layouts" as const, label: "Layouts", count: layouts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-[#069494] text-[#069494]"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-[#069494]/20 text-[#069494]"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "templates" && (
        <>
          {/* Templates Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleBroadcastSyncTemplates}
                disabled={broadcastSyncTemplatesMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {broadcastSyncTemplatesMutation.isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                    Sync to Booths
                  </>
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={openAddTemplateModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#069494] text-white font-medium rounded-xl hover:bg-[#176161] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Template
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500">Total Templates</p>
              <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500">Active</p>
              <p className="text-2xl font-bold mt-1 text-[#10B981]">{stats.active}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500">Draft</p>
              <p className="text-2xl font-bold mt-1 text-[#069494]">{stats.draft}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
              <p className="text-sm text-zinc-500">Free</p>
              <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{stats.free}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494]"
            >
              <option value="all">All Categories</option>
              {categoriesData?.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Template Type Filter */}
            <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
              {templateTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilterTemplateType(opt.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    filterTemplateType === opt.value
                      ? "bg-[#069494] text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-zinc-800/50 rounded-xl">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setFilterStatus(status.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    filterStatus === status.value
                      ? "bg-[#069494] text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates List */}
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Preview Image */}
                  <div className="w-16 h-20 rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 relative">
                    {template.preview_url ? (
                      <Image src={template.preview_url} alt={template.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-zinc-900 dark:text-white">{template.name}</p>
                      {/* Status Badge */}
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          template.status === "active"
                            ? "bg-[#10B981]/20 text-[#10B981]"
                            : template.status === "draft"
                            ? "bg-zinc-500/20 text-zinc-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {template.status}
                      </span>
                      {/* Free Badge */}
                      {parseFloat(template.price) === 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#069494]/20 text-[#069494]">
                          Free
                        </span>
                      )}
                      {/* Purchased Badge — surfaces the delete-gate state inline so admins know
                          why the row's delete button is disabled before opening the modal. */}
                      {typeof template.purchase_count === "number" &&
                        template.purchase_count > 0 && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                            Purchased &times; {template.purchase_count}
                          </span>
                        )}
                    </div>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      {template.category?.name || "No Category"} &bull; {template.layout?.name || template.template_type}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                      <span>{formatFileSize(template.file_size)}</span>
                      <span>{template.template_type}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right hidden sm:block">
                    {parseFloat(template.price) === 0 ? (
                      <p className="font-bold text-[#10B981]">FREE</p>
                    ) : (
                      <p className="font-bold text-zinc-900 dark:text-white">{formatCurrency(template.price)}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditTemplateModal(template)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-[#069494] transition-colors"
                      aria-label="Edit template"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteTemplateModal(template)}
                      disabled={template.can_delete === false}
                      title={
                        template.can_delete === false
                          ? `Cannot delete — purchased by ${template.purchase_count ?? 0} booth(s). Retire via inactive instead.`
                          : undefined
                      }
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-500"
                      aria-label="Delete template"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] text-center">
                <p className="text-zinc-500 dark:text-zinc-400">No templates found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {templatesData && templatesData.total_pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Page {templatesData.page} of {templatesData.total_pages} ({templatesData.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(templatesData.total_pages, p + 1))}
                  disabled={page >= templatesData.total_pages}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "categories" && (
        <>
          {/* Categories Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleBroadcastSyncCategories}
                disabled={broadcastSyncCategoriesMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {broadcastSyncCategoriesMutation.isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                    Sync to Booths
                  </>
                )}
              </button>
            </div>
            <button
              onClick={openCreateCategoryModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#069494] text-white font-medium rounded-xl hover:bg-[#176161] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Category
            </button>
          </div>

          {/* Loading */}
          {categoriesLoading && (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
              ))}
            </div>
          )}

          {/* Categories Table */}
          {!categoriesLoading && (
            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Season
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{category.name}</p>
                          {category.description && (
                            <p className="text-sm text-zinc-500 truncate max-w-xs">{category.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            category.is_active
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            category.is_premium
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {category.is_premium ? "Premium" : "Free"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {category.is_seasonal_category ? (
                          <span>
                            {category.season_start_date} - {category.season_end_date}
                          </span>
                        ) : (
                          <span className="text-zinc-400">Always</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{category.sort_order}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditCategoryModal(category)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteCategoryConfirmId(category.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-500 hover:text-red-600"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {categories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-500">No categories found. Create one to get started.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === "layouts" && (
        <>
          {copyErrorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="fixed top-6 right-6 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2"
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="flex-1">{copyErrorMessage}</span>
              <button
                type="button"
                onClick={() => setCopyErrorMessage(null)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-200"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {/* Layouts Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleBroadcastSyncLayouts}
                disabled={broadcastSyncLayoutsMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {broadcastSyncLayoutsMutation.isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                    Sync to Booths
                  </>
                )}
              </button>
            </div>
            <button
              onClick={openCreateLayoutModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#069494] text-white font-medium rounded-xl hover:bg-[#176161] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Layout
            </button>
          </div>

          {/* Loading */}
          {layoutsLoading && (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
              ))}
            </div>
          )}

          {/* Layouts List */}
          {!layoutsLoading && (
            <div className="space-y-4">
              {layouts.map((layout) => (
                <div
                  key={layout.id}
                  className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden"
                >
                  {/* Layout Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setExpandedLayoutId(expandedLayoutId === layout.id ? null : layout.id)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800"
                      >
                        <svg
                          className={`w-5 h-5 text-zinc-500 transition-transform ${
                            expandedLayoutId === layout.id ? "rotate-90" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{layout.name}</p>
                        <p className="text-sm text-zinc-500">{layout.layout_key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-zinc-500">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{layout.width}</span> x{" "}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{layout.height}</span>
                      </div>
                      <div className="text-sm">
                        <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {layout.photo_areas?.length ?? layout.photo_count} photos
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          layout.is_active
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {layout.is_active ? "Active" : "Inactive"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLayout(layout)}
                          title="Copy layout as JSON"
                          aria-label="Copy layout as JSON"
                          className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 ${
                            copiedLayoutId === layout.id
                              ? "text-[#069494]"
                              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                          }`}
                        >
                          {copiedLayoutId === layout.id ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h4a2 2 0 002-2M8 5a2 2 0 012-2h4a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => openEditLayoutModal(layout)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteLayoutConfirmId(layout.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-500 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Photo Areas (Expanded) */}
                  {expandedLayoutId === layout.id && (
                    <div className="border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Photo Areas</h4>
                        <button
                          type="button"
                          onClick={() => openAddPhotoAreaModal(layout.id)}
                          className="text-sm text-[#069494] hover:underline font-medium"
                        >
                          + Add Photo Area
                        </button>
                      </div>
                      {layout.photo_areas && layout.photo_areas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {layout.photo_areas.map((area) => (
                            <div
                              key={area.id}
                              className="bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700 p-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                  Photo #{area.photo_index}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-500">
                                    {area.shape_type}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => openEditPhotoAreaModal(layout.id, area)}
                                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-[#069494]"
                                    title="Edit photo area"
                                    aria-label={`Edit photo area ${area.photo_index}`}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletePhotoAreaConfirm({ layoutId: layout.id, photoAreaId: area.id })}
                                    className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-600"
                                    title="Delete photo area"
                                    aria-label={`Delete photo area ${area.photo_index}`}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-zinc-500 space-y-1">
                                <p>
                                  Position: ({area.x}, {area.y})
                                </p>
                                <p>
                                  Size: {area.width} x {area.height}
                                </p>
                                {area.rotation !== 0 && <p>Rotation: {area.rotation}°</p>}
                                {area.border_radius > 0 && <p>Radius: {area.border_radius}px</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-500">No photo areas defined.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {layouts.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <p className="text-zinc-500">No layouts found. Create one to get started.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ============================================================================ */}
      {/* MODALS */}
      {/* ============================================================================ */}


      {/* Template Delete Confirmation Modal */}
      {isDeleteTemplateModalOpen && templateToDelete && (() => {
        const isBlocked = templateToDelete.can_delete === false;
        const purchaseCount = templateToDelete.purchase_count ?? 0;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeDeleteTemplateModal}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isBlocked ? "bg-amber-500/20" : "bg-red-500/20"
                  }`}
                >
                  <svg
                    className={`w-8 h-8 ${isBlocked ? "text-amber-500" : "text-red-500"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {isBlocked ? "Cannot Delete Template" : "Delete Template"}
                </h3>
                {isBlocked ? (
                  <p className="text-zinc-500 mb-6">
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {templateToDelete.name}
                    </span>{" "}
                    has been purchased by {purchaseCount} booth
                    {purchaseCount === 1 ? "" : "s"} and cannot be hard-deleted —
                    that would wipe the refund and audit history. Retire it
                    instead by setting it inactive; purchasing kiosks reconcile
                    the change within ~30s and remove it locally.
                  </p>
                ) : (
                  <p className="text-zinc-500 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {templateToDelete.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                )}
                {deleteTemplateError && !isBlocked && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500 text-left">
                    {deleteTemplateError}
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={closeDeleteTemplateModal}
                    className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  {isBlocked ? (
                    <button
                      type="button"
                      onClick={handleRetireTemplate}
                      disabled={updateTemplateMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {updateTemplateMutation.isPending && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      Retire (Set Inactive)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDeleteTemplate}
                      disabled={deleteTemplateMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {deleteTemplateMutation.isPending && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}


      {/* Category Delete Confirmation Modal */}
      {deleteCategoryConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteCategoryConfirmId(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Delete Category</h3>
            <p className="text-sm text-zinc-500 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteCategoryConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteCategoryConfirmId)}
                disabled={deleteCategoryMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}




      {/* Delete Photo Area Confirmation Modal */}
      {deletePhotoAreaConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeletePhotoAreaConfirm(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Delete Photo Area</h3>
            <p className="text-sm text-zinc-500 mb-6">
              Are you sure you want to delete this photo area? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletePhotoAreaConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeletePhotoArea(deletePhotoAreaConfirm.layoutId, deletePhotoAreaConfirm.photoAreaId)}
                disabled={deletePhotoAreaMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deletePhotoAreaMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layout Delete Confirmation Modal */}
      {deleteLayoutConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteLayoutConfirmId(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Delete Layout</h3>
            <p className="text-sm text-zinc-500 mb-6">
              Are you sure you want to delete this layout? This will also delete all photo areas. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteLayoutConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLayout(deleteLayoutConfirmId)}
                disabled={deleteLayoutMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLayoutMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared form modals */}
      <TemplateFormModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        mode="admin"
        editing={editingTemplate}
        categories={templateModalCategories}
        layouts={templateModalLayouts}
      />
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        mode="admin"
        editing={editingCategory}
      />
      <LayoutFormModal
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
        mode="admin"
        editing={editingLayout}
      />
      <PhotoAreaFormModal
        isOpen={photoAreaModalLayoutId !== null}
        onClose={closePhotoAreaModal}
        mode="admin"
        layoutId={photoAreaModalLayoutId ?? ""}
        editing={editingPhotoAreaState}
        onSaved={() =>
          photoAreaModalLayoutId && syncLayoutPhotoCount(photoAreaModalLayoutId)
        }
      />
    </div>
  );
}
