import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Troubleshooting — BoothIQ Docs",
  description:
    "When something goes wrong on the floor: diagnose and fix common BoothIQ problems.",
};

const HREF = "/docs/troubleshooting";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "when-to-call-support", label: "When to call support" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function TroubleshootingIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Troubleshooting</h1>

      <p>
        This section is for when something is broken{" "}
        <strong>right now</strong> and you need to fix it. Each
        article opens with the symptom an operator would describe,
        then walks through the most likely causes from cheap-to-fix
        to expensive-to-fix.
      </p>

      <p>
        If you have a few minutes and nothing is on fire,{" "}
        <Link href="/docs/maintenance">Maintenance</Link> has the
        routine care that prevents most of these problems.
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/troubleshooting/booth-frozen-or-blank">Booth frozen or screen blank</Link>
          . The booth isn&apos;t responding to touch.
        </li>
        <li>
          <Link href="/docs/troubleshooting/camera-not-working">Camera not working</Link>
          . The Camera pill is red, or photos aren&apos;t being captured.
        </li>
        <li>
          <Link href="/docs/troubleshooting/printer-issues">Printer issues</Link>
          . Printer offline, paper jam, prints with errors or weird colors.
        </li>
        <li>
          <Link href="/docs/troubleshooting/payment-not-registering">Payment not registering</Link>
          . Customer inserts coins but the booth doesn&apos;t credit them.
        </li>
        <li>
          <Link href="/docs/troubleshooting/cloud-sync-not-working">Cloud sync not working</Link>
          . The booth says &quot;Not Registered&quot; or sync is stale.
        </li>
        <li>
          <Link href="/docs/troubleshooting/locked-out-of-admin">Locked out of admin</Link>
          . Forgot the password, lost the recovery PIN.
        </li>
        <li>
          <Link href="/docs/troubleshooting/phone-upload-not-working">Phone upload not working</Link>
          . Customer can&apos;t connect to the kiosk hotspot.
        </li>
        <li>
          <Link href="/docs/troubleshooting/reading-error-screens">Reading error screens</Link>
          . What the camera and hardware error screens mean.
        </li>
        <li>
          <Link href="/docs/troubleshooting/out-of-order-screen">Out-of-order screen won&apos;t go away</Link>
          . The hardware watchdog has caught a problem.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>Operators dealing with a problem in real time. Each article is structured so you can scan it in 30 seconds and find the fix that matches your symptom.</p>

      <h2 id="when-to-call-support">When to call support</h2>

      <p>Contact BoothIQ support if:</p>

      <ul>
        <li>A hardware error keeps coming back after you&apos;ve followed the troubleshooting steps</li>
        <li>You see an error code or stack trace you can&apos;t interpret</li>
        <li>The booth has been physically damaged</li>
        <li>You&apos;re locked out of admin and the recovery PIN doesn&apos;t work</li>
      </ul>

      <p>
        Have your <strong>Booth ID</strong> ready (visible in the
        admin dashboard&apos;s <strong>Cloud Sync</strong> tab) and a
        description of when the problem started.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <p>
        For deeper background on the systems involved in each problem,
        see <Link href="/docs/admin-dashboard">Admin Dashboard</Link>.
      </p>
    </DocsLayout>
  );
}
