import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CmsContent } from "@/components/site/CmsContent";
import { PageBlocks } from "@/components/site/PageBlocks";
import { Reveal } from "@/components/site/Reveal";
import { gameBySlugQuery, pageBySlugQuery, sportBySlugQuery } from "@/lib/cms-queries";
import type { GameRow, PageRow, SportRow } from "@/shared/types";

/**
 * Catch-all for admin-managed URLs.
 *
 * Admin → Pages promises "create any page with its own URL, for example /cricket", and the seeded
 * navigation links to /cricket, /football and /tennis. Nothing rendered those before this route
 * existed. Static routes (/about, /games, /sports…) still win, because TanStack Router matches
 * literal segments ahead of dynamic ones.
 *
 * Resolution order: CMS page → sport → game → 404. Sports and games resolved here emit a
 * canonical link to their nested URL, so the two paths do not compete as duplicate content.
 */
type Resolved =
  | { kind: "page"; page: PageRow }
  | { kind: "sport"; sport: SportRow }
  | { kind: "game"; game: GameRow };

export const Route = createFileRoute("/$slug")({
  loader: async ({ context, params }): Promise<Resolved> => {
    const { slug } = params;

    const page = await context.queryClient.ensureQueryData(pageBySlugQuery(slug));
    if (page) return { kind: "page", page };

    const sport = await context.queryClient.ensureQueryData(sportBySlugQuery(slug));
    if (sport) return { kind: "sport", sport };

    const game = await context.queryClient.ensureQueryData(gameBySlugQuery(slug));
    if (game) return { kind: "game", game };

    throw notFound();
  },

  head: ({ loaderData, params }) => {
    if (!loaderData) return {};

    if (loaderData.kind === "page") {
      const { page } = loaderData;
      const title = page.seo_title || `${page.title} | Strike Arena`;
      const description = page.seo_description || page.short_description || "";
      return {
        meta: [
          { title },
          { name: "description", content: description },
          ...(page.seo_keywords ? [{ name: "keywords", content: page.seo_keywords }] : []),
          { property: "og:title", content: title },
          { property: "og:description", content: description },
          { property: "og:url", content: `/${page.slug}` },
          ...(page.seo_image ? [{ property: "og:image", content: page.seo_image }] : []),
        ],
        links: [{ rel: "canonical", href: page.canonical_url || `/${page.slug}` }],
      };
    }

    // Sport/game reached through a short link: canonical points at the nested route.
    const entity = loaderData.kind === "sport" ? loaderData.sport : loaderData.game;
    const prefix = loaderData.kind === "sport" ? "sports" : "games";
    const name = loaderData.kind === "sport" ? loaderData.sport.name : loaderData.game.name;

    return {
      meta: [{ title: entity.seo_title || `${name} | Strike Arena` }],
      links: [{ rel: "canonical", href: `/${prefix}/${params.slug}` }],
    };
  },

  component: CatchAllPage,
});

function CatchAllPage() {
  const resolved = Route.useLoaderData();

  if (resolved.kind === "sport") {
    const { sport } = resolved;
    return (
      <SimpleEntityPage
        eyebrow="Sports"
        title={sport.name}
        description={sport.description}
        image={sport.background_image ?? sport.image_url}
        content={sport.content}
      />
    );
  }

  if (resolved.kind === "game") {
    const { game } = resolved;
    return (
      <SimpleEntityPage
        eyebrow={game.tag || "Games"}
        title={game.name}
        description={game.short_description}
        image={game.background_image ?? game.featured_image}
        content={game.content}
      />
    );
  }

  const { page } = resolved;

  return (
    <>
      <PageHero
        eyebrow={page.short_description ? "Page" : "Strike Arena"}
        title={page.title}
        {...(page.short_description ? { description: page.short_description } : {})}
        {...(page.background_image ? { image: page.background_image } : {})}
      />

      {page.content && (
        <section className="section-shell py-16 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <article className="glass-card rounded-3xl p-6 sm:p-8">
                <CmsContent html={page.content} />
              </article>
            </Reveal>
          </div>
        </section>
      )}

      <PageBlocks blocks={page.blocks ?? []} />
    </>
  );
}

/** Shared body for a sport/game reached through its short URL. */
function SimpleEntityPage({
  eyebrow,
  title,
  description,
  image,
  content,
}: {
  eyebrow: string;
  title: string;
  description: string | null;
  image: string | null;
  content: string | null;
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        {...(description ? { description } : {})}
        {...(image ? { image } : {})}
      />
      {content && (
        <section className="section-shell py-16 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <article className="glass-card rounded-3xl p-6 sm:p-8">
                <CmsContent html={content} />
              </article>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
