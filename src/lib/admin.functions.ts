/**
 * Admin CRUD server functions.
 *
 * SECURITY NOTE — this is the most important change in the migration. Previously
 * `src/lib/admin-db.ts` issued Supabase queries **directly from the browser**; the only thing
 * stopping an anonymous visitor from writing to any table was the `"admins manage {table}"` RLS
 * policy evaluated inside Postgres. With MongoDB there is no such layer, so every write now runs
 * server-side behind `requireAdmin`, and the browser can no longer reach the database at all.
 *
 * The `table` argument arrives from the client, so it is checked against the registry allowlist
 * on every call (`requireAdminWritable`) — it is never interpolated into a query directly.
 *
 * This module ships to the client bundle — all server-only imports are dynamic and inside handlers.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-middleware";
import type { Json } from "@/shared/types";

/**
 * Rows crossing the RPC boundary are JSON, not arbitrary objects: the repository serializes
 * ObjectIds to strings and Dates to ISO strings before returning. Typing the values as `Json`
 * (rather than `unknown`) is what lets TanStack Start verify the payload is serializable.
 */
type Row = Record<string, Json>;

const tableInput = z.object({
  table: z.string().min(1).max(64),
  order: z.string().max(40).optional(),
  ascending: z.boolean().optional(),
});

const saveInput = z.object({
  table: z.string().min(1).max(64),
  values: z.record(z.string(), z.unknown()),
});

const deleteInput = z.object({
  table: z.string().min(1).max(64),
  id: z.string().min(1).max(64),
});

/** Lists every row in a table, including drafts. Admin-only. */
export const adminList = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data: unknown) => tableInput.parse(data))
  .handler(async ({ data }): Promise<Row[]> => {
    const { requireAdminWritable } = await import("@/server/db/collections");
    const { listRows } = await import("@/server/db/repository");

    const spec = requireAdminWritable(data.table);
    if (spec.singletonKey) throw new Error(`${spec.name} is a settings document, not a list.`);

    const rows = await listRows(
      spec.name,
      {
        ...(data.order ? { order: data.order } : {}),
        ...(data.ascending === undefined ? {} : { ascending: data.ascending }),
      },
      spec.defaultSort,
    );

    return rows as Row[];
  });

/** Reads one of the four singleton settings documents. Admin-only. */
export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data: unknown) => z.object({ table: z.string().min(1).max(64) }).parse(data))
  .handler(async ({ data }): Promise<Row | null> => {
    const { requireAdminWritable } = await import("@/server/db/collections");
    const { findSingleton } = await import("@/server/db/repository");

    const spec = requireAdminWritable(data.table);
    if (!spec.singletonKey) throw new Error(`${spec.name} is not a settings document.`);

    return (await findSingleton(spec.name, spec.singletonKey)) as Row | null;
  });

/** Inserts when `values.id` is absent, updates when present. Admin-only. */
export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => saveInput.parse(data))
  .handler(async ({ data }): Promise<Row | null> => {
    const { requireAdminWritable } = await import("@/server/db/collections");
    const { saveRow } = await import("@/server/db/repository");

    const spec = requireAdminWritable(data.table);
    if (spec.singletonKey) throw new Error(`Use adminSaveSettings for ${spec.name}.`);

    return (await saveRow(spec.name, data.values)) as Row | null;
  });

/** Upserts one of the four singleton settings documents. Admin-only. */
export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => saveInput.parse(data))
  .handler(async ({ data }): Promise<Row | null> => {
    const { requireAdminWritable } = await import("@/server/db/collections");
    const { saveSingleton } = await import("@/server/db/repository");

    const spec = requireAdminWritable(data.table);
    if (!spec.singletonKey) throw new Error(`${spec.name} is not a settings document.`);

    return (await saveSingleton(spec.name, spec.singletonKey, data.values)) as Row | null;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => deleteInput.parse(data))
  .handler(async ({ data }) => {
    const { requireAdminWritable } = await import("@/server/db/collections");
    const { deleteRow, findRowById } = await import("@/server/db/repository");

    const spec = requireAdminWritable(data.table);
    if (spec.singletonKey) throw new Error(`${spec.name} cannot be deleted.`);

    // Deleting a media item should also drop the stored file, or GridFS accumulates orphans.
    if (spec.name === "media") {
      const row = await findRowById("media", data.id);
      const gridfsId = row?.["gridfs_id"];
      if (typeof gridfsId === "string" && gridfsId) {
        const { deleteFile } = await import("@/server/media/gridfs");
        await deleteFile(gridfsId).catch((error: unknown) => {
          // A missing file should not block removing the metadata row.
          console.error("[media] could not delete GridFS file", error);
        });
      }
    }

    await deleteRow(spec.name, data.id);
    return { ok: true as const };
  });

/** Counts for the admin dashboard. One round trip instead of one query per collection. */
export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<Record<string, number>> => {
    const { collectionFor } = await import("@/server/db/collections");

    const tables = [
      "pages",
      "games",
      "sports",
      "blog_posts",
      "promotions",
      "faq_items",
      "media",
      "contact_messages",
    ] as const;

    const entries = await Promise.all(
      tables.map(async (table) => {
        const collection = await collectionFor(table);
        return [table, await collection.estimatedDocumentCount()] as const;
      }),
    );

    const unread = await (
      await collectionFor("contact_messages")
    ).countDocuments({
      is_read: false,
    });

    return { ...Object.fromEntries(entries), unread_messages: unread };
  });
