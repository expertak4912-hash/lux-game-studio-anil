import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldInput, type Field } from "./fields";
import { useAdminSettings, useSaveSettings } from "@/lib/admin-db";

type Row = Record<string, unknown>;

export function SettingsForm({
  title,
  description,
  table,
  fields,
}: {
  title: string;
  description?: string;
  table: string;
  fields: Field[];
}) {
  const { data, isLoading } = useAdminSettings(table);
  const save = useSaveSettings(table);
  const [values, setValues] = useState<Row>({});

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.full || f.type === "richtext" ? "sm:col-span-2" : ""}>
            <FieldInput
              field={f}
              value={values[f.name]}
              onChange={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
            />
          </div>
        ))}
      </div>

      <Button
        onClick={() => {
          const payload: Row = { ...values };
          for (const f of fields) {
            if (f.type === "json" && typeof payload[f.name] === "string") {
              try {
                payload[f.name] = JSON.parse(String(payload[f.name] || "[]"));
              } catch {
                payload[f.name] = [];
              }
            }
          }
          save.mutate(payload);
        }}
        disabled={save.isPending}
      >
        {save.isPending && <Loader2 className="size-4 animate-spin" />} Save changes
      </Button>
    </div>
  );
}
