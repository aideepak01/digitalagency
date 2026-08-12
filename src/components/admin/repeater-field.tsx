"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SubField } from "@/lib/admin/collections";

/**
 * Edits a jsonb array of objects (benefits, FAQs, outcomes, …) as repeating
 * rows, serialising the whole list into one hidden input so it arrives in the
 * server action as a single JSON string.
 *
 * `single` mode edits one optional object instead of a list — the portfolio
 * project testimonial.
 */
export function RepeaterField({
  name,
  subFields,
  initialValue,
  single = false,
}: {
  name: string;
  subFields: SubField[];
  initialValue: unknown;
  single?: boolean;
}) {
  const [rows, setRows] = React.useState<Record<string, string>[]>(() =>
    normalise(initialValue, subFields, single),
  );

  const serialised = single ? JSON.stringify(rows[0] ?? {}) : JSON.stringify(rows);

  function update(index: number, field: string, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function addRow() {
    setRows((current) => [...current, emptyRow(subFields)]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={serialised} />

      {rows.length === 0 && (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
          No entries yet.
        </p>
      )}

      {rows.map((row, index) => (
        <div key={index} className="rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-3">
            {subFields.map((subField) => (
              <div key={subField.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {subField.label}
                </label>
                {subField.type === "textarea" ? (
                  <Textarea
                    rows={3}
                    value={row[subField.name] ?? ""}
                    onChange={(event) => update(index, subField.name, event.target.value)}
                  />
                ) : (
                  <Input
                    value={row[subField.name] ?? ""}
                    onChange={(event) => update(index, subField.name, event.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {!single && (
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRow(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" /> Remove
              </Button>
            </div>
          )}
        </div>
      ))}

      {(!single || rows.length === 0) && (
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={addRow}>
          <Plus className="size-4" /> Add entry
        </Button>
      )}
    </div>
  );
}

function emptyRow(subFields: SubField[]): Record<string, string> {
  return Object.fromEntries(subFields.map((subField) => [subField.name, ""]));
}

function normalise(
  value: unknown,
  subFields: SubField[],
  single: boolean,
): Record<string, string>[] {
  const toRow = (entry: unknown): Record<string, string> => {
    const source = (entry ?? {}) as Record<string, unknown>;
    return Object.fromEntries(
      subFields.map((subField) => [subField.name, String(source[subField.name] ?? "")]),
    );
  };

  if (single) {
    return value ? [toRow(value)] : [];
  }
  return Array.isArray(value) ? value.map(toRow) : [];
}
