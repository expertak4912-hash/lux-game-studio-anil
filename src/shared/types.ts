/**
 * Document shapes for every MongoDB collection.
 *
 * These replace the generated `src/integrations/supabase/types.ts`. Field names are kept in
 * snake_case, exactly as the old Postgres columns were, so that every site component, admin
 * field config and CMS query continues to work unchanged.
 *
 * Documents are always handed to the client with a string `id` (the hex form of `_id`); the
 * raw `_id` never leaves the server. See `src/server/db/serialize.ts`.
 */

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** A link stored inside a JSON array column (footer_links, social_links, legal_links). */
export type LinkItem = { label: string; url: string };

/** Every content document carries these. */
type Base = {
  id: string;
  created_at?: string;
  updated_at?: string;
};

/** Published/draft gate. Public queries filter on `status === "published"`. */
export type Status = "published" | "draft";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export type UserRole = "admin" | "editor";

/** Replaces Supabase `auth.users` + the `user_roles` join table. */
export type User = Base & {
  email: string;
  /** scrypt hash — never serialized to the client. */
  password_hash: string;
  role: UserRole;
  last_login_at?: string | null;
};

/** The safe projection of `User` that server functions may return. */
export type PublicUser = {
  id: string;
  email: string;
  role: UserRole;
};

// ---------------------------------------------------------------------------
// Settings — four Postgres singleton tables collapsed into one `settings`
// collection keyed by `_id`.
// ---------------------------------------------------------------------------

/**
 * Image fields come in pairs: `x` is the web/desktop upload and `x_mobile` is the phone upload,
 * both managed side by side in the admin panel. The site renders `x_mobile` below 768px and falls
 * back to `x` when the mobile slot is empty, so documents written before the split still render.
 * Social/OG images and the favicon have no `_mobile` twin — they are consumed at a fixed size.
 */

export type SettingsKey = "site" | "theme" | "support" | "footer";

export type SiteSettings = {
  id: string;
  site_name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  logo_url_mobile: string | null;
  favicon_url: string | null;
  whatsapp_url: string | null;
  email: string | null;
  phone: string | null;
  social_links: LinkItem[];
  copyright_text: string | null;
  updated_at?: string;
};

export type ThemeSettings = {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  button_color: string;
  button_text_color: string;
  header_color: string;
  footer_color: string;
  card_color: string;
  background_color: string;
  text_color: string;
  heading_color: string;
  font_family: string;
  heading_font: string;
  body_font: string;
  border_radius: string;
  button_style: string;
  card_style: string;
  updated_at?: string;
};

export type SupportSettings = {
  id: string;
  whatsapp_url: string | null;
  email: string | null;
  phone: string | null;
  live_chat_url: string | null;
  telegram_url: string | null;
  support_text: string | null;
  updated_at?: string;
};

export type FooterSettings = {
  id: string;
  logo_url: string | null;
  logo_url_mobile: string | null;
  description: string | null;
  footer_links: LinkItem[];
  legal_links: LinkItem[];
  social_links: LinkItem[];
  contact_info: string | null;
  copyright_text: string | null;
  updated_at?: string;
};

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export type BackgroundSetting = Base & {
  slug: string;
  label: string;
  image_url: string | null;
  image_url_mobile: string | null;
  overlay_color: string;
  overlay_opacity: number;
};

export type HomepageSection = Base & {
  slug: string;
  name: string;
  enabled: boolean;
  heading: string | null;
  description: string | null;
  image_url: string | null;
  image_url_mobile: string | null;
  button_text: string | null;
  button_url: string | null;
  sort_order: number;
};

export type HeroSlide = Base & {
  title: string;
  description: string | null;
  image_url: string | null;
  image_url_mobile: string | null;
  button_text: string | null;
  button_url: string | null;
  sort_order: number;
  status: Status;
};

/** A block inside a CMS page. Was the `page_blocks` table; now embedded. */
export type PageBlock = {
  id: string;
  block_type: string;
  data: Record<string, Json>;
  sort_order: number;
};

export type PageRow = Base & {
  title: string;
  slug: string;
  /** Small label rendered above the page title. Used by the built-in pages in `site-pages.ts`. */
  eyebrow?: string | null;
  /**
   * Structured cards for a built-in page — legal blocks, How It Works steps, Built For You
   * feature cards or About checklist lines. Edited as raw JSON in Admin → Site Pages, so readers
   * parse defensively (see `parse*Items` in `src/lib/site-pages.ts`).
   */
  items?: Json | null;
  featured_image: string | null;
  featured_image_mobile: string | null;
  background_image: string | null;
  background_image_mobile: string | null;
  short_description: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  seo_image: string | null;
  canonical_url: string | null;
  status: Status;
  sort_order: number;
  /** Embedded — replaces the `page_blocks` table. */
  blocks: PageBlock[];
};

export type GameRow = Base & {
  name: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  featured_image_mobile: string | null;
  background_image: string | null;
  background_image_mobile: string | null;
  content: string | null;
  button_text: string | null;
  tag: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  status: Status;
  sort_order: number;
};

export type SportRow = Base & {
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  image_url_mobile: string | null;
  background_image: string | null;
  background_image_mobile: string | null;
  description: string | null;
  content: string | null;
  url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  sort_order: number;
  status: Status;
};

export type BlogCategory = Base & {
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type BlogPost = Base & {
  title: string;
  slug: string;
  featured_image: string | null;
  featured_image_mobile: string | null;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  /** Reference to `blog_categories.id`. Kept as a reference, not embedded. */
  category_id: string | null;
  tags: string[];
  publish_date: string;
  views: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  status: Status;
};

export type AvailableSite = Base & {
  name: string;
  logo_url: string | null;
  logo_url_mobile: string | null;
  image_url: string | null;
  image_url_mobile: string | null;
  description: string | null;
  category: string | null;
  button_text: string | null;
  button_url: string | null;
  sort_order: number;
  status: Status;
};

export type Screenshot = Base & {
  title: string;
  image_url: string | null;
  image_url_mobile: string | null;
  description: string | null;
  category: string;
  sort_order: number;
  status: Status;
};

export type Promotion = Base & {
  title: string;
  image_url: string | null;
  image_url_mobile: string | null;
  short_description: string | null;
  button_text: string | null;
  button_url: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
  status: Status;
};

export type FaqItem = Base & {
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  status: Status;
};

export type MediaItem = Base & {
  file_name: string;
  url: string;
  category: string;
  alt_text: string | null;
  size_bytes: number | null;
  content_type?: string | null;
  /** GridFS file id backing this item, when it was uploaded (not linked by URL). */
  gridfs_id?: string | null;
};

export type NavigationItem = Base & {
  label: string;
  url: string;
  sort_order: number;
  new_tab: boolean;
  status: Status;
};

export type SeoSettings = Base & {
  path: string;
  seo_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  canonical_url: string | null;
  og_image: string | null;
};

export type ContactMessage = Base & {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
};
