"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterFormSchema, type NewsletterFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-primary", className)}>
        <CheckCircle2 className="size-4" /> You&apos;re subscribed. Welcome aboard.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-2", className)}
      noValidate
    >
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="you@company.com"
          aria-label="Email address"
          {...register("email")}
        />
        <Button type="submit" size="icon" disabled={isSubmitting} aria-label="Subscribe">
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {errors.email && (
        <p className="text-xs text-destructive">{errors.email.message}</p>
      )}
    </form>
  );
}
