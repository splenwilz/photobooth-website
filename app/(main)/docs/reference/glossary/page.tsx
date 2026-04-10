import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Glossary — BoothIQ Docs",
  description: "Plain-English definitions of BoothIQ-specific terms.",
};

const HREF = "/docs/reference/glossary";

const TOC = [
  { id: "terms", label: "Terms" },
  { id: "acronyms", label: "Acronyms" },
  { id: "related", label: "Related" },
] as const;

export default function GlossaryPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Glossary</h1>

      <h2 id="terms">Terms</h2>

      <ul>
        <li><strong>Admin.</strong> The hidden management dashboard for operators. Reached via 5-tap on the credits indicator + password</li>
        <li><strong>Admin user.</strong> An account with admin access. Two access levels: Master and User</li>
        <li><strong>Base price.</strong> The price for the first copy of a product (set in Products tab)</li>
        <li><strong>Booth ID.</strong> A UUID that uniquely identifies your kiosk in the BoothIQ cloud</li>
        <li><strong>BoothIQ.</strong> The brand name of this photobooth software / kiosk product</li>
        <li><strong>Cloud Sync.</strong> The bidirectional connection between the kiosk and your BoothIQ cloud account</li>
        <li><strong>Coin Operated.</strong> Operation mode where customers pay through the payment device (the default mode)</li>
        <li><strong>Composed photo.</strong> The final print with all the customer&apos;s photos placed inside the template&apos;s frame</li>
        <li><strong>Credit.</strong> The unit of payment on a BoothIQ booth. Coins/bills inserted by customers become credits</li>
        <li><strong>Credit balance.</strong> The current credits available on the booth, displayed on the welcome screen and managed in the Credits tab</li>
        <li><strong>Cross-sell.</strong> Offering a different product (e.g. 4×6) using photos from a strip session</li>
        <li><strong>DNP.</strong> Dai Nippon Printing. The manufacturer of the dye-sub photo printer used by BoothIQ</li>
        <li><strong>DNP DS-RX1hs.</strong> The specific thermal dye-sub printer model BoothIQ supports</li>
        <li><strong>Dye-sub.</strong> Dye-sublimation, the printing technology used by the DNP printer</li>
        <li><strong>Extra-copy price.</strong> The price for each additional copy of a product (set in Products tab)</li>
        <li><strong>Free Play.</strong> Operation mode where customers don&apos;t pay; the payment screen is skipped</li>
        <li><strong>Hardware pill.</strong> The small green/red status indicator for camera, printer, or PCB shown in the dashboard header</li>
        <li><strong>Hardware watchdog.</strong> A toggle in Settings that triggers the out-of-order screen when hardware fails</li>
        <li><strong>Heartbeat.</strong> A periodic message the booth sends to the cloud confirming it&apos;s alive</li>
        <li><strong>Layout.</strong> The geometry of photo areas on a template. Number, position, size, shape</li>
        <li><strong>License.</strong> Per-kiosk activation tied to the booth&apos;s hardware. Issued via the cloud</li>
        <li><strong>License banner.</strong> A strip at the top of the admin dashboard that appears when the license is in trial, grace, or expiring state</li>
        <li><strong>Master account.</strong> An admin user with full access to every tab and setting</li>
        <li><strong>Master password.</strong> A single-use emergency code (format: <code>EMR-*</code>) for accessing a locked-out kiosk. Issued by support</li>
        <li><strong>Multi-copy discount.</strong> A percentage off the extra-copy price when buying more than one (set in Products tab)</li>
        <li><strong>Operation mode.</strong> Coin Operated or Free Play (set in Settings tab)</li>
        <li><strong>Orphaned template.</strong> A template whose category was deleted or never assigned</li>
        <li><strong>PCB.</strong> The printed circuit board the payment device (coin/bill acceptor) sits on. Sometimes used as shorthand for the payment device itself</li>
        <li><strong>Phone Print.</strong> A product where customers upload photos from their phone over a local Wi-Fi network</li>
        <li><strong>Photo area.</strong> A region on a template where a customer photo is placed</li>
        <li><strong>Premium template.</strong> A template marked with a visual badge in the Templates tab</li>
        <li><strong>Pulse.</strong> A signal from the coin/bill acceptor representing one accepted denomination</li>
        <li><strong>Quick Registration.</strong> The 6-character code registration flow in the Cloud Sync tab</li>
        <li><strong>Recovery PIN.</strong> A 4-6 digit number for resetting your admin password if you forget it</li>
        <li><strong>Sales tab.</strong> The Sales &amp; Analytics tab in admin. Your default landing tab</li>
        <li><strong>Smartphone Print.</strong> The product type for the Phone Print feature</li>
        <li><strong>Sync from cloud (toggle).</strong> A Settings toggle that makes business info come from the cloud instead of being editable locally</li>
        <li><strong>Template.</strong> A visual design that frames customer photos on a print</li>
        <li><strong>Template carousel.</strong> The customer-facing screen where they pick a template, showing 4 templates at a time</li>
        <li><strong>USB warning banner.</strong> A reminder in admin that no USB drive is plugged in (when photo saving is enabled)</li>
        <li><strong>User account (lowercase).</strong> An admin user with the User access level. Limited to sales and credit operations</li>
        <li><strong>WatchDog.</strong> See &quot;hardware watchdog&quot;</li>
        <li><strong>Welcome screen.</strong> The first thing customers see. Looping video and START button</li>
      </ul>

      <h2 id="acronyms">Acronyms</h2>

      <ul>
        <li><strong>API.</strong> Application Programming Interface. The cloud&apos;s public interface</li>
        <li><strong>BoothIQ.</strong> The brand name</li>
        <li><strong>CSV.</strong> Comma-Separated Values. The export format for sales data</li>
        <li><strong>DNP.</strong> Dai Nippon Printing</li>
        <li><strong>EMR-.</strong> Prefix on cloud-issued emergency master passwords</li>
        <li><strong>PCB.</strong> Printed Circuit Board. Payment device hardware</li>
        <li><strong>PNG / JPG.</strong> Image file formats for the business logo</li>
        <li><strong>SDK.</strong> Software Development Kit. Used by BoothIQ to drive the DNP printer</li>
        <li><strong>SSID.</strong> The name of a Wi-Fi network</li>
        <li><strong>USB.</strong> Universal Serial Bus. Connects camera, printer, payment device internally</li>
        <li><strong>UPS.</strong> Uninterruptible Power Supply. Battery backup for the kiosk</li>
        <li><strong>WPA2 / WPA3.</strong> Wi-Fi security protocols</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <Link href="/docs/reference/tab-and-button-map">Tab and button map</Link>
          . Where these terms appear in the UI.
        </li>
      </ul>
    </DocsLayout>
  );
}
