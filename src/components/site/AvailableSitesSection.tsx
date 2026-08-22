import { ArrowUpRight } from "lucide-react";
import { CmsLink } from "./CmsLink";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ResponsiveImage } from "./ResponsiveImage";
import { text, useAvailableSites, useSection } from "@/lib/cms-content";

/** Renders Admin -> Available Sites. */
export function AvailableSitesSection() {
  const sites = useAvailableSites();
  const section = useSection("available_sites");

  if (section?.enabled === false || sites.length === 0) return null;

  return (
    <section id="available-sites" className="relative isolate overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--brand-green)_8%,transparent),transparent_65%)]"
      />
      <div className="section-shell">
        <SectionHeading
          eyebrow={text(section?.name, "Available Sites")}
          title={text(section?.heading, "Available Sites")}
          description={text(section?.description, "Demo platforms you can explore.")}
        />

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site, i) => (
            <Reveal as="li" key={site.id} delay={i * 70} className="group">
              <article className="glass-card flex h-full flex-col gap-3 rounded-3xl p-6 transition-all duration-500 group-hover:-translate-y-2">
                <div className="flex items-center gap-3">
                  <ResponsiveImage
                    src={site.logo_url}
                    mobileSrc={site.logo_url_mobile}
                    alt=""
                    loading="lazy"
                    className="size-11 rounded-xl border border-border object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-bold">{site.name}</h3>
                    {site.category && (
                      <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-primary uppercase">
                        {site.category}
                      </span>
                    )}
                  </div>
                </div>

                {site.description && (
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {site.description}
                  </p>
                )}

                {site.button_url && (
                  <CmsLink
                    url={site.button_url}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-primary"
                  >
                    {site.button_text || "Learn More"}
                    <ArrowUpRight className="size-4" />
                  </CmsLink>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
