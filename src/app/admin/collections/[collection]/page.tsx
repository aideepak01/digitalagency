import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteRecord, listRecords, togglePublished } from "@/lib/admin/actions";
import { getCollection } from "@/lib/admin/collections";

export default async function CollectionListPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { collection: collectionKey } = await params;
  const { saved } = await searchParams;

  const collection = getCollection(collectionKey);
  if (!collection) notFound();

  const records = await listRecords(collectionKey);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{collection.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {records.length} {records.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <Button asChild className="rounded-full bg-gradient-brand text-white hover:opacity-90">
          <Link href={`/admin/collections/${collectionKey}/new`}>
            <Plus className="size-4" /> New {collection.singular.toLowerCase()}
          </Link>
        </Button>
      </div>

      {saved && (
        <p className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          Saved. The public site has been revalidated.
        </p>
      )}

      {records.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {collection.listColumns.map((column) => (
                  <th key={column.name} className="px-4 py-3 font-medium">
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const id = Number(record.id);
                const isPublished = record.isPublished !== false;

                return (
                  <tr key={id} className="border-t border-border">
                    {collection.listColumns.map((column) => (
                      <td key={column.name} className="max-w-xs truncate px-4 py-3 text-foreground">
                        {String(record[column.name] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <form
                        action={async () => {
                          "use server";
                          await togglePublished(collectionKey, id, !isPublished);
                        }}
                      >
                        <button
                          type="submit"
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            isPublished
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/collections/${collectionKey}/${id}`}>
                            <Pencil className="size-4" /> Edit
                          </Link>
                        </Button>
                        <form
                          action={async () => {
                            "use server";
                            await deleteRecord(collectionKey, id);
                          }}
                        >
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
