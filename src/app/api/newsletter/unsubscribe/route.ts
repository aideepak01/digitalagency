import { eq, sql } from "drizzle-orm";

import { query } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe from the link in every newsletter email.
 *
 * A GET with an unguessable token, so it works from a mail client with no
 * session and no JavaScript. Responds with a small HTML page rather than JSON
 * because a person is looking at it.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return htmlResponse("Missing unsubscribe link", "That link is incomplete.", 400);
  }

  try {
    const rows = await query((db) =>
      db
        .update(newsletterSubscribers)
        .set({ isActive: false, unsubscribedAt: sql`now()` })
        .where(eq(newsletterSubscribers.unsubscribeToken, token))
        .returning({ email: newsletterSubscribers.email }),
    );

    if (rows.length === 0) {
      return htmlResponse("Link not recognised", "That unsubscribe link is no longer valid.", 404);
    }

    return htmlResponse(
      "You've been unsubscribed",
      "You won't receive any more emails from us. You can resubscribe at any time from our site.",
      200,
    );
  } catch (error) {
    console.error("[api/newsletter/unsubscribe] failed:", error);
    return htmlResponse("Something went wrong", "Please try again in a moment.", 500);
  }
}

function htmlResponse(heading: string, body: string, status: number) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${heading}</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
<div style="max-width:420px;padding:32px;text-align:center">
<h1 style="margin:0 0 12px;font-size:20px;color:#0f172a">${heading}</h1>
<p style="margin:0;font-size:15px;line-height:1.6;color:#475569">${body}</p>
</div></body></html>`,
    {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    },
  );
}
