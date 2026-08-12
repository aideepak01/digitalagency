import type { Metadata } from "next";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { getSiteConfig } from "@/lib/db/settings";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: "Terms & Conditions",
    description: `Read the terms and conditions governing your use of ${siteConfig.name}'s website and services.`,
    alternates: { canonical: "/terms-conditions" },
  };
}

const lastUpdated = "August 1, 2026";

export default async function TermsConditionsPage() {
  const [siteConfig, breadcrumb] = await Promise.all([
    getSiteConfig(),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Terms & Conditions", url: "/terms-conditions" },
    ]),
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <section className="section-pad">
        <div className="container-brand max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
              Legal
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              Terms &amp; Conditions
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </Reveal>

          <Reveal delay={0.1} className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
            <p>
              These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of
              the {siteConfig.name} website located at {siteConfig.url} and any services provided
              by {siteConfig.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
              &ldquo;our&rdquo;). By accessing our website or engaging our services, you agree to
              be bound by these Terms.
            </p>

            <h2>1. Use of Our Website</h2>
            <p>
              You agree to use our website only for lawful purposes and in a way that does not
              infringe the rights of, restrict, or inhibit anyone else&apos;s use of the site. You may
              not use our website to transmit harmful code, attempt unauthorized access to our
              systems, or scrape content without our written permission.
            </p>

            <h2>2. Services and Engagements</h2>
            <p>
              Any project, retainer, or consulting engagement with {siteConfig.name} is governed
              by a separate written agreement or statement of work outlining scope, deliverables,
              timeline, and fees. In the event of a conflict between these Terms and a signed
              agreement, the signed agreement will govern.
            </p>

            <h2>3. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and design elements,
              is the property of {siteConfig.name} or its licensors and is protected by
              applicable intellectual property laws. Unless otherwise agreed in a client contract,
              deliverables produced under a signed statement of work are assigned to the client
              upon full payment.
            </p>

            <h2>4. Estimates and Quotes</h2>
            <p>
              Estimates provided through our website (including project estimates and pricing
              plans) are indicative and subject to change following a full discovery process.
              Final pricing and scope will be confirmed in a written proposal or agreement.
            </p>

            <h2>5. Payment Terms</h2>
            <p>
              Payment terms, including invoicing schedules and accepted payment methods, are
              defined in individual client agreements. Late payments may be subject to interest
              charges or suspension of services as outlined in the applicable agreement.
            </p>

            <h2>6. Confidentiality</h2>
            <p>
              We treat client information as confidential and typically execute mutual
              non-disclosure agreements at the start of an engagement. We will not disclose
              confidential client information to third parties except as required by law or with
              client consent.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, {siteConfig.name} shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising out of
              or related to your use of our website or services. Our total liability for any
              claim arising from a service engagement shall not exceed the fees paid for that
              engagement in the preceding twelve months.
            </p>

            <h2>8. Warranties</h2>
            <p>
              We strive to deliver high-quality work and stand behind our services as described in
              individual client agreements. Except as expressly stated in a signed agreement, our
              website and its content are provided &ldquo;as is&rdquo; without warranties of any
              kind.
            </p>

            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We do not endorse and are not
              responsible for the content, accuracy, or practices of any linked third-party sites.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India, Uttar Pradesh,
              without regard to its conflict of law provisions. Any disputes arising under these
              Terms will be resolved in the courts located in Noida, Uttar Pradesh, India.
            </p>

            <h2>11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of our website after
              changes are posted constitutes acceptance of the revised Terms.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
