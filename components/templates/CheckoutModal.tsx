"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = "details" | "payment" | "success";

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getSubtotal, clearCart, closeCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const subtotal = getSubtotal();
  const tax = subtotal * 0.0; // No tax for digital goods demo
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setStep("success");
  };

  const handleClose = () => {
    if (step === "success") {
      clearCart();
      closeCart();
    }
    setStep("details");
    setFormData({
      email: "",
      name: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    });
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

        {step === "success" ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              Purchase Complete!
            </h2>
            <p className="text-[var(--muted)] mb-6">
              Thank you for your purchase. Your templates are ready to download.
            </p>

            {/* Order Summary */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-sm text-[var(--foreground)] mb-3">Order Summary</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.template.id} className="flex items-center gap-3">
                    <div className="relative w-10 h-14 rounded overflow-hidden bg-slate-100 dark:bg-zinc-900 shrink-0">
                      <Image
                        src={item.template.previewImage}
                        alt={item.template.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{item.template.name}</p>
                    </div>
                    <span className="text-sm text-[var(--muted)]">
                      {item.template.isFree ? "Free" : `$${item.template.price.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between">
                <span className="font-semibold text-[var(--foreground)]">Total</span>
                <span className="font-bold text-[var(--foreground)]">${total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)] mb-6">
              A confirmation email has been sent to <strong>{formData.email || "your email"}</strong>
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
              >
                Download Templates
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Checkout</h2>
              <p className="text-sm text-[var(--muted)]">
                {step === "details" ? "Enter your details" : "Complete payment"}
              </p>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-4">
                <div className={`flex items-center gap-2 ${step === "details" ? "text-[#0891B2]" : "text-[#10B981]"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === "details" ? "bg-[#0891B2] text-white" : "bg-[#10B981] text-white"
                  }`}>
                    {step === "details" ? "1" : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">Details</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-200 dark:bg-zinc-700 mx-2">
                  <div className={`h-full bg-[#0891B2] transition-all ${step === "payment" ? "w-full" : "w-0"}`} />
                </div>
                <div className={`flex items-center gap-2 ${step === "payment" ? "text-[#0891B2]" : "text-[var(--muted)]"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === "payment" ? "bg-[#0891B2] text-white" : "bg-slate-200 dark:bg-zinc-700 text-[var(--muted)]"
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Payment</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === "details" ? (
                <form onSubmit={handleSubmitDetails}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 focus:border-[#0891B2]"
                      />
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 focus:border-[#0891B2]"
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)]">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--muted)]">Subtotal ({items.length} items)</span>
                      <span className="text-[var(--foreground)]">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--muted)]">Tax</span>
                      <span className="text-[var(--foreground)]">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-[var(--border)]">
                      <span className="text-[var(--foreground)]">Total</span>
                      <span className="text-[var(--foreground)]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmitPayment}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 focus:border-[#0891B2]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 focus:border-[#0891B2]"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          name="cvc"
                          value={formData.cvc}
                          onChange={handleInputChange}
                          required
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 focus:border-[#0891B2]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Demo Notice */}
                  <div className="mt-4 p-3 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                    <p className="text-xs text-[#F59E0B]">
                      <strong>Demo Mode:</strong> Use any card details. No real payment will be processed.
                    </p>
                  </div>

                  {/* Total */}
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-[var(--border)]">
                    <div className="flex justify-between font-bold">
                      <span className="text-[var(--foreground)]">Total</span>
                      <span className="text-xl text-[var(--foreground)]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="px-6 py-3.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 py-3.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Pay ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
