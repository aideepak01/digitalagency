import { query } from "@/lib/db/client";
import { consultationRequests } from "@/lib/db/schema";
import { notifyAndRecord } from "@/lib/api/notify";
import { jsonError, jsonSuccess, parseSubmission } from "@/lib/api/submissions";
import { consultationFormSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseSubmission(request, consultationFormSchema, {
    scope: "consultation",
  });
  if (!parsed.ok) return parsed.response;

  const { data, context } = parsed;

  let rowId: number;
  try {
    const [row] = await query((db) =>
      db
        .insert(consultationRequests)
        .values({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || null,
          service: data.service,
          preferredDate: data.preferredDate,
          notes: data.notes || null,
          ipHash: context.ipHash,
          userAgent: context.userAgent,
          sourcePath: context.sourcePath,
        })
        .returning({ id: consultationRequests.id }),
    );
    rowId = row.id;
  } catch (error) {
    console.error("[api/consultation] insert failed:", error);
    return jsonError("We couldn't book your consultation. Please try again shortly.", 500);
  }

  await notifyAndRecord({
    table: consultationRequests,
    rowId,
    heading: "New consultation request",
    fields: [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone },
      { label: "Company", value: data.company },
      { label: "Service", value: data.service },
      { label: "Preferred date", value: data.preferredDate },
      { label: "Notes", value: data.notes },
    ],
    submitter: { name: data.name, email: data.email },
    autoresponder: {
      heading: "Your consultation request is in",
      body: `Thanks for booking time with us. We'll confirm your preferred slot (${data.preferredDate}) by email within one business day.`,
    },
  });

  return jsonSuccess("Consultation requested — we'll confirm your slot within one business day.");
}
