import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing your use of BoothIQ.",
};

const TOC = [
  { id: "introduction", label: "Introduction" },
  { id: "accepting-terms", label: "1. Accepting These Terms" },
  { id: "who-can-use", label: "2. Who Can Use BoothIQ" },
  { id: "your-account", label: "3. Your Account" },
  { id: "the-service", label: "4. The Service" },
  { id: "billing", label: "5. Billing" },
  { id: "code-of-conduct", label: "6. Code of Conduct" },
  { id: "your-content", label: "7. Your Content" },
  { id: "our-ip", label: "8. Our IP" },
  { id: "third-party", label: "9. Third Party Services" },
  { id: "privacy", label: "10. Privacy" },
  { id: "warranty-disclaimer", label: "11. Warranty Disclaimer" },
  { id: "liability", label: "12. Limitation of Liability" },
  { id: "indemnification", label: "13. Indemnification" },
  { id: "termination", label: "14. Termination" },
  { id: "changes", label: "15. Changes to These Terms" },
  { id: "governing-law", label: "16. Governing Law" },
  { id: "general", label: "17. General" },
  { id: "contact", label: "18. Contact Us" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-8 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#069494]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#069494]/10 border border-[#069494]/20 text-[#069494] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Legal
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Published: May 16, 2026 · Effective: May 16, 2026
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
            These Terms of Service (the <strong>Terms</strong>) are a contract
            between you and <strong>BoothIQ</strong>{" "}
            (<strong>we</strong>, <strong>us</strong>) and govern your use of
            our cloud dashboard, mobile apps, desktop booth software, and any
            related services (together, the <strong>Service</strong>). Please
            read them. Your handling of personal data is described in our{" "}
            <Link href="/privacy">Privacy Policy</Link>, which is part of
            these Terms.
          </p>

          <h2 id="accepting-terms">1. Accepting These Terms</h2>
          <p>
            You accept these Terms by creating a BoothIQ account, by using
            the Service, or by continuing to use the Service after we notify
            you of a change. If you are accepting on behalf of a business,
            you confirm you have the authority to bind that business, and
            <strong> you</strong> in these Terms means that business and the
            individuals who use the Service for it.
          </p>

          <h2 id="who-can-use">2. Who Can Use BoothIQ</h2>
          <p>
            You must be at least 18 years old and legally able to enter
            contracts where you live. BoothIQ is designed for businesses that
            operate photo booths, and we may decline to provide the Service
            to anyone, for any reason, where permitted by law.
          </p>

          <h2 id="your-account">3. Your Account</h2>
          <ul>
            <li>Keep your credentials secure. You are responsible for everything that happens under your account.</li>
            <li>One person per account. Don&apos;t share accounts.</li>
            <li>Give us accurate sign-up information and keep it current.</li>
            <li>If you think your account has been compromised, contact <a href="mailto:support@boothiq.com">support@boothiq.com</a> right away.</li>
          </ul>

          <h2 id="the-service">4. The Service</h2>
          <p>
            BoothIQ provides operator software in three forms: a cloud
            dashboard, iOS and Android apps, and a desktop application that
            runs on each booth. We may add, change, or remove features over
            time. We will give you reasonable notice of changes that
            materially reduce the Service.
          </p>
          <p>
            Photo booth hardware is sold separately by BoothWorks. These
            Terms cover BoothIQ software only. Use of BoothWorks hardware is
            governed by the terms that ship with that hardware.
          </p>

          <h2 id="billing">5. Billing</h2>
          <p>
            BoothIQ uses a <strong>per-booth subscription</strong> model.
            Each booth you operate has its own active plan.
          </p>
          <ul>
            <li>Plans are billed monthly or annually in advance through Stripe.</li>
            <li>Subscriptions renew automatically until you cancel them.</li>
            <li>You can cancel from your dashboard at any time. Cancellation takes effect at the end of the current billing cycle. We don&apos;t prorate partial periods unless required by law.</li>
            <li>Fees are non-refundable for periods you have already paid for, unless required by law.</li>
            <li>If we change subscription prices, we will give you at least [30 days] notice before the change applies to your account.</li>
            <li>If your payment fails, we may suspend the affected booth until payment is updated.</li>
          </ul>

          <h2 id="code-of-conduct">6. Code of Conduct</h2>
          <p>While using the Service:</p>
          <ul>
            <li>Don&apos;t do anything illegal, or use the Service to host or transmit illegal content.</li>
            <li>Don&apos;t try to gain unauthorized access to other accounts, systems, or networks.</li>
            <li>Don&apos;t interfere with the operation of the Service, overload it, or probe it for vulnerabilities without our written permission.</li>
            <li>Don&apos;t reverse engineer, decompile, or disassemble the Service, except where this restriction is prohibited by law.</li>
            <li>Don&apos;t resell, rent, or sublicense access to the Service without our written permission.</li>
            <li>Don&apos;t use the Service to send spam, deceptive content, or malware.</li>
            <li>Don&apos;t use the Service to exploit, harm, or threaten to harm minors.</li>
          </ul>
          <p>
            If you break these rules, we may remove offending content,
            suspend or terminate your account, or refuse Service to you.
          </p>

          <h2 id="your-content">7. Your Content</h2>
          <p>
            You retain ownership of all content you upload to the Service,
            including logos and branding (<strong>Your Content</strong>). You
            grant BoothIQ a worldwide, non-exclusive, royalty-free license to
            host, store, transmit, display, and process Your Content solely
            to operate the Service for you. This license ends when Your
            Content is removed from the Service, except where we are
            required to retain it for legal reasons.
          </p>
          <p>
            You represent and warrant that you have all rights necessary to
            upload Your Content and that it doesn&apos;t infringe the rights
            of any third party.
          </p>

          <h2 id="our-ip">8. Our IP</h2>
          <p>
            The Service, including the software, design, logos, and other
            materials, is owned by BoothIQ and protected by
            intellectual-property laws. We grant you a limited,
            non-exclusive, non-transferable license to use the Service in
            accordance with these Terms. No other rights are granted by
            implication, estoppel, or otherwise.
          </p>

          <h2 id="third-party">9. Third Party Services</h2>
          <p>
            The Service relies on third-party providers, including Stripe
            for payments and DigitalOcean for hosting. Your use of
            those providers is also subject to their terms. We aren&apos;t
            responsible for third-party services we don&apos;t control. If a
            third-party service stops working, we will work to restore the
            affected parts of the Service or provide a workaround.
          </p>

          <h2 id="privacy">10. Privacy</h2>
          <p>
            Your handling of personal data is described in our{" "}
            <Link href="/privacy">Privacy Policy</Link>, which is
            incorporated into these Terms by reference.
          </p>

          <h2 id="warranty-disclaimer">11. Warranty Disclaimer</h2>
          <p className="uppercase">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;,
            WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM
            EXTENT PERMITTED BY LAW, BOOTHIQ DISCLAIMS ALL WARRANTIES,
            EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF
            DEALING OR USAGE OF TRADE. BOOTHIQ DOES NOT WARRANT THAT THE
            SERVICE WILL BE UNINTERRUPTED, SECURE, OR FREE FROM ERRORS OR
            THAT ANY DEFECTS WILL BE CORRECTED.
          </p>
          <p>
            Some jurisdictions don&apos;t allow the exclusion of implied
            warranties. In those jurisdictions, the exclusions above apply
            only to the extent permitted.
          </p>

          <h2 id="liability">12. Limitation of Liability</h2>
          <p className="uppercase">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, BOOTHIQ&apos;S TOTAL
            LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE
            TERMS OR THE SERVICE IS LIMITED TO THE FEES YOU PAID FOR THE
            AFFECTED SERVICE IN THE [12 MONTHS] BEFORE THE CLAIM AROSE.
            BOOTHIQ IS NOT LIABLE FOR ANY INDIRECT, INCIDENTAL,
            CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES, OR FOR LOST
            PROFITS, LOST REVENUES, LOSS OF DATA, OR BUSINESS INTERRUPTION,
            EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            Some jurisdictions don&apos;t allow the exclusion or limitation
            of certain damages. In those jurisdictions, our liability is
            limited to the smallest extent permitted by law.
          </p>

          <h2 id="indemnification">13. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless BoothIQ and
            its affiliates, officers, employees, and agents from any claim
            or demand (including reasonable legal fees) arising out of your
            use of the Service, your violation of these Terms, or Your
            Content.
          </p>

          <h2 id="termination">14. Termination</h2>
          <ul>
            <li>You can cancel your account from the dashboard at any time.</li>
            <li>We may suspend or terminate your access to the Service for material breach of these Terms, non-payment, suspected fraud, or when required by law.</li>
            <li>After termination you will have [30 days] to export Your Content. After that, Your Content may be deleted in accordance with the retention schedule in our <Link href="/privacy">Privacy Policy</Link>.</li>
            <li>Sections that by their nature should survive termination will survive, including ownership, disclaimers, limitation of liability, indemnification, and governing law.</li>
          </ul>

          <h2 id="changes">15. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material
            changes, we will give you at least [30 days] notice by email or
            in-app banner before the changes take effect. Your continued use
            of the Service after the effective date is your acceptance of
            the updated Terms. If you don&apos;t agree to the updated Terms,
            you can cancel your account before they take effect.
          </p>

          <h2 id="governing-law">16. Governing Law</h2>
          <p>
            These Terms are governed by the laws of [Governing Law
            Jurisdiction], without regard to its conflict-of-laws principles.
            Before bringing any formal action, you agree to first contact us
            at <a href="mailto:legal@boothiq.com">legal@boothiq.com</a> and
            attempt to resolve the dispute informally for at least 30 days.
          </p>

          <h2 id="general">17. General</h2>
          <ul>
            <li>These Terms, together with the Privacy Policy and any agreements you accept in the Service, are the entire agreement between you and BoothIQ on this subject.</li>
            <li>If any provision is found unenforceable, the rest remains in effect.</li>
            <li>Our failure to enforce a right is not a waiver of that right.</li>
            <li>You may not assign these Terms without our written consent. We may assign them in connection with a merger, acquisition, or sale of assets.</li>
            <li>Notices to us should be sent to <a href="mailto:legal@boothiq.com">legal@boothiq.com</a>.</li>
          </ul>

          <h2 id="contact">18. Contact Us</h2>
          <p>
            Questions about these Terms? Reach us at{" "}
            <a href="mailto:legal@boothiq.com">legal@boothiq.com</a> or
            write to:
          </p>
          <p>
            BoothIQ
            <br />
            [Registered Address]
          </p>
        </div>
      </section>
    </div>
  );
}
