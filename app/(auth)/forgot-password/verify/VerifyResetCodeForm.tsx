"use client";

import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { verifyResetCodeAction, type VerifyResetCodeActionResult } from "@/core/api/auth/verify-reset-code/actions";

export function VerifyResetCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [state, formAction, isPending] = useActionState<VerifyResetCodeActionResult | null, FormData>(
    verifyResetCodeAction,
    null
  );

  // 6 digit code inputs
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle successful verification
  useEffect(() => {
    if (state?.success) {
      router.push(`/forgot-password/reset?token=${encodeURIComponent(state.token)}`);
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

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#069494]/20 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Check your email</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        We sent a verification code to<br />
        {email ? (
          <span className="font-medium text-zinc-900 dark:text-white">{email}</span>
        ) : (
          <span className="font-medium text-zinc-900 dark:text-white">your email address</span>
        )}
      </p>

      {/* Error Message */}
      {state && !state.success && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-6">
          {state.error}
        </div>
      )}

      {/* Code Input Form */}
      <form action={formAction} autoComplete="one-time-code">
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
              className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isPending || !isCodeComplete}
          className="w-full py-4 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-all shadow-lg shadow-[#069494]/20 hover:shadow-[#069494]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#069494] flex items-center justify-center gap-2"
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
            "Verify Code"
          )}
        </button>
      </form>

      {/* Resend Link */}
      <p className="text-sm text-zinc-500 mt-6">
        Didn&apos;t receive the code?{" "}
        <Link href="/forgot-password" className="text-[#069494] hover:text-[#0EC7C7] font-medium transition-colors">
          Send again
        </Link>
      </p>
    </div>
  );
}
