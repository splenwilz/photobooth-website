import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Printing and thank you — BoothIQ Docs",
  description:
    "The print progress screen, the thank you screen, and the auto-return to welcome.",
};

const HREF = "/docs/customer-experience/printing-and-thank-you";

const TOC = [
  { id: "print-thank-you", label: "The print thank-you screen" },
  { id: "thank-you", label: "The thank you screen" },
  { id: "at-the-printer", label: "What happens at the printer" },
  { id: "after-customer-leaves", label: "After the customer leaves" },
  { id: "what-you-control", label: "What you control" },
  { id: "what-can-go-wrong", label: "What can go wrong" },
  { id: "what-to-tell", label: "What to tell customers" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PrintingPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Printing and thank you</h1>

      <p>
        After the customer pays (or skips the payment screen in Free
        Play), the booth queues the print job and shows a{" "}
        <strong>printing screen</strong> while the photos come out.
        Then a <strong>thank you</strong> screen, then back to the
        welcome screen ready for the next customer.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to know
        what&apos;s happening during the print phase and how to handle
        print problems.
      </p>

      <h2 id="print-thank-you">The print thank-you screen</h2>

      <p>
        Right after payment, the customer sees a &quot;printing your
        photos&quot; screen. It shows:
      </p>

      <ul>
        <li>A friendly message (&quot;Printing your photos!&quot; or similar)</li>
        <li>An <strong>estimated time</strong> for the print</li>
        <li>An animated print progress indicator (a bar or counter)</li>
        <li>The customer&apos;s order summary</li>
        <li>A picture of the printer or pick-up icon</li>
      </ul>

      <p>In the background, BoothIQ:</p>

      <ul>
        <li>Sends the print job to the printer</li>
        <li><strong>Retries up to 3 times</strong> with 3-second delays if the printer hiccups</li>
        <li>Handles the original print <strong>and any cross-sell print</strong> in parallel</li>
        <li>Sends both jobs as separate prints</li>
      </ul>

      <p>
        The customer doesn&apos;t have to wait for the printer to be{" "}
        <strong>finished</strong>. The booth uses a fire-and-forget
        pattern. After about 30 seconds the screen advances to the
        thank-you screen even if printing is still in progress, so the
        customer can move on while the printer catches up.
      </p>

      <DocsScreenshot
        src="print-thank-you-screen.png"
        alt="Print thank you screen with an animated progress indicator and estimated print time."
      />

      <h2 id="thank-you">The thank you screen</h2>

      <p>A short, celebratory final screen with:</p>

      <ul>
        <li>A &quot;Thank you!&quot; message</li>
        <li>An invitation to come back</li>
        <li>Maybe your business logo</li>
        <li>An automatic return to the welcome screen after a few seconds</li>
      </ul>

      <p>
        This is the customer&apos;s cue to walk around to the printer
        and pick up their photos.
      </p>

      <DocsScreenshot
        src="thank-you-screen.png"
        alt="Thank you screen with a celebratory message and invitation to come back."
      />

      <h2 id="at-the-printer">What happens at the printer</h2>

      <p>
        The DNP DS-RX1hs prints <strong>borderless</strong> prints in
        a few seconds each. The customer sees the print(s) eject from
        the printer slot and can pick them up.
      </p>

      <p>
        For multi-copy orders, all copies print one after another. For
        cross-sells, both products print sequentially (e.g. strips
        first, then 4×6).
      </p>

      <h2 id="after-customer-leaves">After the customer leaves</h2>

      <p>The booth automatically:</p>

      <ol>
        <li>Returns to the <strong>welcome screen</strong> ready for the next customer</li>
        <li>Records the transaction in the <strong>Sales</strong> table (visible in the <strong>Sales &amp; Analytics tab</strong> afterwards)</li>
        <li>Updates the credit balance (deducting the spent credits)</li>
        <li>(If cloud sync is enabled) Pushes the transaction to the cloud queue</li>
      </ol>

      <h2 id="what-you-control">What you control</h2>

      <p>
        You don&apos;t control much about this phase. It&apos;s mostly
        automated. What you <strong>can</strong> do:
      </p>

      <ul>
        <li>Monitor the <strong>Print Supply</strong> card in the Sales &amp; Analytics tab to know when to swap rolls (see <strong>Sales tab</strong> <em>(coming soon)</em>)</li>
        <li>Keep the printer service door accessible for emergency intervention</li>
        <li>Train customers to not block the printer slot</li>
      </ul>

      <h2 id="what-can-go-wrong">What can go wrong during printing</h2>

      <h3>Printer jams</h3>
      <p>
        The booth stops the print job and shows a hardware error or
        out-of-order screen. The customer&apos;s session has already
        deducted credits, so:
      </p>
      <ol>
        <li>Open the printer service door and clear the jam (see your printer manual)</li>
        <li>Power-cycle the printer if needed</li>
        <li>Wait for the Printer pill in admin to go green</li>
        <li>Manually add credits to comp the failed session if appropriate (see <strong>Credits tab</strong> <em>(coming soon)</em>)</li>
      </ol>

      <h3>Out of paper</h3>
      <p>
        The printer reports &quot;out of media&quot; and stops. Same
        recovery: change the roll (see <strong>Changing the print roll</strong>{" "}
        <em>(coming soon)</em>), and comp the customer if needed.
      </p>

      <h3>Printer goes offline mid-print</h3>
      <p>
        A USB or power blip can cause this. Power-cycle the printer,
        wait for it to come back online (Printer pill turns green),
        and the queued print should retry automatically thanks to the
        3-retry logic.
      </p>

      <h3>Print comes out blank or with wrong colors</h3>
      <p>
        The dye-sub ribbon may be misaligned or the media may be
        defective. Open the printer, reseat the ribbon and paper, and
        run a test print from the Diagnostics tab to confirm before
        letting more customers run sessions.
      </p>

      <p>
        For deeper troubleshooting, see <strong>Printer issues</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="what-to-tell">What to tell customers</h2>

      <ul>
        <li>&quot;Your photos are printing! Walk around to the printer slot to pick them up.&quot;</li>
        <li>&quot;It only takes a few seconds. They&apos;ll come out warm to the touch.&quot;</li>
        <li>&quot;Be careful, the prints are dye-sub. They&apos;re durable but sticky if you handle them right after printing.&quot;</li>
      </ul>

      <p>If a print comes out badly:</p>
      <ul>
        <li>&quot;Sorry about that. Let me give you a free retry. Just walk around to the screen and start a new session, the booth has been credited.&quot;</li>
      </ul>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>Customer says they didn&apos;t get all their copies.</strong></p>
      <p>Check the order summary on the print thank-you screen (or in the Sales tab afterwards). If they ordered 3 and got 2, the printer probably failed mid-job. Comp them another print.</p>

      <p><strong>The booth went back to the welcome screen but printing isn&apos;t done yet.</strong></p>
      <p>Normal. BoothIQ uses a fire-and-forget print pattern so the booth can serve the next customer while the printer is still working on the previous one. The customer can still pick up their print when it finishes.</p>

      <p><strong>Print supply bar in admin shows the wrong number.</strong></p>
      <p>The bar is calculated from the printer&apos;s reported media level. If it&apos;s off, the printer&apos;s internal counter may be confused. Change the roll and the counter resets.</p>

      <p><strong>Two customers&apos; prints came out at the same time and got mixed up.</strong></p>
      <p>Print jobs are sequential, so this shouldn&apos;t happen. But if your printer queue is configured differently, it might. Tell customers to check who&apos;s holding which print before they walk away.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/phone-upload-feature">
            Phone upload feature
          </Link>
          . The alternative flow for Smartphone Print.
        </li>
        <li><strong>Maintenance › Changing the print roll</strong> <em>(coming soon)</em>. When the bar gets low.</li>
        <li><strong>Sales tab</strong> <em>(coming soon)</em>. Where you&apos;ll see the completed transaction.</li>
      </ul>
    </DocsLayout>
  );
}
