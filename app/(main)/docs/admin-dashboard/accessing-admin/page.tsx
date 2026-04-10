import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Accessing admin mode — BoothIQ Docs",
  description:
    "How to reach the BoothIQ admin dashboard from a customer-facing screen and sign in.",
};

const HREF = "/docs/admin-dashboard/accessing-admin";

const TOC = [
  { id: "five-tap", label: "The 5-tap sequence" },
  { id: "login-screen", label: "The admin login screen" },
  { id: "signing-in", label: "Signing in" },
  { id: "access-levels", label: "Access levels" },
  { id: "exiting", label: "Exiting admin" },
  { id: "common-problems", label: "Common problems" },
  { id: "best-practices", label: "Security best practices" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function AccessingAdminPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Accessing admin mode</h1>

      <p>
        The admin dashboard is hidden from customers. There is no
        visible button labeled &quot;admin&quot; on the welcome screen.
        That&apos;s by design, so curious customers can&apos;t poke
        around in your settings. To get into admin you do a hidden
        5-tap sequence and then sign in with a username and password.
      </p>

      <p>
        <strong>Who this is for:</strong> Every operator. This is the
        first thing you&apos;ll do in the admin dashboard, every time.
      </p>

      <h2 id="five-tap">The 5-tap sequence</h2>

      <p>
        The trigger for the admin login screen is{" "}
        <strong>5 quick taps on the credits indicator</strong>.
      </p>

      <p>
        The credits indicator is the small label that shows the
        customer&apos;s current credit balance (or &quot;Free Play&quot;
        in free play mode). It appears in the corner of the welcome
        screen and on most customer-facing screens.
      </p>

      <p><strong>Rules for the tap sequence:</strong></p>

      <ul>
        <li>All 5 taps must land <strong>within about 3 seconds</strong>.</li>
        <li>Taps that are too slow are ignored. Start over.</li>
        <li>The taps must land on (or very near) the credits indicator. Tapping elsewhere on the screen does nothing.</li>
        <li>The sequence works on the welcome screen and on the product selection screen. It does not work mid-session (during capture, edit, or payment).</li>
      </ul>

      <p>
        After the fifth valid tap, the customer-facing screen is
        replaced by the <strong>Admin Login Screen</strong>.
      </p>

      <DocsScreenshot
        src="welcome-screen-credits-indicator.png"
        alt="Welcome screen with the credits indicator highlighted in the corner."
      />

      <h2 id="login-screen">The admin login screen</h2>

      <p>The admin login screen has:</p>

      <ul>
        <li>A <strong>Username</strong> field</li>
        <li>A <strong>Password</strong> field with a show/hide eye toggle</li>
        <li>A <strong>Sign In</strong> button (default text: &quot;Sign In&quot;)</li>
        <li>A <strong>Close</strong> / <strong>Cancel</strong> button (returns the booth to the welcome screen)</li>
        <li>A <strong>Forgot Password?</strong> link (triggers the recovery flow, see <strong>Locked out of admin</strong> <em>(coming soon)</em>)</li>
      </ul>

      <p>The on-screen virtual keyboard appears automatically when you tap a field.</p>

      <DocsScreenshot
        src="admin-login-screen.png"
        alt="Admin login screen with the on-screen virtual keyboard."
      />

      <h2 id="signing-in">Signing in</h2>

      <ol>
        <li>Tap the <strong>Username</strong> field. The keyboard appears.</li>
        <li>Type your username (e.g. <code>admin</code>).</li>
        <li>Tap the <strong>Password</strong> field.</li>
        <li>Type your password. Tap the eye icon to verify what you typed if you need to.</li>
        <li>Tap <strong>Sign In</strong>.</li>
      </ol>

      <p>What happens next depends on your account state:</p>

      <ul>
        <li><strong>Normal account, correct password.</strong> You go straight to the admin dashboard, landing on the <strong>Sales &amp; Analytics</strong> tab</li>
        <li><strong>First sign-in to a default account</strong> (<code>admin</code> / <code>admin123</code>). You&apos;re routed to the <strong>Forced Password Change</strong> screen, change the password before you can do anything else</li>
        <li><strong>Account with <code>PINSetupRequired = true</code>.</strong> After password change, you&apos;re routed to <strong>PIN Setup</strong> to create a recovery PIN</li>
        <li><strong>Wrong password.</strong> Error message; after several wrong attempts the account is <strong>rate-limited</strong> and you&apos;re locked out for a number of minutes</li>
        <li><strong>Account disabled.</strong> Error message; contact a Master admin to re-enable</li>
      </ul>

      <h2 id="access-levels">Access levels</h2>

      <p>BoothIQ has two access levels:</p>

      <ul>
        <li><strong>Master.</strong> Full access to every tab and every setting. Can create, edit, and delete other admin accounts</li>
        <li><strong>User.</strong> Limited access (sales reports and basic credit operations). Cannot change products, templates, settings, or hardware config</li>
      </ul>

      <p>
        The default <code>admin</code> account is <strong>Master</strong>.
        The default <code>user</code> account is <strong>User</strong>.
        You see your current access level in the sidebar header (e.g.
        an &quot;Administrator&quot; label and a &quot;Full
        Access&quot; badge for Master).
      </p>

      <h2 id="exiting">Exiting admin</h2>

      <p>
        When you&apos;re done in admin, tap <strong>Exit Admin</strong>{" "}
        at the bottom of the sidebar. This returns the booth to the
        customer-facing welcome screen and the next 5-tap sequence will
        require a fresh sign-in.
      </p>

      <DocsCallout type="warning">
        <strong>Always exit admin before walking away from the booth.</strong>
        {" "}Leaving the dashboard up unattended is a security risk.
        Anyone who walks up to the kiosk has full access without
        needing the password.
      </DocsCallout>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>5-tap sequence does nothing.</strong></p>
      <p>Taps too slow, or taps not on the credits indicator. Tap faster, and make sure all 5 taps land on the credits label.</p>

      <p><strong>Login screen appears but the Sign In button does nothing.</strong></p>
      <p>The Username or Password field is empty. Tap each field, type the value, then Sign In.</p>

      <p><strong>&quot;Invalid credentials&quot; with the right password.</strong></p>
      <p>Caps shift accidentally on (check the virtual keyboard&apos;s shift state), or you&apos;re using the wrong account. Tap shift to lower-case and try again. If still failing, you may have changed the password and forgotten. See <strong>Locked out of admin</strong> <em>(coming soon)</em>.</p>

      <p><strong>&quot;Account locked&quot; message.</strong></p>
      <p>Too many failed attempts. Wait the number of minutes shown on screen and try again.</p>

      <p><strong>You signed in but landed on a Forced Password Change screen.</strong></p>
      <p>
        Default account, never changed. Change the password before
        doing anything else (see{" "}
        <Link href="/docs/getting-started/first-login-and-password">
          First login and password
        </Link>
        ).
      </p>

      <h2 id="best-practices">Security best practices</h2>

      <ul>
        <li><strong>Change all default passwords</strong> on first sign-in. Don&apos;t leave <code>admin123</code> or <code>user123</code> in place.</li>
        <li><strong>Use a strong password.</strong> A password manager makes this easy.</li>
        <li><strong>Set up your recovery PIN</strong> during first-time setup. It&apos;s the difference between a 5-second password reset and a support call.</li>
        <li><strong>Don&apos;t share admin accounts</strong> between staff. Create separate User-level accounts for staff who only need sales reports.</li>
        <li><strong>Always exit admin</strong> when you&apos;re done. Never leave the dashboard up unattended.</li>
        <li><strong>Don&apos;t write the password on the kiosk.</strong> Customers will see it.</li>
      </ul>

      <p>
        See <strong>Security › Admin account best practices</strong>{" "}
        <em>(coming soon)</em> for more.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/dashboard-overview">
            Dashboard overview
          </Link>
          . Tour the sidebar, header bar, and pills.
        </li>
      </ul>
    </DocsLayout>
  );
}
