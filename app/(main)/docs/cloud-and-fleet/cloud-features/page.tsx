import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Cloud features overview — BoothIQ Docs",
  description:
    "A summary of the six cloud features that unlock when your booth is connected.",
};

const HREF = "/docs/cloud-and-fleet/cloud-features";

const TOC = [
  { id: "six-features", label: "The six features" },
  { id: "remote-analytics", label: "Remote Analytics" },
  { id: "notifications", label: "Notifications" },
  { id: "template-sync", label: "Template Sync" },
  { id: "sales-reports", label: "Sales Reports" },
  { id: "photo-backup", label: "Photo Backup" },
  { id: "remote-config", label: "Remote Config" },
  { id: "which-do-you-need", label: "Which features do you actually need?" },
  { id: "do-not-exist", label: "What features do not exist (yet)" },
  { id: "verify", label: "Verifying the features work" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CloudFeaturesPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Cloud features overview</h1>

      <p>
        When you register a BoothIQ kiosk to your cloud account, six
        features become available. The Cloud Sync tab shows them as a
        3×2 grid of feature tiles. This article briefly explains each
        one and when you&apos;d use it.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators evaluating whether
        to register a booth to the cloud, or wanting to use cloud
        features they already have.
      </p>

      <h2 id="six-features">The six features</h2>

      <h3 id="remote-analytics">1. Remote Analytics</h3>

      <p><strong>What:</strong> View booth stats from the cloud dashboard on a separate device (laptop, phone, tablet).</p>

      <p><strong>When to use:</strong> Daily. Instead of walking up to each booth and signing in to admin to read the Sales tab, open the cloud dashboard from anywhere and see all your booths at once.</p>

      <p><strong>Examples:</strong></p>
      <ul>
        <li>&quot;Did the booth at Venue A do better than Venue B last week?&quot;</li>
        <li>&quot;Which booth had the most transactions today?&quot;</li>
        <li>&quot;What&apos;s our top product across all booths?&quot;</li>
      </ul>

      <p>The cloud dashboard typically shows revenue charts, transaction counts, popular templates, and a fleet-wide summary.</p>

      <h3 id="notifications">2. Notifications</h3>

      <p><strong>What:</strong> Get alerts on your phone or email when a booth needs attention.</p>

      <p><strong>When to use:</strong> When you operate multiple booths or aren&apos;t physically present at the venue all day.</p>

      <p><strong>Examples:</strong></p>
      <ul>
        <li>&quot;Booth at Venue C just went offline&quot;</li>
        <li>&quot;Booth printer is out of paper&quot;</li>
        <li>&quot;Booth has been unable to sync for 30 minutes&quot;</li>
        <li>&quot;Booth license is expiring in 7 days&quot;</li>
      </ul>

      <p>You configure which alerts you want from the cloud dashboard. Push notifications and email are typical delivery channels.</p>

      <h3 id="template-sync">3. Template Sync</h3>

      <p><strong>What:</strong> Push templates from your cloud library down to all your booths.</p>

      <p><strong>When to use:</strong> Whenever you upload a new template, change an existing one, or want to remove a template from your fleet.</p>

      <p><strong>How it works:</strong></p>
      <ol>
        <li>Upload the template to your BoothIQ cloud library.</li>
        <li>Either let the automatic sync deliver it (within a few minutes) or trigger an immediate sync from the cloud dashboard.</li>
        <li>The template appears in each booth&apos;s Templates tab.</li>
        <li>Operators on each booth can enable / disable / categorize the new template.</li>
      </ol>

      <p>This is much easier than physically walking to each booth and uploading a template via USB.</p>

      <p>
        For more on operator-side template management, see{" "}
        <Link href="/docs/running-your-booth/managing-templates-and-categories">
          Managing templates and categories
        </Link>
        .
      </p>

      <h3 id="sales-reports">4. Sales Reports</h3>

      <p><strong>What:</strong> Financial summaries in the cloud, across multiple booths and date ranges.</p>

      <p><strong>When to use:</strong> End-of-week / end-of-month / end-of-year accounting.</p>

      <p><strong>Examples:</strong></p>
      <ul>
        <li>Total revenue across all booths for the month</li>
        <li>Per-booth breakdown</li>
        <li>Per-product breakdown across the fleet</li>
        <li>Trends over time</li>
      </ul>

      <p>Cloud-side reports are typically more sophisticated than the per-booth Sales &amp; Analytics tab. They aggregate across multiple booths and are easier to share with accountants.</p>

      <p>
        You can usually also <strong>export sales</strong> from the
        cloud, similar to the per-booth CSV export. See{" "}
        <Link href="/docs/running-your-booth/exporting-sales-data">
          Exporting sales data
        </Link>{" "}
        for the kiosk-side equivalent.
      </p>

      <h3 id="photo-backup">5. Photo Backup</h3>

      <p><strong>What:</strong> Cloud storage for customer photos.</p>

      <p><strong>When to use:</strong> When your venue requires photo records, or when you want a backup in case the kiosk&apos;s local storage fails.</p>

      <p><strong>Important:</strong> Photo backup is <strong>opt-in</strong>. By default, customer photos stay on the kiosk and are not synced to the cloud. You enable photo backup in your cloud account configuration.</p>

      <DocsCallout type="warning">
        <strong>Privacy note:</strong> Backing up customer photos to
        the cloud has privacy implications. Make sure you understand
        your venue&apos;s and your customers&apos; expectations before
        enabling. See <strong>Data and privacy</strong>{" "}
        <em>(coming soon)</em>.
      </DocsCallout>

      <h3 id="remote-config">6. Remote Config</h3>

      <p><strong>What:</strong> Update booth settings from the cloud dashboard.</p>

      <p><strong>When to use:</strong> When you want to change settings without driving to the venue.</p>

      <p><strong>Examples:</strong></p>
      <ul>
        <li>Change the business name</li>
        <li>Switch operation mode</li>
        <li>Update the welcome subtitle</li>
        <li>Change the logo</li>
      </ul>

      <p>
        The kiosk-side <strong>Settings → Sync from cloud</strong>{" "}
        toggle controls whether the booth accepts cloud config. When
        that toggle is <strong>on</strong>, settings come from the
        cloud and the local fields are read-only on the kiosk. See{" "}
        <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
        .
      </p>

      <DocsCallout type="note">
        <strong>Use case:</strong> You manage 10 booths and want to
        update all of them with this season&apos;s logo. Without
        remote config, you&apos;d have to walk to each booth and
        upload the logo. With remote config + cloud-managed settings,
        you upload the logo to the cloud once and every booth picks
        it up automatically.
      </DocsCallout>

      <h2 id="which-do-you-need">Which features do you actually need?</h2>

      <p>You don&apos;t have to use all six. Most operators start with <strong>Remote Analytics</strong> (because it&apos;s the easiest win) and add others as needed:</p>

      <ul>
        <li><strong>Single-booth operator:</strong> Remote Analytics, Notifications</li>
        <li><strong>Multi-booth operator:</strong> All except possibly Photo Backup</li>
        <li><strong>Operator with venue staff handling daily tasks:</strong> Remote Analytics, Notifications, Sales Reports</li>
        <li><strong>Operator with privacy-sensitive customers:</strong> Skip Photo Backup</li>
        <li><strong>Operator with stable venue layouts and templates:</strong> Skip Template Sync (if you only update templates rarely)</li>
      </ul>

      <h2 id="do-not-exist">What features do not exist (yet)</h2>

      <p>For transparency about what cloud sync does <strong>not</strong> do:</p>

      <ul>
        <li><strong>Live remote view of the customer experience.</strong> No, can&apos;t watch a customer&apos;s session in real time</li>
        <li><strong>Live remote view of the camera.</strong> No</li>
        <li><strong>Pushing arbitrary code or scripts to the booth.</strong> No, security</li>
        <li><strong>Direct database access from the cloud.</strong> No</li>
        <li><strong>Customer-facing interactions</strong> (e.g. customer pays via the cloud dashboard). No</li>
      </ul>

      <p>If a feature you want isn&apos;t in the list above, contact your BoothIQ point of contact to ask if it&apos;s on the roadmap.</p>

      <h2 id="verify">Verifying the features work</h2>

      <p>Each feature has its own quick test:</p>

      <ul>
        <li><strong>Remote Analytics.</strong> Open the cloud dashboard from your phone; you should see your booth&apos;s recent stats</li>
        <li><strong>Notifications.</strong> Trigger a known event (e.g. take the booth offline); you should get a notification</li>
        <li><strong>Template Sync.</strong> Upload a test template; it should appear in the booth&apos;s Templates tab within a few minutes</li>
        <li><strong>Sales Reports.</strong> Run a session on the booth; the sale should appear in cloud reports</li>
        <li><strong>Photo Backup.</strong> Enable it, run a session, check the cloud&apos;s photo backup section</li>
        <li><strong>Remote Config.</strong> Toggle &quot;Sync from cloud&quot; on the kiosk and change a setting in the cloud; the kiosk should reflect the change</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link>
          . Where the features grid lives.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/what-cloud-sync-does">What cloud sync does</Link>
          . The mechanics behind these features.
        </li>
        <li>
          <Link href="/docs/connecting-your-kiosk/cloud-registration">
            Cloud registration
          </Link>
          . How to register a booth so these features unlock.
        </li>
      </ul>
    </DocsLayout>
  );
}
