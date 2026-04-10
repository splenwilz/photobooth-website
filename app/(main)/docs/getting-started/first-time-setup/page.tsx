import type { Metadata } from "next";
import Link from "next/link";
import { DocsCallout, DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "First-time setup — BoothIQ Docs",
  description:
    "Place the kiosk, power it on, and reach the BoothIQ welcome screen for the first time.",
};

const HREF = "/docs/getting-started/first-time-setup";

const TOC = [
  { id: "before-you-start", label: "Before you start" },
  { id: "step-1", label: "Step 1: Position the kiosk" },
  { id: "step-2", label: "Step 2: Connect power" },
  { id: "step-3", label: "Step 3: Connect Ethernet" },
  { id: "step-4", label: "Step 4: Power on the booth" },
  { id: "step-5", label: "Step 5: Watch BoothIQ start" },
  { id: "step-6", label: "Step 6: Don't leave it like this" },
  { id: "verify-it-worked", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function FirstTimeSetupPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>First-time setup</h1>

      <p>
        This article takes you from a delivered, still-packaged BoothIQ
        kiosk to a working welcome screen on the touchscreen. You won&apos;t
        print anything yet — that&apos;s covered in{" "}
        <Link href="/docs/getting-started/your-first-print">
          Your first print
        </Link>{" "}
        — but by the end of this article the booth will be powered on and
        waiting for its first customer.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators or installers receiving
        a BoothIQ kiosk for the first time.
      </p>

      <DocsCallout type="note">
        A BoothIQ kiosk arrives <strong>pre-built and pre-installed</strong>.
        You don&apos;t open Windows, you don&apos;t run an installer, and
        you don&apos;t connect any internal cables. Everything you need is
        inside the BoothIQ admin dashboard, which you&apos;ll reach in{" "}
        <Link href="/docs/getting-started/first-login-and-password">
          First login and password
        </Link>
        .
      </DocsCallout>

      <h2 id="before-you-start">Before you start</h2>

      <ul>
        <li>
          Read{" "}
          <Link href="/docs/getting-started/system-requirements">
            Site and venue requirements
          </Link>{" "}
          and confirm your venue is ready.
        </li>
        <li>
          Read{" "}
          <Link href="/docs/getting-started/what-is-in-the-box">
            What&apos;s in the box
          </Link>{" "}
          and confirm the shipment is complete.
        </li>
        <li>Have your activation details handy in case the kiosk asks for them on first boot.</li>
        <li>Pick the spot where the kiosk will live before you uncrate it. The booth is heavy — you don&apos;t want to move it twice.</li>
      </ul>

      <h2 id="step-1">Step 1: Position the kiosk</h2>

      <ol>
        <li>Move the kiosk to its final spot in the venue.</li>
        <li>Make sure there&apos;s a clear area in front of the booth for customers to stand back and pose.</li>
        <li>Make sure you can reach the printer service door without moving the booth — you&apos;ll need to swap photo media periodically.</li>
        <li>Make sure the power outlet you identified earlier is within reach.</li>
      </ol>

      <h2 id="step-2">Step 2: Connect power</h2>

      <ol>
        <li>Plug the kiosk&apos;s power cable into the booth.</li>
        <li>Plug the other end into your wall outlet (or, if you&apos;re using one, into a UPS first and then the wall).</li>
        <li>
          <strong>Do not turn the booth on yet</strong> if your shipment
          came with a separate Ethernet cable — connect that first in the
          next step.
        </li>
      </ol>

      <h2 id="step-3">Step 3: (Optional) Connect Ethernet</h2>

      <p>
        If you&apos;re using a wired network and your shipment included an
        Ethernet cable:
      </p>

      <ol>
        <li>Plug one end of the Ethernet cable into the kiosk&apos;s network port.</li>
        <li>Plug the other end into your venue&apos;s network jack or switch.</li>
      </ol>

      <p>
        If you&apos;re going to use Wi-Fi instead, skip this step.
        You&apos;ll connect to Wi-Fi from inside the BoothIQ admin
        dashboard later.
      </p>

      <h2 id="step-4">Step 4: Power on the booth</h2>

      <ol>
        <li>Press the kiosk&apos;s power button.</li>
        <li>Wait. The booth will boot the operating system, then launch BoothIQ automatically.</li>
      </ol>

      <p>
        The very first power-on after delivery takes a little longer than
        later boots — sometimes a minute or two — because the kiosk is
        settling in. Subsequent boots are quicker.
      </p>

      <h2 id="step-5">Step 5: Watch BoothIQ start</h2>

      <p>
        You&apos;ll see the screen go through its boot sequence and then
        BoothIQ takes over. After 30-60 seconds you should see the{" "}
        <strong>welcome screen</strong>: a looping background video, soft
        background music, and a glowing <strong>START</strong> button.
      </p>

      <p>That&apos;s BoothIQ running. The booth is now operational from the customer&apos;s point of view.</p>

      <DocsCallout type="important">
        If the booth ever shows a hardware error screen instead of the
        welcome screen, don&apos;t panic — that means BoothIQ booted fine
        but couldn&apos;t reach the camera, printer, or payment device.
        See{" "}
        <Link href="/docs/getting-started/your-first-print">
          Your first print
        </Link>{" "}
        for what to do, or{" "}
        <strong>Troubleshooting › Reading error screens</strong>{" "}
        <em>(coming soon)</em> for the full diagnosis.
      </DocsCallout>

      <h2 id="step-6">Step 6: Don&apos;t leave it like this</h2>

      <p>Before you put the booth in front of paying customers you still need to:</p>

      <ul>
        <li>
          Sign in to the admin dashboard with the default password and
          change it. See{" "}
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>
          .
        </li>
        <li>
          (Optional) Connect the booth to your venue&apos;s Wi-Fi from the{" "}
          <strong>WiFi</strong> tab inside admin.
        </li>
        <li>
          Run a real customer session end-to-end to confirm the camera,
          printer, and (if you have one) payment device are working. See{" "}
          <Link href="/docs/getting-started/your-first-print">
            Your first print
          </Link>
          .
        </li>
        <li>
          (Optional) Register the booth in the BoothIQ cloud dashboard for
          remote monitoring. See{" "}
          <strong>Cloud and Fleet › Registering your booth</strong>{" "}
          <em>(coming soon)</em>.
        </li>
      </ul>

      <h2 id="verify-it-worked">Verify it worked</h2>

      <p>You&apos;re done with first-time setup when:</p>

      <ul>
        <li>The booth is in its final spot in the venue.</li>
        <li>The power cable is plugged in.</li>
        <li>The kiosk powered on without you needing to plug in a keyboard or mouse.</li>
        <li>BoothIQ launched automatically after boot.</li>
        <li>
          The welcome screen is showing with the <strong>START</strong>{" "}
          button.
        </li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <table>
        <thead>
          <tr>
            <th>Symptom</th>
            <th>What&apos;s happening</th>
            <th>What to do</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Booth powers on but the screen stays black</td>
            <td>Power is reaching the PC but the touchscreen isn&apos;t getting a signal</td>
            <td>Power the booth off, wait 10 seconds, and power it back on. If the screen stays black, contact support — there may be an internal cable that came loose in shipping</td>
          </tr>
          <tr>
            <td>Booth boots into Windows instead of BoothIQ</td>
            <td>The auto-start was disabled or BoothIQ failed to launch</td>
            <td>Power-cycle the kiosk. If it still doesn&apos;t auto-launch BoothIQ, contact support</td>
          </tr>
          <tr>
            <td>Welcome screen appears but with a hardware error overlay</td>
            <td>BoothIQ launched but couldn&apos;t reach a piece of hardware (camera, printer, or payment)</td>
            <td>
              Note the error code on screen and see{" "}
              <Link href="/docs/getting-started/your-first-print">
                Your first print
              </Link>{" "}
              Step 1 — you&apos;ll diagnose this from the admin{" "}
              <strong>Diagnostics</strong> tab
            </td>
          </tr>
          <tr>
            <td>The booth is unresponsive to touch</td>
            <td>Touch input is offline</td>
            <td>Power the booth off and back on. Persistent touch problems mean an internal cable issue — contact support</td>
          </tr>
        </tbody>
      </table>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>{" "}
          — Sign in to admin, change the default password, and set up a
          recovery PIN.
        </li>
      </ul>
    </DocsLayout>
  );
}
