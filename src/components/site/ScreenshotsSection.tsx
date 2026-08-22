import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ResponsiveImage } from "./ResponsiveImage";
import { text, useScreenshots, useSection } from "@/lib/cms-content";

/**
 * Renders Admin -> Screenshots. The `category` field splits the same collection between the two
 * The category field lets the payment screenshot gallery use the same admin collection as other
 * screenshot records.
 */
export function ScreenshotsSection({
  category,
  sectionSlug = "screenshots",
}: {
  category?: string;
  sectionSlug?: string;
}) {
  const screenshots = useScreenshots();
  const section = useSection(sectionSlug);

  if (section?.enabled === false) return null;

  const shown = category ? screenshots.filter((shot) => shot.category === category) : screenshots;

  if (shown.length === 0) return null;

  return (
    <section id={sectionSlug} className="section-shell py-20 lg:py-28">
      <SectionHeading
        eyebrow={text(section?.name, "Screenshots")}
        title={text(section?.heading, "Platform screens")}
        description={text(section?.description, "See how the platform looks.")}
      />

      <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((shot, i) => (
          <Reveal as="li" key={shot.id} delay={i * 60} className="group">
            <figure className="glass-card overflow-hidden rounded-2xl transition-all duration-500 group-hover:-translate-y-1.5">
              {(shot.image_url || shot.image_url_mobile) && (
                <div className="aspect-9/16 overflow-hidden">
                  <ResponsiveImage
                    src={shot.image_url}
                    mobileSrc={shot.image_url_mobile}
                    alt={shot.description || shot.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              )}
              <figcaption className="p-3 text-center text-xs font-semibold text-muted-foreground">
                {shot.title}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
