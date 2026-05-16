import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BoothIQ collects, uses, and protects your information.",
};

const TOC = [
  { id: "introduction", label: "Introduction" },
  { id: "information-we-collect", label: "1. Information We Collect" },
  { id: "how-we-use", label: "2. How We Use It" },
  { id: "legal-bases", label: "3. Legal Bases (GDPR)" },
  { id: "how-we-share", label: "4. How We Share It" },
  { id: "transfers", label: "5. International Transfers" },
  { id: "retention", label: "6. Data Retention" },
  { id: "security", label: "7. Security" },
  { id: "your-rights", label: "8. Your Rights and Choices" },
  { id: "children", label: "9. Children's Privacy" },
  { id: "cookies", label: "10. Cookies" },
  { id: "changes", label: "11. Changes to This Policy" },
  { id: "contact", label: "12. Contact Us" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-8 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Legal
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Last updated: May 16, 2026
          </p>
        </div>
      </section>

      {/* Table of contents */}
      <section className="px-6 pb-8">
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)] mb-4">
            Contents
          </h2>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[#069494] hover:text-[#0EC7C7] transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 pb-24">
        <div className="prose max-w-3xl mx-auto">
          <h2 id="introduction">Introduction</h2>
          <p>
            Your privacy matters to us. This Privacy Policy explains the
            personal data <strong>BoothIQ</strong> (<strong>we</strong>,{" "}
            <strong>us</strong>) processes when you use our cloud dashboard,
            mobile apps, and booth software (together, the{" "}
            <strong>Service</strong>), why we process it, and the choices you
            have. If you have questions, email{" "}
            <a href="mailto:privacy@boothiq.com">privacy@boothiq.com</a>.
          </p>
          <p>
            We aim to collect only what we need to run the Service. We
            don&apos;t run third-party analytics, advertising networks, or
            behavior trackers. We don&apos;t sell your data.
          </p>

          <h2 id="information-we-collect">1. Information We Collect</h2>
          <p>
            You provide some of this data directly. We collect some
            automatically when you use the Service. Your booths send some of
            it to your account.
          </p>

          <h3>Account information</h3>
          <p>
            When you sign up we collect your <strong>first name</strong>,{" "}
            <strong>last name</strong>, <strong>email address</strong>, and a{" "}
            <strong>password</strong>. We store passwords as one-way hashes,
            not in plaintext.
          </p>

          <h3>Subscription and billing</h3>
          <p>
            Payments are processed by <strong>Stripe</strong>. We receive
            your subscription status, plan tier, and the last four digits of
            the payment method so we can show your billing state in the
            dashboard. We never see or store your full card number, expiry,
            or bank details. For example, when you subscribe a booth, Stripe
            tells us &quot;active, Pro plan, card ending 4242&quot; and
            nothing more. Stripe&apos;s handling of your payment information
            is governed by{" "}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              Stripe&apos;s Privacy Policy
            </a>
            .
          </p>

          <h3>Content you upload</h3>
          <p>
            You can upload your <strong>account logo</strong> and{" "}
            <strong>per-booth branding logos</strong>. These files are stored
            on AWS S3 so they can be served back to your booths
            and dashboard.
          </p>

          <h3>Booth telemetry</h3>
          <p>
            Your booths send operational data to your account: revenue
            totals, transaction counts, payment-method breakdowns, supply
            levels, and booth configuration. For example, when a customer
            pays for a print at the booth, the booth records the transaction
            locally and then syncs it to your account so you can see it on
            your dashboard. We use this data to power your account. We
            don&apos;t share it outside your account.
          </p>

          <h3>Communications</h3>
          <p>
            When you contact us by email or through the contact form, we
            keep your message, your name and email, and any reply we send,
            so we can follow up if there&apos;s a next step.
          </p>

          <h3>Automatically collected</h3>
          <p>
            When you use the Service we collect basic technical information:{" "}
            <strong>IP address</strong>, <strong>browser and device type</strong>,{" "}
            <strong>request timestamps</strong>, and{" "}
            <strong>error logs</strong>. We keep this for a short period to
            operate the Service securely. We do not run third-party
            analytics, advertising trackers, or behavior beacons.
          </p>

          <h2 id="how-we-use">2. How We Use It</h2>
          <p>We use the data we collect to:</p>
          <ul>
            <li><strong>Provide the Service.</strong> Run your dashboard, sync your booths, and keep your account working.</li>
            <li><strong>Process subscriptions.</strong> Bill your plan, manage renewals and cancellations, and handle payment recovery.</li>
            <li><strong>Secure your account.</strong> Detect and prevent fraud, abuse, and unauthorized access.</li>
            <li><strong>Communicate with you.</strong> Send transactional messages about your account, billing, security, and material product changes.</li>
            <li><strong>Respond to support.</strong> Answer your questions and follow up.</li>
            <li><strong>Improve the Service.</strong> Diagnose bugs, monitor reliability, and decide what to build next.</li>
            <li><strong>Comply with the law.</strong> Meet our legal, regulatory, and tax obligations.</li>
          </ul>

          <h2 id="legal-bases">3. Legal Bases (GDPR)</h2>
          <p>
            If you are in the European Economic Area, the United Kingdom, or
            another jurisdiction that requires a legal basis for processing,
            we rely on:
          </p>
          <ul>
            <li><strong>Contract performance.</strong> Processing required to deliver the Service you signed up for.</li>
            <li><strong>Legitimate interest.</strong> Security, fraud prevention, and product reliability.</li>
            <li><strong>Consent.</strong> Any optional communications, where consent is required.</li>
            <li><strong>Legal obligation.</strong> Tax, accounting, and compliance requests.</li>
          </ul>

          <h2 id="how-we-share">4. How We Share It</h2>
          <p>
            We do not sell your personal information, and we do not share it
            with advertisers. We share information only with the service
            providers that operate parts of our stack:
          </p>
          <ul>
            <li><strong>Stripe.</strong> Payment processing and subscription management.</li>
            <li><strong>Upstash.</strong> Redis-based rate limiting on sign-in. We store counters keyed by IP and account identifier. No profile data is stored in Redis.</li>
            <li><strong>DigitalOcean.</strong> Hosting the web application and APIs.</li>
            <li><strong>AWS S3.</strong> Storing uploaded logos.</li>
          </ul>
          <p>
            We also read public release metadata from <strong>GitHub</strong>&apos;s
            API to populate our changelog page. No user data is sent to
            GitHub.
          </p>
          <p>
            We may share information when required by law, in response to a
            valid legal process, or to protect the rights, safety, or
            property of BoothIQ, our users, or the public.
          </p>

          <h2 id="transfers">5. International Transfers</h2>
          <p>
            BoothIQ may be operated from, and the providers above may
            process data in, countries different from your own. Where
            required by law we rely on appropriate safeguards such as
            standard contractual clauses.
          </p>

          <h2 id="retention">6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is
            active. If you close your account we delete your account data
            within [30 days], with these exceptions:
          </p>
          <ul>
            <li>Billing and tax records are retained for [7 years] to meet accounting and tax obligations.</li>
            <li>Server and security logs are rotated after [30/90 days].</li>
            <li>Anything we are required to retain by law.</li>
          </ul>

          <h2 id="security">7. Security</h2>
          <p>
            We use industry-standard practices to protect your data.
            Passwords are hashed. Connections to the Service use HTTPS.
            Authentication tokens are stored in HttpOnly secure cookies. We
            review our code and dependencies regularly. No system is
            perfectly secure, so we encourage you to use a strong, unique
            password and keep your account credentials safe. If you suspect
            your account has been compromised, contact{" "}
            <a href="mailto:support@boothiq.com">support@boothiq.com</a>{" "}
            right away.
          </p>

          <h2 id="your-rights">8. Your Rights and Choices</h2>
          <p>
            You have choices about your data. Depending on where you live,
            you may have the following rights:
          </p>
          <ul>
            <li><strong>Access.</strong> You can request a copy of the data we hold about you.</li>
            <li><strong>Correct.</strong> You can correct data that is inaccurate or incomplete. Most account fields you can edit yourself from the dashboard.</li>
            <li><strong>Delete.</strong> You can request deletion, subject to legal retention requirements.</li>
            <li><strong>Restrict or object.</strong> You can restrict or object to certain processing.</li>
            <li><strong>Portability.</strong> You can receive your data in a portable format.</li>
            <li><strong>Withdraw consent.</strong> Where processing relies on consent, you can withdraw it.</li>
          </ul>
          <p>
            If you are a California resident, the CCPA gives you the right
            to know what information we collect, the right to delete it, the
            right to opt out of sale (we don&apos;t sell), and the right not
            to be discriminated against for exercising these rights.
          </p>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:privacy@boothiq.com">privacy@boothiq.com</a>.
            You also have the right to lodge a complaint with your local
            data protection authority.
          </p>

          <h2 id="children">9. Children&apos;s Privacy</h2>
          <p>
            The Service is not directed at children under 16 (or under 13
            in the United States) and we don&apos;t knowingly collect
            personal data from them. If you believe a child has provided us
            with personal information, contact us so we can delete it.
          </p>

          <h2 id="cookies">10. Cookies</h2>
          <p>
            Cookies are small text files placed on your device when you use
            the Service. We use them to keep you signed in and to remember
            your session preferences. We don&apos;t use advertising or
            analytics cookies, and we don&apos;t use cookies for tracking
            you across other websites.
          </p>
          <p>
            All the cookies we set today are <strong>essential</strong> for
            the Service to function. Because they are essential, no cookie
            banner is required for them in most jurisdictions. If we ever
            add a non-essential cookie, we will ask for consent first and
            update this policy.
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-[var(--border)]">
                  <th className="py-2 pr-4 font-semibold">Cookie</th>
                  <th className="py-2 pr-4 font-semibold">Purpose</th>
                  <th className="py-2 pr-4 font-semibold">Duration</th>
                  <th className="py-2 font-semibold">HttpOnly</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4 font-mono text-xs"><code>auth_access_token</code></td>
                  <td className="py-2 pr-4">Authenticates your API requests.</td>
                  <td className="py-2 pr-4">7 or 30 days</td>
                  <td className="py-2">Yes</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4 font-mono text-xs"><code>auth_refresh_token</code></td>
                  <td className="py-2 pr-4">Renews your session when the access token expires.</td>
                  <td className="py-2 pr-4">7 or 30 days</td>
                  <td className="py-2">Yes</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4 font-mono text-xs"><code>auth_user</code></td>
                  <td className="py-2 pr-4">Renders your name and role in the UI.</td>
                  <td className="py-2 pr-4">7 or 30 days</td>
                  <td className="py-2">No</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs"><code>auth_remember</code></td>
                  <td className="py-2 pr-4">Tracks the remember-me preference for session length.</td>
                  <td className="py-2 pr-4">7 or 30 days</td>
                  <td className="py-2">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            You can clear these cookies at any time from your browser
            settings. If you clear <code>auth_access_token</code> or{" "}
            <code>auth_refresh_token</code> while signed in, you will be
            signed out and asked to sign in again.
          </p>

          <h2 id="changes">11. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. If we make material
            changes we will notify you by email or by an in-app notice
            before the changes take effect. The &quot;Last updated&quot;
            date at the top of the page shows when the policy was most
            recently revised. If you don&apos;t agree to the updated policy,
            you can close your account before it takes effect.
          </p>

          <h2 id="contact">12. Contact Us</h2>
          <p>
            Questions about this policy or about your data? Reach us at{" "}
            <a href="mailto:privacy@boothiq.com">privacy@boothiq.com</a> or
            write to:
          </p>
          <p>
            BoothIQ
            <br />
            [Registered Address]
          </p>
          <p className="text-sm mt-10">
            See also our{" "}
            <Link href="/terms">Terms of Service</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
