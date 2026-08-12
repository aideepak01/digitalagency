import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

/**
 * Résumé storage.
 *
 * Files are written to an absolute directory **outside the project tree**. The
 * Hostinger deploy is a git pull plus an in-place rebuild, so anything stored
 * under the repo — including `public/` — is liable to be wiped or overwritten by
 * the next push. `UPLOAD_DIR` must point somewhere the deploy never touches.
 *
 * Only the stored path is kept in the database; the file is served back through
 * an authenticated admin route, never from a public URL.
 */

const MAX_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 5 * 1024 * 1024);

/** Extension is checked as well as MIME: browsers are inconsistent about type. */
const ALLOWED = new Map<string, string[]>([
  ["application/pdf", [".pdf"]],
  ["application/msword", [".doc"]],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", [".docx"]],
]);

export type UploadResult =
  | { ok: true; storedPath: string; originalName: string; mimeType: string; size: number }
  | { ok: false; error: string };

export function getUploadDir(): string {
  return resolve(process.env.UPLOAD_DIR ?? join(process.cwd(), "..", "sbabuai-uploads"));
}

export async function storeResume(file: File): Promise<UploadResult> {
  if (file.size === 0) {
    return { ok: false, error: "The selected file is empty." };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      error: `Résumé must be ${Math.floor(MAX_BYTES / (1024 * 1024))}MB or smaller.`,
    };
  }

  const extensions = ALLOWED.get(file.type);
  const extension = extname(file.name).toLowerCase();
  if (!extensions || !extensions.includes(extension)) {
    return { ok: false, error: "Résumé must be a PDF, DOC, or DOCX file." };
  }

  // The stored name is generated, never derived from user input — a filename
  // is attacker-controlled and must not be able to steer the write path.
  const storedName = `${Date.now()}-${randomBytes(8).toString("hex")}${extension}`;
  const directory = join(getUploadDir(), "resumes");
  const storedPath = join(directory, storedName);

  try {
    await mkdir(directory, { recursive: true });
    await writeFile(storedPath, Buffer.from(await file.arrayBuffer()));
  } catch (error) {
    console.error("[uploads] write failed:", error);
    return { ok: false, error: "We couldn't store your résumé. Please try again." };
  }

  return {
    ok: true,
    storedPath,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

/**
 * Guards the admin download route: resolves a stored path and confirms it is
 * still inside UPLOAD_DIR, so a tampered database value cannot be used to read
 * arbitrary files off the server.
 */
export function isInsideUploadDir(candidate: string): boolean {
  const root = getUploadDir();
  const resolved = resolve(candidate);
  return resolved === root || resolved.startsWith(root + sep);
}
