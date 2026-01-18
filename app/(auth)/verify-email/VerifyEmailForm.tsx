"use client";

import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { verifyEmailAction, type VerifyEmailActionResult } from "@/core/api/auth/verify-email/actions";
import { setAuthCookies } from "@/lib/auth";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [state, formAction, isPending] = useActionState<VerifyEmailActionResult | null, FormData>(
    verifyEmailAction,
    null
  );

  // 6 digit code inputs
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle successful verification
  useEffect(() => {
    if (state?.success) {
      // Set auth cookies and redirect to dashboard
      setAuthCookies(state.data).then(() => {
        router.push('/dashboard');
      });
    }
  }, [state, router]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);

      // Focus last filled input or the next empty one
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const codeValue = code.join("");
  const isCodeComplete = codeValue.length === 6;

  // If no token, show error
  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Invalid Verification Link</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          This verification link is invalid or has expired. Please try signing up again.
        </p>
        <button
          onClick={() => router.push('/signup')}
          className="px-6 py-3 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-all"
        >
          Back to Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Check your email</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        We sent a verification code to<br />
        <span className="font-medium text-zinc-900 dark:text-white">{email}</span>
      </p>

      {/* Error Message */}
      {state && !state.success && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-6">
          {state.error}
        </div>
      )}

      {/* Code Input Form */}
      <form action={formAction}>
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="code" value={codeValue} />

        <div className="flex justify-center gap-3 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isPending}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isPending || !isCodeComplete}
          className="w-full py-4 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#10B981] flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </button>
      </form>

      {/* Resend Link */}
      <p className="text-sm text-zinc-500 mt-6">
        Didn&apos;t receive the code?{" "}
        <button className="text-[#10B981] hover:text-[#22D3EE] font-medium transition-colors">
          Resend
        </button>
      </p>
    </div>
  );
}
