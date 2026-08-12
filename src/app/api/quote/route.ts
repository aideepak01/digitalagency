import { query } from "@/lib/db/client";
import { quoteRequests } from "@/lib/db/schema";
import { notifyAndRecord } from "@/lib/api/notify";
import { jsonError, jsonSuccess, parseSubmission } from "@/lib/api/submissions";
import { quoteFormSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseSubmission(request, quoteFormSchema, { scope: "quote" });
  if (!parsed.ok) return parsed.response;

  const { data, context } = parsed;

  let rowId: number;
  try {
    const [row] = await query((db) =>
      db
        .insert(quoteRequests)
        .values({
          name: data.name,
          email: data.email,
          company: data.company || null,
          projectType: data.projectType,
          budget: data.budget,
          timeline: data.timeline,
          description: data.description,
          ipHash: context.ipHash,
          userAgent: context.userAgent,
          sourcePath: context.sourcePath,
        })
        .returning({ id: quoteRequests.id }),
    );
    rowId = row.id;
  } catch (error) {
    console.error("[api/quote] insert failed:", error);
    return jsonError("We couldn't submit your request. Please try again shortly.", 500);
  }

  await notifyAndRecord({
    table: quoteRequests,
    rowId,
    heading: "New project estimate request",
    fields: [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Company", value: data.company },
      { label: "Project type", value: data.projectType },
      { label: "Budget", value: data.budget },
      { label: "Timeline", value: data.timeline },
      { label: "Description", value: data.description },
    ],
    submitter: { name: data.name, email: data.email },
    autoresponder: {
      heading: "We're preparing your estimate",
      body: "Thanks for the detail — our team is reviewing your project and will come back with an estimate and next steps within two business days.",
    },
  });

  return jsonSuccess("Request received — we'll send your estimate within two business days.");
}
