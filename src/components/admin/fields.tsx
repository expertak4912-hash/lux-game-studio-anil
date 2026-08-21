import { useRef, useState } from "react";
import { Bold, Italic, Link2, List, Loader2, Upload, Heading2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/admin-db";
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
};

export function ImageField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload"
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
              toast.success("Image uploaded");
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
      {value && (
        <img
          src={value}
          alt="Selected media preview"
          className="h-24 w-40 rounded-md border border-border object-cover"
        />
      )}
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
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const type = field.type ?? "text";
  const str = value == null ? "" : String(value);

  if (type === "image") {
    return <ImageField label={field.label} value={str} onChange={onChange} />;
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
