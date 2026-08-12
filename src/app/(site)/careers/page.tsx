import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Globe2, Heart, Rocket, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { getCoreValues, getJobOpenings } from "@/lib/db/content";
import { getSiteConfig } from "@/lib/db/settings";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: "Careers",
    description: `Join ${siteConfig.name} — we're hiring senior engineers, designers, and delivery leaders to build AI and software products for clients worldwide.`,
    alternates: { canonical: "/careers" },
  };
}

const perks = [
  { icon: Globe2, title: "Remote-first", description: "Work from anywhere — we've been distributed since day one." },
  { icon: Heart, title: "Health coverage", description: "Comprehensive health, dental, and vision coverage for you and dependents." },
  { icon: Rocket, title: "Real ownership", description: "Work directly with clients and own outcomes, not just tickets." },
  { icon: GraduationCap, title: "Learning budget", description: "Annual budget for courses, conferences, and certifications." },
];

export default async function CareersPage() {
  const [jobOpenings, coreValues, breadcrumb] = await Promise.all([
    getJobOpenings(),
    getCoreValues(),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Careers", url: "/careers" },
    ]),
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

      <section className="section-pad pb-12">
        <div className="container-brand">
          <SectionHeading
            as="h1"
            eyebrow="Careers"
            title="Build the future of AI-driven software with us"
            description="We're a small, senior, remote-first team working on some of the most interesting AI and software problems across industries. If that sounds like your kind of work, we'd love to hear from you."
          />
        </div>
      </section>

      <section className="pb-8">
        <div className="container-brand grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk, index) => (
            <Reveal key={perk.title} delay={index * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-gradient-brand/10 text-primary">
                  <perk.icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-foreground">{perk.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {perk.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand">
          <SectionHeading eyebrow="How we work" title="What it's actually like here" align="left" />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="rounded-2xl border border-border bg-muted/30 p-6">
                  <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-muted/30">
        <div className="container-brand max-w-4xl">
          <SectionHeading eyebrow="Open positions" title="Current openings" align="left" />
          <div className="mt-10 flex flex-col gap-4">
            {jobOpenings.map((job, index) => (
              <Reveal key={job.slug} delay={index * 0.05}>
                <Link
                  href={`/careers/${job.slug}`}
                  className="group flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{job.department}</Badge>
                      <Badge variant="secondary">{job.location}</Badge>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View role <ArrowUpRight className="size-3.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
