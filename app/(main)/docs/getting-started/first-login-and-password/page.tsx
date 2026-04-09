import type { Metadata } from "next";
import Link from "next/link";
import { DocsCallout, DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "First login and password — BoothIQ Docs",
  description:
    "Sign in to BoothIQ admin with the default account, change your password, and set up a recovery PIN.",
};

const HREF = "/docs/getting-started/first-login-and-password";

const TOC = [
  { id: "before-you-start", label: "Before you start" },
  { id: "the-two-default-accounts", label: "The two default accounts" },
  { id: "step-1", label: "Step 1: Open the admin login screen" },
  { id: "step-2", label: "Step 2: Sign in with the default account" },
  { id: "step-3", label: "Step 3: Change the password" },
  { id: "step-4", label: "Step 4: Set up your recovery PIN" },
  { id: "step-5", label: "Step 5: Land on the admin dashboard" },
  { id: "step-6", label: "Step 6: Change the user account password too" },
  { id: "verify-it-worked", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function FirstLoginAndPasswordPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>First login and password</h1>

      <p>
        After BoothIQ is installed and the welcome screen is up, you need
        to sign in to the admin dashboard at least once to change the
        default password and set up a recovery PIN. This article walks you
        through that.
      </p>

      <p>
        <strong>Who this is for:</strong> The operator or installer who
        just finished{" "}
        <Link href="/docs/getting-started/first-time-setup">
          First-time setup
        </Link>
        .
      </p>

      <DocsCallout type="warning" title="Do this before customers see the booth">
        The default admin password ships with every BoothIQ install. If
        you don&apos;t change it, anyone who knows the default can open
        your dashboard, change prices, and read your sales data.
      </DocsCallout>

      <h2 id="before-you-start">Before you start</h2>

      <ul>
        <li>BoothIQ is installed and the welcome screen is on the kiosk.</li>
        <li>You&apos;re physically at the kiosk (the admin dashboard is only reachable from the kiosk&apos;s own touchscreen).</li>
        <li>Pick a strong new admin password and a 4-6 digit recovery PIN before you sit down. You&apos;ll be prompted for both.</li>
      </ul>

      <h2 id="the-two-default-accounts">The two default accounts</h2>

      <p>
        BoothIQ ships with two default accounts. Both have fixed passwords
        on a fresh install, and both are flagged so the very first sign-in{" "}
        <strong>forces a password change</strong> before you can do
        anything else.
      </p>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Default password</th>
            <th>Access level</th>
            <th>Can do</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>admin</code></td>
            <td><code>admin123</code></td>
            <td><strong>Master</strong></td>
            <td>Everything: settings, products, templates, hardware, users, cloud sync</td>
          </tr>
          <tr>
            <td><code>user</code></td>
            <td><code>user123</code></td>
            <td><strong>User</strong></td>
            <td>Limited: sales reports, credit volume control</td>
          </tr>
        </tbody>
      </table>

      <p>
        You&apos;ll change both during this first-time setup. Use the{" "}
        <strong><code>admin</code></strong> account to do it — Master access
        is what you need to set up the rest of the booth.
      </p>

      <h2 id="step-1">Step 1: Open the admin login screen</h2>

      <p>The admin dashboard is hidden from customers. To reach it from the welcome screen:</p>

      <ol>
        <li>
          Look for the <strong>credits indicator</strong> in the corner of
          the welcome screen (or the product selection screen — it works on
          both).
        </li>
        <li>
          <strong>Tap it 5 times in quick succession</strong> (within about
          3 seconds between taps).
        </li>
        <li>
          A login screen will appear with <strong>Username</strong>,{" "}
          <strong>Password</strong>, and a <strong>Sign In</strong> button.
        </li>
      </ol>

      <p>
        If nothing happens after 5 taps, try again — you may have spaced
        the taps too far apart. The 5-tap sequence has to be quick or
        BoothIQ ignores it.
      </p>

      <DocsCallout type="note">
        The 5-tap sequence is intentionally undocumented for customers.
        Don&apos;t put a sticker on the booth telling people where it is.
      </DocsCallout>

      <h2 id="step-2">Step 2: Sign in with the default account</h2>

      <ol>
        <li>Tap the <strong>Username</strong> field. A virtual keyboard appears.</li>
        <li>Type <strong><code>admin</code></strong>.</li>
        <li>Tap the <strong>Password</strong> field.</li>
        <li>Type <strong><code>admin123</code></strong>.</li>
        <li>Tap <strong>Sign In</strong>.</li>
      </ol>

      <p>
        If the credentials are correct, BoothIQ recognizes that this is a
        setup account that has never been changed and immediately routes
        you to the <strong>Forced Password Change</strong> screen instead
        of the dashboard.
      </p>

      <DocsCallout type="note">
        <strong>You only get this forced flow once per account.</strong>{" "}
        After you change the password, the next sign-in goes straight to
        the dashboard.
      </DocsCallout>

      <h2 id="step-3">Step 3: Change the password</h2>

      <p>On the Forced Password Change screen:</p>

      <ol>
        <li>
          Type a strong <strong>new password</strong>. BoothIQ enforces
          minimum length and complexity rules; the screen will tell you if
          your password is too weak.
        </li>
        <li>
          Type the <strong>same password again</strong> in the confirm
          field.
        </li>
        <li>Tap <strong>Save</strong>.</li>
      </ol>

      <p>A few rules to keep in mind:</p>

      <ul>
        <li>Don&apos;t reuse <code>admin123</code> or any obvious variant.</li>
        <li>
          Don&apos;t share the password with venue staff who only need
          User-level access — give them the <code>user</code> account
          instead.
        </li>
        <li>
          Write the new password down somewhere outside the kiosk (a
          password manager is ideal). If you forget it and you haven&apos;t
          set up the recovery PIN yet, your only way back in is the master
          password recovery flow, which takes longer.
        </li>
      </ul>

      <h2 id="step-4">Step 4: Set up your recovery PIN</h2>

      <p>
        After you save the new password, BoothIQ will (by default) walk
        you straight into a <strong>PIN Setup</strong> screen. The recovery
        PIN is a 4-6 digit number that lets you reset the admin password
        from the kiosk if you ever forget it.
      </p>

      <ol>
        <li>Type a <strong>4-6 digit PIN</strong> that you&apos;ll remember.</li>
        <li>Type the <strong>same PIN</strong> again in the confirm field.</li>
        <li>Tap <strong>Save</strong>.</li>
      </ol>

      <p>A few rules:</p>

      <ul>
        <li>
          <strong>Don&apos;t use <code>0000</code>, <code>1234</code>, your phone number&apos;s last four, or anything else obvious.</strong>{" "}
          This PIN is what stands between you and a locked-out kiosk on a
          busy Saturday night.
        </li>
        <li>Write it down in the same place you wrote the new admin password.</li>
        <li>
          Each admin user has their own PIN. If you create more admin
          accounts later, each one needs its own PIN setup.
        </li>
      </ul>

      <h2 id="step-5">Step 5: Land on the admin dashboard</h2>

      <p>
        Once your password is changed and your PIN is saved, BoothIQ drops
        you into the <strong>admin dashboard</strong>. You&apos;ll see:
      </p>

      <ul>
        <li>
          A dark sidebar on the left with two sections —{" "}
          <strong>MAIN MENU</strong> (Sales &amp; Analytics, Credits,
          Products, Templates, Layouts) and <strong>SYSTEM</strong>{" "}
          (Settings, Diagnostics, Cloud Sync, WiFi).
        </li>
        <li>
          A header bar at the top showing the current tab name,{" "}
          <strong>hardware status pills</strong> for Camera, Printer, and
          PCB, the current operation <strong>Mode</strong> (Coin Operated
          or Free Play), and a <strong>Prints remaining</strong> indicator.
        </li>
        <li>
          An <strong>Exit Admin</strong> button at the bottom of the
          sidebar that takes you back to the customer welcome screen.
        </li>
      </ul>

      <p>
        You don&apos;t need to touch any of these tabs yet. We give each
        one its own article in the <strong>Admin Dashboard</strong>{" "}
        section <em>(coming soon)</em>. For now, just confirm the sidebar
        and the header bar look right.
      </p>

      <DocsCallout type="tip" title="The hardware pills are your friends">
        Green = the device is online. Red = the device is offline or
        faulted. If the camera or printer pill is red right now, jump to{" "}
        <Link href="/docs/getting-started/your-first-print">
          Your first print
        </Link>{" "}
        for a quick check, or to <strong>Troubleshooting</strong>{" "}
        <em>(coming soon)</em> for a full diagnosis.
      </DocsCallout>

      <h2 id="step-6">Step 6: Change the <code>user</code> account password too</h2>

      <p>
        The <code>user</code> account also has a default password
        (<code>user123</code>) and the same forced-change flag. If you give
        User-level access to staff, sign out of <code>admin</code>, sign
        in as <code>user</code> with <code>user123</code>, and walk through
        the same forced password change. Otherwise the default{" "}
        <code>user123</code> is sitting there as a back-door for anyone
        who knows BoothIQ&apos;s defaults.
      </p>

      <p>To sign out:</p>

      <ol>
        <li>From any tab, tap <strong>Exit Admin</strong> at the bottom of the sidebar.</li>
        <li>From the welcome screen, do the 5-tap sequence again.</li>
        <li>Sign in with <code>user</code> / <code>user123</code> and change the password.</li>
      </ol>

      <h2 id="verify-it-worked">Verify it worked</h2>

      <p>You&apos;re done when:</p>

      <ul>
        <li>You can sign in to admin with your <strong>new</strong> password (not <code>admin123</code>).</li>
        <li>The forced password change screen does <strong>not</strong> appear on subsequent sign-ins.</li>
        <li>You have a recovery PIN written down somewhere safe.</li>
        <li>
          The <code>user</code> account password has also been changed (or
          you&apos;ve intentionally disabled the <code>user</code> account
          in <strong>Settings → User management</strong>{" "}
          <em>(coming soon)</em>).
        </li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <table>
        <thead>
          <tr>
            <th>Symptom</th>
            <th>Likely fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>5-tap sequence does nothing</td>
            <td>Tap faster — all 5 taps need to land within ~3 seconds. Try again on a clean welcome screen.</td>
          </tr>
          <tr>
            <td>&quot;Invalid credentials&quot; with the default password</td>
            <td>Confirm caps lock is off and that you&apos;re typing <code>admin</code> (not <code>Admin</code>) and <code>admin123</code> (not <code>Admin123</code>).</td>
          </tr>
          <tr>
            <td>&quot;Account locked&quot; message</td>
            <td>Too many failed attempts in a row triggered the rate limiter. Wait the number of minutes shown on screen and try again with the right password.</td>
          </tr>
          <tr>
            <td>Forced password change screen rejects your new password</td>
            <td>Pick a stronger password — longer, with a mix of letters, digits, and symbols.</td>
          </tr>
          <tr>
            <td>You forget the new password before setting up a PIN</td>
            <td>Use the master password recovery flow (see <strong>Troubleshooting › Locked out of admin</strong> <em>(coming soon)</em>).</td>
          </tr>
        </tbody>
      </table>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/getting-started/your-first-print">
            Your first print
          </Link>{" "}
          — Run a complete end-to-end test, from welcome screen to a
          finished photo.
        </li>
      </ul>
    </DocsLayout>
  );
}
