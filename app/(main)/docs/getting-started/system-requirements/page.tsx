import type { Metadata } from "next";
import Link from "next/link";
import { DocsCallout, DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Site and venue requirements — BoothIQ Docs",
  description:
    "What your venue needs to provide so a BoothIQ kiosk can be installed and operated.",
};

const HREF = "/docs/getting-started/system-requirements";

const TOC = [
  { id: "floor-space", label: "Floor space" },
  { id: "power", label: "Power" },
  { id: "lighting", label: "Lighting" },
  { id: "network", label: "Network (optional but recommended)" },
  { id: "environmental", label: "Environmental" },
  { id: "what-you-do-not-need", label: "What you do not need" },
  { id: "verify-your-venue-is-ready", label: "Verify your venue is ready" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function SystemRequirementsPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Site and venue requirements</h1>

      <p>
        A BoothIQ kiosk arrives pre-built. The hardware (PC, touchscreen,
        camera, printer, payment device) is already inside the enclosure,
        the operating system is locked down, and BoothIQ is already
        installed and configured. You don&apos;t need to choose hardware,
        install drivers, or manage Windows.
      </p>

      <p>
        What you <strong>do</strong> need is a venue ready to receive the
        kiosk: somewhere to put it, power to plug it into, and (ideally) a
        network connection. This article tells you what your space needs
        to provide.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators planning where a kiosk
        will live, and installers verifying a venue is ready before the
        kiosk is delivered.
      </p>

      <h2 id="floor-space">Floor space</h2>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Footprint</strong></td>
            <td>Plan for the kiosk&apos;s full footprint plus a clear area in front for customers to stand and pose</td>
          </tr>
          <tr>
            <td><strong>Customer area</strong></td>
            <td>At least 4 ft (1.2 m) of clear floor in front of the kiosk so customers can stand back to be in frame</td>
          </tr>
          <tr>
            <td><strong>Walk-around</strong></td>
            <td>Leave room behind or beside the kiosk so a technician can reach the printer paper door without moving the booth</td>
          </tr>
          <tr>
            <td><strong>Surface</strong></td>
            <td>A flat, level floor — carpet is fine if the kiosk has a stable base</td>
          </tr>
        </tbody>
      </table>

      <p>
        If you&apos;re putting the booth in a tight space (a hallway, a
        photo nook, a corner of a bar), measure the kiosk&apos;s outside
        dimensions before delivery — your BoothIQ point of contact can give
        you exact numbers for the model you&apos;re getting.
      </p>

      <h2 id="power">Power</h2>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Outlet</strong></td>
            <td>One standard wall outlet near the kiosk location (100-240 V depending on your country)</td>
          </tr>
          <tr>
            <td><strong>Circuit</strong></td>
            <td>A regular branch circuit is enough; the kiosk doesn&apos;t need a dedicated line</td>
          </tr>
          <tr>
            <td><strong>UPS</strong></td>
            <td>Strongly recommended — a brief power blip mid-print can waste media. Any small consumer UPS the kiosk plugs into is fine</td>
          </tr>
          <tr>
            <td><strong>Cable run</strong></td>
            <td>If the outlet isn&apos;t directly behind the kiosk, hide or rate-protect the run so customers don&apos;t trip on it</td>
          </tr>
        </tbody>
      </table>

      <h2 id="lighting">Lighting</h2>

      <p>
        The customer experience depends on the camera being able to see
        your customers. The booth has its own internal camera, but lighting
        in the room still matters.
      </p>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Brightness</strong></td>
            <td>Even, indirect light at face level. The booth doesn&apos;t need studio lighting, but it should not be in a dark corner</td>
          </tr>
          <tr>
            <td><strong>Direction</strong></td>
            <td>Avoid bright lights <em>behind</em> the customer (windows, spotlights) — they cause silhouetting</td>
          </tr>
          <tr>
            <td><strong>Color temperature</strong></td>
            <td>Mixed lighting is fine; the camera handles white balance automatically</td>
          </tr>
          <tr>
            <td><strong>Outdoor</strong></td>
            <td>Not recommended. If the venue is outdoor, the booth needs cover from rain and direct sun</td>
          </tr>
        </tbody>
      </table>

      <h2 id="network">Network (optional but recommended)</h2>

      <p>
        A BoothIQ kiosk works completely offline. The customer experience
        does not need internet at all. But if you connect the booth to your
        network, you unlock:
      </p>

      <ul>
        <li>Cloud sync of sales and credit history</li>
        <li>Remote monitoring and alerts from the cloud dashboard</li>
        <li>Template downloads and updates from your cloud library</li>
        <li>Remote commands (reboot, add credits, log download)</li>
        <li>License renewal</li>
      </ul>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Internet speed</strong></td>
            <td>5 Mbps download / 1 Mbps upload minimum</td>
          </tr>
          <tr>
            <td><strong>Connection type</strong></td>
            <td>Wi-Fi or Ethernet — both supported. Ethernet is more reliable</td>
          </tr>
          <tr>
            <td><strong>Outbound ports</strong></td>
            <td>HTTPS (TCP 443) to the BoothIQ cloud API. No inbound ports from the public internet are required</td>
          </tr>
          <tr>
            <td><strong>Wi-Fi setup</strong></td>
            <td>Done from the <strong>WiFi</strong> tab inside the BoothIQ admin dashboard — you don&apos;t need to connect at the Windows level</td>
          </tr>
        </tbody>
      </table>

      <p>
        If your venue has a captive portal Wi-Fi (the kind that pops up a
        browser login page), tell your BoothIQ contact ahead of time —
        captive portals don&apos;t work well with locked-down kiosks, and
        you may need a separate guest SSID or an Ethernet drop.
      </p>

      <DocsCallout type="note">
        <strong>Phone Print</strong> is a separate feature: the booth itself
        creates its own local Wi-Fi network so customers can upload photos
        from their phones. This does not need internet, and it does not
        depend on your venue&apos;s Wi-Fi.
      </DocsCallout>

      <h2 id="environmental">Environmental</h2>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Temperature</strong></td>
            <td>Indoor room temperature — roughly 50-90°F (10-32°C)</td>
          </tr>
          <tr>
            <td><strong>Humidity</strong></td>
            <td>Normal indoor humidity. Avoid bathrooms, pool decks, and uncovered outdoor areas</td>
          </tr>
          <tr>
            <td><strong>Dust</strong></td>
            <td>Avoid heavy dust environments (workshops, construction zones). The thermal printer is sensitive to dust</td>
          </tr>
          <tr>
            <td><strong>Vibration</strong></td>
            <td>Not on a moving surface (no boats, trailers, or active dance floors)</td>
          </tr>
        </tbody>
      </table>

      <h2 id="what-you-do-not-need">What you do <strong>not</strong> need</h2>

      <ul>
        <li>A Windows PC to install BoothIQ on. The kiosk arrives with everything pre-installed.</li>
        <li>A separate camera, printer, or payment device. They&apos;re already inside the booth.</li>
        <li>Driver installation, Windows Update, display calibration, or any other operating-system setup.</li>
        <li>A keyboard or mouse. The booth is touch-only.</li>
        <li>Anti-virus software, browser, or office suite — the kiosk is locked down to BoothIQ.</li>
      </ul>

      <p>
        If something on this list shows up in another doc, it&apos;s
        outdated — let support know.
      </p>

      <h2 id="verify-your-venue-is-ready">Verify your venue is ready</h2>

      <p>You&apos;re ready to receive a BoothIQ kiosk when:</p>

      <ul>
        <li>You&apos;ve identified the spot the booth will live, with enough space in front for customers to stand back.</li>
        <li>There&apos;s a working power outlet within reach of that spot.</li>
        <li>Lighting at face level is reasonable — not pitch dark, not bright back-lighting.</li>
        <li>(Optional) You have either a Wi-Fi network you can give the booth, or an Ethernet drop within reach.</li>
        <li>Temperature and humidity are normal indoor conditions.</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/getting-started/what-is-in-the-box">
            What&apos;s in the box
          </Link>{" "}
          — See the components a BoothIQ kiosk ships with.
        </li>
        <li>
          <Link href="/docs/getting-started/first-time-setup">
            First-time setup
          </Link>{" "}
          — Power on the booth and reach the welcome screen.
        </li>
      </ul>
    </DocsLayout>
  );
}
