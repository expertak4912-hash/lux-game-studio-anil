import { SectionHeading } from "./SectionHeading";
import { ResponsiveImage } from "./ResponsiveImage";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  mobileImage,
}: {
  eyebrow: string;
  title: string;
  /** Optional: detail pages built from CMS rows often have no summary text. */
  description?: string;
  /** Optional CMS-managed background image, dimmed behind the heading. */
  image?: string;
  /** The phone upload for that background. Falls back to `image` when unset. */
  mobileImage?: string | null;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border py-16 sm:py-20 lg:py-24">
      {(image || mobileImage) && (
        <>
          <ResponsiveImage
            src={image}
            mobileSrc={mobileImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 size-full object-cover opacity-25"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background/60" />
        </>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_15%_0%,color-mix(in_oklab,var(--brand-gold)_14%,transparent),transparent_60%),radial-gradient(70%_110%_at_90%_10%,color-mix(in_oklab,var(--brand-green)_12%,transparent),transparent_60%)]"
      />
      <div className="section-shell animate-fade-up">
        <SectionHeading
          level={1}
          align="left"
          eyebrow={eyebrow}
          title={title}
          {...(description ? { description } : {})}
        />
      </div>
    </section>
  );
}
