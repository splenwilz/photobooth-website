import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/downloads", label: "Downloads" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/support", label: "Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

const socials = [
  {
    href: "#",
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    href: "#",
    label: "X (Twitter)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    href: "#",
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] overflow-hidden">
      {/* Top accent gradient line — subtle teal divider between page and footer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#069494]/40 to-transparent" />

      {/* Subtle grid pattern background (uses the existing .grid-pattern class
          from globals.css that the hero also uses) */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Subtle teal glow at the top to create depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#069494]/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Top section: Brand block + 3 link columns */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          {/* Brand block — 5 cols on lg, full width on mobile */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#069494] to-[#176161] flex items-center justify-center overflow-hidden shadow-lg shadow-[#069494]/30">
                <Image
                  src="/logo.png"
                  alt=""
                  aria-hidden="true"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-2xl text-white">Booth</span>
                <span className="font-bold text-2xl text-[#0EC7C7]">IQ</span>
              </div>
            </Link>
            <p className="text-base text-zinc-400 leading-relaxed max-w-sm mb-8">
              The cloud dashboard for photo booth operators. Manage every booth
              from any device.
            </p>
            {/* Social icons row */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#069494]/20 hover:border-[#069494]/50 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — 7 cols on lg, 3-column grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 mb-5">
                  {group.title}
                </h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-base text-zinc-400 hover:text-[#0EC7C7] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row: status indicator + copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status indicator — pulsing green dot, "all systems operational" feel */}
          <div className="flex items-center gap-2.5 text-sm text-zinc-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span>All systems operational</span>
          </div>
          {/* Copyright */}
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} BoothIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
