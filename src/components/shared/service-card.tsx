import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types";
import { Reveal } from "@/components/shared/reveal";
import { getIcon } from "@/lib/icons";

export function ServiceCard({ service, delay = 0 }: { service: Service; delay?: number }) {
  const Icon = getIcon(service.iconName);

  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/services/${service.slug}`}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
          aria-hidden="true"
        />
        <div>
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-brand/10 text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-white">
            <Icon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{service.shortName}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {service.tagline}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Learn more <ArrowUpRight className="size-3.5" />
        </div>
      </Link>
    </Reveal>
  );
}
