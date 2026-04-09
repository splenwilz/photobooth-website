import type { Metadata } from "next";
import Link from "next/link";
import { DocsCallout, DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Your first print — BoothIQ Docs",
  description:
    "Run an end-to-end smoke test to confirm BoothIQ, the camera, the printer, and (optionally) payment all work.",
};

const HREF = "/docs/getting-started/your-first-print";

const TOC = [
  { id: "before-you-start", label: "Before you start" },
  { id: "step-1", label: "Step 1: Confirm hardware is healthy" },
  { id: "step-2", label: "Step 2: Switch to Free Play" },
  { id: "step-3", label: "Step 3: Run a customer session" },
  { id: "step-4", label: "Step 4: Pick up the print" },
  { id: "step-5", label: "Step 5: Switch back to Coin Operated" },
  { id: "verify-it-worked", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "whats-next", label: "What's next" },
] as const;

export default function YourFirstPrintPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Your first print</h1>

      <p>
        This is the final article in Getting Started. By the end of it
        you&apos;ll have walked the booth through a complete customer
        session — from the welcome screen to a real photo coming out of the
        printer — and you&apos;ll know your kiosk is ready for the floor.
      </p>

      <p>
        <strong>Who this is for:</strong> Installers finishing a brand-new
        kiosk, or operators who just moved a kiosk to a new venue and want
        to confirm it still works.
      </p>

      <DocsCallout type="note">
        Think of this as a smoke test, not a full QA pass. We&apos;re
        confirming the <strong>happy path</strong> works end-to-end. Edge
        cases (jams, declined cards, network drops) belong in{" "}
        <strong>Troubleshooting</strong> <em>(coming soon)</em>.
      </DocsCallout>

      <h2 id="before-you-start">Before you start</h2>

      <p>Confirm:</p>

      <ul>
        <li>The kiosk is powered on and the welcome screen is showing.</li>
        <li>
          You&apos;ve already signed in to admin once and changed the
          default passwords (see{" "}
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>
          ).
        </li>
        <li>The DNP DS-RX1hs has photo media loaded.</li>
        <li>
          (If your booth has one) The payment device is enabled. If you
          don&apos;t have one or you want to skip payment for the test,
          we&apos;ll switch the booth to <strong>Free Play</strong> before
          running the test.
        </li>
      </ul>

      <h2 id="step-1">Step 1: Confirm hardware is healthy from admin</h2>

      <p>
        Before you spend a print, make sure the booth thinks all its
        hardware is online.
      </p>

      <ol>
        <li>From the welcome screen, tap the credits indicator <strong>5 times</strong> to open the admin login.</li>
        <li>Sign in as <code>admin</code> with your new password.</li>
        <li>
          In the dashboard header bar, look at the three hardware pills:
          <ul>
            <li><strong>Camera</strong> — should be green.</li>
            <li><strong>Printer</strong> — should be green.</li>
            <li><strong>PCB</strong> — should be green if you have a payment device, or you can ignore it for the test if you&apos;re going to use Free Play.</li>
          </ul>
        </li>
        <li>
          Look at the <strong>Prints</strong> indicator — it should show a
          number greater than zero. If it shows <code>--</code> the
          printer hasn&apos;t reported its media level yet; give it a few
          seconds and look again.
        </li>
      </ol>

      <p>
        If any pill is red, jump to <strong>Troubleshooting</strong>{" "}
        <em>(coming soon)</em> before continuing — there&apos;s no point
        running a test print on hardware the booth already knows is broken.
      </p>

      <DocsCallout type="tip" title="Diagnostics tab is your deeper view">
        Tap <strong>Diagnostics</strong> in the sidebar for camera,
        printer, and PCB tests with live status, COM port info, and a
        printer test-print button. We cover this tab in detail in{" "}
        <strong>Admin Dashboard › Diagnostics tab</strong>{" "}
        <em>(coming soon)</em>.
      </DocsCallout>

      <h2 id="step-2">Step 2: (Optional) Switch to Free Play for the test</h2>

      <p>If you don&apos;t want to insert real money to run this test:</p>

      <ol>
        <li>In the admin dashboard, open the <strong>Settings</strong> tab.</li>
        <li>Find the <strong>Mode</strong> section.</li>
        <li>Switch the operation mode from <strong>Coin Operated</strong> to <strong>Free Play</strong>.</li>
        <li>Save.</li>
        <li>Confirm the header bar <strong>Mode</strong> indicator now reads <strong>Free Play</strong>.</li>
      </ol>

      <p>This lets you walk through the customer flow without paying.</p>

      <p>You can switch the booth back to Coin Operated after the test print works.</p>

      <h2 id="step-3">Step 3: Run a customer session</h2>

      <p>Now act like a customer.</p>

      <ol>
        <li>Tap <strong>Exit Admin</strong> at the bottom of the sidebar to leave the dashboard.</li>
        <li>From the welcome screen, tap <strong>START</strong>.</li>
        <li>On the product selection screen, tap <strong>Photo Strips</strong> (or whatever product is enabled — strips is the simplest because it doesn&apos;t ask for any extras).</li>
        <li>On the template selection screen, pick the first template in the carousel and tap <strong>Continue</strong>.</li>
        <li>
          The camera screen will appear and start a countdown.{" "}
          <strong>Stand in front of the camera</strong> so the photos
          aren&apos;t of an empty booth.
          <ul>
            <li>The kiosk counts down <code>3 … 2 … 1 … Smile</code>.</li>
            <li>The screen flashes white.</li>
            <li>The captured photo appears as a tab.</li>
            <li>If the template needs more photos, the next countdown starts immediately.</li>
          </ul>
        </li>
        <li>After the last photo, the offer screen appears. Tap <strong>Continue</strong> (don&apos;t bother with filters or stickers for the smoke test).</li>
        <li>The extra prints screen appears. Tap <strong>Skip</strong> or just leave the defaults and continue.</li>
        <li>
          The payment screen appears.
          <ul>
            <li>If you switched to <strong>Free Play</strong>, BoothIQ recognizes there&apos;s nothing to charge and proceeds straight through.</li>
            <li>If you&apos;re in <strong>Coin Operated</strong> mode, insert enough coins or bills to cover the displayed total. The booth advances automatically as soon as your credits reach the total.</li>
          </ul>
        </li>
        <li>The printing screen appears with an estimated time and the printer starts producing the photo.</li>
        <li>The thank-you screen appears.</li>
        <li>The booth returns to the welcome screen.</li>
      </ol>

      <h2 id="step-4">Step 4: Pick up the print</h2>

      <p>
        Walk around to the printer and grab the print as it ejects.
        Confirm:
      </p>

      <ul>
        <li>The print is <strong>borderless</strong> (no white margin around the photos).</li>
        <li>The colors look right — no streaks, banding, or weird tints.</li>
        <li>The photo areas are filled with what the camera captured (no big empty rectangles).</li>
        <li>If you used a strip template, you can see all the photos the template called for.</li>
      </ul>

      <p>If the print looks good, congratulations — your booth is working end-to-end.</p>

      <h2 id="step-5">Step 5: Switch back to Coin Operated (if you changed it)</h2>

      <p>If you flipped the booth into Free Play for the test:</p>

      <ol>
        <li>5-tap into admin again.</li>
        <li><strong>Settings → Mode → Coin Operated.</strong></li>
        <li>Save.</li>
        <li>Confirm the header bar shows <strong>Coin Operated</strong> again.</li>
      </ol>

      <p>The booth will now charge customers again.</p>

      <h2 id="verify-it-worked">Verify it worked</h2>

      <p>You&apos;re done when:</p>

      <ul>
        <li>All three hardware pills (Camera, Printer, PCB) are green in the admin header.</li>
        <li>You completed a full customer session, from <strong>START</strong> to <strong>Thank you</strong>, without any error screens.</li>
        <li>A real, borderless, correctly-colored photo came out of the printer.</li>
        <li>The booth returned to the welcome screen by itself.</li>
        <li>(If you used Free Play for the test) the booth is back in Coin Operated mode.</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <table>
        <thead>
          <tr>
            <th>Symptom</th>
            <th>Likely fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Camera pill is red</td>
            <td>Open the <strong>Diagnostics</strong> tab and look for an error message under the camera section. If the camera is reported as missing or in use, power-cycle the kiosk and check again. Persistent camera failures need support — contact BoothIQ.</td>
          </tr>
          <tr>
            <td>Printer pill is red</td>
            <td>Open the <strong>Diagnostics</strong> tab and check the printer status. Common causes: out of paper, jammed media, printer door open, or the printer needs to be power-cycled. If the printer status reports an error code, note it for support.</td>
          </tr>
          <tr>
            <td>The booth gets to the payment screen and never advances even with coins inserted</td>
            <td>The PCB pill is probably red or the COM port the booth is listening on is wrong. Open the <strong>Diagnostics → PCB</strong> section <em>(coming soon)</em> and confirm BoothIQ is showing pulse activity when you insert money.</td>
          </tr>
          <tr>
            <td>Print comes out with a white border</td>
            <td>The template you picked has its own border baked in, or borderless printing has been turned off in the BoothIQ settings. Try a different template; if every template prints with a border, contact support.</td>
          </tr>
          <tr>
            <td>Print comes out streaked or with the wrong colors</td>
            <td>The dye-sub ribbon may need to be reseated, or the media itself may be defective. Open the printer&apos;s service door, swap to a fresh roll, and try again.</td>
          </tr>
          <tr>
            <td>The photos in the print are out of position</td>
            <td>The template you picked uses a layout that doesn&apos;t match what you expected. Try a different template from the carousel.</td>
          </tr>
          <tr>
            <td>Booth shows a hardware error screen mid-session</td>
            <td>Read the error code on the screen and look it up in <strong>Troubleshooting › Reading error screens</strong> <em>(coming soon)</em>.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="whats-next">What&apos;s next</h2>

      <p>
        You&apos;ve finished Getting Started. The booth is installed,
        secured, and proven to work end-to-end. From here, the next
        sections of the docs are organized by what you need to do next:
      </p>

      <ul>
        <li><strong>Installation</strong> <em>(coming soon)</em> — Deeper hardware setup if you skipped or improvised any of the connections in this section.</li>
        <li><strong>Admin Dashboard</strong> <em>(coming soon)</em> — Tour every tab so you know where everything is.</li>
        <li><strong>Running Your Booth</strong> <em>(coming soon)</em> — Pricing, templates, sales reports, daily checklists, and staff accounts.</li>
        <li><strong>Cloud and Fleet</strong> <em>(coming soon)</em> — Register the booth in the cloud dashboard for remote monitoring.</li>
        <li><strong>Maintenance</strong> <em>(coming soon)</em> — Print rolls, cleaning, backups, updates.</li>
        <li><strong>Troubleshooting</strong> <em>(coming soon)</em> — When something goes wrong on the floor.</li>
      </ul>

      <p>Welcome to BoothIQ.</p>
    </DocsLayout>
  );
}
