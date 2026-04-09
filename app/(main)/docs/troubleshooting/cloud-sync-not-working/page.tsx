import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Cloud sync not working — BoothIQ Docs",
  description:
    "The Cloud Sync tab says \"Not Registered\", sync is stuck, or transactions aren't appearing in the cloud dashboard.",
};

const HREF = "/docs/troubleshooting/cloud-sync-not-working";

const TOC = [
  { id: "quick-check", label: "Quick check first" },
  { id: "step-1", label: "Step 1: Confirm internet" },
  { id: "step-2", label: "Step 2: \"Not Registered\"" },
  { id: "step-3", label: "Step 3: Connected but pending grows" },
  { id: "step-4", label: "Step 4: Last Sync is old" },
  { id: "step-5", label: "Step 5: Pending growing without limit" },
  { id: "step-6", label: "Step 6: API key regenerated" },
  { id: "step-7", label: "Step 7: Booth moved between accounts" },
  { id: "step-8", label: "Step 8: When to call support" },
  { id: "without-sync", label: "Working without sync" },
  { id: "common", label: "Common causes" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CloudSyncNotWorkingPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Cloud sync not working</h1>

      <p>
        The booth is supposed to push transactions, heartbeats, and
        credit history to the BoothIQ cloud. When that pipeline breaks,
        you&apos;ll see it in the Cloud Sync tab. The status badge
        stays amber, the Sync Status card shows growing pending items,
        or the cloud dashboard never receives the booth&apos;s data.
      </p>

      <p><strong>Symptom:</strong> Cloud Sync status badge is &quot;Not Registered&quot; or stuck, pending items growing, no recent Last Sync timestamp.</p>

      <h2 id="quick-check">Quick check first</h2>

      <ol>
        <li>Open admin → <strong>Cloud Sync</strong> tab.</li>
        <li>Look at the status badge at the top right.</li>
        <li>Look at the <strong>Sync Status</strong> card on the right showing pending items and last sync time.</li>
      </ol>

      <ul>
        <li><strong>Connected (green)</strong> + 0 pending, recent Last Sync. Healthy. Nothing to do</li>
        <li><strong>Connected (green)</strong> + Growing, no recent sync. Booth thinks it&apos;s connected but cloud isn&apos;t accepting items</li>
        <li><strong>Not Registered (amber)</strong>. Booth has never been registered, or registration was cleared</li>
        <li><strong>Error (red)</strong>. Active connection error</li>
      </ul>

      <h2 id="step-1">Step 1: Confirm internet connectivity</h2>

      <p>Sync needs internet. Confirm the booth has it:</p>

      <ol>
        <li>Open the <strong>WiFi</strong> tab in admin.</li>
        <li>Check the <strong>Status</strong> card. Should say <strong>Connected</strong>.</li>
        <li>If you&apos;re on Ethernet, the WiFi tab will show &quot;Not connected&quot; but Ethernet will work. That&apos;s fine. The way to verify Ethernet is the next step.</li>
        <li>Open the Cloud Sync tab and look at Sync Status. If items are flowing, internet is fine. If they&apos;re not, see Step 2.</li>
      </ol>

      <p>
        If WiFi is disconnected, see{" "}
        <Link href="/docs/connecting-your-kiosk/connecting-to-wifi">
          Connecting to Wi-Fi
        </Link>
        .
      </p>

      <h2 id="step-2">Step 2: Booth says &quot;Not Registered&quot;</h2>

      <p>If the status badge is amber and the booth has never been registered (or registration was cleared):</p>

      <ol>
        <li>Generate a fresh <strong>6-character registration code</strong> from your cloud dashboard (on a separate device).</li>
        <li>Open the <strong>Quick Registration</strong> card.</li>
        <li>Type the code.</li>
        <li>Tap <strong>Register Booth</strong>.</li>
        <li>The badge should turn green within a few seconds.</li>
      </ol>

      <p>
        If registration fails repeatedly, see{" "}
        <Link href="/docs/connecting-your-kiosk/cloud-registration">
          Cloud registration
        </Link>{" "}
        for the full walkthrough.
      </p>

      <h2 id="step-3">Step 3: Booth says &quot;Connected&quot; but pending items keep growing</h2>

      <p>The booth thinks it&apos;s connected, but items aren&apos;t getting through:</p>

      <ol>
        <li>Open the <strong>Manual Registration (Advanced)</strong> card.</li>
        <li>Tap <strong>Test Connection</strong>.</li>
        <li>Read the result.</li>
      </ol>

      <ul>
        <li><strong>Test passed.</strong> Booth credentials work; cloud is accepting requests. The pending items will catch up. Wait a minute</li>
        <li><strong>Auth failed / 401.</strong> API key is wrong or has been revoked. Re-register with a fresh code</li>
        <li><strong>Network error.</strong> Internet is up but the cloud API is unreachable. Check the Cloud API URL field</li>
        <li><strong>Server error / 500.</strong> Cloud API is having problems on its end. Wait and try again</li>
      </ul>

      <h2 id="step-4">Step 4: Last Sync is old</h2>

      <p>If the Sync Status card&apos;s Last Sync timestamp is more than a few minutes old but the status badge says Connected:</p>

      <ol>
        <li>Some sync activity is event-driven (it pushes immediately when something changes), some is on a timer.</li>
        <li>Take a small action that triggers a sync. Run a free-play customer session, or add credits manually in the Credits tab.</li>
        <li>Watch the Last Sync timestamp update within a few seconds.</li>
      </ol>

      <p>If the timestamp doesn&apos;t update after triggering an event, the sync is broken. See Step 3.</p>

      <h2 id="step-5">Step 5: Pending items growing without limit</h2>

      <p>If pending items keep growing and never go down, the booth is generating events faster than it&apos;s syncing:</p>

      <ul>
        <li><strong>Most likely:</strong> sync is silently failing on some specific item (maybe a transaction with a malformed field). The booth retries but the cloud rejects it every time.</li>
        <li><strong>Less likely:</strong> the booth is generating an unusually high event rate and sync is slow.</li>
      </ul>

      <p>This is rare. If it happens, contact support with the <strong>Booth ID</strong> and the pending items count. They&apos;ll need to look at logs.</p>

      <h2 id="step-6">Step 6: API key was regenerated in the cloud</h2>

      <p>If you regenerated the API key in the cloud dashboard (e.g. for security reasons after a suspected compromise), the old key on the kiosk is now invalid. Re-register:</p>

      <ol>
        <li>Open the cloud dashboard, regenerate the key, and <strong>generate a fresh registration code</strong>.</li>
        <li>On the kiosk, <strong>Unregister</strong> the booth (red button on the Cloud Sync tab).</li>
        <li>Use the fresh code in Quick Registration.</li>
      </ol>

      <h2 id="step-7">Step 7: Booth was moved between cloud accounts</h2>

      <p>If you moved the booth from one BoothIQ cloud account to another:</p>

      <ol>
        <li><strong>Unregister</strong> the booth from the old account using the Unregister button.</li>
        <li>Get a fresh registration code from the <strong>new</strong> account.</li>
        <li>Re-register using Quick Registration.</li>
      </ol>

      <h2 id="step-8">Step 8: When to call support</h2>

      <p>Contact support if:</p>

      <ul>
        <li>Pending items grow continuously and never sync</li>
        <li>Test Connection fails with an error you can&apos;t decode</li>
        <li>The booth is registered in the cloud dashboard but appears as Offline despite being online and reachable</li>
        <li>Cloud-driven commands (e.g. add_credits from the cloud) aren&apos;t reaching the booth</li>
        <li>Sync was working and suddenly stopped without you changing anything</li>
      </ul>

      <p>Have the <strong>Booth ID</strong>, the <strong>Cloud Sync status</strong>, and a description of what you tried.</p>

      <h2 id="without-sync">Working without sync</h2>

      <p>The booth is <strong>offline-first</strong>. Sync isn&apos;t required for the customer experience. If sync is broken and you don&apos;t have time to fix it:</p>

      <ul>
        <li>Customers can still buy sessions and print photos</li>
        <li>Sales are recorded locally</li>
        <li>Credits work normally</li>
        <li>The only thing you lose is <strong>cloud monitoring</strong> and <strong>remote commands</strong></li>
      </ul>

      <p>When sync comes back, the booth will catch up the queued items automatically.</p>

      <h2 id="common">Common causes</h2>

      <p><strong>Booth never registered.</strong></p>
      <p>Run cloud registration.</p>

      <p><strong>Network drop.</strong></p>
      <p>Reconnect Wi-Fi or check Ethernet.</p>

      <p><strong>API key regenerated.</strong></p>
      <p>Re-register with a fresh code.</p>

      <p><strong>Booth moved between accounts.</strong></p>
      <p>Unregister and re-register.</p>

      <p><strong>Cloud API outage.</strong></p>
      <p>Wait and retry.</p>

      <p><strong>Bad data in pending queue.</strong></p>
      <p>Contact support.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>Sync is healthy when:</p>

      <ul>
        <li>Status badge is <strong>Connected</strong> (green)</li>
        <li>Pending items is <strong>0</strong> or close to it</li>
        <li><strong>Last Sync</strong> is recent (within the last minute)</li>
        <li>A test action (e.g. add credits in admin) immediately appears in the cloud dashboard</li>
        <li>The booth shows up as <strong>Online</strong> in the cloud dashboard</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link>
          . UI tour.
        </li>
        <li>
          <Link href="/docs/connecting-your-kiosk/cloud-registration">Cloud registration</Link>
          . Re-running the registration flow.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/working-offline">Working offline</Link>
          . What the booth does when sync is down.
        </li>
      </ul>
    </DocsLayout>
  );
}
