import aboutImage from "@/assets/about.jpg";
import { PageHero } from "./PageHero";
import { CmsContent } from "./CmsContent";
import { LegalContent } from "./LegalContent";
import { ResponsiveImage } from "./ResponsiveImage";
import { Reveal } from "./Reveal";
import { Checklist, FeatureGrid, StepsGrid } from "./SitePageBlocks";
import { useSitePage } from "@/lib/cms-content";
import {
  parseChecklistItems,
  parseFeatureItems,
  parseLegalItems,
  parseStepItems,
  resolveSitePage,
  sitePageDef,
  type FeatureItem,
  type LegalItem,
  type StepItem,
} from "@/lib/site-pages";

/**
 * The body of one of the built-in pages (About, How It Works, Built For You and the legal pages).
 *
 * Everything on screen comes from `resolveSitePage`, which layers the CMS row from
 * Admin → Site Pages over the defaults in `site-pages.ts`. The route files stay thin: they own
 * only the loader and the `<head>` tags.
 */
export function SitePageView({ slug }: { slug: string }) {
  const def = sitePageDef(slug);
  const row = useSitePage(slug);

  // A slug with no definition is a programming error, not a 404 — the routes pass literals.
  if (!def) return null;

  const page = resolveSitePage(def, row);

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        {...(page.description ? { description: page.description } : {})}
        {...(page.backgroundImage ? { image: page.backgroundImage } : {})}
        mobileImage={page.backgroundImageMobile}
      />

      {page.content && (
        <section className="section-shell pt-16 lg:pt-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <article className="glass-card rounded-3xl p-6 sm:p-8">
                <CmsContent html={page.content} />
              </article>
            </Reveal>
          </div>
        </section>
      )}

      <PageItems
        layout={def.layout}
        items={page.items}
        fallback={def.defaults.items}
        image={page}
      />
    </>
  );
}

/**
 * Renders the structured cards for a page.
 *
 * `items` is free-form JSON typed by an admin, so each parser returns null on an unusable value
 * and the built-in copy renders instead — a malformed edit never blanks the page.
 */
function PageItems({
  layout,
  items,
  fallback,
  image,
}: {
  layout: string;
  items: unknown;
  fallback: unknown;
  image: { image: string | null; imageMobile: string | null };
}) {
  if (layout === "legal") {
    const blocks = parseLegalItems(items) ?? parseLegalItems(fallback) ?? [];
    return blocks.length > 0 ? <LegalContent blocks={blocks as LegalItem[]} /> : null;
  }

  if (layout === "steps") {
    const steps = parseStepItems(items) ?? parseStepItems(fallback) ?? [];
    return steps.length > 0 ? (
      <section className="section-shell py-16 lg:py-24">
        <StepsGrid steps={steps as StepItem[]} />
      </section>
    ) : null;
  }

  if (layout === "features") {
    const features = parseFeatureItems(items) ?? parseFeatureItems(fallback) ?? [];
    return features.length > 0 ? (
      <section className="section-shell py-16 lg:py-24">
        <FeatureGrid features={features as FeatureItem[]} />
      </section>
    ) : null;
  }

  const points = parseChecklistItems(items) ?? parseChecklistItems(fallback) ?? [];
  if (points.length === 0) return null;

  return (
    <section className="section-shell py-16 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl border border-border">
            <ResponsiveImage
              src={image.image || aboutImage}
              mobileSrc={image.imageMobile}
              alt=""
              loading="lazy"
              width={1024}
              height={1024}
              className="size-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-tr from-background/70 via-transparent to-transparent"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Checklist points={points} className="grid gap-4" />
        </Reveal>
      </div>
    </section>
  );
}
