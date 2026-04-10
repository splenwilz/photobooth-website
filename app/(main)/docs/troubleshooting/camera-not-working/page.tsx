import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Camera not working — BoothIQ Docs",
  description:
    "The Camera pill is red, photos aren't being captured, or the camera error screen keeps appearing.",
};

const HREF = "/docs/troubleshooting/camera-not-working";

const TOC = [
  { id: "quick-check", label: "Quick check first" },
  { id: "step-1", label: "Step 1: Power-cycle the kiosk" },
  { id: "step-2", label: "Step 2: Run All Tests" },
  { id: "step-3", label: "Step 3: Try a test capture" },
  { id: "step-4", label: "Step 4: Adjust camera settings" },
  { id: "step-5", label: "Step 5: Check the customer side" },
  { id: "step-6", label: "Step 6: When to call support" },
  { id: "common", label: "Common causes and fixes" },
  { id: "replacing", label: "What about replacing the camera?" },
  { id: "error-screen", label: "Camera Error Screen during a session" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CameraNotWorkingPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Camera not working</h1>

      <p>
        The camera is the most common hardware failure point in a busy
        booth. This article covers what to do when the{" "}
        <strong>Camera pill is red</strong> in the admin header bar,
        when <strong>photos are coming out blank</strong>, or when
        customers see the <strong>Camera Error Screen</strong>{" "}
        mid-session.
      </p>

      <p><strong>Symptom:</strong> Camera-related red status pill, blank captures, &quot;No camera detected&quot; message in Diagnostics.</p>

      <h2 id="quick-check">Quick check first</h2>

      <ol>
        <li>Open admin → <strong>Diagnostics</strong> tab.</li>
        <li>Look at the <strong>Camera</strong> status card.</li>
        <li>Read the status pill (Active / Inactive / Error) and the message underneath.</li>
      </ol>

      <p>The message underneath the pill is your most useful clue.</p>

      <ul>
        <li><strong>No camera detected.</strong> The camera is unplugged, in use by something else, or has failed</li>
        <li><strong>Camera in use.</strong> Another process is holding the camera (rare on a locked-down kiosk)</li>
        <li><strong>Initialization failed.</strong> The camera was detected but couldn&apos;t be opened</li>
        <li><strong>Frame timeout.</strong> The camera was opened but isn&apos;t returning frames</li>
      </ul>

      <h2 id="step-1">Step 1: Power-cycle the kiosk</h2>

      <p>Most camera issues clear after a clean boot.</p>

      <ol>
        <li>
          Power-cycle the kiosk (see{" "}
          <Link href="/docs/troubleshooting/booth-frozen-or-blank">
            Booth frozen or screen blank
          </Link>{" "}
          Step 1).
        </li>
        <li>Wait for the welcome screen.</li>
        <li>Sign in to admin.</li>
        <li>Check the Camera pill in the header.</li>
      </ol>

      <p>If green, you&apos;re done. If still red, continue.</p>

      <h2 id="step-2">Step 2: Run All Tests</h2>

      <p>In the Diagnostics tab, tap <strong>Run All Tests</strong> at the top right. Watch the Camera card update. If the camera test reports a specific error, note it.</p>

      <h2 id="step-3">Step 3: Try a test capture</h2>

      <p>In the Diagnostics tab Camera section, tap the <strong>Test Capture</strong> button. The booth attempts to grab a single frame.</p>

      <ul>
        <li><strong>Test capture succeeds</strong> → camera is fine. The earlier red state was transient. Try the customer flow.</li>
        <li><strong>Test capture fails with the same error</strong> → camera is genuinely offline. Continue to Step 4.</li>
      </ul>

      <h2 id="step-4">Step 4: Adjust camera settings</h2>

      <p>If the camera is detected but capturing dark / washed out / wrong-colored photos:</p>

      <ol>
        <li>
          In Diagnostics → Camera section, adjust the sliders:
          <ul>
            <li><strong>Brightness</strong>. 0-100, raise for dark venues</li>
            <li><strong>Zoom</strong>. 0-200%, leave at 100% unless you have a specific reason to zoom</li>
            <li><strong>Contrast</strong>. 0-100, adjust to taste</li>
          </ul>
        </li>
        <li>Tap <strong>Test Capture</strong> after each change to see the result.</li>
        <li>Once it looks right, the settings persist across reboots.</li>
      </ol>

      <p>If sliders don&apos;t fix it, the lighting at the booth is the actual issue. Add fill lighting near the customer position.</p>

      <h2 id="step-5">Step 5: Check the customer experience side</h2>

      <p>A camera that &quot;works in Diagnostics but fails in production&quot; is unusual. If you see this:</p>

      <ol>
        <li>Run a full test session through the customer flow (in Free Play mode).</li>
        <li>If the session works, the earlier failure was transient.</li>
        <li>If the session fails again, note exactly which step it fails on (look at camera screen, capture, etc.) and contact support.</li>
      </ol>

      <h2 id="step-6">Step 6: When to call support</h2>

      <p>Camera issues that need support:</p>

      <ul>
        <li>Camera card always shows &quot;No camera detected&quot; after power cycle</li>
        <li>Test capture fails with the same error every time</li>
        <li>Camera works for a few sessions then fails repeatedly</li>
        <li>Captures come out completely black or scrambled</li>
        <li>The camera physically looks loose, broken, or damaged</li>
      </ul>

      <p>Have your Booth ID and a description of the symptom ready.</p>

      <h2 id="common">Common causes and fixes</h2>

      <p><strong>Booth was powered on with the camera disconnected.</strong></p>
      <p>Power-cycle.</p>

      <p><strong>Internal USB cable came loose during shipping.</strong></p>
      <p>Power-cycle. If still failing, contact support.</p>

      <p><strong>Camera firmware glitch after a long uptime.</strong></p>
      <p>Power-cycle (this clears most issues).</p>

      <p><strong>Camera physically damaged.</strong></p>
      <p>Contact support. Needs a hardware swap.</p>

      <p><strong>Lighting too dark / too bright for the camera.</strong></p>
      <p>Adjust the room lighting or the camera sliders.</p>

      <p><strong>Privacy / antivirus / OS settings blocking the camera.</strong></p>
      <p>Not applicable on a locked-down kiosk. The OS settings are pre-configured. If somehow this happens, contact support.</p>

      <h2 id="replacing">What about replacing the camera?</h2>

      <p>The kiosk&apos;s camera is internal and not designed to be swapped by operators. If your camera has failed and you need a replacement, contact BoothIQ support. They&apos;ll arrange a replacement procedure.</p>

      <DocsCallout type="warning">
        <strong>Don&apos;t open the kiosk enclosure to access the
        camera yourself</strong> unless explicitly instructed by
        support. Opening the kiosk may void warranties and risk
        damaging other components.
      </DocsCallout>

      <h2 id="error-screen">Camera Error Screen during a customer session</h2>

      <p>If a customer is mid-session and the camera fails, BoothIQ shows a dedicated <strong>Camera Error Screen</strong>:</p>

      <ul>
        <li>It explains there&apos;s a camera problem</li>
        <li>It offers a <strong>Retry</strong> button</li>
        <li>It does <strong>not</strong> automatically force the customer back to the welcome screen. The customer&apos;s paid session is preserved</li>
      </ul>

      <p>If the customer taps Retry and the camera still fails, they&apos;re stuck. You should:</p>

      <ol>
        <li>
          Comp them by adding credits in the Credits tab (see{" "}
          <Link href="/docs/running-your-booth/adding-credits-manually">
            Adding credits manually
          </Link>
          ).
        </li>
        <li>Take the booth out of service if the camera is consistently failing.</li>
        <li>Power-cycle to recover.</li>
      </ol>

      <h2 id="verify">Verify it worked</h2>

      <p>The camera is recovered when:</p>

      <ul>
        <li>The Camera pill is green in the header</li>
        <li>The Diagnostics Camera card shows Active</li>
        <li>A test capture produces a clear, well-exposed photo</li>
        <li>A full customer session completes successfully</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Where you&apos;ll spend most of your camera troubleshooting time.
        </li>
        <li>
          <Link href="/docs/troubleshooting/reading-error-screens">Reading error screens</Link>
          . When customers see the Camera Error Screen.
        </li>
        <li>
          <Link href="/docs/maintenance/camera-care">Camera care</Link>
          . Routine camera maintenance.
        </li>
      </ul>
    </DocsLayout>
  );
}
