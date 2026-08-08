import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { IndustryCard } from "@/components/shared/industry-card";
import { CtaSection } from "@/components/shared/cta-section";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { industries } from "@/data/industries";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Industries",
  description: `${siteConfig.name} builds AI and software solutions for travel, construction, healthcare, education, real estate, hospitality, retail, and finance.`,
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
        ])}
      />
      <section className="section-pad">
        <div className="container-brand">
          <SectionHeading
            as="h1"
            eyebrow="Industries"
            title="Software built around how your industry actually works"
            description="Generic software forces your business to adapt to it. We build for the operational reality of your industry — its workflows, constraints, and compliance needs."
          />
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, index) => (
              <IndustryCard key={industry.slug} industry={industry} delay={index * 0.05} />
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
