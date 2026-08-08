"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <Quote className="size-6 text-primary/40" />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex size-9 items-center justify-center rounded-full bg-gradient-brand text-xs font-semibold text-white">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={scrollPrev}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-1.5">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.author}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-border"
              )}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={scrollNext}
          aria-label="Next testimonial"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
