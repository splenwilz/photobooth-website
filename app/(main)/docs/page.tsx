import type { Metadata } from "next";
import Link from "next/link";
import DocsSearch from "@/components/docs/DocsSearch";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Operator and installer documentation for the BoothIQ photo booth kiosk platform — setup guides, customer experience, admin dashboard, troubleshooting, and reference.",
};

/**
 * Docs landing page (/docs)
 *
 * Card-based directory of every section. Sections that have published
 * articles are clickable; sections still being written show a "Coming
 * soon" badge and are not clickable. As more sections are added in
 * Phase 2, set their `available` flag to `true` and they become live.
 */

interface DocSection {
  number: string;
  title: string;
  description: string;
  href: string;
  available: boolean;
  iconPath: string;
}

const sections: DocSection[] = [
  {
    number: "01",
    title: "Getting Started",
    description:
      "What BoothIQ is, what's in the box, and how to get your first photo printed.",
    href: "/docs/getting-started",
    available: true,
    iconPath:
      "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  },
  {
    number: "02",
    title: "Connecting Your Kiosk",
    description: "Wi-Fi setup, cloud registration, and license activation.",
    href: "/docs/connecting-your-kiosk",
    available: true,
    iconPath:
      "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z",
  },
  {
    number: "03",
    title: "Customer Experience",
    description: "Every screen your customers will see, in order.",
    href: "/docs/customer-experience",
    available: true,
    iconPath:
      "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  },
  {
    number: "04",
    title: "Admin Dashboard",
    description: "A complete tour of all nine admin tabs.",
    href: "/docs/admin-dashboard",
    available: true,
    iconPath:
      "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605",
  },
  {
    number: "05",
    title: "Running Your Booth",
    description:
      "Day-to-day operations: pricing, templates, sales, daily checks.",
    href: "/docs/running-your-booth",
    available: true,
    iconPath:
      "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941",
  },
  {
    number: "06",
    title: "Cloud and Fleet",
    description: "How sync works, working offline, remote commands.",
    href: "/docs/cloud-and-fleet",
    available: true,
    iconPath:
      "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z",
  },
  {
    number: "07",
    title: "Maintenance",
    description: "Print rolls, cleaning, daily checks, software updates.",
    href: "/docs/maintenance",
    available: true,
    iconPath:
      "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
  },
  {
    number: "08",
    title: "Troubleshooting",
    description: "When something goes wrong on the floor.",
    href: "/docs/troubleshooting",
    available: true,
    iconPath:
      "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.732 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z",
  },
  {
    number: "09",
    title: "Security and Compliance",
    description: "Admin accounts, recovery PINs, and customer data.",
    href: "/docs/security-and-compliance",
    available: true,
    iconPath:
      "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
  {
    number: "10",
    title: "Reference",
    description:
      "Quick lookups: file paths, default credentials, supported hardware.",
    href: "/docs/reference",
    available: true,
    iconPath:
      "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  {
    number: "FAQ",
    title: "Frequently Asked Questions",
    description:
      "Common questions from operators and installers, all in one place.",
    href: "/docs/faq",
    available: true,
    iconPath:
      "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const helpLinks = [
  {
    title: "Email support",
    description:
      "Send us a message and we'll get back to you as soon as we can.",
    href: "/contact",
    cta: "Contact us",
    iconPath:
      "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  },
  {
    title: "Help center",
    description:
      "Browse common questions, submit a ticket, or find a quick answer.",
    href: "/support",
    cta: "Visit help center",
    iconPath:
      "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
  },
];

export default function DocsLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-20 px-6">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] dark:text-[#0EC7C7] text-sm font-medium mb-6">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Documentation
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              BoothIQ Documentation
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Operator and installer guides for setting up, running, and
              maintaining a BoothIQ photo booth kiosk.
            </p>
          </div>

          <DocsSearch />
        </div>
      </section>

      {/* Sections grid */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {sections.map((section) => {
              const cardClasses = `group relative flex flex-col p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] transition-colors h-full ${
                section.available
                  ? "hover:border-[#069494]/40"
                  : "opacity-60 cursor-not-allowed"
              }`;

              const inner = (
                <>
                  {/* Section number + icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#069494]/10 border border-[#069494]/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#069494] dark:text-[#0EC7C7]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={section.iconPath}
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-mono text-[var(--muted)]">
                      {section.number}
                    </span>
                  </div>

                  {/* Title + description */}
                  <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">
                    {section.title}
                  </h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed flex-1 mb-4">
                    {section.description}
                  </p>

                  {/* Footer — link arrow or coming soon */}
                  {section.available ? (
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#069494] dark:text-[#0EC7C7] group-hover:gap-2.5 transition-all">
                      Read section
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  ) : (
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] text-xs font-medium text-[var(--muted)] w-fit">
                      Coming soon
                    </span>
                  )}
                </>
              );

              if (section.available) {
                return (
                  <Link
                    key={section.number}
                    href={section.href}
                    className={cardClasses}
                  >
                    {inner}
                  </Link>
                );
              }

              return (
                <div key={section.number} className={cardClasses}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help section */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Still need help?</h2>
            <p className="text-[var(--muted)]">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {helpLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#069494]/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#069494]/10 border border-[#069494]/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-[#069494] dark:text-[#0EC7C7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-1.5">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] mb-4">{item.description}</p>
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#069494] dark:text-[#0EC7C7] group-hover:gap-2.5 transition-all">
                  {item.cta}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
