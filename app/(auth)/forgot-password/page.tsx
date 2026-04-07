import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your BoothIQ account password.",
};

export default function ForgotPasswordPage() {
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
              Forgot your password?<br />
              <span className="text-[#069494]">No worries.</span>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 max-w-md">
              Enter your email and we&apos;ll send you a verification code to reset your password.
            </p>

            {/* Info Items */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#069494]/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Check Your Inbox</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-500">We&apos;ll send a 6-digit code to your email</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#069494]/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Code Expires</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-500">The code is valid for 15 minutes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacer */}
          <div />
        </div>
      </div>

      {/* Right Panel - Form */}
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
            <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Reset your password</h1>
            <p className="text-zinc-500">
              Enter your email to receive a reset code
            </p>
          </div>

          {/* Form */}
          <ForgotPasswordForm />

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
