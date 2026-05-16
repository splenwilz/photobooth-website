import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About BoothIQ",
  description:
    "What BoothIQ is, how it works, and how to reach the team. Official domains, contact addresses, and support channels for photo booth operators.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About BoothIQ
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            About BoothIQ
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
            BoothIQ is the operator portal for photo booth businesses. It is
            the software you sign in to from a browser, a phone, or the booth
            itself. This page describes what it does, how it fits with
            BoothWorks hardware, and the official places to find it.
          </p>
        </div>
      </section>

      {/* What BoothIQ is */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">What BoothIQ is</h2>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-4">
            BoothIQ ships as one product in three forms. Each form sees the
            same accounts, the same booths, and the same subscription. You
            pick whichever is closest to hand.
          </p>
          <ul className="space-y-3 text-[var(--muted)] leading-relaxed list-disc pl-6 marker:text-[#069494]">
            <li>
              <strong className="text-[var(--foreground)]">Cloud dashboard.</strong>{" "}
              A web app at <code className="px-1.5 py-0.5 rounded bg-[#069494]/10 text-[#069494] text-sm">boothiq.com/dashboard</code>.
              Revenue, transactions, product mix, supply levels, remote
              configuration, and subscription management.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Mobile apps.</strong>{" "}
              Native iOS and Android clients. The same data and controls as
              the web, in a layout sized for the phone in your pocket.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Booth software.</strong>{" "}
              The desktop application that runs on each BoothWorks booth.
              Takes payments, prints photos, tracks supply, and stores every
              transaction locally. The booth keeps running when the internet
              drops; cloud sync resumes automatically when it returns.
            </li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-slate-50 dark:bg-[#0a0a0a]/50 border-y border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-4">
            Each booth is the source of truth for what happens at the booth.
            Transactions, revenue totals, and configuration changes are
            recorded locally first. When the booth has internet, it syncs to
            your BoothIQ account.
          </p>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-4">
            The cloud dashboard and mobile apps both read from that synced
            account, so the data you see on your phone matches the data on
            the booth&apos;s touchscreen. Configuration written on the web
            (for example, changing a product price) flows back to the booth
            on the next sync.
          </p>
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            This is an offline-first design. If the venue&apos;s Wi-Fi fails,
            the booth keeps taking money and printing photos. If our cloud
            has an outage, the booth keeps taking money and printing photos.
            Cloud sync is the bonus, not the requirement.
          </p>
        </div>
      </section>

      {/* BoothIQ vs BoothWorks */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">BoothIQ vs BoothWorks</h2>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-8 max-w-3xl">
            BoothIQ and BoothWorks are two products from one company. They
            are sold separately and priced separately. They are designed to
            work as one system.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#069494]/10 to-[#176161]/10 border border-[#069494]/20">
              <div className="w-10 h-10 rounded-xl bg-[#069494]/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#069494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">BoothIQ</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-3">
                The operator portal. Cloud dashboard, iOS and Android apps,
                and the desktop application that runs on the booth.
              </p>
              <ul className="space-y-1 text-sm text-[var(--muted)] list-disc pl-5 marker:text-[#069494]">
                <li>Software only</li>
                <li>Per-booth subscription</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">BoothWorks</h3>
              <p className="text-[var(--muted)] leading-relaxed mb-3">
                The physical booth. Touchscreen, camera, printer, coin
                acceptor, and the enclosure itself.
              </p>
              <ul className="space-y-1 text-sm text-[var(--muted)] list-disc pl-5 marker:text-[#F59E0B]">
                <li>Hardware only</li>
                <li>One-time purchase</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-[var(--muted)] mt-6">
            New BoothWorks units ship with BoothIQ pre-installed and ready
            to pair to your account.
          </p>
        </div>
      </section>

      {/* Official BoothIQ Resources */}
      <section className="px-6 py-16 bg-slate-50 dark:bg-[#0a0a0a]/50 border-y border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Official BoothIQ resources</h2>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-8">
            These are the only official places to find BoothIQ. If you are
            asked to install software, send payment, or share account
            credentials from anywhere else, treat it as untrusted and
            contact us.
          </p>

          <h3 className="text-lg font-semibold mb-3">Official domain</h3>
          <ul className="space-y-1 text-[var(--muted)] mb-6 list-disc pl-6 marker:text-[#069494]">
            <li>
              <code className="px-1.5 py-0.5 rounded bg-[#069494]/10 text-[#069494] text-sm">boothiq.com</code>{" "}
              and any subdomain of it. We do not operate on look-alike
              domains.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-3">Official product surfaces</h3>
          <ul className="space-y-1 text-[var(--muted)] mb-6 list-disc pl-6 marker:text-[#069494]">
            <li>
              <Link href="/dashboard" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">Dashboard</Link>{" "}
              at <code className="px-1.5 py-0.5 rounded bg-[#069494]/10 text-[#069494] text-sm">boothiq.com/dashboard</code>
            </li>
            <li>
              <Link href="/docs" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">Documentation</Link>{" "}
              at <code className="px-1.5 py-0.5 rounded bg-[#069494]/10 text-[#069494] text-sm">boothiq.com/docs</code>
            </li>
            <li>
              <Link href="/docs/changelog" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">Changelog</Link>{" "}
              at <code className="px-1.5 py-0.5 rounded bg-[#069494]/10 text-[#069494] text-sm">boothiq.com/docs/changelog</code>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-3">Official contact addresses</h3>
          <ul className="space-y-1 text-[var(--muted)] mb-6 list-disc pl-6 marker:text-[#069494]">
            <li>
              Sales:{" "}
              <a href="mailto:sales@boothiq.com" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">sales@boothiq.com</a>
            </li>
            <li>
              Support:{" "}
              <a href="mailto:support@boothiq.com" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">support@boothiq.com</a>
            </li>
            <li>
              Partnerships:{" "}
              <a href="mailto:partners@boothiq.com" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">partners@boothiq.com</a>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-1 text-[var(--muted)] list-disc pl-6 marker:text-[#069494]">
            <li>
              <Link href="/privacy" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Reporting issues */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Reporting issues</h2>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-3">
            For product bugs, account problems, or general support, start at{" "}
            <Link href="/support" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">/support</Link>{" "}
            or email{" "}
            <a href="mailto:support@boothiq.com" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">support@boothiq.com</a>.
          </p>
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            For sales questions or to request a walkthrough, use the{" "}
            <Link href="/contact?inquiry=demo" className="text-[#069494] hover:text-[#0EC7C7] transition-colors">contact form</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
