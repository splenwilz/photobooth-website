import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Sales & Analytics tab — BoothIQ Docs",
  description:
    "A tour of the Sales & Analytics tab: revenue, transactions, popular templates, and CSV export.",
};

const HREF = "/docs/admin-dashboard/sales-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout", label: "Layout" },
  { id: "date-range", label: "Date range filter" },
  { id: "headline-stats", label: "Headline stats" },
  { id: "print-supply", label: "Print supply card" },
  { id: "charts", label: "Charts" },
  { id: "popular-templates", label: "Popular templates" },
  { id: "transaction-history", label: "Transaction history" },
  { id: "csv-export", label: "Exporting transactions to CSV" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function SalesTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Sales &amp; Analytics tab</h1>

      <p>
        The <strong>Sales &amp; Analytics</strong> tab is the first
        thing you see when you sign in to admin (it&apos;s the default
        landing tab). It&apos;s where you&apos;ll spend most of your
        time as an operator: checking revenue, watching the print
        supply, and exporting transactions.
      </p>

      <p>
        <strong>Who this is for:</strong> Every operator who runs the
        booth in production.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>See how much money the booth has made today / this week / this month / this year</li>
        <li>See how many transactions and copies were sold, broken down by product</li>
        <li>See which templates are the most popular</li>
        <li>Watch the print supply (prints remaining on the current roll)</li>
        <li>See the current credit balance and payment method mix</li>
        <li>Export transaction history as a CSV file for accounting</li>
      </ul>

      <h2 id="layout">Layout</h2>

      <p>The Sales &amp; Analytics tab is dense. Top to bottom you&apos;ll see:</p>

      <ol>
        <li><strong>Page header</strong> with the title &quot;Sales &amp; Analytics&quot; and a subtitle</li>
        <li><strong>Date range filter</strong> with quick buttons (Today / 7d / 30d / 90d / YTD)</li>
        <li><strong>Headline stat cards</strong> showing the totals for the selected period</li>
        <li><strong>Print supply card</strong> with the prints-remaining bar</li>
        <li><strong>Charts</strong> for revenue trend and product breakdown</li>
        <li><strong>Popular templates</strong> report</li>
        <li><strong>Transaction history</strong> table with pagination and CSV export</li>
      </ol>

      <DocsScreenshot
        src="sales-tab-full.png"
        alt="Sales & Analytics tab full view with date range filter, headline stat cards, charts, and transaction history."
      />

      <h2 id="date-range">Date range filter</h2>

      <p>
        The filter buttons let you change the period that all the
        stats and charts are calculated over. Tap any of:
      </p>

      <ul>
        <li><strong>Today</strong>. Midnight today through now</li>
        <li><strong>7d</strong>. The last 7 days</li>
        <li><strong>30d</strong>. The last 30 days</li>
        <li><strong>90d</strong>. The last 90 days</li>
        <li><strong>YTD</strong>. January 1 of the current year through now</li>
      </ul>

      <p>
        The active filter is highlighted. The headline stats, charts,
        popular templates, and transaction history all update when you
        change the filter.
      </p>

      <DocsCallout type="note">
        The filter is <strong>inclusive of the start date and exclusive
        of the end date</strong>. So &quot;Today&quot; includes
        everything from midnight up to right now, but does not include
        tomorrow.
      </DocsCallout>

      <h2 id="headline-stats">Headline stats</h2>

      <p>A row of summary cards shows the totals for the selected period. Typical cards include:</p>

      <ul>
        <li><strong>Total Revenue.</strong> Money taken in over the period (sum of all completed transactions)</li>
        <li><strong>Transactions.</strong> Number of completed customer sessions</li>
        <li><strong>Total Copies.</strong> Total prints produced (a session that bought 3 copies counts as 3)</li>
        <li><strong>Average Order.</strong> Total revenue ÷ transactions</li>
      </ul>

      <p>These are the numbers you&apos;ll quote to your accountant or your venue manager.</p>

      <h2 id="print-supply">Print supply card</h2>

      <p>A separate card shows how many prints you have left on the current paper roll:</p>

      <ul>
        <li>A <strong>horizontal progress bar</strong>. Fills as the roll is consumed</li>
        <li>A <strong>percentage</strong> of remaining capacity</li>
        <li>The <strong>prints-remaining number</strong> (calculated from the printer&apos;s reported state)</li>
      </ul>

      <p>
        A standard DNP roll yields about <strong>700</strong> 4×6
        prints or <strong>1400</strong> 2×6 strips. The booth tracks
        this in real time so you don&apos;t run out mid-event.
      </p>

      <p>
        When the bar gets to about 10-15%, plan to change the roll.
        See <strong>Maintenance › Changing the print roll</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <DocsScreenshot
        src="sales-tab-print-supply.png"
        alt="Print supply card with a horizontal progress bar and prints remaining count."
      />

      <h2 id="charts">Charts</h2>

      <h3>Revenue trend</h3>
      <p>
        A line chart showing revenue over the selected period. For
        shorter periods (Today, 7d) it&apos;s bucketed by hour or day;
        for longer periods it&apos;s bucketed by day or week.
      </p>
      <p>Use this to spot:</p>
      <ul>
        <li>Peak hours / days</li>
        <li>Sudden drops (could indicate an outage)</li>
        <li>Steady growth or decline over time</li>
      </ul>

      <h3>Product breakdown</h3>
      <p>A bar or pie chart showing how revenue splits across:</p>
      <ul>
        <li><strong>Photo Strips</strong></li>
        <li><strong>4×6 Prints</strong></li>
        <li><strong>Smartphone Print</strong> (if enabled)</li>
      </ul>
      <p>
        This tells you which product line is making you the most
        money, which feeds back into how you price each one (see{" "}
        <strong>Running Your Booth › Pricing strategy</strong>{" "}
        <em>(coming soon)</em>).
      </p>

      <h3>Payment method mix</h3>
      <p>
        A breakdown of cash vs card transactions. Useful when
        you&apos;re deciding whether to add or remove payment hardware.
      </p>

      <h2 id="popular-templates">Popular templates</h2>

      <p>
        A table or chart showing which templates customers picked the
        most over the selected period. Each row shows:
      </p>

      <ul>
        <li>The template name and category</li>
        <li>The number of times it was used</li>
        <li>The revenue it generated</li>
        <li>(Optional) A &quot;last used&quot; timestamp</li>
      </ul>

      <p>Use this to:</p>

      <ul>
        <li>Identify your top performers</li>
        <li>Spot templates nobody is using (and consider removing them)</li>
        <li>Inform what kind of templates to add next</li>
      </ul>

      <h2 id="transaction-history">Transaction history</h2>

      <p>
        At the bottom of the tab is a paginated table of every
        transaction in the selected date range. Each row shows the
        basics:
      </p>

      <ul>
        <li>Date and time</li>
        <li>Product (Strips / 4×6 / Smartphone)</li>
        <li>Quantity / copies</li>
        <li>Price</li>
        <li>Payment method</li>
        <li>(Optional) Customer email if collected</li>
      </ul>

      <p>Pagination controls let you walk through the history (typically 20 per page).</p>

      <DocsScreenshot
        src="sales-tab-transactions.png"
        alt="Transaction history table with paginated rows of completed sessions."
      />

      <h2 id="csv-export">Exporting transactions to CSV</h2>

      <p>For accounting or analysis in a spreadsheet:</p>

      <ol>
        <li>Set the date range filter to the period you want to export.</li>
        <li>Find the <strong>Export CSV</strong> (or similar) button near the transaction history.</li>
        <li>Tap it.</li>
        <li>The booth generates a CSV file containing every transaction in the selected period.</li>
        <li>The file is saved to a USB drive (if one is plugged in) or to a local export folder. Watch the on-screen confirmation for the exact path.</li>
        <li>You can cancel a long export mid-stream if needed.</li>
      </ol>

      <p>
        The CSV includes columns for date, product, quantity, price,
        payment method, and (where available) customer email.
      </p>

      <DocsCallout type="note">
        If no USB drive is plugged in when you export, you&apos;ll
        either see an error or the file will go to a local path. Plug
        in a USB drive before exporting if you want to take the data
        away with you.
      </DocsCallout>

      <h2 id="verify">Verify it worked</h2>

      <p>You can use the Sales &amp; Analytics tab effectively when you can:</p>

      <ul>
        <li>Switch the date range and watch all the numbers update</li>
        <li>Read the prints-remaining bar</li>
        <li>Find your top 3 most popular templates</li>
        <li>Export a week&apos;s transactions to CSV</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>All stats show 0.</strong></p>
      <p>No transactions in the selected date range, or you have no sales yet. Switch to a longer date range, or run a test session.</p>

      <p><strong>Prints remaining shows <code>--</code>.</strong></p>
      <p>
        The printer hasn&apos;t reported its media level yet, or
        it&apos;s offline. Wait 30 seconds. If it stays{" "}
        <code>--</code>, check{" "}
        <Link href="/docs/admin-dashboard/diagnostics-tab">
          Diagnostics tab
        </Link>
        .
      </p>

      <p><strong>Numbers don&apos;t match what you expect.</strong></p>
      <p>Look at the date range filter. It may not be set to what you think. Change the filter to the correct period.</p>

      <p><strong>CSV export button does nothing or errors.</strong></p>
      <p>No USB drive plugged in (if export goes to USB). Plug a USB drive in and try again.</p>

      <p><strong>Popular templates list is empty.</strong></p>
      <p>Either no sessions in the date range, or templates aren&apos;t being tracked properly. Take a test session and check again.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/credits-tab">Credits tab</Link>
          . Manage the credit balance and credit transaction history.
        </li>
        <li><strong>Running Your Booth › Exporting sales data</strong> <em>(coming soon)</em>. A task-oriented walkthrough of the CSV export.</li>
        <li><strong>Pricing strategy</strong> <em>(coming soon)</em>. How to use the analytics on this tab to set better prices.</li>
      </ul>
    </DocsLayout>
  );
}
