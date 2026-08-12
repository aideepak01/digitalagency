import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/shared/service-card";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/db/content";

export async function FeaturedServices() {
  const featured = (await getServices()).slice(0, 8);

  return (
    <section className="section-pad bg-muted/30">
      <div className="container-brand">
        <SectionHeading
          eyebrow="What we do"
          title="Full-stack expertise, from AI to infrastructure"
          description="We cover the entire product lifecycle — AI systems, web and mobile applications, design, and the infrastructure that keeps it all running."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service, index) => (
            <ServiceCard key={service.slug} service={service} delay={index * 0.05} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-7">
            <Link href="/services">
              View all services <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
