import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Working offline — BoothIQ Docs",
  description:
    "How BoothIQ behaves when the internet goes down, and how the queue catches up when it comes back.",
};

const HREF = "/docs/cloud-and-fleet/working-offline";

const TOC = [
  { id: "short-version", label: "The short version" },
  { id: "works-offline", label: "What works completely offline" },
  { id: "doesnt-work-offline", label: "What doesn't work offline" },
  { id: "queued", label: "What gets queued" },
  { id: "how-long", label: "How long can a booth stay offline?" },
  { id: "watching-queue", label: "Watching the queue" },
  { id: "manual-catchup", label: "Manual catch-up" },
  { id: "testing", label: "Testing offline mode" },
  { id: "common-questions", label: "Common questions" },
  { id: "verify", label: "Verify offline behavior" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function WorkingOfflinePage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Working offline</h1>

      <p>
        BoothIQ is <strong>offline-first</strong>. The customer
        experience does not depend on internet connectivity. This
        article explains exactly what happens when the booth loses its
        internet connection and what to expect when it comes back.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators with intermittent
        connectivity, or anyone who wants to understand the offline
        behavior.
      </p>

      <h2 id="short-version">The short version</h2>

      <p>When the internet is down:</p>

      <ul>
        <li>Customers can still buy sessions and print photos</li>
        <li>Sales are recorded in the local database</li>
        <li>Credits work normally</li>
        <li>The Cloud Sync tab will eventually show stale &quot;Last Sync&quot; times</li>
        <li>The Sync Status pending items count will grow</li>
      </ul>

      <p>When the internet comes back:</p>

      <ul>
        <li>The booth automatically resumes sync</li>
        <li>Queued items push to the cloud over the next minute or two</li>
        <li>The status badge stays green (or returns to green if it was Connected before)</li>
      </ul>

      <p>You don&apos;t have to do anything in either direction.</p>

      <h2 id="works-offline">What works completely offline</h2>

      <ul>
        <li>Welcome screen</li>
        <li>Product selection</li>
        <li>Template selection</li>
        <li>Camera capture</li>
        <li>Photo editing</li>
        <li>Extra prints / cross-sell</li>
        <li>Payment (Coin Operated)</li>
        <li>Payment (Free Play)</li>
        <li>Printing</li>
        <li>Phone Print (uses local hotspot, not internet)</li>
        <li>Sales recording (local)</li>
        <li>Credit balance</li>
        <li>Admin dashboard</li>
        <li>Diagnostics</li>
        <li>WiFi tab (the tab itself, even if not connected)</li>
      </ul>

      <h2 id="doesnt-work-offline">What doesn&apos;t work offline</h2>

      <ul>
        <li><strong>Cloud Sync (push).</strong> Items queue locally</li>
        <li><strong>Cloud-pushed templates.</strong> Uses cached templates</li>
        <li><strong>Remote commands</strong> (add_credits, restart, etc.)</li>
        <li><strong>License renewal.</strong> License must have been valid before going offline</li>
        <li><strong>Sales appearing in the cloud dashboard.</strong> They appear when sync resumes</li>
        <li><strong>Software updates.</strong> Updates require connectivity</li>
      </ul>

      <h2 id="queued">What gets queued</h2>

      <p>While offline, the booth keeps a local queue of things to sync when it reconnects:</p>

      <ul>
        <li>Every transaction</li>
        <li>Every credit transaction</li>
        <li>Periodic heartbeats (the booth still tries to send them, but they fail and are dropped. Heartbeats are time-sensitive and not worth re-sending after the fact)</li>
        <li>Hardware status changes</li>
        <li>Log entries</li>
      </ul>

      <p>The queue is durable. It survives power cycles. So a booth that goes offline at 8 PM, runs sessions until midnight, and gets shut down for the night will start syncing the queued items the next morning when it reconnects.</p>

      <h2 id="how-long">How long can a booth stay offline?</h2>

      <p>Functionally: <strong>indefinitely</strong>. The local database has plenty of space and the booth is designed for it.</p>

      <p>But there are two practical limits:</p>

      <h3>1. License grace period</h3>
      <p>
        If the booth is registered and the license relies on periodic
        cloud renewal, an extended offline period eventually triggers
        a <strong>grace period</strong> state and (if the grace
        period elapses) the booth stops accepting customers. The
        grace period length depends on your license tier (typically
        days to weeks).
      </p>

      <p>If you&apos;re going to be offline for an extended period, contact your BoothIQ point of contact to extend the grace period for your booth in advance.</p>

      <h3>2. Cloud-side staleness</h3>
      <p>
        After days or weeks of no sync, the cloud dashboard will show
        your booth as stale or potentially decommissioned. Cloud
        admins may flag it. If you know in advance, tell support so
        they don&apos;t think the booth is dead.
      </p>

      <h2 id="watching-queue">Watching the queue</h2>

      <p>The pending items count in the Cloud Sync tab&apos;s <strong>Sync Status</strong> card is your queue indicator:</p>

      <ul>
        <li><strong>0.</strong> Nothing waiting to sync</li>
        <li><strong>Small number</strong> (1-20). Recent activity, will catch up next sync</li>
        <li><strong>Large number</strong> (hundreds). Sync has been broken for a while</li>
        <li><strong>Growing.</strong> Sync isn&apos;t working at all</li>
      </ul>

      <p>If the queue is large and growing, see <strong>Cloud sync not working</strong> <em>(coming soon)</em>.</p>

      <h2 id="manual-catchup">Manual catch-up</h2>

      <p>When the internet comes back, the booth usually catches up automatically within 1-2 minutes. If it doesn&apos;t and you want to force it:</p>

      <ol>
        <li>Open admin → <strong>Cloud Sync</strong> tab.</li>
        <li>Confirm the <strong>status badge</strong> is <strong>Connected</strong> (green).</li>
        <li>Wait. The pending items count should drop to zero on its own.</li>
        <li>If it doesn&apos;t, try the <strong>Test Connection</strong> button in the Manual Registration card.</li>
        <li>If that succeeds, the next event will trigger a sync.</li>
      </ol>

      <h2 id="testing">Testing offline mode</h2>

      <p>If you want to test how the booth behaves offline (e.g. to make sure your venue&apos;s intermittent connectivity won&apos;t cause problems):</p>

      <ol>
        <li>Disconnect the booth from Wi-Fi (open the WiFi tab and tap <strong>Disconnect</strong>).</li>
        <li>Or unplug the Ethernet cable.</li>
        <li>Run a few customer sessions in Free Play mode.</li>
        <li>Open the Sales tab. Your sessions should be recorded.</li>
        <li>Open Cloud Sync. You should see the Last Sync time getting older and pending items growing.</li>
        <li>Reconnect Wi-Fi (or plug Ethernet back in).</li>
        <li>Watch the pending items count drop to zero.</li>
        <li>Open the cloud dashboard (separate device) and confirm the offline transactions appear.</li>
      </ol>

      <p>This is also a useful exercise for new operators. It builds confidence that &quot;the booth still works if the venue&apos;s Wi-Fi goes down.&quot;</p>

      <h2 id="common-questions">Common questions</h2>

      <p><strong>A customer paid offline. Did the cloud charge them?</strong></p>
      <p>No. The booth handles all payment locally. The cloud only learns about the transaction after sync resumes. And the cloud doesn&apos;t double-charge. Cash payments are recorded once.</p>

      <p><strong>Will the booth lose data if it loses power while offline?</strong></p>
      <p>No. The local database is durable. Power-cycling does not lose any sales or queue items.</p>

      <p><strong>Can I run a multi-day event with no internet at all?</strong></p>
      <p>Yes, if your license is configured for it. Tell your BoothIQ contact in advance so they can extend the grace period if needed.</p>

      <p><strong>Will the cloud think my booth is broken if it&apos;s been offline for a week?</strong></p>
      <p>The cloud dashboard will flag it as stale, but it won&apos;t take action unless your fleet management policy says so. Tell support in advance for long offline periods.</p>

      <h2 id="verify">Verify offline behavior</h2>

      <p>You&apos;re confident in the booth&apos;s offline behavior when:</p>

      <ul>
        <li>The customer experience continues to work after a Wi-Fi disconnect</li>
        <li>Sales appear in the local Sales tab even with no internet</li>
        <li>The pending items count grows during offline use</li>
        <li>Pending items drops to zero when sync resumes</li>
        <li>All offline transactions appear in the cloud dashboard after reconnect</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li><strong>Cloud sync not working</strong> <em>(coming soon)</em>. When sync doesn&apos;t recover.</li>
        <li>
          <Link href="/docs/connecting-your-kiosk/license-and-activation">
            License and activation
          </Link>
          . Understanding the grace period.
        </li>
      </ul>
    </DocsLayout>
  );
}
