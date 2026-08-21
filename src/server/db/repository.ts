/**
 * Generic CRUD against the collection registry.
 *
 * This is the single place that talks to MongoDB for content. Both the public read path
 * (`src/lib/cms.functions.ts`) and the admin write path (`src/lib/admin.functions.ts`) go through
 * here, and both must have already checked authorization via `collections.ts` before calling in.
 *
 * SERVER ONLY.
 */
import type { Document, Filter, Sort } from "mongodb";
import { collectionFor, type TableName } from "./collections";
import { sanitizeWrite, serializeDoc, serializeDocs, toId, type Row } from "./serialize";

export type ListOptions = {
  filters?: Record<string, string | number | boolean>;
  publishedOnly?: boolean;
  order?: string;
  ascending?: boolean;
  limit?: number;
};

/** Fields that may be used as a sort key. Prevents sorting by an arbitrary attacker-chosen path. */
const SORTABLE = new Set([
  "sort_order",
  "created_at",
  "updated_at",
  "publish_date",
  "label",
  "name",
  "title",
  "path",
  "views",
]);

/** Fields that may be used as an equality filter from untrusted input. */
const FILTERABLE = new Set([
  "slug",
  "status",
  "category",
  "category_id",
  "path",
  "page_id",
  "enabled",
]);

function buildFilter(opts: ListOptions): Filter<Document> {
  const filter: Filter<Document> = {};

  if (opts.publishedOnly) filter["status"] = "published";

  for (const [field, value] of Object.entries(opts.filters ?? {})) {
    if (!FILTERABLE.has(field)) throw new Error(`Cannot filter on field: ${field}`);
    filter[field] = value;
  }

  return filter;
}

function buildSort(opts: ListOptions, fallback?: { field: string; ascending: boolean }): Sort {
  const field = opts.order ?? fallback?.field ?? "sort_order";
  if (!SORTABLE.has(field)) throw new Error(`Cannot sort on field: ${field}`);
  const ascending = opts.order
    ? opts.ascending !== false
    : (fallback?.ascending ?? opts.ascending !== false);
  return { [field]: ascending ? 1 : -1 };
}

/** Reads the single document behind one of the former singleton settings tables. */
export async function findSingleton(
  table: TableName,
  key: "site" | "theme" | "support" | "footer",
): Promise<Row | null> {
  const collection = await collectionFor(table);
  const doc = await collection.findOne({ _id: key as never });
  return serializeDoc(doc as Row | null);
}

/** Upserts the single document behind one of the former singleton settings tables. */
export async function saveSingleton(
  table: TableName,
  key: "site" | "theme" | "support" | "footer",
  values: Row,
): Promise<Row | null> {
  const collection = await collectionFor(table);
  const update = { ...sanitizeWrite(values), updated_at: new Date() };
  await collection.updateOne({ _id: key as never }, { $set: update }, { upsert: true });
  return findSingleton(table, key);
}

export async function listRows(
  table: TableName,
  opts: ListOptions = {},
  fallbackSort?: { field: string; ascending: boolean },
): Promise<Row[]> {
  const collection = await collectionFor(table);
  let cursor = collection.find(buildFilter(opts)).sort(buildSort(opts, fallbackSort));

  // Cap every list read. Without this a single request could pull an unbounded collection.
  const limit = Math.min(opts.limit ?? 500, 500);
  cursor = cursor.limit(limit);

  return serializeDocs((await cursor.toArray()) as Row[]);
}

export async function findRow(table: TableName, opts: ListOptions = {}): Promise<Row | null> {
  const collection = await collectionFor(table);
  const doc = await collection.findOne(buildFilter(opts));
  return serializeDoc(doc as Row | null);
}

export async function findRowById(table: TableName, id: string): Promise<Row | null> {
  const collection = await collectionFor(table);
  const doc = await collection.findOne({ _id: toId(id) as never });
  return serializeDoc(doc as Row | null);
}

/** Inserts when `values.id` is absent, updates when present. Mirrors the old upsert behaviour. */
export async function saveRow(table: TableName, values: Row): Promise<Row | null> {
  const collection = await collectionFor(table);
  const id = values["id"];
  const update = sanitizeWrite(values);
  const now = new Date();

  if (id) {
    await collection.updateOne(
      { _id: toId(id) as never },
      { $set: { ...update, updated_at: now } },
    );
    return findRowById(table, String(id));
  }

  const result = await collection.insertOne({
    ...update,
    created_at: now,
    updated_at: now,
  } as never);

  return findRowById(table, result.insertedId.toString());
}

export async function deleteRow(table: TableName, id: string): Promise<void> {
  const collection = await collectionFor(table);
  await collection.deleteOne({ _id: toId(id) as never });
}

/** Increments a counter without rewriting the document. Used for blog post view counts. */
export async function incrementField(
  table: TableName,
  id: string,
  field: string,
  by = 1,
): Promise<void> {
  const collection = await collectionFor(table);
  await collection.updateOne({ _id: toId(id) as never }, { $inc: { [field]: by } as never });
}
