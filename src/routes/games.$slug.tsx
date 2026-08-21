import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CmsContent } from "@/components/site/CmsContent";
import { Reveal } from "@/components/site/Reveal";
import { HowItWorks } from "@/components/site/HowItWorks";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { gameBySlugQuery } from "@/lib/cms-queries";
import { gameImage } from "@/lib/cms-content";

export const Route = createFileRoute("/games/$slug")({
  loader: async ({ context, params }) => {
    const game = await context.queryClient.ensureQueryData(gameBySlugQuery(params.slug));
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    const game = loaderData?.game;
    if (!game) return {};

    const title = game.seo_title || `${game.name} | Strike Arena`;
    const description = game.seo_description || game.short_description || "";
    const image = game.seo_image || game.featured_image;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/games/${game.slug}` },
        ...(image ? [{ property: "og:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: `/games/${game.slug}` }],
    };
  },
  component: GameDetail,
});

function GameDetail() {
  const { game } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow={game.tag || "Games"}
        title={game.name}
        {...(game.short_description ? { description: game.short_description } : {})}
        image={game.background_image ?? gameImage(game.slug, game.featured_image)}
      />

      <section className="section-shell py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            All games
          </Link>

          <Reveal>
            <article className="glass-card mt-6 overflow-hidden rounded-3xl">
              <div className="aspect-video overflow-hidden">
                <img
                  src={gameImage(game.slug, game.featured_image)}
                  alt={`${game.name} artwork`}
                  className="size-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold sm:text-2xl">
                  How {game.name} works
                </h2>
                {game.content ? (
                  <CmsContent html={game.content} className="mt-4" />
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {game.short_description ||
                      `Details for ${game.name}. Add richer copy in Admin → Games.`}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <WhatsAppButton label="Ask about this game" />
                </div>

                <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                  Availability of individual titles depends on your region and applicable licensing.
                  18+ only — play responsibly.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <HowItWorks />
    </>
  );
}
