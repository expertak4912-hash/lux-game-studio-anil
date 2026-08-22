import { SectionHeading } from "./SectionHeading";
import { StepsGrid } from "./SitePageBlocks";
import { text, useSection, useSitePage } from "@/lib/cms-content";
import { parseStepItems, resolveSitePage, sitePageDef, type StepItem } from "@/lib/site-pages";

const def = sitePageDef("how-it-works")!;

/**
 * Homepage teaser for `/how-it-works`.
 *
 * The heading text comes from Admin → Homepage Sections (as it always has); the step cards come
 * from Admin → Site Pages, the same rows the dedicated page reads, so the two never drift.
 */
export function HowItWorks() {
  const section = useSection("how_it_works");
  const page = useSitePage(def.slug);

  if (section?.enabled === false) return null;

  const resolved = resolveSitePage(def, page);
  const steps = (parseStepItems(resolved.items) ??
    parseStepItems(def.defaults.items) ??
    []) as StepItem[];

  return (
    <section className="relative isolate overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_80%_20%,color-mix(in_oklab,var(--brand-gold)_10%,transparent),transparent_65%)]"
      />
      <div className="section-shell">
        <SectionHeading
          eyebrow={text(section?.name, def.defaults.eyebrow)}
          title={text(section?.heading, resolved.title)}
          description={text(section?.description, resolved.description)}
          href={def.path}
          linkLabel="See how it works"
        />
        <StepsGrid steps={steps} />
      </div>
    </section>
  );
}
