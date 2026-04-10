/**
 * DocsLayout
 *
 * Three-column shell shared by every docs interior page:
 *   - Left:  DocsSidebar (sticky section/article nav)
 *   - Center: main article content (passed as `children`)
 *   - Right: DocsTOC (sticky "On this page" — only shown if `toc` provided)
 *
 * Bottom of the article: DocsPrevNext, computed by the page from
 * the current href.
 *
 * Top padding clears the sticky navbar (~96-100px) on every breakpoint.
 *
 * Server component. The sidebar is a client component because it
 * needs `usePathname` for active highlighting.
 */

import type { SidebarItem } from "@/app/(main)/docs/_data/sidebar";
import { DocsCallout } from "./DocsCallout";
import { DocsPrevNext } from "./DocsPrevNext";
import { DocsScreenshot } from "./DocsScreenshot";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTOC, type TOCItem } from "./DocsTOC";

interface DocsLayoutProps {
  /** Article body — typically a heading + sections wrapped in <article className="prose"> */
  children: React.ReactNode;
  /** Optional "On this page" entries for the right rail. Pass [] to hide. */
  toc?: TOCItem[];
  /** Bottom-of-article navigation */
  prev?: SidebarItem | null;
  next?: SidebarItem | null;
}

export function DocsLayout({
  children,
  toc = [],
  prev = null,
  next = null,
}: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-6 pt-24 sm:pt-28 pb-16">
        <div className="flex gap-12">
          {/* Left sidebar — sticky nav */}
          <DocsSidebar />

          {/* Main content + bottom prev/next */}
          <main className="flex-1 min-w-0 max-w-3xl">
            <article className="prose max-w-none">{children}</article>
            <DocsPrevNext prev={prev} next={next} />
          </main>

          {/* Right sidebar — On this page TOC */}
          <DocsTOC items={toc} />
        </div>
      </div>
    </div>
  );
}

// Re-export so docs pages can import everything from this single
// path: `import { DocsLayout, DocsCallout, DocsScreenshot } from
// "@/components/docs/DocsLayout"`.
export { DocsCallout, DocsScreenshot };
