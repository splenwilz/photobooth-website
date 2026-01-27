"use client";

/**
 * Admin Templates Management Page
 *
 * Manage template marketplace content with CRUD operations.
 * Integrated with backend Template API.
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
} from "@/core/api/templates/admin-queries";
import type {
  AdminTemplate,
  AdminTemplateStatus,
  AdminTemplateType,
  AdminTemplateCategory,
  AdminTemplateLayout,
  AdminTemplatesQueryParams,
} from "@/core/api/templates/admin-types";

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

const initialFormData: TemplateFormData = {
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

export default function AdminTemplatesPage() {
  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterTemplateType, setFilterTemplateType] = useState<FilterTemplateType>("all");
  const [page, setPage] = useState(1);
  const perPage = 20;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<AdminTemplate | null>(null);

  // Form state
  const [formData, setFormData] = useState<TemplateFormData>(initialFormData);
  const [tagInput, setTagInput] = useState("");
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [dragActiveTemplate, setDragActiveTemplate] = useState(false);
  const [dragActivePreview, setDragActivePreview] = useState(false);
  const templateFileRef = useRef<HTMLInputElement>(null);
  const previewFileRef = useRef<HTMLInputElement>(null);

  // Error state
  const [formError, setFormError] = useState<string | null>(null);

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

  // Mutations
  const uploadMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  const deleteMutation = useDeleteTemplate();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterCategory, filterStatus, filterTemplateType]);

  // Client-side search filtering (backend doesn't have search endpoint)
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
    const productCategoryId = formData.template_type === "strip" ? 1 : 2;
    return layoutsData.layouts.filter((l) => l.product_category_id === productCategoryId);
  }, [layoutsData?.layouts, formData.template_type]);

  // Handlers
  const handleTemplateTypeChange = (type: AdminTemplateType) => {
    setFormData((prev) => ({
      ...prev,
      template_type: type,
      layout_id: null, // Reset layout when type changes
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = formData.tags ? formData.tags.split(",").filter(Boolean) : [];
      const newTag = tagInput.trim().toLowerCase();
      if (!currentTags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...currentTags, newTag].join(","),
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData.tags.split(",").filter(Boolean);
    setFormData((prev) => ({
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

  const openAddModal = () => {
    setEditingTemplate(null);
    setFormData(initialFormData);
    setTagInput("");
    setTemplateFile(null);
    setPreviewFile(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (template: AdminTemplate) => {
    setEditingTemplate(template);
    setFormData({
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
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);

    if (editingTemplate) {
      // Update existing template
      try {
        await updateMutation.mutateAsync({
          id: editingTemplate.id,
          data: {
            name: formData.name,
            description: formData.description,
            category_id: formData.category_id ?? undefined,
            layout_id: formData.layout_id ?? undefined,
            template_type: formData.template_type,
            status: formData.status,
            price: formData.price,
            sort_order: formData.sort_order,
            tags: formData.tags,
          },
        });
        setIsModalOpen(false);
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Failed to update template");
      }
    } else {
      // Create new template
      if (!templateFile || !previewFile) {
        setFormError("Both template file and preview file are required");
        return;
      }
      if (!formData.name.trim()) {
        setFormError("Template name is required");
        return;
      }

      try {
        console.log("[DEBUG] formData.status:", formData.status);
        await uploadMutation.mutateAsync({
          templateFile,
          previewFile,
          metadata: {
            name: formData.name,
            description: formData.description || undefined,
            category_id: formData.category_id ?? undefined,
            layout_id: formData.layout_id ?? undefined,
            template_type: formData.template_type,
            status: formData.status,
            price: formData.price,
            sort_order: formData.sort_order,
            tags: formData.tags || undefined,
          },
        });
        setIsModalOpen(false);
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Failed to upload template");
      }
    }
  };

  const openDeleteModal = (template: AdminTemplate) => {
    setTemplateToDelete(template);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (templateToDelete) {
      try {
        await deleteMutation.mutateAsync(templateToDelete.id);
        setIsDeleteModalOpen(false);
        setTemplateToDelete(null);
      } catch (error) {
        console.error("Failed to delete template:", error);
      }
    }
  };

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

  // Loading state
  if (templatesLoading && !templatesData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (templatesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-zinc-900 dark:text-white font-medium mb-2">Failed to load templates</p>
          <p className="text-zinc-500 text-sm">{templatesError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Templates</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage template marketplace content</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
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
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0891B2]/20 text-[#0891B2]">Free</span>
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
                  onClick={() => openEditModal(template)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-[#0891B2] transition-colors"
                  aria-label="Edit template"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => openDeleteModal(template)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
                  aria-label="Delete template"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} aria-hidden="true" />

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {editingTemplate ? "Edit Template" : "Add New Template"}
              </h2>
              <p className="text-zinc-500 mt-1">
                {editingTemplate ? "Update template details" : "Upload a new template to the marketplace"}
              </p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Error Message */}
              {formError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{formError}</div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Template Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                  placeholder="Enter template name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Description</label>
                <textarea
                  value={formData.description ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2] resize-none"
                  placeholder="Describe the template..."
                />
              </div>

              {/* Template Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Template Type</label>
                  <select
                    value={formData.template_type}
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
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as AdminTemplateStatus }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Category & Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Category</label>
                  <select
                    value={formData.category_id ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : null }))}
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
                    value={formData.layout_id ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, layout_id: e.target.value || null }))}
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

              {/* File Uploads (only for new templates) */}
              {!editingTemplate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Template File */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Template File *</label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        dragActiveTemplate ? "border-[#0891B2] bg-[#0891B2]/10" : "border-[var(--border)] hover:border-[#0891B2]/50"
                      }`}
                      onDragEnter={(e) => handleDrag(e, "template")}
                      onDragLeave={(e) => handleDrag(e, "template")}
                      onDragOver={(e) => handleDrag(e, "template")}
                      onDrop={(e) => handleDrop(e, "template")}
                    >
                      <input ref={templateFileRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, "template")} className="hidden" />
                      {templateFile ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <p className="text-sm text-zinc-900 dark:text-white font-medium truncate">{templateFile.name}</p>
                          <button type="button" onClick={() => templateFileRef.current?.click()} className="text-sm text-[#0891B2] hover:underline">
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                            <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                          </div>
                          <p className="text-sm text-zinc-500">
                            <button type="button" onClick={() => templateFileRef.current?.click()} className="text-[#0891B2] hover:underline">
                              Upload overlay
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview File */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Preview Image *</label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        dragActivePreview ? "border-[#0891B2] bg-[#0891B2]/10" : "border-[var(--border)] hover:border-[#0891B2]/50"
                      }`}
                      onDragEnter={(e) => handleDrag(e, "preview")}
                      onDragLeave={(e) => handleDrag(e, "preview")}
                      onDragOver={(e) => handleDrag(e, "preview")}
                      onDrop={(e) => handleDrop(e, "preview")}
                    >
                      <input ref={previewFileRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, "preview")} className="hidden" />
                      {previewFile ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <p className="text-sm text-zinc-900 dark:text-white font-medium truncate">{previewFile.name}</p>
                          <button type="button" onClick={() => previewFileRef.current?.click()} className="text-sm text-[#0891B2] hover:underline">
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                            <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          </div>
                          <p className="text-sm text-zinc-500">
                            <button type="button" onClick={() => previewFileRef.current?.click()} className="text-[#0891B2] hover:underline">
                              Upload thumbnail
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Price & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Price ($)</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
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
                    value={formData.sort_order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white focus:outline-none focus:border-[#0891B2]"
                    placeholder="0"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(formData.tags || "")
                    .split(",")
                    .filter(Boolean)
                    .map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
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

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={uploadMutation.isPending || updateMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(uploadMutation.isPending || updateMutation.isPending) && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editingTemplate ? "Save Changes" : "Create Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} aria-hidden="true" />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Delete Template</h3>
              <p className="text-zinc-500 mb-6">
                Are you sure you want to delete <span className="font-medium text-zinc-900 dark:text-white">{templateToDelete.name}</span>? This action
                cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deleteMutation.isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
