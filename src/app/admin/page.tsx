import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Database,
  Inbox,
  Mail,
  Plus,
  TrendingUp,
} from "lucide-react";

import { isDatabaseConfigured } from "@/lib/db/client";
import { isEmailConfigured } from "@/lib/email";
import { contentStats, leadStats, recentLeads } from "@/lib/admin/stats";

const quickActions = [
  { href: "/admin/collections/blog/new", label: "New blog post" },
  { href: "/admin/collections/portfolio/new", label: "New project" },
  { href: "/admin/collections/services/new", label: "New service" },
  { href: "/admin/collections/jobs/new", label: "New job opening" },
];

export default async function AdminDashboardPage() {
  const [leads, content, recent] = await Promise.all([
    leadStats(),
    contentStats(),
    recentLeads(8),
  ]);

  const totalUnread = leads.reduce((sum, entry) => sum + entry.unread, 0);
  const totalLeads = leads.reduce((sum, entry) => sum + entry.total, 0);
  const totalContent = content.reduce((sum, entry) => sum + entry.total, 0);
  const totalDrafts = content.reduce((sum, entry) => sum + (entry.total - entry.published), 0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalUnread > 0
              ? `${totalUnread} submission${totalUnread === 1 ? "" : "s"} waiting for review.`
              : "Everything reviewed — no new submissions."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-3.5" /> {action.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Misconfiguration here is invisible on the public site until a lead is
          lost, so surface it where an admin will actually see it. */}
      {!isDatabaseConfigured() && (
        <Banner
          tone="danger"
          icon={<AlertTriangle className="mt-0.5 size-5 shrink-0" />}
          title="DATABASE_URL is not set"
          body="The site is running without a database. Content is empty and no submission can be saved."
        />
      )}
      {!isEmailConfigured() && (
        <Banner
          tone="warning"
          icon={<Mail className="mt-0.5 size-5 shrink-0" />}
          title="SMTP is not configured"
          body="Submissions are still saved to the database, but no notification or confirmation emails are being sent. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD."
        />
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total submissions"
          value={totalLeads}
          icon={<Inbox className="size-4" />}
        />
        <SummaryCard
          label="Awaiting review"
          value={totalUnread}
          icon={<Clock className="size-4" />}
          emphasis={totalUnread > 0}
        />
        <SummaryCard
          label="Content entries"
          value={totalContent}
          icon={<Database className="size-4" />}
        />
        <SummaryCard
          label="Unpublished drafts"
          value={totalDrafts}
          icon={<TrendingUp className="size-4" />}
        />
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
        <section className="xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recent submissions
            </h2>
          </div>

          {recent.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
              No submissions yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {recent.map((lead) => (
                <li key={`${lead.type}-${lead.id}`}>
                  <Link
                    href={`/admin/leads/${lead.type}`}
                    className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/40"
                  >
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        lead.isRead ? "bg-transparent" : "bg-primary"
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          {lead.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{lead.typeLabel}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {lead.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {relativeTime(lead.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="xl:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Submissions by type
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {leads.map((entry) => (
              <Link
                key={entry.key}
                href={`/admin/leads/${entry.key}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"
              >
                <Inbox className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {entry.label}
                </span>
                {entry.unread > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {entry.unread} new
                  </span>
                )}
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {entry.total}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Content
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {content.map((entry) => {
            const drafts = entry.total - entry.published;
            return (
              <Link
                key={entry.key}
                href={`/admin/collections/${entry.key}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {entry.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {entry.total} total
                    {drafts > 0 && ` · ${drafts} draft${drafts === 1 ? "" : "s"}`}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  emphasis = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border bg-card p-5 ${
        emphasis ? "border-primary/40" : "border-border"
      }`}
    >
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon} {label}
      </span>
      <span
        className={`text-2xl font-semibold tabular-nums ${
          emphasis ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Banner({
  tone,
  icon,
  title,
  body,
}: {
  tone: "danger" | "warning";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  const styles =
    tone === "danger"
      ? "border-destructive/30 bg-destructive/5 text-destructive"
      : "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400";

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-5 py-4 ${styles}`}>
      {icon}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm opacity-90">{body}</p>
      </div>
    </div>
  );
}

/** Compact ages ("3h", "2d") keep the feed scannable at a glance. */
function relativeTime(date: Date | null): string {
  if (!date) return "—";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
