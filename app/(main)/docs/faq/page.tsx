import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — BoothIQ Docs",
  description: "Common questions from BoothIQ operators and installers.",
};

const HREF = "/docs/faq";

const TOC = [
  { id: "general", label: "General" },
  { id: "customers", label: "Customers" },
  { id: "admin-and-access", label: "Admin and access" },
  { id: "printing-and-media", label: "Printing and media" },
  { id: "cloud-and-fleet", label: "Cloud and fleet" },
  { id: "hardware", label: "Hardware" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "anything-else", label: "Anything else?" },
] as const;

export default function FAQPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Frequently Asked Questions</h1>

      <h2 id="general">General</h2>

      <h3>Do I need internet for the booth to work?</h3>
      <p>
        No. BoothIQ is offline-first. The customer experience (capture,
        edit, pay, print) works completely without internet. You only
        need internet for cloud sync, remote monitoring, template
        downloads from the cloud library, and license renewal. See{" "}
        <Link href="/docs/cloud-and-fleet/working-offline">
          Cloud and Fleet › Working offline
        </Link>
        .
      </p>

      <h3>Can I install BoothIQ on my own PC?</h3>
      <p>No. BoothIQ is sold as a complete pre-built kiosk. The software is locked to the hardware it ships on. You don&apos;t run an installer.</p>

      <h3>Can the booth run without a payment device?</h3>
      <p>
        Yes. Switch the operation mode to <strong>Free Play</strong>{" "}
        in the Settings tab and customers won&apos;t be asked to pay.
        See{" "}
        <Link href="/docs/running-your-booth/operation-modes">
          Running Your Booth › Operation modes
        </Link>
        .
      </p>

      <h3>What size prints does it produce?</h3>
      <p>Two sizes from a single DNP DS-RX1hs printer:</p>
      <ul>
        <li><strong>Photo strips.</strong> 2×6 inches, usually with multiple photos per strip</li>
        <li><strong>4×6 prints.</strong> Single 4×6 photos</li>
      </ul>
      <p>A standard DNP roll yields about <strong>700</strong> 4×6 prints or <strong>1400</strong> strips.</p>

      <h2 id="customers">Customers</h2>

      <h3>A customer says the booth &quot;ate&quot; their money</h3>
      <p>
        Open the admin dashboard, go to the <strong>Credits</strong>{" "}
        tab, and look at the current balance and the most recent
        credit transactions. If the customer&apos;s coins or bills
        registered, the credits will be in the balance and you can
        either let them complete a session or refund them in cash. If
        the credits <strong>didn&apos;t</strong> register, the payment
        device is the problem. See{" "}
        <Link href="/docs/troubleshooting/payment-not-registering">
          Troubleshooting › Payment not registering
        </Link>
        .
      </p>

      <h3>A customer&apos;s print came out blurry / wrong colors / off-center</h3>
      <ul>
        <li><strong>Blurry:</strong> the customer moved during the countdown. Offer a retake.</li>
        <li>
          <strong>Wrong colors:</strong> the dye-sub ribbon may need
          reseating, or the media is defective. See{" "}
          <Link href="/docs/troubleshooting/printer-issues">
            Troubleshooting › Printer issues
          </Link>
          .
        </li>
        <li><strong>Off-center:</strong> the template they picked uses an unusual layout. Try a different template; if the problem repeats on every template, contact support.</li>
      </ul>

      <h3>A customer wants extra prints after the booth is back to the welcome screen</h3>
      <p>
        Once a session ends, the booth has no memory of which customer
        just used it. They have to start a new session. The cross-sell
        screen during a session is the operator&apos;s tool for
        capturing extra-print revenue. Make sure it&apos;s enabled in
        the <strong>Products</strong> tab.
      </p>

      <h3>Can customers email themselves their photos?</h3>
      <p>The kiosk has a <strong>Phone Print</strong> feature where customers upload photos <em>from</em> their phone <em>to</em> the kiosk for printing. The reverse direction (emailing photos to customers) is <strong>not</strong> a built-in feature in the version of BoothIQ described in these docs. Confirm with your BoothIQ contact whether this is on the roadmap.</p>

      <h2 id="admin-and-access">Admin and access</h2>

      <h3>I forgot the admin password</h3>
      <p>
        Use your <strong>Recovery PIN</strong>. If you set one up
        during first-time setup, follow{" "}
        <Link href="/docs/troubleshooting/locked-out-of-admin">
          Troubleshooting › Locked out of admin
        </Link>
        . If you didn&apos;t set up a PIN, contact BoothIQ support.
        They can issue a one-time emergency master password.
      </p>

      <h3>How do I get back to the admin dashboard?</h3>
      <p>
        Tap the credits indicator in the corner of the welcome screen{" "}
        <strong>5 times in quick succession</strong> (within about 3
        seconds total). The admin login screen will appear. See{" "}
        <Link href="/docs/getting-started/first-login-and-password">
          First login and password
        </Link>
        .
      </p>

      <h3>What&apos;s the difference between Master and User access?</h3>
      <ul>
        <li><strong>Master</strong> can do everything: settings, products, templates, hardware, cloud sync, user management.</li>
        <li><strong>User</strong> has limited access: sales reports and basic credit handling. Use this for staff who need to see sales but shouldn&apos;t be changing prices.</li>
      </ul>

      <h3>How many admin accounts can I have?</h3>
      <p>Multiple. Create them in <strong>Settings → Security &amp; Users</strong>. Each account has its own password and recovery PIN. Master access is needed to create or delete accounts.</p>

      <h2 id="printing-and-media">Printing and media</h2>

      <h3>How many prints do I get per roll?</h3>
      <p>About <strong>700</strong> 4×6 prints or <strong>1400</strong> 2×6 strips per standard DNP roll. The admin dashboard header shows a live &quot;Prints remaining&quot; indicator so you know when to swap.</p>

      <h3>Does it work with non-DNP paper?</h3>
      <p>No. BoothIQ is built for the DNP DS-RX1hs and only DNP-branded media is supported. Third-party media may not work and may damage the printer.</p>

      <h3>My printer pill is red but Windows printed a test page fine</h3>
      <p>
        You can&apos;t print a Windows test page on a locked-down
        BoothIQ kiosk. The operator can&apos;t reach Windows. Use the{" "}
        <strong>Diagnostics tab → Run All Tests</strong> button
        instead. See{" "}
        <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
        .
      </p>

      <h2 id="cloud-and-fleet">Cloud and fleet</h2>

      <h3>How do I register the booth in the cloud?</h3>
      <p>The fastest way is the 6-character registration code:</p>
      <ol>
        <li>Sign in to your BoothIQ web or mobile dashboard from a separate device.</li>
        <li>Create a booth or open an existing one.</li>
        <li>Click <strong>Generate Registration Code</strong>.</li>
        <li>On the kiosk, open admin → <strong>Cloud Sync</strong> → <strong>Quick Registration</strong>.</li>
        <li>Type the 6-character code and tap <strong>Register Booth</strong>.</li>
      </ol>
      <p>
        See{" "}
        <Link href="/docs/connecting-your-kiosk/cloud-registration">
          Cloud registration
        </Link>{" "}
        for details.
      </p>

      <h3>Can the cloud admin remotely add credits to my booth?</h3>
      <p>
        Yes. From the BoothIQ cloud dashboard, an admin can push an{" "}
        <code>add_credits</code> command to the booth. The credits
        appear immediately in the <strong>Credits</strong> tab. See{" "}
        <Link href="/docs/cloud-and-fleet/remote-commands">
          Remote commands
        </Link>
        .
      </p>

      <h3>Why does my Sync Status say &quot;Not Registered&quot;?</h3>
      <p>Either the booth has never been registered, or the registration was cleared. Open <strong>Cloud Sync</strong> and use the Quick Registration flow with a fresh code from the cloud dashboard.</p>

      <h2 id="hardware">Hardware</h2>

      <h3>Can I use a different camera?</h3>
      <p>The kiosk ships with the camera pre-installed and BoothIQ is tested against it. Swapping cameras is not a supported operation. Contact BoothIQ support if your camera fails.</p>

      <h3>Can I add a card reader?</h3>
      <p>Card payment is in the data model but verifying a kiosk&apos;s card reader is beyond the scope of these docs. Contact your BoothIQ point of contact if you need card payment.</p>

      <h3>What happens if the printer runs out of paper mid-session?</h3>
      <p>
        The printer reports an error to BoothIQ and the booth pauses
        the print job. Open the printer service door, change the roll
        (see{" "}
        <Link href="/docs/maintenance/changing-the-print-roll">
          Changing the print roll
        </Link>
        ), and the queued print will retry.
      </p>

      <h2 id="troubleshooting">Troubleshooting</h2>

      <h3>The booth was working yesterday and now nothing happens</h3>
      <ol>
        <li>Power it off, wait 10 seconds, power it back on.</li>
        <li>Wait for BoothIQ to relaunch.</li>
        <li>If it boots into Windows instead of BoothIQ, contact support.</li>
        <li>If the welcome screen comes up but a hardware pill is red, see the matching troubleshooting article.</li>
      </ol>

      <h3>Can I get logs off the kiosk to send to support?</h3>
      <p>
        Yes. From the BoothIQ cloud dashboard you can issue a{" "}
        <strong>Download Logs</strong> remote command. The booth
        uploads its logs and you can download them from the cloud. See{" "}
        <Link href="/docs/cloud-and-fleet/remote-commands">
          Remote commands
        </Link>
        .
      </p>

      <h2 id="anything-else">Anything else?</h2>

      <p>If your question isn&apos;t here, search the docs or contact BoothIQ support with your <strong>Booth ID</strong> and a short description.</p>
    </DocsLayout>
  );
}
