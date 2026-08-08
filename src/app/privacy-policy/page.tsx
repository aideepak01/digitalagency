import type { Metadata } from "next";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Read the ${siteConfig.name} privacy policy to understand how we collect, use, and protect your personal data.`,
  alternates: { canonical: "/privacy-policy" },
};

const lastUpdated = "August 1, 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy-policy" },
        ])}
      />
      <section className="section-pad">
        <div className="container-brand max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
              Legal
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </Reveal>

          <Reveal delay={0.1} className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
            <p>
              {siteConfig.legalName} (&ldquo;{siteConfig.name}&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects your privacy and is committed to
              protecting the personal data you share with us. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our website
              at {siteConfig.url} or engage our services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect the following categories of information:</p>
            <ul>
              <li>
                <strong>Contact information</strong> you provide through forms, such as name,
                email address, phone number, and company name.
              </li>
              <li>
                <strong>Project details</strong> shared when requesting a consultation or
                estimate, including project descriptions and budget information.
              </li>
              <li>
                <strong>Usage data</strong> such as pages visited, time spent on the site, browser
                type, and device information, collected automatically through cookies and
                analytics tools.
              </li>
              <li>
                <strong>Application information</strong> including resumes, cover notes, and
                professional links submitted through our careers pages.
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to inquiries and provide requested consultations or estimates</li>
              <li>Deliver, operate, and improve our services</li>
              <li>Send newsletters and marketing communications, where you have opted in</li>
              <li>Evaluate job applications</li>
              <li>Monitor and analyze usage trends to improve website performance</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing
              experience, analyze site traffic, and understand where our visitors come from. You
              can control cookie preferences through your browser settings; disabling cookies may
              affect certain site functionality.
            </p>

            <h2>4. How We Share Your Information</h2>
            <p>
              We do not sell your personal data. We may share information with trusted
              third-party service providers who assist us in operating our website, conducting
              business, or servicing you, provided those parties agree to keep this information
              confidential. We may also disclose information when required by law or to protect
              our rights.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard technical and organizational measures, including
              encryption and access controls, to protect your personal data from unauthorized
              access, alteration, disclosure, or destruction. No method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain personal data for as long as necessary to fulfill the purposes outlined
              in this policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the right to access, correct, delete,
              or restrict the processing of your personal data, and the right to data
              portability. To exercise these rights, contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>

            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the privacy practices or content of those websites and encourage you to review
              their privacy policies.
            </p>

            <h2>9. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16, and we do not
              knowingly collect personal data from children.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by updating the &ldquo;Last updated&rdquo; date at the top of this page.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or write to us at{" "}
              {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.zip}, {siteConfig.address.country}.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
