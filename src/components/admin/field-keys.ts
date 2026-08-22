import type { Field } from "./fields";

/**
 * The companion key that stores the mobile upload for an image field.
 *
 * Every image field `x` is paired with `x_mobile` in the same document. The site loads the mobile
 * file below 768px and falls back to the desktop file when the mobile slot is empty, so rows saved
 * before this existed keep working untouched.
 */
export const mobileFieldName = (name: string) => `${name}_mobile`;

/** True when this field should show the second (mobile) uploader. */
export const hasMobileSlot = (field: Field) => field.type === "image" && field.mobile !== false;

/** Every document key a field config writes to, including the `_mobile` companions. */
export const fieldNames = (fields: Field[]): string[] =>
  fields.flatMap((f) => (hasMobileSlot(f) ? [f.name, mobileFieldName(f.name)] : [f.name]));
