import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { BlogCard } from "@/components/shared/blog-card";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { CtaSection } from "@/components/shared/cta-section";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd, breadcrumbSchema, articleSchema } from "@/lib/schema";
import { getBlogPosts, getPostBySlug } from "@/lib/db/content";
import { getSiteConfig } from "@/lib/db/settings";
import { getGradient } from "@/lib/gradients";

/** See the note in `services/[slug]/page.tsx` — builds must survive no DB. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, siteConfig] = await Promise.all([getPostBySlug(slug), getSiteConfig()]);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author.name],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, blogPosts] = await Promise.all([getPostBySlug(slug), getBlogPosts()]);
  if (!post) notFound();

  const [breadcrumb, articleLd] = await Promise.all([
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.title, url: `/blog/${post.slug}` },
    ]),
    articleSchema(post),
  ]);

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
  const morePosts = relatedPosts.length > 0
    ? relatedPosts
    : blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={articleLd} />

      <section className="pb-4 pt-16 sm:pt-24">
        <div className="container-brand max-w-3xl">
          <Reveal className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                {post.author.name}, {post.author.role}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> {post.readTime}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-8 pt-10">
        <div className="container-brand">
          <Reveal>
            <div className={`mx-auto h-64 max-w-4xl rounded-3xl bg-gradient-to-br sm:h-96 ${getGradient(post.gradientKey)}`} />
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-brand grid grid-cols-1 gap-14 lg:grid-cols-[1fr_280px]">
          <Reveal className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Written by
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{post.author.role}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Stay updated
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Get our latest articles delivered to your inbox.
              </p>
              <NewsletterForm className="mt-4" />
            </div>
          </Reveal>
        </div>
      </section>

      {morePosts.length > 0 && (
        <section className="section-pad bg-muted/30">
          <div className="container-brand">
            <SectionHeading eyebrow="Keep reading" title="More from the blog" />
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {morePosts.map((relatedPost, index) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} delay={index * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
