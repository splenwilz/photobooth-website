import type { Metadata } from "next";
import Link from "next/link";
import { DocsCallout, DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "What's in the box — BoothIQ Docs",
  description:
    "The components shipped with a BoothIQ kiosk and the role each one plays.",
};

const HREF = "/docs/getting-started/what-is-in-the-box";

const TOC = [
  { id: "what-ships-with-the-kiosk", label: "What ships with the kiosk" },
  { id: "the-kiosk-enclosure", label: "The kiosk enclosure" },
  { id: "dnp-photo-media", label: "DNP photo media" },
  { id: "power-cable", label: "Power cable" },
  { id: "network-gear", label: "Network gear" },
  { id: "activation-details", label: "Activation details" },
  { id: "what-you-do-not-get", label: "What you do not get" },
  { id: "verify-it-worked", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function WhatIsInTheBoxPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>What&apos;s in the box</h1>

      <p>
        A BoothIQ kiosk arrives as a single self-contained unit. The PC,
        touchscreen, camera, printer, and payment device are already mounted
        inside the enclosure and wired to each other. You don&apos;t have to
        assemble anything internally — you&apos;ll only handle external
        items like power, network, and consumables.
      </p>

      <p>
        This article tells you what each component is for so you know
        what&apos;s actually working behind the screen.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators receiving a kiosk for
        the first time, and installers verifying the shipment is complete.
      </p>

      <h2 id="what-ships-with-the-kiosk">What ships with the kiosk</h2>

      <p>When the kiosk arrives, expect:</p>

      <ul>
        <li>The kiosk itself (PC, touchscreen, camera, printer, and payment device pre-installed inside one enclosure)</li>
        <li>One or more boxes of DNP photo media (paper roll + ribbon)</li>
        <li>Power cable for the kiosk</li>
        <li>(Sometimes) An Ethernet cable, if your shipment includes networking gear</li>
        <li>Documentation pack with your activation details, account info, and a quick-start card</li>
      </ul>

      <p>
        If anything in this list is missing or damaged on arrival, contact
        BoothIQ support <strong>before</strong> powering the kiosk on.
      </p>

      <h2 id="the-kiosk-enclosure">The kiosk enclosure</h2>

      <p>Everything that runs the booth lives inside the kiosk:</p>

      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Touchscreen Windows PC</strong></td>
            <td>The brain. Boots straight into BoothIQ — no Windows desktop, no other apps.</td>
          </tr>
          <tr>
            <td><strong>Touchscreen display</strong></td>
            <td>A 1080p multi-touch screen. This is the only thing customers and operators interact with.</td>
          </tr>
          <tr>
            <td><strong>Camera</strong></td>
            <td>A USB camera mounted at face height behind the screen, pointed at where the customer stands.</td>
          </tr>
          <tr>
            <td><strong>DNP DS-RX1hs printer</strong></td>
            <td>A thermal dye-sub photo printer that produces 2×6 strips and 4×6 prints. Lives in a serviceable bay so you can change media without opening the whole booth.</td>
          </tr>
          <tr>
            <td><strong>Coin / bill acceptor</strong> <em>(optional)</em></td>
            <td>Wired internally to a serial port on the PC. The booth converts every accepted coin or bill into customer credits in real time.</td>
          </tr>
          <tr>
            <td><strong>Internal cabling</strong></td>
            <td>Power, USB, and serial cables are run inside the enclosure and secured. You don&apos;t unplug or rewire any of this during normal operation.</td>
          </tr>
        </tbody>
      </table>

      <p>
        You&apos;ll see all of these surfaced in the BoothIQ admin
        dashboard — the <strong>Diagnostics</strong> tab shows live status
        for the camera, printer, and payment device, and the dashboard
        header shows the same status as small green/red pills.
      </p>

      <h2 id="dnp-photo-media">DNP photo media</h2>

      <p>
        You&apos;ll get one or more boxes of DNP dye-sub media. Each box
        contains a roll of paper and a matching ribbon.{" "}
        <strong>Genuine DNP media is required</strong> — third-party paper
        and ribbons will not work and may damage the printer.
      </p>

      <p>A typical fresh roll yields:</p>

      <ul>
        <li>
          <strong>About 700</strong> 4×6 prints, <strong>or</strong>
        </li>
        <li>
          <strong>About 1400</strong> 2×6 strips (each strip is half a 4×6)
        </li>
      </ul>

      <p>
        BoothIQ tracks your remaining prints in the admin dashboard so
        you&apos;ll see a low-paper warning before you run out mid-event.
        Loading a fresh roll is covered in{" "}
        <strong>Maintenance › Changing the print roll</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <DocsCallout type="tip">
        Store unused media in its sealed box, away from heat and direct
        sun, until you&apos;re ready to load it.
      </DocsCallout>

      <h2 id="power-cable">Power cable</h2>

      <p>
        The kiosk has a single external power input — usually a standard
        kettle-style cable. That one cable powers everything inside the
        booth, including the printer and the payment device.
      </p>

      <h2 id="network-gear">
        Network gear <em>(optional, varies by shipment)</em>
      </h2>

      <p>Depending on what you ordered, your shipment may include:</p>

      <ul>
        <li>
          An <strong>Ethernet cable</strong> — for plugging the booth into
          your venue&apos;s wired network.
        </li>
        <li>
          Nothing extra — in which case you&apos;ll connect the booth to
          your venue&apos;s Wi-Fi from the <strong>WiFi</strong> tab inside
          the BoothIQ admin dashboard after first power-on.
        </li>
      </ul>

      <p>
        The booth&apos;s built-in <strong>Phone Print</strong> feature
        creates its own local Wi-Fi network for customer phones. That
        doesn&apos;t need any extra hardware — it uses the kiosk PC&apos;s
        internal Wi-Fi adapter.
      </p>

      <h2 id="activation-details">Activation details</h2>

      <p>
        Each BoothIQ kiosk has its own license tied to its hardware. Your
        shipment (or your account email) should include either:
      </p>

      <ul>
        <li>A pre-activated license that&apos;s already loaded on the kiosk, or</li>
        <li>Activation instructions if your kiosk needs to be activated on first boot</li>
      </ul>

      <p>
        In most cases the kiosk arrives <strong>already activated</strong>{" "}
        and you don&apos;t need to do anything with these details. Keep
        them in your records anyway — you&apos;ll need them again if
        support asks for them, or if the kiosk is ever moved between
        accounts.
      </p>

      <h2 id="what-you-do-not-get">
        What you do <strong>not</strong> get (and don&apos;t need)
      </h2>

      <ul>
        <li>A keyboard or mouse — the booth is touch-only.</li>
        <li>A separate camera, printer, or payment device — they&apos;re already inside.</li>
        <li>A Windows install disc, driver disc, or BoothIQ installer — the OS and BoothIQ are pre-installed and locked down.</li>
        <li>Speakers — the booth has internal audio for voice prompts and background music.</li>
        <li>A monitor for the operator — you operate the booth on its own touchscreen.</li>
      </ul>

      <h2 id="verify-it-worked">Verify it worked</h2>

      <p>Before you move on, confirm:</p>

      <ul>
        <li>The kiosk arrived without obvious shipping damage.</li>
        <li>You have at least one box of DNP media.</li>
        <li>You have the power cable.</li>
        <li>You have your activation details (even if the kiosk is pre-activated).</li>
        <li>
          You know where you&apos;re going to put the booth — see{" "}
          <Link href="/docs/getting-started/system-requirements">
            Site and venue requirements
          </Link>{" "}
          if you haven&apos;t planned the spot yet.
        </li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/getting-started/first-time-setup">
            First-time setup
          </Link>{" "}
          — Power the booth on and reach the welcome screen.
        </li>
      </ul>
    </DocsLayout>
  );
}
