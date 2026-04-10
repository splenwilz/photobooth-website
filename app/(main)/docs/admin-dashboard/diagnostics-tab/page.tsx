import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Diagnostics tab — BoothIQ Docs",
  description:
    "A tour of the Diagnostics tab: hardware status cards, 'Run All Tests', and individual hardware tests.",
};

const HREF = "/docs/admin-dashboard/diagnostics-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout", label: "Layout" },
  { id: "run-all", label: "\"Run All Tests\" button" },
  { id: "status-cards", label: "Hardware status cards" },
  { id: "per-component", label: "Per-component sections" },
  { id: "usb-debug", label: "USB Hang Debug section" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "diagnostics-first", label: "Diagnostics is where Troubleshooting starts" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function DiagnosticsTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Diagnostics tab</h1>

      <p>
        The <strong>Diagnostics</strong> tab is where you check the
        health of every piece of hardware in the booth (camera,
        printer, payment device) and run tests to confirm they&apos;re
        really working. The header pills in the dashboard already give
        you a green/red glance, but Diagnostics is where you go for
        the full picture.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators investigating a
        hardware problem or doing a pre-shift sanity check.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>See <strong>detailed status</strong> for camera, printer, and PCB (payment device) at the same time</li>
        <li>Run <strong>Run All Tests</strong> to exercise everything at once</li>
        <li>Run <strong>per-component tests</strong> (camera test capture, printer test print, PCB pulse listener)</li>
        <li>See <strong>error messages</strong> for components that are reporting problems</li>
        <li>Adjust <strong>camera settings</strong> (brightness, zoom, contrast) on supported cameras</li>
        <li>See the <strong>printer&apos;s media level</strong></li>
      </ul>

      <h2 id="layout">Layout</h2>

      <p>Top to bottom:</p>

      <ol>
        <li>Page header. Title &quot;System Diagnostics&quot; with subtitle &quot;Test hardware components and monitor system health&quot;</li>
        <li><strong>Run All Tests</strong> button at top right</li>
        <li><strong>Hardware status cards row</strong>. Camera, Printer, PCB in a 3-column layout</li>
        <li>Per-component sections with tests, settings, and error details below</li>
      </ol>

      <DocsScreenshot
        src="diagnostics-tab-full.png"
        alt="Diagnostics tab with the hardware status cards row and per-component sections."
      />

      <h2 id="run-all">&quot;Run All Tests&quot; button</h2>

      <p>
        The big teal button at the top right of the page. Tap it to
        run every available hardware test in sequence:
      </p>

      <ul>
        <li>Camera initialization and frame capture</li>
        <li>Printer status query and (optionally) a test print</li>
        <li>PCB connection check and pulse listener test</li>
      </ul>

      <p>
        Each test reports its result in the corresponding status card.
        Use this when you want a fast &quot;is everything healthy&quot;
        answer without tapping six different test buttons.
      </p>

      <h2 id="status-cards">Hardware status cards</h2>

      <p>The three status cards each show:</p>

      <ul>
        <li>The <strong>component name</strong> (Camera / Printer / PCB)</li>
        <li>
          A <strong>status pill</strong> with the current state. Typical values:
          <ul>
            <li><strong>Active</strong> (green). The component is online and working</li>
            <li><strong>Inactive</strong> (red/amber). Not detected or not initialized</li>
            <li><strong>Error</strong> (red). Detected but reporting a fault</li>
          </ul>
        </li>
        <li>A <strong>status message</strong>. Short text describing the state (e.g. &quot;No camera detected&quot;, &quot;Out of paper&quot;, &quot;Listening on COM3&quot;)</li>
        <li>A <strong>teal icon</strong> representing the component</li>
      </ul>

      <DocsScreenshot
        src="diagnostics-status-cards.png"
        alt="Diagnostics hardware status cards row showing Camera, Printer, and PCB pills."
      />

      <h3>Camera card</h3>
      <p>Default status when no camera is detected: <strong>Inactive</strong> with the message &quot;No camera detected&quot;.</p>
      <p>When working: <strong>Active</strong> with a message describing the camera (model, resolution).</p>

      <h3>Printer card</h3>
      <p>Default status when the printer is unreachable: <strong>Error</strong> with a description of the problem.</p>
      <p>When working: <strong>Active</strong> with a message about the connected printer and current media level.</p>

      <h3>PCB card</h3>
      <p>Shows the connection state of the payment device. When listening: <strong>Active</strong> with the COM port. When offline: red status with an error.</p>

      <h2 id="per-component">Per-component sections</h2>

      <p>
        Below the status cards, each component has its own dedicated
        section with deeper controls and information.
      </p>

      <h3>Camera section</h3>
      <ul>
        <li><strong>Camera selector</strong>. Dropdown to choose which camera to use, if multiple are detected</li>
        <li><strong>Brightness slider</strong>. 0-100, persisted to the database</li>
        <li><strong>Zoom slider</strong>. 0-200%, persisted as a setting</li>
        <li><strong>Contrast slider</strong>. 0-100, persisted to the database</li>
        <li><strong>Test capture button</strong>. Takes a single photo and shows the preview</li>
      </ul>
      <p>Use these to tune the image for your venue&apos;s lighting. The settings persist across booth restarts.</p>

      <h3>Printer section</h3>
      <ul>
        <li><strong>Printer status panel</strong>. Model name, paper level percentage, last error</li>
        <li><strong>Test Print button</strong>. Sends a test print job to the DNP printer</li>
        <li><strong>Media tracking</strong>. Shows estimated prints remaining</li>
      </ul>
      <p>If the test print succeeds, the printer is healthy and BoothIQ can use it for customer sessions. If it fails, read the error message in the status panel.</p>

      <h3>PCB section</h3>
      <ul>
        <li><strong>COM port selector</strong>. Dropdown of available serial ports; pick the one the payment device is on</li>
        <li><strong>Listening status</strong>. Shows whether BoothIQ is currently listening on the selected port</li>
        <li><strong>Pulse activity</strong>. A live view of pulses being received (you can insert a test coin and watch the count update)</li>
        <li><strong>Connection error message</strong>. If the port can&apos;t be opened, the reason is shown here</li>
      </ul>
      <p>If you don&apos;t have a payment device, this section will be in an idle / offline state. That&apos;s expected.</p>

      <h2 id="usb-debug">USB Hang Debug section</h2>

      <p>
        An advanced section for troubleshooting USB hardware hangs.
        Most operators won&apos;t need it. If support asks you to
        capture USB diagnostic output, this is where it lives.
      </p>

      <h2 id="verify">Verify it worked</h2>

      <p>You can use the Diagnostics tab effectively when you can:</p>

      <ul>
        <li>Tell at a glance which (if any) component is in trouble</li>
        <li>Run a test capture and see the resulting photo</li>
        <li>Run a test print and see the result come out of the printer</li>
        <li>Read the COM port the PCB is listening on</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Camera card always shows &quot;Inactive&quot;.</strong></p>
      <p>The camera was disconnected during boot, or another process is holding it. Power-cycle the kiosk.</p>

      <p><strong>Printer card shows &quot;Error&quot; but the printer is on.</strong></p>
      <p>The DNP SDK lost the printer. Power-cycle the printer (turn it off, wait, turn it on) and watch the card update.</p>

      <p><strong>PCB card shows &quot;Listening&quot; but no pulses arrive when you insert coins.</strong></p>
      <p>Wrong COM port, or the payment device is faulty. Try a different COM port from the dropdown. If none work, the device is faulty. Contact support.</p>

      <p><strong>Test print queues but nothing prints.</strong></p>
      <p>Printer is offline or out of paper. Check the printer card&apos;s status message.</p>

      <p><strong>Camera test capture is dark or washed out.</strong></p>
      <p>Brightness or contrast is set wrong. Adjust the sliders and re-test.</p>

      <h2 id="diagnostics-first">Diagnostics is where Troubleshooting starts</h2>

      <p>
        When something on the floor goes wrong, the Diagnostics tab is
        the first place to look. Every troubleshooting article in{" "}
        <strong>Troubleshooting</strong> <em>(coming soon)</em>{" "}
        assumes you&apos;ve already checked the relevant Diagnostics
        section.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link>
          . Cloud connectivity, separate from physical hardware.
        </li>
        <li><strong>Troubleshooting › Camera not working</strong> <em>(coming soon)</em>. When the Camera card stays red.</li>
        <li><strong>Troubleshooting › Printer issues</strong> <em>(coming soon)</em>. When the Printer card stays red.</li>
      </ul>
    </DocsLayout>
  );
}
