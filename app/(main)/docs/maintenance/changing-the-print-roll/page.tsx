import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Changing the print roll — BoothIQ Docs",
  description:
    "When and how to swap photo media in the DNP DS-RX1hs printer.",
};

const HREF = "/docs/maintenance/changing-the-print-roll";

const TOC = [
  { id: "when", label: "When to change the roll" },
  { id: "before", label: "Before you start" },
  { id: "step-1", label: "Step 1: Open the service door" },
  { id: "step-2", label: "Step 2: Remove the empty roll" },
  { id: "step-3", label: "Step 3: Unbox the new media" },
  { id: "step-4", label: "Step 4: Install the new ribbon" },
  { id: "step-5", label: "Step 5: Install the new paper roll" },
  { id: "step-6", label: "Step 6: Close the door" },
  { id: "step-7", label: "Step 7: Run a Test Print" },
  { id: "step-8", label: "Step 8: Update your records" },
  { id: "dispose", label: "How to dispose of the old media" },
  { id: "common-problems", label: "Common problems" },
  { id: "dont", label: "Don't do this" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ChangingPrintRollPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Changing the print roll</h1>

      <p>
        A standard DNP roll yields about <strong>700</strong> 4×6
        prints or <strong>1400</strong> 2×6 strips. Eventually
        you&apos;ll run out and need to swap. This article walks
        through when and how.
      </p>

      <p><strong>Who this is for:</strong> Operators changing photo media themselves.</p>

      <h2 id="when">When to change the roll</h2>

      <p>The Sales tab and the dashboard header bar both show a <strong>Prints Remaining</strong> indicator. Use these to plan ahead:</p>

      <ul>
        <li><strong>More than 200.</strong> You have plenty for a normal day. No action</li>
        <li><strong>100-200.</strong> Check this evening / before next event</li>
        <li><strong>50-100.</strong> Change the roll today, before you run out mid-session</li>
        <li><strong>Under 50.</strong> Change the roll <strong>now</strong> before the next customer</li>
        <li><strong>0.</strong> The booth has stopped printing. Change immediately</li>
      </ul>

      <p>For <strong>busy events</strong> (hundreds of customers), start with a <strong>fresh roll</strong> so you don&apos;t have to swap mid-event.</p>

      <h2 id="before">Before you start</h2>

      <ul>
        <li>Have a <strong>fresh DNP roll and ribbon</strong> ready. Genuine DNP only.</li>
        <li>Wash your hands. Greasy fingers on the print head reduce print quality.</li>
        <li>(Optional) Take the booth out of customer service while you swap. Switch to <strong>Free Play</strong> + put a sign on the front saying &quot;back in 5 minutes&quot;, or just do the swap quickly between customers.</li>
        <li>Keep the printer <strong>powered on</strong> during the swap (the booth knows when the door is open and pauses).</li>
      </ul>

      <h2 id="step-1">Step 1: Open the printer service door</h2>

      <p>The DNP DS-RX1hs has a service door for media access. The exact location depends on how your kiosk is mounted, but it&apos;s usually a hinged or sliding panel on the side or front of the printer.</p>

      <p>Open the door fully. The printer&apos;s status LED may change to indicate &quot;door open.&quot;</p>

      <p>The Printer pill in admin will turn red while the door is open. That&apos;s expected.</p>

      <h2 id="step-2">Step 2: Remove the empty roll</h2>

      <p>Inside the printer you&apos;ll see:</p>

      <ul>
        <li>The <strong>paper roll</strong> on a spindle</li>
        <li>The <strong>ribbon assembly</strong> (a separate cartridge or spool)</li>
      </ul>

      <p>Both need to come out:</p>

      <ol>
        <li><strong>Lift the paper roll</strong> out of its spindle. If it&apos;s on a removable spindle, pull the spindle out with the roll.</li>
        <li><strong>Lift out the ribbon assembly.</strong> If it&apos;s a cartridge, just lift; if it&apos;s a separate spool system, remove both spools.</li>
      </ol>

      <p><strong>Discard</strong> the empty paper core and the spent ribbon. They&apos;re not reusable.</p>

      <DocsCallout type="warning">
        <strong>Do not</strong> save partially-used media for
        &quot;later.&quot; Exposed media degrades. Use it up or
        replace it.
      </DocsCallout>

      <h2 id="step-3">Step 3: Unbox the new media</h2>

      <p>Open the new DNP media box. Inside you&apos;ll find:</p>

      <ul>
        <li>A <strong>new paper roll</strong> (sealed in plastic)</li>
        <li>A <strong>new ribbon</strong> (sealed in plastic)</li>
      </ul>

      <p><strong>Don&apos;t open the plastic until you&apos;re ready to install.</strong> The media is sensitive to dust and humidity.</p>

      <h2 id="step-4">Step 4: Install the new ribbon</h2>

      <ol>
        <li>Open the ribbon plastic.</li>
        <li>Identify which spool is the <strong>supply</strong> side and which is the <strong>takeup</strong> side. The DNP ribbon has clear markings or different colors on each end.</li>
        <li><strong>Seat the ribbon</strong> into the printer following the printer&apos;s diagram (printed on the inside of the service door, or in the printer&apos;s manual).</li>
        <li>The ribbon should be <strong>taut</strong>. Not loose, not over-tight.</li>
        <li><strong>Don&apos;t twist or fold the ribbon.</strong> A wrinkled ribbon will print streaks.</li>
      </ol>

      <h2 id="step-5">Step 5: Install the new paper roll</h2>

      <ol>
        <li>Open the paper roll plastic.</li>
        <li>Place the roll on the spindle (or in its mounting position).</li>
        <li><strong>Feed the leading edge of the paper</strong> through the printer&apos;s media path according to the diagram.</li>
        <li>The leading edge should be straight and clean.</li>
      </ol>

      <h2 id="step-6">Step 6: Close the door</h2>

      <p>Close the service door <strong>firmly</strong>. You should hear a click or feel it latch. The printer&apos;s status LED will indicate &quot;ready&quot; within a few seconds.</p>

      <p>The Printer pill in admin should turn <strong>green</strong> when the door is closed and the printer has detected the new media.</p>

      <h2 id="step-7">Step 7: Run a Test Print</h2>

      <p>Always do a test print after a media change:</p>

      <ol>
        <li>Open admin → <strong>Diagnostics</strong> tab.</li>
        <li>Find the <strong>Test Print</strong> button (in the Diagnostics tab or the Settings tab Quick Actions).</li>
        <li>Tap it.</li>
        <li>A test print should come out within 10-20 seconds.</li>
        <li>
          <strong>Inspect the test print:</strong>
          <ul>
            <li>Borderless? Should be edge-to-edge with no white margin</li>
            <li>Color accurate? No tinting or streaks</li>
            <li>Sharp? No blurriness</li>
          </ul>
        </li>
        <li>If the test print looks good, the swap is complete.</li>
        <li>If the test print has problems, see <strong>Printer issues</strong> <em>(coming soon)</em>.</li>
      </ol>

      <h2 id="step-8">Step 8: Update your records</h2>

      <p>Note when you changed the roll:</p>

      <ul>
        <li>The booth&apos;s <strong>Prints Remaining</strong> indicator will reset to about 700 (or whatever a fresh roll yields)</li>
        <li>(Optional) Note the date in your maintenance log so you can predict roll life over time</li>
      </ul>

      <h2 id="dispose">How to dispose of the old media</h2>

      <ul>
        <li><strong>Paper core:</strong> recycle as paper</li>
        <li><strong>Ribbon:</strong> general waste (not recyclable in most municipalities)</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Service door won&apos;t close.</strong></p>
      <p>Paper or ribbon not seated correctly. Re-open and re-seat both.</p>

      <p><strong>Printer pill stays red after door close.</strong></p>
      <p>Door not fully latched, or media misfeed. Re-open and try again.</p>

      <p><strong>Test print is blank.</strong></p>
      <p>Ribbon installed backwards. Re-seat ribbon facing the right direction.</p>

      <p><strong>Test print has streaks.</strong></p>
      <p>Ribbon wrinkled or twisted. Re-seat ribbon carefully.</p>

      <p><strong>Test print has wrong colors.</strong></p>
      <p>Defective media. Try a different roll.</p>

      <p><strong>Prints remaining indicator still shows old number.</strong></p>
      <p>Cache hasn&apos;t refreshed. Power-cycle the kiosk.</p>

      <h2 id="dont">Don&apos;t do this</h2>

      <ul>
        <li><strong>Don&apos;t force the door</strong> if it won&apos;t close. Re-seat the media instead</li>
        <li><strong>Don&apos;t reuse partially-spent ribbons.</strong> The takeup side isn&apos;t designed for re-use</li>
        <li><strong>Don&apos;t mix media batches.</strong> Use one box of paper with its matching ribbon</li>
        <li><strong>Don&apos;t touch the print head.</strong> It&apos;s fragile and oils from your skin damage it</li>
        <li><strong>Don&apos;t use third-party media.</strong> DNP-branded only</li>
      </ul>

      <h2 id="verify">Verify it worked</h2>

      <p>The roll change is successful when:</p>

      <ul>
        <li>The service door is closed and latched</li>
        <li>The Printer pill in admin is green</li>
        <li>A test print comes out clean and borderless</li>
        <li>The Prints Remaining indicator has increased</li>
        <li>A real customer session prints correctly</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/maintenance/cleaning-the-printer">Cleaning the printer</Link>
          . Periodic deeper cleaning.
        </li>
        <li><strong>Printer issues</strong> <em>(coming soon)</em>. When the swap doesn&apos;t go smoothly.</li>
      </ul>
    </DocsLayout>
  );
}
