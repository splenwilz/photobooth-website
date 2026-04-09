import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Reading error screens — BoothIQ Docs",
  description:
    "What BoothIQ's Camera Error Screen and Hardware Error Screen are saying and how to interpret error codes.",
};

const HREF = "/docs/troubleshooting/reading-error-screens";

const TOC = [
  { id: "two-screens", label: "The two main error screens" },
  { id: "error-codes", label: "Reading error codes" },
  { id: "version", label: "Looking up the BoothIQ version" },
  { id: "capturing", label: "Capturing the error for support" },
  { id: "clears", label: "When the error screen clears" },
  { id: "watchdog", label: "Hardware watchdog: friend or foe?" },
  { id: "customer-vs-operator", label: "What customers see vs what you see" },
  { id: "verify", label: "Verify the error is gone" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ReadingErrorScreensPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Reading error screens</h1>

      <p>
        BoothIQ has dedicated full-screen error UIs for hardware
        failures during a customer session. This article tells you
        what each one is and how to extract useful information from
        it.
      </p>

      <p><strong>Who this is for:</strong> Operators who arrived at the booth to find an error screen up, or customers who reported one.</p>

      <h2 id="two-screens">The two main error screens</h2>

      <h3>Camera Error Screen</h3>

      <p>Shown when the camera fails during a customer session. The camera disconnected, frame capture timed out, or the SDK threw an error.</p>

      <p><strong>What&apos;s on the screen:</strong></p>

      <ul>
        <li>A friendly message explaining there&apos;s a camera problem</li>
        <li>A short error description</li>
        <li>A <strong>Retry</strong> button</li>
        <li>Possibly a <strong>Cancel</strong> or <strong>Back</strong> button</li>
      </ul>

      <p><strong>The customer&apos;s session is preserved.</strong> If they paid, their credits are still in the balance, and they can retry without losing money.</p>

      <p><strong>What to do:</strong></p>

      <ol>
        <li>Apologize.</li>
        <li>Have the customer tap <strong>Retry</strong> once. It might be a transient issue.</li>
        <li>If retry fails, take the booth out of customer flow and open admin → Diagnostics.</li>
        <li>Check the Camera card.</li>
        <li>Power-cycle if needed.</li>
        <li>Comp the customer (add credits in the Credits tab) so they can finish their session.</li>
      </ol>

      <p>
        For deeper camera troubleshooting see{" "}
        <Link href="/docs/troubleshooting/camera-not-working">
          Camera not working
        </Link>
        .
      </p>

      <h3>Hardware Error Screen</h3>

      <p>A more general &quot;something is wrong with the booth&apos;s hardware&quot; screen. Shown when the <strong>hardware watchdog</strong> (set in <strong>Settings → Hardware Error Screen</strong>) detects that printer, camera, or PCB has gone offline.</p>

      <p><strong>What&apos;s on the screen:</strong></p>

      <ul>
        <li>A clear &quot;Out of Order&quot; or &quot;Hardware Problem&quot; message</li>
        <li>Component info. Which piece of hardware is offline</li>
        <li>(Possibly) the BoothIQ version number for support reference</li>
        <li>A diagnostic info panel with details</li>
      </ul>

      <p><strong>The customer&apos;s session is preserved</strong> in the same way as the Camera Error Screen, but the booth will not let them complete the session until the hardware is healthy again.</p>

      <p><strong>What to do:</strong></p>

      <ol>
        <li>Take the booth out of customer flow.</li>
        <li>Open admin → Diagnostics.</li>
        <li>
          Find the component that&apos;s offline and run the matching troubleshooting article:
          <ul>
            <li>Camera → <Link href="/docs/troubleshooting/camera-not-working">Camera not working</Link></li>
            <li>Printer → <Link href="/docs/troubleshooting/printer-issues">Printer issues</Link></li>
            <li>PCB → <Link href="/docs/troubleshooting/payment-not-registering">Payment not registering</Link></li>
          </ul>
        </li>
        <li>Once the hardware is recovered, the error screen should clear automatically when the watchdog re-detects healthy status.</li>
      </ol>

      <p>
        For more on the watchdog and the out-of-order screen, see{" "}
        <Link href="/docs/troubleshooting/out-of-order-screen">
          Out-of-order screen won&apos;t go away
        </Link>
        .
      </p>

      <h2 id="error-codes">Reading error codes</h2>

      <p>Some errors include a specific error code or short message. Common patterns:</p>

      <ul>
        <li><strong>CAM-NOT-FOUND.</strong> Camera not detected</li>
        <li><strong>CAM-INIT-FAILED.</strong> Camera detected but initialization failed</li>
        <li><strong>CAM-FRAME-TIMEOUT.</strong> Camera initialized but no frames arriving</li>
        <li><strong>PRT-OFFLINE.</strong> Printer is offline</li>
        <li><strong>PRT-OUT-OF-PAPER.</strong> Printer reports out of media</li>
        <li><strong>PRT-DOOR-OPEN.</strong> Printer service door is open</li>
        <li><strong>PCB-NOT-LISTENING.</strong> Payment device not connected</li>
        <li><strong>PCB-NO-PORT.</strong> COM port not available</li>
        <li><strong>WATCHDOG-*.</strong> Hardware watchdog triggered for component *</li>
      </ul>

      <DocsCallout type="note">
        The exact codes may differ in your version of BoothIQ. The
        pattern (<code>COMPONENT-CONDITION</code>) is the standard.
      </DocsCallout>

      <p>If you see an error code you can&apos;t decode, note it down and contact support.</p>

      <h2 id="version">Looking up the BoothIQ version</h2>

      <p>The hardware error screen often shows the BoothIQ version number. Note this for support. Different versions may have different bugs.</p>

      <p>You can also see the version on the <strong>welcome screen</strong> in a corner, and in the admin dashboard footer or settings area.</p>

      <h2 id="capturing">Capturing the error for support</h2>

      <p>If the error is unfamiliar and you need to report it to support:</p>

      <ol>
        <li><strong>Take a photo of the screen</strong> with your phone. Get the full error message and any codes visible.</li>
        <li>Note the <strong>time</strong> the error appeared and <strong>what the customer was doing</strong> when it appeared.</li>
        <li>Note the <strong>Booth ID</strong> (visible in the Cloud Sync tab if you can get into admin).</li>
        <li><strong>Don&apos;t power-cycle yet</strong> if you haven&apos;t already. The in-memory state may have useful info that&apos;s lost on reboot. Get the photo and the timestamps first, then reboot.</li>
        <li>Send all of this to support.</li>
      </ol>

      <p>
        If your booth is registered to the cloud, support can also
        pull logs from the cloud (see{" "}
        <Link href="/docs/cloud-and-fleet/remote-commands">
          Remote commands
        </Link>
        ).
      </p>

      <h2 id="clears">When the error screen clears</h2>

      <p>For most error screens, <strong>resolving the underlying hardware issue</strong> is enough. BoothIQ re-detects the healthy hardware and the error screen disappears within a few seconds.</p>

      <p>If the error screen <strong>doesn&apos;t clear</strong> after the hardware is fixed:</p>

      <ol>
        <li>The booth&apos;s status cache may be stale.</li>
        <li>Power-cycle the kiosk to reset.</li>
        <li>The error screen should not appear after the boot.</li>
      </ol>

      <h2 id="watchdog">Hardware watchdog: friend or foe?</h2>

      <p>The hardware watchdog (toggled in <strong>Settings → Hardware Error Screen</strong>) is what triggers the Out of Order error screen when hardware fails. It&apos;s a <strong>safety mechanism</strong>. Without it, the booth would keep accepting customers and taking their money even when it can&apos;t print.</p>

      <p><strong>Leave the watchdog on in production.</strong> Turn it off only temporarily when you&apos;re diagnosing a hardware issue and need to walk the customer flow without being interrupted by the out-of-order screen.</p>

      <h2 id="customer-vs-operator">What customers see vs what you see</h2>

      <ul>
        <li><strong>Customer side, mid-session, hardware fails.</strong> Camera Error Screen or Hardware Error Screen with Retry button</li>
        <li><strong>Customer side, hardware was already broken.</strong> Hardware Error Screen / Out of Order from the start</li>
        <li><strong>Operator side, in admin.</strong> Header bar pills go red. Error badge appears. License banner unchanged</li>
        <li><strong>Operator side, on welcome screen.</strong> Hardware error overlay over the welcome screen if the watchdog is on</li>
      </ul>

      <p>The error screens are designed to be customer-friendly. They don&apos;t show stack traces or technical jargon. The detailed information is in admin Diagnostics.</p>

      <h2 id="verify">Verify the error is gone</h2>

      <p>You&apos;re back in business when:</p>

      <ul>
        <li>All header pills are green</li>
        <li>The error screen no longer appears anywhere in the customer flow</li>
        <li>A test session completes successfully end to end</li>
        <li>(If applicable) the error doesn&apos;t immediately come back</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li><Link href="/docs/troubleshooting/camera-not-working">Camera not working</Link></li>
        <li><Link href="/docs/troubleshooting/printer-issues">Printer issues</Link></li>
        <li><Link href="/docs/troubleshooting/payment-not-registering">Payment not registering</Link></li>
        <li><Link href="/docs/troubleshooting/out-of-order-screen">Out-of-order screen won&apos;t go away</Link></li>
      </ul>
    </DocsLayout>
  );
}
