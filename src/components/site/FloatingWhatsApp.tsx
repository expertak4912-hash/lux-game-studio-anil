import { WhatsAppIcon } from "./WhatsAppIcon";
import { useBrand, useWhatsAppLink } from "@/lib/cms-content";

export function FloatingWhatsApp() {
  const link = useWhatsAppLink();
  const brand = useBrand();
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${brand} support on WhatsApp`}
      className="fixed right-4 bottom-4 z-[100] flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-green)] transition-transform duration-300 animate-glow-pulse hover:scale-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none sm:right-6 sm:bottom-6 sm:size-16"
    >
      <WhatsAppIcon className="size-7 sm:size-8" />
    </a>
  );
}
