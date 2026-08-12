"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, FileText, Loader2 } from "lucide-react";

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
import { honeypotStyles, submitJson } from "@/lib/form-client";
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
  const [successMessage, setSuccessMessage] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const renderedAt = React.useRef(Date.now());
  const honeypot = React.useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
  });

  async function onSubmit(values: QuoteFormValues) {
    setFormError("");

    const result = await submitJson("/api/quote", values, {
      website: honeypot.current?.value ?? "",
      renderedAt: renderedAt.current,
    });

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof QuoteFormValues, { message: messages[0] });
        }
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
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Request received</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{successMessage}</p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => {
            renderedAt.current = Date.now();
            setSubmitted(false);
          }}
        >
          Request another estimate
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <input
        {...{ ref: honeypot }}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={honeypotStyles}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-name">Full name</Label>
          <Input id="q-name" placeholder="Enter name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-email">Email</Label>
          <Input id="q-email" type="email" placeholder="Enter email" {...register("email")} />
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
      {formError && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {formError}
        </p>
      )}
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
