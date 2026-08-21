import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { AboutSection } from "@/components/site/AboutSection";
import { FeaturesSection } from "@/components/site/FeaturesSection";
import { HowItWorks } from "@/components/site/HowItWorks";

const title = "About Us — Our Approach | Strike Arena";
const description =
  "Learn how Strike Arena approaches sports entertainment, online gaming, user-friendly design, support, mobile accessibility and responsible gaming.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Premium entertainment, honestly presented"
        description="Strike Arena was designed around clarity: real descriptions, generous spacing and a layout that behaves the same on a phone as it does on a desktop."
      />
      <AboutSection />
      <FeaturesSection />
      <HowItWorks />
    </>
  );
}
