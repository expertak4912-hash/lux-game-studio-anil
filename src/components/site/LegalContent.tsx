import { Reveal } from "./Reveal";

export type LegalBlock = { heading: string; paragraphs: string[]; bullets?: string[] };

export function LegalContent({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <section className="section-shell py-16 lg:py-24">
      <div className="mx-auto grid max-w-3xl gap-6">
        {blocks.map((block, i) => (
          <Reveal key={block.heading} delay={i * 60}>
            <article className="glass-card rounded-3xl p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold sm:text-2xl">{block.heading}</h2>
              {block.paragraphs.map((p) => (
                <p key={p} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
              {block.bullets && (
                <ul className="mt-4 grid gap-2">
                  {block.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
