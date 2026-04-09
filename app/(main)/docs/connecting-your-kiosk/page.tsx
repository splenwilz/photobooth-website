import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Connecting Your Kiosk — BoothIQ Docs",
  description:
    "Get the booth onto your network, register it with the BoothIQ cloud, and confirm the license is active.",
};

const HREF = "/docs/connecting-your-kiosk";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ConnectingYourKioskIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Connecting Your Kiosk</h1>

      <p>
        Once your kiosk is powered on and the welcome screen is showing,
        the next step is to connect it. There are three things to wire
        up: your venue&apos;s Wi-Fi (so it can sync with the cloud), your
        BoothIQ cloud account (so you can monitor it remotely), and the
        license (which usually activates itself).
      </p>

      <p>
        You can skip everything in this section and the booth will still
        serve customers. BoothIQ is offline-first. But cloud sync, remote
        monitoring, template downloads, and license renewals all need
        network connectivity.
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/connecting-your-kiosk/connecting-to-wifi">
            Connecting to Wi-Fi
          </Link>
          . Use the WiFi tab in admin to join your venue&apos;s network.
        </li>
        <li>
          <Link href="/docs/connecting-your-kiosk/cloud-registration">
            Cloud registration
          </Link>
          . Link this booth to your BoothIQ cloud account using a
          6-character code.
        </li>
        <li>
          <Link href="/docs/connecting-your-kiosk/license-and-activation">
            License and activation
          </Link>
          . Check the license status and what to do if you see a trial
          or grace-period banner.
        </li>
        <li>
          <Link href="/docs/connecting-your-kiosk/testing-your-connection">
            Testing your connection
          </Link>
          . Confirm the booth is talking to the cloud.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>
        Operators or installers who have just powered on a new BoothIQ
        kiosk for the first time and now want it connected. You should
        already have completed{" "}
        <Link href="/docs/getting-started">Getting Started</Link>.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <p>
        After connecting the booth, head to <strong>Customer Experience</strong>{" "}
        <em>(coming soon)</em> to learn what your customers will see, or{" "}
        <strong>Admin Dashboard</strong> <em>(coming soon)</em> to tour
        the management UI.
      </p>
    </DocsLayout>
  );
}
