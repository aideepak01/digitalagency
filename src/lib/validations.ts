import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  company: z.string().optional(),
  subject: z.string().min(2, "Please enter a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const consultationFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  notes: z.string().optional(),
});
export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export const quoteFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  description: z.string().min(20, "Please provide at least a brief description (20+ characters)"),
});
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const newsletterFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
});
export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export const applicationFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  linkedin: z.url("Please enter a valid URL").optional().or(z.literal("")),
  coverNote: z.string().min(20, "Please tell us a bit about why you're a fit (20+ characters)"),
});
export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
