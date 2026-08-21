/**
 * Index definitions.
 *
 * These carry over the UNIQUE constraints the Postgres schema had (every `slug`, `users.email`,
 * `seo_settings.path`) plus the sort keys the app actually queries on. Run from `npm run seed`;
 * `createIndex` is idempotent, so re-running is safe.
 *
 * SERVER ONLY.
 */
import type { IndexSpecification, CreateIndexesOptions } from "mongodb";
import { getDb } from "./client";

type IndexDef = {
  collection: string;
  spec: IndexSpecification;
  options?: CreateIndexesOptions;
};

const INDEXES: IndexDef[] = [
  // Auth — one account per email address.
  { collection: "users", spec: { email: 1 }, options: { unique: true } },

  // Slug uniqueness, previously `slug text NOT NULL UNIQUE` on each table.
  { collection: "backgrounds", spec: { slug: 1 }, options: { unique: true } },
  { collection: "homepage_sections", spec: { slug: 1 }, options: { unique: true } },
  { collection: "pages", spec: { slug: 1 }, options: { unique: true } },
  { collection: "games", spec: { slug: 1 }, options: { unique: true } },
  { collection: "sports", spec: { slug: 1 }, options: { unique: true } },
  { collection: "blog_categories", spec: { slug: 1 }, options: { unique: true } },
  { collection: "blog_posts", spec: { slug: 1 }, options: { unique: true } },
  { collection: "seo_settings", spec: { path: 1 }, options: { unique: true } },

  // Sort keys used by list queries.
  { collection: "homepage_sections", spec: { sort_order: 1 } },
  { collection: "hero_slides", spec: { status: 1, sort_order: 1 } },
  { collection: "pages", spec: { status: 1, sort_order: 1 } },
  { collection: "games", spec: { status: 1, sort_order: 1 } },
  { collection: "sports", spec: { status: 1, sort_order: 1 } },
  { collection: "faq_items", spec: { status: 1, sort_order: 1 } },
  { collection: "navigation_items", spec: { status: 1, sort_order: 1 } },
  { collection: "promotions", spec: { status: 1, sort_order: 1 } },
  { collection: "screenshots", spec: { status: 1, sort_order: 1 } },
  { collection: "available_sites", spec: { status: 1, sort_order: 1 } },

  // Blog listing: published posts, newest first, optionally filtered by category.
  { collection: "blog_posts", spec: { status: 1, publish_date: -1 } },
  { collection: "blog_posts", spec: { category_id: 1, status: 1, publish_date: -1 } },

  // Admin inboxes and libraries, newest first.
  { collection: "contact_messages", spec: { created_at: -1 } },
  { collection: "media", spec: { created_at: -1 } },
];

export async function ensureIndexes(): Promise<number> {
  const db = await getDb();
  for (const { collection, spec, options } of INDEXES) {
    await db.collection(collection).createIndex(spec, options ?? {});
  }
  return INDEXES.length;
}
