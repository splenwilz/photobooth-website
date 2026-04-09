import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Credits tab — BoothIQ Docs",
  description:
    "A tour of the Credits tab: current balance, manual credit additions, history, and source breakdown.",
};

const HREF = "/docs/admin-dashboard/credits-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout", label: "Layout" },
  { id: "current-balance", label: "Current balance" },
  { id: "headline-cards", label: "Headline cards" },
  { id: "manual-add", label: "Manually adding credits" },
  { id: "deduct-reset", label: "Deducting / resetting credits" },
  { id: "flow-chart", label: "Credit flow chart" },
  { id: "source-breakdown", label: "Credit source breakdown" },
  { id: "history", label: "Transaction history" },
  { id: "comp-customer", label: "How to comp a customer" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CreditsTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Credits tab</h1>

      <p>
        The <strong>Credits</strong> tab is where you manage the
        booth&apos;s credit balance and audit how credits flow through
        the system. Credits are the unit BoothIQ uses to represent
        customer payment. Every coin or bill the customer inserts
        becomes credits, and every print they buy deducts credits.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators investigating
        &quot;where did the money go&quot; questions, comping a
        customer, or auditing credit history.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>See the <strong>current credit balance</strong> on the booth in real time</li>
        <li><strong>Manually add credits</strong> to comp a customer or for an event</li>
        <li>See the full <strong>credit transaction history</strong> with filters</li>
        <li>Understand the <strong>source</strong> of every credit (Pulse / Cloud / Admin / Other)</li>
        <li>Watch the <strong>credit flow chart</strong> for visual breakdown</li>
      </ul>

      <h2 id="layout">Layout</h2>

      <p>Top to bottom:</p>

      <ol>
        <li>Page header with the title &quot;Credits&quot;</li>
        <li>Headline cards showing the current balance and recent activity</li>
        <li>Manual credit add section with an input and a button</li>
        <li>Credit flow chart (visual breakdown of additions, deductions, resets)</li>
        <li>Transaction history table with filters and pagination</li>
      </ol>

      <DocsScreenshot
        src="credits-tab-full.png"
        alt="Credits tab with the current balance, headline cards, manual add section, credit flow chart, and history table."
      />

      <h2 id="current-balance">Current balance</h2>

      <p>
        The most prominent number on this tab is the{" "}
        <strong>current credit balance</strong>, the value that
        customers will see in the welcome screen&apos;s credits
        indicator. It&apos;s stored in the local database under the{" "}
        <code>System</code> / <code>CurrentCredits</code> setting and
        updates in real time as customers insert money or finish
        sessions.
      </p>

      <p>
        In <strong>Free Play</strong> mode the balance is irrelevant.
        Customers don&apos;t need credits to start a session. But the
        balance still tracks (and you can still add to it manually) so
        you have an audit trail.
      </p>

      <h2 id="headline-cards">Headline cards</h2>

      <p>Around the current balance you&apos;ll see secondary stats. Typically:</p>

      <ul>
        <li><strong>Today&apos;s additions.</strong> Credits added today (any source)</li>
        <li><strong>Today&apos;s deductions.</strong> Credits spent on prints today</li>
        <li><strong>Net change.</strong> Additions minus deductions</li>
      </ul>

      <p>
        These give you a quick &quot;what happened today&quot; picture
        without digging into the history table.
      </p>

      <h2 id="manual-add">Manually adding credits</h2>

      <p>
        To add credits to the booth (e.g. comping a customer whose
        print failed, or seeding the booth for a free-play event
        without switching modes):
      </p>

      <ol>
        <li>Find the <strong>Add Credits</strong> input or section.</li>
        <li>Enter the amount you want to add.</li>
        <li>Tap the <strong>Add</strong> (or similar) button.</li>
        <li>The booth records an <strong>Admin</strong> credit transaction in the history.</li>
        <li>The current balance updates immediately.</li>
      </ol>

      <p>
        Manual credit adds are recorded with{" "}
        <code>source = Admin</code> so you can find them in the
        history filter later.
      </p>

      <DocsCallout type="warning">
        <strong>Be careful with the decimal point.</strong> The booth
        treats credits as decimal currency. <code>1.00</code> is one
        dollar/euro, <code>0.25</code> is twenty-five cents.
      </DocsCallout>

      <DocsScreenshot
        src="credits-tab-manual-add.png"
        alt="Manual add credits section with an amount input and an Add button."
      />

      <h2 id="deduct-reset">Deducting / resetting credits</h2>

      <p>
        To remove credits from the booth (e.g. you accidentally added
        too much, or you want a clean slate at the start of an event):
      </p>

      <ul>
        <li><strong>Deduct</strong>. Subtract a specific amount</li>
        <li><strong>Reset</strong>. Set the balance back to zero</li>
      </ul>

      <p>
        Both operations are recorded in the credit history with their
        own type label so you can audit them later.
      </p>

      <h2 id="flow-chart">Credit flow chart</h2>

      <p>A visual chart showing the breakdown of credit movements over a chosen period:</p>

      <ul>
        <li><strong>Add</strong> transactions (green/teal). Credits coming in</li>
        <li><strong>Deduct</strong> transactions (red). Credits being spent on prints</li>
        <li><strong>Reset</strong> transactions (yellow/amber). Manual zero-outs</li>
      </ul>

      <p>
        This is mostly for spotting unusual patterns at a glance. E.g.
        a sudden spike in resets means someone has been clearing the
        balance more than expected.
      </p>

      <h2 id="source-breakdown">Credit source breakdown</h2>

      <p>
        Every credit transaction has a <strong>source</strong>, where
        the credit came from:
      </p>

      <ul>
        <li><strong>Pulse.</strong> From the coin / bill acceptor PCB. This is the normal &quot;customer paid&quot; flow</li>
        <li><strong>Cloud.</strong> From a remote <code>add_credits</code> command sent by the cloud dashboard</li>
        <li><strong>Admin.</strong> From a manual addition you did in this tab</li>
        <li><strong>Other.</strong> Legacy or unknown source. Usually only seen on very old transactions</li>
      </ul>

      <p>
        The Credits tab shows a source breakdown so you can answer
        questions like <em>&quot;how much of last week&apos;s revenue
        came from cash vs cloud comps vs admin adds?&quot;</em>
      </p>

      <h2 id="history">Transaction history</h2>

      <p>A paginated table at the bottom shows every credit transaction with:</p>

      <ul>
        <li>Date and time</li>
        <li>Type (Add / Deduct / Reset)</li>
        <li>Amount</li>
        <li>Source (Pulse / Cloud / Admin / Other)</li>
        <li>Balance after the transaction</li>
      </ul>

      <p>Filter buttons or dropdowns let you narrow the list by type:</p>

      <ul>
        <li><strong>All</strong>. Show everything</li>
        <li><strong>Add</strong> only</li>
        <li><strong>Deduct</strong> only</li>
        <li><strong>Reset</strong> only</li>
      </ul>

      <p>Pagination shows about 20 entries per page.</p>

      <DocsScreenshot
        src="credits-tab-history.png"
        alt="Credit transaction history with filter buttons and paginated rows."
      />

      <h2 id="comp-customer">How to comp a customer</h2>

      <p>
        Common scenario: a customer&apos;s print came out blurry, or
        the printer jammed during their session. You want to give
        them a &quot;free retry.&quot;
      </p>

      <ol>
        <li>Open the Credits tab.</li>
        <li>Note the <strong>current balance</strong> so you can verify your add worked.</li>
        <li><strong>Add credits</strong> equal to the price of one session (or whatever amount you want to comp).</li>
        <li>Walk back to the customer and tell them they can run another session.</li>
        <li>After they&apos;re done, the balance should be back to where it started (the comped credits get spent on the new session).</li>
      </ol>

      <p>
        Because the comp is recorded as <code>source = Admin</code>,
        your accountant can distinguish &quot;real customer
        payments&quot; from &quot;operator comps&quot; in the audit
        trail.
      </p>

      <h2 id="verify">Verify it worked</h2>

      <p>You can use the Credits tab effectively when you can:</p>

      <ul>
        <li>Read the current balance</li>
        <li>Add credits manually</li>
        <li>Find a specific past transaction by filtering</li>
        <li>Identify whether a credit came from a customer, the cloud, or an admin add</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Balance is wrong.</strong></p>
      <p>The booth missed a Pulse signal, or there&apos;s a stale state. Check the credit history for missing entries. Restart the booth if balances disagree wildly with what&apos;s expected.</p>

      <p><strong>Manual add doesn&apos;t change the balance.</strong></p>
      <p>You forgot to tap the confirmation button, or the amount was zero. Check the transaction history. If no Admin entry was recorded, repeat the add.</p>

      <p><strong>Customer paid but credit didn&apos;t appear.</strong></p>
      <p>The PCB pill is probably red. See <strong>Payment not registering</strong> <em>(coming soon)</em>.</p>

      <p><strong>Pulse history shows duplicates.</strong></p>
      <p>Rare. Usually a hardware glitch. Note the time and contact support.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/products-tab">Products tab</Link>
          . Configure prices so credits map to products correctly.
        </li>
        <li><strong>Running Your Booth › Adding credits manually</strong> <em>(coming soon)</em>. A task-oriented walkthrough.</li>
        <li><strong>Cloud and Fleet › Remote commands</strong> <em>(coming soon)</em>. How cloud admins push credits to the booth remotely.</li>
      </ul>
    </DocsLayout>
  );
}
