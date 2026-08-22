import { ArrowUpRight } from "lucide-react";
import { CmsLink } from "./CmsLink";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ResponsiveImage } from "./ResponsiveImage";
import { gameImage, text, useGames, useSection } from "@/lib/cms-content";

export function GamesSection({
  title,
  eyebrow,
  description,
}: {
  title?: string;
  eyebrow?: string;
  description?: string;
}) {
  const games = useGames();
  const section = useSection("games");

  if (games.length === 0) return null;

  return (
    <section id="casino" className="relative isolate overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--brand-green)_10%,transparent),transparent_65%)]"
      />
      <div className="section-shell">
        <SectionHeading
          eyebrow={eyebrow ?? text(section?.name, "Casino & Games")}
          title={title ?? text(section?.heading, "Casino & games, presented with clarity")}
          description={
            description ??
            text(
              section?.description,
              "A curated gaming grid with a consistent card language, so every title is easy to scan and compare.",
            )
          }
        />

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game, i) => (
            <Reveal as="li" key={game.id} delay={i * 70} className="group">
              <article className="glass-card relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 group-hover:-translate-y-2 group-hover:neon-green">
                <div className="relative aspect-square overflow-hidden">
                  <ResponsiveImage
                    src={gameImage(game.slug, game.featured_image)}
                    mobileSrc={game.featured_image_mobile}
                    alt={`${game.name} game artwork`}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent"
                  />
                  {game.tag && (
                    <span className="absolute top-3 left-3 rounded-full border border-primary/40 bg-background/70 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-primary uppercase backdrop-blur-md">
                      {game.tag}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <h3 className="font-display text-lg font-bold">{game.name}</h3>
                  {game.short_description && (
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      {game.short_description}
                    </p>
                  )}
                  <CmsLink
                    url={`/games/${game.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-primary"
                  >
                    {game.button_text || "Explore"}
                    <ArrowUpRight className="size-4" />
                  </CmsLink>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
