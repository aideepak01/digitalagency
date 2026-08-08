import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Quote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/shared/cta-section";
import { Reveal } from "@/components/shared/reveal";
import { PortfolioCard } from "@/components/shared/portfolio-card";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { portfolioProjects, getProjectBySlug } from "@/data/portfolio";
import { getIndustryBySlug } from "@/data/industries";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.summary,
      url: `${siteConfig.url}/portfolio/${project.slug}`,
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const industry = getIndustryBySlug(project.industry);
  const usedServices = services.filter((s) => project.services.includes(s.slug));
  const otherProjects = portfolioProjects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Portfolio", url: "/portfolio" },
          { name: project.title, url: `/portfolio/${project.slug}` },
        ])}
      />

      <section className={`relative overflow-hidden bg-gradient-to-br ${project.coverGradient} pb-20 pt-24 sm:pt-32`}>
        <div className="container-brand relative">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-5 flex items-center gap-3">
              <Badge className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/20">
                {industry?.name ?? project.industry}
              </Badge>
              <Badge className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/20">
                {project.year}
              </Badge>
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 text-balance text-lg leading-relaxed text-white/85">
              {project.summary}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand">
          <div className="mx-auto -mt-24 mb-16 grid max-w-4xl grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-lg sm:grid-cols-4 sm:p-8">
            {project.outcomes.map((outcome) => (
              <div key={outcome.label} className="text-center">
                <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {outcome.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{outcome.label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-10">
              <Reveal>
                <h2 className="text-2xl font-semibold text-foreground">The challenge</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {project.challenge}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-2xl font-semibold text-foreground">The solution</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {project.solution}
                </p>
              </Reveal>

              {project.testimonial && (
                <Reveal delay={0.2}>
                  <div className="rounded-2xl border border-border bg-muted/30 p-6">
                    <Quote className="size-6 text-primary/40" />
                    <p className="mt-3 text-base leading-relaxed text-foreground">
                      &ldquo;{project.testimonial.quote}&rdquo;
                    </p>
                    <p className="mt-4 text-sm font-medium text-foreground">
                      {project.testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground">{project.testimonial.role}</p>
                  </div>
                </Reveal>
              )}
            </div>

            <Reveal delay={0.15} className="flex flex-col gap-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Client
                </h3>
                <p className="mt-2 text-base font-medium text-foreground">{project.client}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Services
                </h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {usedServices.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {service.shortName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Technologies
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {otherProjects.length > 0 && (
        <section className="section-pad bg-muted/30">
          <div className="container-brand">
            <SectionHeading eyebrow="More work" title="Other projects" />
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((otherProject, index) => (
                <PortfolioCard key={otherProject.slug} project={otherProject} delay={index * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection
        title="Want results like this for your product?"
        description="Book a free consultation and let's talk about what's possible."
        primaryLabel="Book Free Consultation"
        primaryHref="/contact#consultation"
        secondaryLabel="View All Work"
        secondaryHref="/portfolio"
      />
    </>
  );
}
