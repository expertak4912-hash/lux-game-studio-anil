import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { GamesSection } from "@/components/site/GamesSection";
import { HowItWorks } from "@/components/site/HowItWorks";
import { PromoBanner } from "@/components/site/PromoBanner";

const title = "Games — Explore Every Category | Strike Arena";
const description =
  "Explore the Strike Arena games grid, from card rooms and reel titles to live studio formats, with hover previews and clear descriptions.";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/games" },
    ],
    links: [{ rel: "canonical", href: "/games" }],
  }),
  component: GamesPage,
});

function GamesPage() {
  return (
    <>
      <PageHero
        eyebrow="Games"
        title="Explore every game category"
        description="One grid, one visual language, zero clutter. Open a category to see what it includes and how it plays on mobile."
      />
      <GamesSection
        eyebrow="All Games"
        title="The complete games grid"
        description="Availability of individual titles depends on your region and applicable licensing."
      />
      <HowItWorks />
      <PromoBanner />
    </>
  );
}
