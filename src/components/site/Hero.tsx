import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./WhatsAppButton";
import { CmsLink } from "./CmsLink";
import { HERO_FALLBACK_IMAGE, useBackground, useHeroSlides, useSection } from "@/lib/cms-content";

const PARTICLES = [
  { left: "8%", top: "22%", size: 6, delay: 0 },
  { left: "22%", top: "68%", size: 4, delay: 1.2 },
  { left: "38%", top: "18%", size: 5, delay: 2.1 },
  { left: "57%", top: "74%", size: 3, delay: 0.6 },
  { left: "71%", top: "30%", size: 6, delay: 1.8 },
  { left: "86%", top: "58%", size: 4, delay: 2.6 },
  { left: "94%", top: "16%", size: 3, delay: 1.1 },
];

const DEFAULT_SLIDE = {
  title: "PLAY THE GAME. EXPERIENCE THE EXCITEMENT.",
  description:
    "Explore a modern sports and gaming entertainment platform designed for a smooth experience across desktop and mobile devices.",
  image_url: null as string | null,
  button_text: "Explore Games",
  button_url: "/games",
};

export function Hero() {
  const cmsSlides = useHeroSlides();
  const section = useSection("hero");
  const background = useBackground("home");

  const slides =
    cmsSlides.length > 0
      ? cmsSlides.map((s) => ({
          title: s.title,
          description: s.description,
          image_url: s.image_url,
          button_text: s.button_text,
          button_url: s.button_url,
        }))
      : [DEFAULT_SLIDE];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const slide = slides[Math.min(index, slides.length - 1)]!;
  const image = slide.image_url || background?.image || HERO_FALLBACK_IMAGE;

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
      <img
        key={image}
        src={image}
        alt={slide.title}
        width={1920}
        height={1088}
        className="absolute inset-0 -z-20 size-full object-cover animate-drift motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={
          background
            ? { backgroundColor: background.color, opacity: background.opacity }
            : undefined
        }
      />
      {!background && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(110%_80%_at_70%_35%,transparent,oklch(0.14_0.005_260/0.35)_55%,oklch(0.14_0.005_260/0.8))]"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-background/90 via-background/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-background to-transparent"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
            className="absolute rounded-full bg-primary/70 shadow-[0_0_14px_var(--brand-gold)] animate-float-y motion-reduce:animate-none"
          />
        ))}
      </div>

      <div className="section-shell py-24 lg:py-32">
        <div key={slide.title} className="max-w-3xl space-y-7 animate-fade-up">
          <span className="eyebrow">{section?.name ?? "Sports & Gaming Entertainment"}</span>
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
            {slide.title}
          </h1>
          {slide.description && (
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {slide.description}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {slide.button_text && slide.button_url && (
              <Button asChild variant="gold" size="xl">
                <CmsLink url={slide.button_url}>{slide.button_text}</CmsLink>
              </Button>
            )}
            <Button asChild variant="glass" size="xl">
              <Link to="/contact">Contact Support</Link>
            </Button>
            <WhatsAppButton label="WhatsApp" size="xl" />
          </div>

          {slides.length > 1 && (
            <div className="flex gap-2 pt-2">
              {slides.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === index}
                  className={
                    i === index
                      ? "h-1.5 w-8 rounded-full bg-primary"
                      : "h-1.5 w-4 rounded-full bg-foreground/25 transition-colors hover:bg-primary/60"
                  }
                />
              ))}
            </div>
          )}

          <p className="text-xs tracking-wide text-muted-foreground">
            18+ only. Available where legally permitted. Play responsibly.
          </p>
        </div>
      </div>
    </section>
  );
}
