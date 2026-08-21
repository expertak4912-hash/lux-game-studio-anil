import { Check } from "lucide-react";
import aboutImage from "@/assets/about.jpg";
import { BRAND } from "@/lib/site";
import { Reveal } from "./Reveal";

const POINTS = [
  "Sports entertainment organised by competition and fixture",
  "Online gaming categories with consistent, readable card layouts",
  "User-friendly design with generous spacing and clear hierarchy",
  "Customer support through the channels published on this site",
  "Mobile accessibility from small phones to large desktops",
  "Responsible gaming guidance available on every page",
];

export function AboutSection() {
  return (
    <section id="about" className="section-shell py-20 lg:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl border border-border">
            <img
              src={aboutImage}
              alt="Dark luxury gaming lounge with gold trim and green accent lighting"
              loading="lazy"
              width={1024}
              height={1024}
              className="size-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-tr from-background/70 via-transparent to-transparent"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="space-y-6">
          <span className="eyebrow">About {BRAND}</span>
          <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">
            A premium home for sports and gaming entertainment
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {BRAND} brings sports coverage and gaming categories together in one calm, modern
            interface. Instead of crowded screens and flashing banners, the platform focuses on
            clear structure, honest descriptions and fast navigation, so you always know exactly
            where you are.
          </p>
          <ul className="grid gap-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-accent/50 text-accent">
                  <Check className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Any real-money features, payments or account systems are offered only where legally
            permitted and appropriately licensed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
