import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/sports")({
  component: () => (
    <ResourceManager
      title="Sports"
      description="Sports categories shown on the homepage and sports page."
      table="sports"
      singularName="sport"
      slugFrom="name"
      listColumns={[
        { name: "name", label: "Name" },
        { name: "slug", label: "Slug" },
      ]}
      defaults={{ status: "published", sort_order: 0 }}
      fields={[
        { name: "name", label: "Name" },
        { name: "slug", label: "Slug" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "url", label: "Custom link (optional)" },
        { name: "description", label: "Description", type: "textarea", full: true },
        { name: "image_url", label: "Card image", type: "image" },
        { name: "background_image", label: "Page background", type: "image" },
        { name: "content", label: "Detail page content", type: "richtext" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Published", value: "published" },
            { label: "Draft", value: "draft" },
          ],
        },
        { name: "seo_title", label: "SEO title" },
        { name: "seo_description", label: "Meta description", type: "textarea" },
        { name: "seo_image", label: "Social image", type: "image" },
      ]}
    />
  ),
});
