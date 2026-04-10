import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Coin and bill acceptor care — BoothIQ Docs",
  description:
    "Clearing jams, routine cleaning, and keeping the payment device working.",
};

const HREF = "/docs/maintenance/coin-acceptor-care";

const TOC = [
  { id: "how-often", label: "How often to clean" },
  { id: "common-problems", label: "Common problems" },
  { id: "cleaning", label: "Cleaning routine" },
  { id: "what-not", label: "What NOT to do" },
  { id: "programming", label: "Programming and calibration" },
  { id: "cash-collection", label: "Cash collection" },
  { id: "verify", label: "Verify it worked" },
  { id: "support", label: "When to call support" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CoinAcceptorCarePage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Coin and bill acceptor care</h1>

      <p>
        Coin and bill acceptors are mechanical devices that handle
        money in often-dusty venues. They&apos;re surprisingly
        reliable but they do need occasional attention. This article
        covers routine care.
      </p>

      <p><strong>Who this is for:</strong> Operators with payment hardware on their booth.</p>

      <h2 id="how-often">How often to clean</h2>

      <ul>
        <li><strong>Heavy</strong> (event venue). Once a month</li>
        <li><strong>Medium</strong> (steady). Every 2-3 months</li>
        <li><strong>Light.</strong> Twice a year</li>
        <li><strong>After a jam.</strong> Immediately, before the next customer</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <h3>Coin acceptor jams</h3>

      <p>A coin gets stuck inside the acceptor and either blocks the slot or causes the device to ignore further coins.</p>

      <p>Symptoms:</p>
      <ul>
        <li>Customer says the coin slot is blocked</li>
        <li>Coins don&apos;t register even though customer is inserting them</li>
        <li>Acceptor reports an error in the PCB diagnostics</li>
      </ul>

      <p><strong>Fix:</strong></p>
      <ol>
        <li>Take the booth out of customer service (Free Play mode).</li>
        <li>Locate the coin acceptor&apos;s service door (often a hinged panel near the coin slot).</li>
        <li>Open it carefully.</li>
        <li>Look for a stuck coin and remove it gently.</li>
        <li>Close the door.</li>
        <li>Test by inserting a coin and watching the credit balance update.</li>
      </ol>

      <p>If you can&apos;t see or reach the jammed coin, contact support. Don&apos;t force anything.</p>

      <h3>Bill acceptor jams</h3>

      <p>A bill gets stuck inside the acceptor partway. Worst case, the customer&apos;s bill is partially eaten.</p>

      <p>Symptoms:</p>
      <ul>
        <li>Bill slot won&apos;t accept new bills</li>
        <li>A bill is visible sticking out of the slot</li>
        <li>Bill acceptor reports an error</li>
      </ul>

      <p><strong>Fix:</strong></p>
      <ol>
        <li>Take the booth out of customer service.</li>
        <li>Locate the bill acceptor&apos;s service door.</li>
        <li>Open it. Many bill acceptors have a release button or lever to free a stuck bill.</li>
        <li>Carefully pull out the stuck bill.</li>
        <li>Inspect the bill. If it&apos;s the customer&apos;s, return it to them. If it&apos;s been damaged, you may need to compensate.</li>
        <li>Close the service door.</li>
        <li>Test by inserting a fresh bill.</li>
      </ol>

      <p>If the bill acceptor jams <strong>repeatedly</strong>, the internals may need cleaning or service. Contact support.</p>

      <h3>Coin acceptor rejects every coin</h3>

      <p>The acceptor isn&apos;t actually broken. It might be:</p>

      <ul>
        <li><strong>Calibrated for the wrong currency.</strong> Acceptors are programmed for a specific currency. If your venue suddenly has international visitors with foreign coins, those will be rejected.</li>
        <li><strong>Dirty optical sensors inside.</strong> Dust on the optical sensors confuses the acceptor&apos;s coin recognition.</li>
        <li><strong>Mechanical wear.</strong> Old acceptors lose calibration over time.</li>
      </ul>

      <p><strong>Fix:</strong></p>
      <ol>
        <li>Try several <strong>clean</strong> local-currency coins. If they&apos;re all rejected, the acceptor needs service.</li>
        <li>If only some coins are rejected, the acceptor is being picky. Clean it (next section) and recalibrate if you have access to the calibration controls.</li>
        <li>Persistent rejection = contact support.</li>
      </ol>

      <h2 id="cleaning">Cleaning routine</h2>

      <h3>Coin acceptor</h3>
      <ol>
        <li>Take the booth out of service.</li>
        <li>Open the coin acceptor&apos;s service door.</li>
        <li>Inside you&apos;ll see the coin path. A series of channels and rollers.</li>
        <li>Use a <strong>soft brush</strong> or <strong>dry compressed air</strong> to remove dust from the channels.</li>
        <li><strong>Wipe the optical sensors</strong> (small lens-like windows) with a dry microfiber cloth.</li>
        <li><strong>Don&apos;t use liquid cleaners</strong> unless the manufacturer&apos;s manual says it&apos;s OK.</li>
        <li>Close the service door.</li>
        <li>Test with several coins.</li>
      </ol>

      <h3>Bill acceptor</h3>
      <ol>
        <li>Take the booth out of service.</li>
        <li>Open the bill acceptor&apos;s service door.</li>
        <li>The bill path will have rollers and possibly a vertical sensor strip.</li>
        <li>Use <strong>dry compressed air</strong> to clear dust.</li>
        <li>Wipe the rollers with a <strong>slightly damp</strong> microfiber cloth (not soaking).</li>
        <li>Wipe the sensor strip with a dry microfiber cloth.</li>
        <li>Close the service door.</li>
        <li>Test with several bills.</li>
      </ol>

      <h2 id="what-not">What NOT to do</h2>

      <ul>
        <li><strong>Don&apos;t</strong> use water to clean either device. It can short electronics</li>
        <li><strong>Don&apos;t</strong> spray cleaner directly on any component</li>
        <li><strong>Don&apos;t</strong> force a stuck coin or bill. You&apos;ll damage the rollers</li>
        <li><strong>Don&apos;t</strong> stick metal objects into the slots to dislodge things</li>
        <li><strong>Don&apos;t</strong> open the device internals beyond the service door</li>
        <li><strong>Don&apos;t</strong> rewire or modify the acceptor</li>
      </ul>

      <h2 id="programming">Programming and calibration</h2>

      <p>Most coin and bill acceptors have a programming mode for accepting specific denominations. This is <strong>manufacturer-specific</strong> and is usually set up at the factory to match your local currency.</p>

      <p>If you need to add new denominations (e.g. you&apos;re moving from a country with $1 coins to one with $1 bills), contact support for instructions.</p>

      <h2 id="cash-collection">Cash collection</h2>

      <p>Whoever is responsible for cash collection should:</p>

      <ol>
        <li>Open the <strong>cash box</strong> (separate from the acceptor itself, usually a locked compartment inside the kiosk).</li>
        <li>Take the cash.</li>
        <li>Compare against the <strong>Sales tab</strong> revenue for the period. The cash should match within rounding (allowing for any manual credit adds you did during the period).</li>
        <li>Reset the cash box.</li>
      </ol>

      <p>The acceptor itself doesn&apos;t store the money. It routes accepted coins/bills into a dedicated cash box behind it. The booth&apos;s audit trail (Sales tab + Credits tab history) is the source of truth for revenue.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>The payment device is healthy when:</p>

      <ul>
        <li>The PCB pill in admin is green</li>
        <li>Coins / bills are accepted reliably (no random rejections)</li>
        <li>A test customer session in Coin Operated mode credits correctly</li>
        <li>The device hasn&apos;t jammed in your last few sessions</li>
      </ul>

      <h2 id="support">When to call support</h2>

      <ul>
        <li>The acceptor jams repeatedly even after cleaning</li>
        <li>The acceptor rejects local-currency coins consistently</li>
        <li>The acceptor has visible damage</li>
        <li>You need to recalibrate or change accepted denominations</li>
        <li>The cash box lock is broken</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li><strong>Payment not registering</strong> <em>(coming soon)</em>. When the device isn&apos;t working.</li>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Where you check PCB status.
        </li>
      </ul>
    </DocsLayout>
  );
}
