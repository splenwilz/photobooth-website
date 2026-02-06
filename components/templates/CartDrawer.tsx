"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutModal } from "./CheckoutModal";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, getSubtotal, getItemCount } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration pattern
    setMounted(true);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[var(--background)] border-l border-[var(--border)] z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0891B2]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Your Cart</h2>
              <p className="text-sm text-[var(--muted)]">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6" style={{ height: "calc(100vh - 200px)" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Your cart is empty</h3>
              <p className="text-sm text-[var(--muted)] mb-6">Browse our templates and add some to your cart!</p>
              <button
                type="button"
                onClick={closeCart}
                className="px-6 py-2.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
              >
                Browse Templates
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.template.id}
                  className="flex gap-4 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]"
                >
                  {/* Image */}
                  <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-900 shrink-0">
                    <Image
                      src={item.template.preview_url}
                      alt={item.template.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--foreground)] truncate">
                      {item.template.name}
                    </h4>
                    <p className="text-xs text-[var(--muted)] mb-2">
                      {item.template.layout?.layout_key?.replace(/-/g, " ") || item.template.template_type.replace(/_/g, " ")}
                    </p>
                    <div className="flex items-center gap-2">
                      {parseFloat(item.template.price) === 0 ? (
                        <span className="text-sm font-bold text-[#10B981]">Free</span>
                      ) : (
                        <span className="text-sm font-bold text-[var(--foreground)]">
                          ${parseFloat(item.template.price).toFixed(2)}
                        </span>
                      )}
                      {item.template.original_price && (
                        <span className="text-xs text-[var(--muted)] line-through">
                          ${parseFloat(item.template.original_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.template.id)}
                    className="p-2 rounded-lg text-[var(--muted)] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors self-start"
                    aria-label={`Remove ${item.template.name} from cart`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-[var(--background)] border-t border-[var(--border)]">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span className="text-xl font-bold text-[var(--foreground)]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="w-full py-3.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Checkout
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Instant download
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}
