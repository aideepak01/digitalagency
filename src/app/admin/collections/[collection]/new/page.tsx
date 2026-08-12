import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { RecordForm } from "@/components/admin/record-form";
import { getCollection } from "@/lib/admin/collections";

export default async function NewRecordPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: collectionKey } = await params;
  const collection = getCollection(collectionKey);
  if (!collection) notFound();

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
          New {collection.singular.toLowerCase()}
        </h1>
      </div>

      <RecordForm
        collectionKey={collection.key}
        collectionLabel={collection.singular}
        recordId={null}
        fields={collection.fields}
        record={null}
      />
    </div>
  );
}
