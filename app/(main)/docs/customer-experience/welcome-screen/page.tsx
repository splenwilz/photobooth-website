import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Welcome screen — BoothIQ Docs",
  description:
    "The first screen customers see. What's on it, what triggers it, and what operators should know.",
};

const HREF = "/docs/customer-experience/welcome-screen";

const TOC = [
  { id: "whats-on-screen", label: "What's on the screen" },
  { id: "what-customers-do", label: "What customers do" },
  { id: "behind-the-scenes", label: "What the booth does behind the scenes" },
  { id: "customizing", label: "Customizing the welcome screen" },
  { id: "five-tap", label: "The hidden 5-tap admin sequence" },
  { id: "how-long", label: "How long the booth stays here" },
  { id: "what-to-tell", label: "What to tell customers" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "what-can-go-wrong", label: "What can go wrong" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function WelcomeScreenPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Welcome screen</h1>

      <p>
        The welcome screen is the first thing a customer sees when they
        walk up to your kiosk. It&apos;s also the screen the booth
        returns to after every session, after every timeout, and after
        every error recovery. So it&apos;s the most-seen screen in
        BoothIQ.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to know
        what&apos;s happening on the welcome screen and what they can
        customize.
      </p>

      <h2 id="whats-on-screen">What&apos;s on the screen</h2>

      <p>When the booth is idle, the welcome screen shows:</p>

      <ul>
        <li>A <strong>looping background video</strong> (BoothIQ ships with a default video; ask support if you want a custom one for your venue)</li>
        <li><strong>Soft background music</strong> that loops with the video</li>
        <li>A <strong>glowing animated START button</strong> in the center</li>
        <li>A <strong>friendly voice prompt</strong> that plays periodically inviting the customer to tap the screen</li>
        <li>Your <strong>business name</strong> (if set in Settings)</li>
        <li>A <strong>welcome subtitle</strong> (if set in Settings)</li>
        <li>Your <strong>business logo</strong> (if uploaded in Settings)</li>
        <li>A small <strong>credits indicator</strong> in the corner showing the customer&apos;s current balance (or <strong>Free Play</strong>)</li>
        <li>The <strong>BoothIQ version number</strong> in the corner. Useful for support calls</li>
      </ul>

      <DocsScreenshot
        src="customer-welcome-screen.png"
        alt="The full welcome screen showing the business name, subtitle, logo, credits indicator, and a glowing START button."
      />

      <h2 id="what-customers-do">What customers do</h2>

      <p>
        The customer&apos;s only job on this screen is to{" "}
        <strong>tap START</strong>. That&apos;s it.
      </p>

      <p>
        When they tap, the booth advances to the{" "}
        <strong>product selection screen</strong> (see{" "}
        <Link href="/docs/customer-experience/choosing-a-product">
          Choosing a product
        </Link>
        ).
      </p>

      <h2 id="behind-the-scenes">What the booth does behind the scenes</h2>

      <p>While the welcome screen is showing, BoothIQ is doing a lot of background work:</p>

      <ul>
        <li>Polling hardware status (camera, printer, payment device) every few seconds</li>
        <li>Listening for credit pulses from the payment device</li>
        <li>Syncing with the cloud (if registered and online)</li>
        <li>Watching for the operator&apos;s 5-tap admin sequence on the credits indicator</li>
        <li>Replaying voice prompts on a timer</li>
        <li>Tracking idle time to know if it should advance to a screensaver state</li>
      </ul>

      <p>You don&apos;t have to worry about any of this. It just happens.</p>

      <h2 id="customizing">Customizing the welcome screen</h2>

      <p>
        The fields you can change as an operator (in{" "}
        <strong>Settings → Business Information</strong>):
      </p>

      <ul>
        <li><strong>Business Name</strong>: appears as a label on the welcome screen</li>
        <li><strong>Welcome Subtitle</strong>: an optional tagline under the business name</li>
        <li><strong>Business Logo</strong>: an image file (PNG/JPG) shown on the welcome screen</li>
        <li><strong>Show logo on prints</strong>: separate toggle that controls prints, not the welcome screen</li>
      </ul>

      <p>
        You can also toggle visibility of the business name, subtitle,
        and logo on the welcome screen independently. Useful if you want
        a clean welcome screen with no branding for one venue and a
        fully-branded one for another.
      </p>

      <DocsCallout type="note">
        The looping video and background music are{" "}
        <strong>not</strong> operator-configurable in the version of
        BoothIQ described in these docs. Contact your BoothIQ point of
        contact if you want a custom video for your venue.
      </DocsCallout>

      <h2 id="five-tap">The hidden 5-tap admin sequence</h2>

      <p>
        The credits indicator in the corner of the welcome screen is
        the trigger for admin access.{" "}
        <strong>Five quick taps within about 3 seconds</strong> open
        the admin login screen. See{" "}
        <strong>Admin Dashboard › Accessing admin mode</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <p>
        This is intentionally hidden from customers. There&apos;s no
        visible &quot;admin&quot; button anywhere on the welcome screen.
      </p>

      <h2 id="how-long">How long the booth stays on the welcome screen</h2>

      <p>
        Forever. Until a customer taps START. The welcome screen has no
        timeout. The animated button, the voice prompts, and the
        background video keep playing indefinitely.
      </p>

      <h2 id="what-to-tell">What to tell customers</h2>

      <p>
        Customers usually don&apos;t need any prompting on the welcome
        screen. The glowing button is obvious. But if a customer is
        hesitating, you can say:
      </p>

      <ul>
        <li>&quot;Just tap the START button when you&apos;re ready.&quot;</li>
        <li>&quot;It works like a vending machine. Pick what you want, take the photos, pay, and grab your prints.&quot;</li>
      </ul>

      <p>
        If a customer asks how much it costs <strong>before</strong>{" "}
        tapping START, point them at the credits indicator and tell
        them they&apos;ll see prices on the next screen.
      </p>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>The voice prompts are too loud, quiet, or annoying.</strong></p>
      <p>
        Voice prompt volume is tied to the system audio level on the
        kiosk PC. If you can&apos;t reach a comfortable level using the
        on-screen volume controls (or if there are no on-screen volume
        controls in your version), contact support.
      </p>

      <p><strong>The video stops playing after a few hours.</strong></p>
      <p>
        The welcome video is supposed to loop indefinitely. If it
        stops, that&apos;s a bug. Contact support with the{" "}
        <strong>Booth ID</strong> and the time it stopped.
      </p>

      <p><strong>The business name is wrong.</strong></p>
      <p>
        Update it in <strong>Settings → Business Information → Business Name</strong>.
        Don&apos;t forget to tap <strong>Save Settings</strong>.
      </p>

      <p><strong>I want different videos for different events.</strong></p>
      <p>
        Custom welcome videos are not an operator-configurable feature
        in the standard release. Talk to your BoothIQ contact.
      </p>

      <h2 id="what-can-go-wrong">What can go wrong on this screen</h2>

      <p>
        The welcome screen is designed to be the most reliable screen
        in the booth. It has the fewest moving parts. But occasionally:
      </p>

      <ul>
        <li><strong>The screen stays black after boot.</strong> That&apos;s a hardware issue, not a welcome screen issue. See <strong>Troubleshooting › Booth frozen or screen blank</strong> <em>(coming soon)</em>.</li>
        <li><strong>A hardware error overlay appears on top of the welcome screen.</strong> That means the hardware watchdog has detected a problem (camera, printer, or PCB offline). See <strong>Troubleshooting › Reading error screens</strong> <em>(coming soon)</em>.</li>
        <li><strong>The credits indicator shows the wrong balance.</strong> Open the <strong>Credits tab</strong> in admin and verify. See <strong>Credits tab</strong> <em>(coming soon)</em>.</li>
        <li><strong>A USB warning banner appears in admin</strong> (not on the welcome screen, but operator-visible). Plug in a USB drive or disable photo saving.</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/choosing-a-product">
            Choosing a product
          </Link>
          . The screen the customer sees after tapping START.
        </li>
      </ul>
    </DocsLayout>
  );
}
