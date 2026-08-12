"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { honeypotStyles, submitJson } from "@/lib/form-client";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [formError, setFormError] = React.useState("");
  // When the form mounted — the API rejects submissions that arrive
  // implausibly fast after render.
  const renderedAt = React.useRef(Date.now());
  const honeypot = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setFormError("");

    const result = await submitJson("/api/contact", values, {
      website: honeypot.current?.value ?? "",
      renderedAt: renderedAt.current,
    });

    if (!result.ok) {
      // Field errors from the server's own validation take precedence, so a
      // rejected field is highlighted rather than reported as a generic failure.
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ContactFormValues, { message: messages[0] });
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
        <h3 className="text-lg font-semibold text-foreground">Message sent</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{successMessage}</p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => {
            renderedAt.current = Date.now();
            setSubmitted(false);
          }}
        >
          Send another message
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
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Enter name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" placeholder="Acme Inc." {...register("company")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="How can we help?" {...register("subject")} />
          {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell us a bit about your project or question..."
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
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
            <Loader2 className="size-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            Send message <Send className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
