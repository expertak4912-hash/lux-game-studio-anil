/**
 * Translation between MongoDB documents and the plain JSON rows the app works with.
 *
 * The rest of the codebase (ResourceManager, cms-queries, every site component) expects a string
 * `id` field and JSON-safe values, exactly as Supabase returned. `_id` and `Date` objects never
 * cross the wire.
 *
 * SERVER ONLY.
 */
import { ObjectId } from "mongodb";

export type Row = Record<string, unknown>;

/** True when `value` is a 24-character hex string that ObjectId can parse. */
export function isObjectIdHex(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);
}

/**
 * Builds the `_id` for a document lookup.
 *
 * Most collections use ObjectId. The `settings` collection uses stable string keys
 * ("site", "theme", …), so a non-hex string is passed through as-is.
 */
export function toId(value: unknown): ObjectId | string {
  if (value instanceof ObjectId) return value;
  if (isObjectIdHex(value)) return new ObjectId(value);
  if (typeof value === "string" && value.length > 0) return value;
  throw new Error("A valid id is required.");
}

/** Recursively converts Mongo/BSON values into JSON-safe ones. */
function toJsonValue(value: unknown): unknown {
  if (value instanceof ObjectId) return value.toHexString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(toJsonValue);
  if (value && typeof value === "object") {
    const out: Row = {};
    for (const [key, inner] of Object.entries(value as Row)) out[key] = toJsonValue(inner);
    return out;
  }
  return value;
}

/**
 * Maps a stored document to an API row: `_id` becomes a string `id`, dates become ISO strings.
 * Returns `null` for a missing document so callers can pass it straight through.
 */
export function serializeDoc<T extends Row>(doc: T | null | undefined): Row | null {
  if (!doc) return null;
  const { _id, ...rest } = doc as Row & { _id?: unknown };
  const row = toJsonValue(rest) as Row;
  if (_id !== undefined) {
    row["id"] = _id instanceof ObjectId ? _id.toHexString() : String(_id);
  }
  return row;
}

export function serializeDocs<T extends Row>(docs: T[]): Row[] {
  return docs.map((doc) => serializeDoc(doc)).filter((row): row is Row => row !== null);
}

/** Fields the client must never be able to set directly through the generic CRUD surface. */
const PROTECTED_FIELDS = new Set(["_id", "id", "created_at", "password_hash"]);

/**
 * Strips protected fields from an incoming write payload and converts ISO date strings on
 * known date fields back into `Date`, so range queries and sorting work in Mongo.
 */
export function sanitizeWrite(values: Row): Row {
  const out: Row = {};
  for (const [key, value] of Object.entries(values)) {
    if (PROTECTED_FIELDS.has(key)) continue;
    out[key] = value;
  }
  return out;
}
