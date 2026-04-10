import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Payment not registering — BoothIQ Docs",
  description:
    "Customer inserts coins or bills but the booth doesn't credit them.",
};

const HREF = "/docs/troubleshooting/payment-not-registering";

const TOC = [
  { id: "quick-check", label: "Quick check first" },
  { id: "step-1", label: "Step 1: Have the customer try again" },
  { id: "step-2", label: "Step 2: Check the PCB pill" },
  { id: "step-3", label: "Step 3: Check the COM port" },
  { id: "step-4", label: "Step 4: Listen for live pulses" },
  { id: "step-5", label: "Step 5: Pulses arrive but credits don't" },
  { id: "step-6", label: "Step 6: Power-cycle the payment device" },
  { id: "step-7", label: "Step 7: Bill acceptor jams" },
  { id: "step-8", label: "Step 8: Coin acceptor jams" },
  { id: "step-9", label: "Step 9: When to call support" },
  { id: "workaround", label: "Workaround: switch to Free Play" },
  { id: "common", label: "Common causes" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PaymentNotRegisteringPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Payment not registering</h1>

      <p>
        A customer inserts coins or bills into the payment device, but
        the booth&apos;s credit balance doesn&apos;t update. This
        article walks through the common causes.
      </p>

      <p><strong>Symptom:</strong> PCB pill is red, or customer claims they paid but credits never appeared.</p>

      <h2 id="quick-check">Quick check first</h2>

      <ol>
        <li>Open admin → <strong>Diagnostics</strong> tab.</li>
        <li>Look at the <strong>PCB</strong> status card.</li>
        <li>Read the status pill and message.</li>
      </ol>

      <ul>
        <li><strong>Listening on COM3</strong> (or similar). The PCB is connected and BoothIQ is listening. Check the actual coin acceptor</li>
        <li><strong>Port not available.</strong> The COM port BoothIQ expects isn&apos;t there</li>
        <li><strong>Connection error.</strong> The serial connection failed</li>
        <li><strong>No data received.</strong> BoothIQ is listening but the device hasn&apos;t sent anything</li>
        <li><strong>Device not detected.</strong> The USB-to-serial adapter or the PCB itself is offline</li>
      </ul>

      <h2 id="step-1">Step 1: Have the customer try again</h2>

      <p>Most &quot;the coin didn&apos;t register&quot; reports are actually <strong>the coin was rejected by the acceptor</strong> (wrong denomination, dirty coin, jam) and the customer thinks they inserted it.</p>

      <p>Watch the customer insert the coin:</p>

      <ol>
        <li>Did the coin actually go into the acceptor, or get pushed back out?</li>
        <li>Did you hear a &quot;click&quot; or &quot;ding&quot; sound from the acceptor when it accepted?</li>
        <li>Did the credit balance on screen go up?</li>
      </ol>

      <p>If the coin came back out, it was rejected. Have the customer try again with a different coin.</p>

      <h2 id="step-2">Step 2: Check the PCB pill in admin</h2>

      <p>If the PCB pill in the dashboard header is <strong>red</strong>, the booth isn&apos;t talking to the payment device. Open the Diagnostics tab and read the PCB section&apos;s specific error message.</p>

      <h2 id="step-3">Step 3: Check the COM port</h2>

      <p>In the Diagnostics PCB section:</p>

      <ol>
        <li>Find the <strong>COM port selector</strong> dropdown.</li>
        <li>The dropdown lists every COM port the booth can see.</li>
        <li>The currently selected port should be the one the PCB is wired to.</li>
        <li>If you&apos;re not sure which port is correct, try each one in turn and watch the PCB card status update. The right port shows &quot;Listening on COMx&quot; with no error.</li>
      </ol>

      <DocsCallout type="note">
        The COM port can change if Windows reassigns it after a USB
        unplug/replug. Once you find the right port, leave it set.
      </DocsCallout>

      <h2 id="step-4">Step 4: Listen for live pulses</h2>

      <p>In the Diagnostics PCB section, there&apos;s usually a <strong>live pulse activity</strong> view that shows pulses as they arrive. To test:</p>

      <ol>
        <li>Confirm the PCB is &quot;Listening&quot; on the right port.</li>
        <li>Insert a test coin or bill into the acceptor.</li>
        <li>Watch the pulse activity view for a count change.</li>
      </ol>

      <ul>
        <li><strong>Pulses arrive when you insert a coin</strong> → the booth and the device are talking. The credit balance should also update. If it doesn&apos;t, see Step 5.</li>
        <li><strong>No pulses arrive</strong> → the booth isn&apos;t receiving from the device. The COM port may be wrong, or the cable is bad.</li>
      </ul>

      <h2 id="step-5">Step 5: Pulses arrive but credits don&apos;t</h2>

      <p>If the live pulse activity is incrementing but the credit balance in the Credits tab isn&apos;t changing, BoothIQ is receiving pulses but failing to record them. This is unusual.</p>

      <ol>
        <li>Power-cycle the kiosk to clear any stuck state.</li>
        <li>Repeat the test.</li>
        <li>If pulses still don&apos;t become credits, contact support. This is an internal issue.</li>
      </ol>

      <h2 id="step-6">Step 6: Power-cycle the payment device</h2>

      <p>The payment device may have its own internal state that gets stuck:</p>

      <ol>
        <li>Find the payment device&apos;s power source (it may share power with the kiosk, or have a separate cable).</li>
        <li>Power-cycle it. (If it shares power with the kiosk, just power-cycle the kiosk.)</li>
        <li>Wait 30 seconds.</li>
        <li>Check the PCB status pill. It should turn green.</li>
        <li>Test with a coin.</li>
      </ol>

      <h2 id="step-7">Step 7: Bill acceptor jams</h2>

      <p>If the booth has a bill acceptor and bills are being rejected or jammed:</p>

      <ol>
        <li>Look at the bill slot. Is there a stuck bill visible?</li>
        <li>If yes, the bill acceptor likely has a service door. Open it carefully and remove the jam.</li>
        <li>Close the door, wait for the acceptor to reset (usually a few seconds).</li>
        <li>Test with a known-good bill.</li>
      </ol>

      <p>
        If the bill acceptor jams repeatedly, it may be dirty inside.
        See{" "}
        <Link href="/docs/maintenance/coin-acceptor-care">
          Coin and bill acceptor care
        </Link>
        .
      </p>

      <h2 id="step-8">Step 8: Coin acceptor jams</h2>

      <p>Same as bill acceptor. Open the service compartment, remove the jam, close, test.</p>

      <p>If coins are being randomly rejected, the acceptor may need to be <strong>calibrated</strong> or <strong>reprogrammed</strong> to accept your local currency. This is hardware-specific; contact support.</p>

      <h2 id="step-9">Step 9: When to call support</h2>

      <p>Contact support if:</p>

      <ul>
        <li>PCB pill stays red after multiple power cycles and COM port changes</li>
        <li>Pulses are received but credits aren&apos;t recorded</li>
        <li>The payment device physically jams repeatedly</li>
        <li>Customers consistently report payment issues you can&apos;t reproduce</li>
        <li>You suspect the device is undercount (always credits less than the customer inserted)</li>
      </ul>

      <h2 id="workaround">Workaround: switch to Free Play</h2>

      <p>While you&apos;re troubleshooting, you can temporarily put the booth in <strong>Free Play</strong> mode so it can still serve customers (without charging):</p>

      <ol>
        <li>Open admin → <strong>Settings</strong> → switch to <strong>Free Play</strong>.</li>
        <li>Confirm the Mode pill in the header.</li>
        <li>Customers can still take photos and print, but they won&apos;t pay.</li>
      </ol>

      <p>
        This is much better than taking the booth completely offline.
        See{" "}
        <Link href="/docs/running-your-booth/operation-modes">
          Operation modes
        </Link>
        .
      </p>

      <h2 id="common">Common causes</h2>

      <p><strong>Customer inserted a non-accepted coin.</strong></p>
      <p>Tell customer to try a different coin.</p>

      <p><strong>Coin / bill jam.</strong></p>
      <p>Clear the jam.</p>

      <p><strong>COM port reassigned by Windows.</strong></p>
      <p>Pick the right port in Diagnostics.</p>

      <p><strong>USB-to-serial adapter unplugged.</strong></p>
      <p>Internal cable. Contact support.</p>

      <p><strong>Payment device stuck after a power blip.</strong></p>
      <p>Power-cycle the device.</p>

      <p><strong>Payment device dirty inside.</strong></p>
      <p>Clean it (see Maintenance).</p>

      <p><strong>Payment device physically damaged.</strong></p>
      <p>Replacement needed. Contact support.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>Payment is recovered when:</p>

      <ul>
        <li>The PCB pill is green</li>
        <li>Pulses arrive in the Diagnostics view when you insert a test coin</li>
        <li>The credit balance updates correctly</li>
        <li>A full customer session in Coin Operated mode completes from payment to print</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Where payment troubleshooting starts.
        </li>
        <li>
          <Link href="/docs/maintenance/coin-acceptor-care">Coin and bill acceptor care</Link>
          . Routine maintenance.
        </li>
        <li>
          <Link href="/docs/running-your-booth/operation-modes">Operation modes</Link>
          . Switching to Free Play as a workaround.
        </li>
      </ul>
    </DocsLayout>
  );
}
