import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useWhatsAppLink } from "@/lib/cms-content";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  size?: "default" | "lg" | "xl" | "sm";
  variant?: "neon" | "gold" | "glass";
  className?: string;
};

export function WhatsAppButton({
  label = "WhatsApp Support",
  size = "default",
  variant = "neon",
  className,
}: Props) {
  const link = useWhatsAppLink();
  return (
    <Button asChild variant={variant} size={size} className={cn(className)}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="size-4" />
        {label}
      </a>
    </Button>
  );
}
