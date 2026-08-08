import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Reveal } from "@/components/shared/reveal";
import { CtaSection } from "@/components/shared/cta-section";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pricingPlans, pricingFaqs } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Transparent pricing plans from ${siteConfig.name} — Startup, Business, and Enterprise retainers for AI and software development.`,
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ])}
      />

      <section className="section-pad pb-12">
        <div className="container-brand">
          <SectionHeading
            as="h1"
            eyebrow="Pricing"
            title="Plans built for how software actually gets built"
            description="Monthly retainers with dedicated teams — scoped to your stage, scaled as you grow. Need something custom? We do fixed-price projects too."
          />
        </div>
      </section>

      <section className="pb-8">
        <div className="container-brand grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.08} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border p-8",
                  plan.highlighted
                    ? "border-transparent bg-gradient-brand text-white shadow-[0_30px_60px_-20px_var(--brand-via)]"
                    : "border-border bg-card"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-semibold text-primary">
                    Most Popular
                  </span>
                )}
                <h3
                  className={cn(
                    "text-lg font-semibold",
                    plan.highlighted ? "text-white" : "text-foreground"
                  )}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-end gap-1">
                  <span
                    className={cn(
                      "text-4xl font-semibold tracking-tight",
                      plan.highlighted ? "text-white" : "text-foreground"
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={cn(
                        "pb-1 text-sm",
                        plan.highlighted ? "text-white/70" : "text-muted-foreground"
                      )}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-4 text-sm leading-relaxed",
                    plan.highlighted ? "text-white/85" : "text-muted-foreground"
                  )}
                >
                  {plan.description}
                </p>

                <ul className="mt-8 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          plan.highlighted ? "text-white" : "text-primary"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          plan.highlighted ? "text-white/90" : "text-muted-foreground"
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "mt-8 h-12 w-full rounded-full text-base",
                    plan.highlighted
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-gradient-brand text-white hover:opacity-90"
                  )}
                >
                  <Link href="/contact#quote">{plan.cta}</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-brand max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Pricing questions" />
          <FaqAccordion faqs={pricingFaqs} className="mt-14" />
        </div>
      </section>

      <CtaSection
        title="Not sure which plan fits?"
        description="Book a free consultation and we'll help you figure out the right scope and plan for your project."
      />
    </>
  );
}
