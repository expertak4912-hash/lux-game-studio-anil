import { ArrowUpRight } from "lucide-react";
import { CmsLink } from "./CmsLink";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { text, usePromotions, useSection } from "@/lib/cms-content";

/**
 * Renders Admin -> Promotions. Hidden entirely when the section is disabled in
 * Admin -> Sections, or when no promotion is currently running.
 */
export function PromotionsSection() {
  const promotions = usePromotions();
  const section = useSection("promotions");

  if (section?.enabled === false) return null;

  // Respect the scheduling window when one is set; an empty date means "always on".
  const today = new Date().toISOString().slice(0, 10);
  const live = promotions.filter((promo) => {
    const startsOk = !promo.start_date || promo.start_date.slice(0, 10) <= today;
    const endsOk = !promo.end_date || promo.end_date.slice(0, 10) >= today;
    return startsOk && endsOk;
  });

  if (live.length === 0) return null;

  return (
    <section id="promotions" className="section-shell py-20 lg:py-28">
      <SectionHeading
        eyebrow={text(section?.name, "Promotions")}
        title={text(section?.heading, "Promotions")}
        description={text(section?.description, "Current featured content.")}
      />

      <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {live.map((promo, i) => (
          <Reveal as="li" key={promo.id} delay={i * 70} className="group">
            <article className="glass-card flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 group-hover:-translate-y-2">
              {promo.image_url && (
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={promo.image_url}
                    alt={promo.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2.5 p-5">
                <h3 className="font-display text-lg font-bold">{promo.title}</h3>
                {promo.short_description && (
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {promo.short_description}
                  </p>
                )}
                {promo.button_url && (
                  <CmsLink
                    url={promo.button_url}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-primary"
                  >
                    {promo.button_text || "Learn More"}
                    <ArrowUpRight className="size-4" />
                  </CmsLink>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
