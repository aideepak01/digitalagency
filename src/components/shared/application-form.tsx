"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { honeypotStyles, submitFormData } from "@/lib/form-client";
import { applicationFormSchema, type ApplicationFormValues } from "@/lib/validations";

/**
 * Posts multipart/form-data rather than JSON, because an application carries a
 * résumé. `jobSlug` tells the API which opening this is for; the server
 * re-checks it against the database before filing the application.
 */
export function ApplicationForm({ jobSlug, jobTitle }: { jobSlug: string; jobTitle: string }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [resumeError, setResumeError] = React.useState("");
  const [resumeName, setResumeName] = React.useState("");
  const renderedAt = React.useRef(Date.now());
  const honeypot = React.useRef<HTMLInputElement>(null);
  const resumeInput = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
  });

  async function onSubmit(values: ApplicationFormValues) {
    setFormError("");
    setResumeError("");

    const formData = new FormData();
    formData.set("jobSlug", jobSlug);
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("linkedin", values.linkedin ?? "");
    formData.set("coverNote", values.coverNote);
    formData.set("website", honeypot.current?.value ?? "");
    formData.set("renderedAt", String(renderedAt.current));

    const file = resumeInput.current?.files?.[0];
    if (file) formData.set("resume", file);

    const result = await submitFormData("/api/careers/apply", formData);

    if (!result.ok) {
      if (result.fieldErrors?.resume) {
        setResumeError(result.fieldErrors.resume[0]);
      }
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (field === "resume" || field === "jobSlug") continue;
          setError(field as keyof ApplicationFormValues, { message: messages[0] });
        }
      }
      setFormError(result.message);
      return;
    }

    setSuccessMessage(result.message);
    setSubmitted(true);
    reset();
    setResumeName("");
    if (resumeInput.current) resumeInput.current.value = "";
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Application submitted</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {successMessage} We&apos;ll follow up about the {jobTitle} role if there&apos;s a fit.
        </p>
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
          <Label htmlFor="a-name">Full name</Label>
          <Input id="a-name" placeholder="Enter name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-email">Email</Label>
          <Input id="a-email" type="email" placeholder="Enter email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-phone">Phone</Label>
          <Input id="a-phone" type="tel" placeholder="+91 9310249299" {...register("phone")} />
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
        <Label htmlFor="a-resume">Résumé (PDF, DOC, or DOCX — optional)</Label>
        <input
          {...{ ref: resumeInput }}
          id="a-resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => {
            setResumeError("");
            setResumeName(event.target.files?.[0]?.name ?? "");
          }}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:font-medium file:text-foreground"
        />
        {resumeName && <p className="text-xs text-muted-foreground">Selected: {resumeName}</p>}
        {resumeError && <p className="text-xs text-destructive">{resumeError}</p>}
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
            Submit Application <Send className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
