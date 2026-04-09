import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Daily checks — BoothIQ Docs",
  description:
    "A 2-minute physical inspection to do every morning to keep the booth healthy.",
};

const HREF = "/docs/maintenance/daily-checks";

const TOC = [
  { id: "the-checks", label: "The checks" },
  { id: "things-to-clean", label: "Things to clean" },
  { id: "things-not-to-do", label: "Things to not do" },
  { id: "verify", label: "Verify the daily check is done" },
  { id: "how-long", label: "How long this should take" },
  { id: "escalate", label: "When to escalate" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function DailyChecksPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Daily checks</h1>

      <p>
        A short physical and visual inspection to do at the start of
        every shift, separate from the operator-side{" "}
        <Link href="/docs/running-your-booth/daily-startup-checklist">
          Daily startup checklist
        </Link>
        . Two minutes well spent.
      </p>

      <p><strong>Who this is for:</strong> Whoever opens the booth.</p>

      <h2 id="the-checks">The checks</h2>

      <h3>1. Look at the kiosk</h3>
      <p>Walk up to the booth and look at it from the customer&apos;s perspective:</p>
      <ul>
        <li>Is the screen on and showing the welcome screen?</li>
        <li>Is the screen clean? Smudges, dust, fingerprints?</li>
        <li>Are there any cables visible / loose / disconnected?</li>
        <li>Are there any signs of damage, vandalism, or wear?</li>
        <li>Is the area around the booth clean and uncluttered?</li>
      </ul>

      <h3>2. Look at the printer</h3>
      <p>Walk around to the printer&apos;s service door:</p>
      <ul>
        <li>Is the printer&apos;s power LED on (steady)?</li>
        <li>Is the service door fully closed?</li>
        <li>Is there any paper or ribbon visible sticking out where it shouldn&apos;t be?</li>
        <li>Are the print outputs from the previous day cleared from the output tray?</li>
      </ul>

      <h3>3. Listen</h3>
      <p>Stand near the booth and listen for:</p>
      <ul>
        <li>Background music playing from the welcome screen (yes = audio is working)</li>
        <li>Voice prompts replaying every minute or so</li>
        <li>Any abnormal sounds. Fan whining, clicks, beeps from hardware</li>
      </ul>

      <h3>4. Touch the screen</h3>
      <p>Tap the welcome screen once to confirm it&apos;s responsive:</p>
      <ul>
        <li>Does the START button respond visually (highlight, animate, anything)?</li>
        <li>Cancel out of any partial customer flow you triggered</li>
      </ul>

      <h3>5. Walk through the operator side</h3>
      <p>
        Sign in to admin and do the{" "}
        <Link href="/docs/running-your-booth/daily-startup-checklist">
          Daily startup checklist
        </Link>
        .
      </p>

      <h2 id="things-to-clean">Things to clean</h2>

      <p>If anything looks dirty:</p>

      <ul>
        <li><strong>Touchscreen:</strong> wipe with a microfiber cloth and a small amount of screen-safe cleaner. <strong>Do not</strong> use paper towels (they scratch).</li>
        <li><strong>Camera lens:</strong> wipe with a microfiber cloth. <strong>Do not</strong> spray cleaner directly on the lens.</li>
        <li><strong>Printer service door (outside):</strong> wipe with a damp cloth.</li>
        <li><strong>Booth exterior:</strong> wipe with a damp cloth or appropriate cleaner.</li>
        <li><strong>Coin / bill slot exterior:</strong> wipe with a damp cloth.</li>
      </ul>

      <DocsCallout type="warning">
        <strong>Don&apos;t open the kiosk enclosure</strong> to clean
        internal components unless you&apos;re explicitly trained to.
        Internal cleaning is for support / maintenance technicians.
      </DocsCallout>

      <h2 id="things-not-to-do">Things to <strong>not</strong> do</h2>

      <ul>
        <li><strong>Don&apos;t</strong> spray any cleaner directly on the screen or any component</li>
        <li><strong>Don&apos;t</strong> use abrasive cloths or paper towels on the screen</li>
        <li><strong>Don&apos;t</strong> unplug any internal cables to &quot;clean behind them&quot;</li>
        <li><strong>Don&apos;t</strong> open the printer&apos;s service door unless you&apos;re changing media (it can confuse the printer&apos;s media counter)</li>
        <li><strong>Don&apos;t</strong> vacuum near the booth (static electricity)</li>
      </ul>

      <h2 id="verify">Verify the daily check is done</h2>

      <p>Your daily check is complete when:</p>

      <ul>
        <li>The booth is physically clean</li>
        <li>The screen is on and responsive</li>
        <li>The printer is on and reports healthy</li>
        <li>You&apos;ve signed in to admin and confirmed the startup checklist</li>
      </ul>

      <h2 id="how-long">How long this should take</h2>

      <p>
        <strong>About 2 minutes.</strong> If it&apos;s taking longer,
        you&apos;re doing more than a check. You&apos;re already in
        maintenance / troubleshooting territory.
      </p>

      <h2 id="escalate">When to escalate</h2>

      <p>Call support or schedule maintenance if:</p>

      <ul>
        <li>A cable is genuinely loose / disconnected (don&apos;t try to fix it yourself unless trained)</li>
        <li>The screen has a crack or visible damage</li>
        <li>A component is making unusual sounds</li>
        <li>Cleaning doesn&apos;t get the screen to a good state (deep stains, etched marks)</li>
        <li>The printer has visible wear or damage to the outside</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/maintenance/changing-the-print-roll">Changing the print roll</Link>
          . When the roll is low.
        </li>
        <li>
          <Link href="/docs/maintenance/cleaning-the-printer">Cleaning the printer</Link>
          . Deeper printer maintenance.
        </li>
        <li>
          <Link href="/docs/running-your-booth/daily-startup-checklist">
            Daily startup checklist
          </Link>
          . Operator-side checks.
        </li>
      </ul>
    </DocsLayout>
  );
}
