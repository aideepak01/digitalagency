"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { BlogCard } from "@/components/shared/blog-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogExplorerProps {
  posts: BlogPost[];
  categories: readonly string[];
}

export function BlogExplorer({ posts, categories }: BlogExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  const filtered = posts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesQuery =
      query.trim() === "" ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="h-12 rounded-full pl-10"
            aria-label="Search blog posts"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full",
              activeCategory === "all" && "bg-gradient-brand text-white hover:opacity-90"
            )}
            onClick={() => setActiveCategory("all")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full",
                activeCategory === category && "bg-gradient-brand text-white hover:opacity-90"
              )}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post, index) => (
          <BlogCard key={post.slug} post={post} delay={index * 0.06} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No articles match your search.
        </p>
      )}
    </div>
  );
}
