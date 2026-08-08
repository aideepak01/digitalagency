import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/shared/cta-section";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Services",
  description: `Explore all ${services.length} AI and software development services offered by ${siteConfig.name} — from AI agents and automation to full-stack web, mobile, and infrastructure engineering.`,
  alternates: { canonical: "/services" },
};

const categories = ["AI", "Development", "Design", "Infrastructure"] as const;

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ])}
      />
      <section className="section-pad">
        <div className="container-brand">
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title="Every capability you need to build and scale"
            description="From AI agents to enterprise infrastructure — sixteen specialized services, delivered by senior teams who've done it before."
          />

          {categories.map((category) => {
            const categoryServices = services.filter((s) => s.category === category);
            if (categoryServices.length === 0) return null;
            return (
              <div key={category} className="mt-16">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {category}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service, index) => (
                    <Reveal key={service.slug} delay={index * 0.05}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
                      >
                        <div>
                          <div className="mb-5 flex items-center justify-between">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-brand/10 text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-white">
                              <service.icon className="size-5" />
                            </div>
                            <Badge variant="secondary">{service.category}</Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {service.name}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {service.tagline}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Learn more <ArrowUpRight className="size-3.5" />
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
