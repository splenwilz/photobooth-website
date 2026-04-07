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

export function Footer() {
  return (
    <footer className="border-t border-[#069494]/10 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#069494] to-[#176161] flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="BoothIQ"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              BoothIQ
            </Link>
            <p className="text-sm text-zinc-500">
              Professional photo booth software.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-medium text-zinc-400 mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-[#0EC7C7] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-[#069494]/10 text-center">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} BoothIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
