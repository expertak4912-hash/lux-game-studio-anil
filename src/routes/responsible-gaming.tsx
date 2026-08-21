import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { LegalContent, type LegalBlock } from "@/components/site/LegalContent";

const title = "Responsible Gaming — Stay In Control | Strike Arena";
const description =
  "Responsible gaming information from Strike Arena: age and eligibility rules, limit setting, warning signs and where to find independent support.";

const blocks: LegalBlock[] = [
  {
    heading: "Entertainment first",
    paragraphs: [
      "Gaming and sports entertainment should stay enjoyable. It is not a way to earn an income, recover losses or solve financial pressure, and outcomes can never be guaranteed.",
    ],
  },
  {
    heading: "Age and eligibility",
    paragraphs: [
      "Access is restricted to adults who meet the minimum legal age in their jurisdiction, which is 18 or higher depending on local law. Features are made available only where they are legally permitted and appropriately licensed.",
    ],
  },
  {
    heading: "Practical habits",
    paragraphs: ["A few simple habits keep participation in proportion:"],
    bullets: [
      "Decide your time and spending limits before you start.",
      "Treat any amount you use as the cost of entertainment.",
      "Take regular breaks and avoid long, unbroken sessions.",
      "Never participate while stressed, upset or under the influence.",
      "Do not try to win back money you have already used.",
    ],
  },
  {
    heading: "Signs to watch for",
    paragraphs: [
      "Consider pausing if you are spending more time or money than planned, hiding your activity from people close to you, borrowing to continue, or feeling anxious when you cannot participate.",
    ],
  },
  {
    heading: "Tools and support",
    paragraphs: [
      "Our support team can explain the limit, cool-off and self-exclusion options available in your region, and can point you toward independent, confidential help services. Contact us through the form or the WhatsApp button on any page.",
    ],
  },
];

export const Route = createFileRoute("/responsible-gaming")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/responsible-gaming" },
    ],
    links: [{ rel: "canonical", href: "/responsible-gaming" }],
  }),
  component: ResponsibleGamingPage,
});

function ResponsibleGamingPage() {
  return (
    <>
      <PageHero
        eyebrow="Responsible Gaming"
        title="Stay in control, always"
        description="Clear guidance on keeping participation informed, proportionate and enjoyable — plus how to get help if it stops being fun."
      />
      <LegalContent blocks={blocks} />
    </>
  );
}
