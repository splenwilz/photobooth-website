"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { CartDrawer } from "@/components/templates/CartDrawer";
import { QuickViewModal } from "@/components/templates/QuickViewModal";
import { useCartStore } from "@/stores/cart-store";
import { useTemplates } from "@/core/api/templates/queries";
import { Template, TemplatesQueryParams } from "@/core/api/templates/types";

type TemplateType = "strip" | "photo_4x6";
type FilterTab = "all" | "featured" | "new" | "free";
type SortOption = "popular" | "newest" | "price-low" | "price-high" | "rating";

function mapSortToApi(sort: SortOption): string | undefined {
  switch (sort) {
    case "popular": return "popular";
    case "newest": return "newest";
    case "price-low": return "price_asc";
    case "price-high": return "price_desc";
    case "rating": return "rating";
    default: return undefined;
  }
}

export default function TemplatesPage() {
  const [templateType, setTemplateType] = useState<TemplateType>("strip");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [quickViewTemplate, setQuickViewTemplate] = useState<Template | null>(null);

  const { openCart, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration pattern
  useEffect(() => setMounted(true), []);
  const itemCount = mounted ? getItemCount() : 0;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset pagination on filter change
    setPage(1);
  }, [templateType, activeTab, sortBy, debouncedSearch]);

  // Build query params
  const queryParams: TemplatesQueryParams = {
    page,
    per_page: 24,
    template_type: templateType,
    sort_by: mapSortToApi(sortBy),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeTab === "featured" && { is_featured: true }),
    ...(activeTab === "new" && { is_new: true }),
    ...(activeTab === "free" && { is_free: true }),
  };

  const { data, isLoading, isError } = useTemplates(queryParams);

  const templates = data?.templates ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "featured", label: "Featured" },
    { id: "new", label: "New" },
    { id: "free", label: "Free" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0891B2]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Premium Templates
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Beautiful print templates<br />
            <span className="text-[#0891B2]">for every occasion</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-8">
            Professional photo layouts designed to make your events unforgettable.
            Instant download, easy to customize.
          </p>

          {/* Template Type Toggle */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200 dark:bg-zinc-900 border border-[var(--border)] mb-8">
            <button
              type="button"
              onClick={() => {
                setTemplateType("strip");
                setActiveTab("all");
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                templateType === "strip"
                  ? "bg-[#0891B2] text-white shadow-lg shadow-[#0891B2]/30"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Photo Strips
            </button>
            <button
              type="button"
              onClick={() => {
                setTemplateType("photo_4x6");
                setActiveTab("all");
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                templateType === "photo_4x6"
                  ? "bg-[#0891B2] text-white shadow-lg shadow-[#0891B2]/30"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              4x6 Portrait
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 focus:border-[#0891B2] text-lg"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Floating Cart Button (Mobile) */}
      <button
        type="button"
        onClick={openCart}
        className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full bg-[#0891B2] text-white shadow-lg shadow-[#0891B2]/30 flex items-center justify-center"
        aria-label="Open cart"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-xs font-bold flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Main Content */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#0891B2] text-white"
                      : "bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                type="button"
                onClick={openCart}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[#0891B2]/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Cart</span>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#0891B2] text-white text-xs font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-[var(--muted)]">
              {isLoading
                ? "Loading templates..."
                : `Showing ${templates.length} of ${totalCount} ${templateType === "strip" ? "strip" : "portrait"} ${totalCount === 1 ? "template" : "templates"}`}
              {debouncedSearch && ` for "${debouncedSearch}"`}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden animate-pulse">
                  <div className="h-[300px] bg-slate-200 dark:bg-zinc-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/4" />
                    <div className="flex justify-between">
                      <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded w-16" />
                      <div className="h-8 bg-slate-200 dark:bg-zinc-800 rounded w-14" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && !isLoading && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Failed to load templates</h3>
              <p className="text-[var(--muted)] mb-6">Something went wrong. Please try again.</p>
            </div>
          )}

          {/* Template Grid */}
          {!isLoading && !isError && templates.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onQuickView={setQuickViewTemplate}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && templates.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">No templates found</h3>
              <p className="text-[var(--muted)] mb-6">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0891B2]/50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--muted)] px-4">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0891B2]/50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-10 md:p-14 rounded-3xl bg-gradient-to-br from-[#0891B2] to-[#0E7490] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Can&apos;t find what you need?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                We can create custom templates tailored to your brand and events.
                Get in touch with our design team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 rounded-xl bg-white text-[#0891B2] font-semibold hover:bg-white/90 transition-colors"
                >
                  Request Custom Template
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-3.5 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What file format do the templates come in?",
                a: "All templates come in high-resolution PNG format with transparent backgrounds where applicable. They're ready to use with PhotoBoothX software.",
              },
              {
                q: "Can I use these templates commercially?",
                a: "Yes! All purchased templates include a commercial license. You can use them for unlimited events and clients.",
              },
              {
                q: "Do I get updates to templates I've purchased?",
                a: "Yes, any updates or improvements to templates you've purchased are available to you at no extra cost.",
              },
              {
                q: "Can I get a refund if I'm not satisfied?",
                a: "We offer a 30-day money-back guarantee on all template purchases. If you're not happy, contact us for a full refund.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]"
              >
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{faq.q}</h3>
                <p className="text-sm text-[var(--muted)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Quick View Modal */}
      <QuickViewModal
        template={quickViewTemplate}
        isOpen={quickViewTemplate !== null}
        onClose={() => setQuickViewTemplate(null)}
      />
    </div>
  );
}
