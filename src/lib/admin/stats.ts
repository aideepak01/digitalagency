import { desc, sql } from "drizzle-orm";

import { requireSession } from "@/lib/auth";
import { safeQuery } from "@/lib/db/client";
import { collections } from "./collections";
import { leadColumns, leadTypes } from "./leads";

/**
 * Aggregates for the dashboard and the sidebar badges.
 *
 * The counts are gathered with a single `union all` per concern rather than one
 * query per table. The sidebar renders on *every* admin page, so a naive
 * implementation would add sixteen round trips to each navigation.
 *
 * Everything here degrades to empty/zero through `safeQuery`: a stats panel is
 * not worth taking the admin down for.
 */

export interface LeadStat {
  key: string;
  label: string;
  total: number;
  unread: number;
  readable: boolean;
}

export interface ContentStat {
  key: string;
  label: string;
  group: string;
  icon: string;
  total: number;
  published: number;
}

export interface RecentLead {
  type: string;
  typeLabel: string;
  id: number;
  title: string;
  name: string;
  email: string;
  createdAt: Date | null;
  isRead: boolean;
}

export async function leadStats(): Promise<LeadStat[]> {
  await requireSession();

  const rows = await safeQuery(
    "leadStats",
    async (db) => {
      const parts = leadTypes.map((lead) => {
        const cols = leadColumns(lead);
        // Newsletter rows have no is_read column — report them as all-read so
        // the badge maths stays uniform.
        const unread = lead.readable
          ? sql`count(*) filter (where ${cols.isRead} = false)`
          : sql`0`;
        return sql`select ${lead.key}::text as key, count(*)::int as total, ${unread}::int as unread from ${lead.table}`;
      });

      const result = await db.execute(sql.join(parts, sql` union all `));
      return result.rows as { key: string; total: number; unread: number }[];
    },
    [],
  );

  const byKey = new Map(rows.map((row) => [row.key, row]));

  return leadTypes.map((lead) => ({
    key: lead.key,
    label: lead.label,
    readable: lead.readable,
    total: Number(byKey.get(lead.key)?.total ?? 0),
    unread: Number(byKey.get(lead.key)?.unread ?? 0),
  }));
}

export async function contentStats(): Promise<ContentStat[]> {
  await requireSession();

  const rows = await safeQuery(
    "contentStats",
    async (db) => {
      const parts = collections.map(
        (collection) =>
          sql`select ${collection.key}::text as key, count(*)::int as total, count(*) filter (where is_published)::int as published from ${collection.table}`,
      );

      const result = await db.execute(sql.join(parts, sql` union all `));
      return result.rows as { key: string; total: number; published: number }[];
    },
    [],
  );

  const byKey = new Map(rows.map((row) => [row.key, row]));

  return collections.map((collection) => ({
    key: collection.key,
    label: collection.label,
    group: collection.group,
    icon: collection.icon,
    total: Number(byKey.get(collection.key)?.total ?? 0),
    published: Number(byKey.get(collection.key)?.published ?? 0),
  }));
}

/**
 * The newest submissions across all five tables, merged into one feed — the
 * thing an admin actually wants on opening the dashboard.
 */
export async function recentLeads(limit = 8): Promise<RecentLead[]> {
  await requireSession();

  const perType = await Promise.all(
    leadTypes.map(async (lead) => {
      const cols = leadColumns(lead);
      const sortColumn = cols.createdAt ?? cols.subscribedAt;

      const rows = await safeQuery(
        `recentLeads:${lead.key}`,
        (db) => db.select().from(lead.table).orderBy(desc(sortColumn)).limit(limit),
        [],
      );

      return (rows as Record<string, unknown>[]).map((row) => ({
        type: lead.key,
        typeLabel: lead.label,
        id: Number(row.id),
        title: String(row[lead.titleColumn] ?? "—"),
        // Newsletter subscribers have no name; fall back to the address.
        name: String(row.name ?? row[lead.emailColumn] ?? "—"),
        email: String(row[lead.emailColumn] ?? ""),
        createdAt: toDate(row.createdAt ?? row.subscribedAt),
        isRead: lead.readable ? Boolean(row.isRead) : true,
      }));
    }),
  );

  return perType
    .flat()
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
    .slice(0, limit);
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}
