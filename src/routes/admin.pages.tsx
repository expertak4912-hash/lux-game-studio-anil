import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/pages")({
  component: () => (
    <ResourceManager
      title="Pages"
      description="Create any page with its own URL, for example /cricket."
      table="pages"
      singularName="page"
      slugFrom="title"
      listColumns={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
      ]}
      defaults={{ status: "draft", sort_order: 0 }}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "sort_order", label: "Order", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Published", value: "published" },
            { label: "Draft", value: "draft" },
          ],
        },
        { name: "short_description", label: "Short description", type: "textarea", full: true },
        {
          name: "featured_image",
          label: "Featured image",
          type: "image",
          desktopSize: "1200 x 675",
          mobileSize: "800 x 450",
        },
        {
          name: "background_image",
          label: "Background image",
          type: "image",
          desktopSize: "1920 x 1080",
          mobileSize: "800 x 1200",
        },
        { name: "content", label: "Content", type: "richtext" },
        { name: "seo_title", label: "SEO title" },
        { name: "seo_description", label: "Meta description", type: "textarea" },
        { name: "seo_keywords", label: "Keywords" },
        {
          name: "seo_image",
          label: "Social image",
          type: "image",
          desktopSize: "1200 x 630",
          mobile: false,
        },
      ]}
    />
  ),
});
