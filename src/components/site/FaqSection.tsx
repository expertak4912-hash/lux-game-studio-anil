import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { text, useFaqs, useSection } from "@/lib/cms-content";

export function FaqSection() {
  const faqs = useFaqs();
  const section = useSection("faq");

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="section-shell py-20 lg:py-28">
      <SectionHeading
        eyebrow={text(section?.name, "FAQ")}
        title={text(section?.heading, "Questions, answered plainly")}
        description={text(
          section?.description,
          "Short, honest answers about what this platform offers and how to reach us.",
        )}
      />
      <Reveal className="mx-auto mt-12 max-w-3xl">
        <Accordion type="single" collapsible className="grid gap-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.id}
              value={`faq-${i}`}
              className="glass-card rounded-2xl border-b px-5 data-[state=open]:neon-gold"
            >
              <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline sm:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
