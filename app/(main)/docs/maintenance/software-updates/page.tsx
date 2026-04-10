import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Software updates — BoothIQ Docs",
  description:
    "How BoothIQ updates itself, what you control, and what to expect.",
};

const HREF = "/docs/maintenance/software-updates";

const TOC = [
  { id: "how-updates-work", label: "How updates work" },
  { id: "when", label: "When updates happen" },
  { id: "confirming", label: "Confirming the booth is up to date" },
  { id: "during-update", label: "What to do when an update is happening" },
  { id: "what-might-break", label: "What might break after an update" },
  { id: "cancelling", label: "Cancelling or postponing an update" },
  { id: "restart-commands", label: "Cloud-driven restart commands" },
  { id: "windows", label: "What about Windows updates?" },
  { id: "verify", label: "Verify the update worked" },
  { id: "common-questions", label: "Common questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function SoftwareUpdatesPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Software updates</h1>

      <p>
        BoothIQ ships pre-installed and pre-configured. Software
        updates are managed through the cloud after the booth is
        registered. As an operator, you don&apos;t run an installer
        or click &quot;update&quot; buttons. But you do want to know
        what&apos;s happening when an update is being delivered.
      </p>

      <p><strong>Who this is for:</strong> Operators who notice an update or want to understand the update mechanism.</p>

      <h2 id="how-updates-work">How updates work</h2>

      <p>BoothIQ updates can come through several paths:</p>

      <ol>
        <li><strong>Cloud-pushed updates.</strong> When your booth is registered to the cloud and a new version is available, the cloud can push it to the booth automatically (or with operator confirmation, depending on your account configuration).</li>
        <li><strong>Scheduled updates.</strong> Your BoothIQ contact may schedule updates outside business hours so they don&apos;t interrupt customers.</li>
        <li><strong>Manual updates.</strong> For major version changes, support may schedule a remote update session with you.</li>
      </ol>

      <p>What you <strong>don&apos;t</strong> do:</p>

      <ul>
        <li>Download installers from a website</li>
        <li>Run update commands on the kiosk</li>
        <li>Use Windows Update for BoothIQ updates (Windows Update is for the operating system, not BoothIQ. And on a locked-down kiosk, Windows Update is managed by support)</li>
      </ul>

      <h2 id="when">When updates happen</h2>

      <p>Most updates are pushed during <strong>off-hours</strong> to avoid interrupting customers. You may notice:</p>

      <ul>
        <li>The booth restarts overnight</li>
        <li>A small &quot;Updating&quot; or &quot;Restart pending&quot; indicator briefly appears</li>
        <li>A new version number on the welcome screen the next day</li>
      </ul>

      <p>For major updates, support will usually contact you in advance to schedule a window.</p>

      <h2 id="confirming">Confirming the booth is up to date</h2>

      <p>To check the current version:</p>

      <ul>
        <li>Look at the <strong>welcome screen corner</strong>. The version number is shown there</li>
        <li>Or open admin → <strong>Settings</strong> → <strong>License Status card</strong> which often shows version info</li>
      </ul>

      <p>If your booth is registered to the cloud, you can also check from the cloud dashboard. It shows each booth&apos;s installed version.</p>

      <h2 id="during-update">What to do when an update is happening</h2>

      <p>If you see a &quot;restart pending&quot; notification or the booth is in the middle of an update:</p>

      <ol>
        <li><strong>Don&apos;t power-cycle the kiosk</strong> mid-update. That can corrupt the install.</li>
        <li><strong>Wait</strong> for the update to finish. Most updates take a few minutes; large ones may take longer.</li>
        <li><strong>Watch the welcome screen</strong> appear when the booth comes back up.</li>
        <li>
          <strong>Sign in to admin</strong> and confirm:
          <ul>
            <li>The Camera / Printer / PCB pills are all green</li>
            <li>The version number has changed</li>
            <li>The Cloud Sync status is Connected</li>
          </ul>
        </li>
      </ol>

      <h2 id="what-might-break">What might break after an update</h2>

      <p>Most updates are seamless. Occasionally an update introduces:</p>

      <ul>
        <li><strong>New settings</strong> that default to safe values. You may want to review the Settings tab to see if anything new appeared</li>
        <li><strong>UI changes.</strong> Buttons may have moved, but the overall structure should be the same</li>
        <li><strong>New features</strong> that you didn&apos;t ask for. They&apos;re usually opt-in</li>
      </ul>

      <p>If an update breaks something. A previously-working feature stops working, or hardware that was healthy becomes red. <strong>Don&apos;t panic.</strong> Power-cycle the kiosk first. If the issue persists, contact support and reference the version that was just installed.</p>

      <h2 id="cancelling">Cancelling or postponing an update</h2>

      <p>If you have an event coming up and you don&apos;t want any updates during that window:</p>

      <ol>
        <li>Contact your BoothIQ point of contact in advance</li>
        <li>Ask them to <strong>freeze updates</strong> for your booth(s) for the specified period</li>
        <li>After the event, ask them to resume normal updating</li>
      </ol>

      <p>This is best done <strong>days</strong> in advance, not minutes. Last-minute change requests may not be honored.</p>

      <h2 id="restart-commands">Cloud-driven restart commands</h2>

      <p>The cloud can issue a <code>restart</code> command to the booth (also <code>cancel_restart</code> to abort one). This is sometimes used for:</p>

      <ul>
        <li>Applying an update that requires a reboot</li>
        <li>Recovering a stuck booth remotely</li>
        <li>Periodic maintenance restarts</li>
      </ul>

      <p>Operators on the floor will see the booth restart unexpectedly. It&apos;ll come back up in 30-60 seconds. If you suspect this is happening unexpectedly, contact your cloud admin to confirm.</p>

      <p>
        For more on remote commands, see{" "}
        <Link href="/docs/cloud-and-fleet/remote-commands">Remote commands</Link>
        .
      </p>

      <h2 id="windows">What about Windows updates?</h2>

      <p>The kiosk&apos;s underlying Windows operating system is locked down and managed by BoothIQ. Operators don&apos;t run Windows Update on the kiosk. That&apos;s handled at the BoothIQ level. If your booth needs an OS update, support will handle it.</p>

      <h2 id="verify">Verify the update worked</h2>

      <p>After an update:</p>

      <ul>
        <li>The version number on the welcome screen has changed to the new version</li>
        <li>All hardware pills are green</li>
        <li>The Cloud Sync status is Connected</li>
        <li>A test customer session works end-to-end</li>
      </ul>

      <h2 id="common-questions">Common questions</h2>

      <p><strong>Can I roll back an update?</strong></p>
      <p>Not from the operator side. If an update broke something, contact support. They have rollback options at the cloud level.</p>

      <p><strong>How often do updates happen?</strong></p>
      <p>Depends on your account and the BoothIQ release schedule. Could be every few weeks, could be every few months.</p>

      <p><strong>Do I get a changelog?</strong></p>
      <p>Major releases usually come with a release notes email or notification. Minor patches may not have a public changelog. Ask your BoothIQ contact.</p>

      <p><strong>Can I opt out of all updates?</strong></p>
      <p>Not really. Software with no updates becomes a security risk over time. Ask your contact for the slowest cadence available.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/cloud-and-fleet/remote-commands">
            Cloud and Fleet › Remote commands
          </Link>
          . How updates are delivered.
        </li>
        <li>
          <Link href="/docs/running-your-booth/daily-startup-checklist">
            Daily startup checklist
          </Link>
          . Where you&apos;ll catch any post-update issues.
        </li>
      </ul>
    </DocsLayout>
  );
}
