import { SectionHeading } from "./SectionHeading";
import { FeatureGrid } from "./SitePageBlocks";
import { text, useSection, useSitePage } from "@/lib/cms-content";
import {
  parseFeatureItems,
  resolveSitePage,
  sitePageDef,
  type FeatureItem,
} from "@/lib/site-pages";

const def = sitePageDef("built-for-you")!;

/** Homepage teaser for `/built-for-you`. Cards come from Admin → Site Pages. */
export function FeaturesSection() {
  const section = useSection("why_us");
  const page = useSitePage(def.slug);

  if (section?.enabled === false) return null;

  const resolved = resolveSitePage(def, page);
  const features = (parseFeatureItems(resolved.items) ??
    parseFeatureItems(def.defaults.items) ??
    []) as FeatureItem[];

  return (
    <section className="section-shell py-20 lg:py-28">
      <SectionHeading
        eyebrow={text(section?.name, def.defaults.eyebrow)}
        title={text(section?.heading, resolved.title)}
        description={text(section?.description, resolved.description)}
        href={def.path}
        linkLabel="What we build for"
      />
      <FeatureGrid features={features} />
    </section>
  );
}
