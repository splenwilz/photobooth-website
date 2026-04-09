import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "The master password system — BoothIQ Docs",
  description:
    "Operator-level explanation of BoothIQ's emergency single-use password system.",
};

const HREF = "/docs/security-and-compliance/master-password-system";

const TOC = [
  { id: "what-it-is", label: "What it is" },
  { id: "when-to-use", label: "When to use it" },
  { id: "obtain", label: "How to obtain a master password" },
  { id: "how-to-use", label: "How to use it on the kiosk" },
  { id: "single-use", label: "Single-use enforcement" },
  { id: "expires", label: "Cloud-issued passwords expire" },
  { id: "what-not", label: "What it does NOT do" },
  { id: "support-sees", label: "What support sees" },
  { id: "walkthrough", label: "A walkthrough" },
  { id: "support-cant", label: "If support can't help quickly" },
  { id: "after", label: "After-incident hygiene" },
  { id: "common-questions", label: "Common questions" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function MasterPasswordSystemPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>The master password system</h1>

      <p>
        BoothIQ has an emergency access system called the{" "}
        <strong>master password</strong>. It&apos;s a single-use code
        that lets a trusted party get into a fully-locked-out kiosk
        without a password reset. This article explains it from an
        operator&apos;s perspective.
      </p>

      <p><strong>Who this is for:</strong> Operators who need to understand what the master password is and how to use it in an emergency.</p>

      <h2 id="what-it-is">What it is</h2>

      <p>A <strong>master password</strong> is an <strong>8-digit single-use code</strong> that BoothIQ accepts in addition to your normal password. It&apos;s designed for one specific situation: <strong>you&apos;re locked out of the kiosk and you can&apos;t recover with the normal password or recovery PIN</strong>.</p>

      <p>You can&apos;t generate a master password yourself on the kiosk. You have to obtain one from a <strong>trusted source</strong>. Typically:</p>

      <ul>
        <li><strong>BoothIQ support</strong>, who can issue a cloud-side emergency password</li>
        <li><strong>The HMAC mechanism</strong> described in the developer docs (advanced, usually only used by support technicians)</li>
      </ul>

      <h2 id="when-to-use">When to use it</h2>

      <p>Use the master password only when:</p>

      <ol>
        <li>You can&apos;t sign in with the regular password (forgot it, never knew it, or it was changed without your knowledge)</li>
        <li>You don&apos;t have a working recovery PIN</li>
        <li>You can&apos;t wait for an in-person service visit</li>
        <li>You&apos;re a legitimate operator, not someone trying to bypass security on a booth that isn&apos;t yours</li>
      </ol>

      <p><strong>Don&apos;t</strong> use the master password as a routine login alternative. It&apos;s intentionally cumbersome. Single use, requires contacting support, no convenience.</p>

      <h2 id="obtain">How to obtain a master password</h2>

      <h3>Option A: Cloud-issued emergency password (<code>EMR-*</code>)</h3>

      <p>If your booth is registered to the BoothIQ cloud:</p>

      <ol>
        <li><strong>Contact BoothIQ support</strong> by phone, email, or whatever channel your account uses.</li>
        <li><strong>Verify your identity.</strong> Support will ask for details proving you own the booth. Your account email, the <strong>Booth ID</strong>, your business name, etc. They will not give out a master password to anyone who asks.</li>
        <li>Support <strong>issues a cloud emergency password</strong> from the cloud dashboard. The format is <code>EMR-</code> followed by some characters.</li>
        <li>Support tells you the password (probably over a secure channel. Phone, secure messaging, or email).</li>
        <li>You go to the kiosk and use the password.</li>
      </ol>

      <h3>Option B: HMAC-derived master password (advanced)</h3>

      <p>This is a deeper mechanism documented in the developer docs (<code>docs/MASTER_PASSWORD.md</code>). It uses a per-kiosk secret combined with a one-time code to derive a valid 8-digit password.</p>

      <p>This path is <strong>for support technicians</strong>, not for routine operator use. If support tells you to use it, follow their exact instructions.</p>

      <h2 id="how-to-use">How to use a master password on the kiosk</h2>

      <ol>
        <li>Go to the admin login screen on the kiosk (5-tap on the credits indicator).</li>
        <li>Enter your <strong>username</strong> (e.g. <code>admin</code>).</li>
        <li>Enter the <strong>master password</strong> in the password field. Type the <code>EMR-*</code> code or the 8-digit number exactly as support gave it to you.</li>
        <li>Tap <strong>Sign In</strong>.</li>
        <li>The booth validates the code and signs you in.</li>
      </ol>

      <p>After you&apos;re in, <strong>immediately</strong>:</p>

      <ul>
        <li><strong>Change the regular password</strong> to something you know.</li>
        <li><strong>Reset the recovery PIN.</strong></li>
        <li><strong>Sign out and sign back in</strong> with the new credentials to verify.</li>
      </ul>

      <h2 id="single-use">Single-use enforcement</h2>

      <p>The master password is <strong>single-use</strong> by design. Once it&apos;s been used:</p>

      <ul>
        <li>The booth records the code as <strong>used</strong> in its local audit trail.</li>
        <li>Trying to use the same code again will be <strong>rejected</strong>.</li>
        <li>The booth also records when the code was used, by which username, and from what device.</li>
      </ul>

      <p>This means you can&apos;t write down a master password &quot;for later.&quot; Once it&apos;s been validated even once, it&apos;s burned.</p>

      <h2 id="expires">Cloud-issued passwords expire</h2>

      <p>Cloud-issued <code>EMR-*</code> passwords are <strong>time-limited</strong>. Typically they expire within hours of being issued. Use them immediately when you receive them.</p>

      <h2 id="what-not">What the master password does NOT do</h2>

      <p>To prevent misuse:</p>

      <ul>
        <li>It does <strong>not</strong> bypass the rate limiter completely. If you&apos;re brute-forcing master passwords, the booth still locks you out.</li>
        <li>It does <strong>not</strong> unlock the cash box.</li>
        <li>It does <strong>not</strong> modify other admin accounts on the booth.</li>
        <li>It does <strong>not</strong> clear the audit logs.</li>
        <li>It does <strong>not</strong> leave a &quot;back door.&quot; It&apos;s a one-time emergency entry point, then it&apos;s gone.</li>
      </ul>

      <h2 id="support-sees">What support sees</h2>

      <p>When support issues a master password to you, the issuance is recorded in the cloud:</p>

      <ul>
        <li>Who requested it (your identity)</li>
        <li>Which booth (Booth ID)</li>
        <li>When it was issued</li>
        <li>When it was used</li>
        <li>(If it expires) When it expired</li>
      </ul>

      <p>Support has an audit trail of every emergency password they&apos;ve issued. This is for everyone&apos;s protection.</p>

      <h2 id="walkthrough">A walkthrough</h2>

      <h3>Scenario: You forgot the admin password and the recovery PIN</h3>

      <ol>
        <li><strong>Don&apos;t power-cycle the kiosk repeatedly hoping it&apos;ll reset.</strong> Admin credentials are persistent.</li>
        <li><strong>Don&apos;t try the same wrong password repeatedly.</strong> You&apos;ll get rate-limited.</li>
        <li><strong>Take a deep breath</strong> and find your password manager (where the password should have been). If it&apos;s not there, accept that you forgot it.</li>
        <li><strong>Contact BoothIQ support.</strong> Give them your Booth ID and explain the situation.</li>
        <li>Support <strong>verifies your identity</strong> (this may take a few minutes).</li>
        <li>Support <strong>issues an <code>EMR-*</code> cloud emergency password</strong> and tells you the code over a secure channel.</li>
        <li>You walk to the kiosk and go to the admin login screen.</li>
        <li>You type the username (<code>admin</code>) and the <code>EMR-*</code> code as the password.</li>
        <li>You sign in.</li>
        <li>You <strong>immediately</strong> open Settings → Security &amp; Users → Change My Password and pick a new strong password.</li>
        <li>You <strong>immediately</strong> reset the recovery PIN.</li>
        <li>You <strong>store both</strong> in your password manager.</li>
        <li>You <strong>sign out and sign back in</strong> with the new password to verify.</li>
        <li>You <strong>document the incident</strong> so it doesn&apos;t happen again (e.g. write a note: &quot;set up password manager for booth before opening&quot;).</li>
      </ol>

      <p>Total time: depending on how fast support responds, this can take a while.</p>

      <h2 id="support-cant">What to do if support can&apos;t help quickly</h2>

      <p>If you&apos;re locked out and support is unresponsive:</p>

      <ul>
        <li><strong>Take the booth out of customer service.</strong> Even if you can&apos;t manage it, you don&apos;t want it running unattended in a broken state.</li>
        <li><strong>If the booth still functions for customers</strong> (the welcome screen still works), you can keep it running until support gets back to you. You just can&apos;t make any admin-side changes.</li>
        <li><strong>Document the incident</strong> so you have a clear log of what happened and when.</li>
        <li><strong>Try a different support channel.</strong> Email, phone, the cloud dashboard&apos;s contact form.</li>
      </ul>

      <h2 id="after">After-incident hygiene</h2>

      <p>After every master password event, do a security review:</p>

      <ol>
        <li><strong>Why did you get locked out?</strong> Forgot password? Forgot PIN? Brute force?</li>
        <li><strong>What can you change</strong> to prevent it from happening again? Use a password manager? Keep PIN written down securely? Set up additional admin users?</li>
        <li><strong>Did anyone unauthorized see</strong> the master password during use?</li>
        <li><strong>Does support need any follow-up</strong> information about the incident?</li>
      </ol>

      <h2 id="common-questions">Common questions</h2>

      <p><strong>Can a competitor or attacker request a master password for my booth?</strong></p>
      <p>No. Support verifies the requester&apos;s identity against the cloud account that owns the booth. Random requests are rejected.</p>

      <p><strong>Can I store a master password in my password manager for emergencies?</strong></p>
      <p>No. They&apos;re single-use and time-limited. Storing one is pointless.</p>

      <p><strong>Can the master password be issued without the booth being registered to the cloud?</strong></p>
      <p>The cloud-issued path requires registration. The HMAC path (advanced) does not require cloud registration but is more complex. Contact support for offline scenarios.</p>

      <p><strong>Is the master password the same as the recovery PIN?</strong></p>
      <p>No. The recovery PIN is something <strong>you</strong> set up on first login to recover <strong>your own</strong> password. The master password is something <strong>support</strong> issues to you in an emergency.</p>

      <p><strong>Can I disable the master password system entirely?</strong></p>
      <p>No. It&apos;s a built-in part of BoothIQ. The trade-off is that an attacker would need to compromise both the cloud account and support&apos;s verification process to abuse it. Which is much harder than guessing a password.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;ve successfully recovered access when:</p>

      <ul>
        <li>You can sign in to admin with a regular password again</li>
        <li>You&apos;ve reset your recovery PIN</li>
        <li>You&apos;ve stored the new credentials in a password manager</li>
        <li>The master password you used can no longer be re-used</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/troubleshooting/locked-out-of-admin">
            Locked out of admin
          </Link>
          . Step-by-step recovery walkthrough.
        </li>
        <li>
          <Link href="/docs/security-and-compliance/admin-account-best-practices">
            Admin account best practices
          </Link>
          . Don&apos;t get locked out in the first place.
        </li>
        <li>For developer-level details, see the developer documentation.</li>
      </ul>
    </DocsLayout>
  );
}
