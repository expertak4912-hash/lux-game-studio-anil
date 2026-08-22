import type { ComponentPropsWithoutRef } from "react";

/**
 * Viewport width below which the mobile upload wins. Matches the `md` Tailwind breakpoint and
 * `useIsMobile`, so what the admin previews as "mobile view" is what phones actually load.
 */
export const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

type ImgProps = Omit<ComponentPropsWithoutRef<"img">, "src">;

/**
 * Renders the web/desktop upload on laptops and desktops and the mobile upload on phones.
 *
 * The switch is a `<picture>` element rather than a JS width check: the browser picks the source
 * before it fetches anything, so a phone never downloads the desktop file, and server rendering
 * and hydration agree on the markup. `display: contents` on the wrapper keeps the `<img>` a direct
 * layout child of whatever contains it, so `absolute inset-0`, `size-full` and `aspect-*` parents
 * behave exactly as they did before.
 *
 * When only one of the two files is set, both viewports get it — that is what makes every row
 * saved before the desktop/mobile split keep rendering.
 */
export function ResponsiveImage({
  src,
  mobileSrc,
  alt,
  ...rest
}: ImgProps & {
  src?: string | null | undefined;
  mobileSrc?: string | null | undefined;
  alt: string;
}) {
  const desktop = src || mobileSrc || "";
  const mobile = mobileSrc || "";

  if (!desktop) return null;

  if (!mobile || mobile === desktop) {
    return <img src={desktop} alt={alt} {...rest} />;
  }

  return (
    <picture className="contents">
      <source media={MOBILE_MEDIA_QUERY} srcSet={mobile} />
      <img src={desktop} alt={alt} {...rest} />
    </picture>
  );
}
