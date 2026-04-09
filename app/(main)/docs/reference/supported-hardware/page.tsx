import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Supported hardware — BoothIQ Docs",
  description: "Cameras, printers, and payment devices BoothIQ works with.",
};

const HREF = "/docs/reference/supported-hardware";

const TOC = [
  { id: "camera", label: "Camera" },
  { id: "printer", label: "Printer" },
  { id: "payment", label: "Payment device" },
  { id: "display", label: "Display" },
  { id: "networking", label: "Networking" },
  { id: "web-server", label: "Local web server (Phone Print)" },
  { id: "computer", label: "Computer" },
  { id: "not-supported", label: "What BoothIQ does NOT support" },
  { id: "replacing", label: "Replacing hardware" },
  { id: "spec", label: "Getting your kiosk's spec" },
  { id: "related", label: "Related" },
] as const;

export default function SupportedHardwarePage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Supported hardware</h1>

      <p>BoothIQ kiosks ship with all hardware pre-installed. This article documents what each component is so you can identify it for support and so you understand what BoothIQ supports if you ever need a replacement.</p>

      <h2 id="camera">Camera</h2>

      <ul>
        <li><strong>Type:</strong> USB camera, DirectShow compatible</li>
        <li><strong>Resolution:</strong> 1080p (1920×1080) or higher</li>
        <li><strong>Reference model:</strong> Logitech C920</li>
        <li><strong>Mount:</strong> Internal, mounted at face level inside the booth</li>
        <li><strong>Driver:</strong> Standard Windows DirectShow drivers</li>
        <li><strong>Other supported models:</strong> Theoretically any DirectShow USB camera, but only the C920 is tested</li>
      </ul>

      <p>DSLRs, PTZ cameras, and IP cameras are <strong>not</strong> supported.</p>

      <h2 id="printer">Printer</h2>

      <ul>
        <li><strong>Model:</strong> DNP DS-RX1hs</li>
        <li><strong>Type:</strong> Thermal dye-sub photo printer</li>
        <li><strong>Connection:</strong> USB</li>
        <li><strong>Output sizes:</strong> 2×6 inches (strips) and 4×6 inches</li>
        <li><strong>Yield per roll:</strong> About 700 4×6 prints OR 1400 2×6 strips</li>
        <li><strong>Driver:</strong> Latest DNP DS-RX1hs driver from DNP</li>
        <li><strong>SDK:</strong> CyStat64.dll (DNP-provided)</li>
        <li><strong>Borderless:</strong> Yes</li>
        <li><strong>Print speed:</strong> A few seconds per print</li>
      </ul>

      <p>Other printers are <strong>not</strong> supported in the version of BoothIQ described in these docs.</p>

      <h2 id="payment">Payment device</h2>

      <ul>
        <li><strong>Type:</strong> Pulse-counting coin or bill acceptor (or both)</li>
        <li><strong>Connection:</strong> Serial (RS-232) over a USB-to-serial adapter</li>
        <li><strong>Protocol:</strong> VHMI pulse packets</li>
        <li><strong>Default COM port:</strong> Auto-detected; configurable in Diagnostics</li>
        <li><strong>Currencies:</strong> Configured per-acceptor at the factory; varies by region</li>
      </ul>

      <p>Card readers may be available depending on your kiosk configuration. Talk to your BoothIQ point of contact about supported card payment hardware.</p>

      <h2 id="display">Display</h2>

      <ul>
        <li><strong>Type:</strong> Touchscreen, capacitive multi-touch</li>
        <li><strong>Resolution:</strong> 1920×1080 (1080p)</li>
        <li><strong>Aspect ratio:</strong> 16:9 landscape</li>
        <li><strong>Touch points:</strong> 10-point multi-touch</li>
        <li><strong>Display scale:</strong> 100% (BoothIQ is designed for native 1080p)</li>
      </ul>

      <p>The kiosk&apos;s display is internal and pre-configured. Operators don&apos;t change resolution or scaling.</p>

      <h2 id="networking">Networking</h2>

      <ul>
        <li><strong>Wi-Fi adapter:</strong> Internal, supports the venue Wi-Fi connection AND the local Phone Print hotspot</li>
        <li><strong>Wi-Fi standards:</strong> 802.11. Varies by adapter</li>
        <li><strong>Ethernet:</strong> Standard RJ45 port (where present on your kiosk)</li>
        <li><strong>Library:</strong> ManagedNativeWifi for hotspot management</li>
      </ul>

      <h2 id="web-server">Local web server (Phone Print)</h2>

      <ul>
        <li><strong>Port:</strong> 8080</li>
        <li><strong>Protocol:</strong> HTTP (local network only)</li>
        <li><strong>Firewall rule:</strong> &quot;BoothIQ Photo Upload Server&quot;. Installed automatically by BoothIQ, scoped to local subnet</li>
      </ul>

      <h2 id="computer">Computer</h2>

      <ul>
        <li><strong>OS:</strong> Windows 10 (build 19041+) or Windows 11</li>
        <li><strong>Architecture:</strong> x64</li>
        <li><strong>Storage:</strong> SSD recommended</li>
        <li><strong>RAM:</strong> At least 8 GB recommended</li>
      </ul>

      <p>The kiosk&apos;s PC is a standard Windows touchscreen PC, locked down so customers and operators only see BoothIQ.</p>

      <h2 id="not-supported">What BoothIQ does NOT support</h2>

      <p>Hardware <strong>not</strong> supported in this version:</p>

      <ul>
        <li><strong>DSLR cameras</strong> (Canon, Nikon EOS via tethering)</li>
        <li><strong>Other thermal printers</strong> (HiTi, Mitsubishi, Canon Selphy, Epson)</li>
        <li><strong>Inkjet printers</strong></li>
        <li><strong>Laser printers</strong></li>
        <li><strong>Bluetooth payment devices</strong></li>
        <li><strong>NFC / contactless tap payment</strong> (talk to your contact about card reader options)</li>
        <li><strong>External webcams plugged in by the operator</strong> (the camera is internal)</li>
        <li><strong>Wireless touchscreen extensions</strong></li>
        <li><strong>VR headsets, depth cameras, etc.</strong></li>
      </ul>

      <p>If you need any of these for your venue, talk to your BoothIQ point of contact about whether they&apos;re on the roadmap.</p>

      <h2 id="replacing">Replacing hardware</h2>

      <p>Hardware components are <strong>internal</strong> to the kiosk and not designed for operator replacement. If a piece of hardware fails:</p>

      <ol>
        <li>Confirm the failure is real (run Diagnostics, power-cycle, try the basic troubleshooting).</li>
        <li>Contact BoothIQ support.</li>
        <li>Support arranges a replacement procedure. Sometimes a service visit, sometimes a swap kit they ship to you, sometimes a full kiosk replacement.</li>
      </ol>

      <p><strong>Don&apos;t try to replace components yourself</strong> unless support tells you to. Opening the kiosk enclosure may void warranties and risk damaging other components.</p>

      <h2 id="spec">Getting your specific kiosk&apos;s hardware spec</h2>

      <p>Different kiosks may have slightly different hardware (different camera models, different printer models in older versions, different payment devices). To check your specific kiosk:</p>

      <ol>
        <li>Open admin → Diagnostics tab.</li>
        <li>Look at each hardware section. The model name is usually shown in the status messages.</li>
        <li>For full hardware info, contact support with your <strong>Booth ID</strong>.</li>
      </ol>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Where hardware status is shown.
        </li>
        <li>
          <Link href="/docs/getting-started/what-is-in-the-box">What&apos;s in the box</Link>
          . Components shipped with a kiosk.
        </li>
      </ul>
    </DocsLayout>
  );
}
