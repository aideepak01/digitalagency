import { getSession } from "@/lib/auth";
import { getLeadType } from "@/lib/admin/leads";
import { listLeads } from "@/lib/admin/lead-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * CSV export of a submission table.
 *
 * Middleware already covers /admin, but this handler checks the session itself
 * too — it emits customer data, so it should not be one misconfigured matcher
 * away from being public.
 */
export async function GET(_request: Request, context: { params: Promise<{ type: string }> }) {
  if (!(await getSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { type } = await context.params;
  const lead = getLeadType(type);
  if (!lead) return new Response("Not found", { status: 404 });

  const rows = await listLeads(type, { limit: 10_000 });
  const headers = ["id", ...lead.columns.map((column) => column.name), "createdAt"];

  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
  ].join("\r\n");

  const filename = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);

  // A leading =, +, -, or @ makes a spreadsheet treat the cell as a formula.
  // Submissions are attacker-controlled text, so neutralise it.
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text;

  return `"${guarded.replace(/"/g, '""')}"`;
}
