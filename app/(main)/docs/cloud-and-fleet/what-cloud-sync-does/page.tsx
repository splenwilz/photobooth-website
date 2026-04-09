import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "What cloud sync does — BoothIQ Docs",
  description:
    "A plain-English summary of what gets pushed to the cloud and what gets pulled down from it.",
};

const HREF = "/docs/cloud-and-fleet/what-cloud-sync-does";

const TOC = [
  { id: "two-directions", label: "The two directions" },
  { id: "how-sync-happens", label: "How sync happens" },
  { id: "what-not", label: "What sync does NOT do" },
  { id: "offline-first", label: "What \"offline-first\" really means" },
  { id: "sync-status", label: "The Sync Status card" },
  { id: "privacy", label: "Privacy considerations" },
  { id: "why-batched", label: "Why some things don't sync immediately" },
  { id: "when-to-use", label: "When to use cloud sync" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function WhatCloudSyncDoesPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>What cloud sync does</h1>

      <p>
        The BoothIQ cloud sync is the bidirectional pipeline between
        your kiosk and your cloud account. This article explains, in
        plain English, what flows in each direction and why.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to
        understand the value (and the limits) of cloud sync.
      </p>

      <h2 id="two-directions">The two directions</h2>

      <h3>Booth → Cloud (push)</h3>
      <p>Things the booth pushes up to the cloud:</p>
      <ul>
        <li><strong>Transactions.</strong> So your sales appear in the cloud dashboard for monitoring and reporting</li>
        <li><strong>Credit transactions.</strong> So you have an audit trail of every credit movement, viewable from anywhere</li>
        <li><strong>Heartbeats.</strong> So the cloud knows the booth is alive. These include current credit balance, mode, and status</li>
        <li><strong>Hardware status updates.</strong> So the cloud knows when a piece of hardware goes offline</li>
        <li><strong>Logs (on demand).</strong> When support pushes a log download command</li>
        <li><strong>Operational metrics.</strong> Print supply, uptime, error counts</li>
      </ul>

      <h3>Cloud → Booth (pull)</h3>
      <p>Things the booth pulls down from the cloud:</p>
      <ul>
        <li><strong>Templates.</strong> So you can manage your template library centrally and push to all booths</li>
        <li><strong>Categories.</strong> Same: central category management</li>
        <li><strong>Layouts.</strong> Same</li>
        <li><strong>Business settings.</strong> When &quot;Sync from cloud&quot; is enabled in Settings, your business name / logo / location come from the cloud</li>
        <li>
          <strong>Remote commands.</strong> See{" "}
          <Link href="/docs/cloud-and-fleet/remote-commands">Remote commands</Link>
        </li>
        <li><strong>License updates.</strong> License renewals and revocations</li>
        <li><strong>Master password requests.</strong> Cloud-issued emergency passwords</li>
      </ul>

      <h2 id="how-sync-happens">How sync happens</h2>

      <p>There are two transports:</p>

      <ol>
        <li><strong>WebSocket.</strong> For real-time push: a persistent connection over HTTPS so the cloud can deliver commands to the booth instantly without polling.</li>
        <li><strong>HTTP polling.</strong> Fallback: when the WebSocket isn&apos;t available, the booth polls the cloud every 30-60 seconds to check for commands.</li>
      </ol>

      <p>You don&apos;t pick which one to use. BoothIQ chooses automatically based on what&apos;s working. Both result in the same outcome.</p>

      <h2 id="what-not">What sync does NOT do</h2>

      <p>It&apos;s important to know what cloud sync <strong>doesn&apos;t</strong> do:</p>

      <ul>
        <li><strong>It does not back up your photos to the cloud</strong> by default. Customer photos stay on the kiosk unless you explicitly enable photo backup in your cloud configuration.</li>
        <li><strong>It does not stream live video</strong> from the kiosk camera to the cloud. There&apos;s no remote view of &quot;what the booth&apos;s camera sees right now.&quot;</li>
        <li><strong>It does not let cloud users take over the touchscreen</strong> from outside. The customer-facing UI is always controlled by whoever is physically at the booth.</li>
        <li><strong>It does not require a constant connection.</strong> The booth queues events when offline and catches up when it reconnects.</li>
        <li><strong>It does not slow down the customer experience.</strong> Sync happens in the background.</li>
      </ul>

      <h2 id="offline-first">What &quot;offline-first&quot; really means</h2>

      <p>BoothIQ is <strong>offline-first</strong>. The customer experience works completely without internet. Concretely:</p>

      <p><strong>With cloud sync:</strong></p>
      <ul>
        <li>Customer sessions work</li>
        <li>Sales recorded locally</li>
        <li>Sales visible in kiosk admin</li>
        <li>Sales visible in cloud dashboard</li>
        <li>Cloud admins can monitor remotely</li>
        <li>Templates auto-update</li>
        <li>License auto-renews</li>
      </ul>

      <p><strong>Without cloud sync:</strong></p>
      <ul>
        <li>Customer sessions work</li>
        <li>Sales recorded locally</li>
        <li>Sales visible in kiosk admin</li>
        <li>Not visible in cloud (until reconnect)</li>
        <li>Cloud admins cannot monitor</li>
        <li>Templates frozen at last sync</li>
        <li>License works until grace period ends</li>
      </ul>

      <p>
        If the internet goes down at your venue mid-event, the booth
        keeps running. Sales accumulate in the local database. When
        the internet comes back, the booth catches up by pushing all
        the queued events to the cloud, usually within a minute.
      </p>

      <h2 id="sync-status">The Sync Status card</h2>

      <p>In the <strong>Cloud Sync</strong> tab in admin, the right-column <strong>Sync Status</strong> card shows:</p>

      <ul>
        <li><strong>Pending items.</strong> How many events are queued waiting to sync (should be near zero on a healthy connection)</li>
        <li><strong>Last sync.</strong> Timestamp of the most recent successful sync</li>
        <li><strong>Total synced.</strong> Running lifetime count</li>
      </ul>

      <p>A healthy booth sees pending items hover near zero with frequent Last Sync updates. A booth with a broken sync sees pending items growing with no recent sync.</p>

      <h2 id="privacy">Privacy considerations</h2>

      <p>Cloud sync sends transaction data, hardware status, and (optionally) photos to the BoothIQ cloud. Things to know:</p>

      <ul>
        <li><strong>Customer photos are NOT synced by default.</strong> They stay on the kiosk.</li>
        <li><strong>Customer email addresses (if collected)</strong> ARE synced as part of transaction data.</li>
        <li><strong>Hardware fingerprints are truncated</strong> for privacy. The cloud doesn&apos;t get full hardware IDs.</li>
        <li><strong>Sales data IS synced.</strong> That&apos;s the point.</li>
      </ul>

      <p>For more on data and privacy, see <strong>Security › Data and privacy</strong> <em>(coming soon)</em>.</p>

      <h2 id="why-batched">Why some things don&apos;t sync immediately</h2>

      <p>Some events sync immediately (heartbeats, transactions). Some are batched (logs). The booth does this to:</p>

      <ul>
        <li>Avoid hammering the cloud with thousands of small requests</li>
        <li>Conserve bandwidth on metered connections</li>
        <li>Survive brief network outages without losing data</li>
      </ul>

      <p>If you take a customer session and don&apos;t see it in the cloud dashboard within a few seconds, give it a minute and try again. If it still isn&apos;t there after a few minutes, see <strong>Cloud sync not working</strong> <em>(coming soon)</em>.</p>

      <h2 id="when-to-use">When to use cloud sync</h2>

      <p>Connect to the cloud when:</p>

      <ul>
        <li>You have multiple booths and want centralized monitoring</li>
        <li>You want sales reports accessible from anywhere</li>
        <li>You want to push templates to all your booths from one place</li>
        <li>You want remote command capability (add credits, restart, download logs)</li>
        <li>You want license auto-renewal</li>
      </ul>

      <p>Don&apos;t connect to the cloud when:</p>

      <ul>
        <li>You have a single booth at a venue with no reliable internet (it&apos;ll work fine offline)</li>
        <li>Your venue&apos;s IT policy prohibits outbound connections to third-party APIs</li>
        <li>You&apos;re testing the booth in a development environment</li>
      </ul>

      <p>Most operators connect to the cloud. The benefits are significant and the privacy/security model is reasonable.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/cloud-and-fleet/working-offline">Working offline</Link>
          . What the booth does when sync is down.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/remote-commands">Remote commands</Link>
          . What cloud admins can do remotely.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link>
          . UI tour.
        </li>
      </ul>
    </DocsLayout>
  );
}
