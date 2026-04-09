import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Dashboard overview — BoothIQ Docs",
  description:
    "A tour of the BoothIQ admin dashboard layout: sidebar, header bar, hardware pills, and license banner.",
};

const HREF = "/docs/admin-dashboard/dashboard-overview";

const TOC = [
  { id: "big-picture", label: "The big picture" },
  { id: "sidebar", label: "The sidebar" },
  { id: "header-bar", label: "The header bar" },
  { id: "license-banner", label: "The license banner" },
  { id: "usb-banner", label: "The USB warning banner" },
  { id: "tab-content", label: "The tab content area" },
  { id: "at-a-glance", label: "What to read at a glance" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function DashboardOverviewPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Dashboard overview</h1>

      <p>
        The admin dashboard has the same layout no matter which tab
        you&apos;re on. Once you know where everything lives, you can
        read the booth&apos;s status at a glance and jump straight to
        what you need.
      </p>

      <p>
        <strong>Who this is for:</strong> Every operator. Read this
        once, then refer back to it when you can&apos;t remember where
        a piece of information lives.
      </p>

      <h2 id="big-picture">The big picture</h2>

      <p>The dashboard is split into two regions:</p>

      <ul>
        <li><strong>Sidebar</strong> (dark, on the left). Navigation and the Exit Admin button</li>
        <li><strong>Main content area</strong> (light, on the right). Header bar at the top, the active tab below</li>
      </ul>

      <DocsScreenshot
        src="admin-dashboard-overview.png"
        alt="Full admin dashboard with the dark sidebar on the left and the main content area on the right."
      />

      <h2 id="sidebar">The sidebar</h2>

      <p>The sidebar is always visible. It has, top to bottom:</p>

      <h3>1. Brand / logo section</h3>
      <p>
        A small BoothIQ logo with the text <strong>BoothIQ</strong>{" "}
        and <strong>Admin Panel</strong> underneath. Just a brand mark.
        Nothing to click.
      </p>

      <h3>2. User / access info</h3>
      <p>
        A circular avatar icon next to the text{" "}
        <strong>Administrator</strong> and an{" "}
        <strong>access level badge</strong>. The badge shows:
      </p>
      <ul>
        <li><strong>Full Access</strong> (gradient teal). You&apos;re signed in as a Master account</li>
        <li><strong>User Access</strong> (different color). You&apos;re signed in as a User account</li>
      </ul>
      <p>This is how you confirm at a glance which account you&apos;re using.</p>

      <h3>3. Navigation tabs (in two groups)</h3>

      <p><strong>MAIN MENU</strong> (operations you&apos;ll do every day):</p>

      <ul>
        <li><strong>Sales &amp; Analytics</strong>. Revenue, transactions, popular templates</li>
        <li><strong>Credits</strong>. Current balance, manual credit adds, history</li>
        <li><strong>Products</strong>. Enable products, set prices</li>
        <li><strong>Templates</strong>. Browse and manage templates</li>
        <li><strong>Layouts</strong>. Photo-area positioning for templates</li>
      </ul>

      <p><strong>SYSTEM</strong> (configuration and infrastructure):</p>

      <ul>
        <li><strong>Settings</strong>. Business info, logo, photo storage, watchdog, password change</li>
        <li><strong>Diagnostics</strong>. Hardware status and &quot;Run All Tests&quot;</li>
        <li><strong>Cloud Sync</strong>. Register the booth, view sync status</li>
        <li><strong>WiFi</strong>. Scan and connect to wireless networks</li>
      </ul>

      <p>
        The currently active tab is highlighted with a brighter
        background and a thin teal accent line on its left edge.
      </p>

      <h3>4. Exit Admin button</h3>
      <p>
        At the very bottom of the sidebar. Tap it to leave admin and
        return the booth to the customer welcome screen.
      </p>

      <h2 id="header-bar">The header bar</h2>

      <p>
        The header bar runs across the top of the main content area
        and shows the same information no matter which tab you&apos;re
        on.
      </p>

      <h3>Left side: breadcrumb and hardware status pills</h3>

      <ul>
        <li><strong>Breadcrumb.</strong> &quot;Admin / <em>current tab name</em>&quot;. The current tab name updates as you navigate.</li>
        <li><strong>Camera pill.</strong> Green if the camera is online, red if it&apos;s offline. Has a tiny status dot and the word <strong>Camera</strong>.</li>
        <li><strong>Printer pill.</strong> Green/red, with the word <strong>Printer</strong>.</li>
        <li><strong>PCB pill.</strong> Green/red, with the word <strong>PCB</strong>. PCB stands for the payment device (coin/bill acceptor) PCB.</li>
      </ul>

      <p>
        These pills update automatically as the booth polls hardware.
        If any of them turn red, you&apos;ll see it the next time you
        open admin without having to navigate to the Diagnostics tab.
      </p>

      <DocsScreenshot
        src="header-pills-all-green.png"
        alt="Header bar with all three hardware pills (Camera, Printer, PCB) green."
      />

      <h3>Right side: mode and prints remaining</h3>

      <ul>
        <li><strong>Mode pill.</strong> Shows the current operation mode (e.g. <strong>Coin Operated</strong> or <strong>Free Play</strong>). Set in the Settings tab.</li>
        <li><strong>Prints indicator.</strong> A small printer icon, the label <strong>Prints:</strong>, a horizontal progress bar, and a number. The number is the prints remaining on the current paper roll. The bar fills as the roll is consumed. Shows <code>--</code> if the printer hasn&apos;t reported its level yet (give it a few seconds after launch).</li>
        <li><strong>Error badge.</strong> Only appears when an error code is active. Yellow/amber background with an alert icon and a short error label. Tap it for details.</li>
      </ul>

      <h2 id="license-banner">The license banner</h2>

      <p>
        If your license is in a trial, grace, or expiring state, a{" "}
        <strong>license banner</strong> appears between the header bar
        and the tab content. The banner explains the state in plain
        English and tells you what to do (usually: contact support or
        renew through the cloud dashboard).
      </p>

      <p>
        For a normal active license, the banner is{" "}
        <strong>hidden</strong>. You won&apos;t see it at all.
      </p>

      <p>
        See{" "}
        <Link href="/docs/connecting-your-kiosk/license-and-activation">
          Connecting Your Kiosk › License and activation
        </Link>{" "}
        for what each state means.
      </p>

      <h2 id="usb-banner">The USB warning banner</h2>

      <p>
        If the booth has the <strong>Save photos to USB</strong>{" "}
        setting enabled in the Settings tab but no USB drive is
        currently plugged in, a separate{" "}
        <strong>USB Warning Banner</strong> appears below the license
        banner (or directly below the header if there&apos;s no license
        banner). This is a reminder that photos can&apos;t be saved.
      </p>

      <p>
        If you don&apos;t use the photo-save feature, you can ignore
        this banner, or turn it off by disabling{" "}
        <strong>Save captured photos</strong> in{" "}
        <strong>Settings → Photo Storage</strong>.
      </p>

      <h2 id="tab-content">The tab content area</h2>

      <p>
        Everything below the banners is the active tab. Each tab has
        its own layout. See the per-tab articles for details:
      </p>

      <ul>
        <li><Link href="/docs/admin-dashboard/sales-tab">Sales &amp; Analytics tab</Link></li>
        <li><Link href="/docs/admin-dashboard/credits-tab">Credits tab</Link></li>
        <li><Link href="/docs/admin-dashboard/products-tab">Products tab</Link></li>
        <li><Link href="/docs/admin-dashboard/templates-tab">Templates tab</Link></li>
        <li><Link href="/docs/admin-dashboard/layouts-tab">Layouts tab</Link></li>
        <li><Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link></li>
        <li><Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link></li>
        <li><Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link></li>
        <li><Link href="/docs/admin-dashboard/wifi-tab">WiFi tab</Link></li>
      </ul>

      <h2 id="at-a-glance">What to read at a glance</h2>

      <p>When you sign in to admin, look at these four things in order:</p>

      <ol>
        <li><strong>License banner.</strong> Is one showing? If yes, address it.</li>
        <li><strong>Hardware pills</strong> (Camera / Printer / PCB). Are they all green?</li>
        <li><strong>Prints remaining.</strong> Do you have enough paper for the day?</li>
        <li><strong>Mode.</strong> Are you in the right mode (Coin Operated vs Free Play)?</li>
      </ol>

      <p>
        If all four are healthy, the booth is ready for customers. If
        any of them is wrong, fix that before you exit admin.
      </p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;re comfortable with the dashboard layout when you can:</p>

      <ul>
        <li>Find any tab without hunting through the sidebar</li>
        <li>Read the hardware status from the header pills without opening Diagnostics</li>
        <li>Tell at a glance whether the booth is in Coin Operated or Free Play mode</li>
        <li>Spot a license banner if one appears</li>
        <li>Find the Exit Admin button</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <p>Tour the tabs you&apos;ll use most:</p>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/sales-tab">Sales &amp; Analytics tab</Link>
          . Your daily report
        </li>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Your hardware-health view
        </li>
        <li>
          <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
          . Where most one-time configuration lives
        </li>
      </ul>
    </DocsLayout>
  );
}
