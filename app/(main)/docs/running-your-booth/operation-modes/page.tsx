import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Operation modes (Coin vs Free Play) — BoothIQ Docs",
  description:
    "How to switch the booth between charging customers and running free, and when to use each.",
};

const HREF = "/docs/running-your-booth/operation-modes";

const TOC = [
  { id: "what-each-mode", label: "What each mode does" },
  { id: "how-to-switch", label: "How to switch modes" },
  { id: "when-to-use", label: "When to use each mode" },
  { id: "event-workflow", label: "A typical event workflow" },
  { id: "free-play-sales", label: "What sales reports show in Free Play" },
  { id: "free-play-pcb", label: "Free Play and the payment device" },
  { id: "audit-logs", label: "Mode switches are recorded" },
  { id: "common-mistakes", label: "Common mistakes" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function OperationModesPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Operation modes (Coin vs Free Play)</h1>

      <p>
        BoothIQ has two operation modes: <strong>Coin Operated</strong>{" "}
        and <strong>Free Play</strong>. Coin Operated is the default.
        Customers pay through the payment device for every session.
        Free Play is the override for free events.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators running both paid
        and unpaid events.
      </p>

      <h2 id="what-each-mode">What each mode does</h2>

      <h3>Coin Operated mode</h3>
      <ul>
        <li>The customer goes through a <strong>payment screen</strong> that waits for credits to reach the order total.</li>
        <li>The booth listens to the payment device and converts inserted coins/bills into credits.</li>
        <li>Sessions don&apos;t start until payment is complete.</li>
        <li>The credits indicator on the welcome screen shows the <strong>current credit balance</strong> in dollars (or your local currency).</li>
      </ul>
      <p>Use this for normal commercial operation where customers pay per session.</p>

      <h3>Free Play mode</h3>
      <ul>
        <li>The <strong>payment screen is skipped entirely</strong>. Customers go straight from extra-prints to printing.</li>
        <li>The credits indicator on the welcome screen shows <strong>Free Play</strong> instead of a balance.</li>
        <li>The booth still records each session in the Sales table (with $0 in revenue).</li>
        <li>The payment device, if installed, still listens for pulses. But inserted credits go into the credit balance and are not required for sessions.</li>
      </ul>
      <p>
        Use this for events where the customer is not paying out of
        pocket: corporate parties, weddings, sponsored activations,
        freebies for VIPs.
      </p>

      <h2 id="how-to-switch">How to switch modes</h2>

      <p>In the <strong>Settings tab</strong>:</p>

      <ol>
        <li>Open admin → <strong>Settings</strong>.</li>
        <li>Find the <strong>Mode</strong> section (or its equivalent in the operation mode area).</li>
        <li>Switch from <strong>Coin Operated</strong> to <strong>Free Play</strong> (or vice versa).</li>
        <li>Tap <strong>Save Settings</strong>.</li>
        <li>Confirm the change by looking at the <strong>Mode pill</strong> in the dashboard header bar. It should now read &quot;Free Play&quot; or &quot;Coin Operated&quot;.</li>
      </ol>

      <p>
        The change is immediate. The next customer who walks up will
        see the new mode reflected in the credits indicator on the
        welcome screen.
      </p>

      <DocsScreenshot
        src="header-mode-free-play.png"
        alt="Header bar with the Mode pill showing Free Play."
      />

      <h2 id="when-to-use">When to use each mode</h2>

      <h3>Use Coin Operated when:</h3>
      <ul>
        <li>Customers are paying per session (the normal commercial case)</li>
        <li>You want sales reports to reflect real revenue</li>
        <li>You want to track payment-source breakdown (cash vs cloud vs admin) accurately</li>
        <li>You&apos;re testing the payment device</li>
      </ul>

      <h3>Use Free Play when:</h3>
      <ul>
        <li>The venue or client has paid you upfront for unlimited sessions</li>
        <li>Running a promotional / freebie day to drive traffic</li>
        <li>Hosting a private event (wedding reception, birthday party, corporate event)</li>
        <li>Doing a quick test print at the start of the day without inserting coins</li>
        <li>Showing the booth to a prospective client or visitor</li>
      </ul>

      <h2 id="event-workflow">A typical event workflow</h2>

      <ol>
        <li><strong>Before the event</strong> (in Coin Operated mode), do your daily startup checklist.</li>
        <li><strong>Switch to Free Play</strong> in the Settings tab. Confirm the Mode pill in the header.</li>
        <li><strong>Exit admin.</strong> The next customer (or guest at the event) will see &quot;Free Play&quot; on the welcome screen and pay nothing for sessions.</li>
        <li><strong>During the event,</strong> monitor the Sales tab to confirm sessions are recording (even at $0 each).</li>
        <li><strong>After the event,</strong> switch back to <strong>Coin Operated</strong> in the Settings tab. Confirm the Mode pill.</li>
        <li><strong>The next paid customer</strong> will see the credits indicator and the payment screen as normal.</li>
      </ol>

      <h2 id="free-play-sales">What sales reports show in Free Play</h2>

      <p>
        Free Play sessions are recorded in the Sales table just like
        paid sessions, but with <strong>$0 revenue</strong>. Your{" "}
        <strong>transaction count</strong> still goes up, but your{" "}
        <strong>revenue numbers</strong> don&apos;t.
      </p>

      <p>
        If you want to track <strong>how many free sessions</strong>{" "}
        an event generated, look at the transaction count for the
        event period in the Sales tab. You can compare it against your
        usual paid count to estimate how busy the event was.
      </p>

      <h2 id="free-play-pcb">Free Play and the payment device</h2>

      <p>If your booth has a payment device, in Free Play mode:</p>

      <ul>
        <li>The device is <strong>still listening</strong> for pulses</li>
        <li>Any coins/bills inserted are still <strong>credited to the booth&apos;s credit balance</strong></li>
        <li>The credits sit in the balance, available for the next paid session (or for the operator to deduct in the Credits tab)</li>
      </ul>

      <p>
        This means a customer who absent-mindedly inserts a coin
        during a Free Play session <strong>won&apos;t lose it</strong>.
        It just goes into the balance. You can refund them in cash if
        they ask.
      </p>

      <h2 id="audit-logs">Mode switches are recorded</h2>

      <p>
        Switching between Coin and Free Play is recorded in the
        booth&apos;s audit logs (the database tracks who did it and
        when). This is useful when reconciling reports. You can see
        when an event started and ended in Free Play.
      </p>

      <h2 id="common-mistakes">Common mistakes</h2>

      <p><strong>Forgot to switch back to Coin Operated after a free event.</strong></p>
      <p>Customers walk up the next day and get free sessions. Switch back. The Sales tab will show the unintended free sessions for audit.</p>

      <p><strong>Switched to Free Play but didn&apos;t tap Save Settings.</strong></p>
      <p>The change didn&apos;t take effect. Save and confirm via the Mode pill.</p>

      <p><strong>Insufficient sales because mode is wrong.</strong></p>
      <p>Customers paid but the booth was in Free Play (no payment screen). Credits sat in the balance. This shouldn&apos;t happen unless the customer manually inserted coins. The credits are still there.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>After switching modes, confirm:</p>

      <ul>
        <li>The <strong>Mode pill</strong> in the dashboard header bar shows the new mode</li>
        <li>The <strong>welcome screen</strong> credits indicator reflects the new mode (a balance in Coin, &quot;Free Play&quot; text in Free Play)</li>
        <li>A test session behaves correctly (payment screen appears in Coin, is skipped in Free Play)</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/running-your-booth/adding-credits-manually">
            Adding credits manually
          </Link>
          . Comping a customer or seeding the booth.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
          . Tour of the Settings tab where you make this change.
        </li>
      </ul>
    </DocsLayout>
  );
}
