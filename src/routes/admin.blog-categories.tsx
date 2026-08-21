import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/blog-categories")({
  component: () => (
    <ResourceManager
      title="Blog Categories"
      table="blog_categories"
      singularName="category"
      slugFrom="name"
      listColumns={[
        { name: "name", label: "Name" },
        { name: "slug", label: "Slug" },
      ]}
      fields={[
        { name: "name", label: "Name" },
        { name: "slug", label: "Slug" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "description", label: "Description", type: "textarea", full: true },
      ]}
    />
  ),
});
