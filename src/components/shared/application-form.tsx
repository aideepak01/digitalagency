"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { applicationFormSchema, type ApplicationFormValues } from "@/lib/validations";

export function ApplicationForm({ jobTitle }: { jobTitle: string }) {
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Application submitted</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thanks for applying to the {jobTitle} role. Our team will review your application and
          follow up if there&apos;s a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-name">Full name</Label>
          <Input id="a-name" placeholder="Jane Cooper" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-email">Email</Label>
          <Input id="a-email" type="email" placeholder="jane@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-phone">Phone</Label>
          <Input id="a-phone" type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-linkedin">LinkedIn / Portfolio (optional)</Label>
          <Input id="a-linkedin" placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
          {errors.linkedin && (
            <p className="text-xs text-destructive">{errors.linkedin.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="a-cover">Why are you a fit for this role?</Label>
        <Textarea
          id="a-cover"
          rows={5}
          placeholder="Tell us about your relevant experience..."
          {...register("coverNote")}
        />
        {errors.coverNote && (
          <p className="text-xs text-destructive">{errors.coverNote.message}</p>
        )}
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 self-start rounded-full bg-gradient-brand px-7 text-white hover:opacity-90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            Submit Application <Send className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
