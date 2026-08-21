import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/games")({
  component: () => (
    <ResourceManager
      title="Games"
      description="Each game gets its own page at /games/slug."
      table="games"
      singularName="game"
      slugFrom="name"
      listColumns={[
        { name: "name", label: "Name" },
        { name: "slug", label: "Slug" },
      ]}
      defaults={{ status: "published", sort_order: 0, button_text: "Learn More" }}
      fields={[
        { name: "name", label: "Name" },
        { name: "slug", label: "Slug" },
        { name: "tag", label: "Tag" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "short_description", label: "Short description", type: "textarea", full: true },
        { name: "featured_image", label: "Card image", type: "image" },
        { name: "background_image", label: "Page background", type: "image" },
        { name: "content", label: "Page content", type: "richtext" },
        { name: "button_text", label: "Button text" },
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
