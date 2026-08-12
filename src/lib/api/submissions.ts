import { NextResponse } from "next/server";
import type { z } from "zod";

import { getClientIp, checkRateLimit, hashIp } from "@/lib/rate-limit";
import { spamGuardSchema } from "@/lib/validations";

/**
 * Shared plumbing for the five public form endpoints: spam guards, rate
 * limiting, and server-side re-validation against the same Zod schemas the
 * client uses.
 *
 * Client-side validation is a convenience; these schemas are the actual
 * contract, because a POST can arrive without ever loading the form.
 */

/** Minimum plausible time between a form rendering and a human submitting it. */
const MIN_FILL_MILLISECONDS = 2000;

export interface SubmissionContext {
  ipHash: string;
  userAgent: string | null;
  sourcePath: string | null;
}

export type ParseResult<T> =
  | { ok: true; data: T; context: SubmissionContext }
  | { ok: false; response: NextResponse };

export function jsonError(
  message: string,
  status: number,
  extra?: { fieldErrors?: Record<string, string[]>; retryAfterSeconds?: number },
) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (extra?.retryAfterSeconds) {
    headers.set("Retry-After", String(extra.retryAfterSeconds));
  }
  return NextResponse.json(
    { ok: false, message, fieldErrors: extra?.fieldErrors },
    { status, headers },
  );
}

export function jsonSuccess(message: string, data?: Record<string, unknown>) {
  return NextResponse.json(
    { ok: true, message, ...data },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Validates a JSON submission end to end.
 *
 * Order matters: the honeypot and timing checks run before the rate limiter so
 * obvious bots do not consume a legitimate visitor's budget on a shared IP.
 */
export async function parseSubmission<S extends z.ZodType>(
  request: Request,
  schema: S,
  options: { scope: string; limit?: number; windowSeconds?: number },
): Promise<ParseResult<z.infer<S>>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { ok: false, response: jsonError("Malformed request body.", 400) };
  }

  return guardSubmission(request, body, schema, options);
}

/**
 * The same checks for a body that has already been decoded — the careers form
 * posts multipart/form-data because it carries a résumé, so it cannot go
 * through `request.json()`.
 */
export async function guardSubmission<S extends z.ZodType>(
  request: Request,
  body: unknown,
  schema: S,
  options: { scope: string; limit?: number; windowSeconds?: number },
): Promise<ParseResult<z.infer<S>>> {
  const guard = spamGuardSchema.safeParse(body);
  if (!guard.success || guard.data.website) {
    // Deliberately indistinguishable from success: telling a bot it was caught
    // just teaches whoever wrote it to drop the field.
    return { ok: false, response: jsonSuccess("Thanks — your message has been received.") };
  }

  if (guard.data.renderedAt && Date.now() - guard.data.renderedAt < MIN_FILL_MILLISECONDS) {
    return { ok: false, response: jsonSuccess("Thanks — your message has been received.") };
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const limit = await checkRateLimit(options.scope, ipHash, {
    limit: options.limit,
    windowSeconds: options.windowSeconds,
  });

  if (!limit.allowed) {
    return {
      ok: false,
      response: jsonError("Too many submissions. Please try again later.", 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      }),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const { fieldErrors } = z2FieldErrors(parsed.error);
    return {
      ok: false,
      response: jsonError("Please correct the highlighted fields.", 400, { fieldErrors }),
    };
  }

  return {
    ok: true,
    data: parsed.data,
    context: {
      ipHash,
      userAgent: request.headers.get("user-agent"),
      sourcePath: request.headers.get("referer"),
    },
  };
}

/** Flattens a ZodError into the `{ field: [messages] }` shape forms render. */
function z2FieldErrors(error: z.ZodError): { fieldErrors: Record<string, string[]> } {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { fieldErrors };
}
