import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { LegalContent, type LegalBlock } from "@/components/site/LegalContent";

const title = "Privacy Policy | Strike Arena";
const description =
  "How Strike Arena handles the information you submit through the contact form, including what is collected, why, and how to request changes.";

const blocks: LegalBlock[] = [
  {
    heading: "What this policy covers",
    paragraphs: [
      "This policy explains how information submitted through this website is handled. It applies to the contact form and to messages you start through the published WhatsApp support channel.",
    ],
  },
  {
    heading: "Information we collect",
    paragraphs: ["We only collect what you choose to send us:"],
    bullets: [
      "Your name, email address and optional phone number.",
      "The content of the message you submit.",
      "Basic technical information your browser sends with any web request.",
    ],
  },
  {
    heading: "How it is used",
    paragraphs: [
      "Contact details are used to answer your question and to keep a record of the conversation. We do not sell your information, and we do not use it for unrelated marketing without your consent.",
    ],
  },
  {
    heading: "Retention and security",
    paragraphs: [
      "Messages are kept only as long as needed to handle your request or to meet legal obligations. Reasonable technical and organisational measures are used to protect information in transit and at rest, though no method of transmission is completely secure.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      "You can ask us to correct or delete the details you have sent by contacting support. Please avoid sending sensitive information such as identity documents or payment data through the contact form.",
    ],
  },
];

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="Your information, handled carefully"
        description="A plain-language summary of what we collect through this website and how it is used."
      />
      <LegalContent blocks={blocks} />
    </>
  );
}
