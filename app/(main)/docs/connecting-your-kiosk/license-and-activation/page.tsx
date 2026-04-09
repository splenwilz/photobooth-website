import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "License and activation — BoothIQ Docs",
  description:
    "Read the license status, understand trial and grace periods, and what to do if the booth shows a license banner.",
};

const HREF = "/docs/connecting-your-kiosk/license-and-activation";

const TOC = [
  { id: "where-to-find", label: "Where to find the license status" },
  { id: "possible-states", label: "Possible license states" },
  { id: "tied-to-hardware", label: "How licenses are tied to hardware" },
  { id: "online-vs-offline", label: "Online vs offline activation" },
  { id: "what-to-do", label: "What to do if the license banner appears" },
  { id: "verify-it-worked", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "what-this-doesnt-cover", label: "What this article does not cover" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function LicenseAndActivationPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>License and activation</h1>

      <p>
        Every BoothIQ kiosk has its own license tied to its hardware. In
        most cases the license is <strong>already activated</strong>{" "}
        when the kiosk arrives at your venue and you never need to
        think about it. This article tells you how to check the license
        status, what trial and grace-period banners mean, and what to
        do if you see one.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators verifying license
        status during initial setup, or after seeing a license banner
        appear on the admin dashboard.
      </p>

      <h2 id="where-to-find">Where to find the license status</h2>

      <h3>1. The license banner (top of the admin dashboard)</h3>

      <p>
        The admin dashboard has a <strong>License Banner</strong> strip
        just below the header bar. It only appears when the license is
        in a <strong>trial</strong> or <strong>grace-period</strong>{" "}
        state. For a normal active license, the banner is hidden and
        you&apos;ll see no message at all.
      </p>

      <p>If you see the banner, read it carefully. It will tell you:</p>

      <ul>
        <li>What state the license is in (trial, grace period, expiring soon)</li>
        <li>How many days are left</li>
        <li>What action you need to take (usually contact support or renew via the cloud dashboard)</li>
      </ul>

      <DocsScreenshot
        src="license-banner-trial.png"
        alt="License banner at the top of the admin dashboard showing a Trial state with days remaining."
      />

      <h3>2. The License Status card in the Settings tab</h3>

      <p>
        For the full picture, open <strong>Settings</strong> in the
        admin sidebar and look at the right-column{" "}
        <strong>License Status</strong> card. The header reads
        &quot;License Status&quot; with a subtitle &quot;Your license
        information&quot;.
      </p>

      <p>
        This card shows the detailed license state: the state name,
        expiration date, subscription tier, and any other metadata your
        license carries.
      </p>

      <DocsScreenshot
        src="settings-license-status-card.png"
        alt="License Status card in the Settings tab showing detailed license information."
      />

      <h2 id="possible-states">Possible license states</h2>

      <p>A BoothIQ license can be in any of these states:</p>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>What it means</th>
            <th>Operator action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Active</strong></td>
            <td>The license is valid and in good standing</td>
            <td>None. Banner is hidden</td>
          </tr>
          <tr>
            <td><strong>Trial</strong></td>
            <td>A time-limited evaluation license</td>
            <td>Plan to convert to a paid license before the trial ends. Contact your BoothIQ point of contact</td>
          </tr>
          <tr>
            <td><strong>Grace period</strong></td>
            <td>The license has expired but the booth is still allowed to run for a short window</td>
            <td>Renew the license immediately (cloud dashboard or support contact). The booth will stop accepting customers when the grace period ends</td>
          </tr>
          <tr>
            <td><strong>Expired</strong></td>
            <td>The license has fully lapsed</td>
            <td>The booth blocks new customer sessions until the license is renewed. Contact support</td>
          </tr>
          <tr>
            <td><strong>Revoked</strong></td>
            <td>The license has been administratively revoked from the cloud</td>
            <td>The booth stops accepting customers. Contact support</td>
          </tr>
        </tbody>
      </table>

      <p>The exact wording on the license banner depends on the state. Read it carefully when it appears.</p>

      <h2 id="tied-to-hardware">How licenses are tied to hardware</h2>

      <p>Each BoothIQ license is bound to the specific kiosk hardware it was issued for. This means:</p>

      <ul>
        <li>You <strong>cannot</strong> move a license from one kiosk to another by hand.</li>
        <li>The license uses a <strong>hardware fingerprint</strong> (a stable identifier derived from the kiosk&apos;s hardware) to detect if it&apos;s been moved to a different machine.</li>
        <li>If the kiosk hardware is replaced (for example, a motherboard swap by support), the license has to be <strong>re-issued</strong> for the new hardware.</li>
        <li>License operations (issuance, renewal, revocation) happen on the BoothIQ cloud, not on the kiosk.</li>
      </ul>

      <p>
        This is why you, as an operator, never enter a license key by
        hand on a kiosk. The license is delivered to the booth
        automatically when it&apos;s registered to your cloud account.
      </p>

      <h2 id="online-vs-offline">Online vs offline activation</h2>

      <p>BoothIQ licenses can be activated in two modes:</p>

      <p>
        <strong>Online activation (the default):</strong> When the
        booth is registered to your cloud account and connected to the
        internet, it pulls and verifies its license automatically. You
        don&apos;t do anything.
      </p>

      <p>
        <strong>Offline activation:</strong> For venues without
        internet at all, BoothIQ supports offline license files that
        operators install once. This is an unusual case. If your venue
        truly has no internet, contact your BoothIQ point of contact
        and they&apos;ll issue an offline license.
      </p>

      <p>
        A booth running on an offline license still has a{" "}
        <strong>grace period</strong> built in. If the license file
        expires and the booth has never been online to refresh it, the
        grace period buys you time to act.
      </p>

      <h2 id="what-to-do">What to do if the license banner appears</h2>

      <h3>If it says <strong>Trial</strong>:</h3>

      <ol>
        <li>Note how many days are left in the trial.</li>
        <li>Contact your BoothIQ point of contact to convert to a paid license.</li>
        <li>Once payment is processed, the new license is delivered to the booth automatically (you don&apos;t do anything on the kiosk).</li>
        <li>The trial banner disappears.</li>
      </ol>

      <h3>If it says <strong>Grace period</strong>:</h3>

      <ol>
        <li><strong>Act immediately.</strong> Grace periods are short.</li>
        <li>Open the cloud dashboard from a separate device and check the booth&apos;s billing status.</li>
        <li>If billing is fine and the grace period was triggered by a network outage, just wait. The next successful cloud sync will refresh the license and clear the banner.</li>
        <li>If billing is in arrears, resolve it through the cloud dashboard.</li>
        <li>If you can&apos;t figure out why the booth is in grace, contact support with the <strong>Booth ID</strong> (visible in the Cloud Sync tab).</li>
      </ol>

      <h3>If it says <strong>Expired</strong> or <strong>Revoked</strong>:</h3>

      <ol>
        <li>The booth is no longer accepting new customer sessions.</li>
        <li>Contact BoothIQ support immediately. Have your <strong>Booth ID</strong> ready.</li>
        <li>Don&apos;t power-cycle the kiosk hoping the message will go away. License enforcement persists across reboots.</li>
      </ol>

      <h2 id="verify-it-worked">Verify it worked</h2>

      <p>For a healthy, normal kiosk you should see:</p>

      <ul>
        <li><strong>No license banner</strong> at the top of the admin dashboard.</li>
        <li>The <strong>License Status</strong> card in Settings showing an <strong>Active</strong> state.</li>
        <li>The booth accepts customer sessions normally.</li>
      </ul>

      <p>If any of those is wrong, work the table above.</p>

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
            <td>License banner appears after a long offline period</td>
            <td>The booth couldn&apos;t refresh its license from the cloud</td>
            <td>Connect the booth to the internet. The next sync will refresh it</td>
          </tr>
          <tr>
            <td>License Status card shows &quot;Loading...&quot; indefinitely</td>
            <td>The license service hasn&apos;t initialized yet</td>
            <td>Wait 30 seconds and check again. If it persists, restart the kiosk</td>
          </tr>
          <tr>
            <td>Booth was working yesterday, now refuses sessions with a license error</td>
            <td>License silently expired and the grace period elapsed</td>
            <td>Re-register or renew via the cloud dashboard, then contact support if it doesn&apos;t clear</td>
          </tr>
        </tbody>
      </table>

      <h2 id="what-this-doesnt-cover">What this article does <strong>not</strong> cover</h2>

      <ul>
        <li><strong>License key formats and the cryptography behind activation</strong> (see the developer documentation in the BoothIQ source repo).</li>
        <li><strong>Per-tier feature flags</strong> (see the developer documentation in the BoothIQ source repo).</li>
        <li><strong>How to issue licenses from the cloud admin side</strong>. That&apos;s done in the cloud dashboard, not on the kiosk.</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/connecting-your-kiosk/testing-your-connection">
            Testing your connection
          </Link>
          . Run an end-to-end test now that everything is connected and licensed.
        </li>
        <li>
          <strong>Cloud and Fleet › What cloud sync does</strong>{" "}
          <em>(coming soon)</em>. Understand what the booth pushes and pulls from the cloud.
        </li>
      </ul>
    </DocsLayout>
  );
}
