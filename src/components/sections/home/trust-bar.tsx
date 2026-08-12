import { Reveal } from "@/components/shared/reveal";
import { getTestimonials } from "@/lib/db/content";

export async function TrustBar() {
  const testimonials = await getTestimonials();
  const companies = Array.from(new Set(testimonials.map((t) => t.company)));

  return (
    <section className="border-y border-border bg-muted/30 py-10">
      <div className="container-brand">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Trusted by product and engineering teams at
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {companies.map((company) => (
              <li
                key={company}
                className="text-sm font-semibold tracking-tight text-foreground/70 sm:text-base"
              >
                {company}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
