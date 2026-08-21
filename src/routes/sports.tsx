import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SportsSection } from "@/components/site/SportsSection";
import { PromoBanner } from "@/components/site/PromoBanner";

const title = "Sports Hub — Cricket, Football, Tennis & More | Strike Arena";
const description =
  "Browse Strike Arena's sports categories: cricket, football, tennis, basketball and more, organised in a clean, mobile-first layout.";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/sports" },
    ],
    links: [{ rel: "canonical", href: "/sports" }],
  }),
  component: SportsPage,
});

function SportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sports"
        title="Sports coverage built for match days"
        description="Every discipline gets its own clear space, from floodlit cricket nights to weekend league football, with fixtures that stay readable on any screen."
      />
      <SportsSection />
      <PromoBanner />
    </>
  );
}
