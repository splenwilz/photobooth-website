import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Choosing a product — BoothIQ Docs",
  description:
    "The product selection screen: strips, 4×6 prints, smartphone print, and what operators control.",
};

const HREF = "/docs/customer-experience/choosing-a-product";

const TOC = [
  { id: "whats-on-screen", label: "What's on the screen" },
  { id: "what-customers-do", label: "What customers do" },
  { id: "what-you-control", label: "What you control" },
  { id: "idle-behavior", label: "Idle behavior" },
  { id: "free-play", label: "Free Play mode" },
  { id: "what-to-tell", label: "What to tell customers" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ChoosingAProductPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Choosing a product</h1>

      <p>
        After the customer taps START on the welcome screen, they land
        on the <strong>product selection screen</strong>. This is where
        they pick what kind of print they want to walk away with.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to
        understand what determines what customers see here, and how to
        control it.
      </p>

      <h2 id="whats-on-screen">What&apos;s on the screen</h2>

      <p>
        The customer sees a tile for each <strong>enabled product</strong>.
        BoothIQ supports three product types:
      </p>

      <ul>
        <li><strong>Photo Strips</strong>. Classic booth strips, multiple shots per print</li>
        <li><strong>4×6 Prints</strong>. Single 4×6 photos</li>
        <li><strong>Smartphone Print</strong>. Uploads photos from the customer&apos;s phone over a local Wi-Fi network and prints them</li>
      </ul>

      <p>
        Each tile shows the <strong>price</strong> (the base price you
        set in the Products tab) and the product name with an icon.
        The credits indicator stays in the corner so customers can see
        their balance, and there&apos;s a back button to return to the
        welcome screen.
      </p>

      <DocsScreenshot
        src="product-selection-screen.png"
        alt="Product selection screen showing tiles for Photo Strips, 4×6 Prints, and Smartphone Print, each with a price."
      />

      <h2 id="what-customers-do">What customers do</h2>

      <p>The customer taps the tile for the product they want. The booth advances to:</p>

      <ul>
        <li><strong>Photo Strips</strong> → template selection screen</li>
        <li><strong>4×6 Prints</strong> → template selection screen</li>
        <li>
          <strong>Smartphone Print</strong> → phone upload screen (a
          different flow, see{" "}
          <Link href="/docs/customer-experience/phone-upload-feature">
            Phone upload feature
          </Link>
          )
        </li>
      </ul>

      <h2 id="what-you-control">What you control</h2>

      <p>Two things in the <strong>Products tab</strong>:</p>

      <ol>
        <li><strong>Which products are enabled.</strong> Disabled products don&apos;t appear on this screen at all. So if you don&apos;t want to offer Smartphone Print, just disable it.</li>
        <li><strong>The base price of each product.</strong> This is what shows on the tile.</li>
      </ol>

      <p>
        For prices on extra copies and multi-copy discounts, see{" "}
        <strong>Products tab</strong> <em>(coming soon)</em> and{" "}
        <strong>Pricing strategy</strong> <em>(coming soon)</em>.
      </p>

      <DocsCallout type="warning">
        If you disable all three products, the customer sees an empty
        product selection screen. Don&apos;t do that. At least one
        product needs to be enabled.
      </DocsCallout>

      <h2 id="idle-behavior">Idle behavior</h2>

      <p>
        If the customer doesn&apos;t tap anything within{" "}
        <strong>about 60 seconds</strong>, the booth shows a warning
        (&quot;Are you still there?&quot;) and then automatically
        returns to the welcome screen if no input arrives. This
        prevents the booth from getting stuck on an abandoned session.
      </p>

      <p>
        For the full table of timeouts, see{" "}
        <strong>Reference › Idle timeouts</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="free-play">Free Play mode</h2>

      <p>
        When the booth is in <strong>Free Play</strong> mode (set in{" "}
        <strong>Settings → Operation Mode</strong>), the prices on the
        tiles still show but the customer doesn&apos;t actually pay.
        The credits indicator shows <strong>Free Play</strong> instead
        of a balance. Customers walk straight through to the template
        selection without ever hitting the payment screen.
      </p>

      <p>
        For when to use Free Play, see{" "}
        <strong>Operation modes</strong> <em>(coming soon)</em>.
      </p>

      <h2 id="what-to-tell">What to tell customers</h2>

      <p>Most customers figure this screen out without help. If they hesitate, say:</p>

      <ul>
        <li>&quot;Pick whichever one you want. Strips give you multiple shots in a row, 4×6 is one big photo, and Smartphone Print lets you upload pictures from your phone.&quot;</li>
        <li>&quot;The price is on the tile. You&apos;ll pay at the end.&quot;</li>
      </ul>

      <p>
        If a customer asks <strong>&quot;how do I get more copies?&quot;</strong>{" "}
        tell them they&apos;ll get an extra-prints option later in the
        flow, and they can buy multiples then.
      </p>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>A customer says one of the products is missing.</strong></p>
      <p>Open admin → Products tab and confirm the product is enabled. If you disabled it, that&apos;s why.</p>

      <p><strong>The prices on the tiles are wrong.</strong></p>
      <p>Open admin → Products tab, update the base price, and tap <strong>Save</strong>. Exit admin and confirm on the customer-facing screen.</p>

      <p><strong>The credits indicator shows the wrong balance.</strong></p>
      <p>Open the Credits tab in admin and check. See <strong>Credits tab</strong> <em>(coming soon)</em>.</p>

      <p><strong>The back button doesn&apos;t work.</strong></p>
      <p>The back button on this screen returns the customer to the welcome screen. If it&apos;s unresponsive, the touch input may have a problem. See <strong>Troubleshooting › Booth frozen or screen blank</strong> <em>(coming soon)</em>.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/picking-a-template">
            Picking a template
          </Link>
          . Where customers choose a design.
        </li>
        <li>
          <Link href="/docs/customer-experience/phone-upload-feature">
            Phone upload feature
          </Link>
          . The Smartphone Print flow.
        </li>
        <li><strong>Products tab</strong> <em>(coming soon)</em>. Where you control what shows up here.</li>
      </ul>
    </DocsLayout>
  );
}
