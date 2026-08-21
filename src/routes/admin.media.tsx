import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Loader2, Upload, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdminRows, useDeleteRow, uploadMedia } from "@/lib/admin-db";

export const Route = createFileRoute("/admin/media")({ component: MediaLibrary });

function MediaLibrary() {
  const {
    data: items = [],
    isLoading,
    refetch,
  } = useAdminRows("media", {
    order: "created_at",
    ascending: false,
  });
  const del = useDeleteRow("media");
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            Upload images once and reuse them anywhere.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length === 0) return;
            setBusy(true);
            try {
              for (const file of files) await uploadMedia(file, "library");
              toast.success("Upload complete");
              await refetch();
            } catch (error) {
              toast.error((error as Error).message);
            } finally {
              setBusy(false);
              if (inputRef.current) inputRef.current.value = "";
            }
          }}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}{" "}
          Upload
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No files yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={String(item["id"])}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <img
                src={String(item["url"])}
                alt={String(item["alt_text"] ?? item["file_name"])}
                className="h-40 w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="min-w-0 truncate text-xs">{String(item["file_name"])}</p>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Copy URL"
                    onClick={() => {
                      void navigator.clipboard.writeText(String(item["url"]));
                      toast.success("URL copied");
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete"
                    onClick={() => del.mutate(String(item["id"]))}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
