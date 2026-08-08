import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { BlogExplorer } from "@/components/sections/blog/blog-explorer";
import { CtaSection } from "@/components/shared/cta-section";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { blogPosts, blogCategories } from "@/data/blog";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Insights on AI, software engineering, product design, and business strategy from the ${siteConfig.name} team.`,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      <section className="section-pad">
        <div className="container-brand">
          <SectionHeading
            as="h1"
            eyebrow="Blog"
            title="Ideas on AI, engineering, and product strategy"
            description="Perspectives from our team on building software that actually moves the business forward."
          />
          <div className="mt-16">
            <BlogExplorer posts={blogPosts} categories={blogCategories} />
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
