import type { Metadata } from "next";
import Link from "next/link";
import { SigninForm } from "./SigninForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your PhotoBoothX account to manage your booths and subscriptions.",
};

interface SignInPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect } = await searchParams;
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/20 via-slate-100 to-[#10B981]/10 dark:via-[#111111]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#0891B2]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#10B981]/20 blur-[100px] rounded-full" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
              <svg aria-label="Logo" aria-hidden="true" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            PhotoBoothX
          </Link>

          {/* Main Content */}
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight text-zinc-900 dark:text-white">
              Manage your booths<br />
              <span className="text-[#0891B2]">from anywhere.</span>
            </h2>
            <p className="text-[var(--muted)] text-lg mb-8 max-w-md">
              Real-time analytics, instant alerts, and complete control over your photo booth business.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-[#10B981]">5,000+</div>
                <div className="text-sm text-[var(--muted)]">Active booths</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0891B2]">$2.4M</div>
                <div className="text-sm text-[var(--muted)]">Processed monthly</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#A855F7]">99.9%</div>
                <div className="text-sm text-[var(--muted)]">Uptime</div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-[var(--card)]/80 border border-slate-200/50 dark:border-[var(--border)]/50 backdrop-blur-sm">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((starId) => (
                <svg aria-label="Star" aria-hidden="true" key={starId} className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[var(--foreground-secondary)] mb-4">
              &quot;PhotoBoothX transformed our business. Revenue tracking in real-time and instant alerts when paper runs low — game changer.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold">
                MJ
              </div>
              <div>
                <div className="font-medium">Michael Johnson</div>
                <div className="text-sm text-[var(--muted)]">SnapShot Events, 12 booths</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
                <svg aria-label="Logo" aria-hidden="true" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              PhotoBoothX
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
          <SigninForm />

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[var(--muted)] mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0891B2] hover:text-[#22D3EE] font-medium transition-colors">
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
              © 2024 PhotoBoothX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

