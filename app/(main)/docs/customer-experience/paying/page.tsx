import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Paying — BoothIQ Docs",
  description:
    "The payment screen: what customers see, how it accepts payment, and how Free Play changes the flow.",
};

const HREF = "/docs/customer-experience/paying";

const TOC = [
  { id: "whats-on-screen", label: "What's on the screen" },
  { id: "how-it-works", label: "How the payment screen works" },
  { id: "free-play", label: "Free Play mode" },
  { id: "cancel-mid-payment", label: "Cancel mid-payment" },
  { id: "while-waiting", label: "What customers see while waiting" },
  { id: "what-you-control", label: "What you control" },
  { id: "idle-behavior", label: "Idle behavior" },
  { id: "what-can-go-wrong", label: "What can go wrong" },
  { id: "what-to-tell", label: "What to tell customers" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PayingPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Paying</h1>

      <p>
        The payment screen is where the customer hands over money:
        coins, bills, or (where supported) card payments. The booth
        waits for credits to reach the order total, then advances
        automatically.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to
        understand how payment works and what to do when it doesn&apos;t.
      </p>

      <h2 id="whats-on-screen">What&apos;s on the screen</h2>

      <ul>
        <li>An <strong>order summary</strong> showing the product, quantity, and any cross-sell add-on</li>
        <li>A <strong>template preview</strong> so the customer remembers what they&apos;re paying for</li>
        <li>A <strong>copies badge</strong> showing how many they ordered</li>
        <li>The <strong>total price</strong> in large text</li>
        <li>The <strong>current credits</strong> loaded in the booth (also shown in the corner indicator)</li>
        <li>An animated cross-sell preview (if applicable)</li>
        <li>A <strong>Back</strong> button to cancel and return to the previous screen</li>
      </ul>

      <DocsScreenshot
        src="payment-screen.png"
        alt="Payment screen showing the order summary, template preview, total price, and current credits."
      />

      <h2 id="how-it-works">How the payment screen works</h2>

      <p>
        The payment screen does <strong>not</strong> ask the customer
        to enter an amount. Instead:
      </p>

      <ol>
        <li>The booth knows the <strong>total</strong> for the order.</li>
        <li>The customer <strong>inserts coins or bills</strong> into the payment device on the booth.</li>
        <li>Each accepted coin or bill becomes <strong>credits</strong> added to the customer&apos;s session balance.</li>
        <li>The current credit balance is displayed live on the screen.</li>
        <li>As soon as the credits <strong>reach or exceed</strong> the total, the screen auto-advances to printing.</li>
        <li>Any <strong>excess credits</strong> beyond the total are held in the booth&apos;s credit balance and carry over.</li>
      </ol>

      <p>
        There&apos;s a <strong>2.5-second initial delay</strong> before
        the booth starts listening for credits. This prevents stale
        pulses from a previous session from being credited to the
        current one.
      </p>

      <h2 id="free-play">Free Play mode</h2>

      <p>
        When the booth is in <strong>Free Play</strong> mode (set in{" "}
        <strong>Settings → Operation Mode</strong>), the payment screen
        is skipped entirely. The customer goes straight from the
        extra-prints screen to printing.
      </p>

      <p>
        The order summary still shows in the print thank-you screen,
        just without the price.
      </p>

      <p>
        For when to use Free Play, see <strong>Operation modes</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="cancel-mid-payment">Cancel mid-payment</h2>

      <p>
        If the customer changes their mind, they can tap the{" "}
        <strong>Back</strong> button to cancel the order. They return
        to the previous screen (extra prints), and any credits
        they&apos;ve already inserted{" "}
        <strong>stay in the credit balance</strong>. They can then
        start a fresh session and use those credits, or you can refund
        them in cash from the cash box (and deduct the credits from the
        Credits tab).
      </p>

      <DocsCallout type="note">
        If a customer asks for a cash refund, take the credits down in
        the <strong>Credits tab</strong> so the audit trail is clean.
      </DocsCallout>

      <h2 id="while-waiting">What customers see while waiting</h2>

      <p>
        The payment screen has subtle animations to keep customers
        engaged while they&apos;re inserting money:
      </p>

      <ul>
        <li>The credit count animates as credits are added</li>
        <li>The total turns green or pulses when credits reach the total</li>
        <li>The cross-sell preview rotates through angles every few seconds</li>
      </ul>

      <h2 id="what-you-control">What you control</h2>

      <p>In the <strong>Products tab</strong>:</p>
      <ul>
        <li>The <strong>base prices</strong> that determine the total</li>
      </ul>

      <p>In the <strong>Settings tab</strong>:</p>
      <ul>
        <li>The <strong>operation mode</strong> (Coin Operated vs Free Play)</li>
      </ul>

      <p>In the <strong>Diagnostics tab</strong>:</p>
      <ul>
        <li>The <strong>payment device COM port</strong> and the listener configuration</li>
      </ul>

      <h2 id="idle-behavior">Idle behavior</h2>

      <p>
        The payment screen times out after{" "}
        <strong>about 120 seconds</strong>. If the customer doesn&apos;t
        insert any credits in that time, the booth shows a warning and
        then auto-cancels back to the welcome screen. Any credits
        inserted before the timeout stay in the balance.
      </p>

      <h2 id="what-can-go-wrong">What can go wrong</h2>

      <h3>Customer inserts coins but the credit balance doesn&apos;t change</h3>
      <p>
        The PCB pill is probably red. The booth isn&apos;t talking to
        the payment device. See <strong>Payment not registering</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h3>Customer inserts coins but the screen doesn&apos;t advance</h3>
      <p>
        Check the credit balance vs the total. They may have only
        partially paid. They need to insert more.
      </p>

      <h3>Customer claims they paid the right amount but the booth says less</h3>
      <p>
        Open the <strong>Credits tab</strong> in admin and look at the
        recent <strong>Pulse</strong> transactions. If the booth
        received fewer pulses than expected, the payment device may be
        undercount or the customer&apos;s coin/bill was rejected
        without registering.
      </p>

      <h3>Customer paid but printing failed</h3>
      <p>
        The print failed after credits were already deducted.{" "}
        <strong>Don&apos;t</strong> automatically refund. The credits
        have already been spent. Instead, manually <strong>add credits</strong>{" "}
        equal to the lost session and tell the customer they can run
        another session for free. See <strong>Credits tab</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="what-to-tell">What to tell customers</h2>

      <ul>
        <li>&quot;Insert your coins or bills into the slot. The screen will count them for you.&quot;</li>
        <li>&quot;When you&apos;ve put in enough, it&apos;ll go to the next screen by itself.&quot;</li>
        <li>&quot;Tap Back if you want to cancel the order.&quot;</li>
      </ul>

      <p>For free play events:</p>

      <ul>
        <li>&quot;It&apos;s free today. Just tap Continue and your photos will print.&quot;</li>
      </ul>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>The booth keeps auto-cancelling because customers take too long.</strong></p>
      <p>The 120-second timeout isn&apos;t operator-configurable. If your customers are slow with payment, encourage them to have their money ready before they start the session.</p>

      <p><strong>Can I support card payments?</strong></p>
      <p>Card support depends on the payment hardware your kiosk has. Talk to your BoothIQ point of contact.</p>

      <p><strong>Can I refund a customer from the booth?</strong></p>
      <p>Not directly. Take the credits down in the Credits tab and refund the customer in cash from the cash box. Document the refund somewhere outside the booth.</p>

      <p><strong>The customer over-paid.</strong></p>
      <p>The excess stays in the credit balance and is available to them or to the next customer who walks up. If you want to refund the excess, take it down in the Credits tab.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/printing-and-thank-you">
            Printing and thank you
          </Link>
          . What happens after the customer pays.
        </li>
        <li><strong>Payment not registering</strong> <em>(coming soon)</em>. When credits aren&apos;t being added.</li>
        <li><strong>Credits tab</strong> <em>(coming soon)</em>. Where you&apos;ll spend time auditing payment.</li>
      </ul>
    </DocsLayout>
  );
}
