"use client";

import { useState } from "react";
import Image from "next/image";
import { Template, TemplateReview } from "@/core/api/templates/types";
import { useCartStore } from "@/stores/cart-store";
import {
  useTemplateReviews,
  useSubmitReview,
  useUpdateReview,
  useDeleteReview,
} from "@/core/api/templates/queries";
import { ApiError } from "@/core/api/client";
import { useUser } from "@/hooks/use-user";

interface QuickViewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      className={`${className ?? "w-4 h-4"} ${filled ? "text-[#F59E0B]" : "text-slate-300 dark:text-zinc-700"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function StarPicker({
  rating,
  hover,
  onRate,
  onHover,
  onLeave,
}: {
  rating: number;
  hover: number;
  onRate: (star: number) => void;
  onHover: (star: number) => void;
  onLeave: () => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <svg
            className={`w-7 h-7 transition-colors ${
              star <= (hover || rating)
                ? "text-[#F59E0B]"
                : "text-slate-300 dark:text-zinc-700"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function QuickViewModal({ template, isOpen, onClose }: QuickViewModalProps) {
  const { addItem, isInCart, openCart } = useCartStore();
  const { user } = useUser();

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Edit state
  const [editingReview, setEditingReview] = useState<TemplateReview | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editHover, setEditHover] = useState(0);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editError, setEditError] = useState("");

  // Delete state
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  // Hooks must be called unconditionally
  const templateId = template?.id ?? 0;
  const { data: reviewsData, isLoading: reviewsLoading } = useTemplateReviews(templateId);
  const submitReviewMutation = useSubmitReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  if (!isOpen || !template) return null;

  const inCart = isInCart(template.id);
  const price = parseFloat(template.price);
  const originalPrice = template.original_price
    ? parseFloat(template.original_price)
    : null;
  const isFree = price === 0;
  const rating = parseFloat(template.rating_average) || 0;
  const tags = (template.tags || "").split(",").filter(Boolean);
  const reviews = reviewsData?.reviews ?? [];
  const reviewCount = reviewsData?.total ?? template.review_count;

  const userReview = user ? reviews.find((r) => r.user_id === user.id) : null;

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");

    if (reviewRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }

    try {
      await submitReviewMutation.mutateAsync({
        templateId: template.id,
        data: {
          rating: reviewRating,
          ...(reviewTitle.trim() && { title: reviewTitle.trim() }),
          ...(reviewComment.trim() && { comment: reviewComment.trim() }),
        },
      });
      setReviewRating(0);
      setReviewTitle("");
      setReviewComment("");
      setReviewSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setReviewError("You've already reviewed this template.");
      } else {
        setReviewError("Failed to submit review. Please try again.");
      }
    }
  };

  const startEditing = (review: TemplateReview) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditTitle(review.title ?? "");
    setEditComment(review.comment ?? "");
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setEditError("");
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setEditError("");

    if (editRating === 0) {
      setEditError("Please select a rating.");
      return;
    }

    try {
      await updateReviewMutation.mutateAsync({
        templateId: template.id,
        reviewId: editingReview.id,
        data: {
          rating: editRating,
          title: editTitle.trim() || undefined,
          comment: editComment.trim() || undefined,
        },
      });
      setEditingReview(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setEditError("You can only edit your own reviews.");
      } else {
        setEditError("Failed to update review. Please try again.");
      }
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReviewMutation.mutateAsync({
        templateId: template.id,
        reviewId,
      });
      setDeletingReviewId(null);
      setReviewSubmitted(false);
    } catch {
      setDeletingReviewId(null);
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
          {/* Image */}
          <div className="relative bg-slate-100 dark:bg-zinc-900">
            <div className="relative aspect-[3/4]">
              <Image
                src={template.preview_url}
                alt={template.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {template.is_new && (
                  <span className="px-3 py-1 rounded-full bg-[#10B981] text-white text-sm font-semibold">
                    New
                  </span>
                )}
                {isFree && (
                  <span className="px-3 py-1 rounded-full bg-[#0891B2] text-white text-sm font-semibold">
                    Free
                  </span>
                )}
                {originalPrice && !isFree && (
                  <span className="px-3 py-1 rounded-full bg-[#EF4444] text-white text-sm font-semibold">
                    {Math.round((1 - price / originalPrice) * 100)}% Off
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            {/* Category */}
            <div className="mb-2">
              <span className="text-xs text-[var(--muted)] uppercase tracking-wide">
                {template.layout?.layout_key?.replace(/-/g, " ") || template.template_type.replace(/_/g, " ")}
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
                  <StarIcon key={star} filled={star <= Math.round(rating)} />
                ))}
              </div>
              <span className="text-sm text-[var(--muted)]">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              {isFree ? (
                <span className="text-3xl font-bold text-[#10B981]">Free</span>
              ) : (
                <>
                  <span className="text-3xl font-bold text-[var(--foreground)]">
                    ${price.toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-[var(--muted)] line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-[var(--muted)] mb-6 leading-relaxed">
              {template.description ?? ""}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {template.download_count.toLocaleString()}
                </div>
                <div className="text-sm text-[var(--muted)]">Downloads</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {rating.toFixed(1)}
                </div>
                <div className="text-sm text-[var(--muted)]">Rating</div>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-sm text-[var(--muted)]"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

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

            {/* Reviews Section */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Reviews ({reviewCount})
              </h3>

              {reviewsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] animate-pulse">
                      <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-24 mb-2" />
                      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {reviews.map((review) => {
                    const isOwn = user?.id === review.user_id;

                    // Inline edit form
                    if (editingReview?.id === review.id) {
                      return (
                        <form
                          key={review.id}
                          onSubmit={handleUpdateReview}
                          className="p-4 rounded-xl bg-[var(--card)] border-2 border-[#0891B2]/30 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#0891B2]">Editing your review</span>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                              Cancel
                            </button>
                          </div>
                          <StarPicker
                            rating={editRating}
                            hover={editHover}
                            onRate={setEditRating}
                            onHover={setEditHover}
                            onLeave={() => setEditHover(0)}
                          />
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title (optional)"
                            className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50"
                          />
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            placeholder="Comment (optional)"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 resize-none"
                          />
                          {editError && (
                            <p className="text-xs text-[#EF4444]">{editError}</p>
                          )}
                          <button
                            type="submit"
                            disabled={updateReviewMutation.isPending}
                            className="w-full py-2 rounded-lg bg-[#0891B2] text-white text-sm font-semibold hover:bg-[#0E7490] transition-colors disabled:opacity-50"
                          >
                            {updateReviewMutation.isPending ? "Saving..." : "Save Changes"}
                          </button>
                        </form>
                      );
                    }

                    // Delete confirmation
                    if (deletingReviewId === review.id) {
                      return (
                        <div
                          key={review.id}
                          className="p-4 rounded-xl bg-[#EF4444]/5 border border-[#EF4444]/20"
                        >
                          <p className="text-sm text-[var(--foreground)] mb-3">
                            Delete this review? This cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={deleteReviewMutation.isPending}
                              className="px-4 py-1.5 rounded-lg bg-[#EF4444] text-white text-sm font-medium hover:bg-[#DC2626] transition-colors disabled:opacity-50"
                            >
                              {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingReviewId(null)}
                              className="px-4 py-1.5 rounded-lg border border-[var(--border)] text-sm text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // Normal review display
                    return (
                      <div
                        key={review.id}
                        className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon key={star} filled={star <= review.rating} className="w-3.5 h-3.5" />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            {isOwn && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEditing(review)}
                                  className="text-xs text-[#0891B2] hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingReviewId(review.id)}
                                  className="text-xs text-[#EF4444] hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                            <span className="text-xs text-[var(--muted)]">
                              {formatRelativeDate(review.created_at)}
                            </span>
                          </div>
                        </div>
                        {review.title && (
                          <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
                            {review.title}
                          </p>
                        )}
                        {review.comment && (
                          <p className="text-sm text-[var(--muted)]">
                            {review.comment}
                          </p>
                        )}
                        {isOwn && (
                          <span className="inline-block mt-1 text-xs text-[#0891B2]">Your review</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)] mb-4">
                  No reviews yet. Be the first!
                </p>
              )}
            </div>

            {/* Write a Review */}
            {!userReview && (
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Write a Review
                </h3>

                {reviewSubmitted ? (
                  <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                    <div className="flex items-center gap-2 text-[#10B981]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-semibold text-sm">Review submitted successfully!</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Star Picker */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                        Rating <span className="text-[#EF4444]">*</span>
                      </label>
                      <StarPicker
                        rating={reviewRating}
                        hover={reviewHover}
                        onRate={setReviewRating}
                        onHover={setReviewHover}
                        onLeave={() => setReviewHover(0)}
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label htmlFor="review-title" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                        Title <span className="text-xs text-[var(--muted)]">(optional)</span>
                      </label>
                      <input
                        type="text"
                        id="review-title"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 focus:border-[#0891B2]"
                      />
                    </div>

                    {/* Comment */}
                    <div>
                      <label htmlFor="review-comment" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                        Comment <span className="text-xs text-[var(--muted)]">(optional)</span>
                      </label>
                      <textarea
                        id="review-comment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell others about your experience..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 focus:border-[#0891B2] resize-none"
                      />
                    </div>

                    {/* Error */}
                    {reviewError && (
                      <p className="text-sm text-[#EF4444]">{reviewError}</p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitReviewMutation.isPending}
                      className="w-full py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitReviewMutation.isPending ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
