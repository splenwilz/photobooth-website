import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Testing your connection — BoothIQ Docs",
  description:
    "A short end-to-end check to confirm Wi-Fi, cloud registration, and the license are all healthy.",
};

const HREF = "/docs/connecting-your-kiosk/testing-your-connection";

const TOC = [
  { id: "before-you-start", label: "Before you start" },
  { id: "step-1", label: "Step 1: Check the WiFi tab" },
  { id: "step-2", label: "Step 2: Check the Cloud Sync tab" },
  { id: "step-3", label: "Step 3: Check the License Status" },
  { id: "step-4", label: "Step 4: Verify in the cloud dashboard" },
  { id: "step-5", label: "Step 5: Round-trip test" },
  { id: "verify-it-worked", label: "Verify it worked" },
  { id: "if-something-fails", label: "What to do if any of these fail" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function TestingYourConnectionPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Testing your connection</h1>

      <p>
        After you&apos;ve connected the booth to Wi-Fi, registered it
        with the cloud, and confirmed the license is active, run this
        short end-to-end check to make sure all three pieces are
        actually talking to each other. It takes about two minutes.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators wrapping up the{" "}
        <strong>Connecting Your Kiosk</strong> section before they put
        the booth in front of customers.
      </p>

      <h2 id="before-you-start">Before you start</h2>

      <ul>
        <li>
          You completed{" "}
          <Link href="/docs/connecting-your-kiosk/connecting-to-wifi">
            Connecting to Wi-Fi
          </Link>{" "}
          (or you&apos;re using Ethernet).
        </li>
        <li>
          You completed{" "}
          <Link href="/docs/connecting-your-kiosk/cloud-registration">
            Cloud registration
          </Link>
          .
        </li>
        <li>
          You read{" "}
          <Link href="/docs/connecting-your-kiosk/license-and-activation">
            License and activation
          </Link>{" "}
          and the booth shows no license banner.
        </li>
      </ul>

      <h2 id="step-1">Step 1: Check the WiFi tab</h2>

      <ol>
        <li>Sign in to admin (5-tap on the credits indicator, then password).</li>
        <li>Open the <strong>WiFi</strong> tab.</li>
        <li>
          Confirm:
          <ul>
            <li><strong>WiFi Adapter</strong> card shows <strong>Active</strong></li>
            <li><strong>Current Network</strong> card shows your venue SSID</li>
            <li><strong>Status</strong> card shows <strong>Connected</strong></li>
          </ul>
        </li>
      </ol>

      <p>
        If you&apos;re on Ethernet, the WiFi tab will show &quot;Not
        connected&quot; for Current Network. That&apos;s expected. The
        booth uses Ethernet automatically when it&apos;s plugged in. To
        verify Ethernet is working, skip ahead to Step 2.
      </p>

      <h2 id="step-2">Step 2: Check the Cloud Sync tab</h2>

      <ol>
        <li>In the sidebar, tap <strong>Cloud Sync</strong>.</li>
        <li>Look at the status badge at the top right.</li>
        <li>It should say <strong>Connected</strong> in green.</li>
        <li>
          Look at the right-column <strong>Sync Status</strong> card.
          It should show:
          <ul>
            <li>A recent <strong>Last Sync</strong> timestamp</li>
            <li>A <strong>pending items</strong> count (often 0, meaning everything is up to date)</li>
            <li>A running total of items synced over the booth&apos;s lifetime</li>
          </ul>
        </li>
      </ol>

      <p>
        If the badge says <strong>Not Registered</strong> in amber,
        repeat{" "}
        <Link href="/docs/connecting-your-kiosk/cloud-registration">
          Cloud registration
        </Link>
        .
      </p>

      <p>
        If the badge says <strong>Connected</strong> but{" "}
        <strong>Last Sync</strong> is stale (more than a few minutes
        old), see <strong>Troubleshooting › Cloud sync not working</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <DocsScreenshot
        src="cloud-sync-connected-with-status.png"
        alt="Cloud Sync tab in the Connected state with a recent Last Sync timestamp visible."
      />

      <h2 id="step-3">Step 3: Check the License Status</h2>

      <ol>
        <li>In the sidebar, tap <strong>Settings</strong>.</li>
        <li>Look at the right-column <strong>License Status</strong> card.</li>
        <li>Confirm the license state is <strong>Active</strong> (not Trial, not Grace).</li>
        <li>Confirm there is <strong>no license banner</strong> at the top of the dashboard.</li>
      </ol>

      <p>
        If the license is in Trial or Grace state, that&apos;s fine for
        a smoke test but you should resolve it before relying on the
        booth in production. See{" "}
        <Link href="/docs/connecting-your-kiosk/license-and-activation">
          License and activation
        </Link>
        .
      </p>

      <h2 id="step-4">Step 4: Verify the booth appears in the cloud dashboard</h2>

      <p>This is the test that proves end-to-end connectivity, not just local state.</p>

      <ol>
        <li>On a <strong>separate device</strong> (your phone, laptop, or office PC), open a browser and sign in to your BoothIQ cloud dashboard.</li>
        <li>Navigate to your booth list.</li>
        <li>Find the kiosk you just registered.</li>
        <li>
          Confirm:
          <ul>
            <li>The booth appears with an <strong>Online</strong> or &quot;Connected&quot; indicator</li>
            <li>The <strong>last seen</strong> or <strong>last heartbeat</strong> timestamp is recent (within the last minute or two)</li>
            <li>If your dashboard shows a heartbeat history, it should show recent activity</li>
          </ul>
        </li>
      </ol>

      <p>
        If the booth doesn&apos;t appear at all, registration failed
        silently. Re-do{" "}
        <Link href="/docs/connecting-your-kiosk/cloud-registration">
          Cloud registration
        </Link>{" "}
        and watch the badge status more carefully.
      </p>

      <p>
        If the booth appears but is marked <strong>Offline</strong>, the
        booth hasn&apos;t sent a heartbeat recently. Check the WiFi tab
        for connectivity issues.
      </p>

      <h2 id="step-5">Step 5: Round-trip test (optional but recommended)</h2>

      <p>To prove that data really is flowing both ways, do a tiny round-trip:</p>

      <ol>
        <li>From your separate device, in the cloud dashboard, find a feature like <strong>Add Credits</strong> that pushes a command to the booth.</li>
        <li>Send a small credit add (1 dollar or equivalent).</li>
        <li>On the kiosk, open the <strong>Credits</strong> tab in admin.</li>
        <li>The credits should appear in the current balance within a few seconds, and the credit transaction history should show the new entry with a source like <strong>Cloud</strong> or <strong>Admin</strong>.</li>
      </ol>

      <p>If the credit shows up, the cloud-to-kiosk path is fully working.</p>

      <p>
        If it doesn&apos;t show up after a minute, the booth isn&apos;t
        receiving cloud commands. See{" "}
        <strong>Troubleshooting › Cloud sync not working</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <DocsCallout type="tip" title="Don't forget to remove the test credits">
        From the kiosk&apos;s Credits tab you can deduct the test
        amount, or just let the next real customer absorb them.
      </DocsCallout>

      <h2 id="verify-it-worked">Verify it worked</h2>

      <p>You&apos;re fully connected when:</p>

      <ul>
        <li><strong>WiFi tab</strong>: Active adapter, connected to your network (or you&apos;re on Ethernet)</li>
        <li><strong>Cloud Sync tab</strong>: Connected status badge, recent Last Sync time</li>
        <li><strong>Settings → License Status</strong>: Active state</li>
        <li><strong>No license banner</strong> at the top of the dashboard</li>
        <li>The booth shows up as <strong>Online</strong> in your cloud dashboard</li>
        <li>(Optional) A round-trip command from cloud to kiosk works</li>
      </ul>

      <h2 id="if-something-fails">What to do if any of these fail</h2>

      <table>
        <thead>
          <tr>
            <th>Step that failed</th>
            <th>Where to go</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>WiFi check</td>
            <td>
              <Link href="/docs/connecting-your-kiosk/connecting-to-wifi">
                Connecting to Wi-Fi
              </Link>{" "}
              common-problems table
            </td>
          </tr>
          <tr>
            <td>Cloud Sync badge</td>
            <td><strong>Troubleshooting › Cloud sync not working</strong> <em>(coming soon)</em></td>
          </tr>
          <tr>
            <td>License Status</td>
            <td>
              <Link href="/docs/connecting-your-kiosk/license-and-activation">
                License and activation
              </Link>
            </td>
          </tr>
          <tr>
            <td>Booth doesn&apos;t appear in cloud dashboard</td>
            <td>
              Re-do{" "}
              <Link href="/docs/connecting-your-kiosk/cloud-registration">
                Cloud registration
              </Link>{" "}
              and double-check the registration code wasn&apos;t expired
            </td>
          </tr>
          <tr>
            <td>Round-trip credit doesn&apos;t arrive</td>
            <td><strong>Troubleshooting › Cloud sync not working</strong> <em>(coming soon)</em></td>
          </tr>
        </tbody>
      </table>

      <h2 id="next-steps">Next steps</h2>

      <p>
        You&apos;ve completed <strong>Connecting Your Kiosk</strong>.
        From here you can:
      </p>

      <ul>
        <li><strong>Customer Experience</strong> <em>(coming soon)</em>. Understand what your customers will see.</li>
        <li><strong>Admin Dashboard</strong> <em>(coming soon)</em>. Tour every tab in the management UI.</li>
        <li><strong>Running Your Booth</strong> <em>(coming soon)</em>. Day-to-day operations.</li>
      </ul>
    </DocsLayout>
  );
}
