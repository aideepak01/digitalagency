"use server";

import { revalidatePath } from "next/cache";
import { count, desc, eq } from "drizzle-orm";

import { requireSession } from "@/lib/auth";
import { query, safeQuery } from "@/lib/db/client";

import { getLeadType, leadColumns, leadTypes } from "./leads";

type Row = Record<string, unknown>;

export async function listLeads(
  typeKey: string,
  options: { unreadOnly?: boolean; limit?: number } = {},
): Promise<Row[]> {
  await requireSession();

  const lead = getLeadType(typeKey);
  if (!lead) return [];

  const cols = leadColumns(lead);
  const rows = await query((db) => {
    const base = db.select().from(lead.table);
    const filtered =
      options.unreadOnly && lead.readable ? base.where(eq(cols.isRead, false)) : base;
    return filtered.orderBy(desc(cols.createdAt)).limit(options.limit ?? 200);
  });

  return rows as Row[];
}

export async function markLeadRead(
  typeKey: string,
  recordId: number,
  next: boolean,
): Promise<void> {
  await requireSession();

  const lead = getLeadType(typeKey);
  if (!lead || !lead.readable) return;

  try {
    await query((db) =>
      db
        .update(lead.table)
        .set({ isRead: next } as never)
        .where(eq(leadColumns(lead).id, recordId)),
    );
  } catch (error) {
    console.error(`[admin] mark read failed (${typeKey}):`, error);
    return;
  }

  revalidatePath(`/admin/leads/${typeKey}`);
  revalidatePath("/admin");
}

/** Unread counts for the dashboard; degrades to zeroes if the DB is down. */
export async function leadCounts(): Promise<
  { key: string; label: string; total: number; unread: number }[]
> {
  await requireSession();

  return Promise.all(
    leadTypes.map(async (lead) => {
      const cols = leadColumns(lead);

      const total = await safeQuery(
        `leadCount:${lead.key}`,
        async (db) => {
          const [row] = await db.select({ value: count() }).from(lead.table);
          return row?.value ?? 0;
        },
        0,
      );

      const unread = lead.readable
        ? await safeQuery(
            `leadUnread:${lead.key}`,
            async (db) => {
              const [row] = await db
                .select({ value: count() })
                .from(lead.table)
                .where(eq(cols.isRead, false));
              return row?.value ?? 0;
            },
            0,
          )
        : 0;

      return { key: lead.key, label: lead.label, total, unread };
    }),
  );
}
