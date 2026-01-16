import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your PhotoBoothX account and start managing your photo booths.",
};

export default function SignUpPage() {
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
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 max-w-md">
              Real-time analytics, instant alerts, and complete control over your photo booth business.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-[#10B981]">5,000+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-500">Active booths</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0891B2]">$2.4M</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-500">Processed monthly</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#A855F7]">99.9%</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-500">Uptime</div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#111111]/80 border border-slate-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              &quot;PhotoBoothX transformed our business. Revenue tracking in real-time and instant alerts when paper runs low — game changer.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-white">
                MJ
              </div>
              <div>
                <div className="font-medium text-zinc-900 dark:text-white">Michael Johnson</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-500">SnapShot Events, 12 booths</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              PhotoBoothX
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Create your account</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
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
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
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
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
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
                className="w-full px-4 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
              />
              <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-2">
                Must be at least 8 characters with a number and symbol
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded bg-[var(--card)] border-[var(--border)] text-[#10B981] focus:ring-[#10B981] focus:ring-offset-0"
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
              className="w-full py-4 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/30"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[var(--background)] text-[var(--muted)] uppercase tracking-wider">or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="group flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] font-medium hover:bg-slate-100 dark:hover:bg-zinc-900 hover:border-[var(--border)] transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="group flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] font-medium hover:bg-slate-100 dark:hover:bg-zinc-900 hover:border-[var(--border)] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-[var(--muted)] mt-8">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#10B981] hover:text-[#22D3EE] font-medium transition-colors">
              Sign in
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
