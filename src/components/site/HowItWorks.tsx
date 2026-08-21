import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Create an Account",
    body: "Register with your details where the service is legally available, and confirm you meet the age and eligibility rules.",
  },
  {
    n: "02",
    title: "Explore Available Games",
    body: "Browse the sports hub and the gaming grid, then open any category to see what it offers.",
  },
  {
    n: "03",
    title: "Enjoy Responsibly",
    body: "Set your own limits, treat every session as entertainment, and reach support whenever you need help.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative isolate overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_80%_20%,color-mix(in_oklab,var(--brand-gold)_10%,transparent),transparent_65%)]"
      />
      <div className="section-shell">
        <SectionHeading
          eyebrow="How It Works"
          title="Three steps to get going"
          description="A short, transparent path from registration to responsible play."
        />
        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 120} className="group">
              <div className="glass-card relative h-full overflow-hidden rounded-3xl p-8 transition-all duration-500 group-hover:-translate-y-2 group-hover:neon-green">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-6 right-3 font-display text-7xl font-extrabold text-primary/15 transition-colors duration-500 group-hover:text-primary/25 sm:text-8xl"
                >
                  {step.n}
                </span>
                <p className="font-display text-sm font-bold tracking-[0.3em] text-accent">
                  {step.n}
                </p>
                <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
