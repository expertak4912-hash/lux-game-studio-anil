/**
 * Collection registry — the application-level replacement for Supabase Row Level Security.
 *
 * Postgres enforced access with policies attached to each table:
 *   - "public read {table}"   → SELECT for anon on 20 tables
 *   - "admins manage {table}" → ALL for authenticated admins on 21 tables
 *   - "anyone can submit"     → INSERT for anon on contact_messages only
 *
 * MongoDB has no equivalent, so the same rules live here and are enforced by the server functions
 * in `src/lib/cms.functions.ts` (public reads) and `src/lib/admin.functions.ts` (admin writes).
 * A collection that is not in this registry cannot be reached through either path.
 *
 * SERVER ONLY.
 */
import type { Collection, Document } from "mongodb";
import { getDb } from "./client";

/**
 * Logical names, unchanged from the Postgres table names, so existing callers
 * (`useAdminRows("hero_slides")`, `cmsList("games")`) keep working verbatim.
 */
export type TableName =
  | "site_settings"
  | "theme_settings"
  | "support_settings"
  | "footer_settings"
  | "background_settings"
  | "homepage_sections"
  | "hero_slides"
  | "pages"
  | "games"
  | "sports"
  | "blog_categories"
  | "blog_posts"
  | "available_sites"
  | "screenshots"
  | "promotions"
  | "faq_items"
  | "navigation_items"
  | "seo_settings"
  | "media"
  | "contact_messages"
  | "users";

type TableSpec = {
  /** Physical MongoDB collection. Several logical names share the `settings` collection. */
  collection: string;
  /**
   * Set for the four former singleton tables. Their rows live as one document each in the
   * shared `settings` collection, keyed by this value as `_id`.
   */
  singletonKey?: "site" | "theme" | "support" | "footer";
  /** Readable without authentication (was: "public read" RLS policy). */
  publicRead: boolean;
  /** Writable by an authenticated admin (was: "admins manage" RLS policy). */
  adminWrite: boolean;
  /** Anyone may insert, but only admins may read (was: contact_messages INSERT policy). */
  publicInsert?: boolean;
  /** Default sort applied to list queries. */
  defaultSort?: { field: string; ascending: boolean };
};

const TABLES: Record<TableName, TableSpec> = {
  // --- singleton settings (4 Postgres tables → 1 `settings` collection) -------------------
  site_settings: {
    collection: "settings",
    singletonKey: "site",
    publicRead: true,
    adminWrite: true,
  },
  theme_settings: {
    collection: "settings",
    singletonKey: "theme",
    publicRead: true,
    adminWrite: true,
  },
  support_settings: {
    collection: "settings",
    singletonKey: "support",
    publicRead: true,
    adminWrite: true,
  },
  footer_settings: {
    collection: "settings",
    singletonKey: "footer",
    publicRead: true,
    adminWrite: true,
  },

  // --- content -----------------------------------------------------------------------------
  background_settings: {
    collection: "backgrounds",
    publicRead: true,
    adminWrite: true,
    defaultSort: { field: "label", ascending: true },
  },
  homepage_sections: { collection: "homepage_sections", publicRead: true, adminWrite: true },
  hero_slides: { collection: "hero_slides", publicRead: true, adminWrite: true },
  pages: { collection: "pages", publicRead: true, adminWrite: true },
  games: { collection: "games", publicRead: true, adminWrite: true },
  sports: { collection: "sports", publicRead: true, adminWrite: true },
  blog_categories: { collection: "blog_categories", publicRead: true, adminWrite: true },
  blog_posts: {
    collection: "blog_posts",
    publicRead: true,
    adminWrite: true,
    defaultSort: { field: "publish_date", ascending: false },
  },
  available_sites: { collection: "available_sites", publicRead: true, adminWrite: true },
  screenshots: { collection: "screenshots", publicRead: true, adminWrite: true },
  promotions: { collection: "promotions", publicRead: true, adminWrite: true },
  faq_items: { collection: "faq_items", publicRead: true, adminWrite: true },
  navigation_items: { collection: "navigation_items", publicRead: true, adminWrite: true },
  seo_settings: {
    collection: "seo_settings",
    publicRead: true,
    adminWrite: true,
    defaultSort: { field: "path", ascending: true },
  },
  media: {
    collection: "media",
    publicRead: true,
    adminWrite: true,
    defaultSort: { field: "created_at", ascending: false },
  },

  // --- write-only for the public, read-only for admins --------------------------------------
  contact_messages: {
    collection: "contact_messages",
    publicRead: false,
    adminWrite: true,
    publicInsert: true,
    defaultSort: { field: "created_at", ascending: false },
  },

  // --- never exposed through the generic CRUD surface ---------------------------------------
  // Password hashes live here. Reached only by the dedicated auth server functions.
  users: { collection: "users", publicRead: false, adminWrite: false },
};

export function isTableName(value: unknown): value is TableName {
  return typeof value === "string" && Object.hasOwn(TABLES, value);
}

/** Throws unless `name` is a registered table. Guards every dynamic table lookup. */
export function requireTable(name: unknown): TableSpec & { name: TableName } {
  if (!isTableName(name)) throw new Error(`Unknown collection: ${String(name)}`);
  return { ...TABLES[name], name };
}

/** Throws unless the table may be read without authentication. */
export function requirePublicReadable(name: unknown): TableSpec & { name: TableName } {
  const spec = requireTable(name);
  if (!spec.publicRead) throw new Error(`Collection is not publicly readable: ${spec.name}`);
  return spec;
}

/** Throws unless the table may be written by an admin through the generic CRUD surface. */
export function requireAdminWritable(name: unknown): TableSpec & { name: TableName } {
  const spec = requireTable(name);
  if (!spec.adminWrite) throw new Error(`Collection is not writable: ${spec.name}`);
  return spec;
}

/** Resolves a logical table name to its physical MongoDB collection. */
export async function collectionFor<T extends Document = Document>(
  name: TableName,
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(TABLES[name].collection);
}

export const ALL_TABLES = Object.keys(TABLES) as TableName[];
