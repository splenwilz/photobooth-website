import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Locked out of admin — BoothIQ Docs",
  description:
    "Forgotten admin password, lost recovery PIN, or account-locked rate limit: how to recover.",
};

const HREF = "/docs/troubleshooting/locked-out-of-admin";

const TOC = [
  { id: "step-1", label: "Step 1: Confirm the username" },
  { id: "step-2", label: "Step 2: Wait out the rate limit" },
  { id: "step-3", label: "Step 3: Use the Recovery PIN" },
  { id: "step-4", label: "Step 4: Master Password (emergency)" },
  { id: "step-5", label: "Step 5: When all else fails" },
  { id: "after", label: "After you recover access" },
  { id: "preventing", label: "Preventing future lockouts" },
  { id: "user-account", label: "What about the user account?" },
  { id: "common-questions", label: "Common questions" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function LockedOutOfAdminPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Locked out of admin</h1>

      <p>
        You can&apos;t sign in to admin. Maybe you forgot the password,
        maybe the account is locked from too many failed attempts,
        maybe you also lost the recovery PIN. This article walks
        through every recovery path from cheapest to most-expensive.
      </p>

      <p><strong>Symptom:</strong> Can&apos;t reach the admin dashboard from the kiosk.</p>

      <DocsCallout type="important">
        Recovery from admin lockout requires you to be{" "}
        <strong>physically at the kiosk</strong>. There is no remote
        password reset.
      </DocsCallout>

      <h2 id="step-1">Step 1: Confirm you&apos;re using the right username</h2>

      <p>The default accounts that ship with BoothIQ:</p>

      <ul>
        <li><code>admin</code> (Master access)</li>
        <li><code>user</code> (User access)</li>
      </ul>

      <p>If you&apos;ve created additional accounts, the username is whatever you set it to. The username field is <strong>case-sensitive</strong> but BoothIQ usually accepts lowercase.</p>

      <p>Common typos:</p>

      <ul>
        <li><code>Admin</code> (capital A) → use <code>admin</code></li>
        <li><code>Administrator</code> → use <code>admin</code></li>
        <li>Trailing space (from the virtual keyboard) → tap into the field and check</li>
      </ul>

      <h2 id="step-2">Step 2: Wait out the rate limit</h2>

      <p>If you got an &quot;Account locked&quot; message after several failed attempts, the booth has temporarily locked the account to prevent brute-force attacks. The lockout window is typically a few minutes (the screen tells you exactly how long).</p>

      <p>Wait the number of minutes shown, then try again with the <strong>correct password</strong>.</p>

      <DocsCallout type="warning">
        <strong>Don&apos;t keep guessing while the lock is active.</strong>{" "}
        That may extend the lockout. Use the wait time to find the
        actual password (check your password manager, sticky note,
        etc.).
      </DocsCallout>

      <h2 id="step-3">Step 3: Use the Recovery PIN</h2>

      <p>If you set up a <strong>Recovery PIN</strong> during first-time setup (which you should have), use it now:</p>

      <ol>
        <li>On the admin login screen, tap <strong>Forgot Password?</strong>.</li>
        <li>The booth shows the PIN recovery flow.</li>
        <li>Enter your username.</li>
        <li>Enter the <strong>4-6 digit PIN</strong> you set up earlier.</li>
        <li>The booth lets you set a new password.</li>
        <li>Sign in with the new password.</li>
      </ol>

      <p>If the PIN is correct but the booth doesn&apos;t accept it, try once more carefully. Make sure the on-screen keyboard is in numeric mode and you&apos;re entering the right digits.</p>

      <p>If the PIN is wrong (you forgot it), see Step 4.</p>

      <h2 id="step-4">Step 4: Use a Master Password (single-use emergency access)</h2>

      <p>BoothIQ has a <strong>master password</strong> system for emergency access. A master password is an <strong>8-digit single-use code</strong> that BoothIQ can validate against a per-kiosk secret. The booth will not give you a master password. You have to obtain one from a trusted source.</p>

      <p>There are two ways to get one:</p>

      <h3>A. Cloud-issued emergency password (<code>EMR-*</code>)</h3>

      <p>If your booth is registered to the cloud, your BoothIQ support contact can issue an emergency password from the cloud dashboard. The format is <code>EMR-</code> followed by some characters.</p>

      <ol>
        <li>Contact BoothIQ support.</li>
        <li>Provide your <strong>Booth ID</strong> (you may need to look at the booth&apos;s chassis or your purchase records since you can&apos;t get into admin to read it).</li>
        <li>Support issues an <code>EMR-*</code> password and tells you what it is.</li>
        <li>On the admin login screen, type the <code>EMR-*</code> password into the password field.</li>
        <li>Sign in.</li>
        <li><strong>Immediately</strong> change your real password and reset your recovery PIN.</li>
      </ol>

      <p>The cloud-issued password is <strong>single-use</strong> and expires after a short window. Use it immediately.</p>

      <h3>B. HMAC-derived master password</h3>

      <p>For advanced/offline scenarios, BoothIQ has a deeper master password mechanism described in the developer docs (<code>docs/MASTER_PASSWORD.md</code>). If support tells you to use this path, follow their instructions exactly.</p>

      <h2 id="step-5">Step 5: When all else fails</h2>

      <p>If the recovery PIN doesn&apos;t work, the cloud-issued password doesn&apos;t work, and you can&apos;t reach support:</p>

      <ol>
        <li><strong>Don&apos;t power-cycle the kiosk repeatedly hoping it&apos;ll reset.</strong> Admin credentials are persistent.</li>
        <li><strong>Don&apos;t try to access the file system directly.</strong> The kiosk is locked down and you can&apos;t reach Windows.</li>
        <li><strong>Contact BoothIQ support and explain the situation.</strong> They have additional recovery options for fully locked-out booths but may need to schedule a remote session.</li>
      </ol>

      <h2 id="after">After you recover access</h2>

      <p>Once you can sign in to admin again, do these things <strong>immediately</strong> before exiting:</p>

      <ol>
        <li><strong>Change your password</strong> to something strong that you&apos;ll remember (or store in a password manager).</li>
        <li><strong>Set up a fresh Recovery PIN.</strong> Don&apos;t reuse the lost PIN. Pick a new one.</li>
        <li><strong>Write down both</strong> in a safe place outside the booth (a password manager is ideal).</li>
        <li><strong>Verify you can sign back in</strong> with the new credentials before exiting admin.</li>
      </ol>

      <h2 id="preventing">Preventing future lockouts</h2>

      <ul>
        <li><strong>Use a password manager.</strong> This is the single best thing you can do.</li>
        <li><strong>Set up a recovery PIN immediately</strong> after changing the default password. Don&apos;t put it off.</li>
        <li><strong>Don&apos;t share admin accounts</strong> between staff. When one staff member changes the password, the other one is locked out.</li>
        <li><strong>Keep your Booth ID written down somewhere outside the kiosk.</strong> You&apos;ll need it for support contacts.</li>
        <li><strong>If you have multiple admin users</strong>, test each one&apos;s recovery PIN periodically.</li>
      </ul>

      <h2 id="user-account">What about the <code>user</code> account?</h2>

      <p>If you&apos;re locked out of <code>admin</code> but the <code>user</code> account still works, sign in as <code>user</code> to take the booth out of service or run sales reports while you&apos;re recovering admin. But you <strong>cannot</strong> change the <code>admin</code> account&apos;s password from the <code>user</code> account. User access doesn&apos;t include user management.</p>

      <h2 id="common-questions">Common questions</h2>

      <p><strong>Can I just reinstall BoothIQ to reset the password?</strong></p>
      <p>No. The booth is locked down. You can&apos;t reach Windows to run an installer, and even support can&apos;t easily wipe the local database without losing all your sales data. Recovery PINs and master passwords are the supported paths.</p>

      <p><strong>Can I bypass the password by power-cycling at the right moment?</strong></p>
      <p>No. There is no boot-time bypass.</p>

      <p><strong>Can I delete the password file directly?</strong></p>
      <p>No. The kiosk is locked down. Even if you could reach the file system, the credentials are stored hashed and can&apos;t be edited by hand.</p>

      <p><strong>My recovery PIN is wrong but I&apos;m sure it&apos;s right.</strong></p>
      <p>Each admin user has their <strong>own</strong> PIN. If you&apos;re trying to recover the <code>admin</code> user, use the PIN you set when you signed in as <code>admin</code>, not the one you set when signed in as <code>user</code>. PINs are not shared across accounts.</p>

      <h2 id="verify">Verify it worked</h2>

      <p>You&apos;ve recovered access when:</p>

      <ul>
        <li>You can sign in to admin with a password you know</li>
        <li>You&apos;ve changed the password to something you&apos;ll remember</li>
        <li>You&apos;ve set up a fresh Recovery PIN</li>
        <li>You can sign out and sign back in without issues</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li><strong>Admin account best practices</strong> <em>(coming soon)</em>. Avoid future lockouts.</li>
        <li><strong>The master password system</strong> <em>(coming soon)</em>. Operator-level explanation.</li>
        <li>
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>
          . Setting up the recovery PIN correctly the first time.
        </li>
      </ul>
    </DocsLayout>
  );
}
