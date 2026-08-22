import { Gauge, Smartphone, Headset, ShieldCheck } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { text, useSection } from "@/lib/cms-content";

const FEATURES = [
  {
    icon: Gauge,
    title: "Fast Experience",
    body: "A clean and responsive interface designed for smooth navigation.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    body: "A seamless experience across smartphones, tablets and desktop devices.",
  },
  {
    icon: Headset,
    title: "Customer Support",
    body: "Easy access to customer assistance through available support channels.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible Gaming",
    body: "Promote responsible and informed participation.",
  },
];

export function FeaturesSection() {
  const section = useSection("why_us");

  if (section?.enabled === false) return null;

  return (
    <section className="section-shell py-20 lg:py-28">
      <SectionHeading
        eyebrow={text(section?.name, "Built For You")}
        title={text(section?.heading, "Designed around the details that matter")}
        description={text(
          section?.description,
          "Four principles shape every screen on the platform, from the first tap to the last.",
        )}
      />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <Reveal as="li" key={feature.title} delay={i * 90} className="group">
            <div className="glass-card h-full rounded-3xl p-7 transition-all duration-500 group-hover:-translate-y-2 group-hover:neon-gold">
              <span className="grid size-12 place-items-center rounded-2xl border border-primary/40 bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
                <feature.icon className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
