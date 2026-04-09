import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Cleaning the printer — BoothIQ Docs",
  description:
    "Periodic cleaning to keep the DNP printer producing sharp, streak-free prints.",
};

const HREF = "/docs/maintenance/cleaning-the-printer";

const TOC = [
  { id: "when", label: "When to clean" },
  { id: "tools", label: "Tools you'll need" },
  { id: "before", label: "Before you start" },
  { id: "step-1", label: "Step 1: Clean the exterior" },
  { id: "step-2", label: "Step 2: Open the service door" },
  { id: "step-3", label: "Step 3: Wipe the rollers" },
  { id: "step-4", label: "Step 4: Clean the thermal head" },
  { id: "step-5", label: "Step 5: Blow out dust" },
  { id: "step-6", label: "Step 6: Reinstall media" },
  { id: "step-7", label: "Step 7: Close the door and test" },
  { id: "doesnt-fix", label: "What cleaning does NOT fix" },
  { id: "frequency", label: "Cleaning frequency" },
  { id: "safety", label: "Safety notes" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CleaningPrinterPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Cleaning the printer</h1>

      <p>
        The DNP DS-RX1hs is a thermal dye-sub printer. Over time, dust
        collects on the rollers and (occasionally) the thermal head,
        and prints start to come out with streaks or smudges. A
        periodic clean keeps quality high.
      </p>

      <p><strong>Who this is for:</strong> Operators doing routine printer maintenance.</p>

      <h2 id="when">When to clean</h2>

      <ul>
        <li><strong>Every roll change</strong> (after every ~700 prints) is a good interval for a quick clean</li>
        <li><strong>Whenever you see streaks or smudges</strong> on prints that fresh media doesn&apos;t fix</li>
        <li><strong>Whenever the printer has been sitting unused for a long time</strong> (a month or more)</li>
      </ul>

      <p>For light cleaning at every roll change, the steps below are quick. For deeper issues, you may need a DNP cleaning kit (sold separately).</p>

      <h2 id="tools">Tools you&apos;ll need</h2>

      <ul>
        <li><strong>Microfiber cloth</strong> (lint-free)</li>
        <li><strong>DNP cleaning swabs</strong> or alcohol swabs (90%+ isopropyl alcohol)</li>
        <li><strong>Compressed air can</strong> (optional, for dust)</li>
        <li><strong>Clean, dry hands</strong> (or thin nitrile gloves)</li>
      </ul>

      <h2 id="before">Before you start</h2>

      <ul>
        <li><strong>Power off the printer</strong> if you&apos;ll be touching internal parts. (Or leave it on if you&apos;re only wiping the exterior.)</li>
        <li>Let the print head <strong>cool down</strong> for a minute or two if the printer was just running.</li>
        <li>Have your media swap supplies ready if you&apos;re cleaning at a roll change.</li>
      </ul>

      <h2 id="step-1">Step 1: Clean the exterior</h2>

      <p>Wipe down the printer&apos;s outside surfaces with a microfiber cloth:</p>

      <ul>
        <li>Top and sides</li>
        <li>Service door (outside)</li>
        <li>Any visible cooling vents. Gently, don&apos;t push dust into them</li>
      </ul>

      <p>Do not spray cleaner directly on any printer surface. Damp the cloth slightly if needed.</p>

      <h2 id="step-2">Step 2: Open the service door</h2>

      <p>
        Open the printer&apos;s service door fully. Remove the paper
        roll and ribbon (see{" "}
        <Link href="/docs/maintenance/changing-the-print-roll">
          Changing the print roll
        </Link>{" "}
        Step 2).
      </p>

      <h2 id="step-3">Step 3: Wipe the rollers</h2>

      <p>Inside the printer you&apos;ll see one or more <strong>black rubber rollers</strong> that the paper passes over.</p>

      <ol>
        <li>Use a microfiber cloth (slightly damp with isopropyl alcohol if available).</li>
        <li><strong>Gently</strong> wipe each roller, rotating it as you go.</li>
        <li>The cloth will pick up dust, paper fibers, and ink residue.</li>
        <li>Continue until the cloth comes away clean.</li>
      </ol>

      <h2 id="step-4">Step 4: Clean the thermal head (cautiously)</h2>

      <p>The thermal head is the long, thin component that actually transfers dye from the ribbon to the paper. It&apos;s <strong>fragile</strong> and <strong>sensitive</strong>. Clean it only if you have a dedicated cleaning kit or the right swabs.</p>

      <p><strong>With a DNP cleaning kit:</strong></p>

      <ol>
        <li>Use the cleaning swabs included in the kit.</li>
        <li><strong>Lightly</strong> wipe the thermal head along its length, in <strong>one direction only</strong> (don&apos;t scrub back and forth).</li>
        <li>Let it dry for a minute before reinstalling media.</li>
      </ol>

      <p><strong>Without a kit:</strong></p>

      <ul>
        <li><strong>Skip this step.</strong> Don&apos;t risk damaging the head with the wrong cleaning material.</li>
        <li>Order a DNP cleaning kit if you need to clean the head regularly.</li>
      </ul>

      <h2 id="step-5">Step 5: Blow out dust (optional)</h2>

      <p>If you have compressed air:</p>

      <ol>
        <li>Hold the can <strong>upright</strong> (not tilted, or it&apos;ll spray liquid).</li>
        <li>Use <strong>short bursts</strong> to blow dust out of the media path.</li>
        <li>Don&apos;t aim directly at the thermal head.</li>
      </ol>

      <h2 id="step-6">Step 6: Reinstall media</h2>

      <p>
        Install the new (or existing) paper and ribbon as usual. See{" "}
        <Link href="/docs/maintenance/changing-the-print-roll">
          Changing the print roll
        </Link>
        .
      </p>

      <h2 id="step-7">Step 7: Close the door and test</h2>

      <ol>
        <li>Close the service door firmly.</li>
        <li>Power the printer back on if you turned it off.</li>
        <li>Wait for the Printer pill in admin to turn green.</li>
        <li>Run a <strong>Test Print</strong>.</li>
        <li>The test print should be clean. No streaks, no smudges, no spotting.</li>
      </ol>

      <h2 id="doesnt-fix">What cleaning does NOT fix</h2>

      <ul>
        <li><strong>Wrong colors.</strong> Defective media or ribbon issue, not dirt</li>
        <li><strong>White borders.</strong> Borderless printing setting issue, not dirt</li>
        <li><strong>Off-center prints.</strong> Template / layout issue, not dirt</li>
        <li><strong>Prints that look good but the booth says &quot;Out of Paper&quot;.</strong> Sensor issue, not dirt</li>
        <li><strong>Prints that come out crumpled.</strong> Paper jam / mechanical issue, not dirt</li>
      </ul>

      <p>If cleaning doesn&apos;t fix the problem, see <strong>Printer issues</strong> <em>(coming soon)</em>.</p>

      <h2 id="frequency">Cleaning frequency</h2>

      <ul>
        <li><strong>Heavy</strong> (100+ prints / day). Every roll change</li>
        <li><strong>Medium</strong> (20-100 prints / day). Every 2-3 roll changes</li>
        <li><strong>Light</strong> (under 20 prints / day). Monthly even if you haven&apos;t changed the roll</li>
        <li><strong>Stored</strong> (not in use). Quick clean before bringing back into service</li>
      </ul>

      <h2 id="safety">Safety notes</h2>

      <ul>
        <li><strong>Don&apos;t pour or spray liquid into the printer.</strong> Always damp a cloth first.</li>
        <li><strong>Don&apos;t use harsh chemicals</strong> like ammonia, acetone, or abrasive cleaners.</li>
        <li><strong>Don&apos;t scrub</strong> the thermal head. Gentle, single-direction wiping only.</li>
        <li><strong>Don&apos;t unplug internal cables</strong> to &quot;get better access.&quot; If you can&apos;t reach something with the door open, you don&apos;t need to clean it.</li>
        <li><strong>Don&apos;t operate the printer with the door open.</strong></li>
      </ul>

      <h2 id="verify">Verify it worked</h2>

      <p>The printer is clean when:</p>

      <ul>
        <li>A test print is sharp, streak-free, and color-accurate</li>
        <li>The rollers look free of visible dust</li>
        <li>The exterior is wiped down</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/maintenance/changing-the-print-roll">Changing the print roll</Link>
          . Often combined with cleaning.
        </li>
        <li><strong>Printer issues</strong> <em>(coming soon)</em>. When cleaning doesn&apos;t fix it.</li>
      </ul>
    </DocsLayout>
  );
}
