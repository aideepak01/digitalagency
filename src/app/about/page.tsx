import type { Metadata } from "next";
import { Target, Eye, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsCounter } from "@/components/shared/stats-counter";
import { CtaSection } from "@/components/shared/cta-section";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { coreValues, team } from "@/data/misc";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name}'s story, mission, and the team behind the AI and software products we build for clients worldwide.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />

      <section className="section-pad pb-12">
        <div className="container-brand">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
              About {siteConfig.name}
            </span>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              We build the intelligent software behind ambitious companies
            </h1>
            <p className="mt-5 text-balance text-lg leading-relaxed text-muted-foreground">
              Since {siteConfig.founded}, {siteConfig.name} has partnered with founders and
              enterprise teams to design, build, and scale AI-driven products — treating every
              engagement like it&apos;s our own company on the line.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-16">
            <StatsCounter stats={siteConfig.stats} />
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand grid grid-cols-1 gap-14 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Our story
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Started by engineers who got tired of agencies that didn&apos;t ship
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-5">
            <p className="text-base leading-relaxed text-muted-foreground">
              {siteConfig.name} was founded in {siteConfig.founded} after our team spent years
              watching promising products stall out — not because the ideas were bad, but
              because the execution never matched the ambition. Agencies over-promised. Internal
              teams got stretched too thin. Deadlines slipped, and nobody could explain why.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              We built {siteConfig.name} to be different: a team of senior engineers and
              designers who treat every client engagement with the same rigor we&apos;d apply to our
              own product. As AI reshaped what software could do, we leaned in early — building
              production AI systems years before it became an industry-wide priority.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Today, we work with startups and enterprise teams across the world, but the
              principle hasn&apos;t changed: understand the business first, then build the right
              thing, well.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-muted/30">
        <div className="container-brand grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-brand/10 text-primary">
                <Target className="size-5" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                To help ambitious companies turn AI and software from a cost center into their
                sharpest competitive advantage — through senior engineering, honest strategy, and
                relentless execution.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-brand/10 text-primary">
                <Eye className="size-5" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">Our Vision</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                A world where every business — not just those with in-house AI labs — has access
                to intelligent software built with the same rigor as the world&apos;s best product
                companies.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand">
          <SectionHeading eyebrow="Core values" title="What we hold ourselves to" />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-muted/30">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Our team"
            title="Senior talent, hand-picked"
            description="A small, senior team means every project is led by people who've done it before — not a rotating cast of juniors."
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.06}>
                <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-gradient-brand text-lg font-semibold text-white">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-brand/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Why clients trust us
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We sign NDAs as standard practice, communicate transparently even when the news is
              hard, and back every engagement with clear timelines and SLA-backed support. Our
              96% client retention rate isn&apos;t an accident — it&apos;s the result of treating every
              engagement like a long-term partnership, not a one-off transaction.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
