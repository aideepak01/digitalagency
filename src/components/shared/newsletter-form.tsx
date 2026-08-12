"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { honeypotStyles, submitJson } from "@/lib/form-client";
import { newsletterFormSchema, type NewsletterFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const renderedAt = React.useRef(Date.now());
  const honeypot = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
  });

  async function onSubmit(values: NewsletterFormValues) {
    setFormError("");

    const result = await submitJson("/api/newsletter", values, {
      website: honeypot.current?.value ?? "",
      renderedAt: renderedAt.current,
    });

    if (!result.ok) {
      if (result.fieldErrors?.email) {
        setError("email", { message: result.fieldErrors.email[0] });
      }
      setFormError(result.message);
      return;
    }

    setSuccessMessage(result.message);
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-primary", className)}>
        <CheckCircle2 className="size-4 shrink-0" /> {successMessage}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-2", className)}
      noValidate
    >
      <input
        {...{ ref: honeypot }}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={honeypotStyles}
      />
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter email"
          aria-label="Email address"
          {...register("email")}
        />
        <Button type="submit" size="icon" disabled={isSubmitting} aria-label="Subscribe">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </Button>
      </div>
      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      {formError && (
        <p role="alert" className="text-xs text-destructive">
          {formError}
        </p>
      )}
    </form>
  );
}
