import { randomBytes } from "node:crypto";
import { sql } from "drizzle-orm";

import { query } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
import { getSiteConfig } from "@/lib/db/settings";
import { autoresponderTemplate, sendMail } from "@/lib/email";
import { jsonError, jsonSuccess, parseSubmission } from "@/lib/api/submissions";
import { newsletterFormSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseSubmission(request, newsletterFormSchema, {
    scope: "newsletter",
    limit: 10,
  });
  if (!parsed.ok) return parsed.response;

  const { data, context } = parsed;
  const email = data.email.trim().toLowerCase();

  let token: string;
  try {
    // Idempotent: re-subscribing an existing address reactivates it and keeps
    // the original token rather than erroring on the unique constraint.
    const [row] = await query((db) =>
      db
        .insert(newsletterSubscribers)
        .values({
          email,
          unsubscribeToken: randomBytes(24).toString("hex"),
          ipHash: context.ipHash,
          userAgent: context.userAgent,
          sourcePath: context.sourcePath,
        })
        .onConflictDoUpdate({
          target: newsletterSubscribers.email,
          set: { isActive: true, unsubscribedAt: null, subscribedAt: sql`now()` },
        })
        .returning({ unsubscribeToken: newsletterSubscribers.unsubscribeToken }),
    );
    token = row.unsubscribeToken;
  } catch (error) {
    console.error("[api/newsletter] upsert failed:", error);
    return jsonError("We couldn't complete your subscription. Please try again shortly.", 500);
  }

  const siteConfig = await getSiteConfig();
  const unsubscribeUrl = `${siteConfig.url}/api/newsletter/unsubscribe?token=${token}`;
  const template = autoresponderTemplate({
    siteName: siteConfig.name,
    siteUrl: siteConfig.url,
    name: "there",
    heading: "You're subscribed",
    body: "Thanks for subscribing — you'll get our insights on AI, software, and product strategy. No spam, and you can unsubscribe any time using the link below.",
  });

  const result = await sendMail({
    to: email,
    subject: `You're subscribed to ${siteConfig.name}`,
    html: template.html.replace(
      "</div></body>",
      `<p style="margin:20px 0 0;font-size:12px;color:#94a3b8"><a href="${unsubscribeUrl}" style="color:#94a3b8">Unsubscribe</a></p></div></body>`,
    ),
    text: `${template.text}\n\nUnsubscribe: ${unsubscribeUrl}`,
  });

  if (!result.ok) {
    // The subscription itself succeeded; only the welcome mail failed.
    console.error("[api/newsletter] welcome email failed:", result.error);
  }

  return jsonSuccess("You're subscribed — thanks for joining.");
}
