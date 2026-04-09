import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Data and privacy — BoothIQ Docs",
  description:
    "What BoothIQ stores about customers, what's synced to the cloud, and what to tell customers if they ask.",
};

const HREF = "/docs/security-and-compliance/data-and-privacy";

const TOC = [
  { id: "stored-on-kiosk", label: "What BoothIQ stores on the kiosk" },
  { id: "photos", label: "What about customer photos?" },
  { id: "emails", label: "What about customer email addresses?" },
  { id: "synced", label: "What gets synced to the cloud" },
  { id: "notices", label: "Privacy notices for customers" },
  { id: "gdpr", label: "GDPR / CCPA / similar" },
  { id: "database", label: "Where the database lives" },
  { id: "not-find", label: "What customers should NOT find" },
  { id: "retention", label: "Data retention" },
  { id: "breach", label: "If there's a data breach" },
  { id: "defaults", label: "Privacy-friendly defaults to consider" },
  { id: "verify", label: "Verify your privacy posture" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function DataAndPrivacyPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Data and privacy</h1>

      <p>
        A photobooth handles customer photos and (sometimes) money in
        a public venue. This article explains what BoothIQ actually
        stores, what&apos;s synced where, and what your obligations
        might be to your customers.
      </p>

      <p><strong>Who this is for:</strong> Operators in regulated venues, operators with privacy-sensitive customers, or operators who just want to know what&apos;s happening with the data.</p>

      <DocsCallout type="warning">
        <strong>This article is operator guidance, not legal advice.</strong>{" "}
        Privacy law varies by country, state, and venue. If you have
        specific legal requirements (GDPR, CCPA, COPPA, sector-specific
        rules), consult a lawyer.
      </DocsCallout>

      <h2 id="stored-on-kiosk">What BoothIQ stores on the kiosk</h2>

      <p>The booth&apos;s <strong>local SQLite database</strong> stores:</p>

      <ul>
        <li><strong>Sales transactions.</strong> Revenue tracking, your audit trail</li>
        <li><strong>Credit transactions.</strong> Money-in / money-out audit trail</li>
        <li><strong>Hardware status history.</strong> Diagnostics</li>
        <li><strong>Admin user accounts</strong> (passwords are hashed). Authentication</li>
        <li><strong>Master password usage records.</strong> Audit</li>
        <li><strong>Templates and categories.</strong> Customer experience</li>
        <li><strong>Settings.</strong> Business config</li>
      </ul>

      <p>The database is at <code>C:\ProgramData\BoothIQ\photobooth.db</code>. It&apos;s not directly accessible to operators (the kiosk is locked down) but it persists across reboots and reinstalls.</p>

      <h2 id="photos">What about customer photos?</h2>

      <p>Customer photos handling depends on your settings:</p>

      <ul>
        <li><strong>Save captured photos: OFF</strong> (default). Photos are kept long enough to print, then discarded</li>
        <li><strong>Save captured photos: ON, USB connected.</strong> Photos are saved to the USB drive after each session</li>
        <li><strong>Save captured photos: ON, no USB.</strong> Photos may be saved to local storage or held in memory; the <strong>USB warning banner</strong> in admin reminds you to plug a USB drive in</li>
      </ul>

      <p>
        You manage this in{" "}
        <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>{" "}
        → Photo Storage card.
      </p>

      <DocsCallout type="note">
        <strong>Photos are not synced to the cloud by default.</strong>{" "}
        Only if you explicitly enable Photo Backup as a cloud feature
        (see{" "}
        <Link href="/docs/cloud-and-fleet/cloud-features">Cloud features</Link>
        ).
      </DocsCallout>

      <h2 id="emails">What about customer email addresses?</h2>

      <p>If your booth collects customer email addresses (for sending photos, marketing, etc.), they&apos;re stored in the <strong>transaction record</strong> in the database. The exact behavior depends on whether your booth has email collection enabled and how it&apos;s configured.</p>

      <DocsCallout type="note">
        <strong>As described in this version of the docs</strong>,
        BoothIQ does not have a built-in &quot;email the photo to the
        customer&quot; feature. If your booth has been customized to
        collect emails, talk to your BoothIQ point of contact about
        what happens to those addresses.
      </DocsCallout>

      <h2 id="synced">What gets synced to the cloud</h2>

      <p>When the booth is registered to the cloud and online:</p>

      <p><strong>Synced to cloud:</strong></p>

      <ul>
        <li>Sales transactions (including any customer email if collected)</li>
        <li>Credit transactions</li>
        <li>Heartbeats (with current credit balance, mode, status)</li>
        <li>Hardware status changes</li>
        <li>Operational metrics</li>
        <li>Logs (on demand, when support requests them)</li>
      </ul>

      <p><strong>Not synced to cloud (by default):</strong></p>

      <ul>
        <li><strong>Customer photos</strong> (unless you enable Photo Backup)</li>
        <li><strong>Local admin passwords</strong> (only the hashes stay on the kiosk)</li>
        <li><strong>Hardware fingerprints</strong> (these are truncated to 16 characters before being sent. The cloud doesn&apos;t get the full hardware ID)</li>
        <li><strong>Detailed individual usage patterns</strong> beyond what&apos;s needed for sales reporting</li>
      </ul>

      <h2 id="notices">Privacy notices for customers</h2>

      <p>If your venue or jurisdiction requires you to tell customers what&apos;s happening with their data, consider posting a notice near the booth that includes:</p>

      <ul>
        <li><strong>What you collect:</strong> &quot;We take photos of you for printing. We do not store your photos after printing unless you tell us otherwise.&quot;</li>
        <li><strong>What&apos;s stored:</strong> &quot;Sales records (price paid, time of session, product) are kept for accounting purposes.&quot;</li>
        <li><strong>What&apos;s shared:</strong> &quot;Sales records may be sent to our cloud platform for monitoring. Your photos are not.&quot;</li>
        <li><strong>Your contact:</strong> Your business name and contact info if customers want to ask questions.</li>
      </ul>

      <p>Wording depends on your jurisdiction. A lawyer can help if you need a formal notice.</p>

      <h2 id="gdpr">GDPR / CCPA / similar</h2>

      <p>If you operate in jurisdictions with strong privacy laws:</p>

      <ul>
        <li><strong>Right to access.</strong> A customer can request a copy of their data. The most useful data you have is the transaction record (with their email if collected). Look it up in the Sales tab and export it as CSV.</li>
        <li><strong>Right to deletion.</strong> A customer can request you delete their data. The booth doesn&apos;t have a built-in customer deletion flow; you may need to manually delete transaction rows from the database (talk to support. Operators can&apos;t reach the database directly on a locked-down kiosk).</li>
        <li><strong>Data minimization.</strong> Only collect what you need. If you don&apos;t need customer emails, don&apos;t enable email collection. If you don&apos;t need to save photos, leave the <strong>Save captured photos</strong> setting off.</li>
      </ul>

      <p>These laws are complex. <strong>Consult a lawyer</strong> if you have specific compliance requirements.</p>

      <h2 id="database">Where the database lives</h2>

      <p>For your awareness (not for hands-on access):</p>

      <ul>
        <li><strong>Database file:</strong> <code>C:\ProgramData\BoothIQ\photobooth.db</code></li>
        <li><strong>Logs:</strong> <code>C:\ProgramData\BoothIQ\Logs\</code></li>
        <li><strong>Application files:</strong> <code>C:\Program Files\BoothIQ\</code></li>
      </ul>

      <p>You <strong>cannot reach these paths</strong> from the locked-down kiosk. If you need a copy of the database for a privacy-related request, contact support.</p>

      <h2 id="not-find">What customers should NOT find on the booth</h2>

      <p>Things that should never be visible or accessible from a customer&apos;s perspective:</p>

      <ul>
        <li><strong>Your admin password.</strong> Hidden behind the 5-tap and login flow</li>
        <li><strong>Other customers&apos; photos.</strong> Not saved by default</li>
        <li><strong>Other customers&apos; email addresses.</strong> Only in admin-side reports</li>
        <li><strong>The cash box contents.</strong> Physically locked</li>
        <li><strong>Sales totals.</strong> Only in admin</li>
        <li><strong>Logs and error details.</strong> Only in admin</li>
      </ul>

      <p>If a customer can see any of these, your booth has been misconfigured. Fix it immediately and report to support.</p>

      <h2 id="retention">Data retention</h2>

      <p>The local database retains data <strong>forever</strong> by default. There&apos;s no automatic cleanup. If you want to purge old data:</p>

      <ul>
        <li>
          <strong>Export sales</strong> to CSV first (so you have a
          backup). See{" "}
          <Link href="/docs/running-your-booth/exporting-sales-data">
            Exporting sales data
          </Link>
          .
        </li>
        <li>Contact support for database cleanup procedures. Direct database editing is not exposed to operators.</li>
      </ul>

      <p>For most operators, the database stays small enough that purging isn&apos;t necessary.</p>

      <h2 id="breach">What to do if there&apos;s a data breach</h2>

      <p>If you discover (or suspect) a breach. Kiosk stolen, kiosk compromised, customer data exposed. Do this:</p>

      <ol>
        <li><strong>Take the booth out of service immediately.</strong></li>
        <li><strong>Contact BoothIQ support.</strong> They can help with the technical side.</li>
        <li><strong>Determine what was exposed.</strong> Was the kiosk physically taken? Were credentials leaked? Was the cloud account compromised?</li>
        <li><strong>Notify affected customers</strong> if your jurisdiction requires it (most do for personal data breaches).</li>
        <li><strong>Notify your venue</strong> and any business stakeholders.</li>
        <li><strong>Document everything.</strong> When you discovered it, what you did, who you notified.</li>
        <li><strong>Reset passwords</strong> on the cloud account, regenerate API keys, and re-register the booth.</li>
      </ol>

      <p>A lawyer is your friend here.</p>

      <h2 id="defaults">Privacy-friendly defaults to consider</h2>

      <p>If you don&apos;t need a feature, <strong>turn it off</strong>:</p>

      <ul>
        <li><strong>Save captured photos: OFF</strong> unless you specifically need to retain photos.</li>
        <li><strong>Email collection: not enabled</strong> unless you have a clear reason and a privacy notice.</li>
        <li><strong>Photo backup to cloud: not enabled</strong> unless you specifically need cloud photo storage.</li>
        <li><strong>Cloud sync: enabled</strong> is fine for most operators because it doesn&apos;t sync photos by default. Just transactions.</li>
      </ul>

      <h2 id="verify">Verify your privacy posture</h2>

      <p>You&apos;re being a responsible custodian of customer data when:</p>

      <ul>
        <li>You only collect what you need</li>
        <li>Customer photos are not retained unless necessary</li>
        <li>Cloud sync is configured to match your privacy goals</li>
        <li>You have a privacy notice posted at the booth (if your jurisdiction requires one)</li>
        <li>You know who to contact if a customer requests their data</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
          . Where you control the photo storage setting.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/cloud-features">Cloud features</Link>
          . Photo Backup is opt-in.
        </li>
        <li>For developer-level security details, see the developer documentation.</li>
      </ul>
    </DocsLayout>
  );
}
