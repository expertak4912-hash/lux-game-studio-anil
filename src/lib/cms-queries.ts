import { queryOptions } from "@tanstack/react-query";
import {
  fetchPublic,
  fetchSiteChrome,
  type PublicQueryInput,
  type PublicTable,
} from "./cms.functions";
import type {
  AvailableSite,
  BackgroundSetting,
  BlogCategory,
  BlogPost,
  FaqItem,
  FooterSettings,
  GameRow,
  HeroSlide,
  HomepageSection,
  MediaItem,
  NavigationItem,
  PageRow,
  Promotion,
  Screenshot,
  SeoSettings,
  SiteSettings,
  SportRow,
  SupportSettings,
  ThemeSettings,
} from "@/shared/types";

export type {
  AvailableSite,
  BackgroundSetting,
  BlogCategory,
  BlogPost,
  FaqItem,
  FooterSettings,
  GameRow,
  HeroSlide,
  HomepageSection,
  MediaItem,
  NavigationItem,
  PageRow,
  Promotion,
  Screenshot,
  SeoSettings,
  SiteSettings,
  SportRow,
  SupportSettings,
  ThemeSettings,
};

const list = <T>(input: PublicQueryInput) =>
  queryOptions({
    queryKey: ["cms", input],
    queryFn: () => fetchPublic({ data: input }) as Promise<T>,
    staleTime: 30_000,
  });

export const cmsList = <T>(table: PublicTable, opts: Omit<PublicQueryInput, "table"> = {}) =>
  list<T[]>({ table, order: "sort_order", ...opts });

export const cmsSingle = <T>(table: PublicTable, opts: Omit<PublicQueryInput, "table"> = {}) =>
  list<T | null>({ table, single: true, ...opts });

export const siteSettingsQuery = () => cmsSingle<SiteSettings>("site_settings");
export const themeSettingsQuery = () => cmsSingle<ThemeSettings>("theme_settings");
export const supportSettingsQuery = () => cmsSingle<SupportSettings>("support_settings");
export const footerSettingsQuery = () => cmsSingle<FooterSettings>("footer_settings");
export const navigationQuery = () =>
  cmsList<NavigationItem>("navigation_items", { publishedOnly: true });
export const backgroundsQuery = () =>
  cmsList<BackgroundSetting>("background_settings", { order: "label" });

export type SiteChrome = {
  siteSettings: SiteSettings | null;
  themeSettings: ThemeSettings | null;
  supportSettings: SupportSettings | null;
  footerSettings: FooterSettings | null;
  backgroundSettings: BackgroundSetting[];
  navigationItems: NavigationItem[];
  /** The built-in pages listed in `site-pages.ts`, when an admin has customised them. */
  sitePages: PageRow[];
};

export const siteChromeQuery = () =>
  queryOptions({
    queryKey: ["cms", "site-chrome"],
    queryFn: () => fetchSiteChrome() as Promise<SiteChrome>,
    staleTime: 30_000,
  });

export const homepageSectionsQuery = () => cmsList<HomepageSection>("homepage_sections");
export const heroSlidesQuery = () => cmsList<HeroSlide>("hero_slides", { publishedOnly: true });
export const sportsQuery = () => cmsList<SportRow>("sports", { publishedOnly: true });
export const gamesQuery = () => cmsList<GameRow>("games", { publishedOnly: true });
export const faqsQuery = () => cmsList<FaqItem>("faq_items", { publishedOnly: true });
export const promotionsQuery = () => cmsList<Promotion>("promotions", { publishedOnly: true });
export const availableSitesQuery = () =>
  cmsList<AvailableSite>("available_sites", { publishedOnly: true });
export const screenshotsQuery = () => cmsList<Screenshot>("screenshots", { publishedOnly: true });
export const blogCategoriesQuery = () => cmsList<BlogCategory>("blog_categories");
export const blogPostsQuery = () =>
  cmsList<BlogPost>("blog_posts", { publishedOnly: true, order: "publish_date", ascending: false });
export const publishedPagesQuery = () => cmsList<PageRow>("pages", { publishedOnly: true });

export const gameBySlugQuery = (slug: string) =>
  cmsSingle<GameRow>("games", { filters: { slug }, publishedOnly: true });
export const sportBySlugQuery = (slug: string) =>
  cmsSingle<SportRow>("sports", { filters: { slug }, publishedOnly: true });
export const pageBySlugQuery = (slug: string) =>
  cmsSingle<PageRow>("pages", { filters: { slug }, publishedOnly: true });
export const postBySlugQuery = (slug: string) =>
  cmsSingle<BlogPost>("blog_posts", { filters: { slug }, publishedOnly: true });

/** Posts in one category, newest first. Backs the /blog category filter. */
export const postsByCategoryQuery = (categoryId: string) =>
  cmsList<BlogPost>("blog_posts", {
    filters: { category_id: categoryId },
    publishedOnly: true,
    order: "publish_date",
    ascending: false,
  });

/** Per-path SEO overrides, managed in Admin → SEO. */
export const seoForPathQuery = (path: string) =>
  cmsSingle<SeoSettings>("seo_settings", { filters: { path } });
