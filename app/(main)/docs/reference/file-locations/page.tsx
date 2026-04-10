import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Where things live — BoothIQ Docs",
  description:
    "File paths for the database, logs, config, and templates on the kiosk.",
};

const HREF = "/docs/reference/file-locations";

const TOC = [
  { id: "application", label: "Application files" },
  { id: "data", label: "Data files" },
  { id: "logs", label: "Log files" },
  { id: "templates", label: "Template files" },
  { id: "config", label: "Config files" },
  { id: "registry", label: "Windows registry entries" },
  { id: "firewall", label: "Windows firewall rules" },
  { id: "backup-db", label: "How to back up the database" },
  { id: "read-logs", label: "How to read logs" },
  { id: "related", label: "Related" },
] as const;

export default function FileLocationsPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Where things live</h1>

      <p>For when you or support need to know where something lives on the kiosk&apos;s file system. <strong>You cannot reach these paths from a locked-down kiosk.</strong> They&apos;re for context and for support troubleshooting, not for hands-on editing.</p>

      <h2 id="application">Application files</h2>

      <ul>
        <li><code>C:\Program Files\BoothIQ\</code>. BoothIQ application binaries (managed by the installer)</li>
        <li><code>C:\Program Files\BoothIQ\Templates\</code>. Templates shipped with the installer (baseline set)</li>
      </ul>

      <h2 id="data">Data files</h2>

      <ul>
        <li><code>C:\ProgramData\BoothIQ\</code>. Machine-wide data directory</li>
        <li><code>C:\ProgramData\BoothIQ\photobooth.db</code>. The local SQLite database. Sales, credits, admin users, settings</li>
        <li><code>C:\ProgramData\BoothIQ\Logs\</code>. Log files (see below for sub-categories)</li>
        <li><code>C:\ProgramData\BoothIQ\master-password.config</code>. Master password config file (enterprise builds only)</li>
      </ul>

      <p>The data directory is in <code>ProgramData</code> (not <code>AppData</code>) so it&apos;s <strong>machine-wide</strong>. It persists across Windows user account changes and reinstalls.</p>

      <h2 id="logs">Log files</h2>

      <p>Inside <code>C:\ProgramData\BoothIQ\Logs\</code>:</p>

      <ul>
        <li><code>application-*.log</code>. Startup, shutdown, general operations. 30 days retention</li>
        <li><code>hardware-*.log</code>. Camera, printer, PCB, WiFi events. 30 days retention</li>
        <li><code>transactions-*.log</code>. Customer sessions, payments, photos. 90 days retention</li>
        <li><code>errors-*.log</code>. All exceptions and errors. 30 days retention</li>
        <li><code>performance-*.log</code>. Frame rates, latency, timers. 7 days retention</li>
      </ul>

      <p>Log files are rotated daily. Compressed archives of older logs are kept for the retention period above.</p>

      <h2 id="templates">Template files</h2>

      <ul>
        <li><code>C:\Program Files\BoothIQ\Templates\[CategoryName]\[TemplateName]\</code>. Each template has a folder with its design files</li>
        <li><code>.../template.png</code>. The actual print template image</li>
        <li><code>.../preview.png</code>. The carousel preview image</li>
      </ul>

      <p>Cloud-synced templates are pulled down to this directory as well (or to a separate cloud-managed templates directory, depending on version).</p>

      <h2 id="config">Config files</h2>

      <ul>
        <li><code>C:\Program Files\BoothIQ\config.json</code>. App configuration. Public key, product ID, API base URL</li>
        <li><code>C:\ProgramData\BoothIQ\master-password.config</code>. Master password config (enterprise builds)</li>
      </ul>

      <p>The <code>config.json</code> file contains values set at install time (e.g. the BoothIQ cloud API URL). Operators don&apos;t edit it.</p>

      <h2 id="registry">Windows registry entries</h2>

      <ul>
        <li><code>HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run\BoothIQ</code>. Auto-start on Windows boot</li>
        <li><code>HKLM\SOFTWARE\BoothIQ\BoothIQ\InstallPath</code>. Installation path</li>
        <li><code>HKLM\SOFTWARE\BoothIQ\BoothIQ\Version</code>. Installed version</li>
      </ul>

      <h2 id="firewall">Windows firewall rules</h2>

      <ul>
        <li><strong>BoothIQ Photo Upload Server.</strong> Inbound rule allowing the Phone Print feature&apos;s local web server on port 8080, scoped to the local subnet</li>
      </ul>

      <p>This rule is created automatically by the BoothIQ installer. Operators don&apos;t manage it.</p>

      <h2 id="backup-db">How to back up the database</h2>

      <p>You cannot reach the database file directly from the locked-down kiosk. If you need a backup:</p>

      <ul>
        <li><strong>Option A (preferred):</strong> Use the <strong>Export Sales CSV</strong> feature in the Sales &amp; Analytics tab to export transactions to a USB drive. This gives you a plain-text audit trail.</li>
        <li><strong>Option B:</strong> Contact support. They can assist with a proper database backup procedure.</li>
      </ul>

      <h2 id="read-logs">How to read logs</h2>

      <p>Operators can&apos;t browse the log files directly. If support asks you for logs:</p>

      <ul>
        <li>
          <strong>Use the cloud&apos;s <code>download_logs</code> remote command</strong> if your booth is registered. See{" "}
          <Link href="/docs/cloud-and-fleet/remote-commands">Remote commands</Link>
          .
        </li>
        <li>Support can pull logs without you needing to touch the file system.</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <Link href="/docs/security-and-compliance/data-and-privacy">
            Data and privacy
          </Link>
          . What the database contains and privacy implications.
        </li>
        <li>
          <Link href="/docs/running-your-booth/exporting-sales-data">
            Exporting sales data
          </Link>
          . Your main backup mechanism.
        </li>
        <li>
          <Link href="/docs/cloud-and-fleet/remote-commands">Remote commands</Link>
          . How support gets logs.
        </li>
      </ul>
    </DocsLayout>
  );
}
