import { Check, Gauge, Headset, ShieldCheck, Smartphone, Sparkles, Zap } from "lucide-react";
import { Reveal } from "./Reveal";
import type { FeatureItem, StepItem } from "@/lib/site-pages";

/**
 * The card renderers shared by the homepage sections and the dedicated pages behind them.
 *
 * Both surfaces read the same `items` value, so rewording a step in Admin → Site Pages changes
 * the homepage and `/how-it-works` together instead of letting the two drift apart.
 */

/** Icon names an admin may type into a Built For You item. Unknown names fall back to Sparkles. */
export const FEATURE_ICONS = {
  gauge: Gauge,
  smartphone: Smartphone,
  headset: Headset,
  shield: ShieldCheck,
  zap: Zap,
  sparkles: Sparkles,
} as const;

export const FEATURE_ICON_NAMES = Object.keys(FEATURE_ICONS);

const iconFor = (name: string) =>
  FEATURE_ICONS[name.toLowerCase() as keyof typeof FEATURE_ICONS] ?? Sparkles;

/** Numbered How It Works cards. The number is positional, so reordering renumbers automatically. */
export function StepsGrid({ steps }: { steps: StepItem[] }) {
  return (
    <ol className="mt-12 grid gap-6 lg:grid-cols-3">
      {steps.map((step, i) => {
        const n = String(i + 1).padStart(2, "0");
        return (
          <Reveal as="li" key={`${n}-${step.title}`} delay={i * 120} className="group">
            <div className="glass-card relative h-full overflow-hidden rounded-3xl p-8 transition-all duration-500 group-hover:-translate-y-2 group-hover:neon-green">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 right-3 font-display text-7xl font-extrabold text-primary/15 transition-colors duration-500 group-hover:text-primary/25 sm:text-8xl"
              >
                {n}
              </span>
              <p className="font-display text-sm font-bold tracking-[0.3em] text-accent">{n}</p>
              <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
              {step.body && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              )}
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}

/** Built For You icon cards. */
export function FeatureGrid({ features }: { features: FeatureItem[] }) {
  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, i) => {
        const Icon = iconFor(feature.icon);
        return (
          <Reveal as="li" key={feature.title} delay={i * 90} className="group">
            <div className="glass-card h-full rounded-3xl p-7 transition-all duration-500 group-hover:-translate-y-2 group-hover:neon-gold">
              <span className="grid size-12 place-items-center rounded-2xl border border-primary/40 bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{feature.title}</h3>
              {feature.body && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              )}
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

/** The ticked list used by the About section and the About page. */
export function Checklist({ points, className }: { points: string[]; className?: string }) {
  return (
    <ul className={className ?? "grid gap-3"}>
      {points.map((point) => (
        <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-accent/50 text-accent">
            <Check className="size-3" />
          </span>
          {point}
        </li>
      ))}
    </ul>
  );
}
