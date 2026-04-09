import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Maintenance — BoothIQ Docs",
  description:
    "Routine care to keep your BoothIQ kiosk running: print rolls, cleaning, daily checks.",
};

const HREF = "/docs/maintenance";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "habit", label: "A maintenance habit to build" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function MaintenanceIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Maintenance</h1>

      <p>
        A BoothIQ kiosk is designed to run all day without staff, but
        it&apos;s not maintenance-free. The thermal printer needs
        paper, the camera lens picks up dust, the coin acceptor jams
        once in a while, and software updates show up periodically.
        This section is what you do to keep the booth healthy.
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/maintenance/daily-checks">Daily checks</Link>
          . A 2-minute pass to do every morning.
        </li>
        <li>
          <Link href="/docs/maintenance/changing-the-print-roll">Changing the print roll</Link>
          . When and how to swap photo media.
        </li>
        <li>
          <Link href="/docs/maintenance/cleaning-the-printer">Cleaning the printer</Link>
          . Keeping the thermal head and rollers clean.
        </li>
        <li>
          <Link href="/docs/maintenance/camera-care">Camera care</Link>
          . Lens cleaning and physical positioning.
        </li>
        <li>
          <Link href="/docs/maintenance/coin-acceptor-care">Coin and bill acceptor care</Link>
          . Clearing jams and routine cleaning.
        </li>
        <li>
          <Link href="/docs/maintenance/software-updates">Software updates</Link>
          . How and when BoothIQ updates itself.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>
        Operators running a booth in production. Most of these tasks
        take less than five minutes and prevent the bigger problems
        covered in <strong>Troubleshooting</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="habit">A maintenance habit to build</h2>

      <p>
        Spend the first <strong>five minutes of every shift</strong>{" "}
        doing the{" "}
        <Link href="/docs/maintenance/daily-checks">Daily checks</Link>{" "}
        routine. It catches almost every &quot;the booth wasn&apos;t
        working when I arrived&quot; problem before customers do.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <p>
        If something is broken right now and you need to fix it, jump
        to <strong>Troubleshooting</strong> <em>(coming soon)</em>.
      </p>
    </DocsLayout>
  );
}
