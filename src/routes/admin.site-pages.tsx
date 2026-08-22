import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Loader2, Pencil, RotateCcw } from "lucide-react";
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
import { FieldInput, type Field } from "@/components/admin/fields";
import { fieldNames } from "@/components/admin/field-keys";
import { useAdminRows, useDeleteRow, useSaveRow } from "@/lib/admin-db";
import { FEATURE_ICON_NAMES } from "@/components/site/SitePageBlocks";
import { SITE_PAGES, type SitePageDef, type SitePageLayout } from "@/lib/site-pages";

export const Route = createFileRoute("/admin/site-pages")({ component: SitePagesAdmin });

type Row = Record<string, unknown>;

/** What the `items` JSON holds, per page layout. Shown as the field label and helper text. */
const ITEMS_FIELD: Record<SitePageLayout, { label: string; help: string }> = {
  legal: {
    label: "Sections (JSON)",
    help: '[{"heading":"Section title","paragraphs":["First paragraph.","Second paragraph."],"bullets":["Optional bullet"]}]',
  },
  steps: {
    label: "Steps (JSON)",
    help: '[{"title":"Create an Account","body":"What the visitor does."}] — steps are numbered automatically in the order listed.',
  },
  features: {
    label: "Feature cards (JSON)",
    help: `[{"icon":"gauge","title":"Fast Experience","body":"Short description."}] — icon options: ${FEATURE_ICON_NAMES.join(", ")}.`,
  },
  checklist: {
    label: "Checklist points (JSON)",
    help: '["First point","Second point"] — one line per tick.',
  },
};

function fieldsFor(def: SitePageDef): Field[] {
  const items = ITEMS_FIELD[def.layout];
  return [
    { name: "title", label: "Page heading", full: true },
    { name: "eyebrow", label: "Small label above the heading" },
    { name: "short_description", label: "Intro text", type: "textarea", full: true },
    {
      name: "background_image",
      label: "Hero background",
      type: "image",
      desktopSize: "1920 x 1080",
      mobileSize: "800 x 1200",
    },
    ...(def.layout === "checklist"
      ? [
          {
            name: "featured_image",
            label: "Section image",
            type: "image" as const,
            desktopSize: "1200 x 1200",
            mobileSize: "800 x 800",
          },
        ]
      : []),
    { name: "content", label: "Body content", type: "richtext" },
    { name: "items", label: items.label, type: "json", full: true, help: items.help },
    { name: "seo_title", label: "SEO title" },
    { name: "seo_description", label: "Meta description", type: "textarea" },
    {
      name: "seo_image",
      label: "Social image",
      type: "image",
      desktopSize: "1200 x 630",
      mobile: false,
    },
  ];
}

/**
 * Editor for the fixed pages defined in `src/lib/site-pages.ts`.
 *
 * These differ from Admin → Pages in one way that matters: the row may not exist yet. Until an
 * admin saves one, the site renders the built-in copy, and this screen opens the editor
 * pre-filled with that same copy — so editing starts from real text, not an empty form.
 */
function SitePagesAdmin() {
  const { data: rows = [], isLoading } = useAdminRows("pages");
  const save = useSaveRow("pages");
  const del = useDeleteRow("pages");

  const [editing, setEditing] = useState<{ def: SitePageDef; values: Row } | null>(null);
  const [resetting, setResetting] = useState<{ def: SitePageDef; id: string } | null>(null);

  const rowFor = (slug: string) => rows.find((r) => r["slug"] === slug) ?? null;

  const openEditor = (def: SitePageDef) => {
    const row = rowFor(def.slug);
    const base: Row = {
      title: def.defaults.title,
      eyebrow: def.defaults.eyebrow,
      short_description: def.defaults.short_description,
      content: def.defaults.content,
      items: def.defaults.items,
      background_image: "",
      featured_image: "",
      seo_title: "",
      seo_description: "",
      seo_image: "",
    };
    for (const name of fieldNames(fieldsFor(def))) if (!(name in base)) base[name] = "";
    // An existing row wins field by field; a key it never set keeps the built-in default.
    setEditing({ def, values: row ? { ...base, ...stripNulls(row) } : base });
  };

  const submit = () => {
    if (!editing) return;
    const { def, values } = editing;
    const payload: Row = { ...values, slug: def.slug, status: "published", sort_order: 0 };

    // `items` comes back from the JSON textarea as a string. A parse failure must not wipe the
    // page, so the previous value is kept and the admin sees the error.
    if (typeof payload["items"] === "string") {
      try {
        payload["items"] = JSON.parse(String(payload["items"] || "[]"));
      } catch {
        window.alert("The JSON in the items field is not valid. Fix it before saving.");
        return;
      }
    }

    for (const name of fieldNames(fieldsFor(def))) {
      if (payload[name] === "") payload[name] = null;
    }

    save.mutate(payload, { onSuccess: () => setEditing(null) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Pages</h1>
        <p className="text-sm text-muted-foreground">
          The pages that ship with the site. Each one has its own URL, and the homepage sections
          that preview them link straight here.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="divide-y divide-border">
            {SITE_PAGES.map((def) => {
              const row = rowFor(def.slug);
              return (
                <div
                  key={def.slug}
                  className="flex flex-wrap items-center gap-3 p-4 hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {row ? String(row["title"] ?? def.navLabel) : def.navLabel}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {def.path} — {def.adminHint}
                    </p>
                  </div>
                  <Badge variant={row ? "default" : "secondary"}>
                    {row ? "Customised" : "Built-in copy"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button asChild size="icon" variant="ghost" aria-label="View page">
                      <a href={def.path} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                    {row && (
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Reset to built-in copy"
                        onClick={() => setResetting({ def, id: String(row["id"]) })}
                      >
                        <RotateCcw className="size-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEditor(def)}>
                      <Pencil className="size-4" /> Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editing?.def.navLabel}</DialogTitle>
            <DialogDescription>
              Saving publishes this page at {editing?.def.path}. Leave a field on its built-in text
              to keep it as it is.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {editing &&
              fieldsFor(editing.def).map((f) => (
                <div
                  key={f.name}
                  className={
                    f.full || f.type === "richtext" || f.type === "image" ? "sm:col-span-2" : ""
                  }
                >
                  <FieldInput
                    field={f}
                    value={editing.values[f.name]}
                    onChange={(v) =>
                      setEditing((prev) =>
                        prev ? { ...prev, values: { ...prev.values, [f.name]: v } } : prev,
                      )
                    }
                    row={editing.values}
                    setField={(name, v) =>
                      setEditing((prev) =>
                        prev ? { ...prev, values: { ...prev.values, [name]: v } } : prev,
                      )
                    }
                  />
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

      <AlertDialog open={resetting !== null} onOpenChange={(open) => !open && setResetting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset {resetting?.def.navLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              Your edits are deleted and {resetting?.def.path} goes back to the copy that ships with
              the site. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (resetting) del.mutate(resetting.id);
                setResetting(null);
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** Drops null/undefined so a cleared database field falls back to the built-in default. */
function stripNulls(row: Row): Row {
  const out: Row = {};
  for (const [key, value] of Object.entries(row)) {
    if (value !== null && value !== undefined) out[key] = value;
  }
  return out;
}
