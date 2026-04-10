"use client";

/**
 * DocsSidebar
 *
 * Sticky left navigation for the docs. Reads the section structure
 * from `_data/sidebar.ts` (single source of truth) and highlights the
 * currently active page using `usePathname`.
 *
 * Client component because it needs `usePathname` for active state.
 * The data import is plain JS, no filesystem reads.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarSections } from "@/app/(main)/docs/_data/sidebar";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4 pb-12">
        {/* Top-level "Documentation home" link */}
        <Link
          href="/docs"
          className={`block py-2 px-3 -ml-3 rounded-lg text-[15px] font-semibold transition-colors mb-6 ${
            pathname === "/docs"
              ? "bg-[#069494]/10 text-[#069494] dark:text-[#0EC7C7]"
              : "text-[var(--foreground)] hover:bg-[var(--card)]"
          }`}
        >
          Documentation
        </Link>

        {sidebarSections.map((section) => {
          const sectionActive = pathname === section.href;
          return (
            <div key={section.href} className="mb-7">
              {/* Section header — clickable to its index page */}
              <Link
                href={section.href}
                className={`block py-1.5 px-3 -ml-3 rounded-md text-[13px] font-bold uppercase tracking-[0.06em] transition-colors ${
                  sectionActive
                    ? "text-[#069494] dark:text-[#0EC7C7]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {section.title}
              </Link>

              {/* Section items, indented with a left rail */}
              <ul className="mt-2 border-l border-[var(--border)] ml-3 space-y-px">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block py-2 pl-4 pr-3 -ml-px text-[15px] transition-colors border-l-2 ${
                          isActive
                            ? "border-[#069494] text-[#069494] dark:text-[#0EC7C7] font-semibold bg-[#069494]/5"
                            : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border)]"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
