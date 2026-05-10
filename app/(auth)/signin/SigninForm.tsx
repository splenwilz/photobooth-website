"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signinAction, type SigninActionResult } from "@/core/api/auth/signin/actions";
import { safeRedirectPath } from "@/lib/auth-redirect";
import { signinPerfLog } from "@/lib/signin-perf";

export function SigninForm({
  resetSuccess,
  redirectTo,
  initialError,
}: {
  resetSuccess?: boolean;
  redirectTo?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<SigninActionResult | null, FormData>(
    signinAction,
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Diagnostic timing for the post-backend gap.
  // submitStartRef captures performance.now() the moment isPending flips true,
  // so we can measure how long it takes for the action result to round-trip
  // back to the client and for the redirect to fire.
  const submitStartRef = useRef<number | null>(null);
  const wasPendingRef = useRef<boolean>(false);
  // Latches once the success effect has fired router.push so re-renders
  // (e.g. redirectTo prop change) cannot trigger a second navigation.
  const redirectFiredRef = useRef<boolean>(false);

  useEffect(() => {
    if (!wasPendingRef.current && isPending) {
      submitStartRef.current = performance.now();
      // New submission attempt: clear the redirect latch so a future
      // success can navigate again (e.g. user clicked twice with a
      // different redirectTo, or the first attempt errored).
      redirectFiredRef.current = false;
      signinPerfLog({ phase: 'client_isPending_true' });
    } else if (wasPendingRef.current && !isPending) {
      const start = submitStartRef.current ?? performance.now();
      signinPerfLog({
        phase: 'client_isPending_false',
        elapsed_since_submit_ms: Math.round(performance.now() - start),
      });
    }
    wasPendingRef.current = isPending;
  }, [isPending]);

  // Handle successful signin
  useEffect(() => {
    if (state?.success && !redirectFiredRef.current) {
      redirectFiredRef.current = true;
      const start = submitStartRef.current ?? performance.now();
      signinPerfLog({
        phase: 'client_state_success_received',
        elapsed_since_submit_ms: Math.round(performance.now() - start),
      });
      const data = state.data;

      // Check if email verification is required
      if ('requires_verification' in data && data.requires_verification) {
        // Redirect to verify email page with token
        const params = new URLSearchParams({
          email: data.email,
          token: data.pending_authentication_token,
        });
        signinPerfLog({
          phase: 'client_router_push_verify',
          elapsed_since_submit_ms: Math.round(performance.now() - start),
        });
        router.push(`/verify-email?${params.toString()}`);
      } else {
        // No verification needed, honor the redirect param if it's a same-origin path
        const target = safeRedirectPath(redirectTo);
        signinPerfLog({
          phase: 'client_router_push_target',
          target,
          elapsed_since_submit_ms: Math.round(performance.now() - start),
        });
        router.push(target);
      }
    } else if (state && !state.success) {
      const start = submitStartRef.current ?? performance.now();
      // Intentionally not logging state.error here. The error message is
      // already shown to the user in the alert UI, and we don't want
      // backend-supplied strings (which could echo input) in the
      // browser console.
      signinPerfLog({
        phase: 'client_state_error_received',
        elapsed_since_submit_ms: Math.round(performance.now() - start),
      });
    }
  }, [state, router, redirectTo]);

  return (
    <form action={formAction} className="space-y-5">
      {/* Password Reset Success — hide after first form submission */}
      {resetSuccess && !state && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
          Your password has been reset successfully. Sign in with your new password.
        </div>
      )}

      {/* Error Message — from a server-action submit (state) or from a URL
          parameter set by an upstream OAuth redirect (initialError). The
          submit-state error wins when both are present so we don't shadow
          the user's most recent action. */}
      {state && !state.success ? (
        <div role="alert" className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {state.error}
          {state.rateLimited && (
            <p className="mt-1 text-xs opacity-75">
              Too many failed attempts. Please wait before trying again.
            </p>
          )}
        </div>
      ) : initialError ? (
        <div role="alert" className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {initialError}
        </div>
      ) : null}

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
          className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <Link href="/forgot-password" className="text-sm text-[#069494] hover:text-[#0EC7C7] transition-colors">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="••••••••••"
            required
            minLength={8}
            disabled={isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#069494] focus:ring-1 focus:ring-[#069494] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          disabled={isPending}
          className="w-4 h-4 rounded bg-white dark:bg-[#111111] border-slate-200 dark:border-zinc-800 text-[#069494] focus:ring-[#069494] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label htmlFor="remember" className="text-sm text-zinc-500">
          Remember me for 30 days
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 rounded-xl bg-[#069494] text-white font-semibold hover:bg-[#176161] transition-all shadow-lg shadow-[#069494]/20 hover:shadow-[#069494]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#069494] flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
