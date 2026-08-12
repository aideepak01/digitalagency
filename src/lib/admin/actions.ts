"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, eq, ne, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { requireSession } from "@/lib/auth";
import { query } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { isGradientKey } from "@/lib/gradients";
import { isIconName } from "@/lib/icons";

import { getCollection, type Collection, type Field } from "./collections";

/**
 * Generic create/update/delete for every collection in the registry.
 *
 * Each action re-checks the session: middleware protects the /admin *routes*,
 * but a server action is independently addressable and must not assume the
 * caller arrived through a protected page.
 */

export interface ActionState {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

type Row = Record<string, unknown>;

function columns(collection: Collection): Record<string, PgColumn> {
  return collection.table as unknown as Record<string, PgColumn>;
}

/** Turns submitted strings back into the shapes their columns expect. */
function coerce(field: Field, form: FormData): { value: unknown; error?: string } {
  const raw = form.get(field.name);
  const text = typeof raw === "string" ? raw.trim() : "";

  switch (field.type) {
    case "boolean":
      // An unchecked checkbox submits nothing at all.
      return { value: raw === "on" || raw === "true" };

    case "number": {
      if (text === "") return { value: 0 };
      const parsed = Number(text);
      if (Number.isNaN(parsed)) return { value: 0, error: "Must be a number." };
      return { value: parsed };
    }

    case "tags":
      return { value: text ? text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) : [] };

    case "paragraphs":
      // A blank line separates paragraphs, matching how the body renders.
      return {
        value: text ? text.split(/\r?\n\s*\r?\n/).map((block) => block.trim()).filter(Boolean) : [],
      };

    case "icon":
      if (!isIconName(text)) return { value: text, error: "Unknown icon." };
      return { value: text };

    case "gradient":
      if (!isGradientKey(text)) return { value: text, error: "Unknown gradient." };
      return { value: text };

    case "repeater": {
      // The client repeater serialises its rows into one hidden JSON input.
      if (!text) return { value: field.single ? null : [] };
      try {
        const parsed = JSON.parse(text);
        if (field.single) {
          const values = Object.values(parsed ?? {}).filter(
            (entry) => typeof entry === "string" && entry.trim() !== "",
          );
          return { value: values.length > 0 ? parsed : null };
        }
        if (!Array.isArray(parsed)) return { value: [], error: "Expected a list." };
        return { value: parsed };
      } catch {
        return { value: field.single ? null : [], error: "Could not read this field." };
      }
    }

    case "select":
      if (field.name === "megaMenu" && text === "") return { value: null };
      return { value: text };

    default:
      return { value: text };
  }
}

function buildValues(
  collection: Collection,
  form: FormData,
): { values: Row; fieldErrors: Record<string, string> } {
  const values: Row = {};
  const fieldErrors: Record<string, string> = {};

  for (const field of collection.fields) {
    const { value, error } = coerce(field, form);
    if (error) fieldErrors[field.name] = error;
    if (field.required && (value === "" || value === null || value === undefined)) {
      fieldErrors[field.name] = `${field.label} is required.`;
    }
    values[field.name] = value;
  }

  return { values, fieldErrors };
}

/** Slugs are the site's URLs — a duplicate would silently shadow a live page. */
async function slugConflicts(
  collection: Collection,
  slug: string,
  excludeId?: number,
): Promise<boolean> {
  if (!collection.slugField) return false;
  const cols = columns(collection);
  const slugColumn = cols[collection.slugField];
  const idColumn = cols.id;

  const rows = await query((db) =>
    db
      .select({ id: idColumn })
      .from(collection.table)
      .where(
        excludeId
          ? and(eq(slugColumn, slug), ne(idColumn, excludeId))
          : eq(slugColumn, slug),
      )
      .limit(1),
  );

  return rows.length > 0;
}

function revalidateFor(collection: Collection, slug?: string) {
  for (const path of collection.revalidate) {
    revalidatePath(path);
  }
  if (collection.slugField && slug) {
    // The detail page for the record that just changed.
    revalidatePath(`${collection.revalidate.at(-1)}/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}

export async function saveRecord(
  collectionKey: string,
  recordId: number | null,
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireSession();

  const collection = getCollection(collectionKey);
  if (!collection) return { ok: false, message: "Unknown collection." };

  const { values, fieldErrors } = buildValues(collection, form);

  if (collection.slugField) {
    const slug = String(values[collection.slugField] ?? "");
    if (slug && (await slugConflicts(collection, slug, recordId ?? undefined))) {
      fieldErrors[collection.slugField] = "That slug is already in use.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Please correct the highlighted fields.", fieldErrors };
  }

  try {
    if (recordId === null) {
      await query((db) => db.insert(collection.table).values(values as never));
    } else {
      await query((db) =>
        db
          .update(collection.table)
          .set({ ...values, updatedAt: sql`now()` } as never)
          .where(eq(columns(collection).id, recordId)),
      );
    }
  } catch (error) {
    console.error(`[admin] save failed (${collectionKey}):`, error);
    return { ok: false, message: "Could not save. Please try again." };
  }

  revalidateFor(collection, collection.slugField ? String(values[collection.slugField]) : undefined);
  revalidatePath(`/admin/collections/${collectionKey}`);
  redirect(`/admin/collections/${collectionKey}?saved=1`);
}

export async function deleteRecord(collectionKey: string, recordId: number): Promise<void> {
  await requireSession();

  const collection = getCollection(collectionKey);
  if (!collection) return;

  try {
    await query((db) =>
      db.delete(collection.table).where(eq(columns(collection).id, recordId)),
    );
  } catch (error) {
    console.error(`[admin] delete failed (${collectionKey}):`, error);
    return;
  }

  revalidateFor(collection);
  revalidatePath(`/admin/collections/${collectionKey}`);
}

export async function togglePublished(
  collectionKey: string,
  recordId: number,
  next: boolean,
): Promise<void> {
  await requireSession();

  const collection = getCollection(collectionKey);
  if (!collection) return;

  try {
    await query((db) =>
      db
        .update(collection.table)
        .set({ isPublished: next, updatedAt: sql`now()` } as never)
        .where(eq(columns(collection).id, recordId)),
    );
  } catch (error) {
    console.error(`[admin] publish toggle failed (${collectionKey}):`, error);
    return;
  }

  revalidateFor(collection);
  revalidatePath(`/admin/collections/${collectionKey}`);
}

/* ------------------------------------------------------------- site settings */

export async function saveSiteSettings(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireSession();

  const str = (key: string) => String(form.get(key) ?? "").trim();

  const social: Record<string, string> = {};
  for (const key of ["twitter", "linkedin", "github", "instagram", "dribbble"]) {
    const value = str(`social.${key}`);
    if (value) social[key] = value;
  }

  let stats: { label: string; value: string; suffix: string }[] = [];
  try {
    const parsed = JSON.parse(str("stats") || "[]");
    if (Array.isArray(parsed)) stats = parsed;
  } catch {
    return { ok: false, message: "Could not read the stats field." };
  }

  const url = str("url");
  try {
    // metadataBase and every canonical tag are built from this — an invalid
    // value would break metadata across the whole site.
    new URL(url);
  } catch {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: { url: "Must be a full URL, e.g. https://sbabuai.com" },
    };
  }

  try {
    await query((db) =>
      db
        .update(siteSettings)
        .set({
          name: str("name"),
          legalName: str("legalName"),
          tagline: str("tagline"),
          description: str("description"),
          url,
          ogImage: str("ogImage"),
          email: str("email"),
          salesEmail: str("salesEmail"),
          phone: str("phone"),
          whatsapp: str("whatsapp"),
          founded: str("founded"),
          address: {
            street: str("address.street"),
            city: str("address.city"),
            state: str("address.state"),
            zip: str("address.zip"),
            country: str("address.country"),
            full: str("address.full"),
          },
          social,
          stats,
          updatedAt: sql`now()`,
        })
        .where(eq(siteSettings.id, 1)),
    );
  } catch (error) {
    console.error("[admin] site settings save failed:", error);
    return { ok: false, message: "Could not save. Please try again." };
  }

  // Site settings feed the header, footer, and metadata on every page.
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  return { ok: true, message: "Settings saved." };
}

/* --------------------------------------------------------------- read helpers */

export async function listRecords(collectionKey: string): Promise<Row[]> {
  const collection = getCollection(collectionKey);
  if (!collection) return [];

  const cols = columns(collection);
  return query((db) =>
    db
      .select()
      .from(collection.table)
      .orderBy(cols.sortOrder ? asc(cols.sortOrder) : asc(cols.id)),
  ) as Promise<Row[]>;
}

export async function getRecord(collectionKey: string, recordId: number): Promise<Row | null> {
  const collection = getCollection(collectionKey);
  if (!collection) return null;

  const rows = (await query((db) =>
    db.select().from(collection.table).where(eq(columns(collection).id, recordId)).limit(1),
  )) as Row[];

  return rows[0] ?? null;
}
