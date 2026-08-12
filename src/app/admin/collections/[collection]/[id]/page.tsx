import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { RecordForm } from "@/components/admin/record-form";
import { getRecord } from "@/lib/admin/actions";
import { getCollection } from "@/lib/admin/collections";

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  const { collection: collectionKey, id } = await params;

  const collection = getCollection(collectionKey);
  if (!collection) notFound();

  const recordId = Number(id);
  if (!Number.isInteger(recordId)) notFound();

  const record = await getRecord(collectionKey, recordId);
  if (!record) notFound();

  const title = collection.listColumns[0]?.name;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/admin/collections/${collectionKey}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> {collection.label}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          {title ? String(record[title] ?? collection.singular) : collection.singular}
        </h1>
      </div>

      <RecordForm
        collectionKey={collection.key}
        collectionLabel={collection.singular}
        recordId={recordId}
        fields={collection.fields}
        record={record}
      />
    </div>
  );
}
