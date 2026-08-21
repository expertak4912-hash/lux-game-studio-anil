import { sanitizeHtml } from "@/lib/sanitize-html";

/**
 * Renders the HTML produced by the admin rich-text editor (`fields.tsx` -> type "richtext").
 *
 * The content is authored by signed-in staff, not visitors, so this is not the primary trust
 * boundary — but it is still passed through `sanitizeHtml` so that a compromised or careless
 * editor account cannot inject script into every visitor's page.
 */
export function CmsContent({ html, className }: { html: string; className?: string }) {
  if (!html.trim()) return null;

  return (
    <div
      className={
        className ??
        "prose-cms max-w-none text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a:hover]:text-accent [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-5 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_strong]:text-foreground [&_ul]:mt-3"
      }
      // Sanitized directly above; see sanitizeHtml for the allowlist.
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
