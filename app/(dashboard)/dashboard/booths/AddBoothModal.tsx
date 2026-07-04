"use client";

import { useState, useRef, useEffect } from "react";
import { useCreateBooth } from "@/core/api/booths";
import type { CreateBoothResponse } from "@/core/api/booths/types";

interface AddBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Open the Subscribe flow for the just-created booth. */
  onSubscribe: (boothId: string, boothName: string) => void;
}

type ModalStep = "form" | "success";

export function AddBoothModal({ isOpen, onClose, onSubscribe }: AddBoothModalProps) {
  const [step, setStep] = useState<ModalStep>("form");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [createdBooth, setCreatedBooth] = useState<CreateBoothResponse | null>(null);

  // Track if modal is open to prevent stale onSuccess callbacks
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const { mutate: createBooth, isPending, error } = useCreateBooth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBooth(
      { name, address },
      {
        onSuccess: (data) => {
          // Only update state if modal is still open
          if (isOpenRef.current) {
            setCreatedBooth(data);
            setStep("success");
          }
        },
      }
    );
  };

  const handleClose = () => {
    // Prevent closing while mutation is in flight
    if (isPending) return;

    // Reset state when closing
    setStep("form");
    setName("");
    setAddress("");
    setCreatedBooth(null);
    onClose();
  };

  const handleSubscribe = () => {
    if (!createdBooth) return;
    // Hand off to the shared Subscribe flow, then reset + close this modal so
    // it can't reopen on the stale "success" step next time.
    onSubscribe(createdBooth.id, createdBooth.name);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-[var(--border)]">
        {step === "form" ? (
          <FormStep
            name={name}
            setName={setName}
            address={address}
            setAddress={setAddress}
            onSubmit={handleSubmit}
            onClose={handleClose}
            isPending={isPending}
            error={error}
          />
        ) : (
          <SuccessStep
            booth={createdBooth!}
            onSubscribe={handleSubscribe}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

interface FormStepProps {
  name: string;
  setName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isPending: boolean;
  error: Error | null;
}

function FormStep({
  name,
  setName,
  address,
  setAddress,
  onSubmit,
  onClose,
  isPending,
  error,
}: FormStepProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Add New Booth</h2>
          <p className="text-sm text-zinc-500 mt-1">Create a new photo booth location</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500">{error.message}</p>
          </div>
        )}

        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="booth-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Booth Name
          </label>
          <input
            id="booth-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Downtown Mall Booth"
            required
            minLength={1}
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all"
          />
        </div>

        {/* Address Field */}
        <div className="space-y-2">
          <label htmlFor="booth-address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Address
          </label>
          <input
            id="booth-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., 123 Main Street, City, State"
            required
            minLength={1}
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !name.trim() || !address.trim()}
            className="flex-1 px-4 py-3 rounded-xl bg-[#069494] text-white font-medium hover:bg-[#176161] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create Booth"
            )}
          </button>
        </div>
      </form>
    </>
  );
}

interface SuccessStepProps {
  booth: CreateBoothResponse;
  onSubscribe: () => void;
  onClose: () => void;
}

function SuccessStep({ booth, onSubscribe, onClose }: SuccessStepProps) {
  return (
    <>
      {/* Floating close */}
      <div className="flex justify-end p-4 pb-0">
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 -mt-2 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-8 ring-emerald-500/10">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
          Booth created
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {booth.name}
          </span>{" "}
          is ready to activate
        </p>
      </div>

      {/* Subscribe callout + actions */}
      <div className="p-6 space-y-4">
        <div className="rounded-xl border border-[#069494]/20 bg-gradient-to-br from-[#069494]/10 to-transparent p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-lg bg-[#069494]/15 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              One step left
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            To link this booth to a kiosk and start taking payments, subscribe it
            to a plan.
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={onSubscribe}
            className="w-full px-4 py-3 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-colors flex items-center justify-center gap-2"
          >
            Subscribe now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors"
          >
            I&apos;ll do this later
          </button>
        </div>
      </div>
    </>
  );
}
