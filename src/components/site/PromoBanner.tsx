import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function PromoBanner() {
  return (
    <section className="section-shell py-10 lg:py-16">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-4xl border border-primary/30 bg-card/60 px-6 py-14 text-center shadow-[var(--shadow-gold)] sm:px-12 lg:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_20%_10%,color-mix(in_oklab,var(--brand-gold)_18%,transparent),transparent_60%),radial-gradient(60%_110%_at_85%_90%,color-mix(in_oklab,var(--brand-green)_18%,transparent),transparent_60%)]"
          />
          <span className="eyebrow">Next Fixture, Next Table</span>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-extrabold text-balance sm:text-4xl lg:text-5xl">
            READY FOR THE <span className="text-gold">NEXT GAME?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore sports and gaming entertainment in one modern platform.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="gold" size="xl">
              <Link to="/games">GET STARTED</Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/responsible-gaming">Responsible Gaming</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            18+ only. Entertainment purposes. No guaranteed outcomes of any kind.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
