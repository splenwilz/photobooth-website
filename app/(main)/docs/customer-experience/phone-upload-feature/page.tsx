import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Phone upload feature — BoothIQ Docs",
  description:
    "The Phone Print flow: customers uploading photos from their phone over a local Wi-Fi network the booth creates.",
};

const HREF = "/docs/customer-experience/phone-upload-feature";

const TOC = [
  { id: "the-flow", label: "The flow at a glance" },
  { id: "qr-and-wifi", label: "The QR code and Wi-Fi" },
  { id: "upload-page", label: "The upload page" },
  { id: "phone-image-editor", label: "The Phone Image Editor" },
  { id: "after-editor", label: "After the editor" },
  { id: "idle-behavior", label: "Idle behavior" },
  { id: "what-you-control", label: "What you control" },
  { id: "common-customer-issues", label: "Common customer issues" },
  { id: "firewall", label: "Windows Firewall rule" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PhoneUploadPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Phone upload feature</h1>

      <p>
        <strong>Phone Print</strong> (also called Smartphone Print) is
        a separate product where customers upload photos{" "}
        <em>from their phone</em> to the kiosk and print them on the
        booth&apos;s printer. There&apos;s no app to install. The booth
        creates its own local Wi-Fi network and serves a small upload
        web page directly to the customer&apos;s phone.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to
        understand how Phone Print works and how to support customers
        using it.
      </p>

      <h2 id="the-flow">The flow at a glance</h2>

      <ol>
        <li>Customer picks <strong>Smartphone Print</strong> on the product selection screen.</li>
        <li>The booth shows a <strong>Phone Print</strong> screen with a <strong>QR code</strong> and Wi-Fi instructions.</li>
        <li>Customer <strong>scans the QR code</strong> with their phone (most phone cameras handle this directly).</li>
        <li>The phone <strong>connects to the booth&apos;s local Wi-Fi network</strong> and opens a small upload web page.</li>
        <li>Customer <strong>picks photos from their phone</strong> and uploads them.</li>
        <li>Each upload appears on the kiosk screen as it arrives.</li>
        <li>Customer goes back to the kiosk and uses the <strong>Phone Image Editor</strong> to position the photo inside the print frame.</li>
        <li>Customer pays (or skips in Free Play).</li>
        <li>Print produces.</li>
      </ol>

      <DocsScreenshot
        src="phone-print-qr-screen.png"
        alt="Phone Print screen showing a QR code and Wi-Fi instructions for the customer to scan."
      />

      <h2 id="qr-and-wifi">The QR code and Wi-Fi</h2>

      <p>When the customer reaches the Phone Print screen:</p>

      <ul>
        <li>The booth <strong>creates a local Wi-Fi hotspot</strong> (no internet required)</li>
        <li>It runs an <strong>embedded web server</strong> (port 8080) on its own</li>
        <li>It generates a <strong>QR code</strong> that encodes the Wi-Fi network info <strong>and</strong> the upload URL</li>
        <li>The QR code is large and easy to scan from arm&apos;s length</li>
      </ul>

      <p>When the customer scans the QR code with their phone camera:</p>

      <ul>
        <li>Most modern phones recognize the Wi-Fi info inside the QR code and offer to connect</li>
        <li>After connecting, the phone opens the upload page automatically</li>
        <li>On older phones, the customer may have to connect manually using the SSID shown on the screen</li>
      </ul>

      <DocsCallout type="note">
        <strong>The Phone Print Wi-Fi network is separate from your
        venue Wi-Fi.</strong> It&apos;s created and managed by the
        kiosk itself. Connecting your booth to your venue Wi-Fi (in
        the WiFi tab) does <strong>not</strong> affect Phone Print, and
        vice versa.
      </DocsCallout>

      <h2 id="upload-page">The upload page</h2>

      <p>The upload page on the customer&apos;s phone is a simple web form:</p>

      <ul>
        <li>A &quot;Pick photo&quot; button that opens the phone&apos;s photo library</li>
        <li>An upload progress indicator</li>
        <li>A &quot;Done&quot; button to confirm</li>
      </ul>

      <p>
        The customer picks one or more photos and they upload to the
        kiosk. As each one arrives, the kiosk screen updates to show
        the latest received image.
      </p>

      <h2 id="phone-image-editor">The Phone Image Editor</h2>

      <p>
        After the upload, the customer goes back to the kiosk and uses
        the <strong>Phone Image Editor</strong> to position the
        uploaded photo inside the print frame. This editor lets them:
      </p>

      <ul>
        <li><strong>Crop and zoom</strong> (up to 4× zoom)</li>
        <li><strong>Rotate</strong> (0, 90, 180, 270 degrees)</li>
        <li>
          Pick a <strong>margin fill mode</strong>:
          <ul>
            <li><strong>White</strong>. Solid white background where the photo doesn&apos;t fill the frame</li>
            <li><strong>Blur</strong>. Blurred photo background fills the margins</li>
            <li><strong>Stretch</strong>. The photo is stretched to fill the frame</li>
          </ul>
        </li>
      </ul>

      <p>The target output dimensions at 300 DPI are:</p>

      <ul>
        <li><strong>4×6 print</strong> → 1803 × 1206 pixels</li>
        <li><strong>Strip</strong> → 603 × 1803 pixels</li>
      </ul>

      <p>
        The editor handles the math automatically. The customer just
        drags and pinches.
      </p>

      <DocsScreenshot
        src="phone-image-editor.png"
        alt="Phone Image Editor with crop, zoom, and margin fill mode controls."
      />

      <h2 id="after-editor">After the editor</h2>

      <p>
        Once the customer is happy with the layout, they tap{" "}
        <strong>Done</strong> and the booth advances to the same
        payment → printing → thank-you flow as the regular product
        flows. The print comes out of the same DNP printer.
      </p>

      <h2 id="idle-behavior">Idle behavior</h2>

      <p>
        The Phone Print screen has a longer timeout (about{" "}
        <strong>180 seconds</strong>) because customers need time to
        scan the QR, connect, find a photo on their phone, and upload.
        The Phone Image Editor has its own timeout (about{" "}
        <strong>120 seconds</strong>).
      </p>

      <h2 id="what-you-control">What you control</h2>

      <p>
        You don&apos;t have many knobs for Phone Print. What you can
        control:
      </p>

      <ul>
        <li><strong>Whether the product is enabled</strong> in the Products tab</li>
        <li><strong>The base price</strong> in the Products tab</li>
        <li><strong>Whether your venue Wi-Fi is on or off.</strong> Doesn&apos;t affect Phone Print itself, since Phone Print uses its own local hotspot</li>
      </ul>

      <h2 id="common-customer-issues">Common customer issues</h2>

      <h3>&quot;I can&apos;t find the Wi-Fi network on my phone&quot;</h3>
      <p>Some phones don&apos;t auto-connect when scanning the QR code. Tell the customer to:</p>
      <ol>
        <li>Open their phone&apos;s Wi-Fi settings</li>
        <li>Look for the network name (SSID) shown on the kiosk screen</li>
        <li>Tap to connect. There&apos;s no password</li>
        <li>Then open the upload URL shown on the screen</li>
      </ol>

      <h3>&quot;The QR code won&apos;t scan&quot;</h3>
      <p>The phone camera may need to be a few inches further or closer. Most modern Android and iOS cameras handle Wi-Fi QR codes natively in the camera app. Older phones may need a dedicated QR scanner app.</p>

      <h3>&quot;I can&apos;t upload, it says I&apos;m not connected to the internet&quot;</h3>
      <p>That&apos;s expected. The kiosk&apos;s Phone Print Wi-Fi is <strong>not</strong> connected to the internet. It&apos;s a local network for transferring the photo. Some phones complain about this, but the upload still works. Reassure the customer.</p>

      <h3>&quot;The photo uploaded but I don&apos;t see it on the kiosk screen&quot;</h3>
      <p>Wait a few seconds. Large photos take longer. If it really doesn&apos;t appear after 30 seconds, the upload may have failed. Try uploading a smaller version.</p>

      <h3>&quot;I uploaded the wrong photo&quot;</h3>
      <p>They can upload another one. Each new upload replaces the previous one until they confirm.</p>

      <h2 id="firewall">Windows Firewall rule</h2>

      <p>
        The BoothIQ installer adds an inbound Windows Firewall rule
        called <strong>&quot;BoothIQ Photo Upload Server&quot;</strong>{" "}
        scoped to the local subnet only. This rule lets the
        customer&apos;s phone reach the upload page without exposing
        the booth to the public internet. Operators don&apos;t need to
        manage this rule. It&apos;s installed automatically.
      </p>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>Phone Print isn&apos;t working at all.</strong></p>
      <ul>
        <li>Confirm the product is enabled in the Products tab.</li>
        <li>The kiosk needs a Wi-Fi adapter to create the local hotspot. Open the WiFi tab and confirm the adapter is <strong>Active</strong>.</li>
        <li>See <strong>Phone upload not working</strong> <em>(coming soon)</em>.</li>
      </ul>

      <p><strong>Can the customer email themselves the photo afterwards?</strong></p>
      <p>No, that&apos;s the opposite direction. Phone Print is for uploading <strong>to</strong> the kiosk, not for sending photos <strong>from</strong> the kiosk to the customer&apos;s email or phone.</p>

      <p><strong>Can multiple customers use Phone Print at the same time?</strong></p>
      <p>No, only one Phone Print session at a time on a single kiosk. The next customer has to wait until the current session is done.</p>

      <p><strong>A customer says the upload was slow.</strong></p>
      <p>The local Wi-Fi hotspot is fine for typical phone photos (a few MB each). Very large photos (high-res panoramas, RAW files) take longer.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/welcome-screen">
            Welcome screen
          </Link>
          . Where the next customer starts.
        </li>
        <li><strong>Phone upload not working</strong> <em>(coming soon)</em>. When something goes wrong.</li>
        <li><strong>Products tab</strong> <em>(coming soon)</em>. Where you enable / disable Phone Print.</li>
      </ul>
    </DocsLayout>
  );
}
