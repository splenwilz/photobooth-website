import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Managing your business info and logo — BoothIQ Docs",
  description:
    "Set the business name, location, welcome subtitle, and logo that appear on the welcome screen and prints.",
};

const HREF = "/docs/running-your-booth/managing-business-info";

const TOC = [
  { id: "what-you-can-customize", label: "What you can customize" },
  { id: "business-name", label: "Changing the business name" },
  { id: "location-subtitle", label: "Setting the location and welcome subtitle" },
  { id: "logo", label: "Uploading a logo" },
  { id: "show-logo-prints", label: "\"Show logo on prints\" toggle" },
  { id: "sync-from-cloud", label: "Sync from cloud" },
  { id: "test-print", label: "Test your changes on a print" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "privacy", label: "Privacy notes" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function ManagingBusinessInfoPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Managing your business info and logo</h1>

      <p>
        Your business name, location, welcome subtitle, and logo all
        live in the <strong>Settings</strong> tab. They show up on the
        welcome screen and (optionally) on every print. This article
        walks through how to update them.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators setting up
        branding for the first time, rebranding, or moving the booth
        to a new venue.
      </p>

      <h2 id="what-you-can-customize">What you can customize</h2>

      <p>In the <strong>Business Information</strong> card of the Settings tab:</p>

      <ul>
        <li><strong>Business Name.</strong> Text shown on the welcome screen</li>
        <li><strong>Location.</strong> Your venue or city, also shown on the welcome screen</li>
        <li><strong>Welcome Subtitle.</strong> An optional tagline under the business name</li>
        <li><strong>Business Logo.</strong> An image (PNG/JPG) shown on the welcome screen and (optionally) on prints</li>
        <li><strong>Show logo on prints toggle.</strong> Controls whether the logo prints on the photos</li>
        <li><strong>Sync from cloud toggle.</strong> When on, your business info comes from the cloud instead of being editable locally</li>
      </ul>

      <h2 id="business-name">Changing the business name</h2>

      <ol>
        <li>Open admin → <strong>Settings</strong>.</li>
        <li>In the Business Information card, tap the <strong>Business Name</strong> field.</li>
        <li>The on-screen keyboard appears. Type your business name.</li>
        <li>Tap <strong>Save Settings</strong> at the top right of the page.</li>
        <li>Exit admin and confirm the new name appears on the welcome screen.</li>
      </ol>

      <p>The business name is shown prominently on the welcome screen. Make it short and recognizable.</p>

      <DocsScreenshot
        src="welcome-screen-with-business-name.png"
        alt="Welcome screen showing the business name prominently."
      />

      <h2 id="location-subtitle">Setting the location and welcome subtitle</h2>

      <p>
        The <strong>Location</strong> field is your venue or city
        (e.g. &quot;Main Street, Downtown&quot;). The{" "}
        <strong>Welcome Subtitle</strong> is an optional tagline (e.g.
        &quot;Fun memories since 1999&quot;).
      </p>

      <p>Both work the same way as Business Name:</p>

      <ol>
        <li>Open admin → Settings.</li>
        <li>Tap the field, type, <strong>Save Settings</strong>.</li>
        <li>Exit and confirm.</li>
      </ol>

      <p>Either field can be left blank if you don&apos;t want to show it. There may be visibility toggles for each field. Set them per your preference.</p>

      <h2 id="logo">Uploading a logo</h2>

      <ol>
        <li><strong>Save your logo as a PNG or JPG</strong> on a USB drive. Recommended dimensions: at least 400×400 pixels for sharpness on prints. Transparent PNG works best.</li>
        <li><strong>Plug the USB drive</strong> into a USB port on the kiosk.</li>
        <li>Open admin → <strong>Settings</strong>.</li>
        <li>In the Business Information card, find the <strong>Business Logo</strong> section.</li>
        <li>Tap <strong>Upload Logo</strong>. The helper text reads &quot;Upload from USB drive (PNG, JPG)&quot;.</li>
        <li>The file picker opens. Navigate to your logo on the USB drive and select it.</li>
        <li>The logo preview updates immediately.</li>
        <li>Tap <strong>Save Settings</strong> at the top of the page to commit.</li>
        <li>Exit admin and confirm the logo appears on the welcome screen.</li>
      </ol>

      <DocsScreenshot
        src="settings-logo-upload-section.png"
        alt="Settings logo upload section with preview box and Upload Logo button."
      />

      <h2 id="show-logo-prints">&quot;Show logo on prints&quot; toggle</h2>

      <p>
        The <strong>Show logo on prints</strong> toggle controls
        whether your uploaded logo is printed on every photo. When on,
        your logo is overlaid on every print. When off, prints are
        clean of branding.
      </p>

      <p>
        The exact position and size of the logo on prints is
        determined by the template. Most templates have a designated
        logo area. If you want logos in a different position, contact
        your BoothIQ point of contact.
      </p>

      <h2 id="sync-from-cloud">Sync from cloud</h2>

      <p>The <strong>Sync from cloud</strong> toggle changes where your business info comes from:</p>

      <ul>
        <li><strong>Off (default):</strong> business info is edited locally on the kiosk</li>
        <li><strong>On:</strong> business info is pulled from your BoothIQ cloud dashboard, and the local fields become read-only</li>
      </ul>

      <p>When the toggle is on, the helper text reads: &quot;When enabled, business info is synced from your BoothIQ cloud dashboard.&quot;</p>

      <p>Use cloud-managed business info when:</p>

      <ul>
        <li>You have multiple booths and want consistent branding across all of them</li>
        <li>You want to update branding once in the cloud and have it propagate to every booth automatically</li>
        <li>You want to lock down per-booth edits (operators on individual booths can&apos;t change branding by accident)</li>
      </ul>

      <p>Use local business info when:</p>

      <ul>
        <li>You only have one booth</li>
        <li>Each booth in your fleet has different branding (e.g. different venues with different logos)</li>
        <li>You don&apos;t have a cloud account or aren&apos;t using cloud sync</li>
      </ul>

      <h2 id="test-print">Test your changes on a print</h2>

      <p>After uploading a new logo or toggling Show Logo on Prints:</p>

      <ol>
        <li>Exit admin.</li>
        <li>Walk through a <strong>test session</strong> in Free Play mode (or with coins).</li>
        <li>Watch the print come out.</li>
        <li>Confirm the logo is on the print (or off, depending on your toggle).</li>
        <li>Confirm the logo position and size look right.</li>
      </ol>

      <p>If the logo looks wrong on the print, the issue might be the template (different templates put the logo in different places) or the logo file itself (transparency, aspect ratio, resolution).</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;ve configured business info correctly when:</p>

      <ul>
        <li>The welcome screen shows your business name, location, subtitle, and logo</li>
        <li>The logo appears on test prints (if &quot;Show logo on prints&quot; is on)</li>
        <li>Cloud sync is set the way you want it</li>
        <li>Settings save and persist across reboots</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Business name change isn&apos;t on the welcome screen.</strong></p>
      <p>Forgot to tap <strong>Save Settings</strong>. Save and exit/re-enter admin.</p>

      <p><strong>Logo upload button does nothing.</strong></p>
      <p>No USB drive plugged in. Plug a drive in and try again.</p>

      <p><strong>Logo upload says &quot;file not supported&quot;.</strong></p>
      <p>File isn&apos;t PNG or JPG. Convert to PNG or JPG and try again.</p>

      <p><strong>Logo shows on welcome but not on prints.</strong></p>
      <p>&quot;Show logo on prints&quot; toggle is off. Turn it on and save.</p>

      <p><strong>Logo shows on prints but in the wrong place.</strong></p>
      <p>Template-specific logo position. Try a different template; if every template puts it wrong, contact support.</p>

      <p><strong>Sync from cloud toggle re-enables itself.</strong></p>
      <p>Cloud has marked your booth as cloud-managed. Check your cloud dashboard.</p>

      <h2 id="privacy">Privacy notes</h2>

      <p>
        Your business name and location are not personal data, but
        they are visible to every customer who walks up to the booth.
        Make sure they&apos;re accurate and don&apos;t accidentally
        include private info (e.g. don&apos;t put a personal phone
        number in the welcome subtitle unless you want every customer
        to see it).
      </p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
          . UI tour.
        </li>
        <li>
          <Link href="/docs/customer-experience/welcome-screen">Welcome screen</Link>
          . How customers see your branding.
        </li>
      </ul>
    </DocsLayout>
  );
}
