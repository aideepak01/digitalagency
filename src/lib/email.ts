import nodemailer, { type Transporter } from "nodemailer";

/**
 * Outbound mail over SMTP.
 *
 * Hostinger provides the mailboxes this site already advertises
 * (sbabu@ / sales@sbabuai.com), so submissions are delivered through
 * smtp.hostinger.com rather than a third-party API — no extra vendor, and the
 * From address matches the domain, which is what keeps SPF/DKIM aligned.
 *
 * Nothing here throws into a request path: `sendMail` reports failure as a
 * value so a route can persist the lead first and treat a bounced notification
 * as a logged problem rather than a lost customer.
 */

const globalForMail = globalThis as unknown as { __sbabuMailer?: Transporter | null };

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function getTransport(): Transporter | null {
  if (!isEmailConfigured()) return null;
  if (globalForMail.__sbabuMailer) return globalForMail.__sbabuMailer;

  const port = Number(process.env.SMTP_PORT ?? 465);
  globalForMail.__sbabuMailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return globalForMail.__sbabuMailer;
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export type MailResult = { ok: true } | { ok: false; error: string };

export async function sendMail(input: MailInput): Promise<MailResult> {
  const transport = getTransport();
  if (!transport) {
    return { ok: false, error: "SMTP is not configured" };
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown SMTP error" };
  }
}

/* ------------------------------------------------------------- templates */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type MailField = { label: string; value: string | null | undefined };

/** Internal notification: a plain labelled table of whatever was submitted. */
export function notificationTemplate(heading: string, fields: MailField[]) {
  const present = fields.filter((field) => field.value != null && field.value !== "");

  const rows = present
    .map(
      (field) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#64748b;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(
          field.label,
        )}</td><td style="padding:6px 0;color:#0f172a;font-size:14px">${escapeHtml(
          String(field.value),
        ).replace(/\n/g, "<br />")}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:28px">
<h1 style="margin:0 0 18px;font-size:18px;color:#0f172a">${escapeHtml(heading)}</h1>
<table style="width:100%;border-collapse:collapse">${rows}</table>
</div></body></html>`;

  const text = `${heading}\n\n${present.map((f) => `${f.label}: ${f.value}`).join("\n")}`;

  return { html, text };
}

/** Confirmation sent to the person who submitted the form. */
export function autoresponderTemplate(options: {
  siteName: string;
  siteUrl: string;
  name: string;
  heading: string;
  body: string;
}) {
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:32px">
<h1 style="margin:0 0 14px;font-size:20px;color:#0f172a">${escapeHtml(options.heading)}</h1>
<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155">Hi ${escapeHtml(
    options.name,
  )},</p>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#334155">${escapeHtml(
    options.body,
  )}</p>
<p style="margin:0;font-size:14px;line-height:1.6;color:#64748b">— The ${escapeHtml(
    options.siteName,
  )} team<br /><a href="${escapeHtml(options.siteUrl)}" style="color:#6366f1">${escapeHtml(
    options.siteUrl,
  )}</a></p>
</div></body></html>`;

  const text = `Hi ${options.name},\n\n${options.body}\n\n— The ${options.siteName} team\n${options.siteUrl}`;

  return { html, text };
}
