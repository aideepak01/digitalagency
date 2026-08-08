"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/validations";

const projectTypes = [
  "AI Agent / Automation",
  "Website",
  "Web Application",
  "Mobile App",
  "CRM / ERP System",
  "UI/UX Design",
  "Other",
];

const budgetRanges = ["Under $10k", "$10k - $30k", "$30k - $75k", "$75k - $150k", "$150k+"];

const timelines = ["ASAP", "1-3 months", "3-6 months", "6+ months", "Flexible"];

export function QuoteForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
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
        <h3 className="text-lg font-semibold text-foreground">Request received</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          We&apos;ll review your project details and send a tailored estimate within two
          business days.
        </p>
        <Button variant="outline" className="mt-2" onClick={() => setSubmitted(false)}>
          Request another estimate
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-name">Full name</Label>
          <Input id="q-name" placeholder="Jane Cooper" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-email">Email</Label>
          <Input id="q-email" type="email" placeholder="jane@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="q-company">Company (optional)</Label>
        <Input id="q-company" placeholder="Acme Inc." {...register("company")} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-type">Project type</Label>
          <Controller
            control={control}
            name="projectType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="q-type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.projectType && (
            <p className="text-xs text-destructive">{errors.projectType.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-budget">Budget range</Label>
          <Controller
            control={control}
            name="budget"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="q-budget" className="w-full">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-timeline">Timeline</Label>
          <Controller
            control={control}
            name="timeline"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="q-timeline" className="w-full">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline} value={timeline}>
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.timeline && (
            <p className="text-xs text-destructive">{errors.timeline.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="q-description">Project description</Label>
        <Textarea
          id="q-description"
          rows={5}
          placeholder="What are you trying to build? Include goals, key features, and any constraints."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
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
            Get a Project Estimate <FileText className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
