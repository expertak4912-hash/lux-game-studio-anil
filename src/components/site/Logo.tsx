import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/logo-mark.png";
import { useBrand, useSiteSettings } from "@/lib/cms-content";
import { ResponsiveImage } from "./ResponsiveImage";

export function Logo({ compact = false }: { compact?: boolean }) {
  const site = useSiteSettings();
  const brand = useBrand();
  const [first, ...rest] = brand.split(" ");
  const second = rest.join(" ");

  return (
    <Link to="/" className="group flex min-w-0 items-center gap-2.5" aria-label={`${brand} home`}>
      <ResponsiveImage
        src={site?.logo_url || logoMark}
        mobileSrc={site?.logo_url_mobile}
        alt={`${brand} emblem`}
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 object-contain drop-shadow-[0_0_14px_color-mix(in_oklab,var(--brand-gold)_45%,transparent)] transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10"
      />
      <span className="min-w-0 leading-none">
        <span className="block truncate font-display text-base font-extrabold tracking-[0.14em] text-gold sm:text-lg">
          {first}
        </span>
        {!compact && second && (
          <span className="block text-[0.6rem] font-semibold tracking-[0.42em] text-muted-foreground">
            {second}
          </span>
        )}
      </span>
    </Link>
  );
}
