import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Out-of-order screen won't go away — BoothIQ Docs",
  description:
    "The hardware watchdog has caught a problem and the out-of-order screen keeps appearing.",
};

const HREF = "/docs/troubleshooting/out-of-order-screen";

const TOC = [
  { id: "diagnosis", label: "Quick diagnosis" },
  { id: "step-1", label: "Step 1: Check the pills" },
  { id: "step-2", label: "Step 2: Hardware fixed but screen still there" },
  { id: "step-3", label: "Step 3: Hardware fine but screen appears" },
  { id: "step-4", label: "Step 4: Disable temporarily" },
  { id: "step-5", label: "Step 5: Some other error overlay" },
  { id: "support", label: "When to call support" },
  { id: "why", label: "Why the out-of-order screen exists" },
  { id: "verify", label: "Verify it worked" },
  { id: "patterns", label: "Common patterns" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function OutOfOrderScreenPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Out-of-order screen won&apos;t go away</h1>

      <p>
        The booth keeps showing an &quot;Out of Order&quot; hardware
        error screen to customers, and you can&apos;t make it go
        away. Either you&apos;ve fixed the underlying hardware and the
        screen is stuck, or something is genuinely wrong.
      </p>

      <p><strong>Symptom:</strong> Hardware error / out-of-order screen appears on the welcome screen or mid-session and persists.</p>

      <h2 id="diagnosis">Quick diagnosis</h2>

      <p>The out-of-order screen is triggered by the <strong>hardware watchdog</strong>, which is controlled by the toggle in <strong>Settings → Hardware Error Screen → Enable hardware watchdog</strong>. The watchdog watches the <strong>camera, printer, and PCB</strong> status pills and shows the out-of-order screen if any of them goes offline.</p>

      <p>So the out-of-order screen appearing means <strong>at least one piece of hardware is offline right now</strong>. Find which one and fix it.</p>

      <h2 id="step-1">Step 1: Open admin and check the pills</h2>

      <p>If you can still get into admin (the 5-tap sequence usually still works):</p>

      <ol>
        <li>5-tap → sign in.</li>
        <li>Look at the header bar <strong>Camera / Printer / PCB pills</strong>.</li>
        <li>The <strong>red one</strong> is the problem.</li>
      </ol>

      <ul>
        <li>Camera red → <Link href="/docs/troubleshooting/camera-not-working">Camera not working</Link></li>
        <li>Printer red → <Link href="/docs/troubleshooting/printer-issues">Printer issues</Link></li>
        <li>PCB red → <Link href="/docs/troubleshooting/payment-not-registering">Payment not registering</Link></li>
      </ul>

      <p>Fix the red one. The out-of-order screen should clear automatically when all pills are green.</p>

      <h2 id="step-2">Step 2: I fixed the hardware but the screen is still there</h2>

      <p>If you&apos;re sure the hardware is recovered but the screen persists:</p>

      <ol>
        <li>Look at the pills again. Sometimes hardware reports healthy briefly and then fails again. Confirm the green status is <strong>stable</strong>.</li>
        <li><strong>Wait 30 seconds.</strong> The watchdog has its own polling interval and may not have noticed the recovery yet.</li>
        <li><strong>Power-cycle the kiosk.</strong> This is the surest way to clear stale watchdog state.</li>
      </ol>

      <p>After the reboot the welcome screen should appear cleanly with no overlay.</p>

      <h2 id="step-3">Step 3: Hardware is genuinely fine but the screen still appears</h2>

      <p>This is a bug or a subtle issue. Things to try:</p>

      <ul>
        <li><strong>Open Diagnostics → Run All Tests.</strong> Confirm every test passes.</li>
        <li><strong>Walk through a Free Play session</strong> to see if the booth actually accepts a session. If the session works fine but the welcome screen still has the overlay, the watchdog UI is stale.</li>
        <li><strong>Power-cycle.</strong></li>
      </ul>

      <p>If the screen reappears immediately after every power cycle, the watchdog is detecting something you can&apos;t see. Look at the booth carefully:</p>

      <ul>
        <li>Is the camera <strong>lens cap</strong> on? (Some camera models report &quot;no light&quot; as a fault.)</li>
        <li>Is the printer <strong>service door</strong> ever-so-slightly ajar?</li>
        <li>Is the PCB <strong>COM cable</strong> loose?</li>
      </ul>

      <h2 id="step-4">Step 4: I want to disable the out-of-order screen temporarily</h2>

      <p>You&apos;re diagnosing a hardware issue and the out-of-order screen is in your way. You can turn the watchdog off briefly:</p>

      <ol>
        <li>Sign in to admin.</li>
        <li>Open <strong>Settings</strong>.</li>
        <li>Find the <strong>Hardware Error Screen</strong> card.</li>
        <li>Toggle <strong>Enable hardware watchdog</strong> to <strong>off</strong>.</li>
        <li>The hint reads &quot;This setting applies immediately when toggled&quot;. No Save needed.</li>
        <li>The out-of-order screen disappears.</li>
      </ol>

      <DocsCallout type="warning">
        <strong>Don&apos;t leave the watchdog off in production.</strong>{" "}
        Turn it back on as soon as you&apos;re done diagnosing.
        Otherwise customers will keep paying for sessions on broken
        hardware.
      </DocsCallout>

      <h2 id="step-5">Step 5: Some other error overlay</h2>

      <p>If the screen isn&apos;t the standard out-of-order watchdog screen but a different error:</p>

      <ul>
        <li><strong>Camera Error Screen</strong> → see <Link href="/docs/troubleshooting/camera-not-working">Camera not working</Link></li>
        <li><strong>Generic hardware error with retry</strong> → see <Link href="/docs/troubleshooting/reading-error-screens">Reading error screens</Link></li>
        <li><strong>Windows error / blue screen</strong> → contact support</li>
        <li><strong>Black screen</strong> → see <Link href="/docs/troubleshooting/booth-frozen-or-blank">Booth frozen or screen blank</Link></li>
      </ul>

      <h2 id="support">When to call support</h2>

      <p>Contact support if:</p>

      <ul>
        <li>The out-of-order screen persists across power cycles AND all hardware tests pass</li>
        <li>The hardware watchdog is fundamentally misbehaving</li>
        <li>A specific error pattern is triggering the screen but you can&apos;t identify which component</li>
        <li>You see the screen and immediately get a Camera or Printer error after power-cycling</li>
      </ul>

      <p>Have the <strong>Booth ID</strong>, the <strong>screen text</strong>, and a description of what you tried.</p>

      <h2 id="why">Why the out-of-order screen exists</h2>

      <p>It&apos;s a safety mechanism. Without it:</p>

      <ul>
        <li>A printer could be jammed for hours and customers would keep paying for sessions that won&apos;t print</li>
        <li>A camera could be dead and customers would buy &quot;photos&quot; of nothing</li>
        <li>A payment device could undercount and customers would lose money</li>
      </ul>

      <p>The watchdog stops accepting customers when the booth can&apos;t complete a session. It&apos;s working correctly when it appears in response to a real hardware problem.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>The booth is recovered when:</p>

      <ul>
        <li>The welcome screen appears clean of any error overlay</li>
        <li>The Camera / Printer / PCB pills are all green</li>
        <li>A test customer session completes successfully</li>
        <li>The watchdog is back <strong>on</strong> in Settings</li>
      </ul>

      <h2 id="patterns">Common patterns</h2>

      <p><strong>Out of order overlay every morning.</strong></p>
      <p>Hardware ages and fails overnight. Power-cycle as part of opening checklist.</p>

      <p><strong>Out of order during a busy event.</strong></p>
      <p>Sustained load triggered an intermittent failure. Power-cycle once; if it returns, take a break and let the printer cool.</p>

      <p><strong>Out of order after a power blip.</strong></p>
      <p>A USB device dropped and didn&apos;t re-enumerate. Power-cycle.</p>

      <p><strong>Out of order after no apparent trigger.</strong></p>
      <p>A hardware component is genuinely dying. Run diagnostic tests; consider hardware replacement.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li><Link href="/docs/troubleshooting/camera-not-working">Camera not working</Link></li>
        <li><Link href="/docs/troubleshooting/printer-issues">Printer issues</Link></li>
        <li><Link href="/docs/troubleshooting/payment-not-registering">Payment not registering</Link></li>
        <li>
          <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
          . Where the watchdog toggle lives.
        </li>
      </ul>
    </DocsLayout>
  );
}
