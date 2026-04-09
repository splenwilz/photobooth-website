import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Cloud Sync tab — BoothIQ Docs",
  description:
    "A tour of the Cloud Sync tab: registration, sync status, cloud features, and the unregister flow.",
};

const HREF = "/docs/admin-dashboard/cloud-sync-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout", label: "Layout" },
  { id: "status-badge", label: "Status badge" },
  { id: "quick-registration", label: "Quick Registration card" },
  { id: "manual-registration", label: "Manual Registration card" },
  { id: "unregister", label: "Unregister Booth button" },
  { id: "cloud-features", label: "Cloud Features card" },
  { id: "sync-status", label: "Sync Status card" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CloudSyncTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Cloud Sync tab</h1>

      <p>
        The <strong>Cloud Sync</strong> tab is where you connect the
        booth to your BoothIQ cloud account, see what&apos;s syncing
        in real time, and manage the registration. There&apos;s also a{" "}
        <strong>Cloud Features</strong> card that summarizes what
        unlocks when you&apos;re connected.
      </p>

      <p>
        If you&apos;ve never registered the booth, this is also where
        you do it for the first time.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators registering a new
        booth, monitoring an existing connection, or unregistering for
        a move.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>See the <strong>registration status</strong> at a glance</li>
        <li>Register the booth using a <strong>6-character Quick Registration code</strong></li>
        <li>(Advanced) Register manually with <strong>Booth ID + API Key + Cloud API URL</strong></li>
        <li>View live <strong>Sync Status</strong>: pending items, last sync time, total synced</li>
        <li>Trigger a <strong>manual sync</strong></li>
        <li>See which <strong>Cloud Features</strong> are available when connected</li>
        <li><strong>Unregister</strong> the booth</li>
      </ul>

      <h2 id="layout">Layout</h2>

      <p>Top to bottom and left to right:</p>

      <ol>
        <li><strong>Page header</strong>. Title &quot;Cloud Sync&quot;, subtitle &quot;Connect your booth to the cloud for remote monitoring and data sync&quot;</li>
        <li><strong>Status badge</strong> at the top right showing &quot;Connected&quot; / &quot;Not Registered&quot; / etc.</li>
        <li><strong>Quick Registration card</strong>. Collapsible, holds the 6-character code input</li>
        <li><strong>Manual Registration (Advanced) card</strong>. Collapsible, holds the URL/ID/Key fields</li>
        <li><strong>Unregister Booth button</strong>. Visible only when registered</li>
        <li><strong>Cloud Features card</strong>. 3×2 grid of feature tiles</li>
        <li><strong>Sync Status card</strong> in the right column</li>
      </ol>

      <DocsScreenshot
        src="cloud-sync-tab-full.png"
        alt="Cloud Sync tab with the status badge, registration cards, Cloud Features grid, and Sync Status card."
      />

      <h2 id="status-badge">Status badge</h2>

      <p>A pill at the top right of the page. The colors and text mean:</p>

      <ul>
        <li><strong>Connected</strong> (green). The booth is registered and successfully talking to the cloud</li>
        <li><strong>Not Registered</strong> (amber / yellow). The booth has never been registered, or registration was cleared</li>
        <li><strong>Error</strong> (red). The booth was registered but the cloud is unreachable or rejected the credentials</li>
      </ul>

      <p>This is the first thing to look at when you open this tab.</p>

      <h2 id="quick-registration">Quick Registration card</h2>

      <p>
        The recommended way to register a booth. Collapsible. Tap the
        header (with the cloud icon and &quot;Quick Registration&quot;
        label) to expand or collapse.
      </p>

      <p>When expanded, you&apos;ll see:</p>

      <ul>
        <li>A <strong>Registration Code</strong> input field. Accepts a <strong>6-character</strong> code, automatically uppercases letters</li>
        <li>Helper text under the field: &quot;Enter a 6-character code to enable registration&quot;</li>
        <li>A <strong>Register Booth</strong> button (with a link icon). Disabled until 6 characters are entered</li>
        <li>
          A <strong>How to get your code</strong> info panel below, listing the steps:
          <ol>
            <li>Log in to your web or mobile app</li>
            <li>Create a new booth OR view an existing booth</li>
            <li>Click &quot;Generate Registration Code&quot;</li>
            <li>Enter the 6-digit code above</li>
          </ol>
        </li>
      </ul>

      <p>
        For a step-by-step walkthrough, see{" "}
        <Link href="/docs/connecting-your-kiosk/cloud-registration">
          Connecting Your Kiosk › Cloud registration
        </Link>
        .
      </p>

      <DocsScreenshot
        src="cloud-sync-quick-registration-card.png"
        alt="Quick Registration card expanded with the 6-character code input and Register Booth button."
      />

      <h2 id="manual-registration">Manual Registration (Advanced) card</h2>

      <p>
        Collapsible. Tap the header (with the settings icon and
        &quot;Manual Registration (Advanced)&quot; label) to expand.
        Use this only when Quick Registration won&apos;t work for you,
        or when support has given you direct credentials.
      </p>

      <p>When expanded, you&apos;ll see three input fields:</p>

      <ul>
        <li><strong>Cloud API URL</strong>. Has a default value (<code>http://127.0.0.1:8000</code> for development; production URLs are different). Don&apos;t change it unless your support contact tells you to.</li>
        <li><strong>Booth ID</strong>. A UUID-style identifier</li>
        <li><strong>API Key</strong>. A secret key. There&apos;s an <strong>eye icon</strong> next to the field to show or hide what you&apos;re typing.</li>
      </ul>

      <p>And two buttons:</p>

      <ul>
        <li><strong>Save &amp; Connect</strong> (primary teal). Stores the credentials and registers</li>
        <li><strong>Test Connection</strong> (secondary white). Verifies the credentials work without committing them</li>
      </ul>

      <p>There&apos;s a hint below: &quot;Click Save &amp; Connect to store credentials and test the connection&quot;.</p>

      <DocsCallout type="warning">
        The API Key is a secret. Never share it. If it&apos;s been
        compromised, regenerate it from the cloud dashboard and
        re-register the booth. The old key will be invalidated.
      </DocsCallout>

      <h2 id="unregister">Unregister Booth button</h2>

      <p>
        A red button labeled <strong>Unregister Booth</strong> with an
        X icon. Visible <strong>only when the booth is currently
        registered</strong>. Tap it to clear the cloud credentials and
        stop the sync.
      </p>

      <p>
        Unregistering does <strong>not</strong> delete local data.
        Sales, templates, settings, photos, and credit history are all
        preserved. You can re-register at any time with a new code.
      </p>

      <DocsCallout type="note">
        Use this when you&apos;re moving the booth between cloud
        accounts, when you&apos;re decommissioning a booth, or when
        support tells you to as part of a recovery procedure.
      </DocsCallout>

      <h2 id="cloud-features">Cloud Features card</h2>

      <p>A grid of six tiles showing the features that unlock when you connect to the cloud:</p>

      <ul>
        <li><strong>Remote Analytics</strong>. View booth stats from the cloud dashboard</li>
        <li><strong>Notifications</strong>. Get alerts on your phone when the booth needs attention</li>
        <li><strong>Template Sync</strong>. Push templates to the booth remotely</li>
        <li><strong>Sales Reports</strong>. Financial summaries in the cloud</li>
        <li><strong>Photo Backup</strong>. Cloud photo storage</li>
        <li><strong>Remote Config</strong>. Update settings remotely</li>
      </ul>

      <p>
        This card is informational. It tells you what&apos;s possible.
        Whether each feature actually does something for you depends
        on whether you&apos;ve set it up in the cloud dashboard.
      </p>

      <DocsScreenshot
        src="cloud-sync-features-grid.png"
        alt="Cloud Features 3x2 grid with six feature tiles."
      />

      <h2 id="sync-status">Sync Status card</h2>

      <p>In the right column. Subtitle: &quot;Queue and sync info&quot;.</p>

      <p>Shows:</p>

      <ul>
        <li>A <strong>Sync icon</strong> at the top</li>
        <li>The <strong>pending items</strong> count. How many transactions or events are queued waiting to sync</li>
        <li>The <strong>last sync time</strong>. Timestamp of the most recent successful sync</li>
        <li>The <strong>total items synced</strong>. Running lifetime count</li>
        <li>(Possibly) a <strong>Sync Now</strong> button to force an immediate sync</li>
      </ul>

      <p>Use this card to confirm the cloud sync is healthy:</p>

      <ul>
        <li><strong>Pending items: 0</strong> and a recent <strong>Last sync</strong> time = healthy</li>
        <li><strong>Pending items growing</strong> with no recent sync = something is wrong</li>
      </ul>

      <DocsScreenshot
        src="cloud-sync-status-card.png"
        alt="Sync Status card with pending items count, last sync time, and total synced count."
      />

      <h2 id="verify">Verify it worked</h2>

      <p>You can use the Cloud Sync tab effectively when you can:</p>

      <ul>
        <li>Register a booth using a 6-character Quick Registration code</li>
        <li>Read the status badge and tell whether the booth is connected</li>
        <li>Read the Sync Status card and tell whether sync is keeping up</li>
        <li>Find the Unregister Booth button when you need it</li>
        <li>(Rarely) use Manual Registration as a fallback</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Status badge stays &quot;Not Registered&quot; after entering a code.</strong></p>
      <p>Code expired, was wrong, or already used. Generate a fresh code in the cloud dashboard.</p>

      <p><strong>Status badge says &quot;Connected&quot; but pending items are growing.</strong></p>
      <p>Network is up but the cloud API is rejecting items. Check the cloud dashboard for billing or rate-limit issues.</p>

      <p><strong>Last sync is old.</strong></p>
      <p>Recent network outage; sync will catch up. Wait a few minutes; if it doesn&apos;t catch up, run <strong>Test Connection</strong> in Manual Registration.</p>

      <p><strong>Quick Registration helper text says &quot;Enter a 6-character code...&quot; but I entered one.</strong></p>
      <p>The field validation is per-character. Make sure it&apos;s exactly 6 characters. Re-enter the code carefully.</p>

      <p><strong>Booth is registered but I can&apos;t see it in the cloud dashboard.</strong></p>
      <p>The cloud dashboard may need a refresh. Refresh your browser; if still missing, the registration didn&apos;t actually succeed.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/wifi-tab">WiFi tab</Link>
          . The other half of &quot;getting connected&quot;: wireless network management.
        </li>
        <li>
          <Link href="/docs/connecting-your-kiosk/cloud-registration">
            Connecting Your Kiosk › Cloud registration
          </Link>
          . A task-oriented walkthrough.
        </li>
        <li><strong>Cloud and Fleet › What cloud sync does</strong> <em>(coming soon)</em>. A deeper explanation of what flows up and down.</li>
      </ul>
    </DocsLayout>
  );
}
