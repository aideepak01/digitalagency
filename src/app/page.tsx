import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/hero";
import { Intro } from "@/components/sections/home/intro";
import { FeaturedServices } from "@/components/sections/home/featured-services";
import { WhyChooseUs } from "@/components/sections/home/why-choose-us";
import { IndustriesServed } from "@/components/sections/home/industries-served";
import { Process } from "@/components/sections/home/process";
import { Technologies } from "@/components/sections/home/technologies";
import { Testimonials } from "@/components/sections/home/testimonials";
import { Faq } from "@/components/sections/home/faq";
import { LatestBlog } from "@/components/sections/home/latest-blog";
import { CtaSection } from "@/components/shared/cta-section";
import { JsonLd, faqSchema } from "@/lib/schema";
import { homeFaqs } from "@/data/misc";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />
      <Hero />
      <Intro />
      <FeaturedServices />
      <WhyChooseUs />
      <IndustriesServed />
      <Process />
      <Technologies />
      <Testimonials />
      <Faq />
      <LatestBlog />
      <CtaSection />
    </>
  );
}
