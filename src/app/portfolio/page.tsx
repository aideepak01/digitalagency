import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { PortfolioGrid } from "@/components/sections/portfolio/portfolio-grid";
import { CtaSection } from "@/components/shared/cta-section";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { portfolioProjects } from "@/data/portfolio";
import { industries } from "@/data/industries";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Explore real client projects delivered by ${siteConfig.name} — AI agents, chatbots, web platforms, and mobile apps across travel, healthcare, finance, and more.`,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Portfolio", url: "/portfolio" },
        ])}
      />
      <section className="section-pad">
        <div className="container-brand">
          <SectionHeading
            as="h1"
            eyebrow="Portfolio"
            title="Real projects, real business outcomes"
            description="A selection of work across industries — every project shipped, measured, and still running in production."
          />
          <div className="mt-16">
            <PortfolioGrid
              projects={portfolioProjects}
              industries={industries.map((i) => ({ slug: i.slug, name: i.name }))}
            />
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
