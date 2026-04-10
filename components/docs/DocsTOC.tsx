"use client";

/**
 * DocsTOC — "On this page" sidebar
 *
 * Sticky right-side table of contents listing the H2 headings (and
 * optionally H3 subheadings) of the current article. Each entry
 * scrolls to its anchor on click.
 *
 * Receives the heading list as a prop from the page (which knows its
 * own structure). The page is responsible for keeping the list in
 * sync with what it actually renders.
 *
 * Why client component: smooth-scroll behavior + active heading
 * highlighting (the latter is a Phase 2 enhancement).
 */

export interface TOCItem {
  /** Display text */
  label: string;
  /** Anchor ID — must match the `id` attribute on the corresponding heading */
  id: string;
  /** Indentation level (1 = h2, 2 = h3) */
  level?: 1 | 2;
}

interface DocsTOCProps {
  items: TOCItem[];
}

export function DocsTOC({ items }: DocsTOCProps) {
  if (items.length === 0) return null;

  return (
    <aside className="hidden xl:block w-60 shrink-0">
      <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pl-4 pb-12">
        <div className="text-[13px] font-bold uppercase tracking-[0.06em] text-[var(--foreground)] mb-4">
          On this page
        </div>
        <ul className="space-y-2.5 border-l border-[var(--border)] pl-4 -ml-px">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block text-[15px] text-[var(--muted)] hover:text-[#069494] dark:hover:text-[#0EC7C7] transition-colors leading-snug ${
                  item.level === 2 ? "pl-3" : ""
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
