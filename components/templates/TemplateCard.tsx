"use client";

import Image from "next/image";
import { Template } from "@/core/api/templates/types";
import { useCartStore } from "@/stores/cart-store";

interface TemplateCardProps {
  template: Template;
  onQuickView?: (template: Template) => void;
}

export function TemplateCard({ template, onQuickView }: TemplateCardProps) {
  const { addItem, isInCart, openCart } = useCartStore();
  const inCart = isInCart(template.id);

  const handleAddToCart = () => {
    if (inCart) {
      openCart();
    } else {
      addItem(template);
      openCart();
    }
  };

  // Different heights for different template types
  const isPortrait = template.category === "4x6-portrait";
  const imageHeight = isPortrait ? "h-[300px]" : "h-[400px]";

  return (
    <div className="group relative w-full rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden transition-all hover:border-[#0891B2]/50 hover:shadow-lg hover:shadow-[#0891B2]/5">
      {/* Image Container */}
      <div className={`relative ${imageHeight} bg-slate-100 dark:bg-zinc-900 overflow-hidden`}>
        <Image
          src={template.previewImage}
          alt={template.name}
          fill
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
          sizes="200px"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {template.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-[#10B981] text-white text-xs font-semibold">
              New
            </span>
          )}
          {template.isFree && (
            <span className="px-2.5 py-1 rounded-full bg-[#0891B2] text-white text-xs font-semibold">
              Free
            </span>
          )}
          {template.originalPrice && !template.isFree && (
            <span className="px-2.5 py-1 rounded-full bg-[#EF4444] text-white text-xs font-semibold">
              Sale
            </span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(template)}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              aria-label="Quick view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={handleAddToCart}
            className="p-3 rounded-full bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors"
            aria-label={inCart ? "View cart" : "Add to cart"}
          >
            {inCart ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Tag */}
        <div className="mb-2">
          <span className="text-xs text-[var(--muted)] uppercase tracking-wide">
            {template.layoutType.replace(/-/g, " ")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[var(--foreground)] mb-1 truncate">
          {template.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(template.rating) ? "text-[#F59E0B]" : "text-slate-300 dark:text-zinc-700"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-[var(--muted)]">({template.reviewCount})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {template.isFree ? (
              <span className="text-lg font-bold text-[#10B981]">Free</span>
            ) : (
              <>
                <span className="text-lg font-bold text-[var(--foreground)]">
                  ${template.price.toFixed(2)}
                </span>
                {template.originalPrice && (
                  <span className="text-sm text-[var(--muted)] line-through">
                    ${template.originalPrice.toFixed(2)}
                  </span>
                )}
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              inCart
                ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"
                : "bg-[#0891B2]/10 text-[#0891B2] hover:bg-[#0891B2]/20"
            }`}
          >
            {inCart ? "In Cart" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
