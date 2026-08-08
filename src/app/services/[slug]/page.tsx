import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { CtaSection } from "@/components/shared/cta-section";
import { Reveal } from "@/components/shared/reveal";
import { ServiceCard } from "@/components/shared/service-card";
import { JsonLd, breadcrumbSchema, serviceSchema, faqSchema } from "@/lib/schema";
import { services, getServiceBySlug } from "@/data/services";
import { siteConfig } from "@/data/site";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.name,
    description: `${service.tagline} ${service.overview.slice(0, 120)}...`,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | ${siteConfig.name}`,
      description: service.tagline,
      url: `${siteConfig.url}/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = services
    .filter((s) => s.slug !== service.slug && s.category === service.category)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.name, url: `/services/${service.slug}` },
        ])}
      />
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqSchema(service.faqs)} />

      <section className="section-pad pb-12">
        <div className="container-brand">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4">
              {service.category}
            </Badge>
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-brand text-white">
              <service.icon className="size-7" />
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-5 text-balance text-lg leading-relaxed text-muted-foreground">
              {service.tagline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-gradient-brand px-7 text-base text-white hover:opacity-90"
              >
                <Link href="/contact#consultation">
                  Book Free Consultation <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7 text-base">
                <Link href="/contact#quote">Get a Project Estimate</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-4">
        <div className="container-brand max-w-3xl">
          <Reveal>
            <p className="text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {service.overview}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand">
          <SectionHeading eyebrow="Benefits" title="Why this matters for your business" />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {service.benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
                  <CheckCircle2 className="size-6 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-muted/30">
        <div className="container-brand">
          <SectionHeading eyebrow="Features" title="What's included" />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {service.features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.06}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-brand/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand">
          <SectionHeading eyebrow="Technology" title="Tech stack we use" />
          <Reveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-3">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground"
              >
                {tech}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-muted/30">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Process"
            title="How we deliver"
            description="Discovery through support — a consistent, transparent process for every engagement."
          />
          <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div
              className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block"
              aria-hidden="true"
            />
            {service.process.map((step, index) => (
              <Reveal key={step.step} delay={index * 0.08}>
                <div className="relative flex flex-col gap-3">
                  <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                    {step.step}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <FaqAccordion faqs={service.faqs} className="mt-14" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad bg-muted/30">
          <div className="container-brand">
            <SectionHeading eyebrow="Related" title="You might also need" />
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((relatedService, index) => (
                <ServiceCard key={relatedService.slug} service={relatedService} delay={index * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection
        title={`Ready to get started with ${service.shortName}?`}
        description="Book a free consultation and we'll map out the right approach for your project."
      />
    </>
  );
}
