import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { LegalContent, type LegalBlock } from "@/components/site/LegalContent";

const title = "Terms & Conditions | Strike Arena";
const description =
  "The terms that govern use of the Strike Arena website, including eligibility, acceptable use, availability and limits of liability.";

const blocks: LegalBlock[] = [
  {
    heading: "Acceptance of these terms",
    paragraphs: [
      "By using this website you agree to these terms. If you do not agree with any part of them, please stop using the site.",
    ],
  },
  {
    heading: "Eligibility",
    paragraphs: [
      "You must be an adult of legal age in your jurisdiction and located somewhere this service is legally permitted. You are responsible for knowing and following the laws that apply to you.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: ["When using this website you agree not to:"],
    bullets: [
      "Provide false, misleading or third-party information during registration or contact.",
      "Attempt to disrupt, probe or gain unauthorised access to the site or its systems.",
      "Copy, resell or republish site content, branding or design without written permission.",
      "Use the site on behalf of anyone who is restricted from accessing it.",
    ],
  },
  {
    heading: "Availability and content",
    paragraphs: [
      "Features, categories and pages may change, be limited by region, or be withdrawn. Content on this site is provided for general information and entertainment; it is not advice and it makes no promise of any particular outcome.",
      "Any real-money gambling, payments, account systems, odds or promotional features are offered only where legally permitted and appropriately licensed.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "The Strike Arena name, logo, copy, layout and visual identity are original works belonging to the operator of this website and may not be used without permission.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, the operator is not liable for indirect or consequential loss arising from use of this website, including interruptions, inaccuracies or unavailability of any feature.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "These terms may be updated from time to time; the version published here is the current one. For questions, use the contact form or the WhatsApp support button.",
    ],
  },
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms & Conditions"
        title="The rules of using this site"
        description="Eligibility, acceptable use and the limits of what this website provides, written to be readable."
      />
      <LegalContent blocks={blocks} />
    </>
  );
}
