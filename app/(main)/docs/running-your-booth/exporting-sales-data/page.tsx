import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Exporting sales data — BoothIQ Docs",
  description:
    "How to export transactions from the Sales tab to a CSV file you can open in Excel or send to your accountant.",
};

const HREF = "/docs/running-your-booth/exporting-sales-data";

const TOC = [
  { id: "before-you-start", label: "Before you start" },
  { id: "how-to-export", label: "How to export" },
  { id: "csv-contents", label: "What's in the CSV" },
  { id: "spreadsheet-tips", label: "Tips for spreadsheet analysis" },
  { id: "how-often", label: "How often to export" },
  { id: "cancelling", label: "Cancelling a long export" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "privacy", label: "Privacy considerations" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ExportingSalesDataPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Exporting sales data</h1>

      <p>
        For accounting, taxes, or analysis in a spreadsheet, you can
        export the booth&apos;s transaction history to a CSV
        (comma-separated values) file. The export happens from the{" "}
        <strong>Sales &amp; Analytics tab</strong> in admin and writes
        to a USB drive plugged into the kiosk.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators getting their
        sales out of the booth and into a spreadsheet or accounting
        system.
      </p>

      <h2 id="before-you-start">Before you start</h2>

      <ul>
        <li>Have a <strong>USB drive</strong> ready. Format: FAT32 or exFAT. Free space: at least 100 MB (CSV files are tiny but allow headroom).</li>
        <li>Decide the <strong>date range</strong> you want to export.</li>
      </ul>

      <h2 id="how-to-export">How to export</h2>

      <ol>
        <li>Insert the USB drive into a USB port on the kiosk.</li>
        <li>Sign in to admin and open the <strong>Sales &amp; Analytics</strong> tab.</li>
        <li>Set the <strong>date range filter</strong> to the period you want to export. Use the quick buttons (Today / 7d / 30d / 90d / YTD) or whatever custom range your version supports.</li>
        <li>Find the <strong>Export CSV</strong> (or similar) button. Usually near the transaction history table at the bottom of the tab.</li>
        <li>Tap it.</li>
        <li>The booth generates the CSV and writes it to the USB drive.</li>
        <li>Watch the on-screen confirmation for the file name and the path it was saved to.</li>
        <li>Eject the USB drive (if your version offers an eject option) or just unplug it.</li>
      </ol>

      <p>You can take the USB drive to a different computer and open the CSV in Excel, Google Sheets, Numbers, or any spreadsheet application.</p>

      <DocsScreenshot
        src="sales-tab-csv-export.png"
        alt="Sales tab with the CSV export confirmation showing file name and save path."
      />

      <h2 id="csv-contents">What&apos;s in the CSV</h2>

      <p>The CSV file includes one row per transaction with columns for the relevant fields:</p>

      <ul>
        <li><strong>Date / time.</strong> When the transaction occurred</li>
        <li><strong>Product.</strong> Strips / 4×6 / Smartphone Print</li>
        <li><strong>Quantity / copies.</strong> Number of copies in the order</li>
        <li><strong>Base price.</strong> The per-product base price at the time of the transaction</li>
        <li><strong>Total price.</strong> What the customer actually paid</li>
        <li><strong>Payment method.</strong> Cash / Card / Free / etc.</li>
        <li><strong>Customer email.</strong> If collected (often blank)</li>
        <li><strong>Transaction ID.</strong> A unique identifier</li>
      </ul>

      <p>The exact column order may vary by BoothIQ version. The header row in the CSV file tells you what each column represents.</p>

      <h2 id="spreadsheet-tips">Tips for spreadsheet analysis</h2>

      <p>Once you have the CSV in a spreadsheet:</p>

      <ul>
        <li><strong>Sort by Date</strong> to walk through transactions chronologically</li>
        <li><strong>Filter by Product</strong> to see how much each product contributed</li>
        <li><strong>SUM() the Total Price column</strong> to verify against the Sales tab dashboard</li>
        <li><strong>PIVOT by Date</strong> to see daily revenue</li>
        <li><strong>PIVOT by Payment Method</strong> to see cash vs card breakdown</li>
        <li><strong>COUNTIF() Free transactions</strong> to see how many comped sessions you ran</li>
      </ul>

      <p>If you&apos;re sending the file to an accountant, they&apos;ll likely want it in a specific format. The CSV is universally readable and can be re-formatted as needed.</p>

      <h2 id="how-often">How often to export</h2>

      <p>Common patterns:</p>

      <ul>
        <li><strong>Daily.</strong> At the end of every shift, export the day. Useful for high-volume venues</li>
        <li><strong>Weekly.</strong> Every Sunday or Monday for the previous week. Common for event venues</li>
        <li><strong>Monthly.</strong> At the start of every month for the previous month. Common for sit-and-forget operators</li>
        <li><strong>Per event.</strong> Set the date range to the event window and export when the event is over</li>
      </ul>

      <p>Pick whatever cadence fits your accounting flow.</p>

      <h2 id="cancelling">Cancelling a long export</h2>

      <p>If you start an export and realize you picked the wrong date range, you can cancel:</p>

      <ol>
        <li>Look for a <strong>Cancel</strong> button on the export progress UI.</li>
        <li>Tap it.</li>
        <li>The export stops mid-stream and the partial CSV (if any) is discarded.</li>
      </ol>

      <p>This is most useful for a &quot;Year to Date&quot; export on a busy booth, which can take a few seconds to generate.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;ve exported successfully when:</p>

      <ul>
        <li>The CSV file appears on your USB drive</li>
        <li>The number of rows in the CSV matches the transaction count shown in the Sales tab for that date range</li>
        <li>The total of the <strong>Total Price</strong> column matches the Sales tab&apos;s revenue for the same range</li>
      </ul>

      <p>If the numbers don&apos;t match, you may have changed the date range filter mid-export. Re-do the export.</p>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Export button does nothing.</strong></p>
      <p>No USB drive plugged in. Plug in a USB drive and try again.</p>

      <p><strong>Export errors with &quot;Drive not writable&quot;.</strong></p>
      <p>The USB drive is full, write-protected, or formatted with an unsupported filesystem. Use a different drive (FAT32 or exFAT, with free space).</p>

      <p><strong>Export creates an empty CSV.</strong></p>
      <p>No transactions in the selected date range. Change the date range filter and try again.</p>

      <p><strong>CSV doesn&apos;t open in Excel.</strong></p>
      <p>File extension may have been mangled, or Excel is treating it as text. Right-click → Open With → Excel; or import via Data → From Text.</p>

      <p><strong>Export is slow.</strong></p>
      <p>Large date range (e.g. YTD on a busy booth). This is normal. Wait, or cancel and use a smaller range.</p>

      <p><strong>CSV missing rows.</strong></p>
      <p>Pagination of the live Sales tab caps at 20 per page. But the CSV exports <strong>all</strong> rows in the date range, not just the visible page. Verify with a small range first.</p>

      <h2 id="privacy">Privacy considerations</h2>

      <p>
        If your transactions include customer email addresses, the
        CSV contains those addresses. Treat the CSV as{" "}
        <strong>personally identifiable information</strong> (PII):
      </p>

      <ul>
        <li>Don&apos;t email it unencrypted</li>
        <li>Don&apos;t leave the USB drive somewhere unattended</li>
        <li>Delete the file when you&apos;re done with it</li>
      </ul>

      <p>For more on data and privacy, see <strong>Security › Data and privacy</strong> <em>(coming soon)</em>.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/sales-tab">Sales &amp; Analytics tab</Link>
          . UI tour of where the export lives.
        </li>
        <li>
          <Link href="/docs/running-your-booth/pricing-strategy">Pricing strategy</Link>
          . Use the exported data to inform pricing changes.
        </li>
      </ul>
    </DocsLayout>
  );
}
