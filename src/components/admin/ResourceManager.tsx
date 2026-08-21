import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FieldInput, type Field } from "./fields";
import { useAdminRows, useDeleteRow, useSaveRow } from "@/lib/admin-db";

type Row = Record<string, unknown>;

export type ResourceConfig = {
  title: string;
  description?: string;
  table: string;
  fields: Field[];
  listColumns: { name: string; label: string }[];
  defaults?: Row;
  order?: string;
  ascending?: boolean;
  reorder?: boolean;
  slugFrom?: string;
  singularName?: string;
};

const slugify = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function ResourceManager(config: ResourceConfig) {
  const {
    title,
    description,
    table,
    fields,
    listColumns,
    defaults = {},
    order,
    ascending,
    reorder = true,
    slugFrom,
    singularName = "item",
  } = config;

  const { data: rows = [], isLoading } = useAdminRows(table, {
    ...(order ? { order } : {}),
    ...(ascending === undefined ? {} : { ascending }),
  });
  const save = useSaveRow(table);
  const del = useDeleteRow(table);

  const [editing, setEditing] = useState<Row | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const blank = useMemo<Row>(() => {
    const base: Row = { ...defaults };
    for (const f of fields) if (!(f.name in base)) base[f.name] = f.type === "switch" ? true : "";
    return base;
  }, [defaults, fields]);

  const set = (name: string, value: unknown) =>
    setEditing((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [name]: value };
      if (slugFrom && name === slugFrom && !prev["id"]) next["slug"] = slugify(String(value));
      return next;
    });

  const submit = () => {
    if (!editing) return;
    const payload: Row = { ...editing };
    for (const f of fields) {
      if (payload[f.name] === "") payload[f.name] = f.type === "number" ? 0 : null;
    }
    save.mutate(payload, { onSuccess: () => setEditing(null) });
  };

  const move = (row: Row, direction: -1 | 1) => {
    const index = rows.findIndex((r) => r["id"] === row["id"]);
    const swap = rows[index + direction];
    if (!swap) return;
    save.mutate({ id: row["id"], sort_order: swap["sort_order"] });
    save.mutate({ id: swap["id"], sort_order: row["sort_order"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={() => setEditing({ ...blank })}>
          <Plus className="size-4" /> New {singularName}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            Nothing here yet. Create your first {singularName}.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div
                key={String(row["id"])}
                className="flex flex-wrap items-center gap-3 p-4 hover:bg-muted/40"
              >
                {typeof row["image_url"] === "string" ||
                typeof row["featured_image"] === "string" ? (
                  <img
                    src={String(row["image_url"] ?? row["featured_image"] ?? "")}
                    alt=""
                    className="h-12 w-16 rounded-md border border-border object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  {listColumns.map((col, i) => (
                    <p
                      key={col.name}
                      className={
                        i === 0
                          ? "truncate font-semibold"
                          : "truncate text-xs text-muted-foreground"
                      }
                    >
                      {i > 0 && `${col.label}: `}
                      {String(row[col.name] ?? "—")}
                    </p>
                  ))}
                </div>
                {typeof row["status"] === "string" && (
                  <Badge variant={row["status"] === "published" ? "default" : "secondary"}>
                    {String(row["status"])}
                  </Badge>
                )}
                {typeof row["enabled"] === "boolean" && (
                  <Badge variant={row["enabled"] ? "default" : "secondary"}>
                    {row["enabled"] ? "on" : "off"}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  {reorder && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => move(row, -1)}
                        aria-label="Move up"
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => move(row, 1)}
                        aria-label="Move down"
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditing(row)}
                    aria-label="Edit"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfirmId(String(row["id"]))}
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.["id"] ? "Edit" : "New"} {singularName}
            </DialogTitle>
            <DialogDescription>
              Changes go live on the website as soon as you save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.full || f.type === "richtext" ? "sm:col-span-2" : ""}>
                <FieldInput field={f} value={editing?.[f.name]} onChange={(v) => set(f.name, v)} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={save.isPending}>
              {save.isPending && <Loader2 className="size-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmId !== null} onOpenChange={(open) => !open && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {singularName}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmId) del.mutate(confirmId);
                setConfirmId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
