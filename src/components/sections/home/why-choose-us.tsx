import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { getWhyChooseUs } from "@/lib/db/content";
import { CheckCircle2 } from "lucide-react";

export async function WhyChooseUs() {
  const whyChooseUs = await getWhyChooseUs();

  return (
    <section className="section-pad">
      <div className="container-brand grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Why choose us"
            title="The team you'd want to build in-house — without the hiring cycle"
            align="left"
            description="We bring senior engineering and design talent, AI-native thinking, and delivery discipline that compounds over the life of your product."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {whyChooseUs.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-brand/10 text-primary">
                    <CheckCircle2 className="size-5" />
                  </span>
                  <span className="text-right">
                    <span className="block text-xl font-semibold tracking-tight text-gradient-brand">
                      {item.metric}
                    </span>
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                      {item.metricLabel}
                    </span>
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
