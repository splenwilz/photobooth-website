import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Idle timeouts and screen behavior — BoothIQ Docs",
  description:
    "How long each customer-facing screen waits before resetting to the welcome screen.",
};

const HREF = "/docs/reference/timeouts";

const TOC = [
  { id: "table", label: "The table" },
  { id: "warnings", label: "Warning banners" },
  { id: "why", label: "Why these timeouts exist" },
  { id: "configurable", label: "Can I change the timeouts?" },
  { id: "payment", label: "Timeouts and the payment screen" },
  { id: "related", label: "Related" },
] as const;

export default function TimeoutsPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Idle timeouts and screen behavior</h1>

      <p>BoothIQ aggressively returns to the welcome screen if a customer walks away mid-session. This prevents the booth from getting stuck on an abandoned session and makes sure the next customer starts fresh.</p>

      <p>This article lists the approximate idle timeout for every customer-facing screen. Values are approximate and may differ slightly in your version.</p>

      <h2 id="table">The table</h2>

      <ul>
        <li><strong>Welcome screen.</strong> No timeout. The booth sits on the welcome screen indefinitely</li>
        <li><strong>Product Selection.</strong> 60 seconds. Warning, then back to welcome</li>
        <li><strong>Template Selection.</strong> 60 seconds. Warning, then back to welcome</li>
        <li><strong>Look At Camera.</strong> Advances on its own after a few seconds. Auto-advances to capture</li>
        <li><strong>Template Capture.</strong> Per-photo delays, aggressive abandonment detection. Returns to welcome if no activity</li>
        <li><strong>Photo Offer Screen.</strong> 60 seconds. Warning, then auto-continues</li>
        <li><strong>Photo Edit Screen.</strong> 120 seconds. Warning, then back to offer/continue</li>
        <li><strong>Extra Prints / Cross-sell.</strong> 180 seconds. Warning, then auto-advances</li>
        <li><strong>Photo 4×6 Selection.</strong> 180 seconds. Warning, then auto-advances</li>
        <li><strong>Payment Screen.</strong> 120 seconds. Warning, then cancels back to previous screen</li>
        <li><strong>Phone Print (QR).</strong> 180 seconds. Warning, then back to welcome</li>
        <li><strong>Phone Image Editor.</strong> 120 seconds. Warning, then auto-continues</li>
        <li><strong>Print Thank You.</strong> About 30 seconds. Auto-advances to thank-you screen</li>
        <li><strong>Thank You.</strong> Few seconds. Auto-returns to welcome</li>
      </ul>

      <h2 id="warnings">Warning banners</h2>

      <p>Most screens show a warning message before they actually time out. Typically:</p>

      <ul>
        <li>At about <strong>15 seconds before timeout</strong> (&quot;Are you still there?&quot;)</li>
        <li>At about <strong>5 seconds before timeout</strong> (&quot;Returning to welcome...&quot;)</li>
        <li>Then the timeout action fires</li>
      </ul>

      <p>The exact warning times may differ. The pattern is consistent: you get at least one clear warning before the screen actually advances or resets.</p>

      <h2 id="why">Why these timeouts exist</h2>

      <ul>
        <li><strong>Prevent orphan sessions.</strong> A customer who walks away shouldn&apos;t leave the booth stuck</li>
        <li><strong>Reset the next customer experience.</strong> When a new customer walks up, they should see the welcome screen, not a half-finished session</li>
        <li><strong>Protect paid state.</strong> Most timeouts preserve credits if the customer inserted any; the credits stay in the booth&apos;s balance for them or the next customer</li>
        <li><strong>Avoid hardware wear.</strong> Don&apos;t leave the camera preview running indefinitely</li>
      </ul>

      <h2 id="configurable">Can I change the timeouts?</h2>

      <p>Timeout values are <strong>not operator-configurable</strong> in the version of BoothIQ described in these docs. They&apos;re baked into each screen.</p>

      <p>If your venue needs different timing (e.g. slower customers who need more time to make decisions), talk to your BoothIQ point of contact.</p>

      <h2 id="payment">Timeouts and the payment screen</h2>

      <p>The payment screen is worth calling out separately:</p>

      <ul>
        <li>Timeout is about <strong>120 seconds</strong>.</li>
        <li>A 2.5-second <strong>initial delay</strong> at the start of the screen prevents stale pulses from a previous session being credited to this one.</li>
        <li>If the customer inserts some credits but not enough, the timeout still fires. The partial credits stay in the balance.</li>
        <li>If the customer inserts enough credits, the booth auto-advances to printing immediately (before the timeout).</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience">Customer Experience</Link>
          . Detailed articles on each screen.
        </li>
        <li>
          <Link href="/docs/customer-experience/welcome-screen">Welcome screen</Link>
          . The default landing after any timeout.
        </li>
      </ul>
    </DocsLayout>
  );
}
