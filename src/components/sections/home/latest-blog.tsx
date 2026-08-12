import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { BlogCard } from "@/components/shared/blog-card";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/db/content";

export async function LatestBlog() {
  const latest = (await getBlogPosts()).slice(0, 3);

  return (
    <section className="section-pad">
      <div className="container-brand">
        <SectionHeading
          eyebrow="Insights"
          title="Ideas on AI, engineering, and product strategy"
          description="Perspectives from our team on building software that actually moves the business forward."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post, index) => (
            <BlogCard key={post.slug} post={post} delay={index * 0.08} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-7">
            <Link href="/blog">
              Visit the blog <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
