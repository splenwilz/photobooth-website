import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Printer issues — BoothIQ Docs",
  description:
    "Printer offline, paper jams, weird colors, white borders, prints not coming out.",
};

const HREF = "/docs/troubleshooting/printer-issues";

const TOC = [
  { id: "quick-check", label: "Quick check first" },
  { id: "step-1", label: "Step 1: Look at the printer" },
  { id: "step-2", label: "Step 2: Out of paper or ribbon" },
  { id: "step-3", label: "Step 3: Paper jam" },
  { id: "step-4", label: "Step 4: Printer offline" },
  { id: "step-5", label: "Step 5: Print quality problems" },
  { id: "step-6", label: "Step 6: Out of paper mid-session" },
  { id: "step-7", label: "Step 7: Test Print fails repeatedly" },
  { id: "patterns", label: "Common patterns" },
  { id: "support", label: "When to call support" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PrinterIssuesPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Printer issues</h1>

      <p>
        The printer is the most physically delicate part of a BoothIQ
        kiosk. This article covers the common printer problems and
        what to do about each.
      </p>

      <p><strong>Symptom:</strong> Printer pill is red, customer paid but no print appeared, prints are jamming, or prints have weird colors / streaks / borders.</p>

      <h2 id="quick-check">Quick check first</h2>

      <ol>
        <li>Open admin → <strong>Diagnostics</strong> tab.</li>
        <li>Look at the <strong>Printer</strong> status card.</li>
        <li>Read the status pill and the message underneath.</li>
      </ol>

      <ul>
        <li><strong>Out of paper.</strong> Paper roll is empty</li>
        <li><strong>Out of ribbon.</strong> Ribbon is exhausted</li>
        <li><strong>Jam.</strong> Paper or ribbon is misfeeding</li>
        <li><strong>Door open.</strong> The printer service door isn&apos;t fully closed</li>
        <li><strong>Cooling.</strong> The thermal head is too hot. It&apos;ll resume on its own</li>
        <li><strong>Offline.</strong> Printer isn&apos;t responding (USB or power issue)</li>
        <li><strong>Communication error.</strong> The DNP SDK can&apos;t reach the printer</li>
      </ul>

      <h2 id="step-1">Step 1: Look at the actual printer</h2>

      <p>Walk around to the printer (usually behind or below the touchscreen on the kiosk):</p>

      <ol>
        <li>Is the <strong>power LED on</strong> the printer lit?</li>
        <li>Is the <strong>service door fully closed</strong>?</li>
        <li>Is there a <strong>physical jam</strong> visible? Paper sticking out partway, ribbon torn?</li>
        <li>Are the <strong>media indicators</strong> showing low / empty?</li>
        <li>Does the printer have any <strong>flashing error LEDs</strong>?</li>
      </ol>

      <p>Most printer problems are visible from the printer itself, not from the screen.</p>

      <h2 id="step-2">Step 2: Out of paper or ribbon</h2>

      <p>If the printer reports out of paper / ribbon:</p>

      <ol>
        <li>Open the printer&apos;s service door.</li>
        <li>Remove the empty paper / ribbon assembly.</li>
        <li>Install a fresh DNP roll. Make sure both the paper roll and the ribbon are seated correctly and not crossed.</li>
        <li>Close the service door firmly.</li>
        <li>Wait for the printer&apos;s status LED to settle (10-30 seconds).</li>
        <li>Check the Printer pill in admin. It should turn green.</li>
        <li>Run a <strong>Test Print</strong> from the Diagnostics tab to confirm.</li>
      </ol>

      <p>
        For full instructions on changing the roll, see{" "}
        <Link href="/docs/maintenance/changing-the-print-roll">
          Changing the print roll
        </Link>
        .
      </p>

      <h2 id="step-3">Step 3: Paper jam</h2>

      <p>If you see paper or ribbon stuck:</p>

      <ol>
        <li><strong>Power off the printer</strong> (use the printer&apos;s own power switch, not the kiosk&apos;s).</li>
        <li>Open the service door.</li>
        <li><strong>Carefully</strong> remove the jammed paper. Don&apos;t yank. The thermal head is fragile.</li>
        <li>Inspect the paper roll for tearing. If it&apos;s torn, you may need to cut a clean edge before reinserting.</li>
        <li>Inspect the ribbon for tears or wrinkles. If wrinkled badly, you may need a new ribbon.</li>
        <li>Reseat both rolls.</li>
        <li>Close the service door firmly.</li>
        <li><strong>Power on the printer.</strong></li>
        <li>Wait for the status LED to settle.</li>
        <li>Run a Test Print.</li>
      </ol>

      <p>If you can&apos;t clear the jam yourself, contact support.</p>

      <h2 id="step-4">Step 4: Printer is offline (no error message, just dead)</h2>

      <p>The printer card says &quot;Offline&quot; or &quot;Communication error&quot; but you don&apos;t see a physical problem:</p>

      <ol>
        <li><strong>Power-cycle the printer.</strong> Turn off its power switch, wait 10 seconds, turn it back on. Wait for its LEDs to settle.</li>
        <li>Check the Printer pill in admin. If green, you&apos;re done.</li>
        <li>If still offline, <strong>power-cycle the kiosk</strong> as well. (Sometimes the DNP SDK gets stuck and needs the host to restart.)</li>
        <li>If still offline after both power cycles, the printer&apos;s USB connection may be loose. This is internal. Contact support.</li>
      </ol>

      <h2 id="step-5">Step 5: Print quality problems</h2>

      <h3>White borders on prints</h3>
      <p>Prints come out with a white margin instead of edge-to-edge.</p>
      <p>The borderless setting in the printer&apos;s print queue may have been overridden. This shouldn&apos;t happen on a locked-down kiosk, but if it does, contact support. Borderless mode lives at the OS level, not in BoothIQ admin.</p>

      <h3>Streaks across prints</h3>
      <p>Horizontal or vertical streaks usually mean:</p>
      <ul>
        <li>
          <strong>Dirty thermal head.</strong> See{" "}
          <Link href="/docs/maintenance/cleaning-the-printer">
            Cleaning the printer
          </Link>
        </li>
        <li><strong>Damaged ribbon.</strong> Replace the ribbon</li>
        <li><strong>Damaged thermal head.</strong> Contact support</li>
      </ul>

      <h3>Wrong colors</h3>
      <p>Prints come out with strange tints, missing colors, or oversaturated:</p>
      <ul>
        <li><strong>Ribbon misaligned.</strong> Open the printer, reseat the ribbon, run a test print</li>
        <li><strong>Defective media.</strong> Try a different roll. If a new roll fixes it, the old roll was bad</li>
        <li><strong>Color profile / driver issue.</strong> Contact support</li>
      </ul>

      <h3>Faded or washed out prints</h3>
      <ul>
        <li><strong>Old or stored-in-heat media.</strong> Try a fresh roll</li>
        <li><strong>Thermal head wearing out.</strong> Contact support; thermal heads have a finite lifespan</li>
      </ul>

      <h3>Smudged prints</h3>
      <p>The customer touched the print before it cured. Tell customers not to handle prints immediately after they come out. Wait a few seconds.</p>

      <h2 id="step-6">Step 6: Printer ran out of paper mid-customer-session</h2>

      <p>A customer paid, the print started, and the printer ran out of paper before all copies were done.</p>

      <ol>
        <li>The booth&apos;s print retry logic will try a few times before giving up.</li>
        <li>Open the printer service door and <strong>change the paper roll</strong> immediately.</li>
        <li>Wait for the Printer pill to go green.</li>
        <li>The pending print job should resume automatically, or you may need to run a Test Print to flush the queue.</li>
        <li><strong>Comp the customer.</strong> Add credits equal to one session in the Credits tab. And let them retry.</li>
      </ol>

      <h2 id="step-7">Step 7: Test Print fails repeatedly</h2>

      <p>You&apos;ve tried all the steps and Test Print still fails:</p>

      <ol>
        <li>The printer hardware is genuinely broken.</li>
        <li>Take the booth out of service (Free Play mode + a sign on the front saying &quot;Out of Order&quot;).</li>
        <li>
          Contact support with:
          <ul>
            <li>The Booth ID</li>
            <li>The error message from the Printer card in Diagnostics</li>
            <li>What you&apos;ve already tried</li>
            <li>When the problem started</li>
          </ul>
        </li>
      </ol>

      <h2 id="patterns">Common patterns</h2>

      <p><strong>Printer fails after a long event.</strong></p>
      <p>Thermal head overheated or media exhausted. Wait for cooling, change media.</p>

      <p><strong>Printer pill red after a power blip.</strong></p>
      <p>DNP SDK lost the printer. Power-cycle the printer.</p>

      <p><strong>Quality drops mid-roll.</strong></p>
      <p>Defective paper or ribbon. Replace media.</p>

      <p><strong>Random jams.</strong></p>
      <p>Incorrectly seated rolls. Re-seat carefully.</p>

      <p><strong>Printer never recovers from a jam.</strong></p>
      <p>Internal damage from forcible jam removal. Contact support.</p>

      <h2 id="support">When to call support</h2>

      <p>Contact support if:</p>

      <ul>
        <li>The same error happens after multiple power cycles</li>
        <li>You can&apos;t physically clear a jam</li>
        <li>The thermal head looks damaged</li>
        <li>Test Print fails after fresh media</li>
        <li>The printer is producing unusable prints from a fresh roll</li>
      </ul>

      <h2 id="verify">Verify it worked</h2>

      <p>The printer is recovered when:</p>

      <ul>
        <li>The Printer pill is green</li>
        <li>A Test Print produces a clean, sharp, borderless print</li>
        <li>A full customer session prints successfully</li>
        <li>The Prints Remaining indicator is updating correctly</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/maintenance/changing-the-print-roll">Changing the print roll</Link>
          . Routine roll changes.
        </li>
        <li>
          <Link href="/docs/maintenance/cleaning-the-printer">Cleaning the printer</Link>
          . Routine cleaning.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Where printer status lives.
        </li>
      </ul>
    </DocsLayout>
  );
}
