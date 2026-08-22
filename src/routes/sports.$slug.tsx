import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CmsContent } from "@/components/site/CmsContent";
import { Reveal } from "@/components/site/Reveal";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";
import { sportBySlugQuery } from "@/lib/cms-queries";
import { sportImage } from "@/lib/cms-content";
import { pickImagePair } from "@/lib/image-pair";

export const Route = createFileRoute("/sports/$slug")({
  loader: async ({ context, params }) => {
    const sport = await context.queryClient.ensureQueryData(sportBySlugQuery(params.slug));
    if (!sport) throw notFound();
    return { sport };
  },
  head: ({ loaderData }) => {
    const sport = loaderData?.sport;
    if (!sport) return {};

    const title = sport.seo_title || `${sport.name} | Strike Arena`;
    const description = sport.seo_description || sport.description || "";
    const image = sport.seo_image || sport.image_url;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/sports/${sport.slug}` },
        ...(image ? [{ property: "og:image", content: image }] : []),
      ],
      // Canonical URL for this sport. The /$slug catch-all points here rather than competing.
      links: [{ rel: "canonical", href: `/sports/${sport.slug}` }],
    };
  },
  component: SportDetail,
});

function SportDetail() {
  const { sport } = Route.useLoaderData();

  const hero = pickImagePair(
    [sport.background_image, sport.background_image_mobile],
    [sportImage(sport.slug, sport.image_url), sport.image_url_mobile],
  );

  return (
    <>
      <PageHero
        eyebrow="Sports"
        title={sport.name}
        {...(sport.description ? { description: sport.description } : {})}
        {...(hero.src ? { image: hero.src } : {})}
        mobileImage={hero.mobileSrc}
      />

      <section className="section-shell py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/sports"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            All sports
          </Link>

          <Reveal>
            <article className="glass-card mt-6 overflow-hidden rounded-3xl">
              <div className="aspect-video overflow-hidden">
                <ResponsiveImage
                  src={sportImage(sport.slug, sport.image_url)}
                  mobileSrc={sport.image_url_mobile}
                  alt={`${sport.name} coverage`}
                  className="size-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold sm:text-2xl">About {sport.name}</h2>
                {sport.content ? (
                  <CmsContent html={sport.content} className="mt-4" />
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {sport.description ||
                      `Fixtures, schedules and coverage for ${sport.name}. Add richer copy in Admin → Sports.`}
                  </p>
                )}
              </div>
            </article>
          </Reveal>
        </div>
      </section>

    </>
  );
}
