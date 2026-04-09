import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Extra prints and cross-sell — BoothIQ Docs",
  description:
    "The upsell screen: buying multiple copies and cross-selling strips into 4×6 prints.",
};

const HREF = "/docs/customer-experience/extra-prints-and-cross-sell";

const TOC = [
  { id: "whats-on-screen", label: "What's on the screen" },
  { id: "extra-copies", label: "Buying extra copies" },
  { id: "cross-sell", label: "The cross-sell" },
  { id: "compose-new", label: "\"Compose new\" photo set" },
  { id: "what-you-control", label: "What you control" },
  { id: "price-preview", label: "The price preview is the source of truth" },
  { id: "idle-behavior", label: "Idle behavior" },
  { id: "after-this-screen", label: "What customers see after this screen" },
  { id: "what-to-tell", label: "What to tell customers" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ExtraPrintsPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Extra prints and cross-sell</h1>

      <p>
        After the offer / editor screens, customers reach the{" "}
        <strong>extra prints</strong> screen, which is the booth&apos;s
        upsell opportunity. Customers can buy multiple copies of their
        print and (in some cases) cross-sell into a different product
        type using the same photos.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to maximize
        revenue per session and understand what the cross-sell flow does.
      </p>

      <h2 id="whats-on-screen">What&apos;s on the screen</h2>

      <ul>
        <li>A <strong>preview</strong> of the composed print with a <strong>copies badge</strong> showing the current quantity</li>
        <li><strong>+/- controls</strong> to increase or decrease the number of copies (capped at the max copies you set in the Products tab)</li>
        <li>A <strong>price summary</strong> showing the total for the current copy count, including any multi-copy discount</li>
        <li>A <strong>cross-sell offer</strong> (when applicable) showing the customer they can also buy a different product made from the same photos</li>
        <li>A <strong>Continue</strong> button to confirm the order</li>
        <li>A <strong>Skip</strong> option that advances with just the original 1 copy</li>
      </ul>

      <DocsScreenshot
        src="extra-prints-screen.png"
        alt="Extra prints screen with copies counter, price summary, and cross-sell preview."
      />

      <h2 id="extra-copies">Buying extra copies</h2>

      <p>The customer taps the <strong>+</strong> button to add copies. The price updates live:</p>

      <ul>
        <li><strong>1 copy</strong> → base price (e.g. $5.00)</li>
        <li><strong>2 copies</strong> → base + extra-copy price × 1, possibly with multi-copy discount applied</li>
        <li><strong>3 copies</strong> → base + extra-copy price × 2, possibly with multi-copy discount applied</li>
        <li>And so on, up to your max copies cap</li>
      </ul>

      <p>
        If they overshoot, they tap the <strong>-</strong> button to
        bring it back down. The minimum is <strong>1</strong>. You
        can&apos;t buy zero (that&apos;s what Skip is for).
      </p>

      <h2 id="cross-sell">The cross-sell</h2>

      <p>
        For some products (notably <strong>Photo Strips</strong>), the
        booth offers a cross-sell to a different product type using the
        same photos the customer just took:
      </p>

      <ul>
        <li>A customer who chose <strong>Photo Strips</strong> sees a cross-sell offer for <strong>4×6 Prints</strong>.</li>
        <li>The 4×6 cross-sell uses the photos already captured for the strip, recomposed into a 4×6 layout.</li>
      </ul>

      <p>The cross-sell shows:</p>

      <ul>
        <li>A live preview of the 4×6 product the customer would get</li>
        <li>The price of the cross-sell</li>
        <li>A toggle or Add button to add it to the order</li>
        <li>A Skip option</li>
      </ul>

      <p>
        If the customer adds the cross-sell, the booth will print{" "}
        <strong>both</strong> the original strip(s) <strong>and</strong>{" "}
        the cross-sell 4×6 in a single session.
      </p>

      <DocsCallout type="note">
        The cross-sell is a separate add-on, not a replacement for the
        original product. The customer pays for both.
      </DocsCallout>

      <h2 id="compose-new">&quot;Compose new&quot; using a different photo set for the cross-sell</h2>

      <p>
        In some configurations, the cross-sell flow lets the customer{" "}
        <strong>compose a new</strong> 4×6 from a different photo set.
        This means the customer can pick which of the strip photos to
        use (or capture fresh ones) for the 4×6 specifically.
      </p>

      <p>
        This is the <strong>Photo 4×6 Selection</strong> screen.
        Deeper article coming in a follow-up pass.
      </p>

      <h2 id="what-you-control">What you control</h2>

      <p>In the <strong>Products tab</strong>:</p>

      <ul>
        <li><strong>Extra-copy pricing</strong> for each product</li>
        <li><strong>Multi-copy discount percentage</strong></li>
        <li><strong>Max copies per transaction</strong> for each product</li>
      </ul>

      <p>In the <strong>Templates tab</strong> (indirectly):</p>

      <ul>
        <li>Which templates are available for the cross-sell composition</li>
      </ul>

      <p>
        You don&apos;t have a single toggle to disable the cross-sell.
        If you want it off, contact your BoothIQ point of contact.
      </p>

      <h2 id="price-preview">The price preview is the source of truth</h2>

      <p>
        If you&apos;re ever confused about how the math works
        (extra-copy price + multi-copy discount + cross-sell), the{" "}
        <strong>live price preview</strong> on this screen is the
        source of truth. Walk through a test session and watch the
        price update as you change the copy count and add/remove the
        cross-sell. The number on screen is what the customer will pay.
      </p>

      <h2 id="idle-behavior">Idle behavior</h2>

      <p>
        The extra prints screen has a longer timeout (about{" "}
        <strong>180 seconds</strong>) because customers think about
        whether to add copies. After the timeout, the booth warns and
        auto-advances with the current order.
      </p>

      <h2 id="after-this-screen">What customers see after this screen</h2>

      <p>
        After tapping Continue, the customer goes to the{" "}
        <strong>payment screen</strong> with a total reflecting:
      </p>

      <ul>
        <li>Base price × 1 of the original product</li>
        <li>+ extra-copy price × (extra copies − 1) of the original product, possibly discounted</li>
        <li>+ cross-sell price (if added)</li>
      </ul>

      <p>
        See{" "}
        <Link href="/docs/customer-experience/paying">Paying</Link>.
      </p>

      <h2 id="what-to-tell">What to tell customers</h2>

      <ul>
        <li>&quot;If you want extra prints to give to friends, tap the + button to add more copies. You get a discount when you buy more.&quot;</li>
        <li>&quot;We can also make you a 4×6 photo using the same shots you just took. It&apos;s a popular gift.&quot;</li>
        <li>&quot;Tap Continue when you&apos;re done, or Skip if you just want one copy.&quot;</li>
      </ul>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>Customers don&apos;t notice the extra-prints screen.</strong></p>
      <p>This is normal. Many customers tap right through. If revenue per session is too low, consider:</p>
      <ul>
        <li>Lowering the extra-copy price to make adding copies feel cheap</li>
        <li>Increasing the multi-copy discount so 2 copies feels much better than 1</li>
        <li>Talking to your BoothIQ contact about UI tweaks</li>
      </ul>

      <p><strong>A customer wants 20 copies but the max is 5.</strong></p>
      <p>Increase max copies in the Products tab. Be aware that printing 20 copies in a row is hard on the printer and slow for the next customer.</p>

      <p><strong>The cross-sell preview shows a weird layout.</strong></p>
      <p>The cross-sell uses the same photos but recomposed. If the layout looks wrong, it might be because the cross-sell template doesn&apos;t match the photo count. Talk to your BoothIQ contact.</p>

      <p><strong>Customer tapped Skip but wanted extras.</strong></p>
      <p>They have to start a new session. Once they leave this screen, the original photos can&apos;t be re-ordered.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/paying">Paying</Link>
          . The payment screen.
        </li>
        <li><strong>Pricing strategy</strong> <em>(coming soon)</em>. How to price for upsells.</li>
      </ul>
    </DocsLayout>
  );
}
