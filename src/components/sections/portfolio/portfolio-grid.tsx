"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PortfolioCard } from "@/components/shared/portfolio-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/types";

interface PortfolioGridProps {
  projects: PortfolioProject[];
  industries: { slug: string; name: string }[];
}

export function PortfolioGrid({ projects, industries }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = React.useState<string>("all");

  const filtered =
    activeFilter === "all" ? projects : projects.filter((p) => p.industry === activeFilter);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full",
            activeFilter === "all" && "bg-gradient-brand text-white hover:opacity-90"
          )}
          onClick={() => setActiveFilter("all")}
        >
          All Projects
        </Button>
        {industries.map((industry) => (
          <Button
            key={industry.slug}
            variant={activeFilter === industry.slug ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full",
              activeFilter === industry.slug && "bg-gradient-brand text-white hover:opacity-90"
            )}
            onClick={() => setActiveFilter(industry.slug)}
          >
            {industry.name}
          </Button>
        ))}
      </div>

      <motion.div layout className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <PortfolioCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No projects found for this filter yet.
        </p>
      )}
    </div>
  );
}
