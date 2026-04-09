import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Managing templates and categories — BoothIQ Docs",
  description:
    "Curate which templates customers see, organize them into categories, and configure seasonal date ranges.",
};

const HREF = "/docs/running-your-booth/managing-templates-and-categories";

const TOC = [
  { id: "where-from", label: "Where templates come from" },
  { id: "enable-disable", label: "Enabling and disabling individual templates" },
  { id: "premium", label: "Marking templates as premium" },
  { id: "categories", label: "Managing categories" },
  { id: "seasonal", label: "Seasonal categories" },
  { id: "orphaned", label: "Orphaned templates" },
  { id: "cloud-sync", label: "Cloud sync and templates" },
  { id: "event-workflow", label: "A workflow for an event" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ManagingTemplatesPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Managing templates and categories</h1>

      <p>
        The templates you make available are a major part of the
        customer experience. Too few and the booth feels stale, too
        many and customers get overwhelmed. This article walks
        through how to curate them.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators changing the
        template lineup for an event, season, or as part of routine
        maintenance.
      </p>

      <h2 id="where-from">Where templates come from</h2>

      <p>BoothIQ templates can come from two places:</p>

      <ol>
        <li><strong>Templates that ship with the kiosk.</strong> A baseline set installed during initial setup</li>
        <li><strong>Templates pulled down from your cloud library.</strong> Uploaded once to your BoothIQ cloud and synced to all your booths automatically</li>
      </ol>

      <p>
        You manage both kinds the same way from the{" "}
        <Link href="/docs/admin-dashboard/templates-tab">Templates tab</Link>{" "}
        in admin.
      </p>

      <h2 id="enable-disable">Enabling and disabling individual templates</h2>

      <h3>To hide a template from customers</h3>
      <ol>
        <li>Open admin → <strong>Templates</strong> tab.</li>
        <li>Find the template&apos;s card.</li>
        <li>Tap its enable toggle to <strong>off</strong>.</li>
        <li>The template disappears from the customer-facing template selection carousel.</li>
      </ol>

      <h3>To bring a template back</h3>
      <p>Same process, toggle to <strong>on</strong>.</p>

      <DocsCallout type="note">
        Disabling a template does not delete it. The next time you
        re-enable it, it&apos;ll appear with the same settings. This
        means you can rotate templates seasonally without re-uploading
        anything.
      </DocsCallout>

      <h2 id="premium">Marking templates as premium</h2>

      <p>A premium badge appears on the template card in the customer-facing carousel:</p>

      <ol>
        <li>Open the template&apos;s card.</li>
        <li>Toggle the <strong>Premium</strong> flag.</li>
        <li>Save.</li>
      </ol>

      <p>
        The badge is visual only. It doesn&apos;t automatically charge
        a higher price. If you want premium templates to cost more,
        you&apos;ll need to set up a higher-priced product specifically
        for them. Talk to your BoothIQ point of contact.
      </p>

      <h2 id="categories">Managing categories</h2>

      <p>
        Categories are the buttons at the top of the customer template
        selection screen. They group templates so customers can narrow
        their choices.
      </p>

      <p>Default categories you might see:</p>

      <ul>
        <li>Classic</li>
        <li>Birthday</li>
        <li>Wedding</li>
        <li>Holiday</li>
        <li>Corporate</li>
        <li>Custom</li>
      </ul>

      <p>You manage categories from a <strong>Category Management</strong> modal accessible from the Templates tab.</p>

      <h3>Creating a new category</h3>
      <ol>
        <li>Open the Category Management modal.</li>
        <li>Tap <strong>Add Category</strong> (or similar).</li>
        <li>
          Enter:
          <ul>
            <li><strong>Name</strong> (e.g. &quot;Summer 2026&quot;)</li>
            <li><strong>Sort order</strong> (where it appears among the other categories)</li>
            <li><strong>Active flag</strong> (set to active so it shows to customers)</li>
          </ul>
        </li>
        <li>Save.</li>
      </ol>

      <h3>Editing or deleting a category</h3>
      <ol>
        <li>Open the Category Management modal.</li>
        <li>Find the category in the list.</li>
        <li>Tap to edit or delete.</li>
        <li>Save.</li>
      </ol>

      <DocsCallout type="warning">
        <strong>Deleting a category orphans its templates.</strong> If
        you delete the &quot;Summer 2026&quot; category, every template
        in it becomes orphaned (uncategorized). They&apos;ll still
        appear to customers but in a separate
        &quot;uncategorized&quot; group. Re-assign them to a new
        category before deleting if you want to keep them organized.
      </DocsCallout>

      <h2 id="seasonal">Seasonal categories</h2>

      <p>
        Categories can be <strong>seasonal</strong>. They have a date
        range and only appear during that range. This is one of
        BoothIQ&apos;s most powerful features for event-driven venues.
      </p>

      <h3>How seasonal date ranges work</h3>
      <ul>
        <li>The date range is in <strong>MM-DD format</strong> (e.g. <code>12-01</code> to <code>01-15</code>)</li>
        <li>The category is <strong>visible</strong> during the range</li>
        <li>The category is <strong>hidden</strong> outside the range</li>
        <li>Cross-year ranges work (December 1 → January 15)</li>
        <li>The booth checks the date automatically. You don&apos;t have to remember to enable/disable</li>
      </ul>

      <h3>Example seasonal categories</h3>
      <ul>
        <li><strong>Christmas:</strong> <code>12-01</code> to <code>01-05</code>. Visible December 1 to January 5</li>
        <li><strong>Valentine&apos;s Day:</strong> <code>02-01</code> to <code>02-15</code>. Visible February 1 to February 15</li>
        <li><strong>Halloween:</strong> <code>10-15</code> to <code>11-01</code>. Visible October 15 to November 1</li>
        <li><strong>Spring break:</strong> <code>03-15</code> to <code>04-15</code>. Visible March 15 to April 15</li>
      </ul>

      <p>Set them up once and they take care of themselves year after year.</p>

      <h2 id="orphaned">Orphaned templates</h2>

      <p>A template is <strong>orphaned</strong> when its category was deleted or never assigned. Orphans:</p>

      <ul>
        <li>Still appear to customers (if enabled)</li>
        <li>Show up in a separate &quot;uncategorized&quot; group at the end of the carousel</li>
        <li>Show up in a special section in the Templates tab so you can find and fix them</li>
      </ul>

      <p>To fix an orphaned template:</p>

      <ol>
        <li>Open admin → Templates.</li>
        <li>Find the orphan section (or filter for orphans).</li>
        <li>Tap the template.</li>
        <li>Assign it to a category.</li>
        <li>Save.</li>
      </ol>

      <p>Or just disable it if you don&apos;t want it in the lineup at all.</p>

      <h2 id="cloud-sync">Cloud sync and templates</h2>

      <p>When you have cloud sync enabled, templates pushed to your cloud library are pulled down automatically:</p>

      <ul>
        <li>The Templates tab refreshes with new templates after each cloud sync</li>
        <li>Disabled / removed templates in the cloud are reflected on the booth</li>
        <li>You don&apos;t have to manually sync. It happens in the background</li>
      </ul>

      <p>To force a sync if you just uploaded a new template and don&apos;t want to wait:</p>

      <ol>
        <li>Open admin → <strong>Cloud Sync</strong>.</li>
        <li>Find the manual sync action.</li>
        <li>Wait a few seconds.</li>
        <li>Open the Templates tab and confirm the new template is there.</li>
      </ol>

      <h2 id="event-workflow">A workflow for an event</h2>

      <p>Here&apos;s a practical workflow for prepping the booth for a wedding or corporate event:</p>

      <ol>
        <li><strong>A week before the event:</strong> Upload custom templates (with the client&apos;s branding, colors, etc.) to your cloud library.</li>
        <li><strong>A few days before the event:</strong> Push a sync to the booth and confirm the new templates appear in the Templates tab.</li>
        <li><strong>Create a category</strong> for the event (e.g. &quot;Smith Wedding 2026&quot;).</li>
        <li><strong>Enable</strong> the new templates and assign them to the new category.</li>
        <li><strong>Disable</strong> other categories you don&apos;t want at the event (e.g. Holiday in March), so the customer-facing carousel is focused.</li>
        <li><strong>Test:</strong> exit admin and walk through a session. Pick the new category and confirm the new templates appear.</li>
        <li><strong>At the event:</strong> Switch the booth to Free Play (if the client is paying you) and let customers go.</li>
        <li><strong>After the event:</strong> Disable the event category. Re-enable the categories you disabled. The booth is ready for the next event.</li>
      </ol>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;re managing templates effectively when:</p>

      <ul>
        <li>The customer template carousel only shows templates that match your current event or season</li>
        <li>Seasonal categories appear and disappear automatically</li>
        <li>New templates from the cloud appear within minutes of being uploaded</li>
        <li>You don&apos;t have orphaned templates lying around</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>New cloud template doesn&apos;t appear.</strong></p>
      <p>Force a sync from the Cloud Sync tab.</p>

      <p><strong>Disabled template still shows to customers.</strong></p>
      <p>Tap Save in the Templates tab; exit admin and re-enter.</p>

      <p><strong>Seasonal category doesn&apos;t appear in season.</strong></p>
      <p>Check the MM-DD format and the kiosk&apos;s clock.</p>

      <p><strong>Lots of orphans after deleting a category.</strong></p>
      <p>Re-assign them or disable them in the Templates tab.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/running-your-booth/operation-modes">Operation modes</Link>
          . Switching between Coin and Free Play for events.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/templates-tab">Templates tab</Link>
          . UI tour of the tab itself.
        </li>
      </ul>
    </DocsLayout>
  );
}
