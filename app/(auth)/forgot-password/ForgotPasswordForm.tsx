"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type ForgotPasswordActionResult } from "@/core/api/auth/forgot-password/actions";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ForgotPasswordActionResult | null, FormData>(
    forgotPasswordAction,
    null
  );
  const [email, setEmail] = useState("");

  // Handle successful submission
  useEffect(() => {
    if (state?.success) {
      router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
    }
  }, [state, router, email]);

  return (
    <form action={formAction} className="space-y-5">
      {/* Error Message */}
      {state && !state.success && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@company.com"
          required
          disabled={isPending}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all shadow-lg shadow-[#0891B2]/20 hover:shadow-[#0891B2]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0891B2] flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          "Send Reset Code"
        )}
      </button>

      {/* Back to Sign In */}
      <p className="text-center text-sm text-zinc-500">
        Remember your password?{" "}
        <Link href="/signin" className="text-[#0891B2] hover:text-[#22D3EE] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
