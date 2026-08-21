/**
 * Minimal HTML sanitizer for admin-authored rich text.
 *
 * SCOPE: this is defence in depth, not a general-purpose sanitizer. The content it processes comes
 * from the admin rich-text editor, which only signed-in staff can reach — visitors can never write
 * to these fields. What this guards against is a compromised or careless editor account pasting
 * markup that would otherwise run script on every visitor's page.
 *
 * It works by removing dangerous elements wholesale, then dropping any element or attribute that
 * is not on the allowlist. If the CMS ever accepts untrusted input, replace this with a real
 * parser-based sanitizer (DOMPurify server-side, or `sanitize-html`).
 *
 * Runs identically on the server (SSR) and in the browser, so it does not depend on the DOM.
 */

/** Tags the editor toolbar can produce, plus the structural ones it nests inside. */
const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "em",
  "h2",
  "h3",
  "h4",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "u",
  "ul",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
};

/** Elements whose entire contents must go, not just the tag. */
const VOID_THE_CONTENT = /<(script|style|iframe|object|embed|noscript|template)\b[\s\S]*?<\/\1>/gi;

/** Same elements when left unclosed. */
const DANGEROUS_OPEN_TAG = /<\/?(script|style|iframe|object|embed|noscript|template)\b[^>]*>/gi;

/** A URL scheme that can execute. */
const UNSAFE_URL = /^\s*(javascript|data|vbscript):/i;

function sanitizeAttributes(tag: string, rawAttrs: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed) return "";

  const kept: string[] = [];
  const attrPattern = /([a-zA-Z-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;

  let match: RegExpExecArray | null;
  while ((match = attrPattern.exec(rawAttrs)) !== null) {
    const name = match[1]!.toLowerCase();
    if (!allowed.has(name)) continue;

    const value = match[2]!.replace(/^["']|["']$/g, "");

    // Never emit a link that can execute.
    if (name === "href" && UNSAFE_URL.test(value)) continue;

    kept.push(`${name}="${escapeAttr(value)}"`);
  }

  // Any link opening a new tab must not hand the opener over to the destination.
  if (tag === "a" && kept.some((a) => a.startsWith('target="_blank"'))) {
    if (!kept.some((a) => a.startsWith("rel="))) kept.push('rel="noopener noreferrer"');
  }

  return kept.length > 0 ? ` ${kept.join(" ")}` : "";
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function sanitizeHtml(input: string): string {
  if (!input) return "";

  return (
    input
      // 1. Drop dangerous elements together with everything inside them.
      .replace(VOID_THE_CONTENT, "")
      .replace(DANGEROUS_OPEN_TAG, "")
      // 2. Rebuild every remaining tag from the allowlist, discarding the rest.
      //    Inline event handlers (onclick=...) never survive, because only the attributes named
      //    in ALLOWED_ATTRS are re-emitted.
      .replace(
        /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
        (_full, closing: string, rawTag: string, attrs: string) => {
          const tag = rawTag.toLowerCase();
          if (!ALLOWED_TAGS.has(tag)) return "";
          if (closing) return `</${tag}>`;
          return `<${tag}${sanitizeAttributes(tag, attrs)}>`;
        },
      )
  );
}
