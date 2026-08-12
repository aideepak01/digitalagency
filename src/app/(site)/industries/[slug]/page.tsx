import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/shared/cta-section";
import { Reveal } from "@/components/shared/reveal";
import { ServiceCard } from "@/components/shared/service-card";
import { PortfolioCard } from "@/components/shared/portfolio-card";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import {
  getIndustries,
  getIndustryBySlug,
  getPortfolioProjects,
  getServices,
} from "@/lib/db/content";
import { getSiteConfig } from "@/lib/db/settings";
import { getIcon } from "@/lib/icons";

/** See the note in `services/[slug]/page.tsx` — builds must survive no DB. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const industries = await getIndustries();
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [industry, siteConfig] = await Promise.all([getIndustryBySlug(slug), getSiteConfig()]);
  if (!industry) return {};

  return {
    title: `${industry.name} Software Development`,
    description: `${industry.tagline} ${industry.overview.slice(0, 120)}...`,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title: `${industry.name} Software Development | ${siteConfig.name}`,
      description: industry.tagline,
      url: `${siteConfig.url}/industries/${industry.slug}`,
    },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [industry, services, portfolioProjects] = await Promise.all([
    getIndustryBySlug(slug),
    getServices(),
    getPortfolioProjects(),
  ]);
  if (!industry) notFound();

  const breadcrumb = await breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Industries", url: "/industries" },
    { name: industry.name, url: `/industries/${industry.slug}` },
  ]);

  const Icon = getIcon(industry.iconName);
  const relatedServices = services.filter((s) => industry.services.includes(s.slug));
  const relatedProjects = portfolioProjects.filter((p) => p.industry === industry.slug);

  return (
    <>
      <JsonLd data={breadcrumb} />

      <section className="section-pad pb-12">
        <div className="container-brand">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-brand text-white">
              <Icon className="size-7" />
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {industry.name} Software Development
            </h1>
            <p className="mt-5 text-balance text-lg leading-relaxed text-muted-foreground">
              {industry.tagline}
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-gradient-brand px-7 text-base text-white hover:opacity-90"
              >
                <Link href="/contact#consultation">
                  Book Free Consultation <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto mt-16 grid max-w-lg grid-cols-2 gap-6">
            {industry.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pb-4">
        <div className="container-brand max-w-3xl">
          <Reveal>
            <p className="text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {industry.overview}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Challenges"
              title="Common pain points we solve"
              align="left"
            />
            <div className="mt-10 flex flex-col gap-5">
              {industry.challenges.map((challenge, index) => (
                <Reveal key={challenge.title} delay={index * 0.08}>
                  <div className="flex gap-4">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {challenge.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Solutions" title="How we solve them" align="left" />
            <div className="mt-10 flex flex-col gap-5">
              {industry.solutions.map((solution, index) => (
                <Reveal key={solution.title} delay={index * 0.08}>
                  <div className="flex gap-4">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {solution.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="section-pad bg-muted/30">
          <div className="container-brand">
            <SectionHeading
              eyebrow="Relevant services"
              title={`Services we deliver for ${industry.name.toLowerCase()}`}
            />
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((service, index) => (
                <ServiceCard key={service.slug} service={service} delay={index * 0.06} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="section-pad">
          <div className="container-brand">
            <SectionHeading eyebrow="Case studies" title={`Our work in ${industry.name.toLowerCase()}`} />
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project, index) => (
                <PortfolioCard key={project.slug} project={project} delay={index * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection
        title={`Let's build something for your ${industry.name.toLowerCase()} business`}
        description="Book a free consultation and we'll walk through the right approach for your specific operations."
      />
    </>
  );
}
