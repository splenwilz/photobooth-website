import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Templates tab — BoothIQ Docs",
  description:
    "A tour of the Templates tab: browse, enable, disable, search, and tag templates.",
};

const HREF = "/docs/admin-dashboard/templates-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout", label: "Layout" },
  { id: "template-cards", label: "Template cards" },
  { id: "enable-disable", label: "Enabling and disabling a template" },
  { id: "search-filter", label: "Searching and filtering" },
  { id: "premium", label: "Premium templates" },
  { id: "orphaned", label: "Orphaned templates" },
  { id: "cloud-sync", label: "Cloud sync" },
  { id: "categories-vs-templates", label: "Categories vs templates" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function TemplatesTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Templates tab</h1>

      <p>
        The <strong>Templates</strong> tab shows every template
        available on the booth, both the ones that ship with BoothIQ
        and the ones that have been pulled down from your cloud
        library. This is where you control which templates customers
        see in the template selection carousel during a session.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators curating their
        template offering: enabling new templates, hiding stale ones,
        marking premium ones.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>Browse all installed templates as a paginated grid</li>
        <li>Search and filter templates by name or category</li>
        <li>Enable or disable individual templates so they appear (or don&apos;t) in the customer-facing carousel</li>
        <li>Mark templates as <strong>premium</strong> (a visual badge customers see)</li>
        <li>Manage <strong>orphaned</strong> templates that don&apos;t have a category assigned</li>
        <li>Watch the tab auto-refresh after a cloud template sync</li>
      </ul>

      <h2 id="layout">Layout</h2>

      <p>The Templates tab is grid-heavy. You&apos;ll see:</p>

      <ol>
        <li>Page header with the title &quot;Templates&quot; and a subtitle</li>
        <li>Search and filter row (search box, category filter, page size, possibly sort)</li>
        <li>Paginated grid of template cards</li>
        <li>Pagination controls at the bottom</li>
      </ol>

      <DocsScreenshot
        src="templates-tab-grid.png"
        alt="Templates tab grid view with paginated template cards."
      />

      <h2 id="template-cards">Template cards</h2>

      <p>Each template appears as a card showing:</p>

      <ul>
        <li>A <strong>preview image</strong>. The design as customers see it</li>
        <li>The <strong>template name</strong></li>
        <li>The <strong>category</strong> it belongs to (e.g. &quot;Birthday&quot;, &quot;Holiday&quot;, &quot;Classic&quot;)</li>
        <li>An <strong>enable / disable toggle</strong></li>
        <li>An optional <strong>premium badge</strong> if it&apos;s marked premium</li>
        <li>Possibly a <strong>photo count</strong> indicator (e.g. &quot;4 photos&quot;)</li>
      </ul>

      <p>
        Tap a card to open its detail view (where you can edit
        metadata) or use the inline toggle to enable/disable without
        opening it.
      </p>

      <h2 id="enable-disable">Enabling and disabling a template</h2>

      <p>To remove a template from what customers see:</p>

      <ol>
        <li>Find the template&apos;s card.</li>
        <li>Tap its enable toggle to <strong>off</strong>.</li>
        <li>The change is committed and the template is hidden from the customer template selection carousel for new sessions.</li>
      </ol>

      <p>To bring it back, toggle it on again.</p>

      <DocsCallout type="note">
        Disabled templates are not deleted. They&apos;re hidden from
        customers but still visible in admin. This means you can hide
        a seasonal template after the season ends and bring it back
        next year without re-uploading anything.
      </DocsCallout>

      <h2 id="search-filter">Searching and filtering</h2>

      <p>If you have many templates, use the search and filter row to narrow the list:</p>

      <ul>
        <li><strong>Search box</strong>. Type any part of a template name to filter the grid</li>
        <li><strong>Category filter</strong>. Show only templates in a specific category</li>
        <li><strong>Page size</strong>. Change how many cards appear per page (typically 10, 20, or 50)</li>
      </ul>

      <p>
        The filters all combine. Searching for &quot;summer&quot;
        with the category filter set to &quot;Holiday&quot; only shows
        holiday-category templates with &quot;summer&quot; in their
        name.
      </p>

      <h2 id="premium">Premium templates</h2>

      <p>
        Marking a template as <strong>premium</strong> adds a small
        visual badge to the template&apos;s card on the
        customer-facing carousel. The badge tells customers this
        template is a higher-end offering. By default premium does{" "}
        <strong>not</strong> automatically charge a different price.
        Pricing is controlled in the{" "}
        <Link href="/docs/admin-dashboard/products-tab">Products tab</Link>{" "}
        at the product level. The premium badge is purely a visual
        hint.
      </p>

      <DocsCallout type="note">
        If you want to actually charge more for premium templates,
        you&apos;ll need to use a separate &quot;premium&quot; product
        (e.g. a higher-priced strips product) and limit which
        templates use which product. Confirm this is set up correctly
        with your BoothIQ point of contact.
      </DocsCallout>

      <h2 id="orphaned">Orphaned templates</h2>

      <p>
        A template is <strong>orphaned</strong> when it has no
        category assigned, or when its assigned category has been
        deleted. Orphans can still be selected by customers (if
        enabled), but they show up in a separate
        &quot;uncategorized&quot; group.
      </p>

      <p>
        The Templates tab usually highlights orphans so you can fix
        them. Either by assigning a category or by disabling them.
      </p>

      <h2 id="cloud-sync">Cloud sync</h2>

      <p>
        When you have cloud sync enabled and your cloud library
        pushes new templates down, the Templates tab refreshes
        automatically. You don&apos;t have to do anything. The new
        templates just appear in the grid the next time you open the
        tab.
      </p>

      <p>
        If you want to force a sync, use the <strong>Cloud Sync</strong>{" "}
        tab&apos;s manual sync mechanism (see{" "}
        <Link href="/docs/admin-dashboard/cloud-sync-tab">
          Cloud Sync tab
        </Link>
        ).
      </p>

      <h2 id="categories-vs-templates">Categories vs templates</h2>

      <p>
        The Templates tab manages <strong>individual templates</strong>.
        {" "}<strong>Categories</strong> (the groupings customers see
        at the top of the template selection screen) are managed
        separately.
      </p>

      <ul>
        <li>Categories are typically managed in a <strong>Category Management</strong> modal accessible from the Templates tab</li>
        <li>Each category has a name, sort order, optional seasonal date range, and active/inactive flag</li>
        <li>A template belongs to one category (or is orphaned)</li>
      </ul>

      <p>
        For more on category management, see{" "}
        <strong>Running Your Booth › Managing templates and categories</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="verify">Verify it worked</h2>

      <p>You can use the Templates tab effectively when you can:</p>

      <ul>
        <li>Find any template by searching</li>
        <li>Toggle a template on and off and see the change in the customer carousel</li>
        <li>Spot orphaned templates and fix them</li>
        <li>Mark a template as premium</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>New template I uploaded to the cloud isn&apos;t here.</strong></p>
      <p>Cloud sync hasn&apos;t run yet, or the template is disabled by default. Open Cloud Sync, force a sync, then come back.</p>

      <p><strong>Template I disabled is still showing to customers.</strong></p>
      <p>Cache hasn&apos;t refreshed. Exit admin and re-enter; the customer carousel should update.</p>

      <p><strong>Template card has no preview image.</strong></p>
      <p>The preview file is missing or corrupted. Try a fresh sync. If it persists, contact support.</p>

      <p><strong>Many orphaned templates after a category was deleted.</strong></p>
      <p>Expected. Orphans are templates that lost their parent. Re-assign them to a category or disable them.</p>

      <p><strong>Template count in the header doesn&apos;t match what I see.</strong></p>
      <p>A filter or search is active. Clear all filters and search box.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/layouts-tab">Layouts tab</Link>
          . Edit the photo-area positioning that templates use.
        </li>
        <li><strong>Running Your Booth › Managing templates and categories</strong> <em>(coming soon)</em>. A task-oriented walkthrough.</li>
      </ul>
    </DocsLayout>
  );
}
