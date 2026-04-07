import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your BoothIQ account.",
};

function ResetPasswordFormWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <svg className="w-8 h-8 animate-spin text-[#069494]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#069494]/20 via-slate-100 to-[#176161]/10 dark:via-[#111111]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#069494]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#069494]/20 blur-[100px] rounded-full" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl w-fit text-zinc-900 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#069494] to-[#176161] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            BoothIQ
          </Link>

          {/* Main Content */}
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight text-zinc-900 dark:text-white">
              Almost done!<br />
              <span className="text-[#069494]">Set your new password.</span>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 max-w-md">
              Choose a strong password for your account. Make sure it meets the requirements below.
            </p>

            {/* Password Requirements */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#069494]/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">At Least 8 Characters</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-500">Longer passwords are more secure</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#069494]/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Mixed Characters</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-500">Include uppercase, lowercase, and a number</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacer */}
          <div />
        </div>
      </div>

      {/* Right Panel - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl text-zinc-900 dark:text-white">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#069494] to-[#176161] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              BoothIQ
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Create new password</h1>
            <p className="text-zinc-500">
              Enter and confirm your new password
            </p>
          </div>

          {/* Form */}
          <ResetPasswordFormWrapper />

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-center gap-6 text-xs text-zinc-500">
              <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Privacy</Link>
              <Link href="/support" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Support</Link>
            </div>
            <p className="text-center text-xs text-zinc-500 mt-4">
              © 2024 BoothIQ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
