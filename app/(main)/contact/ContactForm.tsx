"use client";

import { useState } from "react";

type InquiryType = "sales" | "support" | "partnership" | "other";

interface FormData {
  name: string;
  email: string;
  company: string;
  inquiryType: InquiryType;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    inquiryType: "sales",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate form submission - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Implement actual form submission
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setSubmitted(true);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-[var(--muted)] mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              email: "",
              company: "",
              inquiryType: "sales",
              message: "",
            });
          }}
          className="text-[#0891B2] hover:text-[#22D3EE] font-medium transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all"
          placeholder="John Doe"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all"
          placeholder="john@example.com"
        />
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-2">
          Company
        </label>
        <input
          type="text"
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all"
          placeholder="Your company (optional)"
        />
      </div>

      {/* Inquiry Type */}
      <div>
        <label htmlFor="inquiryType" className="block text-sm font-medium mb-2">
          What can we help you with? <span className="text-red-500">*</span>
        </label>
        <select
          id="inquiryType"
          required
          value={formData.inquiryType}
          onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value as InquiryType })}
          className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all"
        >
          <option value="sales">Sales inquiry</option>
          <option value="support">Technical support</option>
          <option value="partnership">Partnership opportunity</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0891B2] focus:border-transparent transition-all resize-none"
          placeholder="Tell us more about your inquiry..."
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      {/* Privacy Note */}
      <p className="text-xs text-[var(--muted)] text-center">
        By submitting this form, you agree to our{" "}
        <a href="/privacy" className="text-[#0891B2] hover:text-[#22D3EE] transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
