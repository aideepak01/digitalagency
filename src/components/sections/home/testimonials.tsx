import { SectionHeading } from "@/components/shared/section-heading";
import { TestimonialCarousel } from "@/components/shared/testimonial-carousel";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="section-pad">
      <div className="container-brand">
        <SectionHeading
          eyebrow="Client stories"
          title="Trusted by teams who need software that works"
          description="We measure success by outcomes, not deliverables — here's what that looks like from the client's side."
        />
        <div className="mt-14">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
