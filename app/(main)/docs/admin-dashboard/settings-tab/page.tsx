import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Settings tab — BoothIQ Docs",
  description:
    "A tour of the Settings tab: business info, logo, photo storage, hardware watchdog, password change, license status.",
};

const HREF = "/docs/admin-dashboard/settings-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout", label: "Layout" },
  { id: "business-info", label: "Business Information card" },
  { id: "photo-storage", label: "Photo Storage card" },
  { id: "watchdog", label: "Hardware Error Screen card" },
  { id: "quick-actions", label: "Quick Actions card" },
  { id: "license-status", label: "License Status card" },
  { id: "security-users", label: "Security & Users card" },
  { id: "saving", label: "Saving" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function SettingsTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Settings tab</h1>

      <p>
        The <strong>Settings</strong> tab is where most one-time
        configuration lives. Business name, logo, the watchdog that
        controls the out-of-order screen, your own password, the
        license status display. They&apos;re all here.
      </p>

      <p>
        <strong>Who this is for:</strong> Every operator. You&apos;ll
        come here once during setup and a few more times for tune-ups.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>Set your <strong>business information</strong>: name, location, welcome subtitle, logo</li>
        <li>Toggle <strong>logo on prints</strong></li>
        <li>Toggle whether <strong>business info syncs from the cloud</strong> (so cloud admins manage it for you)</li>
        <li>Enable / disable <strong>photo saving to USB</strong></li>
        <li>Enable / disable the <strong>hardware watchdog</strong> that triggers the out-of-order screen</li>
        <li>View <strong>license status</strong></li>
        <li><strong>Test camera and printer</strong> from the sidebar Quick Actions</li>
        <li><strong>Change your own admin password</strong></li>
      </ul>

      <h2 id="layout">Layout</h2>

      <p>The Settings tab uses a two-column layout:</p>

      <ul>
        <li><strong>Left column (wider)</strong>. Main settings cards</li>
        <li><strong>Right column (narrower)</strong>. Sidebar with Quick Actions, License Status, and Security &amp; Users</li>
      </ul>

      <p>
        There&apos;s a <strong>Save Settings</strong> button at the
        top right of the page. The save button has a hint underneath
        that reads &quot;Saves business info, photo storage, and logo
        settings&quot;. Some toggles (like the hardware watchdog) save
        instantly. See the per-card notes below.
      </p>

      <DocsScreenshot
        src="settings-tab-full.png"
        alt="Settings tab with the two-column layout: main cards on the left, sidebar cards on the right."
      />

      <h2 id="business-info">Business Information card</h2>

      <p>Subtitle: &quot;Your business details and branding&quot;</p>

      <p>This card has the most fields. Top to bottom:</p>

      <h3>Sync from cloud toggle</h3>
      <p>
        A toggle labeled <strong>Sync from cloud</strong>. When
        enabled, the helper text reads &quot;When enabled, business
        info is synced from your BoothIQ cloud dashboard&quot;. Turn
        this on if you want the cloud dashboard to control your
        booth&apos;s business info. Useful for multi-booth operators
        who want consistent branding.
      </p>
      <p>
        When this toggle is <strong>on</strong>, the local fields
        below it become read-only. They&apos;re populated from the
        cloud and you edit them in the cloud dashboard instead.
      </p>

      <h3>Business Logo</h3>
      <p>
        A small logo preview box (80×80 pixels) and an{" "}
        <strong>Upload Logo</strong> button. The helper text under
        the button reads &quot;Upload from USB drive (PNG, JPG)&quot;.
      </p>
      <p>To change the logo:</p>
      <ol>
        <li>Save your new logo as a PNG or JPG file on a USB drive.</li>
        <li>Plug the USB drive into the kiosk.</li>
        <li>Tap <strong>Upload Logo</strong>.</li>
        <li>The file picker opens. Navigate to your logo on the USB drive and select it.</li>
        <li>The preview updates. Tap <strong>Save Settings</strong> at the top of the page to commit.</li>
      </ol>

      <h3>Business Name, Location, Welcome Subtitle</h3>
      <p>Three text fields:</p>
      <ul>
        <li><strong>Business Name</strong>. The name shown on the welcome screen and (optionally) on prints</li>
        <li><strong>Location</strong>. Your venue or address</li>
        <li><strong>Welcome Subtitle</strong>. An optional tagline shown under the business name on the welcome screen</li>
      </ul>
      <p>Tap any field to open the on-screen keyboard, type, then tap <strong>Save Settings</strong>.</p>

      <h3>Show logo on prints toggle</h3>
      <p>
        A toggle labeled <strong>Show logo on prints</strong>. When
        on, your business logo is overlaid on every print. When off,
        prints are clean of branding. The helper text reads
        &quot;Display your logo on all printed photos&quot;.
      </p>

      <DocsScreenshot
        src="settings-business-info-card.png"
        alt="Business Information card with sync toggle, logo, name, location, subtitle, and 'show logo on prints' toggle."
      />

      <h2 id="photo-storage">Photo Storage card</h2>

      <p>
        This card has a single toggle: <strong>Save captured photos</strong>.
        The helper text reads &quot;Save photos to USB drive or local
        storage after each session&quot;.
      </p>

      <p>
        When on, BoothIQ saves a copy of each customer&apos;s composed
        photo to a USB drive (if one is plugged in) or to local
        storage. This is useful if your venue requires photo records
        for any reason. When off, photos exist only long enough to
        print and are then discarded.
      </p>

      <DocsCallout type="note">
        If you turn this on but don&apos;t have a USB drive plugged
        in, BoothIQ shows a <strong>USB Warning Banner</strong> at the
        top of every admin tab to remind you. Plug a USB drive in to
        clear it, or turn the setting off if you don&apos;t need photo
        saving.
      </DocsCallout>

      <h2 id="watchdog">Hardware Error Screen card</h2>

      <p>
        A toggle labeled <strong>Enable hardware watchdog</strong>{" "}
        with the helper text &quot;Shows &apos;Out of Order&apos;
        screen when printer, camera, or PCB is offline&quot;. The hint
        at the bottom of the card reads &quot;This setting applies
        immediately when toggled&quot;. Meaning unlike the other
        settings, you don&apos;t have to tap Save Settings for this to
        take effect.
      </p>

      <p>
        When on, the booth automatically shows an out-of-order screen
        to customers if any of the three pieces of hardware (printer,
        camera, PCB) goes offline. This protects you from customers
        paying for sessions that can&apos;t be completed.
      </p>

      <p>
        When off, the booth keeps showing the normal customer flow
        even if hardware fails. Useful for troubleshooting,{" "}
        <strong>not</strong> for production.
      </p>

      <DocsCallout type="warning">
        <strong>Leave this on in production.</strong> Turning it off
        should only be temporary while you&apos;re diagnosing a
        hardware issue.
      </DocsCallout>

      <DocsScreenshot
        src="settings-hardware-watchdog-card.png"
        alt="Hardware Error Screen card with the watchdog enable toggle."
      />

      <h2 id="quick-actions">Quick Actions card (sidebar)</h2>

      <p>Subtitle: &quot;System tools and tests&quot;</p>

      <p>Two quick test buttons:</p>

      <ul>
        <li><strong>Test Camera</strong>. Runs a camera test (similar to the one in the Diagnostics tab)</li>
        <li><strong>Test Print</strong>. Sends a test print to the DNP printer</li>
      </ul>

      <p>Use these for a fast sanity check without navigating to the Diagnostics tab.</p>

      <h2 id="license-status">License Status card (sidebar)</h2>

      <p>Subtitle: &quot;Your license information&quot;</p>

      <p>
        Shows the current license state: Active, Trial, Grace,
        Expired, etc. Along with any details (expiration date,
        subscription tier). For full details on what each state means,
        see{" "}
        <Link href="/docs/connecting-your-kiosk/license-and-activation">
          License and activation
        </Link>
        .
      </p>

      <h2 id="security-users">Security &amp; Users card (sidebar)</h2>

      <p>Subtitle: &quot;Password and user management&quot;</p>

      <p>This is where you change your own password.</p>

      <h3>Change My Password</h3>
      <p>
        A row labeled &quot;Change My Password&quot; with a{" "}
        <strong>Change</strong> link on the right. Tap{" "}
        <strong>Change</strong> to expand the password change form,
        which has three password fields:
      </p>
      <ul>
        <li><strong>Current Password</strong></li>
        <li><strong>New Password</strong></li>
        <li><strong>Confirm New Password</strong></li>
      </ul>
      <p>And two buttons:</p>
      <ul>
        <li><strong>Cancel</strong>. Collapse the form without saving</li>
        <li><strong>Update</strong>. Commit the password change</li>
      </ul>
      <p>
        If your new and confirm don&apos;t match, an error message
        appears in red between the fields and the buttons.
      </p>

      <DocsCallout type="note">
        The on-screen virtual keyboard appears automatically when you
        tap any of the password fields. The virtual keyboard hides
        automatically when the form is closed.
      </DocsCallout>

      <DocsScreenshot
        src="settings-change-password-form.png"
        alt="Change password form expanded with current, new, and confirm fields."
      />

      <h2 id="saving">Saving</h2>

      <p>
        For most fields on this tab, your changes are not committed
        until you tap the <strong>Save Settings</strong> button at the
        top right. Exceptions:
      </p>

      <ul>
        <li><strong>Hardware watchdog toggle</strong>. Saves instantly (see the hint on the card)</li>
        <li><strong>Sync from cloud toggle</strong>. Saves instantly</li>
        <li><strong>Password change</strong>. Saves when you tap <strong>Update</strong> in the password form</li>
      </ul>

      <p>If you make changes and try to navigate away without saving, your changes are discarded.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You can use the Settings tab effectively when you can:</p>

      <ul>
        <li>Update your business name and see it on the welcome screen</li>
        <li>Upload a new logo and see it on a test print</li>
        <li>Toggle the hardware watchdog on and off</li>
        <li>Change your own admin password</li>
        <li>Read your license status</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Business name change doesn&apos;t appear on welcome screen.</strong></p>
      <p>You forgot to tap <strong>Save Settings</strong>. Tap Save and exit/re-enter admin.</p>

      <p><strong>Upload Logo button does nothing.</strong></p>
      <p>No USB drive plugged in, or the file isn&apos;t a PNG/JPG. Plug a USB drive in, save the logo as PNG or JPG, retry.</p>

      <p><strong>Sync from cloud toggle re-enables itself.</strong></p>
      <p>The cloud has marked your booth as cloud-managed. Check your cloud dashboard&apos;s settings for this booth.</p>

      <p><strong>Password change rejected with &quot;Current password incorrect&quot;.</strong></p>
      <p>Caps lock or typo on the virtual keyboard. Try again carefully.</p>

      <p><strong>Out-of-order screen keeps appearing.</strong></p>
      <p>Hardware watchdog is on <strong>and</strong> a piece of hardware is actually offline. Either fix the hardware or temporarily turn off the watchdog while diagnosing.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Hardware test and status, in more depth than the Quick Actions buttons.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/cloud-sync-tab">Cloud Sync tab</Link>
          . Where business info syncing actually happens.
        </li>
        <li><strong>Security › Admin account best practices</strong> <em>(coming soon)</em>. How to pick good passwords and PINs.</li>
      </ul>
    </DocsLayout>
  );
}
