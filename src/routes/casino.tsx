import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { GamesSection } from "@/components/site/GamesSection";
import { FeaturesSection } from "@/components/site/FeaturesSection";

const title = "Casino Lobby — Table, Card & Live Games | Strike Arena";
const description =
  "Discover the Strike Arena casino lobby: roulette, blackjack, baccarat, Teen Patti, poker, Dragon Tiger, slots and live studio games.";

export const Route = createFileRoute("/casino")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/casino" },
    ],
    links: [{ rel: "canonical", href: "/casino" }],
  }),
  component: CasinoPage,
});

function CasinoPage() {
  return (
    <>
      <PageHero
        eyebrow="Casino"
        title="A calm, cinematic casino lobby"
        description="Table classics, card rooms and live studio formats presented with a single, consistent card language. 18+ only, where legally permitted."
      />
      <GamesSection
        eyebrow="Casino Lobby"
        title="Browse the full lobby"
        description="Each category opens with a short, honest description of what it offers — no inflated claims, no guaranteed outcomes."
      />
      <FeaturesSection />
    </>
  );
}
