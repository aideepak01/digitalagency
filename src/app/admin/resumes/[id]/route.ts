import { readFile } from "node:fs/promises";
import { eq } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { query } from "@/lib/db/client";
import { jobApplications } from "@/lib/db/schema";
import { isInsideUploadDir } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Streams an applicant's résumé to a signed-in admin.
 *
 * Uploads live outside the web root and are never publicly addressable, so this
 * route is the only way to read one — hence the explicit session check and the
 * path containment check below.
 */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await context.params;
  const recordId = Number(id);
  if (!Number.isInteger(recordId)) {
    return new Response("Not found", { status: 404 });
  }

  const [application] = await query((db) =>
    db
      .select({
        path: jobApplications.resumePath,
        name: jobApplications.resumeOriginalName,
        mime: jobApplications.resumeMimeType,
      })
      .from(jobApplications)
      .where(eq(jobApplications.id, recordId))
      .limit(1),
  );

  if (!application?.path) {
    return new Response("Not found", { status: 404 });
  }

  // Defence in depth: even a tampered database row must not be able to make
  // this read a file from outside the upload directory.
  if (!isInsideUploadDir(application.path)) {
    console.error("[admin/resumes] refused path outside upload dir:", application.path);
    return new Response("Not found", { status: 404 });
  }

  let file: Buffer;
  try {
    file = await readFile(application.path);
  } catch {
    return new Response("The stored file is no longer available.", { status: 410 });
  }

  const filename = (application.name ?? "resume").replace(/[^\w.\-]/g, "_");

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": application.mime ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
