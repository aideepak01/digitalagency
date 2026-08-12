"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RepeaterField } from "@/components/admin/repeater-field";
import { saveRecord, type ActionState } from "@/lib/admin/actions";
import type { Field } from "@/lib/admin/collections";
import { gradientKeys, gradients } from "@/lib/gradients";
import { getIcon, iconNames } from "@/lib/icons";

/**
 * One form for every collection: the field list comes from the registry, so
 * adding a column to a model is a registry edit rather than a new screen.
 *
 * The `Collection` object itself cannot cross to the client (it holds a Drizzle
 * table), so the server page passes just the serialisable parts.
 */
export function RecordForm({
  collectionKey,
  collectionLabel,
  recordId,
  fields,
  record,
}: {
  collectionKey: string;
  collectionLabel: string;
  recordId: number | null;
  fields: Field[];
  record: Record<string, unknown> | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveRecord.bind(null, collectionKey, recordId),
    { ok: false, message: "" },
  );

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <Label htmlFor={`field-${field.name}`}>
            {field.label}
            {field.required && <span className="ml-1 text-destructive">*</span>}
          </Label>

          <FieldInput field={field} value={record?.[field.name]} />

          {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          {state.fieldErrors?.[field.name] && (
            <p className="text-xs text-destructive">{state.fieldErrors[field.name]}</p>
          )}
        </div>
      ))}

      {state.message && !state.ok && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-brand text-white hover:opacity-90"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="size-4" /> Save {collectionLabel.toLowerCase()}
            </>
          )}
        </Button>
        <Button asChild variant="ghost">
          <Link href={`/admin/collections/${collectionKey}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

function FieldInput({ field, value }: { field: Field; value: unknown }) {
  const id = `field-${field.name}`;

  switch (field.type) {
    case "textarea":
      return <Textarea id={id} name={field.name} rows={5} defaultValue={String(value ?? "")} />;

    case "paragraphs":
      return (
        <Textarea
          id={id}
          name={field.name}
          rows={16}
          defaultValue={Array.isArray(value) ? value.join("\n\n") : ""}
          className="font-mono text-xs"
        />
      );

    case "tags":
      return (
        <Textarea
          id={id}
          name={field.name}
          rows={5}
          defaultValue={Array.isArray(value) ? value.join("\n") : ""}
          className="font-mono text-xs"
        />
      );

    case "number":
      return <Input id={id} name={field.name} type="number" defaultValue={Number(value ?? 0)} />;

    case "boolean":
      return (
        <label className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
          <input
            id={id}
            name={field.name}
            type="checkbox"
            defaultChecked={Boolean(value)}
            className="size-4 rounded border-input"
          />
          Enabled
        </label>
      );

    case "select":
      return (
        <select
          id={id}
          name={field.name}
          defaultValue={String(value ?? "")}
          className="h-10 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option === "" ? "— none —" : option}
            </option>
          ))}
        </select>
      );

    case "icon": {
      const current = String(value ?? "");
      const Preview = getIcon(current);
      return (
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-brand/10 text-primary">
            <Preview className="size-5" />
          </span>
          <select
            id={id}
            name={field.name}
            defaultValue={current}
            className="h-10 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {iconNames.map((iconName) => (
              <option key={iconName} value={iconName}>
                {iconName}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case "gradient": {
      const current = String(value ?? gradientKeys[0]);
      return (
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={`size-10 shrink-0 rounded-lg bg-gradient-to-br ${
              gradients[current as keyof typeof gradients] ?? gradients[gradientKeys[0]]
            }`}
          />
          <select
            id={id}
            name={field.name}
            defaultValue={current}
            className="h-10 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {gradientKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case "repeater":
      return (
        <RepeaterField
          name={field.name}
          subFields={field.subFields ?? []}
          initialValue={value}
          single={field.single}
        />
      );

    default:
      return <Input id={id} name={field.name} defaultValue={String(value ?? "")} />;
  }
}
