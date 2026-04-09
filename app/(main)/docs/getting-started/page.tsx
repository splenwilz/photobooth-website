import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Getting Started — BoothIQ Docs",
  description:
    "Everything you need to unbox a BoothIQ kiosk, sign in to the admin dashboard, and print your first photo.",
};

const HREF = "/docs/getting-started";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "what-youll-need-before-you-start", label: "What you'll need before you start" },
] as const;

export default function GettingStartedIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Getting Started</h1>

      <p>
        This is the place to start if you&apos;ve never used BoothIQ before.
        By the end of this section your kiosk will be powered on, an admin
        account will be set up, and you&apos;ll have printed your first
        test photo.
      </p>

      <p>
        A BoothIQ kiosk arrives <strong>pre-built and pre-installed</strong>.
        You don&apos;t install software, you don&apos;t touch Windows, and
        you don&apos;t wire any hardware inside the booth. Everything happens
        through the BoothIQ app on the kiosk&apos;s own touchscreen.
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/getting-started/what-is-boothiq">
            What is BoothIQ?
          </Link>{" "}
          — A plain-English overview of the product.
        </li>
        <li>
          <Link href="/docs/getting-started/how-it-works">How it works</Link>{" "}
          — A high-level walkthrough of the customer experience.
        </li>
        <li>
          <Link href="/docs/getting-started/system-requirements">
            Site and venue requirements
          </Link>{" "}
          — What your venue needs to provide for the kiosk.
        </li>
        <li>
          <Link href="/docs/getting-started/what-is-in-the-box">
            What&apos;s in the box
          </Link>{" "}
          — Components shipped with a BoothIQ kiosk.
        </li>
        <li>
          <Link href="/docs/getting-started/first-time-setup">
            First-time setup
          </Link>{" "}
          — Position the kiosk, plug it in, and reach the welcome screen.
        </li>
        <li>
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>{" "}
          — Sign in to admin with the default account, change your password,
          and set up a recovery PIN.
        </li>
        <li>
          <Link href="/docs/getting-started/your-first-print">
            Your first print
          </Link>{" "}
          — End-to-end smoke test from the welcome screen to a finished photo.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>
        Venue operators who just received a kiosk and installers who are
        placing one in a venue for the first time. You don&apos;t need any
        computer experience — if you can plug in a power cable and tap a
        touchscreen, you can finish this section.
      </p>

      <h2 id="what-youll-need-before-you-start">
        What you&apos;ll need before you start
      </h2>

      <ul>
        <li>The BoothIQ kiosk itself (delivered, still in its packaging is fine)</li>
        <li>A wall outlet within reach of the spot you&apos;ve chosen</li>
        <li>(Optional) A network connection — Wi-Fi credentials or an Ethernet drop</li>
        <li>A few minutes to read each article</li>
      </ul>

      <p>
        When you&apos;re ready, head to{" "}
        <Link href="/docs/getting-started/what-is-boothiq">
          What is BoothIQ?
        </Link>{" "}
        to start.
      </p>
    </DocsLayout>
  );
}
