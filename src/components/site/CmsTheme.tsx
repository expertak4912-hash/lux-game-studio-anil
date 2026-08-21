import type { ThemeSettings } from "@/lib/cms-queries";

const FONTS = [
  "Sora",
  "Manrope",
  "Inter",
  "Poppins",
  "Outfit",
  "Space Grotesk",
  "Playfair Display",
  "Bebas Neue",
  "Rubik",
  "Oswald",
];

function radiusFor(style: string, radius: string) {
  if (style === "pill") return "9999px";
  if (style === "square") return "0px";
  return radius;
}

/** Injects the admin-managed palette, fonts and radius as CSS variables. */
export function CmsTheme({ theme }: { theme: ThemeSettings | null }) {
  if (!theme) return null;
  const families = Array.from(
    new Set([theme.heading_font, theme.body_font, theme.font_family].filter(Boolean)),
  ).filter((f) => FONTS.includes(f as string));

  const href =
    families.length > 0
      ? `https://fonts.googleapis.com/css2?${families
          .map((f) => `family=${encodeURIComponent(String(f))}:wght@400;500;600;700;800`)
          .join("&")}&display=swap`
      : null;

  const css = `:root{
  --background:${theme.background_color};
  --foreground:${theme.text_color};
  --card:${theme.card_color};
  --card-foreground:${theme.text_color};
  --popover:${theme.card_color};
  --popover-foreground:${theme.text_color};
  --primary:${theme.primary_color};
  --primary-foreground:${theme.button_text_color};
  --secondary:${theme.secondary_color};
  --accent:${theme.accent_color};
  --accent-foreground:${theme.button_text_color};
  --brand-gold:${theme.primary_color};
  --brand-gold-deep:${theme.primary_color};
  --brand-green:${theme.accent_color};
  --brand-ink:${theme.background_color};
  --cms-header:${theme.header_color};
  --cms-footer:${theme.footer_color};
  --cms-heading:${theme.heading_color};
  --cms-button:${theme.button_color};
  --cms-button-text:${theme.button_text_color};
  --radius:${theme.border_radius};
  --cms-button-radius:${radiusFor(theme.button_style, theme.border_radius)};
  --font-display:"${theme.heading_font}",ui-sans-serif,system-ui,sans-serif;
  --font-sans:"${theme.body_font}",ui-sans-serif,system-ui,sans-serif;
}
h1,h2,h3{color:var(--cms-heading);}
body{font-family:var(--font-sans);}`;

  return (
    <>
      {href && <link rel="stylesheet" href={href} />}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
