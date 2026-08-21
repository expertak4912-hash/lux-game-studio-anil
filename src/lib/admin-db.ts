/**
 * React Query hooks for the admin panel.
 *
 * The exported signatures are unchanged from the Supabase version, so `ResourceManager`,
 * `SettingsForm`, `fields.tsx` and all 22 admin routes work without edits. What changed is what
 * sits underneath: these used to run Supabase queries in the browser, and now call server
 * functions that enforce `requireAdmin`. No database credentials reach the client.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminDelete,
  adminGetSettings,
  adminList,
  adminSave,
  adminSaveSettings,
} from "./admin.functions";

type Row = Record<string, unknown>;

export function useAdminRows(table: string, opts: { order?: string; ascending?: boolean } = {}) {
  return useQuery({
    queryKey: ["admin", table, opts],
    queryFn: () =>
      adminList({
        data: {
          table,
          ...(opts.order ? { order: opts.order } : {}),
          ...(opts.ascending === undefined ? {} : { ascending: opts.ascending }),
        },
      }) as Promise<Row[]>,
  });
}

export function useAdminSettings(table: string) {
  return useQuery({
    queryKey: ["admin", table, "settings"],
    queryFn: () => adminGetSettings({ data: { table } }) as Promise<Row | null>,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, table: string) {
  void qc.invalidateQueries({ queryKey: ["admin", table] });
  // Public site queries share a "cms" prefix; drop them so edits appear immediately.
  void qc.invalidateQueries({ queryKey: ["cms"] });
}

export function useSaveRow(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row) => {
      await adminSave({ data: { table, values } });
    },
    onSuccess: () => {
      toast.success("Saved");
      invalidate(qc, table);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteRow(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminDelete({ data: { table, id } });
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate(qc, table);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSaveSettings(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row) => {
      await adminSaveSettings({ data: { table, values } });
    },
    onSuccess: () => {
      toast.success("Settings saved");
      invalidate(qc, table);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

/**
 * Uploads a file to GridFS and records it in the media library.
 *
 * Signature is unchanged, so the `ImageField` uploader in `components/admin/fields.tsx` needs no
 * edits. It posts to `/api/media/upload` (handled in `src/server.ts`) rather than Supabase
 * Storage, because server functions serialize JSON and cannot carry a file body.
 *
 * The returned URL is app-relative (`/api/media/<id>`), so it never expires the way the old
 * signed Supabase URLs did, and it survives moving the app to another host.
 */
export async function uploadMedia(file: File, category = "other"): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("category", category);

  const response = await fetch("/api/media/upload", {
    method: "POST",
    body,
    // Send the session cookie; without it the endpoint returns 401.
    credentials: "same-origin",
  });

  const payload = (await response.json().catch(() => null)) as {
    url?: string;
    error?: string;
  } | null;

  if (!response.ok || !payload?.url) {
    throw new Error(payload?.error ?? `Upload failed (${response.status})`);
  }

  return payload.url;
}
