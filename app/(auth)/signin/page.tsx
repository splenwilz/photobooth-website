import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SigninForm } from "./SigninForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your BoothIQ account to manage your booths and subscriptions.",
};

interface SignInPageProps {
  searchParams: Promise<{
    redirect?: string;
    reset?: string;
    error?: string;
    message?: string;
  }>;
}

/**
 * Map known error codes from our own redirect sources to fixed copy. We
 * intentionally do NOT render the user-controlled `message` query param —
 * a crafted /signin?error=…&message=Click+here+to+restore+your+account
 * URL would otherwise let an attacker phish via copy on our own domain.
 * React already escapes HTML; this guards the attack surface in plain
 * text.
 */
function mapSigninError(code: string | undefined): string | undefined {
  switch (code) {
    case "oauth_failed":
      return "Sign in with your provider failed. Please try again.";
    case "missing_code":
      return "Sign in didn't complete. Please try again.";
    case undefined:
      return undefined;
    default:
      // Unknown code — fall back to a generic message so an attacker
      // can't push tailored copy via ?error=anything.
      return "We couldn't complete sign in. Please try again.";
  }
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect, reset, error } = await searchParams;
  const initialError = mapSigninError(error);
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#069494]/20 via-slate-100 to-[#176161]/10 dark:via-[#111111]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#069494]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#069494]/20 blur-[100px] rounded-full" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#069494] to-[#176161] flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt=""
                aria-hidden="true"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            BoothIQ
          </Link>

          {/* Main Content — honest headline + tagline + a checkmark
              feature list. The original had fake numbers (5,000+ booths,
              $2.4M monthly, 99.9% SLA) and a fabricated Michael Johnson
              testimonial. Both were deleted. */}
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight text-zinc-900 dark:text-white">
              Manage your booths<br />
              <span className="text-[#069494]">from anywhere.</span>
            </h2>
            <p className="text-[var(--muted)] text-lg mb-10 max-w-md">
              Live revenue, remote configuration, and full booth visibility —
              on every device you sign in from.
            </p>

            {/* Feature checklist — every item is verifiable from the rest
                of the site (matches the features-page tabbed showcase). */}
            <ul className="space-y-4 max-w-md">
              {[
                "Live revenue tracking from any device",
                "iOS, Android, and web — all in sync",
                "Per-booth pricing — pay only for what you run",
                "Offline-first — the booth keeps running without internet",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300">
                  <svg
                    className="w-5 h-5 text-[#069494] shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom spacer — keeps the justify-between layout balanced
              after the fake testimonial card was removed. */}
          <div />
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#069494] to-[#176161] flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt=""
                  aria-hidden="true"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              BoothIQ
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Welcome back</h1>
            <p className="text-[var(--muted)]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Social Buttons */}
          <div className="mb-8">
            <OAuthButtons redirectTo={redirect} />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-slate-50 dark:bg-[#0a0a0a] text-zinc-500 uppercase tracking-wider">or sign in with email</span>
            </div>
          </div>

          {/* Form */}
          <SigninForm
            resetSuccess={reset === 'success'}
            redirectTo={redirect}
            initialError={initialError}
          />

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[var(--muted)] mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#069494] hover:text-[#0EC7C7] font-medium transition-colors">
              Create an account
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <div className="flex items-center justify-center gap-6 text-xs text-[var(--muted)]">
              <Link href="/terms" className="hover:text-[var(--foreground-secondary)] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[var(--foreground-secondary)] transition-colors">Privacy</Link>
              <Link href="/support" className="hover:text-[var(--foreground-secondary)] transition-colors">Support</Link>
            </div>
            <p className="text-center text-xs text-[var(--muted)] mt-4">
              © {new Date().getFullYear()} BoothIQ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

