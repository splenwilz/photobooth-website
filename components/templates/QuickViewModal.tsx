"use client";

import { useState } from "react";
import Image from "next/image";
import { Template } from "@/core/api/templates/types";
import { useCartStore } from "@/stores/cart-store";

interface QuickViewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ template, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, isInCart, openCart } = useCartStore();

  if (!isOpen || !template) return null;

  const inCart = isInCart(template.id);

  const handleAddToCart = () => {
    if (inCart) {
      openCart();
      onClose();
    } else {
      addItem(template);
      openCart();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-[var(--background)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative bg-slate-100 dark:bg-zinc-900">
            {/* Main Image */}
            <div className="relative aspect-[3/4]">
              <Image
                src={template.previewImages[selectedImage] || template.previewImage}
                alt={template.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {template.isNew && (
                  <span className="px-3 py-1 rounded-full bg-[#10B981] text-white text-sm font-semibold">
                    New
                  </span>
                )}
                {template.isFree && (
                  <span className="px-3 py-1 rounded-full bg-[#0891B2] text-white text-sm font-semibold">
                    Free
                  </span>
                )}
                {template.originalPrice && !template.isFree && (
                  <span className="px-3 py-1 rounded-full bg-[#EF4444] text-white text-sm font-semibold">
                    {Math.round((1 - template.price / template.originalPrice) * 100)}% Off
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {template.previewImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {template.previewImages.map((img, index) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? "border-[#0891B2]"
                        : "border-transparent hover:border-[var(--border)]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${template.name} preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            {/* Category */}
            <div className="mb-2">
              <span className="text-xs text-[var(--muted)] uppercase tracking-wide">
                {template.layoutType.replace(/-/g, " ")}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {template.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(template.rating) ? "text-[#F59E0B]" : "text-slate-300 dark:text-zinc-700"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-[var(--muted)]">
                {template.rating} ({template.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              {template.isFree ? (
                <span className="text-3xl font-bold text-[#10B981]">Free</span>
              ) : (
                <>
                  <span className="text-3xl font-bold text-[var(--foreground)]">
                    ${template.price.toFixed(2)}
                  </span>
                  {template.originalPrice && (
                    <span className="text-lg text-[var(--muted)] line-through">
                      ${template.originalPrice.toFixed(2)}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-[var(--muted)] mb-6 leading-relaxed">
              {template.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {template.downloads.toLocaleString()}
                </div>
                <div className="text-sm text-[var(--muted)]">Downloads</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {template.rating}
                </div>
                <div className="text-sm text-[var(--muted)]">Rating</div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-sm text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                inCart
                  ? "bg-[#10B981] text-white hover:bg-[#059669]"
                  : "bg-[#0891B2] text-white hover:bg-[#0E7490]"
              }`}
            >
              {inCart ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  View in Cart
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>

            {/* Features */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Instant download after purchase
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                High-resolution PNG files
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Commercial license included
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Works with all PhotoBoothX plans
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
