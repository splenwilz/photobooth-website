import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Daily startup checklist — BoothIQ Docs",
  description:
    "A 5-minute pass to do at the start of every shift to make sure the booth is ready for customers.",
};

const HREF = "/docs/running-your-booth/daily-startup-checklist";

const TOC = [
  { id: "the-checklist", label: "The checklist" },
  { id: "pill-colors", label: "Hardware status pill colors" },
  { id: "enough-paper", label: "What \"enough paper for the day\" means" },
  { id: "free-play-test", label: "When to use Free Play for the test" },
  { id: "fix-before-opening", label: "What to fix before opening" },
  { id: "end-of-day", label: "What to do at the end of the day" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function DailyStartupChecklistPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Daily startup checklist</h1>

      <p>
        A short routine to do every morning (or every shift) before
        customers arrive. It catches almost every &quot;the booth
        wasn&apos;t working when I got here&quot; problem in five
        minutes flat.
      </p>

      <p>
        <strong>Who this is for:</strong> Whoever opens the booth that
        day.
      </p>

      <h2 id="the-checklist">The checklist</h2>

      <ol>
        <li><strong>Turn on the kiosk</strong> if it&apos;s not already running. Wait for the welcome screen to appear (30-60 seconds).</li>
        <li><strong>Look at the welcome screen.</strong> Does it look right? Animated button, video playing, business name correct?</li>
        <li><strong>Sign in to admin.</strong> 5-tap the credits indicator → enter your password.</li>
        <li><strong>Check the header bar.</strong> Are all three hardware pills (Camera, Printer, PCB) <strong>green</strong>?</li>
        <li><strong>Check the prints remaining</strong> indicator. Do you have enough paper for the day?</li>
        <li><strong>Check the mode.</strong> Coin Operated or Free Play, whichever you want today?</li>
        <li><strong>Check the license banner.</strong> Is one showing? If yes, address it before opening.</li>
        <li><strong>Check the credit balance.</strong> Is it where you expect (usually $0)?</li>
        <li><strong>Check Cloud Sync.</strong> Is the badge <strong>Connected</strong>?</li>
        <li><strong>Run a test session.</strong> Exit admin and walk through one full customer session in <strong>Free Play</strong> mode (or with coins, if you prefer). Confirm a print actually comes out.</li>
        <li><strong>Switch back to your normal operation mode</strong> if you flipped to Free Play for the test.</li>
        <li><strong>Exit admin.</strong> Never leave the booth in admin mode unattended.</li>
      </ol>

      <p>That&apos;s it. Twelve quick checks, about five minutes total.</p>

      <h2 id="pill-colors">Hardware status pill colors</h2>

      <ul>
        <li><strong>Green.</strong> Hardware is online and reporting healthy</li>
        <li><strong>Red.</strong> Hardware is offline, in error, or not detected</li>
      </ul>

      <p>
        If any pill is red, don&apos;t open the booth. Go to{" "}
        <Link href="/docs/admin-dashboard/diagnostics-tab">
          Diagnostics tab
        </Link>{" "}
        and find out why.
      </p>

      <h2 id="enough-paper">What &quot;enough paper for the day&quot; means</h2>

      <p>
        Look at the <strong>Prints remaining</strong> indicator in the
        header bar. A standard DNP roll yields about{" "}
        <strong>700</strong> 4×6 prints or <strong>1400</strong> 2×6
        strips. Estimate based on your typical day:
      </p>

      <ul>
        <li><strong>Quiet day (under 50 sessions)</strong> → any non-zero number is fine</li>
        <li><strong>Busy day (100+ sessions)</strong> → at least 200 prints remaining; consider swapping the roll</li>
        <li><strong>Event with hundreds of customers</strong> → start with a fresh roll</li>
      </ul>

      <p>
        For how to swap rolls, see <strong>Changing the print roll</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="free-play-test">When to use Free Play for the test</h2>

      <p>Use Free Play for the morning test print when:</p>

      <ul>
        <li>You don&apos;t want to insert a real coin every morning just to test</li>
        <li>You&apos;re running a free-play event today anyway</li>
      </ul>

      <p>Use Coin Operated for the morning test print when:</p>

      <ul>
        <li>You want to verify the payment device too</li>
        <li>It&apos;s the start of a new event and you want a &quot;real&quot; end-to-end test</li>
      </ul>

      <h2 id="fix-before-opening">What to fix before opening</h2>

      <p>If the checklist turns up any of these, <strong>fix it before opening the booth</strong>:</p>

      <p><strong>Camera pill red.</strong></p>
      <p><strong>Camera not working</strong> <em>(coming soon)</em>.</p>

      <p><strong>Printer pill red.</strong></p>
      <p><strong>Printer issues</strong> <em>(coming soon)</em>.</p>

      <p><strong>PCB pill red (and you charge customers).</strong></p>
      <p><strong>Payment not registering</strong> <em>(coming soon)</em>.</p>

      <p><strong>Out of paper.</strong></p>
      <p><strong>Changing the print roll</strong> <em>(coming soon)</em>.</p>

      <p><strong>License banner showing Trial / Grace / Expired.</strong></p>
      <p>
        <Link href="/docs/connecting-your-kiosk/license-and-activation">
          License and activation
        </Link>
        .
      </p>

      <p><strong>Cloud sync says Not Registered.</strong></p>
      <p>
        <Link href="/docs/connecting-your-kiosk/cloud-registration">
          Cloud registration
        </Link>
        .
      </p>

      <p><strong>Credit balance is unexpected.</strong></p>
      <p>
        Check the Credits tab history. See{" "}
        <Link href="/docs/admin-dashboard/credits-tab">Credits tab</Link>
        .
      </p>

      <p><strong>Test print produces a weird result.</strong></p>
      <p><strong>Printer issues</strong> <em>(coming soon)</em>.</p>

      <h2 id="end-of-day">What to do at the end of the day</h2>

      <p>A short closing routine:</p>

      <ol>
        <li><strong>Exit admin</strong> if you&apos;re in it.</li>
        <li>(Optional) <strong>Cash collection.</strong> Open the cash box and take the day&apos;s cash. Use the <strong>Sales tab</strong> to verify the total matches the day&apos;s revenue.</li>
        <li>(Optional) <strong>Power off the kiosk</strong> if your venue requires it. Many BoothIQ venues leave the booth running 24/7. That&apos;s also fine.</li>
        <li><strong>Lock the venue.</strong> The kiosk has admin password protection but doesn&apos;t replace physical security.</li>
      </ol>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;re using this checklist effectively when:</p>

      <ul>
        <li>You catch problems before customers do</li>
        <li>Your morning test print succeeds first time, every time</li>
        <li>You never have to power-cycle the booth in a panic mid-event</li>
        <li>Your end-of-day cash matches the Sales tab total within rounding</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/running-your-booth/pricing-strategy">Pricing strategy</Link>
          . Set prices that maximize revenue.
        </li>
        <li><strong>Maintenance › Daily checks</strong> <em>(coming soon)</em>. A separate maintenance pass for keeping hardware happy.</li>
      </ul>
    </DocsLayout>
  );
}
