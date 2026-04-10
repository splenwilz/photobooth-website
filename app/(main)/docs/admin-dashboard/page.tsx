import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard — BoothIQ Docs",
  description:
    "A complete tour of the BoothIQ admin dashboard: every tab, every section, every button that matters.",
};

const HREF = "/docs/admin-dashboard";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "tip", label: "Tip: read the tabs you'll use most first" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function AdminDashboardIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Admin Dashboard</h1>

      <p>
        The admin dashboard is where you manage everything about your
        booth. It&apos;s hidden from customers and reachable only from
        the kiosk&apos;s own touchscreen via a 5-tap sequence and a
        password.
      </p>

      <p>
        The dashboard has <strong>nine tabs</strong> organized into two
        sections: <strong>MAIN MENU</strong> for day-to-day operations
        and <strong>SYSTEM</strong> for hardware, settings, and
        connectivity.
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <p><strong>Getting in:</strong></p>

      <ol>
        <li>
          <Link href="/docs/admin-dashboard/accessing-admin">Accessing admin mode</Link>
          . The 5-tap sequence, login, and access levels.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/dashboard-overview">Dashboard overview</Link>
          . The sidebar, header bar, hardware pills, and license banner.
        </li>
      </ol>

      <p><strong>Main menu tabs:</strong></p>

      <ol start={3}>
        <li>
          <Link href="/docs/admin-dashboard/sales-tab">Sales &amp; Analytics tab</Link>
          . Revenue, transactions, popular templates, CSV export.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/credits-tab">Credits tab</Link>
          . Current balance, manual credit additions, credit history.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/products-tab">Products tab</Link>
          . Enable products, set prices, configure extra-copy discounts.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/templates-tab">Templates tab</Link>
          . Browse, enable, disable, and tag templates.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/layouts-tab">Layouts tab</Link>
          . Photo-area positioning that templates use.
        </li>
      </ol>

      <p><strong>System tabs:</strong></p>

      <ol start={8}>
        <li>
          <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
          . Business info, logo, photo storage, watchdog, password change.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Hardware status cards and &quot;Run All Tests&quot; button.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link>
          . Register the booth, view sync status, see cloud features.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/wifi-tab">WiFi tab</Link>
          . Scan and connect to wireless networks.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>
        Every BoothIQ operator. The admin dashboard is the
        operator&apos;s main interface. Knowing where each setting
        lives is the difference between a 30-second fix and a
        frustrating hunt.
      </p>

      <h2 id="tip">Tip: read the tabs you&apos;ll use most first</h2>

      <p>If you only have time for a few articles, prioritize:</p>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/dashboard-overview">Dashboard overview</Link>
          {" "}(so you can read the header bar at a glance)
        </li>
        <li>
          <Link href="/docs/admin-dashboard/sales-tab">Sales &amp; Analytics tab</Link>
          {" "}(you&apos;ll be in here every day)
        </li>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          {" "}(so you can spot hardware problems before customers do)
        </li>
        <li>
          <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
          {" "}(where most one-time configuration lives)
        </li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <p>
        For task-oriented walkthroughs (e.g. &quot;how do I change a
        price&quot;), see <strong>Running Your Booth</strong>{" "}
        <em>(coming soon)</em>.
      </p>
    </DocsLayout>
  );
}
