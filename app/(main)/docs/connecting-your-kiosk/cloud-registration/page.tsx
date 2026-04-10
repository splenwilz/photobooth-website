import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Cloud registration — BoothIQ Docs",
  description:
    "Link your BoothIQ kiosk to your cloud account using a 6-character registration code.",
};

const HREF = "/docs/connecting-your-kiosk/cloud-registration";

const TOC = [
  { id: "before-you-start", label: "Before you start" },
  { id: "open-the-cloud-sync-tab", label: "Open the Cloud Sync tab" },
  { id: "path-a", label: "Path A: Quick Registration" },
  { id: "path-b", label: "Path B: Manual Registration" },
  { id: "what-gets-unlocked", label: "What gets unlocked when you're registered" },
  { id: "verify-it-worked", label: "Verify it worked" },
  { id: "unregistering", label: "Unregistering a booth" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CloudRegistrationPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Cloud registration</h1>

      <p>
        Cloud registration is the step that links your physical kiosk
        to your BoothIQ cloud account. After registration, the booth
        pushes its sales, credit history, and heartbeats up to your
        cloud dashboard, and you can monitor it (and run remote
        commands on it) from any phone, tablet, or laptop with a
        browser.
      </p>

      <p>
        There are two ways to register: a{" "}
        <strong>6-character Quick Registration code</strong>{" "}
        (recommended) and a <strong>Manual Registration</strong> flow
        that takes Booth ID, API Key, and URL (for advanced users and
        recovery).
      </p>

      <p>
        <strong>Who this is for:</strong> Operators registering a
        brand-new kiosk to their cloud account, or re-registering after
        an unregister.
      </p>

      <h2 id="before-you-start">Before you start</h2>

      <ul>
        <li>
          The kiosk is connected to the internet (see{" "}
          <Link href="/docs/connecting-your-kiosk/connecting-to-wifi">
            Connecting to Wi-Fi
          </Link>{" "}
          if you haven&apos;t done that yet).
        </li>
        <li>You have a BoothIQ cloud account and access to it from a separate device (laptop, phone, or tablet with a browser).</li>
        <li>
          You can sign in to admin on the kiosk (see{" "}
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>
          ).
        </li>
      </ul>

      <h2 id="open-the-cloud-sync-tab">Open the Cloud Sync tab</h2>

      <ol>
        <li>From the welcome screen, 5-tap into admin.</li>
        <li>Sign in.</li>
        <li>In the sidebar, tap <strong>Cloud Sync</strong> (under the <strong>SYSTEM</strong> section).</li>
        <li>The page opens with the title <strong>Cloud Sync</strong> and the subtitle &quot;Connect your booth to the cloud for remote monitoring and data sync&quot;.</li>
        <li>At the top right you&apos;ll see a status badge. On a never-registered booth it will say <strong>Not Registered</strong> in an amber/yellow pill.</li>
      </ol>

      <DocsScreenshot
        src="cloud-sync-not-registered.png"
        alt="Cloud Sync tab in the Not Registered state with an amber badge."
      />

      <h2 id="path-a">Path A: Quick Registration (recommended)</h2>

      <p>
        This is the simpler path. You generate a 6-character code in the
        cloud dashboard, then type it into the kiosk.
      </p>

      <h3>Step 1: Generate a code from the cloud dashboard</h3>

      <p>On your laptop or phone (<strong>not</strong> the kiosk):</p>

      <ol>
        <li>Open your web browser and sign in to your BoothIQ cloud dashboard.</li>
        <li>Navigate to <strong>Booths</strong> (or the equivalent section).</li>
        <li>Either <strong>create a new booth</strong> for this kiosk OR open an <strong>existing booth</strong> entry that doesn&apos;t yet have a kiosk linked to it.</li>
        <li>Click <strong>Generate Registration Code</strong>.</li>
        <li>The dashboard displays a <strong>6-character code</strong> (uppercase letters and numbers). Keep this screen open. You&apos;ll have a limited time to use the code before it expires.</li>
      </ol>

      <h3>Step 2: Enter the code on the kiosk</h3>

      <p>Back on the kiosk, in the Cloud Sync tab:</p>

      <ol>
        <li>Find the <strong>Quick Registration</strong> card. If it&apos;s collapsed, tap its header to expand it.</li>
        <li>Tap the <strong>Registration Code</strong> input field. The on-screen virtual keyboard appears.</li>
        <li>Type the <strong>6-character code</strong> from the cloud dashboard. The field auto-uppercases letters.</li>
        <li>The helper text under the field reads &quot;Enter a 6-character code to enable registration&quot;. When you&apos;ve typed all 6 characters, the <strong>Register Booth</strong> button becomes active.</li>
        <li>Tap <strong>Register Booth</strong>.</li>
      </ol>

      <DocsScreenshot
        src="cloud-sync-quick-registration.png"
        alt="Quick Registration card with a 6-character code entered and the Register Booth button active."
      />

      <h3>Step 3: Wait for confirmation</h3>

      <p>The booth contacts the cloud, validates the code, and stores the credentials. After a few seconds:</p>

      <ul>
        <li>The status badge at the top of the page changes from <strong>Not Registered</strong> (amber) to <strong>Connected</strong> (green).</li>
        <li>The right-column <strong>Sync Status</strong> card starts showing live sync activity (queue size, last sync timestamp).</li>
        <li>The <strong>Quick Registration</strong> card may collapse or hide its inputs.</li>
      </ul>

      <p>
        If the badge stays amber and shows an error, see{" "}
        <strong>Troubleshooting › Cloud sync not working</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="path-b">Path B: Manual Registration (advanced)</h2>

      <p>
        Use this path only if Quick Registration fails or you&apos;ve
        been given Booth ID and API Key credentials directly by support.
      </p>

      <ol>
        <li>In the Cloud Sync tab, find the <strong>Manual Registration (Advanced)</strong> card (collapsed by default).</li>
        <li>Tap its header to expand it.</li>
        <li>
          Fill in the three fields:
          <ul>
            <li><strong>Cloud API URL</strong>: the BoothIQ cloud API endpoint. The field has a default value; change it only if your support contact tells you to.</li>
            <li><strong>Booth ID</strong>: the UUID-style identifier from your cloud dashboard.</li>
            <li><strong>API Key</strong>: the secret key. Use the eye icon next to the field to show/hide what you&apos;re typing.</li>
          </ul>
        </li>
        <li>Tap <strong>Test Connection</strong> (the secondary button) to verify the credentials work without committing them.</li>
        <li>If the test passes, tap <strong>Save &amp; Connect</strong> (the primary teal button) to store the credentials and register.</li>
        <li>The status badge updates to <strong>Connected</strong>.</li>
      </ol>

      <DocsScreenshot
        src="cloud-sync-manual-registration.png"
        alt="Manual Registration card expanded with Cloud API URL, Booth ID, and API Key fields visible."
      />

      <DocsCallout type="warning" title="The API Key is a secret">
        Treat it like a password. If it&apos;s compromised, regenerate
        it from the cloud dashboard and re-register the booth. The old
        key will be invalidated immediately.
      </DocsCallout>

      <h2 id="what-gets-unlocked">What gets unlocked when you&apos;re registered</h2>

      <p>
        The Cloud Sync tab includes a <strong>Cloud Features</strong>{" "}
        card showing six features that activate once your booth is
        connected:
      </p>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Remote Analytics</strong></td>
            <td>View booth stats from the cloud dashboard</td>
          </tr>
          <tr>
            <td><strong>Notifications</strong></td>
            <td>Get alerts on your phone when the booth needs attention</td>
          </tr>
          <tr>
            <td><strong>Template Sync</strong></td>
            <td>Push templates to the booth remotely</td>
          </tr>
          <tr>
            <td><strong>Sales Reports</strong></td>
            <td>Financial summaries in the cloud</td>
          </tr>
          <tr>
            <td><strong>Photo Backup</strong></td>
            <td>Optional cloud photo storage</td>
          </tr>
          <tr>
            <td><strong>Remote Config</strong></td>
            <td>Update settings remotely</td>
          </tr>
        </tbody>
      </table>

      <p>You don&apos;t have to use all six. They&apos;re available, but the booth runs fine using only the ones you care about.</p>

      <DocsScreenshot
        src="cloud-sync-features-grid.png"
        alt="Cloud Features card showing the 3x2 grid of available cloud capabilities."
      />

      <h2 id="verify-it-worked">Verify it worked</h2>

      <p>You&apos;re done when:</p>

      <ul>
        <li>The status badge at the top of Cloud Sync says <strong>Connected</strong> in green.</li>
        <li>The <strong>Sync Status</strong> card on the right shows recent sync activity.</li>
        <li>On the cloud dashboard (separate device), your booth appears in the booth list with an <strong>Online</strong> indicator.</li>
        <li>A few minutes later, the <strong>Last Sync</strong> timestamp on the kiosk updates to a recent time.</li>
      </ul>

      <h2 id="unregistering">Unregistering a booth</h2>

      <p>If you need to disconnect the booth from cloud sync (for example, selling the booth or moving it to a different account):</p>

      <ol>
        <li>Open the Cloud Sync tab.</li>
        <li>Find the red <strong>Unregister Booth</strong> button (only visible when registered).</li>
        <li>Tap it. Confirm the action.</li>
        <li>The booth clears its credentials, the status badge returns to <strong>Not Registered</strong>, and the booth stops talking to the cloud.</li>
      </ol>

      <p>
        Local data (sales, templates, settings, photos) is{" "}
        <strong>not</strong> deleted by an unregister. You can
        re-register at any time with a new code.
      </p>

      <h2 id="common-problems">Common problems</h2>

      <table>
        <thead>
          <tr>
            <th>Symptom</th>
            <th>Likely cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>&quot;Register Booth&quot; button stays disabled</td>
            <td>You haven&apos;t typed all 6 characters of the code yet</td>
            <td>Finish typing the code</td>
          </tr>
          <tr>
            <td>Code rejected as invalid</td>
            <td>Typo, expired code, or already-used code</td>
            <td>Generate a fresh code from the cloud dashboard</td>
          </tr>
          <tr>
            <td>Status badge stays amber after registering</td>
            <td>Network connectivity dropped, or cloud API is unreachable</td>
            <td>Check Wi-Fi and try <strong>Test Connection</strong> in the Manual Registration card</td>
          </tr>
          <tr>
            <td>&quot;API Key invalid&quot; error in Manual Registration</td>
            <td>The key was regenerated in the cloud dashboard since you copied it</td>
            <td>Get a fresh key from the cloud dashboard</td>
          </tr>
          <tr>
            <td>Booth registers but Sync Status shows nothing</td>
            <td>Sync is paused waiting for activity</td>
            <td>Take a test session. The resulting transaction will appear in Sync Status</td>
          </tr>
        </tbody>
      </table>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/connecting-your-kiosk/license-and-activation">
            License and activation
          </Link>
          . Confirm the booth&apos;s license is active.
        </li>
        <li>
          <Link href="/docs/connecting-your-kiosk/testing-your-connection">
            Testing your connection
          </Link>
          . End-to-end check that everything is talking.
        </li>
      </ul>
    </DocsLayout>
  );
}
