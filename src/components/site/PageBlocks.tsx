import { CmsLink } from "./CmsLink";
import { CmsContent } from "./CmsContent";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import type { PageBlock } from "@/shared/types";

/**
 * Renders the blocks embedded on a CMS page.
 *
 * These were the `page_blocks` table under Postgres; in MongoDB they live inside the page
 * document, since they are only ever read with their page and deleted with it.
 *
 * An unknown `block_type` renders nothing rather than throwing, so adding a new type in the admin
 * before its renderer exists degrades quietly instead of breaking the page.
 */
export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  if (blocks.length === 0) return null;

  const ordered = [...blocks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <>
      {ordered.map((block, i) => (
        <Block key={block.id ?? i} block={block} index={i} />
      ))}
    </>
  );
}

function str(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

function Block({ block, index }: { block: PageBlock; index: number }) {
  const data = (block.data ?? {}) as Record<string, unknown>;

  switch (block.block_type) {
    case "heading":
      return (
        <section className="section-shell pt-16 lg:pt-24">
          <SectionHeading
            align="left"
            {...(str(data, "eyebrow") ? { eyebrow: str(data, "eyebrow") } : {})}
            title={str(data, "title")}
            {...(str(data, "description") ? { description: str(data, "description") } : {})}
          />
        </section>
      );

    case "text":
    case "richtext":
      return (
        <section className="section-shell py-10">
          <div className="mx-auto max-w-3xl">
            <Reveal delay={index * 60}>
              <article className="glass-card rounded-3xl p-6 sm:p-8">
                <CmsContent html={str(data, "content") || str(data, "html")} />
              </article>
            </Reveal>
          </div>
        </section>
      );

    case "image":
      return str(data, "url") ? (
        <section className="section-shell py-10">
          <Reveal delay={index * 60}>
            <figure className="glass-card overflow-hidden rounded-3xl">
              <img
                src={str(data, "url")}
                alt={str(data, "alt")}
                loading="lazy"
                className="size-full object-cover"
              />
              {str(data, "caption") && (
                <figcaption className="p-4 text-center text-xs text-muted-foreground">
                  {str(data, "caption")}
                </figcaption>
              )}
            </figure>
          </Reveal>
        </section>
      ) : null;

    case "cta":
      return (
        <section className="section-shell py-10">
          <Reveal delay={index * 60}>
            <div className="glass-card flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="font-display text-xl font-bold">{str(data, "title")}</h2>
                {str(data, "description") && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {str(data, "description")}
                  </p>
                )}
              </div>
              {str(data, "button_url") && (
                <Button asChild variant="gold" size="lg">
                  <CmsLink url={str(data, "button_url")}>
                    {str(data, "button_text") || "Learn More"}
                  </CmsLink>
                </Button>
              )}
            </div>
          </Reveal>
        </section>
      );

    default:
      return null;
  }
}
