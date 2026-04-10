import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "What is BoothIQ? — BoothIQ Docs",
  description:
    "A plain-English overview of BoothIQ for venue operators and installers.",
};

const HREF = "/docs/getting-started/what-is-boothiq";

const TOC = [
  { id: "what-a-customer-does", label: "What a customer does at a BoothIQ booth" },
  { id: "what-boothiq-gives-you", label: "What BoothIQ gives you as the operator" },
  { id: "what-boothiq-is-not", label: "What BoothIQ is not" },
  { id: "whats-inside-a-boothiq-kiosk", label: "What's inside a BoothIQ kiosk" },
  { id: "where-boothiq-stores-data", label: "Where BoothIQ stores data" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function WhatIsBoothIQPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>What is BoothIQ?</h1>

      <p>
        BoothIQ is a complete commercial photobooth kiosk. It&apos;s a
        self-contained, touch-only machine you place in your venue: customers
        walk up, take photos, pay, and walk away with prints — without any
        staff operating it for them. Your job as the operator is to put the
        booth in the right spot, plug it in, and use the built-in admin
        dashboard to manage prices, templates, sales, and hardware. You never
        have to touch Windows, install drivers, or open a browser.
      </p>

      <p>
        <strong>Who this is for:</strong> Venue operators evaluating BoothIQ,
        and installers about to set one up on site.
      </p>

      <h2 id="what-a-customer-does">What a customer does at a BoothIQ booth</h2>

      <ol>
        <li>Walks up to a screen showing a video and a glowing <strong>START</strong> button.</li>
        <li>Picks a product — a photo strip, a 4×6 print, or uploading photos from their phone.</li>
        <li>Picks a template (a layout and design they like).</li>
        <li>Stands in front of the camera, watches a countdown, and takes their photos.</li>
        <li>(Optional) Adds filters, stickers, or extra copies.</li>
        <li>Pays with cash, coins, or card depending on what your booth accepts.</li>
        <li>Picks up their printed photos a few seconds later.</li>
      </ol>

      <p>
        That whole flow runs without staff. The kiosk handles the camera,
        the printer, the money, the receipts, and the cleanup between sessions.
      </p>

      <h2 id="what-boothiq-gives-you">What BoothIQ gives you as the operator</h2>

      <ul>
        <li>
          <strong>A complete, touch-only customer experience</strong> so you
          don&apos;t have to design any screens.
        </li>
        <li>
          <strong>A built-in admin dashboard</strong> for setting prices,
          swapping templates, watching sales, running diagnostics, and
          configuring hardware. You reach it on the kiosk itself with a
          hidden tap sequence and a password.
        </li>
        <li>
          <strong>A locked-down kiosk experience.</strong> BoothIQ launches
          automatically when the booth powers on and stays full-screen. There
          is no Windows desktop, no browser, no Camera app, no Settings menu —
          just BoothIQ. Everything you need to run the booth is inside the
          BoothIQ admin dashboard.
        </li>
        <li>
          <strong>Offline-first operation.</strong> The kiosk keeps working
          if your internet drops. Sales, photos, and credits are stored
          locally and synced to the cloud when the connection comes back.
        </li>
        <li>
          <strong>Cloud sync and fleet management.</strong> When you&apos;re
          online, your booth pushes sales and health data to the BoothIQ
          cloud, and you can pull templates, push remote commands, and watch
          your fleet from a web dashboard <em>(viewed from a separate
          computer or phone, not the kiosk itself)</em>.
        </li>
        <li>
          <strong>Hardware integration out of the box</strong> for the
          built-in camera, the DNP DS-RX1hs thermal printer, the coin/bill
          acceptor, and a built-in Wi-Fi photo upload feature for customer
          phones.
        </li>
        <li>
          <strong>Per-kiosk licensing</strong> so each booth has its own
          activated license tied to its hardware.
        </li>
      </ul>

      <h2 id="what-boothiq-is-not">What BoothIQ is not</h2>

      <ul>
        <li>
          <strong>It is not</strong> a phone app or a website. Customers walk
          up to a physical kiosk.
        </li>
        <li>
          <strong>It is not</strong> an online photo printing service. Photos
          are printed on the kiosk itself, on the spot.
        </li>
        <li>
          <strong>It is not</strong> software you install on your own laptop.
          BoothIQ ships pre-installed and pre-configured on the kiosk
          hardware. You don&apos;t run an installer, you don&apos;t install
          drivers, you don&apos;t manage Windows.
        </li>
      </ul>

      <h2 id="whats-inside-a-boothiq-kiosk">What&apos;s inside a BoothIQ kiosk</h2>

      <p>
        A BoothIQ kiosk arrives as a single unit with all of this already
        wired up and ready to go:
      </p>

      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Touchscreen Windows PC</strong></td>
            <td>
              Runs the BoothIQ software. This is the brain of the booth. It
              boots straight into BoothIQ — operators and customers never see
              the Windows desktop.
            </td>
          </tr>
          <tr>
            <td><strong>Camera</strong></td>
            <td>
              A USB camera mounted at face level inside the booth that
              captures the customer&apos;s photos.
            </td>
          </tr>
          <tr>
            <td><strong>Photo printer</strong></td>
            <td>
              A DNP DS-RX1hs thermal dye-sub printer that produces 2×6 strips
              and 4×6 prints.
            </td>
          </tr>
          <tr>
            <td><strong>Payment device</strong></td>
            <td>
              A coin or bill acceptor (or both) connected to the PC
              internally. Optional if you run the booth in Free Play mode.
            </td>
          </tr>
          <tr>
            <td><strong>Internal cabling</strong></td>
            <td>
              Power, USB, and serial cables are connected inside the
              enclosure. You don&apos;t have to wire anything yourself.
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        You&apos;ll see the same components again in{" "}
        <Link href="/docs/getting-started/what-is-in-the-box">
          What&apos;s in the box
        </Link>{" "}
        with a little more detail.
      </p>

      <h2 id="where-boothiq-stores-data">Where BoothIQ stores data</h2>

      <ul>
        <li>
          <strong>On the kiosk:</strong> A local database holds your sales,
          templates, settings, admin accounts, and credit history. It lives
          on the kiosk&apos;s internal storage and is preserved across power
          cycles and software updates. You manage backups from inside the
          BoothIQ admin dashboard.
        </li>
        <li>
          <strong>In the cloud:</strong> When the booth is online and
          registered, transactions, heartbeats, and templates sync up to the
          BoothIQ cloud. Photos themselves stay on the kiosk by default.
        </li>
      </ul>

      <p>
        You&apos;ll learn how to control what&apos;s stored and what&apos;s
        synced in the <strong>Admin Dashboard › Settings</strong> section{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/getting-started/how-it-works">How it works</Link>{" "}
          — Walk through the customer experience screen by screen.
        </li>
        <li>
          <Link href="/docs/getting-started/system-requirements">
            Site and venue requirements
          </Link>{" "}
          — What your venue needs to provide for the kiosk.
        </li>
      </ul>
    </DocsLayout>
  );
}
