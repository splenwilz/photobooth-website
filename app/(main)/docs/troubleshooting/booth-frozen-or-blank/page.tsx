import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Booth frozen or screen blank — BoothIQ Docs",
  description:
    "The kiosk isn't responding to touch, the screen is blank, or BoothIQ won't launch.",
};

const HREF = "/docs/troubleshooting/booth-frozen-or-blank";

const TOC = [
  { id: "step-1", label: "Step 1: Power cycle" },
  { id: "step-2", label: "Step 2: Check the power" },
  { id: "step-3", label: "Step 3: Black screen but PC is running" },
  { id: "step-4", label: "Step 4: Screen on but BoothIQ not running" },
  { id: "step-5", label: "Step 5: Touch unresponsive" },
  { id: "step-6", label: "Step 6: Stuck on one screen" },
  { id: "step-7", label: "Step 7: Hardware error overlay" },
  { id: "support", label: "When to call support" },
  { id: "verify", label: "Verify it worked" },
  { id: "patterns", label: "Common patterns" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function BoothFrozenPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Booth frozen or screen blank</h1>

      <p>
        The most basic problem: the kiosk isn&apos;t doing anything.
        The screen is blank, frozen on the welcome screen, ignoring
        touch, or BoothIQ never launched. This article walks through
        the cheapest fixes first.
      </p>

      <p><strong>Symptom:</strong> Customer walked up, the booth doesn&apos;t respond. Or you arrived in the morning and the screen is dark.</p>

      <h2 id="step-1">Step 1: Power cycle the kiosk</h2>

      <p>The single most effective fix for a frozen booth.</p>

      <ol>
        <li>Find the kiosk&apos;s power button. (Usually behind a small access panel. Your installer will have shown you where.)</li>
        <li>Hold it down for 5-10 seconds to <strong>force shutdown</strong>.</li>
        <li>Wait 10 seconds.</li>
        <li>Press the power button again to <strong>boot</strong>.</li>
        <li>Watch the screen.</li>
      </ol>

      <p>After 30-60 seconds you should see BoothIQ start and the welcome screen appear. If yes, you&apos;re done.</p>

      <p>If the screen stays black after the power button, see Step 2.</p>

      <h2 id="step-2">Step 2: Check the power</h2>

      <p>If the screen is <strong>completely black</strong> even after pressing the power button:</p>

      <ol>
        <li>Confirm the kiosk&apos;s power cable is plugged in firmly at both ends (wall and kiosk).</li>
        <li>Confirm the wall outlet is live. Plug something else into it, or check the breaker.</li>
        <li>If the kiosk has an internal power LED visible from the outside, check that it&apos;s on.</li>
        <li>If you have a UPS, check that the UPS itself has power and that the kiosk is connected to a UPS outlet (not just the surge passthrough).</li>
      </ol>

      <p>If the kiosk has zero power and you&apos;ve ruled out the wall outlet, contact support.</p>

      <h2 id="step-3">Step 3: Black screen but the PC is running</h2>

      <p>If the kiosk&apos;s PC seems to have power (you can hear fans, see LEDs) but the screen is black:</p>

      <ol>
        <li>Power-cycle the kiosk (Step 1).</li>
        <li>If the screen stays black after a clean boot, the touchscreen / display has lost video signal. There&apos;s an internal video cable that may have come loose in shipping or after rough handling.</li>
        <li>Contact support. This is an internal hardware issue.</li>
      </ol>

      <h2 id="step-4">Step 4: Screen is on but BoothIQ isn&apos;t running</h2>

      <p>If the screen is on but you see something that <strong>isn&apos;t</strong> the BoothIQ welcome screen:</p>

      <ul>
        <li><strong>Windows desktop visible</strong> → BoothIQ failed to auto-launch. Power-cycle once. If the desktop is still visible after boot, contact support. Auto-launch is misconfigured or BoothIQ crashed during launch</li>
        <li><strong>A Windows error message</strong> → Read the message. Power-cycle and try again. If it persists, contact support</li>
        <li><strong>A blank black screen with a cursor</strong> → Booting up. Wait another minute</li>
        <li><strong>The BoothIQ logo / splash screen</strong> → Booting up. Wait another 30 seconds</li>
      </ul>

      <h2 id="step-5">Step 5: BoothIQ is running but unresponsive to touch</h2>

      <p>The booth is showing a BoothIQ screen but tapping doesn&apos;t do anything:</p>

      <ol>
        <li>Check if the touch is <strong>completely</strong> dead, or just slow. Wait 10 seconds and tap again. Sometimes the screen is just busy.</li>
        <li><strong>Power-cycle the kiosk.</strong> Touch issues almost always clear after a reboot.</li>
        <li>If touch is still dead after a reboot, the touchscreen connection is the problem. Contact support.</li>
      </ol>

      <h2 id="step-6">Step 6: BoothIQ is responsive but stuck on one screen</h2>

      <p>A specific screen is frozen. The buttons don&apos;t advance, or animations have stopped:</p>

      <ol>
        <li><strong>Wait 10 seconds.</strong> Some screens have intentional delays (e.g. the welcome screen plays a video that loops).</li>
        <li><strong>Tap somewhere obvious</strong> like the START button or a navigation button.</li>
        <li><strong>Wait for the idle timeout</strong> to kick in (60-180 seconds depending on the screen). The booth should auto-return to the welcome screen.</li>
        <li>If the timeout doesn&apos;t fire, the booth has truly frozen. Power-cycle.</li>
        <li>If freezing happens repeatedly on the same screen, that&apos;s a bug. Note which screen, and contact support with the screen name and what triggered it.</li>
      </ol>

      <h2 id="step-7">Step 7: Hardware error overlay won&apos;t go away</h2>

      <p>A hardware error screen is showing on top of the welcome screen and persists across power cycles.</p>

      <ol>
        <li><strong>Read the error message</strong> for clues about which component is failing.</li>
        <li>Open admin and check the <strong>hardware status pills</strong> in the header bar.</li>
        <li>
          Match the error message to a more specific troubleshooting article:
          <ul>
            <li>Camera → <Link href="/docs/troubleshooting/camera-not-working">Camera not working</Link></li>
            <li>Printer → <Link href="/docs/troubleshooting/printer-issues">Printer issues</Link></li>
            <li>Payment → <Link href="/docs/troubleshooting/payment-not-registering">Payment not registering</Link></li>
          </ul>
        </li>
      </ol>

      <p>
        If the watchdog is showing a generic out-of-order screen, see{" "}
        <Link href="/docs/troubleshooting/out-of-order-screen">
          Out-of-order screen won&apos;t go away
        </Link>
        .
      </p>

      <h2 id="support">When to call support</h2>

      <p>After you&apos;ve tried all the steps above and the booth is still:</p>

      <ul>
        <li>Completely unresponsive</li>
        <li>Stuck on a Windows error screen</li>
        <li>Freezing repeatedly</li>
        <li>Showing hardware errors that don&apos;t match a specific troubleshooting article</li>
      </ul>

      <p>Contact BoothIQ support with:</p>

      <ul>
        <li>The <strong>Booth ID</strong> (from the Cloud Sync tab if you can get into admin)</li>
        <li>A description of what you see on screen</li>
        <li>(If you can take it) a photo of the screen</li>
        <li>The time the problem started</li>
      </ul>

      <p>If the booth is registered and online, support can pull logs from the cloud. That often resolves issues faster than back-and-forth troubleshooting.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>The booth is recovered when:</p>

      <ul>
        <li>The welcome screen is showing</li>
        <li>You can sign in to admin</li>
        <li>All three hardware pills are green</li>
        <li>A test session completes successfully</li>
      </ul>

      <h2 id="patterns">Common patterns</h2>

      <p><strong>Booth frozen first thing in the morning.</strong></p>
      <p>Long-running BoothIQ instance has accumulated state. Power cycle every morning as part of opening (or once a week).</p>

      <p><strong>Booth freezes during a busy event.</strong></p>
      <p>Resource pressure, edge case in a specific session. Power cycle, monitor closely. Get logs to support if it repeats.</p>

      <p><strong>Booth boots into Windows desktop after a power cycle.</strong></p>
      <p>Auto-start was disabled or BoothIQ crashed at launch. Contact support. This isn&apos;t recoverable from the operator side.</p>

      <p><strong>Touch works in some areas but not others.</strong></p>
      <p>Screen calibration drifted, or a screen overlay is blocking touches. Power cycle. If it persists, contact support.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/troubleshooting/camera-not-working">Camera not working</Link>
          . When the issue is the camera specifically.
        </li>
        <li>
          <Link href="/docs/troubleshooting/printer-issues">Printer issues</Link>
          . When the issue is the printer.
        </li>
        <li>
          <Link href="/docs/troubleshooting/reading-error-screens">Reading error screens</Link>
          . Decoding what BoothIQ&apos;s error screens are saying.
        </li>
      </ul>
    </DocsLayout>
  );
}
