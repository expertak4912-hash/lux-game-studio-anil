import { ArrowUpRight } from "lucide-react";
import { CmsLink } from "./CmsLink";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { sportImage, text, useSection, useSports } from "@/lib/cms-content";

export function SportsSection() {
  const sports = useSports();
  const section = useSection("sports");

  if (sports.length === 0) return null;

  return (
    <section id="sports" className="section-shell py-20 lg:py-28">
      <SectionHeading
        eyebrow={text(section?.name, "Sports Hub")}
        title={text(section?.heading, "Premium coverage across the sports you follow")}
        description={text(
          section?.description,
          "Browse each discipline in a layout built for match days, with clear structure on phones and full detail on larger screens.",
        )}
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport, i) => (
          <Reveal as="li" key={sport.id} delay={i * 90} className="group">
            <article className="glass-card relative h-full overflow-hidden rounded-3xl transition-all duration-500 group-hover:-translate-y-1.5 group-hover:neon-gold">
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={sportImage(sport.slug, sport.image_url)}
                  alt={`${sport.name} category artwork`}
                  loading="lazy"
                  width={900}
                  height={640}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent"
                />
              </div>
              <div className="space-y-3 p-6">
                <h3 className="font-display text-xl font-bold">{sport.name}</h3>
                {sport.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {sport.description}
                  </p>
                )}
                <CmsLink
                  url={sport.url || `/sports/${sport.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                >
                  Explore
                  <ArrowUpRight className="size-4" />
                </CmsLink>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
