import { createFileRoute } from "@tanstack/react-router";
import { SitePageView } from "@/components/site/SitePageView";
import { FeaturesSection } from "@/components/site/FeaturesSection";
import { HowItWorks } from "@/components/site/HowItWorks";
import { siteChromeQuery } from "@/lib/cms-queries";
import { sitePageDef, sitePageHead, type SitePageRow } from "@/lib/site-pages";

const def = sitePageDef("about")!;

export const Route = createFileRoute("/about")({
  // The built-in pages travel with the site chrome, so this reads from cache rather than firing
  // another request. It is here only so `head` can use the admin's own title and description.
  loader: async ({ context }) => {
    const chrome = await context.queryClient.ensureQueryData(siteChromeQuery());
    return {
      page: (chrome.sitePages.find((p) => p.slug === def.slug) ?? null) as SitePageRow | null,
    };
  },
  head: ({ loaderData }) => sitePageHead(def, loaderData?.page ?? null),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <SitePageView slug="about" />
      <FeaturesSection />
      <HowItWorks />
    </>
  );
}
