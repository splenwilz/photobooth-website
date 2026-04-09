/**
 * DocsPrevNext
 *
 * Bottom-of-article navigation: shows the previous and next pages
 * in the docs sidebar order. Either side can be null (start/end of
 * the docs).
 *
 * Server component — receives prev/next as plain props from the
 * page, which calls `getPrevNext()` from the sidebar data file.
 */

import Link from "next/link";
import type { SidebarItem } from "@/app/(main)/docs/_data/sidebar";

interface DocsPrevNextProps {
  prev: SidebarItem | null;
  next: SidebarItem | null;
}

export function DocsPrevNext({ prev, next }: DocsPrevNextProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 pt-8 border-t border-[var(--border)] grid grid-cols-2 gap-4">
      {/* Previous */}
      <div>
        {prev && (
          <Link
            href={prev.href}
            className="group flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-[#069494]/40 hover:bg-[#069494]/5 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[#069494] dark:group-hover:text-[#0EC7C7] transition-colors">
              {prev.title}
            </span>
          </Link>
        )}
      </div>

      {/* Next */}
      <div>
        {next && (
          <Link
            href={next.href}
            className="group flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-[#069494]/40 hover:bg-[#069494]/5 transition-colors text-right"
          >
            <span className="flex items-center justify-end gap-1.5 text-xs text-[var(--muted)]">
              Next
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[#069494] dark:group-hover:text-[#0EC7C7] transition-colors">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
