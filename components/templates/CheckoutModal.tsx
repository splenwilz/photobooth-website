"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { useTemplateCheckout } from "@/core/api/payments";
import { useBoothList } from "@/core/api/booths/queries";
import { ApiError } from "@/core/api/client";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getSubtotal, clearCart, closeCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [selectedBoothId, setSelectedBoothId] = useState<string>("");
  const templateCheckout = useTemplateCheckout();
  const { data: boothListData, isLoading: boothsLoading, isError: boothsError } = useBoothList();

  const booths = boothListData?.booths ?? [];
  const subtotal = getSubtotal();

  const handleCheckout = async () => {
    setError(null);

    if (!selectedBoothId) {
      setError("Please select a booth for this purchase.");
      return;
    }

    // Filter out free templates — they use download, not checkout
    const paidItems = items.filter(
      (item) => parseFloat(item.template.price) > 0
    );

    if (paidItems.length === 0) {
      setError("No paid templates in cart. Free templates can be downloaded directly.");
      return;
    }

    templateCheckout.mutate(
      {
        booth_id: selectedBoothId,
        items: paidItems.map((item) => ({
          template_id: item.template.id,
          quantity: item.quantity,
        })),
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=templates`,
        cancel_url: `${window.location.origin}/templates`,
      },
      {
        onSuccess: (data) => {
          if (data.success && data.checkout_url) {
            closeCart();
            window.location.href = data.checkout_url;
            clearCart();
          } else {
            setError(data.error_message || "Failed to create checkout session.");
          }
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError("Something went wrong. Please try again.");
          }
        },
      }
    );
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[var(--background)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors z-10"
          aria-label="Close checkout"
        >
          <svg className="w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Checkout</h2>
          <p className="text-sm text-[var(--muted)]">
            Review your order and proceed to payment
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booth Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Purchase for booth
            </label>
            {boothsLoading ? (
              <div className="h-11 rounded-xl bg-slate-100 dark:bg-zinc-900 animate-pulse" />
            ) : boothsError ? (
              <p className="text-sm text-red-500">Failed to load booths. Please try again.</p>
            ) : booths.length === 0 ? (
              <p className="text-sm text-red-500">No booths found. Please create a booth first.</p>
            ) : (
              <select
                value={selectedBoothId}
                onChange={(e) => setSelectedBoothId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              >
                <option value="">Select a booth...</option>
                {booths.map((booth) => (
                  <option key={booth.id} value={booth.id}>
                    {booth.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-6">
            {items.map((item) => {
              const price = parseFloat(item.template.price);
              const isFree = price === 0;
              return (
                <div key={item.template.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-900 shrink-0">
                    <Image
                      src={item.template.preview_url}
                      alt={item.template.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {item.template.name}
                    </p>
                    {isFree && (
                      <p className="text-xs text-[#10B981]">Free — download directly</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {isFree ? "Free" : `$${price.toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)]">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--muted)]">Subtotal ({items.length} items)</span>
              <span className="text-[var(--foreground)]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-[var(--border)]">
              <span className="text-[var(--foreground)]">Total</span>
              <span className="text-xl text-[var(--foreground)]">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Stripe Info */}
          <p className="mt-4 text-xs text-center text-[var(--muted)]">
            You&apos;ll be redirected to Stripe for secure payment
          </p>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={templateCheckout.isPending || subtotal === 0 || !selectedBoothId}
              className="flex-1 py-3.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {templateCheckout.isPending ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Redirecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pay ${subtotal.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
