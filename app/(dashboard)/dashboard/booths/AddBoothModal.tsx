"use client";

import { useState } from "react";
import { useCreateBooth } from "@/core/api/booths";
import type { CreateBoothResponse } from "@/core/api/booths/types";

interface AddBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = "form" | "success";

export function AddBoothModal({ isOpen, onClose }: AddBoothModalProps) {
  const [step, setStep] = useState<ModalStep>("form");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [createdBooth, setCreatedBooth] = useState<CreateBoothResponse | null>(null);

  const { mutate: createBooth, isPending, error } = useCreateBooth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBooth(
      { name, address },
      {
        onSuccess: (data) => {
          setCreatedBooth(data);
          setStep("success");
        },
      }
    );
  };

  const handleClose = () => {
    // Reset state when closing
    setStep("form");
    setName("");
    setAddress("");
    setCreatedBooth(null);
    onClose();
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
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-all"
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
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-all"
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
            className="flex-1 px-4 py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
  onClose: () => void;
}

function SuccessStep({ booth, onClose }: SuccessStepProps) {
  const [copied, setCopied] = useState<"code" | "key" | "id" | null>(null);

  const copyToClipboard = async (text: string, type: "code" | "key" | "id") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Booth Created!</h2>
            <p className="text-sm text-zinc-500">{booth.name}</p>
          </div>
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

      {/* Content */}
      <div className="p-6 space-y-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Use the registration code below to connect your photo booth.
        </p>

        {/* Registration Code */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Registration Code
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 font-mono text-2xl tracking-widest text-center text-zinc-900 dark:text-white">
              {booth.registration_code}
            </div>
            <button
              onClick={() => copyToClipboard(booth.registration_code, "code")}
              className="p-3 rounded-xl border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {copied === "code" ? (
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            Code expires at {new Date(booth.code_expires_at).toLocaleString()}
          </p>
        </div>

        {/* Advanced (collapsible) */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Advanced
          </summary>
          <div className="mt-3 space-y-3">
            {/* Booth ID */}
            <div className="space-y-1">
              <label className="block text-xs text-zinc-500">Booth ID</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 overflow-hidden text-ellipsis">
                  {booth.id}
                </code>
                <button
                  onClick={() => copyToClipboard(booth.id, "id")}
                  className="p-2 rounded-lg border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copied === "id" ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-1">
              <label className="block text-xs text-zinc-500">API Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 overflow-hidden text-ellipsis">
                  {booth.api_key}
                </code>
                <button
                  onClick={() => copyToClipboard(booth.api_key, "key")}
                  className="p-2 rounded-lg border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copied === "key" ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </details>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] transition-colors"
        >
          Done
        </button>
      </div>
    </>
  );
}
