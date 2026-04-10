import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Handling customer issues — BoothIQ Docs",
  description:
    "Common customer situations and how to recover gracefully: bad prints, refunds, retakes, lost photos.",
};

const HREF = "/docs/running-your-booth/handling-customer-issues";

const TOC = [
  { id: "general-principle", label: "The general principle" },
  { id: "blurry", label: "1. Blurry print" },
  { id: "wrong-colors", label: "2. Wrong colors / streaks" },
  { id: "no-print", label: "3. Paid but no print" },
  { id: "no-credit", label: "4. Coins didn't credit" },
  { id: "refund", label: "5. Customer wants a refund" },
  { id: "left-print", label: "6. Customer left without print" },
  { id: "crashed", label: "7. Booth crashed mid-session" },
  { id: "email-photo", label: "8. \"Can you email me the photo?\"" },
  { id: "no-pay", label: "9. Trying to use without paying" },
  { id: "logging", label: "Logging issues for support" },
  { id: "common-mistakes", label: "Common operator mistakes" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function HandlingCustomerIssuesPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Handling customer issues</h1>

      <p>
        Even a perfectly working booth occasionally makes a customer
        unhappy: a blurry photo, a print that came out wrong, a coin
        that didn&apos;t register. This article gives you a playbook
        for the most common situations.
      </p>

      <p><strong>Who this is for:</strong> Operators on the floor.</p>

      <h2 id="general-principle">The general principle</h2>

      <p>
        When something goes wrong, the customer doesn&apos;t care
        whose fault it is. They just want a working print or their
        money back. Your job is to:
      </p>

      <ol>
        <li><strong>Apologize first</strong> (even if it wasn&apos;t your fault)</li>
        <li><strong>Decide quickly</strong> whether to comp / retry / refund</li>
        <li><strong>Document the resolution</strong> in the booth so the audit trail is clean</li>
        <li><strong>Get the customer their print or refund</strong> within a few minutes</li>
      </ol>

      <p>
        The Credits tab is your tool for #3 (see{" "}
        <Link href="/docs/running-your-booth/adding-credits-manually">
          Adding credits manually
        </Link>
        ).
      </p>

      <h2 id="blurry">Situation 1: A print came out blurry</h2>

      <p><strong>What happened:</strong> The customer moved during the countdown, the camera focus was confused, or the lighting was bad.</p>

      <p><strong>What to do:</strong></p>

      <ol>
        <li>Apologize.</li>
        <li>Open admin → Credits tab.</li>
        <li>Add credits equal to one session of the same product.</li>
        <li>Tell the customer to walk back around to the kiosk and start a new session. It&apos;s on you.</li>
        <li>Watch the new session complete successfully.</li>
        <li>If the new print is good, you&apos;re done.</li>
      </ol>

      <p>
        If the second print is also blurry, the camera or the lighting
        is the actual problem. See <strong>Camera not working</strong>{" "}
        <em>(coming soon)</em> or adjust camera settings in the
        Diagnostics tab.
      </p>

      <h2 id="wrong-colors">Situation 2: A print came out with wrong colors / streaks</h2>

      <p><strong>What happened:</strong> The dye-sub ribbon may be misaligned, or the media is defective.</p>

      <p><strong>What to do:</strong></p>

      <ol>
        <li>Apologize.</li>
        <li><strong>Take the booth out of customer service temporarily</strong> (if you can. Easiest is to put it in Free Play mode briefly to flag it).</li>
        <li>Open the printer service door and reseat the ribbon and paper.</li>
        <li>Run a <strong>Test Print</strong> from the Diagnostics tab.</li>
        <li>If the test print is good, comp the customer (add credits) and put the booth back in service.</li>
        <li>If the test print is also bad, you may need a new media roll. See <strong>Changing the print roll</strong> <em>(coming soon)</em>.</li>
      </ol>

      <h2 id="no-print">Situation 3: The customer paid but the print never came out</h2>

      <p><strong>What happened:</strong> The printer jammed, ran out of paper, or went offline mid-print.</p>

      <p><strong>What to do:</strong></p>

      <ol>
        <li>Apologize.</li>
        <li>Open the printer service door and look for a jam or media issue.</li>
        <li>Clear the jam, reseat the paper, or change the roll.</li>
        <li>Power-cycle the printer if it&apos;s offline.</li>
        <li>Wait for the Printer pill in admin to go green.</li>
        <li>Open the Credits tab and <strong>add credits equal to the failed session</strong>. The customer&apos;s original credits were already deducted, so they need a fresh batch to retry.</li>
        <li>Tell the customer to start a new session.</li>
        <li>Confirm the new print succeeds.</li>
      </ol>

      <p>If the printer keeps failing, take the booth offline (Free Play mode + sign on the front saying &quot;Out of Order&quot;) and contact support.</p>

      <h2 id="no-credit">Situation 4: The customer inserted coins but the booth didn&apos;t credit them</h2>

      <p><strong>What happened:</strong> The PCB is not talking to the booth, the COM port is wrong, or the payment device rejected the coin without registering.</p>

      <p><strong>What to do:</strong></p>

      <ol>
        <li>Apologize.</li>
        <li>Open admin → Diagnostics → PCB section.</li>
        <li>Look at the PCB status. Is it Active? Is it listening on a COM port?</li>
        <li>If the PCB is offline, see <strong>Payment not registering</strong> <em>(coming soon)</em>.</li>
        <li>If the customer&apos;s coin was rejected and they have it in their hand still, ask them to try again. It might just have been a bad insert.</li>
        <li>If the customer claims they paid and you can&apos;t verify in the Credits tab, <strong>trust the customer</strong> for the first incident. Refund them in cash from the cash box, document the incident, and watch closely.</li>
        <li>If a customer comes back claiming this every time, it&apos;s worth investigating whether the payment device is undercount. Contact support.</li>
      </ol>

      <h2 id="refund">Situation 5: A customer wants a refund</h2>

      <p><strong>What happened:</strong> The customer changed their mind, or the print was acceptable but they want their money back.</p>

      <p><strong>What to do:</strong></p>

      <p>Refund policies are up to you and your venue. BoothIQ doesn&apos;t enforce a refund policy. Common approaches:</p>

      <ul>
        <li><strong>No refunds, only retakes.</strong> This is the easiest policy. Tell the customer you can give them a free retry but not their cash back.</li>
        <li><strong>Refunds at operator discretion.</strong> Handle case by case.</li>
        <li><strong>Refunds for unprintable sessions only.</strong> Refund only when the booth was at fault.</li>
      </ul>

      <p>When you do refund a customer:</p>

      <ol>
        <li>Take the cash from the cash box and give it to them.</li>
        <li>Open the Credits tab and <strong>deduct</strong> an equivalent amount from the booth&apos;s credit balance to keep the audit trail clean.</li>
        <li>(Optional) Document the refund somewhere outside the booth: a notebook, a Google Sheet, etc.</li>
      </ol>

      <h2 id="left-print">Situation 6: A customer left without their print</h2>

      <p><strong>What happened:</strong> The customer paid, the print came out, but they walked away before picking it up.</p>

      <p><strong>What to do:</strong></p>

      <ul>
        <li>Hold the print at the booth (some operators put a small basket next to the kiosk for orphaned prints).</li>
        <li>If the customer comes back asking for it, hand it over.</li>
        <li>If they don&apos;t come back, you can offer it to a friend, throw it out, or save it for a &quot;lost prints&quot; wall display.</li>
      </ul>

      <p>There&apos;s no admin-side action needed. The session was paid and the print was made. The booth doesn&apos;t track who picked up which print.</p>

      <h2 id="crashed">Situation 7: The customer says the booth crashed mid-session</h2>

      <p><strong>What happened:</strong> The kiosk became unresponsive, or showed a hardware error screen, or restarted unexpectedly.</p>

      <p><strong>What to do:</strong></p>

      <ol>
        <li>Apologize.</li>
        <li>Open admin → Diagnostics and check all hardware pills.</li>
        <li>If something is red, fix it (see <strong>Troubleshooting</strong> <em>(coming soon)</em>).</li>
        <li>Comp the customer (add credits equal to one session) and let them retry.</li>
        <li><strong>If this happens repeatedly</strong>, take the booth offline and contact support. This is a recurring issue, not a one-time blip.</li>
      </ol>

      <h2 id="email-photo">Situation 8: A customer asks &quot;can you email me the photo?&quot;</h2>

      <p><strong>What happened:</strong> The customer wants a digital copy of their print.</p>

      <p><strong>What to do:</strong></p>

      <p>The version of BoothIQ described in these docs <strong>doesn&apos;t have a built-in email-the-photo-to-customer feature</strong>. The closest features are:</p>

      <ul>
        <li><strong>Phone Print.</strong> But that goes the wrong way (customer&apos;s phone → kiosk, not kiosk → customer&apos;s phone)</li>
        <li><strong>Save photos to USB.</strong> Operator-side only, not customer-facing</li>
      </ul>

      <p>Tell the customer: &quot;Sorry, we can&apos;t email it to you, but you can take a photo of the print with your phone.&quot; Most customers accept this.</p>

      <p>If multiple customers ask for this, talk to your BoothIQ point of contact. It may be on the roadmap.</p>

      <h2 id="no-pay">Situation 9: A customer is trying to use the booth without paying</h2>

      <p><strong>What happened:</strong> The customer is tapping through the screens but never inserts coins, or they&apos;re trying to find a way around the payment screen.</p>

      <p><strong>What to do:</strong></p>

      <p>The booth is designed to prevent this. The payment screen waits for credits to reach the total before advancing. They literally cannot get a print without paying (except in Free Play mode).</p>

      <p>If the customer is just confused, walk them through how to insert coins.</p>
      <p>If they&apos;re trying to game the system, politely tell them they need to pay to use the booth.</p>

      <h2 id="logging">Logging issues for support</h2>

      <p>If you have a recurring issue you want to escalate to support, gather:</p>

      <ul>
        <li>The <strong>Booth ID</strong> (from the Cloud Sync tab)</li>
        <li>The <strong>time and date</strong> the issue occurred</li>
        <li>A <strong>short description</strong> of what happened</li>
        <li>(Optional) A photo of the bad print or the error screen</li>
      </ul>

      <p>Send this to support. They can pull logs from the cloud (if your booth is registered) and investigate.</p>

      <h2 id="common-mistakes">Common operator mistakes</h2>

      <p><strong>Refunding cash AND comping with credits for the same session.</strong></p>
      <p>Pick one. Document either way.</p>

      <p><strong>Not logging refunds at all.</strong></p>
      <p>Always deduct in the Credits tab to match cash going out.</p>

      <p><strong>Letting customers self-serve from admin.</strong></p>
      <p>Never give customers admin access.</p>

      <p><strong>Apologizing for things that aren&apos;t actually broken.</strong></p>
      <p>Confirm the issue first by checking admin.</p>

      <p><strong>Powering off the booth as the first response to any issue.</strong></p>
      <p>Try the diagnostic flow first; only power-cycle as a last resort.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;re handling customer issues effectively when:</p>

      <ul>
        <li>Customer complaints turn into satisfied customers within a few minutes</li>
        <li>Your end-of-day cash reconciles cleanly with Sales tab + manual adjustments</li>
        <li>You&apos;re not getting repeat complaints about the same issue</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/running-your-booth/adding-credits-manually">
            Adding credits manually
          </Link>
          . The mechanics of comping.
        </li>
        <li><strong>Troubleshooting</strong> <em>(coming soon)</em>. When the issue is the booth, not the customer.</li>
        <li>
          <Link href="/docs/running-your-booth/daily-startup-checklist">
            Daily startup checklist
          </Link>
          . Catch problems before customers do.
        </li>
      </ul>
    </DocsLayout>
  );
}
