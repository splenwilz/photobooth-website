"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { oauthCallbackAction } from "@/core/api/auth/oauth/actions";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Check for OAuth error from provider
      if (errorParam) {
        setError(errorDescription || errorParam || "Authentication was cancelled or failed.");
        setIsProcessing(false);
        return;
      }

      // Check for authorization code
      if (!code) {
        setError("No authorization code received. Please try again.");
        setIsProcessing(false);
        return;
      }

      try {
        console.log("[DEBUG] Processing OAuth callback with code");

        const result = await oauthCallbackAction({
          code,
          state: state || undefined,
        });

        if (result.success) {
          // Redirect to dashboard on success
          router.push("/dashboard");
        } else {
          setError(result.error);
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("[AUTH] OAuth callback error:", err);
        setError("An unexpected error occurred. Please try again.");
        setIsProcessing(false);
      }
    }

    handleCallback();
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#10B981] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Completing sign in...</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Please wait while we verify your account.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Authentication Failed</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signin"
            className="px-6 py-3 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-all"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

export default function OAuthCallbackPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl text-zinc-900 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            PhotoBoothX
          </Link>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-zinc-800">
          <Suspense fallback={
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#10B981] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Loading...</h2>
            </div>
          }>
            <CallbackHandler />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
