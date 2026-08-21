import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";
import { CmsLink } from "./CmsLink";
import {
  parseLinks,
  text,
  useBrand,
  useFooterSettings,
  useNavigation,
  useSiteSettings,
} from "@/lib/cms-content";
import { LEGAL_LINKS, NAV_LINKS } from "@/lib/site";

export function Footer() {
  const footer = useFooterSettings();
  const site = useSiteSettings();
  const brand = useBrand();
  const cmsNav = useNavigation();

  const quickLinks = (() => {
    const fromCms = parseLinks(footer?.footer_links);
    if (fromCms.length > 0) return fromCms;
    if (cmsNav.length > 0) return cmsNav.map((n) => ({ label: n.label, url: n.url }));
    return NAV_LINKS.map((n) => ({ label: n.label, url: n.to as string }));
  })();

  const legalLinks = (() => {
    const fromCms = parseLinks(footer?.legal_links);
    return fromCms.length > 0
      ? fromCms
      : LEGAL_LINKS.map((n) => ({ label: n.label, url: n.to as string }));
  })();

  const socialLinks = (() => {
    const fromFooter = parseLinks(footer?.social_links);
    return fromFooter.length > 0 ? fromFooter : parseLinks(site?.social_links);
  })();

  const description = text(
    footer?.description,
    `${brand} is a modern sports and gaming entertainment platform built for clear navigation, fast browsing and a consistent experience on every device.`,
  );

  const copyright = text(
    footer?.copyright_text || site?.copyright_text,
    `© ${new Date().getFullYear()} ${brand}. All rights reserved.`,
  );

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
          {footer?.contact_info && (
            <p className="max-w-xs text-sm whitespace-pre-line text-muted-foreground">
              {footer.contact_info}
            </p>
          )}
          <WhatsAppButton label="WhatsApp Support" size="sm" className="h-9 px-4 text-xs" />
        </div>

        <nav aria-label="Quick links" className="space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <CmsLink
                  url={link.url}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </CmsLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal" className="space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Legal</h3>
          <ul className="space-y-2.5">
            {legalLinks.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <CmsLink
                  url={link.url}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </CmsLink>
              </li>
            ))}
          </ul>
          {socialLinks.length > 0 && (
            <ul className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map((link) => (
                <li key={`s-${link.label}-${link.url}`}>
                  <CmsLink
                    url={link.url}
                    className="text-xs font-semibold tracking-wide text-accent uppercase transition-colors hover:text-primary"
                  >
                    {link.label}
                  </CmsLink>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
            Play Responsibly
          </h3>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-accent/50 font-display text-xs font-bold text-accent">
              18+
            </span>
            <span>
              Access is restricted to adults of legal age in jurisdictions where this service is
              permitted.
            </span>
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Gaming is entertainment, not a source of income. Set your own time and spending limits,
            take regular breaks, and seek independent support if participation stops feeling
            enjoyable. Availability of any feature depends on local law and licensing.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="section-shell flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <p>Where legally permitted and appropriately licensed. No guaranteed outcomes.</p>
        </div>
      </div>
    </footer>
  );
}
