import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../_data/sidebar";

export const metadata: Metadata = {
  title: "Security and Compliance — BoothIQ Docs",
  description:
    "Keeping admin accounts, customer data, and your booth secure.",
};

const HREF = "/docs/security-and-compliance";

const TOC = [
  { id: "articles-in-this-section", label: "Articles in this section" },
  { id: "who-this-section-is-for", label: "Who this section is for" },
  { id: "rules", label: "Quick rules to live by" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function SecurityIndexPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Security and Compliance</h1>

      <p>
        A photobooth kiosk lives in a public space and handles money,
        customer photos, and sometimes customer email addresses. This
        section covers what BoothIQ does for you automatically, what
        you should do as an operator, and what to tell customers if
        they ask about their data.
      </p>

      <h2 id="articles-in-this-section">Articles in this section</h2>

      <ol>
        <li>
          <Link href="/docs/security-and-compliance/admin-account-best-practices">
            Admin account best practices
          </Link>
          . Strong passwords, recovery PINs, separating Master from User accounts.
        </li>
        <li>
          <Link href="/docs/security-and-compliance/master-password-system">
            The master password system
          </Link>
          . Single-use emergency access for when normal login fails.
        </li>
        <li>
          <Link href="/docs/security-and-compliance/data-and-privacy">
            Data and privacy
          </Link>
          . What&apos;s stored on the kiosk, what&apos;s synced to the cloud, what happens to customer photos.
        </li>
        <li>
          <Link href="/docs/security-and-compliance/physical-security">
            Physical security
          </Link>
          . Securing the kiosk hardware itself.
        </li>
      </ol>

      <h2 id="who-this-section-is-for">Who this section is for</h2>

      <p>Every operator should read <strong>Admin account best practices</strong> at minimum. Operators in regulated venues (events with minors, corporate clients with NDAs, government venues) should also read <strong>Data and privacy</strong>.</p>

      <h2 id="rules">Quick rules to live by</h2>

      <ul>
        <li>
          <strong>Never</strong> give the default <code>admin</code> /{" "}
          <code>admin123</code> password to anyone. Change it
          immediately on first login (see{" "}
          <Link href="/docs/getting-started/first-login-and-password">
            First login and password
          </Link>
          ).
        </li>
        <li><strong>Do</strong> set up the recovery PIN. It&apos;s the difference between a 5-second password reset and a support call.</li>
        <li><strong>Don&apos;t</strong> share one admin account between multiple staff members. Create separate accounts at the User access level.</li>
        <li><strong>Do</strong> sign out of admin (Exit Admin button) when you&apos;re done. Never leave the booth in admin mode unattended.</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <p>For the technical details of the licensing and master password systems, see the developer documentation.</p>
    </DocsLayout>
  );
}
