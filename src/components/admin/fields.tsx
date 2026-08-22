import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Link2,
  List,
  Loader2,
  Monitor,
  Smartphone,
  Upload,
  Heading2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/admin-db";
import { hasMobileSlot, mobileFieldName } from "./field-keys";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "number"
  | "switch"
  | "select"
  | "date"
  | "color"
  | "tags"
  | "json";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  help?: string;
  full?: boolean;
  /**
   * Recommended pixel size for the desktop/web upload, e.g. "1920 x 1080". Shown in the input
   * placeholder, beside the slot title and under the uploader.
   */
  desktopSize?: string;
  /** Recommended pixel size for the mobile upload. */
  mobileSize?: string;
  /**
   * Set to false on image fields that have no mobile variant — favicons and social/OG images,
   * which browsers and social networks render at one fixed size.
   */
  mobile?: boolean;
};

function UploadSlot({
  title,
  icon,
  size,
  value,
  onChange,
  previewClassName,
}: {
  title: string;
  icon: React.ReactNode;
  size?: string;
  value: string;
  onChange: (v: string) => void;
  previewClassName: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2 rounded-lg border border-border bg-background/40 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
        {icon}
        {title}
        {size && (
          <span className="ml-auto font-mono text-[0.65rem] normal-case text-muted-foreground">
            {size} px
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={size ? `${size} px — paste a URL or upload` : "https://... or upload"}
          className="min-w-0 flex-1"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            try {
              onChange(await uploadMedia(file, "uploads"));
              toast.success(`${title} image uploaded`);
            } catch (error) {
              toast.error((error as Error).message);
            } finally {
              setBusy(false);
              if (inputRef.current) inputRef.current.value = "";
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload
        </Button>
      </div>

      {size && (
        <p className="text-xs text-muted-foreground">
          Recommended size <strong className="font-semibold text-foreground">{size} px</strong> —
          JPG, PNG or WebP.
        </p>
      )}

      {value ? (
        <img
          src={value}
          alt={`${title} preview`}
          className={`rounded-md border border-border object-cover ${previewClassName}`}
        />
      ) : (
        <div
          className={`grid place-items-center rounded-md border border-dashed border-border text-center text-[0.65rem] text-muted-foreground ${previewClassName}`}
        >
          {size ? `${size} px` : "No image"}
        </div>
      )}
    </div>
  );
}

/**
 * Image picker with separate desktop and mobile uploads.
 *
 * The desktop file is what laptops and desktops load; the mobile file is what phones load.
 * Leaving the mobile slot empty is fine — the site falls back to the desktop file.
 */
export function ImageField({
  value,
  onChange,
  label,
  mobileValue,
  onMobileChange,
  desktopSize,
  mobileSize,
  help,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  /** Omit `onMobileChange` to render a single (desktop-only) uploader. */
  mobileValue?: string;
  onMobileChange?: (v: string) => void;
  desktopSize?: string;
  mobileSize?: string;
  help?: string;
}) {
  const showMobile = typeof onMobileChange === "function";

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className={showMobile ? "grid gap-3 md:grid-cols-2" : "grid gap-3"}>
        <UploadSlot
          title={showMobile ? "Web / Desktop view" : "Image"}
          icon={<Monitor className="size-3.5 text-primary" />}
          {...(desktopSize ? { size: desktopSize } : {})}
          value={value}
          onChange={onChange}
          previewClassName="h-24 w-40"
        />
        {showMobile && (
          <UploadSlot
            title="Mobile view"
            icon={<Smartphone className="size-3.5 text-accent" />}
            {...(mobileSize ? { size: mobileSize } : {})}
            value={mobileValue ?? ""}
            onChange={onMobileChange}
            previewClassName="h-32 w-24"
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {help ??
          (showMobile
            ? "Screens 768px and wider load the web image; phones load the mobile image. Leave the mobile slot empty to reuse the web image everywhere."
            : "Rendered at one fixed size by browsers and social networks, so it has no separate mobile version.")}
      </p>
    </div>
  );
}

function RichText({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cmd = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1 rounded-t-md border border-border bg-muted/40 p-1">
        <Button type="button" size="sm" variant="ghost" onClick={() => cmd("bold")}>
          <Bold className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => cmd("italic")}>
          <Italic className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => cmd("formatBlock", "<h2>")}>
          <Heading2 className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => cmd("insertUnorderedList")}>
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) cmd("createLink", url);
          }}
        >
          <Link2 className="size-4" />
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose-admin min-h-40 rounded-b-md border border-t-0 border-border bg-background p-3 text-sm focus-visible:outline-none"
      />
    </div>
  );
}

export function FieldInput({
  field,
  value,
  onChange,
  row,
  setField,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  /**
   * The whole record being edited. Only image fields need it, to read the `_mobile` companion
   * stored beside the field's own key.
   */
  row?: Record<string, unknown> | undefined;
  /** Writes any key on the record. Required for the mobile upload slot to save. */
  setField?: ((name: string, value: unknown) => void) | undefined;
}) {
  const type = field.type ?? "text";
  const str = value == null ? "" : String(value);

  if (type === "image") {
    const mobileKey = mobileFieldName(field.name);
    const setMobile = setField;
    const mobileEnabled = hasMobileSlot(field) && typeof setMobile === "function";
    return (
      <ImageField
        label={field.label}
        value={str}
        onChange={onChange}
        {...(field.desktopSize ? { desktopSize: field.desktopSize } : {})}
        {...(field.mobileSize ? { mobileSize: field.mobileSize } : {})}
        {...(field.help ? { help: field.help } : {})}
        {...(mobileEnabled && setMobile
          ? {
              mobileValue: row?.[mobileKey] == null ? "" : String(row[mobileKey]),
              onMobileChange: (v: string) => setMobile(mobileKey, v),
            }
          : {})}
      />
    );
  }
  if (type === "richtext") {
    return <RichText label={field.label} value={str} onChange={onChange} />;
  }
  if (type === "switch") {
    return (
      <div className="flex items-center justify-between rounded-md border border-border p-3">
        <Label>{field.label}</Label>
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }
  if (type === "select") {
    return (
      <div className="space-y-2">
        <Label>{field.label}</Label>
        <Select value={str} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  if (type === "textarea" || type === "json") {
    return (
      <div className="space-y-2">
        <Label>{field.label}</Label>
        <Textarea
          rows={type === "json" ? 6 : 4}
          value={
            type === "json" && typeof value === "object" ? JSON.stringify(value, null, 2) : str
          }
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      </div>
    );
  }
  if (type === "tags") {
    return (
      <div className="space-y-2">
        <Label>{field.label}</Label>
        <Input
          value={Array.isArray(value) ? value.join(", ") : str}
          placeholder="cricket, ipl, news"
          onChange={(e) =>
            onChange(
              e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      <Input
        type={
          type === "number"
            ? "number"
            : type === "date"
              ? "date"
              : type === "color"
                ? "color"
                : "text"
        }
        value={type === "date" ? str.slice(0, 10) : str}
        placeholder={field.placeholder}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}
