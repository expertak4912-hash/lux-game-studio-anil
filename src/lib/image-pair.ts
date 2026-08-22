/** A web/desktop upload paired with its optional mobile upload. */
export type ImagePair = { src: string | null; mobileSrc: string | null };

/**
 * Picks the first pair that has at least one upload.
 *
 * Fallbacks must be chosen a pair at a time. Resolving the desktop and mobile slots
 * independently would let a row with only a desktop upload borrow its mobile image from the
 * *next* fallback — showing a page background on desktop and an unrelated card image on phones.
 */
export function pickImagePair(
  ...candidates: Array<[string | null | undefined, string | null | undefined]>
): ImagePair {
  for (const [src, mobileSrc] of candidates) {
    if (src || mobileSrc) return { src: src ?? null, mobileSrc: mobileSrc ?? null };
  }
  return { src: null, mobileSrc: null };
}
