import { SectionHeading } from "@/components/shared/section-heading";
import { StatsCounter } from "@/components/shared/stats-counter";
import { Reveal } from "@/components/shared/reveal";
import { siteConfig } from "@/data/site";

export function Intro() {
  return (
    <section className="section-pad">
      <div className="container-brand">
        <SectionHeading
          eyebrow="Who we are"
          title={`${siteConfig.name} is a technology partner, not just a vendor`}
          description={`Since ${siteConfig.founded}, we've helped venture-backed startups and established enterprises design, build, and scale AI-driven products and software platforms — combining senior engineering talent with genuine product thinking.`}
        />
        <Reveal delay={0.15} className="mt-16">
          <StatsCounter stats={siteConfig.stats} />
        </Reveal>
      </div>
    </section>
  );
}
