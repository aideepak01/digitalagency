import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { processSteps } from "@/data/misc";

export function Process() {
  return (
    <section className="section-pad">
      <div className="container-brand">
        <SectionHeading
          eyebrow="How we work"
          title="A proven process, refined over 240+ projects"
          description="Every engagement follows the same disciplined process — designed to reduce risk and keep you informed at every stage."
        />
        <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div
            className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block"
            aria-hidden="true"
          />
          {processSteps.map((step, index) => (
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
  );
}
