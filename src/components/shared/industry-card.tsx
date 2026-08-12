import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Industry } from "@/types";
import { Reveal } from "@/components/shared/reveal";
import { getIcon } from "@/lib/icons";

export function IndustryCard({ industry, delay = 0 }: { industry: Industry; delay?: number }) {
  const Icon = getIcon(industry.iconName);

  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/industries/${industry.slug}`}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
      >
        <div>
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-brand/10 text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-white">
            <Icon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{industry.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {industry.tagline}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Explore <ArrowUpRight className="size-3.5" />
        </div>
      </Link>
    </Reveal>
  );
}
