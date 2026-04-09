import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Default credentials — BoothIQ Docs",
  description:
    "The default admin accounts that ship with BoothIQ and what to change immediately.",
};

const HREF = "/docs/reference/default-credentials";

const TOC = [
  { id: "defaults", label: "The defaults" },
  { id: "first-signin", label: "What happens on first sign-in" },
  { id: "where-change", label: "Where to change them" },
  { id: "what-to-do", label: "What you should do (in order)" },
  { id: "no-user-account", label: "What if I don't need the user account?" },
  { id: "other-defaults", label: "Other default values to know" },
  { id: "why-documented", label: "Why are the defaults documented?" },
  { id: "verify", label: "How to verify defaults have been changed" },
  { id: "related", label: "Related" },
] as const;

export default function DefaultCredentialsPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Default credentials</h1>

      <p>Every BoothIQ kiosk ships with two default admin accounts. They have <strong>fixed default passwords</strong> and are flagged for <strong>forced password change</strong> on first sign-in.</p>

      <DocsCallout type="warning">
        <strong>Change both immediately.</strong> Don&apos;t open the
        booth to customers with the defaults in place.
      </DocsCallout>

      <h2 id="defaults">The defaults</h2>

      <ul>
        <li><code>admin</code> / <code>admin123</code>. <strong>Master</strong> access (full admin)</li>
        <li><code>user</code> / <code>user123</code>. <strong>User</strong> access (sales and basic credit operations only)</li>
      </ul>

      <p>Both accounts:</p>

      <ul>
        <li>Are created by BoothIQ during initial database setup</li>
        <li>Are flagged with <code>PINSetupRequired = true</code> (the first sign-in will route you to PIN setup after the password change)</li>
        <li>Are flagged as needing a password change on first sign-in</li>
        <li>Can be deleted or disabled later by a Master user</li>
      </ul>

      <h2 id="first-signin">What happens on first sign-in</h2>

      <p>When you sign in with either default account for the first time:</p>

      <ol>
        <li>The booth recognizes the account is using the default password.</li>
        <li>Instead of going to the dashboard, it routes you to the <strong>Forced Password Change</strong> screen.</li>
        <li>You set a new password.</li>
        <li>It then routes you to <strong>PIN Setup</strong>.</li>
        <li>You set a recovery PIN.</li>
        <li><strong>Then</strong> you land on the dashboard.</li>
      </ol>

      <p>You only get this forced flow once per account. After that, sign-ins go straight to the dashboard.</p>

      <h2 id="where-change">Where to change them</h2>

      <p>
        In the Settings tab → <strong>Security &amp; Users</strong>{" "}
        card → <strong>Change My Password</strong> form. You can also
        use the same form to change your password later (after the
        initial forced change).
      </p>

      <p>
        For full instructions, see{" "}
        <Link href="/docs/getting-started/first-login-and-password">
          First login and password
        </Link>
        .
      </p>

      <h2 id="what-to-do">What you should do (in order)</h2>

      <ol>
        <li><strong>Sign in to admin as <code>admin</code> / <code>admin123</code>.</strong></li>
        <li><strong>Change the <code>admin</code> password</strong> to something strong.</li>
        <li><strong>Set up a recovery PIN</strong> for the <code>admin</code> account.</li>
        <li><strong>Sign out</strong> (Exit Admin button).</li>
        <li><strong>Sign in as <code>user</code> / <code>user123</code>.</strong></li>
        <li><strong>Change the <code>user</code> password.</strong></li>
        <li><strong>Set up a recovery PIN</strong> for the <code>user</code> account.</li>
        <li><strong>Sign out.</strong></li>
      </ol>

      <p>Then store both passwords (and both PINs) in a password manager.</p>

      <h2 id="no-user-account">What if I don&apos;t need the <code>user</code> account?</h2>

      <p>If you have no use for a User-level account (e.g. you&apos;re a one-person operation and don&apos;t have staff who need limited access), you can either:</p>

      <ul>
        <li><strong>Change the <code>user</code> password</strong> to something strong (recommended. Leaves the account available if you ever need it)</li>
        <li><strong>Disable the <code>user</code> account</strong> in the User Management section (Settings tab). Master access required to do this</li>
      </ul>

      <p>Don&apos;t leave <code>user</code> / <code>user123</code> in place. The default password is the same on every BoothIQ booth and is the first thing an attacker would try.</p>

      <h2 id="other-defaults">Other default values to know</h2>

      <p>For reference, a few other things that ship with default values:</p>

      <ul>
        <li><strong>Operation mode.</strong> Coin Operated. Change in Settings tab</li>
        <li><strong>Save photos.</strong> (varies by version). Change in Settings → Photo Storage</li>
        <li><strong>Show logo on prints.</strong> Off until you upload a logo. Change in Settings → Business Information</li>
        <li><strong>Hardware watchdog.</strong> On. Change in Settings → Hardware Error Screen</li>
        <li><strong>Sync from cloud.</strong> Off. Change in Settings → Business Information</li>
        <li><strong>Cloud API URL (manual registration).</strong> <code>http://127.0.0.1:8000</code> (development default). Change in Cloud Sync tab → Manual Registration</li>
      </ul>

      <p>You don&apos;t need to change every default. Most are sensible. But the admin passwords are non-negotiable.</p>

      <h2 id="why-documented">Why are the defaults documented?</h2>

      <p>Because pretending they don&apos;t exist isn&apos;t security. It&apos;s security theater. The default credentials are in:</p>

      <ul>
        <li>This doc set</li>
        <li>The BoothIQ source code</li>
        <li>Public installer materials</li>
        <li>Support team materials</li>
      </ul>

      <p>Anyone who wants to find them can. The actual security comes from <strong>forcing a change on first login</strong> and <strong>tracking which booths still have default passwords</strong> so they can be flagged.</p>

      <h2 id="verify">How to verify defaults have been changed</h2>

      <p>There&apos;s no built-in &quot;show me which booths have default passwords&quot; report on the kiosk. But you can verify your specific booth by:</p>

      <ol>
        <li>Trying to sign in as <code>admin</code> / <code>admin123</code>. If it works, the password hasn&apos;t been changed. <strong>Change it immediately.</strong></li>
        <li>Trying to sign in as <code>user</code> / <code>user123</code>. Same check.</li>
        <li>Confirming neither account routes you to a Forced Password Change screen. Meaning both accounts are using changed passwords.</li>
      </ol>

      <p>For a managed fleet, your cloud dashboard may have a &quot;booths still using defaults&quot; alert. Check there.</p>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>
          . Step-by-step first-login walkthrough.
        </li>
        <li>
          <Link href="/docs/security-and-compliance/admin-account-best-practices">
            Admin account best practices
          </Link>
          . How to pick a good replacement password.
        </li>
        <li>
          <Link href="/docs/troubleshooting/locked-out-of-admin">
            Locked out of admin
          </Link>
          . When you forget the new password.
        </li>
      </ul>
    </DocsLayout>
  );
}
