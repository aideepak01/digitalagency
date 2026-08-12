import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

import * as t from "@/lib/db/schema";

/**
 * The five submission tables, described the same way the content registry
 * describes editable models — so one inbox screen and one CSV exporter serve
 * all of them.
 */

export interface LeadColumn {
  name: string;
  label: string;
  /** Rendered in the expanded detail view rather than the table row. */
  detail?: boolean;
}

export interface LeadType {
  key: string;
  label: string;
  singular: string;
  table: PgTable;
  /** Column holding the submitter's email, used for the mailto action. */
  emailColumn: string;
  /** Column used as the row's title. */
  titleColumn: string;
  columns: LeadColumn[];
  hasResume?: boolean;
  /** Newsletter rows are subscriptions, not one-off messages. */
  readable: boolean;
}

export const leadTypes: LeadType[] = [
  {
    key: "contact",
    label: "Contact messages",
    singular: "message",
    table: t.contactSubmissions,
    emailColumn: "email",
    titleColumn: "subject",
    readable: true,
    columns: [
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "company", label: "Company" },
      { name: "subject", label: "Subject" },
      { name: "message", label: "Message", detail: true },
    ],
  },
  {
    key: "consultation",
    label: "Consultation requests",
    singular: "request",
    table: t.consultationRequests,
    emailColumn: "email",
    titleColumn: "service",
    readable: true,
    columns: [
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone" },
      { name: "company", label: "Company" },
      { name: "service", label: "Service" },
      { name: "preferredDate", label: "Preferred date" },
      { name: "notes", label: "Notes", detail: true },
    ],
  },
  {
    key: "quote",
    label: "Quote requests",
    singular: "request",
    table: t.quoteRequests,
    emailColumn: "email",
    titleColumn: "projectType",
    readable: true,
    columns: [
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "company", label: "Company" },
      { name: "projectType", label: "Project type" },
      { name: "budget", label: "Budget" },
      { name: "timeline", label: "Timeline" },
      { name: "description", label: "Description", detail: true },
    ],
  },
  {
    key: "newsletter",
    label: "Newsletter subscribers",
    singular: "subscriber",
    table: t.newsletterSubscribers,
    emailColumn: "email",
    titleColumn: "email",
    readable: false,
    columns: [
      { name: "email", label: "Email" },
      { name: "isActive", label: "Active" },
      { name: "subscribedAt", label: "Subscribed" },
      { name: "unsubscribedAt", label: "Unsubscribed" },
    ],
  },
  {
    key: "applications",
    label: "Job applications",
    singular: "application",
    table: t.jobApplications,
    emailColumn: "email",
    titleColumn: "jobTitle",
    readable: true,
    hasResume: true,
    columns: [
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone" },
      { name: "jobTitle", label: "Role" },
      { name: "linkedin", label: "LinkedIn" },
      { name: "coverNote", label: "Cover note", detail: true },
    ],
  },
];

export function getLeadType(key: string): LeadType | undefined {
  return leadTypes.find((lead) => lead.key === key);
}

export function leadColumns(lead: LeadType): Record<string, PgColumn> {
  return lead.table as unknown as Record<string, PgColumn>;
}
