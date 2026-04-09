import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "How it works — BoothIQ Docs",
  description:
    "A high-level walkthrough of the BoothIQ customer experience, screen by screen.",
};

const HREF = "/docs/getting-started/how-it-works";

const TOC = [
  { id: "customer-journey", label: "The customer journey at a glance" },
  { id: "step-1", label: "Step 1: Welcome screen" },
  { id: "step-2", label: "Step 2: Choose a product" },
  { id: "step-3", label: "Step 3: Pick a template" },
  { id: "step-4", label: "Step 4: Look at the camera" },
  { id: "step-5", label: "Step 5: Take photos" },
  { id: "step-6", label: "Step 6: Quick offer screen" },
  { id: "step-7", label: "Step 7: (Optional) Edit photos" },
  { id: "step-8", label: "Step 8: (Optional) Extra prints and cross-sell" },
  { id: "step-9", label: "Step 9: Pay" },
  { id: "step-10", label: "Step 10: Printing and thank you" },
  { id: "phone-print-flow", label: "The Phone Print flow" },
  { id: "what-happens-if-something-goes-wrong", label: "What happens if something goes wrong" },
  { id: "idle-and-timeout", label: "Idle and timeout behavior" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function HowItWorksPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>How it works</h1>

      <p>
        This article walks through what a customer sees, in order, from the
        moment they approach a BoothIQ kiosk to the moment they pick up
        their prints. It&apos;s a high-level tour — every screen has its own
        deeper article in the <strong>Customer Experience</strong> section{" "}
        <em>(coming soon)</em>.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators and installers who want
        to understand what BoothIQ actually does before they put one in a
        venue.
      </p>

      <h2 id="customer-journey">The customer journey at a glance</h2>

      {/* Visual flow diagram replacing the ASCII art block. Three rows
          of numbered pill steps with arrows between them, separated by
          down-arrows. Wrapped in a teal-tinted card with not-prose so
          it doesn't inherit paragraph spacing from prose styles. */}
      <div className="not-prose my-10 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#069494]/10 via-[#069494]/5 to-transparent border border-[#069494]/20 shadow-sm">
        {/* Row 1 — Welcome → Choose product → Pick template → Look at camera */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <FlowPill number={1}>Welcome</FlowPill>
          <FlowArrow />
          <FlowPill number={2}>Choose product</FlowPill>
          <FlowArrow />
          <FlowPill number={3}>Pick template</FlowPill>
          <FlowArrow />
          <FlowPill number={4}>Look at camera</FlowPill>
        </div>

        <FlowDown />

        {/* Row 2 — Take photos → (Optional) Edit → (Optional) Extra prints */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <FlowPill number={5}>Take photos</FlowPill>
          <FlowArrow />
          <FlowPill number={6} optional>Edit</FlowPill>
          <FlowArrow />
          <FlowPill number={7} optional>Extra prints</FlowPill>
        </div>

        <FlowDown />

        {/* Row 3 — Pay → Printing → Thank you → back to Welcome */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <FlowPill number={8}>Pay</FlowPill>
          <FlowArrow />
          <FlowPill number={9}>Printing</FlowPill>
          <FlowArrow />
          <FlowPill number={10}>Thank you</FlowPill>
        </div>

        {/* Loop-back hint */}
        <div className="flex justify-center mt-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--muted)]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
            </svg>
            <span className="font-medium">Back to Welcome screen</span>
          </div>
        </div>
      </div>

      <p>
        If the customer chooses <strong>Phone Print</strong> instead of
        strips or 4×6, they take a slightly different path through a Wi-Fi
        photo upload flow. We cover that at the end of this article.
      </p>

      <h2 id="step-1">Step 1: Welcome screen</h2>

      <p>
        The kiosk shows a looping background video, plays soft background
        music, and pulses a glowing <strong>START</strong> button. A friendly
        voice prompt repeats every so often inviting customers to tap the
        screen.
      </p>

      <p>This is also the screen the booth returns to whenever:</p>

      <ul>
        <li>A session finishes successfully.</li>
        <li>A customer walks away mid-session and the kiosk times out.</li>
        <li>The booth has been idle for a while.</li>
      </ul>

      <DocsCallout type="tip">
        Operators can see the BoothIQ version number in the corner of this
        screen — useful for support calls.
      </DocsCallout>

      <DocsScreenshot
        src="welcome.png"
        alt="The BoothIQ welcome screen with a glowing START button, looping background video, and credits indicator in the corner."
      />

      <h2 id="step-2">Step 2: Choose a product</h2>

      <p>
        After the customer taps <strong>START</strong>, they land on the
        product selection screen. They see a tile for each product you have
        enabled:
      </p>

      <ul>
        <li>
          <strong>Photo Strips</strong> — classic booth strips, usually with
          multiple shots per print.
        </li>
        <li>
          <strong>4×6 Photos</strong> — full-size 4×6 inch prints.
        </li>
        <li>
          <strong>Smartphone Print</strong> — uploads photos from the
          customer&apos;s phone over a local Wi-Fi network and prints them.
        </li>
      </ul>

      <p>
        Each tile shows the price. A small credits indicator at the top of
        the screen shows the customer how much they&apos;ve already loaded
        into the booth, or <strong>Free Play</strong> if you&apos;ve put
        the booth in free mode.
      </p>

      <DocsCallout type="note">
        If you disable a product in the admin dashboard, its tile disappears
        here automatically. There&apos;s no broken layout to clean up.
      </DocsCallout>

      <DocsScreenshot
        src="product-selection.png"
        alt="The product selection screen showing tiles for Photo Strips, 4×6 Photos, and Smartphone Print, each with a price."
      />

      <h2 id="step-3">Step 3: Pick a template</h2>

      <p>
        For strips and 4×6 the customer now picks a template — the layout
        and design that will frame their photos. Templates are organized by
        category (for example: <em>Classic</em>, <em>Birthday</em>,{" "}
        <em>Holiday</em>).
      </p>

      <p>For photo strips there are also three style modes:</p>

      <ul>
        <li>
          <strong>Templates</strong> — the design as-is.
        </li>
        <li>
          <strong>Black &amp; White</strong> — the same design with a B&amp;W
          filter applied.
        </li>
        <li>
          <strong>Color (with logo)</strong> — the design with your business
          logo placed in a designated area.
        </li>
      </ul>

      <p>
        Seasonal categories show and hide themselves automatically based on
        the date, so a Christmas category disappears in February without you
        doing anything.
      </p>

      <DocsScreenshot
        src="template-selection.png"
        alt="The template selection screen with category filters across the top and a carousel of template thumbnails."
      />

      <h2 id="step-4">Step 4: Look at the camera</h2>

      <p>
        A short instruction screen tells the customer where to stand and
        shows them a live preview from the camera so they can position
        themselves. This is mostly a &quot;get ready&quot; beat — the actual
        countdown happens on the next screen.
      </p>

      <h2 id="step-5">Step 5: Take photos</h2>

      <p>The capture screen runs the photo-taking sequence:</p>

      <ol>
        <li>The kiosk shows the live camera preview.</li>
        <li>
          A voice and on-screen counter call out{" "}
          <strong>3 … 2 … 1 … Smile</strong>.
        </li>
        <li>The screen briefly flashes white to confirm the photo was taken.</li>
        <li>The captured photo appears as a tab so the customer can see what they got.</li>
        <li>If the template needs more than one photo, the next countdown starts immediately.</li>
      </ol>

      <p>
        The customer can retake any photo before continuing. Templates can
        use rectangular, rounded, circular, heart, or petal-shaped photo
        areas, and BoothIQ handles the cropping for them.
      </p>

      <DocsScreenshot
        src="photo-capture.png"
        alt="The photo capture screen mid-countdown showing the live preview from the camera with '3...2...1...' overlay."
      />

      <h2 id="step-6">Step 6: Quick offer screen</h2>

      <p>
        After the last photo, the customer sees a preview of what their
        print will look like and three options:
      </p>

      <ul>
        <li>
          <strong>Edit</strong> — open the photo editor to add filters or
          stickers.
        </li>
        <li>
          <strong>Continue</strong> — accept it as-is and move on.
        </li>
        <li>
          <strong>Retake</strong> — start the capture sequence over.
        </li>
      </ul>

      <p>
        If the customer doesn&apos;t choose anything, the screen warns them
        and then auto-continues so the booth doesn&apos;t get stuck.
      </p>

      <h2 id="step-7">Step 7: (Optional) Edit photos</h2>

      <p>
        If the customer taps <strong>Edit</strong>, they get an
        Instagram-style editor with:
      </p>

      <ul>
        <li>Twenty-plus filter presets they can swipe through.</li>
        <li>A filter intensity slider.</li>
        <li>An emoji sticker overlay (drag, resize, rotate, up to ten stickers per photo).</li>
      </ul>

      <p>This is purely optional. Most customers skip it.</p>

      <h2 id="step-8">Step 8: (Optional) Extra prints and cross-sell</h2>

      <p>Next BoothIQ offers extra prints and cross-sell options:</p>

      <ul>
        <li>
          <strong>Extra copies</strong> of the same product, with
          operator-configurable discounts for buying more than one.
        </li>
        <li>
          <strong>Cross-sell to a 4×6</strong> when the customer originally
          ordered strips, using the same photos they just took.
        </li>
      </ul>

      <p>
        The screen shows a live preview of the cross-sell product so the
        customer knows what they&apos;re buying. Skipping this is fine.
      </p>

      <h2 id="step-9">Step 9: Pay</h2>

      <p>
        The payment screen shows the order summary, the template preview,
        the number of copies, and the total price. It then waits for the
        customer to load enough credits.
      </p>

      <p>Credits can come from:</p>

      <ul>
        <li>A coin or bill acceptor wired into the booth (this is the most common setup).</li>
        <li>A card reader, if your booth has one.</li>
        <li>Operator-added credits in the admin dashboard.</li>
        <li>
          <strong>Free Play</strong> mode, in which case payment is skipped
          entirely.
        </li>
      </ul>

      <p>
        As soon as the customer&apos;s credit balance meets or exceeds the
        total, the screen advances automatically to printing. If the customer
        changes their mind, they can hit <strong>Back</strong> to cancel.
      </p>

      <h2 id="step-10">Step 10: Printing and thank you</h2>

      <p>
        While the printer is producing the photo, the customer sees a
        friendly &quot;Printing your photos&quot; screen with an estimated
        time. BoothIQ sends the print job in the background, retries if the
        printer hiccups, and lets the customer move on to a final thank-you
        screen even if printing is still finishing.
      </p>

      <p>
        After the thank-you screen, the kiosk returns to the welcome screen,
        ready for the next customer.
      </p>

      <DocsScreenshot
        src="print-thank-you.png"
        alt="The print thank-you screen showing 'Printing your photos' with an estimated time and a progress indicator."
      />

      <h2 id="phone-print-flow">The Phone Print flow</h2>

      <p>
        If the customer picked <strong>Smartphone Print</strong> in Step 2,
        the kiosk skips the camera and shows a phone upload screen instead:
      </p>

      <ol>
        <li>
          The kiosk creates a <strong>local Wi-Fi network</strong> (no
          internet required).
        </li>
        <li>
          It displays a <strong>QR code</strong> the customer scans with
          their phone.
        </li>
        <li>
          The phone connects to that local Wi-Fi and opens a small upload
          web page hosted on the kiosk itself.
        </li>
        <li>The customer picks photos from their phone and uploads them.</li>
        <li>
          The kiosk shows the uploaded photo and lets the customer{" "}
          <strong>crop, zoom, and rotate</strong> it inside the print frame.
        </li>
        <li>
          From there the flow rejoins the normal{" "}
          <strong>Pay → Print → Thank you</strong> path.
        </li>
      </ol>

      <p>
        There is no app to install on the customer&apos;s phone — it&apos;s
        just a web page served by the kiosk over Wi-Fi.
      </p>

      <h2 id="what-happens-if-something-goes-wrong">
        What happens if something goes wrong
      </h2>

      <p>
        BoothIQ has dedicated error screens for the most common failures:
      </p>

      <ul>
        <li>
          <strong>Camera error screen</strong> if the camera disconnects or
          refuses to capture.
        </li>
        <li>
          <strong>Hardware error screen</strong> for printer or payment
          device failures.
        </li>
      </ul>

      <p>
        Both screens explain what&apos;s wrong, log the details, and let you
        retry without losing the customer&apos;s paid session. We cover these
        in detail in <strong>Troubleshooting › Reading error screens</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="idle-and-timeout">Idle and timeout behavior</h2>

      <p>
        BoothIQ aggressively returns to the welcome screen if a customer
        walks away. Most screens time out after 60-180 seconds with a warning
        before they reset, so the booth never gets stuck on an abandoned
        half-session. You&apos;ll find the exact timeout values in{" "}
        <strong>Reference › Timeouts and idle behavior</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/getting-started/system-requirements">
            Site and venue requirements
          </Link>{" "}
          — What your venue needs to provide for the kiosk.
        </li>
        <li>
          <Link href="/docs/getting-started/what-is-in-the-box">
            What&apos;s in the box
          </Link>{" "}
          — See the components a BoothIQ kiosk ships with.
        </li>
      </ul>
    </DocsLayout>
  );
}

/* ============================================
 * Inline flow-diagram primitives
 *
 * Used by the "customer journey at a glance" visual on this page only.
 * If we end up needing flow diagrams on other docs pages, lift these
 * into a shared `components/docs/DocsFlow.tsx` and re-export from
 * DocsLayout.
 * ============================================ */

function FlowPill({
  children,
  number,
  optional = false,
}: {
  children: React.ReactNode;
  number?: number;
  optional?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-[15px] font-semibold shadow-sm transition-transform ${
        optional
          ? "bg-[var(--card)] border-2 border-dashed border-[#069494]/30 text-[var(--muted)]"
          : "bg-white dark:bg-[var(--card)] border border-[#069494]/30 text-[var(--foreground)]"
      }`}
    >
      {/* Step number bubble */}
      {number !== undefined && (
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold ${
            optional
              ? "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]"
              : "bg-[#069494] text-white"
          }`}
        >
          {number}
        </span>
      )}
      {optional && (
        <span className="text-[10px] uppercase tracking-wider opacity-80 -ml-1">
          opt
        </span>
      )}
      {children}
    </span>
  );
}

function FlowArrow() {
  return (
    <svg
      className="w-6 h-6 text-[#069494]/50 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function FlowDown() {
  return (
    <div className="flex justify-center my-4">
      <div className="flex flex-col items-center gap-1">
        <svg
          className="w-6 h-6 text-[#069494]/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
