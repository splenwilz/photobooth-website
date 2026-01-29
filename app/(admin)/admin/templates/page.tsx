"use client";

/**
 * Admin Templates Management Page
 *
 * Manage template marketplace content with CRUD operations.
 * Includes sub-tabs for Templates, Categories, and Layouts management.
 */

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  useAdminTemplates,
  useTemplateCategories,
  useTemplateLayouts,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateLayout,
  useUpdateLayout,
  useDeleteLayout,
  useAddPhotoArea,
  useBroadcastSyncCategories,
  useBroadcastSyncLayouts,
  useBroadcastSyncTemplates,
} from "@/core/api/templates/admin-queries";
import type {
  AdminTemplate,
  AdminTemplateStatus,
  AdminTemplateType,
  AdminTemplatesQueryParams,
} from "@/core/api/templates/admin-types";

// ============================================================================
// TYPES
// ============================================================================

type ActiveTab = "templates" | "categories" | "layouts";
type FilterStatus = "all" | AdminTemplateStatus;
type FilterCategory = "all" | number;
type FilterTemplateType = "all" | AdminTemplateType;

interface TemplateFormData {
  name: string;
  description: string;
  category_id: number | null;
  layout_id: string | null;
  template_type: AdminTemplateType;
  status: AdminTemplateStatus;
  price: string;
  sort_order: number;
  tags: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  is_active: boolean;
  is_premium: boolean;
  sort_order: number;
  is_seasonal_category: boolean;
  season_start_date: string;
  season_end_date: string;
  seasonal_priority: number;
}

interface PhotoAreaFormData {
  photo_index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  border_radius: number;
  shape_type: string;
}

interface LayoutFormData {
  layout_key: string;
  name: string;
  description: string;
  width: number;
  height: number;
  photo_count: number;
  product_category_id: number;
  is_active: boolean;
  sort_order: number;
  photo_areas: PhotoAreaFormData[];
}

// ============================================================================
// DEFAULTS
// ============================================================================

const initialTemplateFormData: TemplateFormData = {
  name: "",
  description: "",
  category_id: null,
  layout_id: null,
  template_type: "strip",
  status: "draft",
  price: "0.00",
  sort_order: 0,
  tags: "",
};

const defaultCategoryFormData: CategoryFormData = {
  name: "",
  description: "",
  is_active: true,
  is_premium: false,
  sort_order: 0,
  is_seasonal_category: false,
  season_start_date: "",
  season_end_date: "",
  seasonal_priority: 0,
};

const defaultPhotoArea: PhotoAreaFormData = {
  photo_index: 1,
  x: 0,
  y: 0,
  width: 400,
  height: 400,
  rotation: 0,
  border_radius: 0,
  shape_type: "rectangle",
};

const defaultLayoutFormData: LayoutFormData = {
  layout_key: "",
  name: "",
  description: "",
  width: 603,
  height: 1803,
  photo_count: 3,
  product_category_id: 1,
  is_active: true,
  sort_order: 0,
  photo_areas: [],
};

const PRODUCT_CATEGORIES = [
  { id: 1, name: "Strips" },
  { id: 2, name: "4x6" },
  { id: 3, name: "Smartphone" },
];

const SHAPE_TYPES = ["rectangle", "rounded_rectangle", "circle", "heart", "petal"];

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

  // Template form state
  const [templateFormData, setTemplateFormData] = useState<TemplateFormData>(initialTemplateFormData);
  const [tagInput, setTagInput] = useState("");
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [dragActiveTemplate, setDragActiveTemplate] = useState(false);
  const [dragActivePreview, setDragActivePreview] = useState(false);
  const templateFileRef = useRef<HTMLInputElement>(null);
  const previewFileRef = useRef<HTMLInputElement>(null);
  const [templateFormError, setTemplateFormError] = useState<string | null>(null);

  // Category state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>(defaultCategoryFormData);
  const [deleteCategoryConfirmId, setDeleteCategoryConfirmId] = useState<number | null>(null);

  // Layout state
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
  const [editingLayoutId, setEditingLayoutId] = useState<string | null>(null);
  const [layoutFormData, setLayoutFormData] = useState<LayoutFormData>(defaultLayoutFormData);
  const [deleteLayoutConfirmId, setDeleteLayoutConfirmId] = useState<string | null>(null);
  const [expandedLayoutId, setExpandedLayoutId] = useState<string | null>(null);
  const [addingPhotoAreaTo, setAddingPhotoAreaTo] = useState<string | null>(null);
  const [photoAreaForm, setPhotoAreaForm] = useState<PhotoAreaFormData>(defaultPhotoArea);

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

  // Fetch data
  const { data: templatesData, isLoading: templatesLoading, error: templatesError } = useAdminTemplates(queryParams);
  const { data: categoriesData, isLoading: categoriesLoading } = useTemplateCategories();
  const { data: layoutsData, isLoading: layoutsLoading } = useTemplateLayouts();

  // Template mutations
  const uploadMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();
  const broadcastSyncTemplatesMutation = useBroadcastSyncTemplates();

  // Category mutations
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const broadcastSyncCategoriesMutation = useBroadcastSyncCategories();

  // Layout mutations
  const createLayoutMutation = useCreateLayout();
  const updateLayoutMutation = useUpdateLayout();
  const deleteLayoutMutation = useDeleteLayout();
  const addPhotoAreaMutation = useAddPhotoArea();
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
  }, [templatesData?.templates, searchQuery]);

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

  // Filter layouts by template type
  const availableLayouts = useMemo(() => {
    if (!layoutsData?.layouts) return [];
    const productCategoryId = templateFormData.template_type === "strip" ? 1 : 2;
    return layoutsData.layouts.filter((l) => l.product_category_id === productCategoryId);
  }, [layoutsData?.layouts, templateFormData.template_type]);

  const categories = categoriesData?.categories ?? [];
  const layouts = layoutsData?.layouts ?? [];

  // ============================================================================
  // TEMPLATE HANDLERS
  // ============================================================================

  const handleTemplateTypeChange = (type: AdminTemplateType) => {
    setTemplateFormData((prev) => ({
      ...prev,
      template_type: type,
      layout_id: null,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = templateFormData.tags ? templateFormData.tags.split(",").filter(Boolean) : [];
      const newTag = tagInput.trim().toLowerCase();
      if (!currentTags.includes(newTag)) {
        setTemplateFormData((prev) => ({
          ...prev,
          tags: [...currentTags, newTag].join(","),
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = templateFormData.tags.split(",").filter(Boolean);
    setTemplateFormData((prev) => ({
      ...prev,
      tags: currentTags.filter((t) => t !== tagToRemove).join(","),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDrag = (e: React.DragEvent, type: "template" | "preview") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      type === "template" ? setDragActiveTemplate(true) : setDragActivePreview(true);
    } else if (e.type === "dragleave") {
      type === "template" ? setDragActiveTemplate(false) : setDragActivePreview(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "template" | "preview") => {
    e.preventDefault();
    e.stopPropagation();
    type === "template" ? setDragActiveTemplate(false) : setDragActivePreview(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        type === "template" ? setTemplateFile(file) : setPreviewFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "template" | "preview") => {
    if (e.target.files && e.target.files[0]) {
      type === "template" ? setTemplateFile(e.target.files[0]) : setPreviewFile(e.target.files[0]);
    }
  };

  const openAddTemplateModal = () => {
    setEditingTemplate(null);
    setTemplateFormData(initialTemplateFormData);
    setTagInput("");
    setTemplateFile(null);
    setPreviewFile(null);
    setTemplateFormError(null);
    setIsTemplateModalOpen(true);
  };

  const openEditTemplateModal = (template: AdminTemplate) => {
    setEditingTemplate(template);
    setTemplateFormData({
      name: template.name,
      description: template.description,
      category_id: template.category_id,
      layout_id: template.layout_id,
      template_type: template.template_type,
      status: template.status,
      price: template.price,
      sort_order: template.sort_order,
      tags: template.tags,
    });
    setTagInput("");
    setTemplateFile(null);
    setPreviewFile(null);
    setTemplateFormError(null);
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async () => {
    setTemplateFormError(null);

    if (editingTemplate) {
      try {
        await updateTemplateMutation.mutateAsync({
          id: editingTemplate.id,
          data: {
            name: templateFormData.name,
            description: templateFormData.description,
            category_id: templateFormData.category_id ?? undefined,
            layout_id: templateFormData.layout_id ?? undefined,
            template_type: templateFormData.template_type,
            status: templateFormData.status,
            price: templateFormData.price,
            sort_order: templateFormData.sort_order,
            tags: templateFormData.tags,
          },
        });
        setIsTemplateModalOpen(false);
      } catch (error) {
        setTemplateFormError(error instanceof Error ? error.message : "Failed to update template");
      }
    } else {
      if (!templateFile || !previewFile) {
        setTemplateFormError("Both template file and preview file are required");
        return;
      }
      if (!templateFormData.name.trim()) {
        setTemplateFormError("Template name is required");
        return;
      }

      try {
        await uploadMutation.mutateAsync({
          templateFile,
          previewFile,
          metadata: {
            name: templateFormData.name,
            description: templateFormData.description || undefined,
            category_id: templateFormData.category_id ?? undefined,
            layout_id: templateFormData.layout_id ?? undefined,
            template_type: templateFormData.template_type,
            status: templateFormData.status,
            price: templateFormData.price,
            sort_order: templateFormData.sort_order,
            tags: templateFormData.tags || undefined,
          },
        });
        setIsTemplateModalOpen(false);
      } catch (error) {
        setTemplateFormError(error instanceof Error ? error.message : "Failed to upload template");
      }
    }
  };

  const openDeleteTemplateModal = (template: AdminTemplate) => {
    setTemplateToDelete(template);
    setIsDeleteTemplateModalOpen(true);
  };

  const handleDeleteTemplate = async () => {
    if (templateToDelete) {
      try {
        await deleteTemplateMutation.mutateAsync(templateToDelete.id);
        setIsDeleteTemplateModalOpen(false);
        setTemplateToDelete(null);
      } catch (error) {
        console.error("Failed to delete template:", error);
      }
    }
  };

  const handleBroadcastSyncTemplates = async () => {
    setSyncResult(null);
    try {
      const result = await broadcastSyncTemplatesMutation.mutateAsync();
      setSyncResult({ success: true, message: result.message });
    } catch (error) {
      setSyncResult({ success: false, message: "Failed to sync templates to booths" });
    }
  };

  // ============================================================================
  // CATEGORY HANDLERS
  // ============================================================================

  const openCreateCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryFormData(defaultCategoryFormData);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: (typeof categories)[0]) => {
    setEditingCategoryId(category.id);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      is_active: category.is_active,
      is_premium: category.is_premium,
      sort_order: category.sort_order,
      is_seasonal_category: category.is_seasonal_category,
      season_start_date: category.season_start_date || "",
      season_end_date: category.season_end_date || "",
      seasonal_priority: category.seasonal_priority,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...categoryFormData,
        season_start_date:
          categoryFormData.is_seasonal_category && categoryFormData.season_start_date
            ? categoryFormData.season_start_date
            : undefined,
        season_end_date:
          categoryFormData.is_seasonal_category && categoryFormData.season_end_date
            ? categoryFormData.season_end_date
            : undefined,
      };
      if (editingCategoryId) {
        await updateCategoryMutation.mutateAsync({ id: editingCategoryId, data: submitData });
      } else {
        await createCategoryMutation.mutateAsync(submitData);
      }
      setIsCategoryModalOpen(false);
      setCategoryFormData(defaultCategoryFormData);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
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
    } catch (error) {
      setSyncResult({ success: false, message: "Failed to sync categories to booths" });
    }
  };

  // ============================================================================
  // LAYOUT HANDLERS
  // ============================================================================

  const openCreateLayoutModal = () => {
    setEditingLayoutId(null);
    setLayoutFormData(defaultLayoutFormData);
    setIsLayoutModalOpen(true);
  };

  const openEditLayoutModal = (layout: (typeof layouts)[0]) => {
    setEditingLayoutId(layout.id);
    setLayoutFormData({
      layout_key: layout.layout_key,
      name: layout.name,
      description: layout.description || "",
      width: layout.width,
      height: layout.height,
      photo_count: layout.photo_count,
      product_category_id: layout.product_category_id,
      is_active: layout.is_active,
      sort_order: layout.sort_order,
      photo_areas: [],
    });
    setIsLayoutModalOpen(true);
  };

  const handleSaveLayout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLayoutId) {
        const { photo_areas, ...updateData } = layoutFormData;
        await updateLayoutMutation.mutateAsync({ id: editingLayoutId, data: updateData });
      } else {
        await createLayoutMutation.mutateAsync(layoutFormData);
      }
      setIsLayoutModalOpen(false);
      setLayoutFormData(defaultLayoutFormData);
    } catch (error) {
      console.error("Failed to save layout:", error);
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

  const handleAddPhotoArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingPhotoAreaTo) return;
    try {
      await addPhotoAreaMutation.mutateAsync({
        layoutId: addingPhotoAreaTo,
        data: photoAreaForm,
      });
      setAddingPhotoAreaTo(null);
      setPhotoAreaForm(defaultPhotoArea);
    } catch (error) {
      console.error("Failed to add photo area:", error);
    }
  };

  const handleBroadcastSyncLayouts = async () => {
    setSyncResult(null);
    try {
      const result = await broadcastSyncLayoutsMutation.mutateAsync();
      setSyncResult({ success: true, message: result.message });
    } catch (error) {
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
          <div className="w-8 h-8 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
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
                  ? "border-[#0891B2] text-[#0891B2]"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-[#0891B2]/20 text-[#0891B2]"
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
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors"
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
              <p className="text-2xl font-bold mt-1 text-[#0891B2]">{stats.draft}</p>
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
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
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
                      ? "bg-[#0891B2] text-white"
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
                      ? "bg-[#0891B2] text-white"
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
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0891B2]/20 text-[#0891B2]">
                          Free
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
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-[#0891B2] transition-colors"
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
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
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
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors"
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
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0891B2] text-white font-medium rounded-xl hover:bg-[#0E7490] transition-colors"
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
                          {layout.photo_count} photos
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
                          onClick={() => {
                            setAddingPhotoAreaTo(layout.id);
                            setPhotoAreaForm({ ...defaultPhotoArea, photo_index: (layout.photo_areas?.length || 0) + 1 });
                          }}
                          className="text-sm text-[#0891B2] hover:underline font-medium"
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
                                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-500">
                                  {area.shape_type}
                                </span>
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

      {/* Template Add/Edit Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsTemplateModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {editingTemplate ? "Edit Template" : "Add New Template"}
              </h2>
              <p className="text-zinc-500 mt-1">
                {editingTemplate ? "Update template details" : "Upload a new template to the marketplace"}
              </p>
            </div>
            <div className="p-6 space-y-6">
              {templateFormError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {templateFormError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Template Name *</label>
                <input
                  type="text"
                  value={templateFormData.name}
                  onChange={(e) => setTemplateFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Description</label>
                <textarea
                  value={templateFormData.description ?? ""}
                  onChange={(e) => setTemplateFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2] resize-none"
                  placeholder="Describe the template..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Template Type</label>
                  <select
                    value={templateFormData.template_type}
                    onChange={(e) => handleTemplateTypeChange(e.target.value as AdminTemplateType)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                  >
                    <option value="strip">Strip</option>
                    <option value="photo_4x6">4x6 Photo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Status</label>
                  <select
                    value={templateFormData.status}
                    onChange={(e) =>
                      setTemplateFormData((prev) => ({ ...prev, status: e.target.value as AdminTemplateStatus }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Category</label>
                  <select
                    value={templateFormData.category_id ?? ""}
                    onChange={(e) =>
                      setTemplateFormData((prev) => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : null }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                    disabled={categoriesLoading}
                  >
                    <option value="">Select category...</option>
                    {categoriesData?.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Layout</label>
                  <select
                    value={templateFormData.layout_id ?? ""}
                    onChange={(e) => setTemplateFormData((prev) => ({ ...prev, layout_id: e.target.value || null }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                    disabled={layoutsLoading}
                  >
                    <option value="">Select layout...</option>
                    {availableLayouts.map((layout) => (
                      <option key={layout.id} value={layout.id}>
                        {layout.name} ({layout.photo_count} photos)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {!editingTemplate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Template File *</label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        dragActiveTemplate
                          ? "border-[#0891B2] bg-[#0891B2]/10"
                          : "border-[var(--border)] hover:border-[#0891B2]/50"
                      }`}
                      onDragEnter={(e) => handleDrag(e, "template")}
                      onDragLeave={(e) => handleDrag(e, "template")}
                      onDragOver={(e) => handleDrag(e, "template")}
                      onDrop={(e) => handleDrop(e, "template")}
                    >
                      <input
                        ref={templateFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "template")}
                        className="hidden"
                      />
                      {templateFile ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-[#10B981]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <p className="text-sm text-zinc-900 dark:text-white font-medium truncate">{templateFile.name}</p>
                          <button
                            type="button"
                            onClick={() => templateFileRef.current?.click()}
                            className="text-sm text-[#0891B2] hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-zinc-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                          </div>
                          <p className="text-sm text-zinc-500">
                            <button
                              type="button"
                              onClick={() => templateFileRef.current?.click()}
                              className="text-[#0891B2] hover:underline"
                            >
                              Upload overlay
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Preview Image *</label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        dragActivePreview
                          ? "border-[#0891B2] bg-[#0891B2]/10"
                          : "border-[var(--border)] hover:border-[#0891B2]/50"
                      }`}
                      onDragEnter={(e) => handleDrag(e, "preview")}
                      onDragLeave={(e) => handleDrag(e, "preview")}
                      onDragOver={(e) => handleDrag(e, "preview")}
                      onDrop={(e) => handleDrop(e, "preview")}
                    >
                      <input
                        ref={previewFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "preview")}
                        className="hidden"
                      />
                      {previewFile ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-[#10B981]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <p className="text-sm text-zinc-900 dark:text-white font-medium truncate">{previewFile.name}</p>
                          <button
                            type="button"
                            onClick={() => previewFileRef.current?.click()}
                            className="text-sm text-[#0891B2] hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-zinc-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-sm text-zinc-500">
                            <button
                              type="button"
                              onClick={() => previewFileRef.current?.click()}
                              className="text-[#0891B2] hover:underline"
                            >
                              Upload thumbnail
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Price ($)</label>
                  <input
                    type="text"
                    value={templateFormData.price}
                    onChange={(e) => setTemplateFormData((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Set to 0.00 for free templates</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Sort Order</label>
                  <input
                    type="number"
                    min="0"
                    value={templateFormData.sort_order}
                    onChange={(e) => setTemplateFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                    placeholder="0"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(templateFormData.tags || "")
                    .split(",")
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTemplate}
                disabled={uploadMutation.isPending || updateTemplateMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(uploadMutation.isPending || updateTemplateMutation.isPending) && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editingTemplate ? "Save Changes" : "Create Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Delete Confirmation Modal */}
      {isDeleteTemplateModalOpen && templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDeleteTemplateModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Delete Template</h3>
              <p className="text-zinc-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium text-zinc-900 dark:text-white">{templateToDelete.name}</span>? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setIsDeleteTemplateModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
                >
                  Cancel
                </button>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111111] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {editingCategoryId ? "Edit Category" : "Create Category"}
              </h2>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={categoryFormData.sort_order}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Priority</label>
                  <input
                    type="number"
                    value={categoryFormData.seasonal_priority}
                    onChange={(e) =>
                      setCategoryFormData({ ...categoryFormData, seasonal_priority: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryFormData.is_active}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#0891B2] focus:ring-[#0891B2]"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryFormData.is_premium}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, is_premium: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#0891B2] focus:ring-[#0891B2]"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Premium</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryFormData.is_seasonal_category}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, is_seasonal_category: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#0891B2] focus:ring-[#0891B2]"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Seasonal</span>
                </label>
              </div>
              {categoryFormData.is_seasonal_category && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Start Date (MM-DD)
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.season_start_date}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, season_start_date: e.target.value })}
                      placeholder="12-01"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      End Date (MM-DD)
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.season_end_date}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, season_end_date: e.target.value })}
                      placeholder="12-26"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] disabled:opacity-50"
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Layout Create/Edit Modal */}
      {isLayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsLayoutModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#111111] rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-[#111111]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {editingLayoutId ? "Edit Layout" : "Create Layout"}
              </h2>
            </div>
            <form onSubmit={handleSaveLayout} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={layoutFormData.name}
                    onChange={(e) => setLayoutFormData({ ...layoutFormData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Layout Key</label>
                  <input
                    type="text"
                    value={layoutFormData.layout_key}
                    onChange={(e) => setLayoutFormData({ ...layoutFormData, layout_key: e.target.value })}
                    required
                    placeholder="Strip-3-Shot-Custom"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  value={layoutFormData.description}
                  onChange={(e) => setLayoutFormData({ ...layoutFormData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={layoutFormData.width}
                    onChange={(e) => setLayoutFormData({ ...layoutFormData, width: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={layoutFormData.height}
                    onChange={(e) => setLayoutFormData({ ...layoutFormData, height: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Photo Count</label>
                  <input
                    type="number"
                    value={layoutFormData.photo_count}
                    onChange={(e) => setLayoutFormData({ ...layoutFormData, photo_count: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={4}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Product Type</label>
                  <select
                    value={layoutFormData.product_category_id}
                    onChange={(e) => setLayoutFormData({ ...layoutFormData, product_category_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={layoutFormData.sort_order}
                    onChange={(e) => setLayoutFormData({ ...layoutFormData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layoutFormData.is_active}
                    onChange={(e) => setLayoutFormData({ ...layoutFormData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#0891B2] focus:ring-[#0891B2]"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLayoutModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLayoutMutation.isPending || updateLayoutMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] disabled:opacity-50"
                >
                  {createLayoutMutation.isPending || updateLayoutMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Photo Area Modal */}
      {addingPhotoAreaTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setAddingPhotoAreaTo(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Add Photo Area</h2>
            </div>
            <form onSubmit={handleAddPhotoArea} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Photo Index</label>
                  <input
                    type="number"
                    value={photoAreaForm.photo_index}
                    onChange={(e) => setPhotoAreaForm({ ...photoAreaForm, photo_index: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={4}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Shape</label>
                  <select
                    value={photoAreaForm.shape_type}
                    onChange={(e) => setPhotoAreaForm({ ...photoAreaForm, shape_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  >
                    {SHAPE_TYPES.map((shape) => (
                      <option key={shape} value={shape}>
                        {shape}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">X Position</label>
                  <input
                    type="number"
                    value={photoAreaForm.x}
                    onChange={(e) => setPhotoAreaForm({ ...photoAreaForm, x: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Y Position</label>
                  <input
                    type="number"
                    value={photoAreaForm.y}
                    onChange={(e) => setPhotoAreaForm({ ...photoAreaForm, y: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Width</label>
                  <input
                    type="number"
                    value={photoAreaForm.width}
                    onChange={(e) => setPhotoAreaForm({ ...photoAreaForm, width: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Height</label>
                  <input
                    type="number"
                    value={photoAreaForm.height}
                    onChange={(e) => setPhotoAreaForm({ ...photoAreaForm, height: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Rotation (°)</label>
                  <input
                    type="number"
                    value={photoAreaForm.rotation}
                    onChange={(e) => setPhotoAreaForm({ ...photoAreaForm, rotation: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Border Radius</label>
                  <input
                    type="number"
                    value={photoAreaForm.border_radius}
                    onChange={(e) => setPhotoAreaForm({ ...photoAreaForm, border_radius: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAddingPhotoAreaTo(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addPhotoAreaMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] disabled:opacity-50"
                >
                  {addPhotoAreaMutation.isPending ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
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
    </div>
  );
}
