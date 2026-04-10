import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Cloud and Fleet — BoothIQ Docs",
  description:
    "How BoothIQ syncs with the cloud, what works offline, and what cloud admins can do remotely.",
};

const HREF = "/docs/cloud-and-fleet";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "important", label: "The cloud dashboard is not on the kiosk" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CloudAndFleetIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Cloud and Fleet</h1>

      <p>
        The BoothIQ cloud is where you monitor your booths from a
        phone or laptop, push templates, see sales summaries, and run
        remote commands. This section covers what the cloud actually
        does, how the sync works, and what to expect when the booth is
        offline.
      </p>

      <p>
        If you haven&apos;t registered your booth yet, start with{" "}
        <Link href="/docs/connecting-your-kiosk/cloud-registration">
          Connecting Your Kiosk › Cloud registration
        </Link>
        .
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/cloud-and-fleet/what-cloud-sync-does">What cloud sync does</Link>
          . A plain-English summary of what the booth pushes up and pulls down.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/working-offline">Working offline</Link>
          . How BoothIQ behaves when the internet drops, and what gets queued.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/remote-commands">Remote commands from the cloud</Link>
          . Add credits, restart, download logs, push templates.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/cloud-features">Cloud features overview</Link>
          . What unlocks when the booth is connected.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <ul>
        <li>Operators who already use the BoothIQ cloud dashboard from a separate computer or phone</li>
        <li>Operators considering whether to connect their booth at all</li>
        <li>Multi-booth operators managing a fleet</li>
      </ul>

      <h2 id="important">Important: the cloud dashboard is not on the kiosk</h2>

      <DocsCallout type="important">
        The BoothIQ cloud dashboard is a <strong>web/mobile app</strong>{" "}
        you sign in to from a separate device: your laptop, phone, or
        office PC. <strong>The kiosk itself doesn&apos;t have a browser</strong>{" "}
        and you can&apos;t open the cloud dashboard on the booth&apos;s
        touchscreen. The kiosk and the cloud dashboard talk to each
        other in the background; you use them on different devices for
        different jobs.
      </DocsCallout>

      <h2 id="next-steps">Next steps</h2>

      <p>
        For physical maintenance of the booth (paper, cleaning), see{" "}
        <strong>Maintenance</strong> <em>(coming soon)</em>. For sync
        problems specifically, see <strong>Troubleshooting › Cloud sync not working</strong>{" "}
        <em>(coming soon)</em>.
      </p>
    </DocsLayout>
  );
}
