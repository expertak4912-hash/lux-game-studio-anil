import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { CmsLink } from "./CmsLink";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  level = 2,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  level?: 1 | 2;
  /**
   * When set, the heading links to this page and a "read more" link is added below it. Used by
   * the homepage sections that have a dedicated page of their own.
   */
  href?: string;
  linkLabel?: string;
}) {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <div className={cn("max-w-2xl space-y-4", align === "center" && "mx-auto text-center")}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="text-3xl font-extrabold text-balance sm:text-4xl lg:text-5xl">
        {href ? (
          <CmsLink url={href} className="transition-colors hover:text-primary">
            {title}
          </CmsLink>
        ) : (
          title
        )}
      </Tag>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      )}
      {href && (
        <CmsLink
          url={href}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-primary",
            align === "center" && "justify-center",
          )}
        >
          {linkLabel ?? "Read more"}
          <ArrowRight className="size-4" />
        </CmsLink>
      )}
    </div>
  );
}
