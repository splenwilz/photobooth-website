"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { useTemplateCheckout } from "@/core/api/payments";
import { useBoothList } from "@/core/api/booths/queries";
import { useOwnedFrom } from "@/core/api/templates/queries";
import { ApiError } from "@/core/api/client";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getSubtotal, closeCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [selectedBoothId, setSelectedBoothId] = useState<string>("");
  const templateCheckout = useTemplateCheckout();
  const { data: boothListData, isLoading: boothsLoading, isError: boothsError } = useBoothList();
  // Templates are booth-scoped, so a re-purchase for the same booth is a
  // genuine duplicate. Ask the backend a direct membership question:
  // "of these cart template IDs, which has this booth already bought?"
  // Bounded by cart size — no pagination, no booth-history scaling.
  // Free templates are excluded: re-downloading is free, so there's
  // nothing to warn about, and a free-only cart doesn't need to fire
  // this query at all (avoids a pointless network round-trip + spinner).
  const cartTemplateIds = useMemo(
    () =>
      items
        .filter((i) => parseFloat(i.template.price) > 0)
        .map((i) => i.template.id),
    [items]
  );
  const {
    data: ownedData,
    isFetching: ownedFetching,
    isError: ownedErrored,
  } = useOwnedFrom({
    booth_id: selectedBoothId,
    template_ids: cartTemplateIds,
  });
  // The duplicate check is the only thing protecting the user from
  // accidentally paying twice for a template their booth already owns.
  // Treat any in-flight or not-yet-fired check (booth just selected,
  // booth changed) as "we don't know yet" — block Pay and show a small
  // status line so they can't race the network.
  //
  // If the check ERRORED (network down, backend 5xx), don't keep Pay
  // disabled forever — the warning is advisory, not authoritative.
  // Falling through means the user can pay; in the worst case they pay
  // for a duplicate, which is the same outcome as before this feature
  // existed. Better than locking them out of checkout entirely.
  const dupCheckPending =
    !!selectedBoothId &&
    cartTemplateIds.length > 0 &&
    !ownedErrored &&
    (ownedFetching || ownedData === undefined);
  // The query key includes booth_id, so the cache can never serve data
  // from a different booth — no stale-data guard needed.
  const purchasedTemplateIds = useMemo(
    () => new Set(ownedData?.owned_template_ids ?? []),
    [ownedData]
  );
  // Skip free templates — re-downloading is free, so a "you'll be charged
  // again" warning would be misleading.
  const duplicateItems = useMemo(
    () =>
      items.filter(
        (item) =>
          parseFloat(item.template.price) > 0 &&
          purchasedTemplateIds.has(item.template.id)
      ),
    [items, purchasedTemplateIds]
  );

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
            // Don't clear the cart here — the user hasn't paid yet, and a
            // Stripe-side cancel would otherwise leave them with an empty
            // cart back on /templates. The cart is cleared on the success
            // page once fulfillment_status === "completed".
            closeCart();
            window.location.href = data.checkout_url;
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
            <label htmlFor="booth-select" className="block text-sm font-medium text-[var(--foreground)] mb-2">
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
                id="booth-select"
                value={selectedBoothId}
                onChange={(e) => setSelectedBoothId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#069494]"
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

          {/* While the duplicate-check is in flight, show a small status
              line so the user doesn't race the network and pay before the
              warning has a chance to render. The Pay button is also
              disabled below for the same reason. We intentionally do NOT
              use aria-live here — rapid booth switches would flood
              screen-reader queues. The disabled Pay button + visible
              spinner are sufficient AT signal. */}
          {dupCheckPending && (
            <div className="mb-6 p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center gap-2 text-sm text-[var(--muted)]">
              <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Checking which templates this booth already owns…</span>
            </div>
          )}

          {/* Duplicate-purchase warning. Templates are booth-scoped, so
              "already purchased" is a per-booth check that only kicks in
              once a booth is selected. Allow proceed (legitimate
              repurchase reasons exist) but make the cost explicit. */}
          {selectedBoothId && !dupCheckPending && duplicateItems.length > 0 && (
            <div
              role="alert"
              className="mb-6 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex gap-3"
            >
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-yellow-700 dark:text-yellow-300">
                  {duplicateItems.length === 1
                    ? "1 template is already purchased for this booth"
                    : `${duplicateItems.length} templates are already purchased for this booth`}
                </p>
                <p className="text-yellow-700/80 dark:text-yellow-400/80 mt-0.5">
                  You can proceed if you want, but you&apos;ll be charged again. Remove them from your cart or pick a different booth to avoid duplicate charges.
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-3 mb-6">
            {items.map((item) => {
              const price = parseFloat(item.template.price);
              const isFree = price === 0;
              // Free items are always re-downloadable; only paid duplicates
              // imply a "you'll be charged again" outcome, so the duplicate
              // badge is paid-only.
              const isDuplicate =
                !isFree &&
                !!selectedBoothId &&
                purchasedTemplateIds.has(item.template.id);
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
                    {isFree ? (
                      <p className="text-xs text-[#10B981]">Free — download directly</p>
                    ) : isDuplicate ? (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Already purchased for this booth
                      </p>
                    ) : null}
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
              disabled={templateCheckout.isPending || subtotal === 0 || !selectedBoothId || dupCheckPending}
              className="flex-1 py-3.5 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
