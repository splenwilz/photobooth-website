import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "WiFi tab — BoothIQ Docs",
  description:
    "A tour of the WiFi tab: adapter status, current network, scanning, connecting, and disconnecting.",
};

const HREF = "/docs/admin-dashboard/wifi-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout", label: "Layout" },
  { id: "status-row", label: "Status row cards" },
  { id: "action-buttons", label: "Action buttons" },
  { id: "available-networks", label: "Available Networks list" },
  { id: "scanning", label: "Scanning for networks" },
  { id: "connecting", label: "Connecting to a network" },
  { id: "disconnecting", label: "Disconnecting" },
  { id: "no-adapter", label: "\"No WiFi adapter detected\" message" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "vs-phone-print", label: "Wi-Fi vs the Phone Print hotspot" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function WifiTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>WiFi tab</h1>

      <p>
        The <strong>WiFi</strong> tab is where you connect the kiosk
        to your venue&apos;s wireless network. Everything Wi-Fi-related
        happens here. There&apos;s no Windows networking dialog to
        fall back on, because the booth is locked down.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators or installers
        connecting a kiosk to Wi-Fi for the first time, or moving to a
        new venue.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>See the <strong>WiFi adapter</strong> state (Active / Inactive)</li>
        <li>See the <strong>currently connected network</strong> and its signal strength</li>
        <li>Scan for <strong>available networks</strong> in range</li>
        <li><strong>Connect</strong> to a network with a password</li>
        <li><strong>Disconnect</strong> from the current network</li>
        <li>See <strong>security types</strong> (WPA2, WPA3, etc.) for each network</li>
      </ul>

      <h2 id="layout">Layout</h2>

      <p>Top to bottom:</p>

      <ol>
        <li><strong>Page header</strong>. Title &quot;WiFi Networks&quot;, subtitle &quot;Manage wireless network connections&quot;</li>
        <li><strong>Disconnect</strong> and <strong>Scan Networks</strong> buttons at the top right (Disconnect only visible when connected)</li>
        <li><strong>Status row</strong> with three cards: WiFi Adapter, Current Network, Status</li>
        <li><strong>Available Networks</strong> section card with a scrollable list of network items</li>
      </ol>

      <DocsScreenshot
        src="wifi-tab-full.png"
        alt="WiFi tab with the status row, action buttons, and available networks list."
      />

      <h2 id="status-row">Status row cards</h2>

      <h3>WiFi Adapter card</h3>
      <p>Shows the state of the kiosk&apos;s wireless adapter:</p>
      <ul>
        <li>A header label &quot;WiFi Adapter&quot;</li>
        <li>A large status text (e.g. &quot;Available&quot; or &quot;Not detected&quot;)</li>
        <li>A pill underneath: <strong>Active</strong> in green if the adapter is up, or another state if it&apos;s not</li>
      </ul>
      <p>If this card says <strong>Inactive</strong> or &quot;No WiFi adapter detected&quot;, the kiosk doesn&apos;t have a wireless adapter installed. You&apos;ll need to use Ethernet, or contact BoothIQ support.</p>

      <h3>Current Network card</h3>
      <p>Shows the network you&apos;re currently connected to:</p>
      <ul>
        <li>A header label &quot;Current Network&quot;</li>
        <li>The SSID (or &quot;Not connected&quot; if you&apos;re not connected to anything)</li>
        <li>The signal strength below</li>
      </ul>
      <p>This card lets you confirm at a glance whether the booth is on the network you intended.</p>

      <h3>Status card</h3>
      <p>Shows the current connection state:</p>
      <ul>
        <li>A header label &quot;Status&quot;</li>
        <li>The status text (e.g. &quot;Connected&quot; or &quot;Disconnected&quot;)</li>
        <li>The security type below (e.g. &quot;WPA2&quot;, &quot;Open&quot;, &quot;WPA3&quot;)</li>
      </ul>
      <p>When you&apos;re disconnected, the security text shows <code>--</code>.</p>

      <DocsScreenshot
        src="wifi-status-cards.png"
        alt="WiFi status row showing Active adapter, connected network, and WPA2 security."
      />

      <h2 id="action-buttons">Action buttons (top right)</h2>

      <ul>
        <li><strong>Scan Networks</strong> (primary teal button with a refresh icon). Always visible. Tap to refresh the list of available networks.</li>
        <li><strong>Disconnect</strong> (secondary button). Only visible when you&apos;re currently connected to a network. Tap to drop the connection.</li>
      </ul>

      <h2 id="available-networks">Available Networks list</h2>

      <p>The main content of the tab is the list of available networks the booth has scanned for. Each row shows:</p>

      <ul>
        <li><strong>Signal-strength bar graph</strong> on the left (4 bars, with active bars colored teal)</li>
        <li>The network&apos;s <strong>SSID</strong> in bold</li>
        <li>A <strong>lock icon</strong> if the network is password-protected</li>
        <li>The <strong>security type</strong> (WPA2, WPA3, Open, etc.)</li>
        <li>The <strong>signal percentage</strong> (e.g. 75%)</li>
        <li>A <strong>Connect</strong> button on the right (or a green <strong>Connected</strong> badge for the currently connected network)</li>
      </ul>

      <DocsScreenshot
        src="wifi-network-list.png"
        alt="Available Networks list with multiple Wi-Fi networks and signal-strength bars."
      />

      <h2 id="scanning">Scanning for networks</h2>

      <ol>
        <li>Tap <strong>Scan Networks</strong> at the top right.</li>
        <li>The &quot;Available Networks&quot; section briefly shows <strong>Scanning for networks...</strong>.</li>
        <li>After a few seconds the list populates with everything in range.</li>
      </ol>

      <p>If the list is empty after a scan, try again. Wi-Fi scans occasionally miss networks on the first pass.</p>

      <h2 id="connecting">Connecting to a network</h2>

      <ol>
        <li>Find your venue&apos;s network in the list.</li>
        <li>Tap the <strong>Connect</strong> button on its row.</li>
        <li>If the network is password-protected, BoothIQ prompts you for the password. The on-screen virtual keyboard appears.</li>
        <li>Type the password and confirm.</li>
        <li>The booth attempts to connect. The status row at the top updates as it goes.</li>
        <li>On success, the network&apos;s row shows a <strong>Connected</strong> badge instead of the Connect button, and the <strong>Disconnect</strong> button appears at the top right of the page.</li>
      </ol>

      <p>
        For a full walkthrough including troubleshooting, see{" "}
        <Link href="/docs/connecting-your-kiosk/connecting-to-wifi">
          Connecting to Wi-Fi
        </Link>
        .
      </p>

      <h2 id="disconnecting">Disconnecting</h2>

      <ol>
        <li>Tap <strong>Disconnect</strong> at the top right.</li>
        <li>The booth drops the connection. The Current Network card shows &quot;Not connected&quot;.</li>
      </ol>

      <p>
        The network stays in the list, and you can reconnect by
        tapping its <strong>Connect</strong> button again. You may
        need to enter the password again. BoothIQ doesn&apos;t
        permanently store Wi-Fi passwords across disconnects.
      </p>

      <h2 id="no-adapter">&quot;No WiFi adapter detected&quot; message</h2>

      <p>
        If the booth&apos;s hardware has no wireless adapter, the WiFi
        tab shows a friendly <strong>No WiFi adapter detected</strong>{" "}
        message instead of the network list. The icon is an alert
        triangle. The full text reads:
      </p>

      <blockquote>
        <p>&quot;No WiFi adapter detected&quot;</p>
        <p>&quot;Please ensure your device has a wireless network adapter installed.&quot;</p>
      </blockquote>

      <p>If you see this and you expected Wi-Fi capability, contact BoothIQ support.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You can use the WiFi tab effectively when you can:</p>

      <ul>
        <li>Read the status row and tell whether the adapter is up and which network you&apos;re on</li>
        <li>Scan and refresh the available networks list</li>
        <li>Connect to a password-protected network</li>
        <li>Disconnect from the current network</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Scan returns empty.</strong></p>
      <p>Wireless interference, busy adapter. Tap Scan Networks again.</p>

      <p><strong>Your network isn&apos;t in the list.</strong></p>
      <p>Hidden SSID, out of range, or 5 GHz only with a 2.4 GHz adapter. Move closer to the AP. Hidden SSIDs aren&apos;t supported in the basic scan flow.</p>

      <p><strong>Wrong password.</strong></p>
      <p>Typo on the virtual keyboard. Try again.</p>

      <p><strong>Connection drops repeatedly.</strong></p>
      <p>Weak signal or congestion. Move closer to the AP, or use Ethernet.</p>

      <p><strong>Adapter card always shows &quot;Inactive&quot;.</strong></p>
      <p>No wireless adapter in the hardware. Use Ethernet; contact support if you expected Wi-Fi.</p>

      <h2 id="vs-phone-print">Wi-Fi vs the Phone Print hotspot</h2>

      <p>These are different networks:</p>

      <ul>
        <li><strong>The WiFi tab connects the booth to your venue&apos;s Wi-Fi</strong> (so the booth has internet).</li>
        <li><strong>The Phone Print feature uses a separate local Wi-Fi network the booth creates itself</strong> (so customer phones can upload photos).</li>
      </ul>

      <p>Disabling or disconnecting from your venue Wi-Fi does <strong>not</strong> affect Phone Print, and vice versa.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/connecting-your-kiosk/connecting-to-wifi">
            Connecting to Wi-Fi
          </Link>
          . Step-by-step walkthrough.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link>
          . Now that you&apos;re online, register the booth in the cloud.
        </li>
      </ul>
    </DocsLayout>
  );
}
