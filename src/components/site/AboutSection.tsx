import aboutImage from "@/assets/about.jpg";
import { text, useSection, useSitePage } from "@/lib/cms-content";
import { Reveal } from "./Reveal";
import { ResponsiveImage } from "./ResponsiveImage";
import { Checklist } from "./SitePageBlocks";
import { CmsLink } from "./CmsLink";
import { ArrowRight } from "lucide-react";
import { parseChecklistItems, resolveSitePage, sitePageDef } from "@/lib/site-pages";

const def = sitePageDef("about")!;

/** Homepage teaser for `/about`. Heading and checklist are both admin-managed. */
export function AboutSection() {
  const section = useSection("about");
  const page = useSitePage(def.slug);

  if (section?.enabled === false) return null;

  const resolved = resolveSitePage(def, page);
  const points =
    parseChecklistItems(resolved.items) ?? parseChecklistItems(def.defaults.items) ?? [];

  return (
    <section id="about" className="section-shell py-20 lg:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl border border-border">
            <ResponsiveImage
              src={section?.image_url || resolved.image || aboutImage}
              mobileSrc={section?.image_url_mobile || resolved.imageMobile}
              alt="Dark luxury gaming lounge with gold trim and green accent lighting"
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

        <Reveal delay={120} className="space-y-6">
          <span className="eyebrow">{text(section?.name, def.defaults.eyebrow)}</span>
          <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">
            <CmsLink url={def.path} className="transition-colors hover:text-primary">
              {text(section?.heading, resolved.title)}
            </CmsLink>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {text(section?.description, resolved.description)}
          </p>
          <Checklist points={points} />
          <CmsLink
            url={def.path}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-primary"
          >
            Read more about us
            <ArrowRight className="size-4" />
          </CmsLink>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Any real-money features, payments or account systems are offered only where legally
            permitted and appropriately licensed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
