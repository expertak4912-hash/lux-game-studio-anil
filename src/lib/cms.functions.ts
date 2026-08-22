/**
 * Public, unauthenticated CMS access.
 *
 * `fetchPublic` keeps exactly the input/output contract it had under Supabase, so every caller in
 * `cms-queries.ts` and every site component is unchanged — only the storage behind it moved.
 *
 * Authorization: `requirePublicReadable` enforces the allowlist that the RLS policy
 * `"public read {table}"` used to enforce. A table not marked `publicRead` (contact_messages,
 * users) cannot be reached through here at all, regardless of what the caller asks for.
 *
 * This module ships to the client bundle — all server-only imports are dynamic and inside handlers.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TABLES = [
  "site_settings",
  "theme_settings",
  "background_settings",
  "support_settings",
  "footer_settings",
  "homepage_sections",
  "hero_slides",
  "pages",
  "games",
  "sports",
  "blog_categories",
  "blog_posts",
  "available_sites",
  "screenshots",
  "promotions",
  "faq_items",
  "navigation_items",
  "seo_settings",
  "media",
] as const;

export type PublicTable = (typeof TABLES)[number];

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type CmsRow = { [key: string]: Json };

export type PublicQueryInput = {
  table: PublicTable;
  filters?: Record<string, string | number | boolean>;
  publishedOnly?: boolean;
  order?: string;
  ascending?: boolean;
  limit?: number;
  single?: boolean;
};

const querySchema = z.object({
  table: z.enum(TABLES),
  filters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  publishedOnly: z.boolean().optional(),
  order: z.string().max(40).optional(),
  ascending: z.boolean().optional(),
  limit: z.number().int().positive().max(500).optional(),
  single: z.boolean().optional(),
});

/** Public, read-only CMS fetcher. Every table in `TABLES` has a public-read grant. */
export const fetchPublic = createServerFn({ method: "GET" })
  .validator((data: unknown) => querySchema.parse(data) as PublicQueryInput)
  .handler(async ({ data }): Promise<CmsRow | CmsRow[] | null> => {
    const { requirePublicReadable } = await import("@/server/db/collections");
    const { findRow, findSingleton, listRows } = await import("@/server/db/repository");

    const spec = requirePublicReadable(data.table);

    // The four former singleton settings tables resolve to one document in `settings`.
    if (spec.singletonKey) {
      return (await findSingleton(spec.name, spec.singletonKey)) as CmsRow | null;
    }

    const options = {
      ...(data.filters ? { filters: data.filters } : {}),
      ...(data.publishedOnly === undefined ? {} : { publishedOnly: data.publishedOnly }),
      ...(data.order ? { order: data.order } : {}),
      ...(data.ascending === undefined ? {} : { ascending: data.ascending }),
      ...(data.limit === undefined ? {} : { limit: data.limit }),
    };

    if (data.single) {
      return (await findRow(spec.name, options)) as CmsRow | null;
    }

    return (await listRows(spec.name, options, spec.defaultSort)) as CmsRow[];
  });

/** Fetches the chrome data shared by every public route in one database round trip. */
export const fetchSiteChrome = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    siteSettings: CmsRow | null;
    themeSettings: CmsRow | null;
    supportSettings: CmsRow | null;
    footerSettings: CmsRow | null;
    backgroundSettings: CmsRow[];
    navigationItems: CmsRow[];
  }> => {
  const { requirePublicReadable } = await import("@/server/db/collections");
  const { findSingleton, listRows } = await import("@/server/db/repository");

  const site = requirePublicReadable("site_settings");
  const theme = requirePublicReadable("theme_settings");
  const support = requirePublicReadable("support_settings");
  const footer = requirePublicReadable("footer_settings");
  const backgrounds = requirePublicReadable("background_settings");
  const navigation = requirePublicReadable("navigation_items");

  const [siteSettings, themeSettings, supportSettings, footerSettings, backgroundSettings, navigationItems] =
    await Promise.all([
      findSingleton(site.name, site.singletonKey!),
      findSingleton(theme.name, theme.singletonKey!),
      findSingleton(support.name, support.singletonKey!),
      findSingleton(footer.name, footer.singletonKey!),
      listRows(backgrounds.name, {}, backgrounds.defaultSort),
      listRows(
        navigation.name,
        { publishedOnly: true },
        navigation.defaultSort,
      ),
    ]);

    return {
      siteSettings: siteSettings as CmsRow | null,
      themeSettings: themeSettings as CmsRow | null,
      supportSettings: supportSettings as CmsRow | null,
      footerSettings: footerSettings as CmsRow | null,
      backgroundSettings: backgroundSettings as CmsRow[],
      navigationItems: navigationItems as CmsRow[],
    };
  },
);

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z
    .string()
    .trim()
    .max(255)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1, "Please enter a message.").max(2000),
});

/**
 * Contact form submission. Anyone may write; only admins may read the resulting messages —
 * the same split the `"anyone can submit a message"` INSERT policy gave us in Postgres.
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { checkRateLimit } = await import("@/server/rate-limit");
    const { collectionFor } = await import("@/server/db/collections");

    // 5 messages per hour per IP.
    checkRateLimit({ key: "contact", limit: 5, windowMs: 60 * 60 * 1000 });

    const collection = await collectionFor("contact_messages");
    await collection.insertOne({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      is_read: false,
      created_at: new Date(),
    } as never);

    return { ok: true as const };
  });

/** Increments a published post's view counter. Fire-and-forget from the blog detail route. */
export const recordPostView = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().min(1).max(64) }).parse(data))
  .handler(async ({ data }) => {
    const { incrementField } = await import("@/server/db/repository");
    await incrementField("blog_posts", data.id, "views", 1);
    return { ok: true as const };
  });
