/**
 * Database seed.
 *
 *   npm run seed
 *
 * Creates indexes and inserts the initial CMS content. Every document is upserted by a natural
 * key (`slug`, `path`, or the settings `_id`), so re-running is safe: existing rows you have
 * edited in the admin panel are left alone, and only missing ones are created.
 *
 * Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first administrator without going
 * through the /admin/login setup form. Both are optional.
 */
import { config } from "dotenv";
import type { Collection, Document } from "mongodb";

// Load .env before anything reads process.env.
config();

import { closeClient, getDb } from "../src/server/db/client";
import { ensureIndexes } from "../src/server/db/indexes";
import {
  AVAILABLE_SITES,
  BACKGROUNDS,
  BLOG_CATEGORIES,
  FAQ_ITEMS,
  FOOTER_SETTINGS,
  GAMES,
  HERO_SLIDES,
  HOMEPAGE_SECTIONS,
  NAVIGATION,
  PAGES,
  PROMOTIONS,
  SCREENSHOTS,
  SEO_SETTINGS,
  SITE_SETTINGS,
  SPORTS,
  SUPPORT_SETTINGS,
  THEME_SETTINGS,
} from "./seed-data";

type Row = Record<string, unknown>;

let created = 0;
let skipped = 0;

function log(message: string): void {
  process.stdout.write(`${message}\n`);
}

/**
 * Inserts each row only if no document already matches on `key`.
 *
 * `$setOnInsert` means a re-run never overwrites content edited in the admin panel — the whole
 * point of making this idempotent.
 */
async function upsertMany(
  collection: Collection<Document>,
  rows: Row[],
  key: string,
): Promise<void> {
  const now = new Date();

  for (const row of rows) {
    const result = await collection.updateOne(
      { [key]: row[key] },
      { $setOnInsert: { ...row, created_at: now, updated_at: now } },
      { upsert: true },
    );

    if (result.upsertedCount > 0) created += 1;
    else skipped += 1;
  }
}

/** The four former singleton settings tables, each one document in `settings`. */
async function upsertSettings(
  collection: Collection<Document>,
  id: string,
  values: Row,
): Promise<void> {
  const result = await collection.updateOne(
    { _id: id as never },
    { $setOnInsert: { ...values, updated_at: new Date() } },
    { upsert: true },
  );

  if (result.upsertedCount > 0) created += 1;
  else skipped += 1;
}

async function seedAdmin(): Promise<void> {
  const email = process.env["SEED_ADMIN_EMAIL"];
  const password = process.env["SEED_ADMIN_PASSWORD"];

  if (!email || !password) {
    log("  admin            no SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD — use /admin/login setup");
    return;
  }

  const { countAdmins, createUser, findUserByEmail } = await import("../src/server/auth/users");

  if (await findUserByEmail(email)) {
    log(`  admin            already exists (${email})`);
    return;
  }

  if ((await countAdmins()) > 0) {
    log("  admin            an administrator already exists — skipping");
    return;
  }

  if (password.length < 8) {
    log("  admin            SEED_ADMIN_PASSWORD must be at least 8 characters — skipping");
    return;
  }

  await createUser(email, password, "admin");
  log(`  admin            created ${email}`);
}

async function main(): Promise<void> {
  log("");
  log("Seeding MongoDB…");
  log(`  database         ${process.env["MONGODB_DATABASE"]}`);

  const db = await getDb();

  const indexCount = await ensureIndexes();
  log(`  indexes          ${indexCount} ensured`);

  const settings = db.collection("settings");
  await upsertSettings(settings, "site", SITE_SETTINGS);
  await upsertSettings(settings, "theme", THEME_SETTINGS);
  await upsertSettings(settings, "support", SUPPORT_SETTINGS);
  await upsertSettings(settings, "footer", FOOTER_SETTINGS);
  log("  settings         site, theme, support, footer");

  await upsertMany(db.collection("backgrounds"), BACKGROUNDS, "slug");
  await upsertMany(db.collection("navigation_items"), NAVIGATION, "url");
  await upsertMany(db.collection("homepage_sections"), HOMEPAGE_SECTIONS, "slug");
  await upsertMany(db.collection("hero_slides"), HERO_SLIDES, "title");
  await upsertMany(db.collection("pages"), PAGES, "slug");
  await upsertMany(db.collection("sports"), SPORTS, "slug");
  await upsertMany(db.collection("games"), GAMES, "slug");
  await upsertMany(db.collection("blog_categories"), BLOG_CATEGORIES, "slug");
  await upsertMany(db.collection("faq_items"), FAQ_ITEMS, "question");
  await upsertMany(db.collection("promotions"), PROMOTIONS, "title");
  await upsertMany(db.collection("screenshots"), SCREENSHOTS, "title");
  await upsertMany(db.collection("available_sites"), AVAILABLE_SITES, "name");
  await upsertMany(db.collection("seo_settings"), SEO_SETTINGS, "path");

  log(`  content          ${created} created, ${skipped} already present`);

  await seedAdmin();

  log("");
  log("Done. Start the app with: npm run dev");
  log("");
}

main()
  .catch((error: unknown) => {
    process.stderr.write(
      `\nSeed failed: ${error instanceof Error ? error.message : String(error)}\n\n`,
    );
    process.exitCode = 1;
  })
  .finally(() => closeClient());
