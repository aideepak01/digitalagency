import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2 text-lg font-semibold tracking-tight",
        className
      )}
    >
      <span className="relative flex size-8 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-[0_4px_16px_-4px_var(--brand-via)]">
        <Sparkles className="size-4" strokeWidth={2.5} />
      </span>
      <span className="text-foreground">
        Sbabu<span className="text-gradient-brand"> AI</span>
      </span>
    </Link>
  );
}
