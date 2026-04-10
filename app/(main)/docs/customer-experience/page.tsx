import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Customer Experience — BoothIQ Docs",
  description:
    "Every screen your customers see, in order, so you know what to expect and what to tell them if they get stuck.",
};

const HREF = "/docs/customer-experience";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CustomerExperienceIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Customer Experience</h1>

      <p>
        This section walks through every screen a customer sees from
        the moment they tap <strong>START</strong> to the moment they
        pick up their photos. The audience is <strong>operators</strong>.
        The goal is for you to know what&apos;s happening on the kiosk
        so you can help customers when they get stuck and so you
        understand what your settings actually change.
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/customer-experience/welcome-screen">Welcome screen</Link>
          . The looping video, voice prompts, and START button.
        </li>
        <li>
          <Link href="/docs/customer-experience/choosing-a-product">Choosing a product</Link>
          . Photo strips, 4×6 prints, or smartphone print.
        </li>
        <li>
          <Link href="/docs/customer-experience/picking-a-template">Picking a template</Link>
          . Categories, seasonal templates, and the three style modes.
        </li>
        <li>
          <Link href="/docs/customer-experience/taking-photos">Taking photos</Link>
          . The countdown, voice prompts, and retake flow.
        </li>
        <li>
          <Link href="/docs/customer-experience/editing-photos">Editing photos</Link>
          . Filters, stickers, and the &quot;skip&quot; path.
        </li>
        <li>
          <Link href="/docs/customer-experience/extra-prints-and-cross-sell">Extra prints and cross-sell</Link>
          . Multiple copies and the strip-to-4×6 upsell.
        </li>
        <li>
          <Link href="/docs/customer-experience/paying">Paying</Link>
          . How the payment screen works in coin and free play modes.
        </li>
        <li>
          <Link href="/docs/customer-experience/printing-and-thank-you">Printing and thank you</Link>
          . What happens after the customer pays.
        </li>
        <li>
          <Link href="/docs/customer-experience/phone-upload-feature">Phone upload feature</Link>
          . Customers uploading photos from their phone over a local
          Wi-Fi network.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>Operators who want to understand the customer flow well enough to:</p>

      <ul>
        <li>Help a customer who&apos;s confused at any screen</li>
        <li>Understand what their settings (prices, templates, modes) actually change</li>
        <li>Identify whether a problem the customer reports is normal behavior or a real bug</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <p>
        After this section, <strong>Admin Dashboard</strong>{" "}
        <em>(coming soon)</em> shows you how to control everything you
        just read about.
      </p>
    </DocsLayout>
  );
}
