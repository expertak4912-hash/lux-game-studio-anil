import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";
import { CmsLink } from "./CmsLink";
import { useNavigation } from "@/lib/cms-content";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cmsNav = useNavigation();

  const links =
    cmsNav.length > 0
      ? cmsNav.map((item) => ({ label: item.label, url: item.url, newTab: item.new_tab }))
      : NAV_LINKS.map((item) => ({ label: item.label, url: item.to as string, newTab: false }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-md",
      )}
      style={{
        backgroundColor: scrolled
          ? undefined
          : "color-mix(in oklab, var(--cms-header, transparent) 55%, transparent)",
      }}
    >
      <div className="section-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 lg:py-4">
        <Logo />

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden xl:flex xl:items-center xl:gap-1">
            {links.map((link) => (
              <CmsLink
                key={`${link.label}-${link.url}`}
                url={link.url}
                newTab={link.newTab}
                activeProps={{ className: "text-primary" }}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </CmsLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <WhatsAppButton label="WhatsApp" size="sm" className="h-9 px-4 text-xs" />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-foreground/5 text-foreground transition-colors hover:border-primary/50 hover:text-primary xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl xl:hidden">
          <nav aria-label="Mobile" className="section-shell flex flex-col gap-1 py-4">
            {links.map((link) => (
              <CmsLink
                key={`m-${link.label}-${link.url}`}
                url={link.url}
                newTab={link.newTab}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-primary border-primary/40" }}
                className="rounded-xl border border-transparent px-4 py-3 text-base font-medium text-foreground/90 transition-colors hover:border-primary/30 hover:text-primary"
              >
                {link.label}
              </CmsLink>
            ))}
            <div className="mt-3 grid gap-2">
              <WhatsAppButton label="WhatsApp Support" size="lg" className="w-full" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
