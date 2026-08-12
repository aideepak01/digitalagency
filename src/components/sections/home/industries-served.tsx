import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { IndustryCard } from "@/components/shared/industry-card";
import { Button } from "@/components/ui/button";
import { getIndustries } from "@/lib/db/content";

export async function IndustriesServed() {
  const industries = await getIndustries();

  return (
    <section className="section-pad bg-muted/30">
      <div className="container-brand">
        <SectionHeading
          eyebrow="Industries"
          title="Deep experience across complex industries"
          description="We understand the operational realities of the industries we build for — not just the technology, but how the business actually runs."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, index) => (
            <IndustryCard key={industry.slug} industry={industry} delay={index * 0.05} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-7">
            <Link href="/industries">
              View all industries <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
