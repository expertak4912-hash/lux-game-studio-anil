import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  level = 2,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  level?: 1 | 2;
}) {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <div className={cn("max-w-2xl space-y-4", align === "center" && "mx-auto text-center")}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="text-3xl font-extrabold text-balance sm:text-4xl lg:text-5xl">{title}</Tag>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}
