import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Renders an admin-managed URL: internal paths use the router, external URLs a plain anchor.
 */
export function CmsLink({
  url,
  children,
  className,
  newTab,
  onClick,
  activeProps,
}: {
  url: string;
  children: ReactNode;
  className?: string;
  newTab?: boolean;
  onClick?: () => void;
  activeProps?: { className?: string };
}) {
  const external = /^(https?:|mailto:|tel:)/i.test(url);
  if (external || newTab) {
    return (
      <a
        href={url}
        className={className}
        onClick={onClick}
        {...(external || newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      to={url as never}
      className={className}
      onClick={onClick}
      activeOptions={{ exact: url === "/" }}
      {...(activeProps ? { activeProps } : {})}
    >
      {children}
    </Link>
  );
}
