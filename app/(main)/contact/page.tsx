import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with PhotoBoothX. Contact our sales team, support, or send us a message.",
};

const contactOptions = [
  {
    icon: "💬",
    title: "Sales",
    description: "Talk to our sales team about hardware packages and enterprise plans.",
    contact: "sales@photoboothx.com",
    availability: "Mon-Fri, 9am-6pm EST",
  },
  {
    icon: "🛠️",
    title: "Support",
    description: "Get help with technical issues, billing, or your subscription.",
    contact: "support@photoboothx.com",
    availability: "24/7 for Pro users",
  },
  {
    icon: "🤝",
    title: "Partnerships",
    description: "Interested in reselling or integrating with PhotoBoothX?",
    contact: "partners@photoboothx.com",
    availability: "Mon-Fri, 9am-6pm EST",
  },
];

const quickLinks = [
  { title: "Documentation", href: "/docs", description: "Browse our guides and tutorials" },
  { title: "Downloads", href: "/downloads", description: "Get the latest version of PhotoBoothX" },
  { title: "Pricing", href: "/pricing", description: "View plans and hardware packages" },
  { title: "Features", href: "/features", description: "Explore all PhotoBoothX features" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0891B2]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#0891B2] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            We&apos;d love to<br />
            <span className="text-[#0891B2]">hear from you</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Have a question about PhotoBoothX? Want to discuss a custom solution?
            Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option) => (
              <div
                key={option.title}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#0891B2]/30 transition-colors"
              >
                <div className="text-3xl mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                <p className="text-sm text-[var(--muted)] mb-4">{option.description}</p>
                <a
                  href={`mailto:${option.contact}`}
                  className="text-[#0891B2] hover:text-[#22D3EE] font-medium text-sm transition-colors"
                >
                  {option.contact}
                </a>
                <p className="text-xs text-[var(--muted)] mt-2">{option.availability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
              <p className="text-[var(--muted)] mb-8">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>

            {/* Info Panel */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0891B2]/10 to-[#10B981]/10 border border-[#0891B2]/20">
                <h3 className="text-lg font-semibold mb-4">Our Office</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#0891B2] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">PhotoBoothX HQ</p>
                      <p className="text-[var(--muted)]">123 Innovation Drive<br />San Francisco, CA 94107</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#0891B2] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-[var(--muted)]">Monday - Friday<br />9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#0891B2] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-[var(--muted)]">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[#0891B2]/30 transition-colors group"
                    >
                      <div>
                        <p className="font-medium group-hover:text-[#0891B2] transition-colors">{link.title}</p>
                        <p className="text-sm text-[var(--muted)]">{link.description}</p>
                      </div>
                      <svg className="w-5 h-5 text-[var(--muted)] group-hover:text-[#0891B2] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a
                    href="https://twitter.com/photoboothx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center hover:border-[#0891B2]/30 hover:text-[#0891B2] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com/photoboothx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center hover:border-[#0891B2]/30 hover:text-[#0891B2] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com/photoboothx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center hover:border-[#0891B2]/30 hover:text-[#0891B2] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/photoboothx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center hover:border-[#0891B2]/30 hover:text-[#0891B2] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-[var(--muted)] mb-8">
            Can&apos;t find what you&apos;re looking for? Check our{" "}
            <Link href="/docs" className="text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              documentation
            </Link>{" "}
            or{" "}
            <Link href="/pricing" className="text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              pricing FAQ
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="px-6 py-3 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
            >
              Browse Documentation
            </Link>
            <Link
              href="/pricing#faq"
              className="px-6 py-3 rounded-xl border border-[var(--border)] font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              View Pricing FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
