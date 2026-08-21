import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/seo")({
  component: () => (
    <ResourceManager
      title="SEO"
      description="Per-URL titles and meta descriptions."
      table="seo_settings"
      singularName="entry"
      reorder={false}
      order="path"
      listColumns={[
        { name: "path", label: "Path" },
        { name: "seo_title", label: "Title" },
      ]}
      fields={[
        { name: "path", label: "Path (e.g. /sports)" },
        { name: "seo_title", label: "SEO title" },
        { name: "meta_description", label: "Meta description", type: "textarea", full: true },
        { name: "keywords", label: "Keywords" },
        { name: "canonical_url", label: "Canonical URL" },
        { name: "og_image", label: "Social image", type: "image" },
      ]}
    />
  ),
});
