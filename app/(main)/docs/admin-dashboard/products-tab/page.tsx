import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Products tab — BoothIQ Docs",
  description:
    "A tour of the Products tab: enable products, set base prices, configure extra-copy pricing and discounts.",
};

const HREF = "/docs/admin-dashboard/products-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout", label: "Layout" },
  { id: "enable-disable", label: "Enabling and disabling a product" },
  { id: "base-prices", label: "Setting base prices" },
  { id: "extra-copy", label: "Extra-copy pricing" },
  { id: "multi-copy-discount", label: "Multi-copy discount" },
  { id: "max-copies", label: "Maximum copies per transaction" },
  { id: "saving", label: "Saving" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "pricing-strategy", label: "Pricing strategy" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ProductsTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Products tab</h1>

      <p>
        The <strong>Products</strong> tab is where you control which
        products customers can buy and how much they cost. Three
        product types are supported: <strong>Photo Strips</strong>,{" "}
        <strong>4×6 Prints</strong>, and{" "}
        <strong>Smartphone Print</strong>. Each one can be enabled or
        disabled independently, has its own base price, and has its
        own extra-copy pricing.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators setting prices for
        the first time, or adjusting them seasonally.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>Enable or disable each product type (so the customer doesn&apos;t see disabled products on the product selection screen)</li>
        <li>Set the <strong>base price</strong> of each product</li>
        <li>Set the <strong>extra-copy price</strong> (what the customer pays for each additional copy of the same product)</li>
        <li>Set the <strong>maximum copies</strong> per transaction</li>
        <li>Set the <strong>multi-copy discount percentage</strong> (a percentage off when the customer buys more than one)</li>
        <li>Save your changes</li>
      </ul>

      <h2 id="layout">Layout</h2>

      <p>Each product gets its own card with:</p>

      <ul>
        <li>The product <strong>name</strong> and a small icon</li>
        <li>An <strong>enable / disable toggle</strong></li>
        <li>A <strong>base price</strong> input</li>
        <li>An <strong>extra-copy price</strong> input</li>
        <li>A <strong>max copies</strong> input (typical default: 5 or 10)</li>
        <li>A <strong>multi-copy discount</strong> percentage input</li>
        <li>A short description</li>
      </ul>

      <p>
        There&apos;s a <strong>Save</strong> button that commits all
        changes at once (don&apos;t forget to tap it).
      </p>

      <DocsScreenshot
        src="products-tab-full.png"
        alt="Products tab with three product cards: Photo Strips, 4x6 Prints, and Smartphone Print."
      />

      <h2 id="enable-disable">Enabling and disabling a product</h2>

      <p>To remove a product from the customer-facing screens:</p>

      <ol>
        <li>Find the product card.</li>
        <li>Tap its enable toggle to <strong>off</strong>.</li>
        <li>Tap <strong>Save</strong>.</li>
        <li>The next customer who reaches the product selection screen will see only the products you have enabled.</li>
      </ol>

      <p>
        You can disable any product at any time. If you disable all
        three, the booth will show an empty product selection screen.
        Don&apos;t do that.
      </p>

      <DocsCallout type="note">
        <strong>Use case:</strong> if your printer is out of paper and
        you only have time to get more before the lunch rush,
        temporarily disable Photo Strips and 4×6 Prints (both consume
        paper) and leave Smartphone Print enabled. (Note: Smartphone
        Print also prints, so this is a contrived example. But the
        pattern of &quot;disable products to limit what the booth
        offers&quot; is real.)
      </DocsCallout>

      <h2 id="base-prices">Setting base prices</h2>

      <p>
        The <strong>base price</strong> is what the customer pays for
        the <strong>first copy</strong> of a product. For example:
      </p>

      <ul>
        <li>Photo Strips base price: <strong>$5.00</strong></li>
        <li>4×6 Prints base price: <strong>$7.00</strong></li>
      </ul>

      <p>
        The customer sees these prices on the product selection screen
        as soon as they walk up to the booth.
      </p>

      <p>To change a base price:</p>

      <ol>
        <li>Tap the base price input field for the product. The on-screen keyboard appears.</li>
        <li>Type the new price (e.g. <code>5.00</code>).</li>
        <li>Tap <strong>Save</strong>.</li>
      </ol>

      <p>
        Be careful with the decimal point. <code>5</code> and{" "}
        <code>5.00</code> mean the same thing, but <code>500</code>{" "}
        is five hundred.
      </p>

      <h2 id="extra-copy">Extra-copy pricing</h2>

      <p>
        The <strong>extra-copy price</strong> is what the customer
        pays for each <strong>additional copy</strong> of the same
        product, ordered in the same session. For example:
      </p>

      <ul>
        <li>Photo Strips base price: <strong>$5.00</strong></li>
        <li>Photo Strips extra-copy price: <strong>$2.00</strong></li>
        <li>A customer who buys 3 strips pays: $5.00 + ($2.00 × 2) = <strong>$9.00</strong></li>
      </ul>

      <p>This is how you charge less for bulk orders without giving away the first copy.</p>

      <h2 id="multi-copy-discount">Multi-copy discount</h2>

      <p>
        The <strong>multi-copy discount percentage</strong> applies an
        additional discount on top of the extra-copy price when the
        customer buys more than one. For example:
      </p>

      <ul>
        <li>Photo Strips extra-copy price: <strong>$2.00</strong></li>
        <li>Photo Strips multi-copy discount: <strong>20%</strong></li>
        <li>A customer who buys 3 strips pays: $5.00 + (($2.00 × 2) × 0.80) = <strong>$5.00 + $3.20 = $8.20</strong></li>
      </ul>

      <p>
        Set this to <strong>0%</strong> to disable the bulk discount
        entirely. Set it higher to encourage bulk orders.
      </p>

      <DocsCallout type="note">
        The exact math may vary slightly depending on which legacy
        pricing fields are in use on your booth. Use the{" "}
        <Link href="/docs/customer-experience/extra-prints-and-cross-sell">
          Extra prints and cross-sell
        </Link>{" "}
        customer screen to test your pricing. The live price preview
        is the source of truth.
      </DocsCallout>

      <h2 id="max-copies">Maximum copies per transaction</h2>

      <p>
        The <strong>max copies</strong> input caps how many copies a
        customer can buy in a single session. Typical defaults are{" "}
        <strong>5</strong> or <strong>10</strong>. This prevents a
        customer from accidentally ordering 99 copies and locking up
        your printer.
      </p>

      <p>Set this to a number you&apos;re comfortable printing in a row without paper jam risk.</p>

      <h2 id="saving">Saving</h2>

      <p>
        <strong>Don&apos;t forget to tap Save.</strong> Changes you
        make to product fields are not committed until you tap the
        Save button. If you navigate away from the tab without saving,
        your changes are discarded.
      </p>

      <p>
        When you save, the change is recorded in the local database
        and (if cloud sync is enabled) pushed to the cloud.
      </p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;re using the Products tab correctly when you can:</p>

      <ul>
        <li>Toggle a product on and off and see the change reflected on the customer-facing product selection screen</li>
        <li>Set base, extra-copy, and discount values and see them reflected on the customer payment screen</li>
        <li>Cap max copies and confirm the extra-prints screen respects it</li>
      </ul>

      <p>
        To verify a price change, exit admin and walk through a
        customer session. The prices should match what you set.
      </p>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Price change isn&apos;t reflected.</strong></p>
      <p>You forgot to tap <strong>Save</strong>. Re-open the Products tab and tap Save.</p>

      <p><strong>Negative price rejected.</strong></p>
      <p>BoothIQ enforces non-negative prices. Use 0 (free) instead.</p>

      <p><strong>Max copies set very high doesn&apos;t take effect.</strong></p>
      <p>The product has its own internal cap. Lower the value to a reasonable number (5-10).</p>

      <p><strong>Customer payment screen shows the old price.</strong></p>
      <p>The booth caches some pricing data. Try restarting if changes don&apos;t appear.</p>

      <p><strong>Disabled product is still visible to customers.</strong></p>
      <p>You forgot to tap Save, or the cache hasn&apos;t refreshed. Save again, then exit admin and re-enter to confirm.</p>

      <h2 id="pricing-strategy">Pricing strategy</h2>

      <p>
        For tips on <strong>how</strong> to price your products (not
        just <strong>how</strong> to set the inputs), see{" "}
        <strong>Running Your Booth › Pricing strategy</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/templates-tab">Templates tab</Link>
          . Manage the templates customers pick from.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/sales-tab">Sales &amp; Analytics tab</Link>
          . See how your pricing changes affect revenue over time.
        </li>
      </ul>
    </DocsLayout>
  );
}
