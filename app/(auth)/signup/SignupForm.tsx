"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signupAction, type SignupActionResult } from "@/core/api/auth/signup/actions";
import { setAuthCookies } from "@/lib/auth";
import type { AuthResponse } from "@/core/api/auth/types";

export function SignupForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<SignupActionResult | null, FormData>(
    signupAction,
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Handle successful signup
  useEffect(() => {
    if (state?.success) {
      const { signinResponse, signupResponse, email } = state.data;

      // Check if email verification is required
      if (signinResponse && 'requires_verification' in signinResponse && signinResponse.requires_verification) {
        // Redirect to verify email page with token
        const params = new URLSearchParams({
          email,
          token: signinResponse.pending_authentication_token,
        });
        router.push(`/verify-email?${params.toString()}`);
      } else if (signinResponse && 'access_token' in signinResponse) {
        // signinResponse has tokens - set cookies and redirect to dashboard
        setAuthCookies(signinResponse as AuthResponse).then(() => {
          router.push('/dashboard');
        });
      } else if (signupResponse && 'access_token' in signupResponse) {
        // Fall back to signupResponse if it has tokens
        setAuthCookies(signupResponse as AuthResponse).then(() => {
          router.push('/dashboard');
        });
      } else {
        // No tokens available, redirect to signin
        router.push('/signin');
      }
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      {/* Error Message */}
      {state && !state.success && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            First name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="John"
            required
            minLength={2}
            maxLength={50}
            disabled={isPending}
            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Doe"
            required
            minLength={2}
            maxLength={50}
            disabled={isPending}
            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Work email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="john@company.com"
          required
          disabled={isPending}
          className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Create a strong password"
            required
            minLength={8}
            maxLength={50}
            disabled={isPending}
            className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Must be at least 8 characters with at least one letter
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            minLength={8}
            maxLength={50}
            disabled={isPending}
            className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded bg-white dark:bg-[#111111] border-slate-200 dark:border-zinc-800 text-[#10B981] focus:ring-[#10B981] focus:ring-offset-0"
        />
        <label htmlFor="terms" className="text-sm text-zinc-600 dark:text-zinc-400">
          I agree to the{" "}
          <Link href="/terms" className="text-[#10B981] hover:text-[#22D3EE]">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-[#10B981] hover:text-[#22D3EE]">Privacy Policy</Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending || !agreedToTerms}
        className="w-full py-4 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#10B981] flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
