import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Admin account best practices — BoothIQ Docs",
  description:
    "Strong passwords, recovery PINs, separating Master from User accounts, and never leaving admin unattended.",
};

const HREF = "/docs/security-and-compliance/admin-account-best-practices";

const TOC = [
  { id: "most-important", label: "The single most important rule" },
  { id: "password-rules", label: "Password rules" },
  { id: "password-manager", label: "Use a password manager" },
  { id: "recovery-pin", label: "Set up the recovery PIN" },
  { id: "master-vs-user", label: "Master vs User accounts" },
  { id: "dont-share", label: "Don't share admin accounts" },
  { id: "never-unattended", label: "Never leave admin unattended" },
  { id: "shoulder", label: "Watch for shoulder surfing" },
  { id: "rotate", label: "Change passwords periodically" },
  { id: "failed-logins", label: "Watch for failed login attempts" },
  { id: "dont-write", label: "Don't write passwords near the kiosk" },
  { id: "verify", label: "Verify your security setup" },
  { id: "common-mistakes", label: "Common security mistakes" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function AdminAccountBestPracticesPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Admin account best practices</h1>

      <p>
        The admin dashboard controls everything about your booth.
        Prices, sales data, hardware config, customer photos. If
        someone unauthorized gets in, they can drain credits, change
        prices, or read your sales history. This article covers the
        practices that prevent that.
      </p>

      <p><strong>Who this is for:</strong> Every operator with admin access.</p>

      <h2 id="most-important">The single most important rule</h2>

      <DocsCallout type="warning">
        <strong>Change the default passwords immediately.</strong>{" "}
        Don&apos;t leave the booth running with{" "}
        <code>admin / admin123</code> and <code>user / user123</code>{" "}
        for even one customer session.
      </DocsCallout>

      <p>
        The defaults are documented (in this doc set, in support
        materials, in the source code) and are the first thing anyone
        trying to break into a BoothIQ booth would try. Change them as
        part of{" "}
        <Link href="/docs/getting-started/first-login-and-password">
          First login and password
        </Link>
        .
      </p>

      <h2 id="password-rules">Password rules</h2>

      <p>A good admin password:</p>

      <ul>
        <li><strong>At least 12 characters long.</strong> Longer is better.</li>
        <li><strong>Mixes letter case</strong> (upper and lower).</li>
        <li><strong>Includes digits and symbols.</strong></li>
        <li><strong>Is not a dictionary word</strong> or a common phrase.</li>
        <li><strong>Is unique.</strong> Not reused from your email, your bank, or your other accounts.</li>
        <li><strong>Is stored in a password manager</strong>, not on a sticky note next to the booth.</li>
      </ul>

      <p>Examples of bad passwords:</p>

      <ul>
        <li><code>admin123</code> (the default. Never use this)</li>
        <li><code>password</code>, <code>password123</code>, <code>Password!</code></li>
        <li><code>boothiq</code>, <code>BoothIQ2024</code></li>
        <li>Your business name</li>
        <li>Your phone number, your birthday</li>
        <li>Anything a customer might guess by looking at the booth</li>
      </ul>

      <h2 id="password-manager">Use a password manager</h2>

      <p>The best thing you can do for your booth&apos;s security is use a password manager:</p>

      <ul>
        <li><strong>For yourself:</strong> 1Password, Bitwarden, KeePass, your browser&apos;s built-in password manager. Any of them is fine</li>
        <li><strong>For your team:</strong> a shared vault in 1Password, Bitwarden, etc., so multiple operators can have the same booth password without exchanging it over Slack or text</li>
      </ul>

      <p>Don&apos;t write the password on the kiosk itself. Customers will see it.</p>

      <h2 id="recovery-pin">Set up the recovery PIN</h2>

      <p>Every admin account on a BoothIQ booth has a <strong>Recovery PIN</strong>. A 4-6 digit number that lets you reset the password if you forget it. The default <code>PINSetupRequired</code> flag for new accounts is <code>true</code>, meaning the booth will force you to set up a PIN on first sign-in.</p>

      <p><strong>Pick a good PIN:</strong></p>

      <ul>
        <li>Not <code>0000</code>, <code>1234</code>, <code>1111</code>, <code>9999</code></li>
        <li>Not your birthday or phone number</li>
        <li>Memorable to you, opaque to anyone else</li>
      </ul>

      <p><strong>Where to store it:</strong> Same place as your password. Your password manager. Each admin user has their own PIN; track them separately.</p>

      <p>
        For the recovery flow, see{" "}
        <Link href="/docs/troubleshooting/locked-out-of-admin">
          Locked out of admin
        </Link>
        .
      </p>

      <h2 id="master-vs-user">Master vs User accounts</h2>

      <p>BoothIQ has two access levels:</p>

      <ul>
        <li><strong>Master.</strong> Everything: settings, products, templates, hardware, sync, user management</li>
        <li><strong>User.</strong> Limited: sales reports and basic credit operations</li>
      </ul>

      <p>Use them appropriately:</p>

      <ul>
        <li><strong>Reserve Master access for yourself and trusted technical staff.</strong> Master accounts can change prices, delete templates, regenerate API keys. They can really mess up the booth.</li>
        <li><strong>Give User access to floor staff and venue managers</strong> who need to see sales but shouldn&apos;t be touching products or templates.</li>
        <li><strong>Don&apos;t share one Master account between multiple people.</strong> If you have multiple staff who need admin access, create separate accounts for each.</li>
      </ul>

      <h2 id="dont-share">Don&apos;t share admin accounts</h2>

      <p>Each admin user should have their <strong>own account</strong>. Reasons:</p>

      <ul>
        <li><strong>Audit trail.</strong> When someone makes a change, the booth knows who did it.</li>
        <li><strong>Different PINs.</strong> Each user has their own recovery PIN. If one user forgets theirs, the others aren&apos;t affected.</li>
        <li><strong>Account-level lockout.</strong> If one user is brute-forcing the password (or fat-fingering it), the booth locks <strong>that user</strong>, not all of admin.</li>
        <li><strong>Easier offboarding.</strong> When a staff member leaves, you delete their account. You don&apos;t have to change every other admin&apos;s password.</li>
      </ul>

      <p>To create new admin accounts, sign in as a Master user and use the Settings tab → User management area.</p>

      <h2 id="never-unattended">Never leave admin unattended</h2>

      <p>When you&apos;re done in admin, <strong>always tap Exit Admin</strong> at the bottom of the sidebar. Never:</p>

      <ul>
        <li>Walk away from the kiosk with the admin dashboard up</li>
        <li>Leave the kiosk on the admin login screen mid-session</li>
        <li>Let a customer &quot;help themselves&quot; if they ask to &quot;look at the settings&quot;</li>
      </ul>

      <p>If you need to step away briefly, exit admin first. Re-signing in only takes a few seconds.</p>

      <h2 id="shoulder">Watch for shoulder surfing</h2>

      <p>When you&apos;re typing the admin password on the kiosk, <strong>watch for people behind you</strong> who might see what you&apos;re typing. The on-screen virtual keyboard is large and visible from a distance.</p>

      <ul>
        <li>Stand between the screen and any onlookers</li>
        <li>Use the password show/hide eye toggle judiciously (hide when typing, show only briefly to verify)</li>
        <li>Don&apos;t sign in to admin while a curious customer is hovering</li>
      </ul>

      <h2 id="rotate">Change passwords periodically</h2>

      <p>Best practice for any system:</p>

      <ul>
        <li><strong>Change all admin passwords every 90 days</strong> (or whenever a staff member with access leaves)</li>
        <li><strong>Change immediately</strong> if you suspect a breach (someone saw the password, the kiosk was unattended in admin mode, etc.)</li>
        <li><strong>Re-set the recovery PIN</strong> when you change the password</li>
      </ul>

      <p>If you have multiple booths, you can use the <strong>same password across booths</strong> if it&apos;s secured in a shared password manager. But consider the trade-off. If one booth&apos;s password leaks, all your booths are exposed.</p>

      <h2 id="failed-logins">Watch for failed login attempts</h2>

      <p>BoothIQ&apos;s rate limiter locks out an account after several failed attempts. If you sign in and notice you&apos;re being told the account was recently locked (or you see suspicious failed-login activity), someone may have been trying to brute-force the password.</p>

      <p>If this happens:</p>

      <ol>
        <li><strong>Change the password immediately.</strong></li>
        <li><strong>Set a fresh recovery PIN.</strong></li>
        <li><strong>Investigate.</strong> Was the kiosk in an unsecured area? Was it left in admin mode? Is there a customer or staff member who&apos;s been trying to get in?</li>
        <li>(If serious) Contact support and have them check the audit logs.</li>
      </ol>

      <h2 id="dont-write">Don&apos;t write passwords near the kiosk</h2>

      <p>This might seem obvious, but it&apos;s the single most common security failure on physical kiosks:</p>

      <ul>
        <li>Don&apos;t tape the password to the kiosk</li>
        <li>Don&apos;t write it on a sticky note next to the cash box</li>
        <li>Don&apos;t put it in a &quot;manual&quot; left at the venue</li>
        <li>Don&apos;t share it via SMS / Slack / email and leave the message visible</li>
      </ul>

      <p>Use a password manager. Always.</p>

      <h2 id="verify">Verify your security setup</h2>

      <p>You&apos;re following best practices when:</p>

      <ul>
        <li>The default <code>admin</code> and <code>user</code> passwords have been changed</li>
        <li>Each admin user has a unique recovery PIN set up</li>
        <li>Master access is limited to people who need it</li>
        <li>No passwords are written down anywhere physically near the booth</li>
        <li>You exit admin mode before walking away</li>
        <li>Your password is in a password manager</li>
      </ul>

      <h2 id="common-mistakes">Common security mistakes</h2>

      <p><strong>Leaving default passwords.</strong></p>
      <p>Anyone with internet access knows your password.</p>

      <p><strong>Sharing one admin account between staff.</strong></p>
      <p>No audit trail; offboarding is painful.</p>

      <p><strong>Writing the password on the kiosk.</strong></p>
      <p>Customers see it.</p>

      <p><strong>Leaving admin mode up unattended.</strong></p>
      <p>Random people get full access.</p>

      <p><strong>Using a weak PIN like <code>1234</code>.</strong></p>
      <p>Anyone can reset your password.</p>

      <p><strong>Reusing the booth password elsewhere.</strong></p>
      <p>A breach in another system compromises the booth.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/security-and-compliance/master-password-system">
            The master password system
          </Link>
          . Emergency access when normal login fails.
        </li>
        <li>
          <Link href="/docs/security-and-compliance/data-and-privacy">
            Data and privacy
          </Link>
          . What&apos;s stored about customers.
        </li>
        <li>
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>
          . Setting up your account correctly the first time.
        </li>
      </ul>
    </DocsLayout>
  );
}
