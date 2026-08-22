import { useSuspenseQuery } from "@tanstack/react-query";

import sportCricket from "@/assets/sport-cricket.jpg";
import sportFootball from "@/assets/sport-football.jpg";
import sportTennis from "@/assets/sport-tennis.jpg";
import sportBasketball from "@/assets/sport-basketball.jpg";
import sportOther from "@/assets/sport-other.jpg";
import gameRoulette from "@/assets/game-roulette.jpg";
import gameBlackjack from "@/assets/game-blackjack.jpg";
import gameBaccarat from "@/assets/game-baccarat.jpg";
import gameTeenPatti from "@/assets/game-teenpatti.jpg";
import gamePoker from "@/assets/game-poker.jpg";
import gameDragonTiger from "@/assets/game-dragontiger.jpg";
import gameSlots from "@/assets/game-slots.jpg";
import gameLive from "@/assets/game-live.jpg";
import heroImage from "@/assets/hero.jpg";
import aboutImage from "@/assets/about.jpg";

import {
  availableSitesQuery,
  backgroundsQuery,
  blogCategoriesQuery,
  blogPostsQuery,
  faqsQuery,
  gamesQuery,
  heroSlidesQuery,
  homepageSectionsQuery,
  promotionsQuery,
  screenshotsQuery,
  sportsQuery,
  siteChromeQuery,
  type HomepageSection,
} from "./cms-queries";
import { BRAND, WHATSAPP_LINK } from "./site";

export const HERO_FALLBACK_IMAGE = heroImage;
export const ABOUT_FALLBACK_IMAGE = aboutImage;

const SPORT_IMAGES: Record<string, string> = {
  cricket: sportCricket,
  football: sportFootball,
  tennis: sportTennis,
  basketball: sportBasketball,
  "other-sports": sportOther,
};

const GAME_IMAGES: Record<string, string> = {
  roulette: gameRoulette,
  blackjack: gameBlackjack,
  baccarat: gameBaccarat,
  "teen-patti": gameTeenPatti,
  poker: gamePoker,
  "dragon-tiger": gameDragonTiger,
  slots: gameSlots,
  "live-games": gameLive,
};

export const sportImage = (slug: string, url?: string | null) =>
  url || SPORT_IMAGES[slug] || sportOther;
export const gameImage = (slug: string, url?: string | null) =>
  url || GAME_IMAGES[slug] || gameLive;

/** Global, site-wide CMS data (prefetched in the root route loader). */
export function useSiteSettings() {
  return useSuspenseQuery({
    ...siteChromeQuery(),
    select: (data) => data.siteSettings,
  }).data;
}
export function useThemeSettings() {
  return useSuspenseQuery({
    ...siteChromeQuery(),
    select: (data) => data.themeSettings,
  }).data;
}
export function useSupportSettings() {
  return useSuspenseQuery({
    ...siteChromeQuery(),
    select: (data) => data.supportSettings,
  }).data;
}
export function useFooterSettings() {
  return useSuspenseQuery({
    ...siteChromeQuery(),
    select: (data) => data.footerSettings,
  }).data;
}
export function useNavigation() {
  return useSuspenseQuery({
    ...siteChromeQuery(),
    select: (data) => data.navigationItems,
  }).data;
}
export function useBackgrounds() {
  return useSuspenseQuery({
    ...siteChromeQuery(),
    select: (data) => data.backgroundSettings,
  }).data;
}
export function useHomepageSections() {
  return useSuspenseQuery(homepageSectionsQuery()).data;
}
export function useHeroSlides() {
  return useSuspenseQuery(heroSlidesQuery()).data;
}
export function useSports() {
  return useSuspenseQuery(sportsQuery()).data;
}
export function useGames() {
  return useSuspenseQuery(gamesQuery()).data;
}
export function useFaqs() {
  return useSuspenseQuery(faqsQuery()).data;
}
export function usePromotions() {
  return useSuspenseQuery(promotionsQuery()).data;
}
export function useScreenshots() {
  return useSuspenseQuery(screenshotsQuery()).data;
}
export function useAvailableSites() {
  return useSuspenseQuery(availableSitesQuery()).data;
}
export function useBlogPosts() {
  return useSuspenseQuery(blogPostsQuery()).data;
}
export function useBlogCategories() {
  return useSuspenseQuery(blogCategoriesQuery()).data;
}

export function useBrand() {
  return useSiteSettings()?.site_name?.trim() || BRAND;
}

/** WhatsApp link: support settings first, then site settings, then the built-in default. */
export function useWhatsAppLink() {
  const support = useSupportSettings();
  const site = useSiteSettings();
  return support?.whatsapp_url?.trim() || site?.whatsapp_url?.trim() || WHATSAPP_LINK;
}

export function useSection(slug: string): HomepageSection | null {
  const sections = useHomepageSections();
  return sections.find((s) => s.slug === slug) ?? null;
}

/** Background image + overlay for a page area, managed in Admin → Backgrounds. */
export function useBackground(slug: string) {
  const rows = useBackgrounds();
  const row = rows.find((r) => r.slug === slug) ?? null;
  if (!row?.image_url) return null;
  return {
    image: row.image_url,
    color: row.overlay_color || "#000000",
    opacity: typeof row.overlay_opacity === "number" ? row.overlay_opacity : 0.6,
  };
}

export type CmsLinkItem = { label: string; url: string };

/** Parses the JSON link arrays stored on footer_settings / site_settings. */
export function parseLinks(value: unknown): CmsLinkItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as { label?: unknown; url?: unknown; to?: unknown; title?: unknown };
      const label = String(row?.label ?? row?.title ?? "").trim();
      const url = String(row?.url ?? row?.to ?? "").trim();
      return { label, url };
    })
    .filter((l) => l.label && l.url);
}

export const text = (value: string | null | undefined, fallback: string) =>
  value && value.trim() ? value : fallback;
