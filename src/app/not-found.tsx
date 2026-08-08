import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section-pad flex min-h-[60vh] items-center justify-center">
      <div className="container-brand flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-brand text-white">
          <Compass className="size-7" />
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          404 — Page not found
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on
          track.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 h-12 rounded-full bg-gradient-brand px-7 text-base text-white hover:opacity-90"
        >
          <Link href="/">
            Back to homepage <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
