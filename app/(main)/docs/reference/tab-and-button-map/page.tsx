import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Tab and button map — BoothIQ Docs",
  description:
    "A flat list of every admin tab and the major actions inside it.",
};

const HREF = "/docs/reference/tab-and-button-map";

const TOC = [
  { id: "sidebar", label: "Sidebar structure" },
  { id: "header-bar", label: "Header bar" },
  { id: "sales-tab", label: "Sales & Analytics tab" },
  { id: "credits-tab", label: "Credits tab" },
  { id: "products-tab", label: "Products tab" },
  { id: "templates-tab", label: "Templates tab" },
  { id: "layouts-tab", label: "Layouts tab" },
  { id: "settings-tab", label: "Settings tab" },
  { id: "diagnostics-tab", label: "Diagnostics tab" },
  { id: "cloud-sync-tab", label: "Cloud Sync tab" },
  { id: "wifi-tab", label: "WiFi tab" },
  { id: "cross-tab", label: "Cross-tab actions" },
  { id: "related", label: "Related" },
] as const;

export default function TabAndButtonMapPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Tab and button map</h1>

      <p>A quick-reference flat list of every admin tab and what you can do in each. Use this when you know what you want to do but can&apos;t remember which tab it&apos;s in.</p>

      <h2 id="sidebar">Sidebar structure</h2>

      <p><strong>MAIN MENU section:</strong></p>
      <ul>
        <li>Sales &amp; Analytics</li>
        <li>Credits</li>
        <li>Products</li>
        <li>Templates</li>
        <li>Layouts</li>
      </ul>

      <p><strong>SYSTEM section:</strong></p>
      <ul>
        <li>Settings</li>
        <li>Diagnostics</li>
        <li>Cloud Sync</li>
        <li>WiFi</li>
      </ul>

      <p><strong>Exit Admin</strong> button at the bottom of the sidebar.</p>

      <h2 id="header-bar">Header bar (visible from every tab)</h2>

      <ul>
        <li><strong>Breadcrumb.</strong> &quot;Admin / [current tab]&quot;</li>
        <li><strong>Camera pill.</strong> Green/red, Camera online status</li>
        <li><strong>Printer pill.</strong> Green/red, Printer online status</li>
        <li><strong>PCB pill.</strong> Green/red, Payment device online status</li>
        <li><strong>Mode pill.</strong> &quot;Coin Operated&quot; or &quot;Free Play&quot;</li>
        <li><strong>Prints indicator.</strong> Prints remaining on current roll (progress bar + number)</li>
        <li><strong>Error badge.</strong> Appears only when an error code is active (yellow/amber)</li>
        <li><strong>License banner</strong> (below header). Only when license is in trial / grace / expiring state</li>
        <li><strong>USB warning banner</strong> (below header / license banner). When photo saving is on but no USB drive plugged in</li>
      </ul>

      <h2 id="sales-tab">Sales &amp; Analytics tab</h2>

      <ul>
        <li>Date range filter: Today / 7d / 30d / 90d / YTD</li>
        <li>Revenue total card</li>
        <li>Transactions count card</li>
        <li>Copies sold card</li>
        <li>Average order card</li>
        <li>Print supply progress bar</li>
        <li>Revenue trend chart</li>
        <li>Product breakdown chart</li>
        <li>Popular templates report</li>
        <li>Payment method breakdown</li>
        <li>Transaction history table (paginated)</li>
        <li>Export CSV button</li>
      </ul>

      <h2 id="credits-tab">Credits tab</h2>

      <ul>
        <li>Current balance display</li>
        <li>Manual Add Credits input + button</li>
        <li>Deduct input + button</li>
        <li>Reset balance button</li>
        <li>Credit flow chart</li>
        <li>Credit source breakdown (Pulse / Cloud / Admin / Other)</li>
        <li>Transaction filter: All / Add / Deduct / Reset</li>
        <li>Credit transaction history (paginated)</li>
      </ul>

      <h2 id="products-tab">Products tab</h2>

      <p>For each product (Photo Strips / 4×6 Prints / Smartphone Print):</p>

      <ul>
        <li>Enable / disable toggle</li>
        <li>Base price input</li>
        <li>Extra-copy price input</li>
        <li>Max copies input</li>
        <li>Multi-copy discount percentage input</li>
        <li>Description text</li>
      </ul>

      <p>Save button at top.</p>

      <h2 id="templates-tab">Templates tab</h2>

      <ul>
        <li>Search input</li>
        <li>Category filter</li>
        <li>Page size control</li>
        <li>Template grid (paginated)</li>
        <li>
          For each template card:
          <ul>
            <li>Preview image</li>
            <li>Template name</li>
            <li>Category badge</li>
            <li>Enable / disable toggle</li>
            <li>Premium badge (if marked premium)</li>
          </ul>
        </li>
        <li>Category Management modal (open from within the tab)</li>
      </ul>

      <h2 id="layouts-tab">Layouts tab</h2>

      <ul>
        <li>Layout list (left)</li>
        <li>Edit form (middle)</li>
        <li>Canvas preview (right)</li>
        <li>New Layout button</li>
        <li>
          For each layout:
          <ul>
            <li>Name</li>
            <li>Photo area count</li>
            <li>Canvas dimensions</li>
            <li>Edit button (for non-built-in)</li>
            <li>Delete button (for non-built-in)</li>
          </ul>
        </li>
        <li>Photo area editor with position, size, rotation, shape, border radius</li>
      </ul>

      <h2 id="settings-tab">Settings tab</h2>

      <p><strong>Save Settings</strong> button at the top right with a hint underneath.</p>

      <p><strong>Left column:</strong></p>

      <ul>
        <li>
          <strong>Business Information card:</strong>
          <ul>
            <li>Sync from cloud toggle</li>
            <li>Business Logo upload (USB drive required)</li>
            <li>Business Name field</li>
            <li>Location field</li>
            <li>Welcome Subtitle field</li>
            <li>Show logo on prints toggle</li>
          </ul>
        </li>
        <li>
          <strong>Photo Storage card:</strong>
          <ul>
            <li>Save captured photos toggle</li>
          </ul>
        </li>
        <li>
          <strong>Hardware Error Screen card:</strong>
          <ul>
            <li>Enable hardware watchdog toggle (saves instantly, no Save button needed)</li>
          </ul>
        </li>
      </ul>

      <p><strong>Right column:</strong></p>

      <ul>
        <li>
          <strong>Quick Actions card:</strong>
          <ul>
            <li>Test Camera button</li>
            <li>Test Print button</li>
          </ul>
        </li>
        <li><strong>License Status card:</strong> (read-only display)</li>
        <li>
          <strong>Security &amp; Users card:</strong>
          <ul>
            <li>Change My Password form (Current / New / Confirm)</li>
            <li>(If Master) User management section</li>
          </ul>
        </li>
      </ul>

      <h2 id="diagnostics-tab">Diagnostics tab</h2>

      <ul>
        <li>Run All Tests button (top right)</li>
        <li>
          <strong>Hardware Status Cards Row:</strong>
          <ul>
            <li>Camera status card (Active / Inactive, with message)</li>
            <li>Printer status card (Active / Error, with message)</li>
            <li>PCB status card (with listener info)</li>
          </ul>
        </li>
        <li>
          <strong>Camera section:</strong>
          <ul>
            <li>Camera selector dropdown</li>
            <li>Brightness slider (0-100)</li>
            <li>Zoom slider (0-200%)</li>
            <li>Contrast slider (0-100)</li>
            <li>Test Capture button</li>
            <li>Live preview</li>
          </ul>
        </li>
        <li>
          <strong>Printer section:</strong>
          <ul>
            <li>Printer status panel</li>
            <li>Test Print button</li>
            <li>Media level info</li>
          </ul>
        </li>
        <li>
          <strong>PCB section:</strong>
          <ul>
            <li>COM port selector</li>
            <li>Listening status</li>
            <li>Live pulse activity view</li>
          </ul>
        </li>
        <li><strong>USB Hang Debug section</strong> (advanced)</li>
      </ul>

      <h2 id="cloud-sync-tab">Cloud Sync tab</h2>

      <ul>
        <li>Page title &quot;Cloud Sync&quot;</li>
        <li>Subtitle &quot;Connect your booth to the cloud for remote monitoring and data sync&quot;</li>
        <li>Status badge (Connected / Not Registered / Error) at top right</li>
      </ul>

      <p><strong>Quick Registration card (collapsible):</strong></p>

      <ul>
        <li>6-character registration code input</li>
        <li>Register Booth button</li>
        <li>&quot;How to get your code&quot; info panel</li>
      </ul>

      <p><strong>Manual Registration (Advanced) card (collapsible):</strong></p>

      <ul>
        <li>Cloud API URL field</li>
        <li>Booth ID field</li>
        <li>API Key field (with show/hide eye toggle)</li>
        <li>Save &amp; Connect button</li>
        <li>Test Connection button</li>
      </ul>

      <p><strong>Unregister Booth button</strong> (red, only visible when registered)</p>

      <p><strong>Cloud Features card</strong>. 3×2 grid:</p>

      <ul>
        <li>Remote Analytics</li>
        <li>Notifications</li>
        <li>Template Sync</li>
        <li>Sales Reports</li>
        <li>Photo Backup</li>
        <li>Remote Config</li>
      </ul>

      <p><strong>Sync Status card</strong> (right column):</p>

      <ul>
        <li>Pending items count</li>
        <li>Last sync timestamp</li>
        <li>Total synced</li>
      </ul>

      <h2 id="wifi-tab">WiFi tab</h2>

      <ul>
        <li>Page title &quot;WiFi Networks&quot;</li>
        <li>Subtitle &quot;Manage wireless network connections&quot;</li>
      </ul>

      <p><strong>Top right buttons:</strong></p>

      <ul>
        <li>Disconnect button (only when connected)</li>
        <li>Scan Networks button</li>
      </ul>

      <p><strong>Status row (3 cards):</strong></p>

      <ul>
        <li>WiFi Adapter card (Active / Inactive)</li>
        <li>Current Network card (SSID + signal)</li>
        <li>Status card (Connected / Disconnected + security type)</li>
      </ul>

      <p><strong>Available Networks card:</strong></p>

      <ul>
        <li>Loading indicator (&quot;Scanning for networks...&quot;)</li>
        <li>&quot;No WiFi adapter detected&quot; message (when applicable)</li>
        <li>
          Network list with:
          <ul>
            <li>Signal bars (4)</li>
            <li>SSID</li>
            <li>Lock icon (if protected)</li>
            <li>Security type + signal %</li>
            <li>Connect button OR Connected badge</li>
          </ul>
        </li>
      </ul>

      <h2 id="cross-tab">Cross-tab actions</h2>

      <p>Some common operator tasks span multiple tabs:</p>

      <ul>
        <li><strong>Change a price.</strong> Products tab</li>
        <li><strong>Check sales.</strong> Sales &amp; Analytics tab</li>
        <li><strong>Test hardware.</strong> Diagnostics tab (or Settings → Quick Actions)</li>
        <li><strong>Change your password.</strong> Settings → Security &amp; Users</li>
        <li><strong>Comp a customer.</strong> Credits tab</li>
        <li><strong>Switch Coin ↔ Free Play.</strong> Settings → Operation Mode section</li>
        <li><strong>Register the booth in cloud.</strong> Cloud Sync → Quick Registration</li>
        <li><strong>Connect to Wi-Fi.</strong> WiFi tab</li>
        <li><strong>Change business name.</strong> Settings → Business Information</li>
        <li><strong>Upload logo.</strong> Settings → Business Information → Upload Logo (USB)</li>
        <li><strong>Enable/disable a template.</strong> Templates tab</li>
        <li><strong>Change the hardware watchdog.</strong> Settings → Hardware Error Screen</li>
        <li><strong>Export sales to CSV.</strong> Sales &amp; Analytics tab → Export CSV</li>
        <li><strong>See prints remaining.</strong> Header bar (every tab) or Sales tab</li>
        <li><strong>Check license status.</strong> Settings → License Status card, or license banner at top</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard">Admin Dashboard</Link>
          . Full per-tab tours.
        </li>
        <li>
          <Link href="/docs/reference/glossary">Glossary</Link>
          . Definitions of terms used in the UI.
        </li>
      </ul>
    </DocsLayout>
  );
}
