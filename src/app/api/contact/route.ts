import { query } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { notifyAndRecord } from "@/lib/api/notify";
import { jsonError, jsonSuccess, parseSubmission } from "@/lib/api/submissions";
import { contactFormSchema } from "@/lib/validations";

// Writes to Postgres and sends mail — must run on Node, never cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseSubmission(request, contactFormSchema, { scope: "contact" });
  if (!parsed.ok) return parsed.response;

  const { data, context } = parsed;

  let rowId: number;
  try {
    // The row is committed before any mail is attempted: a customer enquiry
    // must not be lost because SMTP happened to be unavailable.
    const [row] = await query((db) =>
      db
        .insert(contactSubmissions)
        .values({
          name: data.name,
          email: data.email,
          company: data.company || null,
          subject: data.subject,
          message: data.message,
          ipHash: context.ipHash,
          userAgent: context.userAgent,
          sourcePath: context.sourcePath,
        })
        .returning({ id: contactSubmissions.id }),
    );
    rowId = row.id;
  } catch (error) {
    console.error("[api/contact] insert failed:", error);
    return jsonError("We couldn't save your message. Please try again shortly.", 500);
  }

  await notifyAndRecord({
    table: contactSubmissions,
    rowId,
    heading: "New contact enquiry",
    fields: [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Company", value: data.company },
      { label: "Subject", value: data.subject },
      { label: "Message", value: data.message },
    ],
    submitter: { name: data.name, email: data.email },
    autoresponder: {
      heading: "We received your message",
      body: "Thanks for reaching out. A member of our team will get back to you within one business day.",
    },
  });

  return jsonSuccess("Thanks for reaching out — we'll be in touch within one business day.");
}
