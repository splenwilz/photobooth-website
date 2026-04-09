import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Adding credits manually — BoothIQ Docs",
  description:
    "How to comp a customer, seed the booth for an event, and audit your manual credit additions.",
};

const HREF = "/docs/running-your-booth/adding-credits-manually";

const TOC = [
  { id: "before-you-start", label: "Before you start" },
  { id: "how-to-add", label: "How to add credits" },
  { id: "audit-trail", label: "Audit trail" },
  { id: "comping", label: "Comping a customer" },
  { id: "seeding", label: "Seeding for a small event" },
  { id: "deduct-reset", label: "Deducting and resetting credits" },
  { id: "cloud-credits", label: "Cloud-driven credits" },
  { id: "reconciling", label: "Reconciling at end of day" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-mistakes", label: "Common mistakes" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function AddingCreditsManuallyPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Adding credits manually</h1>

      <p>
        Sometimes you need to give a customer credits without them
        paying: to comp a failed print, to thank a regular, or to seed
        the booth for a small event. The Credits tab lets you add
        credits manually and records the transaction in the audit
        trail.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators handling customer
        issues or running events.
      </p>

      <h2 id="before-you-start">Before you start</h2>

      <p>Decide whether you want to:</p>

      <ul>
        <li><strong>Comp a single customer</strong> for a session that went wrong → add credits in Coin Operated mode</li>
        <li>
          <strong>Run a free event</strong> → switch to{" "}
          <strong>Free Play</strong> mode instead (see{" "}
          <Link href="/docs/running-your-booth/operation-modes">
            Operation modes
          </Link>
          )
        </li>
        <li><strong>Seed the booth</strong> for a small private session → add credits in Coin Operated mode</li>
      </ul>

      <p>
        If you&apos;re running anything bigger than a single session
        for one or two customers, <strong>Free Play mode</strong> is
        usually the better answer.
      </p>

      <h2 id="how-to-add">How to add credits</h2>

      <ol>
        <li>Open admin → <strong>Credits</strong> tab.</li>
        <li>Note the <strong>current balance</strong> so you can verify your addition worked.</li>
        <li>Find the <strong>Add Credits</strong> input or section.</li>
        <li>Tap the amount field. The on-screen keyboard appears.</li>
        <li>Enter the amount. Be careful with the decimal point. <code>5.00</code> is five dollars; <code>500</code> is five hundred.</li>
        <li>Tap the <strong>Add</strong> (or similar) button.</li>
        <li>The booth records an <strong>Admin</strong> credit transaction.</li>
        <li>The current balance updates immediately.</li>
      </ol>

      <p>Your addition is now visible in the customer&apos;s credits indicator on the welcome screen and on every customer-facing screen.</p>

      <DocsScreenshot
        src="credits-tab-manual-add-detail.png"
        alt="Credits tab manual add input with an Add button."
      />

      <h2 id="audit-trail">Audit trail</h2>

      <p>Every manual credit add is recorded in the Credits tab transaction history with:</p>

      <ul>
        <li><strong>Type:</strong> Add</li>
        <li><strong>Amount:</strong> what you entered</li>
        <li><strong>Source:</strong> Admin</li>
        <li><strong>Timestamp:</strong> when you did it</li>
        <li><strong>Balance after:</strong> the new balance</li>
      </ul>

      <p>To find a past add, open the Credits tab, scroll to the transaction history, filter by <strong>Add</strong> or <strong>Admin source</strong>, and look at the timestamps.</p>

      <h2 id="comping">Comping a customer</h2>

      <p>A customer&apos;s session went wrong. Printer jammed, photos came out blurry, the booth crashed mid-print. You want to give them a free retry.</p>

      <ol>
        <li>Apologize.</li>
        <li>Open admin → Credits.</li>
        <li>Add credits equal to the price of one session of the product they wanted.</li>
        <li>Tell the customer to walk back around to the screen and start a new session.</li>
        <li>Watch their new session complete successfully.</li>
        <li>The credits you added are spent on the new session, returning the balance to where it started.</li>
        <li>Exit admin.</li>
      </ol>

      <p>
        The audit trail will show your <strong>Admin</strong> add
        followed by a <strong>Pulse</strong> or{" "}
        <strong>Coin Operated</strong> spend. Your accountant can
        distinguish &quot;operator comp&quot; from &quot;real customer
        payment&quot; if they audit the credit history later.
      </p>

      <DocsCallout type="warning">
        <strong>Don&apos;t refund the original session in cash AND
        comp them with credits.</strong> You&apos;ll be paying twice
        for one session. Pick one and document it.
      </DocsCallout>

      <h2 id="seeding">Seeding for a small event</h2>

      <p>
        If you want to run a 30-minute session at a private event
        without switching to Free Play (e.g. you want the credit
        history to show the comp explicitly):
      </p>

      <ol>
        <li>Estimate the session count and total cost.</li>
        <li>Add that total to the credit balance in one chunk.</li>
        <li>The credits stay in the balance and are spent down as customers run sessions.</li>
        <li>When the credits run out, the next customer hits the payment screen as normal.</li>
      </ol>

      <p>
        For events with more than 5-10 sessions,{" "}
        <strong>switch to Free Play mode instead</strong>. It&apos;s
        cleaner and doesn&apos;t require you to estimate.
      </p>

      <h2 id="deduct-reset">Deducting and resetting credits</h2>

      <p>The Credits tab also lets you <strong>deduct</strong> a specific amount or <strong>reset</strong> the balance to zero:</p>

      <ul>
        <li><strong>Deduct</strong> when you&apos;ve over-comped or you need to remove an accidental addition</li>
        <li><strong>Reset</strong> at the start of an event when you want a clean slate</li>
      </ul>

      <p>Both are recorded in the audit trail with their own type labels.</p>

      <h2 id="cloud-credits">Cloud-driven credits</h2>

      <p>
        If your booth is registered to the cloud, a cloud admin can
        also push credits to the booth using a remote{" "}
        <code>add_credits</code> command. These appear in the Credits
        tab history with <strong>source = Cloud</strong> instead of
        Admin. See <strong>Remote commands</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="reconciling">Reconciling at end of day</h2>

      <p>
        At the end of a day, your end-of-day cash should match the{" "}
        <strong>Sales tab</strong> revenue minus any{" "}
        <strong>Admin credits</strong> you added during the day. The
        math:
      </p>

      <pre><code>{`expected_cash_in_box = sales_tab_revenue - manual_admin_credits_added`}</code></pre>

      <p>If your cash count doesn&apos;t match, look in the Credits tab history for unexpected manual additions, deductions, or resets you may have forgotten about.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;re using manual credit adds correctly when:</p>

      <ul>
        <li>Every comp you do is recorded in the Credits tab history</li>
        <li>You can answer &quot;where did this credit come from?&quot; from the audit trail</li>
        <li>Your end-of-day cash reconciles cleanly with the Sales tab</li>
        <li>You know when to use <strong>Free Play mode</strong> instead of comping individual customers</li>
      </ul>

      <h2 id="common-mistakes">Common mistakes</h2>

      <p><strong>Forgot the decimal point and added $500 instead of $5.</strong></p>
      <p>Open Credits tab and <strong>deduct</strong> the difference immediately.</p>

      <p><strong>Added credits but customer never came back.</strong></p>
      <p>The credits stay in the balance for the next person, or deduct them to clean up.</p>

      <p><strong>Comped twice (added credits AND refunded cash).</strong></p>
      <p>Document the mistake and learn to do one or the other.</p>

      <p><strong>Used manual adds for a big event instead of Free Play.</strong></p>
      <p>Next time switch to Free Play for cleaner accounting.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/running-your-booth/operation-modes">Operation modes</Link>
          . Free Play is usually the better answer for events.
        </li>
        <li>
          <Link href="/docs/running-your-booth/exporting-sales-data">Exporting sales data</Link>
          . Export your reconciled history.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/credits-tab">Credits tab</Link>
          . UI tour.
        </li>
      </ul>
    </DocsLayout>
  );
}
