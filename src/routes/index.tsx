import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/site/Hero";
import { SportsSection } from "@/components/site/SportsSection";
import { GamesSection } from "@/components/site/GamesSection";
import { FeaturesSection } from "@/components/site/FeaturesSection";
import { HowItWorks } from "@/components/site/HowItWorks";
import { PromoBanner } from "@/components/site/PromoBanner";
import { PromotionsSection } from "@/components/site/PromotionsSection";
import { ScreenshotsSection } from "@/components/site/ScreenshotsSection";
import { AvailableSitesSection } from "@/components/site/AvailableSitesSection";
import { AboutSection } from "@/components/site/AboutSection";
import { FaqSection } from "@/components/site/FaqSection";
import { ContactSection } from "@/components/site/ContactSection";

const title = "Strike Arena — Sports & Online Gaming Entertainment";
const description =
  "Explore cricket, football, tennis and casino-style gaming categories in one premium, mobile-first entertainment platform. 18+ only, play responsibly.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <SportsSection />
      <GamesSection />
      <FeaturesSection />
      <HowItWorks />
      <AvailableSitesSection />
      <ScreenshotsSection category="platform" sectionSlug="platform_screenshots" />
      <PromotionsSection />
      <PromoBanner />
      <AboutSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
