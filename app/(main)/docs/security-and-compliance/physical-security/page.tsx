import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Physical security — BoothIQ Docs",
  description:
    "Securing the kiosk hardware itself: the cash box, the enclosure, the venue location.",
};

const HREF = "/docs/security-and-compliance/physical-security";

const TOC = [
  { id: "threats", label: "The threats" },
  { id: "mounting", label: "Mounting the booth" },
  { id: "venue", label: "Choosing a venue location" },
  { id: "cash-box", label: "The cash box" },
  { id: "tamper", label: "Tamper detection" },
  { id: "enclosure", label: "Locking the enclosure" },
  { id: "camera-privacy", label: "Camera privacy" },
  { id: "power", label: "Power and continuity" },
  { id: "insurance", label: "Insurance" },
  { id: "verifying-staff", label: "Verifying staff with you" },
  { id: "verifying-support", label: "Verifying support over the phone" },
  { id: "disposing", label: "Disposing of an old booth" },
  { id: "verify", label: "Verify your physical security" },
  { id: "common-mistakes", label: "Common mistakes" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PhysicalSecurityPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Physical security</h1>

      <p>
        A BoothIQ kiosk is a physical device sitting in a public venue
        with cash inside. Software security only goes so far. Physical
        security covers the rest. This article is the basics.
      </p>

      <p><strong>Who this is for:</strong> Operators placing kiosks in public venues, especially at-risk venues (24/7 access, high-foot-traffic, low-staff oversight).</p>

      <h2 id="threats">The threats</h2>

      <p>Realistic threats to a BoothIQ kiosk in a venue:</p>

      <ul>
        <li><strong>Cash theft</strong> (forcing the cash box). Mount the booth securely; choose a well-lit location</li>
        <li><strong>Kiosk theft</strong> (entire booth removed). Bolt to floor; choose a venue with security cameras</li>
        <li><strong>Vandalism</strong> (damage, graffiti). Choose a high-traffic location; have a daily inspection routine</li>
        <li><strong>Tampering</strong> (someone trying to access internal hardware). Lock the enclosure; check for tamper signs daily</li>
        <li><strong>Phishing customers</strong> (someone pretending to be the booth or its operator). Educate customers; have official signage</li>
        <li><strong>Social engineering operators</strong> (someone calling support pretending to be you). Establish verification protocols with support</li>
      </ul>

      <h2 id="mounting">Mounting the booth</h2>

      <p>A BoothIQ kiosk should be <strong>physically secured</strong> to prevent removal:</p>

      <ul>
        <li><strong>Bolt to the floor</strong> if your venue allows it. This is the most effective deterrent.</li>
        <li><strong>Tether with a security cable</strong> if bolting isn&apos;t possible.</li>
        <li><strong>Place against a wall</strong> so the booth can&apos;t be tipped over from behind.</li>
        <li><strong>Don&apos;t put it on wheels</strong> unless wheels are locked.</li>
      </ul>

      <p>Talk to your venue about what mounting options are available. A mounted kiosk is much harder to steal than a free-standing one.</p>

      <h2 id="venue">Choosing a venue location</h2>

      <p>A good location for a BoothIQ kiosk:</p>

      <ul>
        <li><strong>High foot traffic.</strong> Witnesses deter casual theft and vandalism</li>
        <li><strong>Well lit.</strong> Both for the camera (better photos) and for security</li>
        <li><strong>In view of staff.</strong> Venue staff can intervene if something goes wrong</li>
        <li><strong>Within range of security cameras.</strong> For after-the-fact accountability</li>
        <li><strong>Not in a hidden corner.</strong> Alleys, back hallways, late-night zones are risky</li>
      </ul>

      <p>A bad location:</p>

      <ul>
        <li>A dark, unmonitored corner of a 24/7 venue</li>
        <li>Outside, exposed to weather (also bad for the printer and camera)</li>
        <li>In a crowded space where customers can&apos;t comfortably use it (also bad for revenue)</li>
      </ul>

      <h2 id="cash-box">The cash box</h2>

      <p>The cash box is the highest-value target. Best practices:</p>

      <ul>
        <li><strong>Empty it frequently.</strong> At the end of every shift, or at least every day. Don&apos;t let cash accumulate.</li>
        <li><strong>Use a separate locked compartment.</strong> The cash box should have its own lock independent of the booth&apos;s main enclosure.</li>
        <li><strong>Use a unique key</strong> that you don&apos;t share with venue staff.</li>
        <li><strong>Don&apos;t write the cash box location</strong> on the outside of the booth.</li>
      </ul>

      <p>When you collect cash:</p>

      <ol>
        <li>Open the cash box (with your unique key)</li>
        <li>Take the cash</li>
        <li><strong>Verify against the Sales tab.</strong> The cash should match revenue minus any manual credit adjustments</li>
        <li>Reset the cash box</li>
        <li>Store the cash securely</li>
      </ol>

      <h2 id="tamper">Tamper detection</h2>

      <p>Daily, look at the booth for signs of tampering:</p>

      <ul>
        <li><strong>Pry marks</strong> around the enclosure seams</li>
        <li><strong>Missing screws</strong> or fasteners</li>
        <li><strong>Disconnected cables</strong> visible from the outside</li>
        <li><strong>Unusual stickers, marks, or graffiti</strong> that weren&apos;t there yesterday</li>
        <li><strong>Strange behavior.</strong> The booth boots into Windows instead of BoothIQ, asks for unfamiliar credentials, etc.</li>
      </ul>

      <p>If you find evidence of tampering:</p>

      <ol>
        <li><strong>Take the booth out of service immediately.</strong></li>
        <li><strong>Don&apos;t power-cycle.</strong> Gather evidence first.</li>
        <li><strong>Document with photos.</strong></li>
        <li><strong>Contact BoothIQ support and your venue.</strong></li>
        <li><strong>Don&apos;t sign in to admin until you&apos;re sure the booth is in a known-good state.</strong> A tampered booth might have been modified to log your password.</li>
      </ol>

      <h2 id="enclosure">Locking the enclosure</h2>

      <p>The booth&apos;s enclosure should be <strong>locked</strong> so internal components aren&apos;t accessible to the public:</p>

      <ul>
        <li><strong>All access panels</strong> (camera area, printer service door, payment device, USB ports, internal PC) should be locked or behind a locked panel</li>
        <li><strong>Use proper locks</strong>, not just clips or magnets</li>
        <li><strong>Have spare keys</strong> stored away from the booth</li>
      </ul>

      <p>Your installer should have set this up correctly. If any part of the booth is openable without a key, talk to your BoothIQ contact.</p>

      <h2 id="camera-privacy">Camera privacy</h2>

      <p>The camera inside the booth is pointed at where customers stand. Customers expect to be photographed when they tap START. They do <strong>not</strong> expect:</p>

      <ul>
        <li>The camera to be running when they&apos;re not using the booth</li>
        <li>Photos of them to be stored without their knowledge</li>
        <li>Photos of them to be sent anywhere outside the booth</li>
      </ul>

      <p>BoothIQ&apos;s defaults respect these expectations:</p>

      <ul>
        <li>The camera only captures during a session</li>
        <li>Photos aren&apos;t saved by default</li>
        <li>Photos aren&apos;t synced to the cloud by default</li>
      </ul>

      <p>
        But if you customize these defaults. Turning on photo saving,
        enabling Photo Backup, etc. Make sure you&apos;re being
        transparent with your customers. See{" "}
        <Link href="/docs/security-and-compliance/data-and-privacy">
          Data and privacy
        </Link>
        .
      </p>

      <h2 id="power">Power and continuity</h2>

      <p>Physical security includes <strong>uptime</strong>:</p>

      <ul>
        <li><strong>Use a UPS</strong> to bridge brief power outages. The booth can lose state mid-session if it loses power abruptly.</li>
        <li><strong>Surge protect</strong> the kiosk&apos;s power input.</li>
        <li><strong>Don&apos;t share the kiosk&apos;s outlet</strong> with other heavy equipment.</li>
      </ul>

      <h2 id="insurance">Insurance</h2>

      <p>Your kiosk represents a real asset. Make sure:</p>

      <ul>
        <li>It&apos;s covered by <strong>business insurance</strong> for theft, vandalism, and fire</li>
        <li>The venue&apos;s insurance also covers it (if your contract says so)</li>
        <li>You have <strong>proof of ownership</strong> (purchase records, Booth ID) in case you need to file a claim</li>
      </ul>

      <h2 id="verifying-staff">Verifying staff with you</h2>

      <p>If a stranger walks up and claims to be from BoothIQ:</p>

      <ul>
        <li><strong>Ask for ID.</strong></li>
        <li><strong>Don&apos;t give them admin access.</strong></li>
        <li><strong>Call BoothIQ support directly</strong> (using a number you already have, not one they give you) to verify.</li>
        <li>Real BoothIQ technicians will not be offended by the verification. They expect it.</li>
      </ul>

      <p>This is the same advice as for any home/business service visit. The booth is your property; nobody but you should be touching it without verification.</p>

      <h2 id="verifying-support">Verifying support over the phone</h2>

      <p>When <strong>you</strong> call BoothIQ support, expect them to verify your identity:</p>

      <ul>
        <li>They&apos;ll ask for your <strong>Booth ID</strong> (visible in the Cloud Sync tab)</li>
        <li>They may ask for your <strong>account email</strong></li>
        <li>They may ask for <strong>business details</strong> that match your account</li>
        <li>For sensitive operations (issuing emergency master passwords), they&apos;ll be extra careful</li>
      </ul>

      <p>This is for your protection. If support doesn&apos;t verify you, that&apos;s a red flag. Call back through a different channel.</p>

      <h2 id="disposing">Disposing of an old booth</h2>

      <p>When a kiosk reaches end of life:</p>

      <ol>
        <li>
          <strong>Unregister it from the cloud</strong> so its
          credentials are revoked (see{" "}
          <Link href="/docs/admin-dashboard/cloud-sync-tab">
            Cloud Sync tab
          </Link>{" "}
          Unregister Booth button).
        </li>
        <li><strong>Export and back up</strong> any sales data you want to keep.</li>
        <li><strong>Contact support</strong> about decommissioning. They may want to wipe the local database before disposal to remove any residual customer data.</li>
        <li><strong>Don&apos;t sell or give away the kiosk with the BoothIQ database intact.</strong> That could expose customer data.</li>
        <li><strong>Physically destroy</strong> any storage media if disposal is the goal (if support recommends this).</li>
      </ol>

      <h2 id="verify">Verify your physical security</h2>

      <p>Your physical security is reasonable when:</p>

      <ul>
        <li>The booth is mounted or otherwise secured against removal</li>
        <li>The cash box is emptied regularly and uses a unique key</li>
        <li>You do a daily tamper check</li>
        <li>You have insurance covering the kiosk</li>
        <li>You&apos;ve verified the venue&apos;s location and lighting are appropriate</li>
        <li>You can verify support&apos;s identity when they call you (and vice versa)</li>
      </ul>

      <h2 id="common-mistakes">Common mistakes</h2>

      <p><strong>Leaving the cash box unemptied for days.</strong></p>
      <p>Bigger loss when stolen.</p>

      <p><strong>Free-standing booth in an unmonitored area.</strong></p>
      <p>Easy theft target.</p>

      <p><strong>Sharing cash box keys with venue staff.</strong></p>
      <p>More potential leaks.</p>

      <p><strong>No insurance.</strong></p>
      <p>Replacement costs come out of your pocket.</p>

      <p><strong>Trusting unverified &quot;BoothIQ technicians&quot;.</strong></p>
      <p>Anyone can claim to be one.</p>

      <p><strong>Disposing of an old booth without wiping it.</strong></p>
      <p>Customer data exposure.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/security-and-compliance/admin-account-best-practices">
            Admin account best practices
          </Link>
          . The software side of security.
        </li>
        <li>
          <Link href="/docs/security-and-compliance/data-and-privacy">
            Data and privacy
          </Link>
          . What customer data you&apos;re holding.
        </li>
      </ul>
    </DocsLayout>
  );
}
