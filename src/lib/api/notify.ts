import { eq } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

import { query } from "@/lib/db/client";
import { getSiteConfig } from "@/lib/db/settings";
import {
  autoresponderTemplate,
  notificationTemplate,
  sendMail,
  type MailField,
} from "@/lib/email";

/**
 * Sends the internal notification and the submitter's confirmation for a lead
 * that has already been written to the database.
 *
 * Called *after* the insert, and never allowed to throw: if SMTP is down the
 * lead is still captured and visible in the admin inbox. The outcome is
 * recorded on the row so a failed notification is discoverable rather than
 * silent.
 */
export async function notifyAndRecord(options: {
  table: PgTable & { id: PgColumn; emailSent: PgColumn; emailError: PgColumn };
  rowId: number;
  heading: string;
  fields: MailField[];
  submitter: { name: string; email: string };
  autoresponder: { heading: string; body: string };
}): Promise<void> {
  const siteConfig = await getSiteConfig();
  const notificationTo = process.env.NOTIFICATION_EMAIL ?? siteConfig.salesEmail;

  const internal = notificationTemplate(options.heading, options.fields);
  const internalResult = await sendMail({
    to: notificationTo,
    subject: `${options.heading} — ${options.submitter.name}`,
    html: internal.html,
    text: internal.text,
    // Replying in the mail client goes straight back to the lead.
    replyTo: options.submitter.email,
  });

  const confirmation = autoresponderTemplate({
    siteName: siteConfig.name,
    siteUrl: siteConfig.url,
    name: options.submitter.name,
    heading: options.autoresponder.heading,
    body: options.autoresponder.body,
  });
  const confirmationResult = await sendMail({
    to: options.submitter.email,
    subject: options.autoresponder.heading,
    html: confirmation.html,
    text: confirmation.text,
    replyTo: siteConfig.salesEmail,
  });

  const errors = [
    internalResult.ok ? null : `notification: ${internalResult.error}`,
    confirmationResult.ok ? null : `confirmation: ${confirmationResult.error}`,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error(`[notify] ${options.heading} #${options.rowId}:`, errors.join("; "));
  }

  try {
    await query((db) =>
      db
        .update(options.table)
        .set({
          emailSent: internalResult.ok,
          emailError: errors.length > 0 ? errors.join("; ") : null,
        })
        .where(eq(options.table.id, options.rowId)),
    );
  } catch (error) {
    console.error("[notify] could not record delivery state:", error);
  }
}
