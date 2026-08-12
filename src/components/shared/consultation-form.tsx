"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";

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
import { consultationFormSchema, type ConsultationFormValues } from "@/lib/validations";

/** Services come from the database via the contact page, not a static import. */
export interface ConsultationServiceOption {
  slug: string;
  shortName: string;
}

export function ConsultationForm({ services }: { services: ConsultationServiceOption[] }) {
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
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
  });

  async function onSubmit(values: ConsultationFormValues) {
    setFormError("");

    const result = await submitJson("/api/consultation", values, {
      website: honeypot.current?.value ?? "",
      renderedAt: renderedAt.current,
    });

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ConsultationFormValues, { message: messages[0] });
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
        <h3 className="text-lg font-semibold text-foreground">Consultation requested</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{successMessage}</p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => {
            renderedAt.current = Date.now();
            setSubmitted(false);
          }}
        >
          Book another
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
          <Label htmlFor="c-name">Full name</Label>
          <Input id="c-name" placeholder="Jane Cooper" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" placeholder="Enter email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" type="tel" placeholder="+91 9310249299" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-company">Company (optional)</Label>
          <Input id="c-company" placeholder="Acme Inc." {...register("company")} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-service">Service of interest</Label>
          <Controller
            control={control}
            name="service"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="c-service" className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.slug} value={service.slug}>
                      {service.shortName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.service && <p className="text-xs text-destructive">{errors.service.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-date">Preferred date</Label>
          <Input id="c-date" type="date" {...register("preferredDate")} />
          {errors.preferredDate && (
            <p className="text-xs text-destructive">{errors.preferredDate.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-notes">Anything we should know? (optional)</Label>
        <Textarea id="c-notes" rows={4} placeholder="Brief context about your project..." {...register("notes")} />
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
            <Loader2 className="size-4 animate-spin" /> Booking...
          </>
        ) : (
          <>
            Book Free Consultation <CalendarCheck className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
