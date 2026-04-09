import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Pricing strategy — BoothIQ Docs",
  description:
    "How to set base prices, extra-copy prices, and multi-copy discounts to maximize revenue.",
};

const HREF = "/docs/running-your-booth/pricing-strategy";

const TOC = [
  { id: "three-levers", label: "The three pricing levers" },
  { id: "math", label: "How the math works" },
  { id: "patterns", label: "Common pricing patterns" },
  { id: "how-to-pick", label: "How to pick prices" },
  { id: "how-to-change", label: "How to change a price" },
  { id: "free-play", label: "Free Play and pricing" },
  { id: "cross-sell", label: "Cross-sell pricing" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-mistakes", label: "Common mistakes" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PricingStrategyPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Pricing strategy</h1>

      <p>
        How you price your products is one of the most important
        business decisions an operator makes. BoothIQ gives you three
        pricing levers per product: <strong>base price</strong>,{" "}
        <strong>extra-copy price</strong>, and{" "}
        <strong>multi-copy discount percentage</strong>. This article
        explains how to use them.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators setting prices for
        the first time, or revisiting pricing based on sales data.
      </p>

      <h2 id="three-levers">The three pricing levers</h2>

      <p>For each product (Photo Strips, 4×6 Prints, Smartphone Print), you set:</p>

      <h3>1. Base price</h3>
      <p>
        What the customer pays for the <strong>first copy</strong> of
        the product. This is what shows on the product selection
        screen and what most customers see when they decide whether
        to use the booth.
      </p>

      <h3>2. Extra-copy price</h3>
      <p>
        What the customer pays for <strong>each additional copy</strong>{" "}
        in the same session. Almost always lower than the base price.
        The customer is &quot;buying in bulk&quot; with photos already
        taken.
      </p>

      <h3>3. Multi-copy discount percentage</h3>
      <p>
        A percentage off the extra-copy price when the customer buys
        more than one. Stacks with the extra-copy price.
      </p>

      <h2 id="math">How the math works</h2>

      <p>A customer buying <strong>N</strong> copies of a product pays:</p>

      <pre><code>{`total = base_price + ((N - 1) × extra_copy_price × (1 - discount/100))`}</code></pre>

      <p>Example: base $5.00, extra $2.00, discount 20%, <strong>3 copies</strong>:</p>

      <pre><code>{`total = 5.00 + (2 × 2.00 × 0.80) = 5.00 + 3.20 = $8.20`}</code></pre>

      <p>
        You can verify the exact math by walking through a session and
        watching the live price preview on the{" "}
        <strong>extra prints</strong> screen. That&apos;s the source
        of truth.
      </p>

      <h2 id="patterns">Common pricing patterns</h2>

      <h3>Pattern 1: Simple base price, no extras</h3>
      <ul>
        <li>Base: $5</li>
        <li>Extra: $5 (same as base)</li>
        <li>Discount: 0%</li>
      </ul>
      <p>Every copy costs $5. Simple but leaves money on the table. Customers who want 2 copies will think twice.</p>

      <h3>Pattern 2: Loss-leader extras</h3>
      <ul>
        <li>Base: $5</li>
        <li>Extra: $1</li>
        <li>Discount: 0%</li>
      </ul>
      <p>The first copy is the real price; extras are nearly free. Encourages customers to take a few extras to share.</p>

      <h3>Pattern 3: Bulk discount</h3>
      <ul>
        <li>Base: $7</li>
        <li>Extra: $3</li>
        <li>Discount: 30%</li>
      </ul>
      <p>The first copy is more premium-priced. Each extra is 30% off, so 4 copies cost $7 + 3 × $2.10 = $13.30. Encourages &quot;buy more, save more&quot; thinking.</p>

      <h3>Pattern 4: Event pricing</h3>
      <ul>
        <li>Base: $0 or $1</li>
        <li>Extra: $0</li>
        <li>Discount: 0%</li>
      </ul>
      <p>
        Free play or near-free for events where the venue is paying
        you. Combine with <strong>Free Play mode</strong> for fully
        complimentary sessions.
      </p>

      <h2 id="how-to-pick">How to pick prices</h2>

      <h3>Step 1: Survey local competition</h3>
      <p>
        Before you set prices, check what other photobooths in your
        area charge. BoothIQ doesn&apos;t have a &quot;right&quot;
        price. It depends on your venue, your customers, and what they
        expect to pay.
      </p>

      <h3>Step 2: Cost per print</h3>
      <p>
        Each DNP 4×6 print costs you something in media. Divide the
        cost of a fresh roll by 700 (the prints per roll) to get your
        per-print media cost. Add some margin for power, maintenance,
        the kiosk hardware amortized over its lifetime, and your time.
      </p>
      <p>
        You should be charging <strong>at least 5×</strong> your media
        cost per print to make a real profit after all overhead.
      </p>

      <h3>Step 3: Price for the first copy, not the average</h3>
      <p>
        Customers decide whether to use the booth based on the{" "}
        <strong>base price</strong> they see on the product selection
        screen. If the base price is too high, they walk away. If
        it&apos;s too low, you&apos;re not earning what you could.
      </p>
      <p>
        Set the base price for the <strong>first impression</strong>,
        then use extras and discounts to capture additional revenue
        from customers who decided to use it.
      </p>

      <h3>Step 4: Encourage extras</h3>
      <p>The extra-prints screen is your upsell opportunity. Make extras feel cheap:</p>
      <ul>
        <li>Set extra-copy price to <strong>30-40% of the base price</strong></li>
        <li>Add a <strong>20-30% multi-copy discount</strong></li>
      </ul>
      <p>Customers who weren&apos;t planning to buy extras will tap +1 on the way to the payment screen.</p>

      <h3>Step 5: Watch the data</h3>
      <p>
        After a week or two, open the{" "}
        <Link href="/docs/admin-dashboard/sales-tab">
          Sales &amp; Analytics tab
        </Link>{" "}
        and look at:
      </p>
      <ul>
        <li><strong>Average copies per transaction.</strong> Are customers buying extras at all?</li>
        <li><strong>Revenue per session.</strong> Divide total revenue by transaction count</li>
        <li><strong>Product breakdown.</strong> Which product is generating most of your revenue?</li>
      </ul>
      <p>If average copies is <strong>1.0</strong>, your extras pricing isn&apos;t working. Extras are too expensive or not visible enough.</p>
      <p>If average copies is <strong>3+</strong>, your extras pricing is generating real upsell revenue.</p>

      <h3>Step 6: Adjust and repeat</h3>
      <p>
        Change one variable at a time and watch the data for at least
        a few days before making the next change. Don&apos;t change
        the base price and the discount and the extras all at once.
        You won&apos;t know which change moved the needle.
      </p>

      <h2 id="how-to-change">How to change a price</h2>

      <p>
        In the{" "}
        <Link href="/docs/admin-dashboard/products-tab">Products tab</Link>
        :
      </p>

      <ol>
        <li>Find the product card.</li>
        <li>Tap the field you want to change (base price, extra-copy price, or discount).</li>
        <li>Enter the new value.</li>
        <li>Tap <strong>Save</strong>.</li>
        <li>Exit admin and verify on the customer-facing screens.</li>
      </ol>

      <DocsCallout type="warning">
        Don&apos;t change prices mid-event. A customer who saw $5 on
        the product selection screen and gets charged $7 at payment
        will be unhappy.
      </DocsCallout>

      <h2 id="free-play">Free Play and pricing</h2>

      <p>
        Free Play mode (set in <strong>Settings → Operation Mode</strong>)
        bypasses payment entirely. Your prices in the Products tab are
        still <strong>shown</strong> on the product selection screen,
        but the customer doesn&apos;t pay. Use Free Play for:
      </p>

      <ul>
        <li>Free corporate events</li>
        <li>Wedding / private events you&apos;ve already been paid for</li>
        <li>Promotional days</li>
        <li>Testing the booth in production</li>
      </ul>

      <p>
        For a deeper guide, see{" "}
        <Link href="/docs/running-your-booth/operation-modes">
          Operation modes
        </Link>
        .
      </p>

      <h2 id="cross-sell">Cross-sell pricing</h2>

      <p>
        The cross-sell offer on the extra-prints screen (e.g. adding a
        4×6 to a strip order) uses the{" "}
        <strong>base price of the cross-sell product</strong>. So if
        your Photo Strips base is $5 and your 4×6 base is $7, a
        customer who buys strips and adds the cross-sell pays $5 + $7
        = $12.
      </p>

      <p>Cross-sells work best when both prices are reasonable. If 4×6 is significantly more expensive, customers won&apos;t add it.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;re using pricing strategy effectively when:</p>

      <ul>
        <li>The base prices are competitive for your market</li>
        <li>Extras and discounts are encouraging customers to buy 2-4 copies on average</li>
        <li>Sales tab shows revenue per session is well above your media cost</li>
        <li>You can change prices without breaking the booth</li>
      </ul>

      <h2 id="common-mistakes">Common mistakes</h2>

      <p><strong>Setting all prices the same and never revisiting.</strong></p>
      <p>Use the Sales tab to identify what&apos;s working and adjust.</p>

      <p><strong>Pricing too high and getting no customers.</strong></p>
      <p>Lower the base price; use the cross-sell for upsell instead.</p>

      <p><strong>Pricing too low and losing money on every print.</strong></p>
      <p>Raise the base price; use discounts to soften the increase.</p>

      <p><strong>Forgetting to tap Save in the Products tab.</strong></p>
      <p>Always confirm by exiting admin and walking through a customer session.</p>

      <p><strong>Changing prices mid-event.</strong></p>
      <p>Wait until between events.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/running-your-booth/operation-modes">Operation modes</Link>
          . Coin vs Free Play.
        </li>
        <li>
          <Link href="/docs/running-your-booth/exporting-sales-data">Exporting sales data</Link>
          . Get your sales out of the booth.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/sales-tab">Sales &amp; Analytics tab</Link>
          . Where you&apos;ll watch the impact of pricing changes.
        </li>
      </ul>
    </DocsLayout>
  );
}
