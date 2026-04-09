import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Connecting to Wi-Fi — BoothIQ Docs",
  description:
    "Use the WiFi tab in the BoothIQ admin dashboard to scan for and join your venue's wireless network.",
};

const HREF = "/docs/connecting-your-kiosk/connecting-to-wifi";

const TOC = [
  { id: "before-you-start", label: "Before you start" },
  { id: "step-1", label: "Step 1: Open the WiFi tab" },
  { id: "step-2", label: "Step 2: Read the status row" },
  { id: "step-3", label: "Step 3: Scan for available networks" },
  { id: "step-4", label: "Step 4: Connect to your network" },
  { id: "step-5", label: "Step 5: Verify the connection" },
  { id: "disconnecting", label: "Disconnecting from a network" },
  { id: "verify-it-worked", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "what-wifi-does", label: "What Wi-Fi connection does and doesn't do" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ConnectingToWiFiPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Connecting to Wi-Fi</h1>

      <p>
        A BoothIQ kiosk can connect to a venue Wi-Fi network entirely
        from inside the BoothIQ admin dashboard. You don&apos;t need to
        open Windows, you don&apos;t need a keyboard, and you don&apos;t
        need a tech on site. All you need is the network&apos;s SSID and
        password.
      </p>

      <p>
        If your kiosk is plugged into Ethernet, you can skip this entire
        article. The booth will use the wired connection automatically.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators and installers
        connecting a new kiosk to a venue&apos;s Wi-Fi for the first
        time, or moving an existing kiosk to a new venue.
      </p>

      <h2 id="before-you-start">Before you start</h2>

      <ul>
        <li>The kiosk is powered on and the welcome screen is showing.</li>
        <li>
          You know the <strong>SSID</strong> (network name) and{" "}
          <strong>password</strong> of the Wi-Fi network you want to join.
        </li>
        <li>
          The Wi-Fi network is <strong>not</strong> a captive portal (the
          kind that pops up a browser login page after you connect).
          Captive portals don&apos;t work on a locked-down kiosk. Talk to
          your venue IT for a regular Wi-Fi or an Ethernet drop.
        </li>
        <li>
          You have admin access to the kiosk (see{" "}
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>
          ).
        </li>
      </ul>

      <h2 id="step-1">Step 1: Open the WiFi tab</h2>

      <ol>
        <li>From the welcome screen, tap the credits indicator <strong>5 times</strong> in quick succession.</li>
        <li>Sign in to admin.</li>
        <li>In the sidebar, tap <strong>WiFi</strong> (under the <strong>SYSTEM</strong> section).</li>
        <li>The WiFi tab opens. The page header reads <strong>WiFi Networks</strong> with a subtitle &quot;Manage wireless network connections&quot;.</li>
      </ol>

      <DocsScreenshot
        src="admin-sidebar-wifi.png"
        alt="Admin sidebar with the WiFi tab highlighted under the SYSTEM section."
      />

      <h2 id="step-2">Step 2: Read the status row</h2>

      <p>At the top of the WiFi tab you&apos;ll see three status cards:</p>

      <table>
        <thead>
          <tr>
            <th>Card</th>
            <th>What it shows</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>WiFi Adapter</strong></td>
            <td>Whether the kiosk&apos;s wireless adapter is detected. Should say <strong>Active</strong> in green.</td>
          </tr>
          <tr>
            <td><strong>Current Network</strong></td>
            <td>The SSID you&apos;re currently connected to (or &quot;Not connected&quot;) and the signal strength.</td>
          </tr>
          <tr>
            <td><strong>Status</strong></td>
            <td>&quot;Connected&quot; or &quot;Disconnected&quot; plus the security type of the current network.</td>
          </tr>
        </tbody>
      </table>

      <p>
        If the <strong>WiFi Adapter</strong> card says{" "}
        <strong>Inactive</strong> or shows &quot;No WiFi adapter
        detected&quot;, the kiosk&apos;s hardware doesn&apos;t have a
        wireless adapter and you&apos;ll need to use Ethernet instead.
        Contact BoothIQ support if you expected Wi-Fi capability and
        don&apos;t have it.
      </p>

      <DocsScreenshot
        src="wifi-tab-status-row.png"
        alt="WiFi tab status row showing Active adapter, Not connected, and Disconnected status."
      />

      <h2 id="step-3">Step 3: Scan for available networks</h2>

      <ol>
        <li>Tap the <strong>Scan Networks</strong> button at the top right of the page.</li>
        <li>The &quot;Available Networks&quot; section shows <strong>Scanning for networks...</strong> for a moment.</li>
        <li>
          After a few seconds, you&apos;ll see a list of networks. Each
          item shows:
          <ul>
            <li>A signal-strength bar graph (4 bars, color-coded)</li>
            <li>The network&apos;s SSID</li>
            <li>A lock icon if the network is password-protected</li>
            <li>The security type (WPA2, WPA3, etc.) and signal percentage</li>
            <li>A <strong>Connect</strong> button on the right</li>
          </ul>
        </li>
      </ol>

      <p>
        If no networks appear, tap <strong>Scan Networks</strong> again.
        Wireless scans can take a few seconds and occasionally miss
        networks on the first pass.
      </p>

      <DocsScreenshot
        src="wifi-tab-network-list.png"
        alt="WiFi tab with a list of available networks, each row showing signal bars, SSID, lock icon, and Connect button."
      />

      <h2 id="step-4">Step 4: Connect to your network</h2>

      <ol>
        <li>Find your venue&apos;s network in the list.</li>
        <li>Tap the <strong>Connect</strong> button on its row.</li>
        <li>If the network is password-protected, BoothIQ will prompt you for the password. The on-screen virtual keyboard appears automatically.</li>
        <li>Type the password and confirm.</li>
        <li>The booth attempts to connect. The status row at the top of the page updates as the connection progresses.</li>
        <li>When the connection succeeds, the network&apos;s row shows a green <strong>Connected</strong> badge instead of the Connect button.</li>
      </ol>

      <DocsScreenshot
        src="wifi-tab-password-prompt.png"
        alt="WiFi password entry prompt with the on-screen virtual keyboard visible."
      />

      <h2 id="step-5">Step 5: Verify the connection</h2>

      <p>After connecting, confirm:</p>

      <ul>
        <li>The <strong>Current Network</strong> card shows your SSID and the signal strength.</li>
        <li>The <strong>Status</strong> card says <strong>Connected</strong> with the security type.</li>
        <li>A <strong>Disconnect</strong> button appears at the top right of the page (next to <strong>Scan Networks</strong>).</li>
        <li>The connected network&apos;s row in the list shows the green <strong>Connected</strong> badge.</li>
      </ul>

      <DocsScreenshot
        src="wifi-tab-connected.png"
        alt="WiFi tab in the fully connected state with a Disconnect button visible at the top right."
      />

      <h2 id="disconnecting">Disconnecting from a network</h2>

      <p>If you ever need to disconnect from the current network:</p>

      <ol>
        <li>Open the WiFi tab.</li>
        <li>Tap <strong>Disconnect</strong> at the top right.</li>
        <li>The booth drops the connection. The Current Network card switches back to &quot;Not connected&quot;.</li>
      </ol>

      <p>
        This does not delete the network from your scan list. You can
        reconnect by tapping its <strong>Connect</strong> button again.
        But the booth does not store passwords across reconnects in the
        way a Windows desktop does, so you may need to enter the
        password again.
      </p>

      <h2 id="verify-it-worked">Verify it worked</h2>

      <p>You&apos;re done when:</p>

      <ul>
        <li>The <strong>WiFi Adapter</strong> card says <strong>Active</strong>.</li>
        <li>The <strong>Current Network</strong> card shows the SSID you intended to join.</li>
        <li>The <strong>Status</strong> card shows <strong>Connected</strong>.</li>
        <li>(Optional) Open <strong>Cloud Sync</strong> in the sidebar. If the booth is registered, the sync activity should resume within a few seconds.</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <table>
        <thead>
          <tr>
            <th>Symptom</th>
            <th>Likely cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Scan returns no networks</td>
            <td>The wireless adapter is busy or the venue Wi-Fi is on a band the adapter doesn&apos;t support</td>
            <td>Tap <strong>Scan Networks</strong> again. If still empty, restart the kiosk and try again</td>
          </tr>
          <tr>
            <td>Your network isn&apos;t in the list</td>
            <td>The network is hidden, out of range, or on 5 GHz only</td>
            <td>Move the kiosk closer to the access point. For hidden networks, contact support. Hidden SSIDs aren&apos;t supported in the standard scan flow</td>
          </tr>
          <tr>
            <td>Password rejected</td>
            <td>Typo on the touch keyboard, or wrong network</td>
            <td>Try again carefully. Note that Wi-Fi passwords are case-sensitive</td>
          </tr>
          <tr>
            <td>Connection drops repeatedly</td>
            <td>Weak signal, channel congestion, or venue captive portal interfering</td>
            <td>Move the kiosk to a stronger-signal spot, or use Ethernet if possible</td>
          </tr>
          <tr>
            <td>Sync still says &quot;Not Registered&quot; after connecting</td>
            <td>Connecting to Wi-Fi doesn&apos;t register the booth. That&apos;s a separate step</td>
            <td>
              See{" "}
              <Link href="/docs/connecting-your-kiosk/cloud-registration">
                Cloud registration
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="what-wifi-does">What Wi-Fi connection does and doesn&apos;t do</h2>

      <p>
        Connecting to Wi-Fi makes the booth <strong>reachable on the
        internet</strong>. That&apos;s all. It does not:
      </p>

      <ul>
        <li>
          Register the booth in the cloud (that&apos;s a separate step,
          see{" "}
          <Link href="/docs/connecting-your-kiosk/cloud-registration">
            Cloud registration
          </Link>
          )
        </li>
        <li>Activate or renew a license (that happens automatically when the booth is registered)</li>
        <li>Update the BoothIQ software (updates are managed through the cloud after registration)</li>
        <li>Affect the <strong>Phone Print</strong> feature. Phone Print uses a separate local Wi-Fi network the booth creates itself, independent of your venue Wi-Fi</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/connecting-your-kiosk/cloud-registration">
            Cloud registration
          </Link>
          . Now that the booth is online, link it to your BoothIQ cloud
          account.
        </li>
        <li>
          <Link href="/docs/connecting-your-kiosk/testing-your-connection">
            Testing your connection
          </Link>
          . Confirm everything is working end-to-end.
        </li>
      </ul>
    </DocsLayout>
  );
}
