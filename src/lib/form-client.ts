"use client";

/**
 * Client-side helpers shared by the five public forms.
 *
 * These forms previously faked success with a timeout, so none of them had an
 * error path. Every submission now goes through here, which gives them a single
 * consistent shape for failures — including the field-level errors the server
 * returns when its Zod re-validation rejects something the browser let through.
 */

export interface SubmitResponse {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

const GENERIC_ERROR = "Something went wrong. Please try again, or email us directly.";

async function readResponse(response: Response): Promise<SubmitResponse> {
  let payload: Partial<SubmitResponse> = {};
  try {
    payload = (await response.json()) as Partial<SubmitResponse>;
  } catch {
    // A proxy error page or an empty body — fall through to the generic message.
  }

  if (!response.ok) {
    return {
      ok: false,
      message: payload.message ?? GENERIC_ERROR,
      fieldErrors: payload.fieldErrors,
    };
  }

  return {
    ok: payload.ok ?? true,
    message: payload.message ?? "Thanks — your submission has been received.",
    fieldErrors: payload.fieldErrors,
  };
}

/** Posts JSON, adding the honeypot and render-time fields the API expects. */
export async function submitJson(
  url: string,
  values: Record<string, unknown>,
  guard: { website: string; renderedAt: number },
): Promise<SubmitResponse> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, ...guard }),
    });
    return readResponse(response);
  } catch {
    // Network failure, offline, or the request was blocked.
    return { ok: false, message: GENERIC_ERROR };
  }
}

/** Posts multipart/form-data — used by the careers application (résumé upload). */
export async function submitFormData(url: string, formData: FormData): Promise<SubmitResponse> {
  try {
    const response = await fetch(url, { method: "POST", body: formData });
    return readResponse(response);
  } catch {
    return { ok: false, message: GENERIC_ERROR };
  }
}

/**
 * Styles for the honeypot input: removed from the layout and from the tab
 * order, but not `display:none` — some bots skip hidden inputs specifically.
 */
export const honeypotStyles = {
  position: "absolute" as const,
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap" as const,
  border: 0,
};
