import Link from "next/link";
import type { BlogPost } from "@/types";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { getGradient } from "@/lib/gradients";

export function BlogCard({ post, delay = 0 }: { post: BlogPost; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
      >
        <div className={`h-40 bg-gradient-to-br ${getGradient(post.gradientKey)}`} />
        <div className="flex flex-1 flex-col p-6">
          <Badge variant="secondary" className="mb-3 w-fit">
            {post.category}
          </Badge>
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{post.author.name}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
