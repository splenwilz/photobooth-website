import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Running Your Booth — BoothIQ Docs",
  description:
    "Day-to-day operations: pricing, templates, modes, sales exports, customer issues.",
};

const HREF = "/docs/running-your-booth";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function RunningYourBoothIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Running Your Booth</h1>

      <p>
        This section is task-oriented. Each article answers a specific
        question an operator might ask:{" "}
        <em>&quot;How do I change a price?&quot;</em>,{" "}
        <em>&quot;How do I switch to free play?&quot;</em>,{" "}
        <em>&quot;How do I export sales for the accountant?&quot;</em>.
      </p>

      <p>
        If you want a tour of the admin dashboard instead, see{" "}
        <Link href="/docs/admin-dashboard">Admin Dashboard</Link>.
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/running-your-booth/daily-startup-checklist">Daily startup checklist</Link>
          . A 5-minute walkthrough to do at the start of every shift.
        </li>
        <li>
          <Link href="/docs/running-your-booth/pricing-strategy">Pricing strategy</Link>
          . Base prices, extra-copy pricing, and multi-copy discounts.
        </li>
        <li>
          <Link href="/docs/running-your-booth/managing-templates-and-categories">Managing templates and categories</Link>
          . Enable, disable, and tag templates; configure categories.
        </li>
        <li>
          <Link href="/docs/running-your-booth/operation-modes">Operation modes (Coin vs Free Play)</Link>
          . Switching between charging customers and free-play events.
        </li>
        <li>
          <Link href="/docs/running-your-booth/adding-credits-manually">Adding credits manually</Link>
          . Comping a session for a customer or event.
        </li>
        <li>
          <Link href="/docs/running-your-booth/exporting-sales-data">Exporting sales data</Link>
          . CSV export from the Sales tab.
        </li>
        <li>
          <Link href="/docs/running-your-booth/managing-business-info">Managing your business info and logo</Link>
          . Business name, location, welcome subtitle, logo on prints.
        </li>
        <li>
          <Link href="/docs/running-your-booth/handling-customer-issues">Handling customer issues</Link>
          . Common situations and how to recover.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>
        Operators running a booth in production. You should already be
        comfortable signing in to admin (see{" "}
        <Link href="/docs/getting-started/first-login-and-password">
          First login and password
        </Link>
        ).
      </p>

      <h2 id="next-steps">Next steps</h2>

      <p>
        When something goes wrong, see <strong>Troubleshooting</strong>{" "}
        <em>(coming soon)</em>. For routine upkeep, see{" "}
        <strong>Maintenance</strong> <em>(coming soon)</em>.
      </p>
    </DocsLayout>
  );
}
