import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Remote commands from the cloud — BoothIQ Docs",
  description:
    "What cloud admins can do to a booth remotely: add credits, restart, download logs, push templates.",
};

const HREF = "/docs/cloud-and-fleet/remote-commands";

const TOC = [
  { id: "how-it-works", label: "How remote commands work" },
  { id: "commands", label: "Commands you can issue" },
  { id: "cannot-issue", label: "Commands you cannot issue" },
  { id: "audit", label: "Remote command audit trail" },
  { id: "offline", label: "When the booth is offline" },
  { id: "patterns", label: "Common patterns" },
  { id: "verify", label: "Verify a command worked" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function RemoteCommandsPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Remote commands from the cloud</h1>

      <p>
        When a BoothIQ kiosk is registered to the cloud, cloud-side
        users (you, support, or other admins on your account) can
        issue <strong>remote commands</strong> to the booth. The booth
        executes the command and reports the result back. This article
        tells you what commands exist and what each one does.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators using the BoothIQ
        cloud dashboard, or operators who want to know what their
        support team can do to the booth remotely.
      </p>

      <h2 id="how-it-works">How remote commands work</h2>

      <ol>
        <li>A cloud-side user opens the cloud dashboard from a separate device (laptop, phone, tablet).</li>
        <li>They navigate to the booth and find the relevant action.</li>
        <li>They issue the command.</li>
        <li>The cloud sends the command to the booth via the <strong>WebSocket</strong> connection (or HTTP polling fallback).</li>
        <li>The booth receives the command, validates it, and executes.</li>
        <li>The booth reports the result back to the cloud.</li>
        <li>The cloud dashboard shows the command status.</li>
      </ol>

      <p>Most commands take effect within seconds.</p>

      <h2 id="commands">Commands you can issue</h2>

      <h3><code>add_credits</code></h3>
      <p><strong>What it does:</strong> Adds credits to the booth&apos;s credit balance.</p>
      <p><strong>When to use:</strong> Comping a customer remotely, seeding a free-play event, or refunding a session that failed remotely.</p>
      <p><strong>On the booth:</strong> A new credit transaction appears in the Credits tab with <strong>source = Cloud</strong>. The current balance updates immediately.</p>
      <p>
        <strong>Operator-side equivalent:</strong> You can also add
        credits manually in the Credits tab on the kiosk itself. See{" "}
        <Link href="/docs/running-your-booth/adding-credits-manually">
          Adding credits manually
        </Link>
        .
      </p>

      <DocsCallout type="note">
        <strong>Use case:</strong> A customer calls you saying their
        print failed. You&apos;re not at the venue. From your phone,
        you push 5 credits to the booth using <code>add_credits</code>.
        The customer goes back, runs another session, and gets their
        print. You didn&apos;t have to drive to the venue.
      </DocsCallout>

      <h3><code>restart</code></h3>
      <p><strong>What it does:</strong> Reboots the kiosk.</p>
      <p><strong>When to use:</strong> The booth is showing strange behavior and you want to reboot it from outside without sending someone to the venue.</p>
      <p><strong>On the booth:</strong> The booth shows a brief restart message, then reboots. BoothIQ comes back up automatically. Total downtime is about 60-90 seconds.</p>
      <p><strong>Be careful:</strong> This kicks off any active customer sessions. Time it carefully. Don&apos;t issue a restart during peak hours.</p>

      <h3><code>cancel_restart</code></h3>
      <p><strong>What it does:</strong> Cancels a previously-issued restart command if it hasn&apos;t started yet.</p>
      <p><strong>When to use:</strong> You issued a restart by accident, or the situation changed and you no longer want to restart.</p>
      <p><strong>On the booth:</strong> Nothing visible. The pending restart is removed from the queue.</p>

      <h3><code>download_logs</code></h3>
      <p><strong>What it does:</strong> Tells the booth to gather its current log files and upload them to the cloud.</p>
      <p><strong>When to use:</strong> Support needs to look at booth logs to diagnose an issue.</p>
      <p><strong>On the booth:</strong> The booth packages its logs (Application, Hardware, Transaction, Error, Performance) and uploads them to your cloud account&apos;s storage. No customer-visible behavior.</p>
      <p><strong>Then:</strong> You or support download the logs from the cloud dashboard and inspect them.</p>

      <h3>Template / category / layout sync</h3>
      <p><strong>What it does:</strong> Pushes templates, categories, and layouts from the cloud library down to the booth.</p>
      <p><strong>When to use:</strong> You uploaded a new template to your cloud library and want it on the booth right now without waiting for the next scheduled sync.</p>
      <p><strong>On the booth:</strong> Templates Tab refreshes. New templates appear in the customer-facing carousel for new sessions.</p>

      <h2 id="cannot-issue">Commands you cannot issue</h2>

      <p>For safety, BoothIQ does NOT support remote commands that would:</p>

      <ul>
        <li><strong>Modify the customer experience UI live</strong> (e.g. show a custom message to a current customer)</li>
        <li><strong>Drain the cash box remotely</strong></li>
        <li><strong>Disable hardware</strong> (the watchdog handles that automatically when needed)</li>
        <li><strong>Read camera frames live</strong> (no remote view of what the camera sees)</li>
        <li><strong>Reach into Windows or the file system</strong> (the booth is locked down)</li>
      </ul>

      <p>The remote command surface is intentionally narrow.</p>

      <h2 id="audit">Remote command audit trail</h2>

      <p>Every remote command issued to a booth is recorded in the booth&apos;s local audit logs and (because logs sync) in the cloud. So you can answer &quot;who issued the restart command at 3 AM&quot; by looking at the audit trail.</p>

      <h2 id="offline">When the booth is offline</h2>

      <p>If the booth is offline when a command is issued:</p>

      <ul>
        <li>For <strong>time-sensitive</strong> commands (restart, cancel_restart), the cloud queues them for a short while. If the booth doesn&apos;t reconnect, the command times out and is discarded.</li>
        <li>For <strong>add_credits</strong>, the command is queued and delivered the moment the booth reconnects. The credits appear in the booth&apos;s Credits tab as soon as it&apos;s online.</li>
        <li>For <strong>download_logs</strong>, the request waits for the booth to come back, then runs.</li>
      </ul>

      <p>You can see the status of pending commands in the cloud dashboard.</p>

      <h2 id="patterns">Common patterns</h2>

      <h3>Daily fleet check from your phone</h3>
      <ol>
        <li>Open the cloud dashboard on your phone.</li>
        <li>Look at the <strong>Online status</strong> of every booth.</li>
        <li>For any offline booths, contact the venue or send someone.</li>
        <li>Skim today&apos;s sales numbers.</li>
      </ol>

      <h3>Comping a customer from anywhere</h3>
      <ol>
        <li>Customer calls you about a failed print.</li>
        <li>Open the cloud dashboard.</li>
        <li>Find the booth.</li>
        <li>Issue <code>add_credits</code> for one session.</li>
        <li>Customer redeems on the kiosk.</li>
        <li>Done. No need to drive to the venue.</li>
      </ol>

      <h3>Pushing a new template to all booths</h3>
      <ol>
        <li>Upload the new template to your cloud library.</li>
        <li>Trigger a template sync on each booth (or wait for the automatic sync).</li>
        <li>Confirm the template appears in each booth&apos;s Templates tab.</li>
        <li>Done.</li>
      </ol>

      <h3>Diagnosing a sick booth from your office</h3>
      <ol>
        <li>Booth is misbehaving.</li>
        <li>Issue <code>download_logs</code> from the cloud dashboard.</li>
        <li>Wait a minute or two.</li>
        <li>Download the logs from the cloud.</li>
        <li>Send them to support, or read them yourself.</li>
      </ol>

      <h2 id="verify">Verify a command worked</h2>

      <p>After issuing a command from the cloud dashboard, check the result:</p>

      <ul>
        <li><code>add_credits</code>. Check the Credits tab on the kiosk; balance should reflect the addition</li>
        <li><code>restart</code>. The booth should be unreachable for 30-60 seconds, then come back online</li>
        <li><code>download_logs</code>. Logs appear in the cloud dashboard&apos;s logs section</li>
        <li>Template sync. New templates appear in the kiosk&apos;s Templates tab</li>
      </ul>

      <p>If a command has been &quot;pending&quot; for several minutes without completing, the booth may be offline or the WebSocket connection may have dropped. See <strong>Cloud sync not working</strong> <em>(coming soon)</em>.</p>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>Can I issue commands from the kiosk itself?</strong></p>
      <p>No. You&apos;d just do those operations directly in admin (e.g. add credits in the Credits tab). Remote commands are for when you&apos;re not at the kiosk.</p>

      <p><strong>Can I queue commands for offline booths?</strong></p>
      <p>Some commands (<code>add_credits</code>) queue automatically. Others (<code>restart</code>) don&apos;t queue indefinitely.</p>

      <p><strong>Who can issue commands?</strong></p>
      <p>Anyone with access to your cloud dashboard account at the appropriate permission level. Configure cloud-side roles carefully.</p>

      <p><strong>Can a customer issue a command?</strong></p>
      <p>No. Customers don&apos;t have cloud accounts.</p>

      <p><strong>Are remote commands secure?</strong></p>
      <p>They go over HTTPS (encrypted in transit), require authentication on the cloud side, and the booth validates the command&apos;s signature before executing. Operators don&apos;t manage this. It&apos;s built in.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/cloud-and-fleet/what-cloud-sync-does">What cloud sync does</Link>
          . The bigger picture.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/working-offline">Working offline</Link>
          . When commands can&apos;t be delivered.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link>
          . Where the booth shows its connection status.
        </li>
      </ul>
    </DocsLayout>
  );
}
