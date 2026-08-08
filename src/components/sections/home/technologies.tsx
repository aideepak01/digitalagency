import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { technologies } from "@/data/misc";

export function Technologies() {
  return (
    <section className="section-pad bg-muted/30">
      <div className="container-brand">
        <SectionHeading
          eyebrow="Our stack"
          title="Modern, production-proven technologies"
          description="We choose tools based on what's right for your problem, not what's trendy — a stack we've battle-tested across hundreds of engagements."
        />
        <Reveal delay={0.15} className="mt-14">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
