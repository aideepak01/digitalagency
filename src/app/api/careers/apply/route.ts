import { query } from "@/lib/db/client";
import { jobApplications } from "@/lib/db/schema";
import { getJobBySlug } from "@/lib/db/content";
import { notifyAndRecord } from "@/lib/api/notify";
import { guardSubmission, jsonError, jsonSuccess } from "@/lib/api/submissions";
import { storeResume } from "@/lib/uploads";
import { applicationFormSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Job applications arrive as multipart/form-data because of the résumé, so the
 * fields are read off a FormData rather than parsed from JSON.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Malformed request body.", 400);
  }

  const renderedAtRaw = form.get("renderedAt");
  const body = {
    name: str(form.get("name")),
    email: str(form.get("email")),
    phone: str(form.get("phone")),
    linkedin: str(form.get("linkedin")),
    coverNote: str(form.get("coverNote")),
    website: str(form.get("website")),
    renderedAt: renderedAtRaw ? Number(renderedAtRaw) : undefined,
  };

  const parsed = await guardSubmission(request, body, applicationFormSchema, {
    scope: "careers",
    limit: 3,
  });
  if (!parsed.ok) return parsed.response;

  const { data, context } = parsed;

  const jobSlug = str(form.get("jobSlug"));
  if (!jobSlug) {
    return jsonError("Please correct the highlighted fields.", 400, {
      fieldErrors: { jobSlug: ["Missing job reference."] },
    });
  }

  // Applying to a role that does not exist is almost always a stale tab or a
  // scripted post; either way there is nothing sensible to file it under.
  const job = await getJobBySlug(jobSlug);
  if (!job) {
    return jsonError("That role is no longer open.", 404);
  }

  const resumeEntry = form.get("resume");
  let resume: Awaited<ReturnType<typeof storeResume>> | null = null;
  if (resumeEntry instanceof File && resumeEntry.size > 0) {
    resume = await storeResume(resumeEntry);
    if (!resume.ok) {
      return jsonError("Please correct the highlighted fields.", 400, {
        fieldErrors: { resume: [resume.error] },
      });
    }
  }

  let rowId: number;
  try {
    const [row] = await query((db) =>
      db
        .insert(jobApplications)
        .values({
          jobSlug: job.slug,
          jobTitle: job.title,
          name: data.name,
          email: data.email,
          phone: data.phone,
          linkedin: data.linkedin || null,
          coverNote: data.coverNote,
          resumePath: resume?.ok ? resume.storedPath : null,
          resumeOriginalName: resume?.ok ? resume.originalName : null,
          resumeMimeType: resume?.ok ? resume.mimeType : null,
          resumeSize: resume?.ok ? resume.size : null,
          ipHash: context.ipHash,
          userAgent: context.userAgent,
          sourcePath: context.sourcePath,
        })
        .returning({ id: jobApplications.id }),
    );
    rowId = row.id;
  } catch (error) {
    console.error("[api/careers/apply] insert failed:", error);
    return jsonError("We couldn't submit your application. Please try again shortly.", 500);
  }

  await notifyAndRecord({
    table: jobApplications,
    rowId,
    heading: `New application — ${job.title}`,
    fields: [
      { label: "Role", value: job.title },
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone },
      { label: "LinkedIn", value: data.linkedin },
      { label: "Résumé", value: resume?.ok ? resume.originalName : "Not attached" },
      { label: "Cover note", value: data.coverNote },
    ],
    submitter: { name: data.name, email: data.email },
    autoresponder: {
      heading: `We received your application for ${job.title}`,
      body: "Thanks for applying. Our team reviews every application personally and will be in touch if there's a good fit.",
    },
  });

  return jsonSuccess("Application submitted — thanks for your interest.");
}

function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}
