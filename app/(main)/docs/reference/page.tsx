import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Reference — BoothIQ Docs",
  description:
    "Quick lookups: glossary, defaults, file paths, supported hardware.",
};

const HREF = "/docs/reference";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "searching", label: "Searching the docs" },
] as const;

export default function ReferenceIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Reference</h1>

      <p>Short, scannable reference articles for things you&apos;ll look up rather than read end-to-end.</p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/reference/glossary">Glossary</Link>
          . Plain-English definitions of BoothIQ-specific terms.
        </li>
        <li>
          <Link href="/docs/reference/default-credentials">Default credentials</Link>
          . What ships out of the box and what you should change.
        </li>
        <li>
          <Link href="/docs/reference/supported-hardware">Supported hardware</Link>
          . Cameras, printers, and payment devices BoothIQ works with.
        </li>
        <li>
          <Link href="/docs/reference/timeouts">Idle timeouts and screen behavior</Link>
          . How long each customer-facing screen waits before resetting.
        </li>
        <li>
          <Link href="/docs/reference/file-locations">Where things live</Link>
          . Where the database, logs, and config files are on the kiosk.
        </li>
        <li>
          <Link href="/docs/reference/tab-and-button-map">Tab and button map</Link>
          . A flat list of every admin tab and the major actions inside it.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>Operators looking up a specific fact. None of these articles are meant to be read top-to-bottom.</p>

      <h2 id="searching">Searching the docs</h2>

      <p>If your docs site has search enabled, type the thing you&apos;re looking for (&quot;admin password&quot;, &quot;PCB&quot;, &quot;Coin Operated&quot;, &quot;WiFi&quot;). Most queries land in this section.</p>
    </DocsLayout>
  );
}
