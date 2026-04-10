import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Phone upload not working — BoothIQ Docs",
  description:
    "Customer can't connect to the kiosk hotspot, can't upload, or the upload page won't load.",
};

const HREF = "/docs/troubleshooting/phone-upload-not-working";

const TOC = [
  { id: "how-it-works", label: "How Phone Print is supposed to work" },
  { id: "step-1", label: "Step 1: WiFi adapter active" },
  { id: "step-2", label: "Step 2: Phone Print enabled" },
  { id: "step-3", label: "Step 3: Firewall rule" },
  { id: "step-4", label: "Step 4: Customer can't scan QR" },
  { id: "step-5", label: "Step 5: Phone won't connect" },
  { id: "step-6", label: "Step 6: Upload page won't open" },
  { id: "step-7", label: "Step 7: Upload fails" },
  { id: "step-8", label: "Step 8: Photo doesn't appear" },
  { id: "step-9", label: "Step 9: Works for some, not others" },
  { id: "support", label: "When to call support" },
  { id: "workarounds", label: "Workarounds for unhappy customers" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PhoneUploadNotWorkingPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Phone upload not working</h1>

      <p>
        The Phone Print feature creates a local Wi-Fi hotspot and
        serves an upload web page to the customer&apos;s phone. When
        something breaks in this chain (the QR code, the hotspot, the
        web server, the upload itself), customers report it as &quot;I
        can&apos;t get my photo on the kiosk.&quot;
      </p>

      <p><strong>Symptom:</strong> Customer can&apos;t scan the QR, can&apos;t connect to the booth&apos;s Wi-Fi, can&apos;t open the upload page, or upload fails.</p>

      <h2 id="how-it-works">How Phone Print is supposed to work</h2>

      <p>A quick recap of the flow so you know what to check:</p>

      <ol>
        <li>The kiosk <strong>creates a local Wi-Fi network</strong> (a hotspot) using its built-in Wi-Fi adapter.</li>
        <li>The kiosk <strong>runs a small web server</strong> on its own (port 8080).</li>
        <li>The kiosk <strong>shows a QR code</strong> that encodes the Wi-Fi info AND the upload URL.</li>
        <li>The customer&apos;s phone <strong>scans the QR code</strong>.</li>
        <li>The phone <strong>connects to the kiosk&apos;s Wi-Fi network</strong>.</li>
        <li>The phone <strong>opens the upload page</strong> in a browser.</li>
        <li>The customer <strong>picks photos and uploads</strong>.</li>
        <li>The kiosk <strong>shows received photos</strong> on screen.</li>
      </ol>

      <p>If any step fails, the customer can&apos;t print. Walk through the steps to find which one.</p>

      <h2 id="step-1">Step 1: Confirm the WiFi adapter is active</h2>

      <p>Phone Print needs a working Wi-Fi adapter on the kiosk:</p>

      <ol>
        <li>Open admin → <strong>WiFi</strong> tab.</li>
        <li>Look at the <strong>WiFi Adapter</strong> card.</li>
        <li>If it says <strong>Active</strong>, you&apos;re good.</li>
        <li>If it says <strong>Inactive</strong> or &quot;No WiFi adapter detected&quot;, the adapter is offline. Power-cycle the kiosk and check again.</li>
        <li>If it&apos;s still offline after a power cycle, contact support. Phone Print won&apos;t work without a wireless adapter.</li>
      </ol>

      <h2 id="step-2">Step 2: Confirm Phone Print is enabled</h2>

      <ol>
        <li>Open admin → <strong>Products</strong> tab.</li>
        <li>Find the <strong>Smartphone Print</strong> product card.</li>
        <li>Confirm it&apos;s <strong>enabled</strong> (toggle on).</li>
        <li>If it&apos;s disabled, enable it and tap <strong>Save</strong>.</li>
      </ol>

      <p>If Phone Print is disabled, the customer won&apos;t even see the option on the product selection screen.</p>

      <h2 id="step-3">Step 3: Check the firewall rule</h2>

      <p>The BoothIQ installer adds a Windows Firewall rule called <strong>&quot;BoothIQ Photo Upload Server&quot;</strong> scoped to the local subnet. This rule should be present from day one. Operators don&apos;t manage it.</p>

      <p>If you suspect the firewall rule is missing or has been removed, contact support. There&apos;s no operator-side way to recreate it.</p>

      <h2 id="step-4">Step 4: Customer can&apos;t scan the QR code</h2>

      <p>The customer is at the Phone Print screen but their phone won&apos;t scan the QR code:</p>

      <ul>
        <li><strong>Phone camera too far / too close.</strong> Tell the customer to hold the phone about 20-30 cm (8-12 inches) from the screen.</li>
        <li><strong>Phone camera is dirty.</strong> Have them wipe the lens.</li>
        <li><strong>Older phone.</strong> Some older Android phones don&apos;t scan QR codes natively in the camera app. They may need a dedicated QR scanner app.</li>
        <li><strong>iPhone-specific:</strong> the customer may need to tap the on-screen notification when the camera detects the QR.</li>
        <li><strong>Glare on the kiosk screen.</strong> Adjust the booth&apos;s position relative to lighting, or have the customer angle their phone to avoid glare.</li>
      </ul>

      <p>If multiple customers in a row can&apos;t scan, check the QR display on the kiosk. The QR may be too small or the screen may have a smudge over it.</p>

      <h2 id="step-5">Step 5: Customer scanned the QR but their phone won&apos;t connect to the Wi-Fi</h2>

      <p>The phone recognized the QR code as Wi-Fi info but isn&apos;t joining the network:</p>

      <ul>
        <li><strong>Customer is already connected to a different Wi-Fi.</strong> Tell them to disconnect from the venue&apos;s Wi-Fi temporarily and try again.</li>
        <li><strong>Customer&apos;s phone is in airplane mode.</strong> Tell them to turn off airplane mode.</li>
        <li><strong>Phone shows &quot;no internet, do you want to stay connected?&quot;</strong> This is normal. The kiosk hotspot has no internet, just a local upload page. Tell them to <strong>stay connected</strong>. Some phones (especially Android) try to drop the connection when there&apos;s no internet.</li>
        <li><strong>Phone is on cellular data only.</strong> Tell them to enable Wi-Fi.</li>
      </ul>

      <h2 id="step-6">Step 6: Phone is connected but the upload page won&apos;t open</h2>

      <p>The customer is on the kiosk&apos;s Wi-Fi but the upload page isn&apos;t loading in their browser:</p>

      <ul>
        <li><strong>Wait a few seconds</strong> after connecting before opening the URL.</li>
        <li><strong>Use the URL shown on the kiosk screen exactly.</strong> Copy/type the URL from the kiosk&apos;s Phone Print screen instead of the QR.</li>
        <li><strong>Try a different browser</strong> on the phone (Chrome, Safari, Firefox).</li>
        <li><strong>Restart the kiosk&apos;s Phone Print session.</strong> Have the customer go back to the welcome screen and start over.</li>
      </ul>

      <h2 id="step-7">Step 7: Upload starts but fails</h2>

      <p>The customer picks a photo and the upload begins but never completes:</p>

      <ul>
        <li><strong>Photo is huge</strong> (panorama, RAW, 50+ MB). The local upload should still work but slowly. Be patient.</li>
        <li><strong>Phone moved out of range</strong> of the kiosk Wi-Fi. Tell them to stay close to the booth during upload.</li>
        <li><strong>Phone went to sleep during upload.</strong> Tell them to keep the phone awake.</li>
      </ul>

      <p>If multiple customers can&apos;t upload regardless of phone, the kiosk&apos;s upload service may be wedged. Power-cycle the kiosk.</p>

      <h2 id="step-8">Step 8: Upload succeeded but the kiosk doesn&apos;t show the photo</h2>

      <p>The customer uploaded but the kiosk screen doesn&apos;t update:</p>

      <ol>
        <li>Wait 10-15 seconds. Large photos take time to process.</li>
        <li>If the kiosk still doesn&apos;t show the photo, the customer may need to upload again.</li>
        <li>If repeat uploads also don&apos;t show, end the customer&apos;s session and start over.</li>
      </ol>

      <h2 id="step-9">Step 9: Phone Print works for some customers but not others</h2>

      <p>Phone Print&apos;s reliability depends heavily on the customer&apos;s phone, OS version, and how recent it is:</p>

      <ul>
        <li><strong>iPhone (iOS 14+):</strong> generally works well</li>
        <li><strong>Recent Android (Android 10+):</strong> generally works well</li>
        <li><strong>Older Android (Android 8 or earlier):</strong> may not auto-connect from QR; customer may need to connect Wi-Fi manually</li>
        <li><strong>Locked-down corporate phones:</strong> may refuse to connect to local hotspots</li>
      </ul>

      <p>Don&apos;t promise Phone Print will work with every phone. It works for the majority but not 100%.</p>

      <h2 id="support">When to call support</h2>

      <p>Contact support if:</p>

      <ul>
        <li>The Phone Print feature has stopped working entirely (no customer can use it)</li>
        <li>The WiFi adapter is genuinely missing on a kiosk that&apos;s supposed to have it</li>
        <li>The firewall rule is gone and you can&apos;t restore it</li>
        <li>The upload page returns server errors (500, etc.) consistently</li>
      </ul>

      <h2 id="workarounds">Workarounds for unhappy customers</h2>

      <p>If a customer can&apos;t get Phone Print to work, offer them:</p>

      <ul>
        <li><strong>A retake using the booth&apos;s camera instead.</strong> They might get a better photo on the booth&apos;s camera anyway, and they&apos;ll feel less frustrated.</li>
        <li><strong>Switch to Free Play and let them try again</strong> without paying.</li>
      </ul>

      <h2 id="verify">Verify it worked</h2>

      <p>Phone Print is healthy when:</p>

      <ul>
        <li>The WiFi Adapter card in admin says Active</li>
        <li>The Smartphone Print product is enabled</li>
        <li>Most customers can scan, connect, and upload without help</li>
        <li>A test you do yourself with your own phone works</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/phone-upload-feature">
            Phone upload feature
          </Link>
          . How the customer flow is supposed to work.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/wifi-tab">WiFi tab</Link>
          . Where to check the wireless adapter.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/products-tab">Products tab</Link>
          . Where Phone Print is enabled or disabled.
        </li>
      </ul>
    </DocsLayout>
  );
}
