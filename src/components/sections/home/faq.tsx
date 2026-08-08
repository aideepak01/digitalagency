import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { homeFaqs } from "@/data/misc";

export function Faq() {
  return (
    <section className="section-pad bg-muted/30">
      <div className="container-brand max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions we hear most"
          description="Can't find what you're looking for? Reach out and we'll get back to you within one business day."
        />
        <FaqAccordion faqs={homeFaqs} className="mt-14" />
      </div>
    </section>
  );
}
