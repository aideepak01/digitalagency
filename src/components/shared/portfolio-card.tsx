import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/types";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";

export function PortfolioCard({
  project,
  delay = 0,
}: {
  project: PortfolioProject;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/portfolio/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
      >
        <div
          className={`relative flex h-48 items-end overflow-hidden bg-gradient-to-br ${project.coverGradient} p-5`}
        >
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/0" />
          <span className="relative flex items-center justify-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {project.year}
          </span>
          <ArrowUpRight className="absolute right-5 top-5 size-5 text-white/80 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <Badge variant="secondary" className="mb-3 w-fit capitalize">
            {project.industry.replace("-", " ")}
          </Badge>
          <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.outcomes.slice(0, 2).map((outcome) => (
              <span
                key={outcome.label}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {outcome.value} {outcome.label}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
