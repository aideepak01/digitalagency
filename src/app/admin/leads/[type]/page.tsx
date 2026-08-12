import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, FileText, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLeadType } from "@/lib/admin/leads";
import { listLeads, markLeadRead } from "@/lib/admin/lead-actions";

export default async function LeadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ unread?: string }>;
}) {
  const { type } = await params;
  const { unread } = await searchParams;

  const lead = getLeadType(type);
  if (!lead) notFound();

  const unreadOnly = unread === "1";
  const rows = await listLeads(type, { unreadOnly });

  const rowColumns = lead.columns.filter((column) => !column.detail);
  const detailColumns = lead.columns.filter((column) => column.detail);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{lead.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? lead.singular : `${lead.singular}s`}
            {unreadOnly ? " (unread only)" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lead.readable && (
            <Button asChild variant="outline" size="sm">
              <Link href={unreadOnly ? `/admin/leads/${type}` : `/admin/leads/${type}?unread=1`}>
                {unreadOnly ? "Show all" : "Unread only"}
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <a href={`/admin/leads/${type}/export`}>
              <Download className="size-4" /> Export CSV
            </a>
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => {
            const id = Number(row.id);
            const isRead = Boolean(row.isRead);
            const email = String(row[lead.emailColumn] ?? "");

            return (
              <article
                key={id}
                className={`rounded-2xl border bg-card p-5 ${
                  lead.readable && !isRead ? "border-primary/40" : "border-border"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-foreground">
                      {String(row[lead.titleColumn] ?? "—")}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(row.createdAt ?? row.subscribedAt)}
                      {lead.readable && !isRead && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                          New
                        </span>
                      )}
                      {row.emailError ? (
                        <span
                          className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 font-medium text-destructive"
                          title={String(row.emailError)}
                        >
                          Email failed
                        </span>
                      ) : null}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {email && (
                      <Button asChild variant="outline" size="sm">
                        <a href={`mailto:${email}`}>
                          <Mail className="size-4" /> Reply
                        </a>
                      </Button>
                    )}
                    {lead.hasResume && row.resumePath ? (
                      <Button asChild variant="outline" size="sm">
                        <a href={`/admin/resumes/${id}`}>
                          <FileText className="size-4" /> Résumé
                        </a>
                      </Button>
                    ) : null}
                    {lead.readable && (
                      <form
                        action={async () => {
                          "use server";
                          await markLeadRead(type, id, !isRead);
                        }}
                      >
                        <Button type="submit" variant="ghost" size="sm">
                          {isRead ? "Mark unread" : "Mark read"}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  {rowColumns.map((column) => (
                    <div key={column.name} className="min-w-0">
                      <dt className="text-xs text-muted-foreground">{column.label}</dt>
                      <dd className="truncate text-foreground">{format(row[column.name])}</dd>
                    </div>
                  ))}
                </dl>

                {detailColumns.map((column) =>
                  row[column.name] ? (
                    <div key={column.name} className="mt-4">
                      <p className="text-xs text-muted-foreground">{column.label}</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                        {String(row[column.name])}
                      </p>
                    </div>
                  ) : null,
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function format(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
}

function formatDate(value: unknown): string {
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "string") return new Date(value).toLocaleString();
  return "—";
}
