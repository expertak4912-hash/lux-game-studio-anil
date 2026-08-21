import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ContactSection } from "@/components/site/ContactSection";

const title = "Contact Us — Support & WhatsApp | Strike Arena";
const description =
  "Contact Strike Arena support through the online form or WhatsApp. We reply only through the channels published on this website.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="We are here to help"
        description="Questions about a category, your account or responsible gaming tools? Send a message or start a WhatsApp chat."
      />
      <ContactSection />
    </>
  );
}
