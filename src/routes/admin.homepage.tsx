import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/homepage")({
  component: () => (
    <ResourceManager
      title="Homepage Sections"
      description="Turn sections on or off, edit their text, and reorder them."
      table="homepage_sections"
      singularName="section"
      listColumns={[
        { name: "name", label: "Section" },
        { name: "heading", label: "Heading" },
      ]}
      fields={[
        { name: "name", label: "Section name" },
        { name: "enabled", label: "Enabled", type: "switch" },
        { name: "heading", label: "Heading", full: true },
        { name: "description", label: "Description", type: "textarea", full: true },
        { name: "image_url", label: "Image", type: "image" },
        { name: "button_text", label: "Button text" },
        { name: "button_url", label: "Button link" },
        { name: "sort_order", label: "Order", type: "number" },
      ]}
    />
  ),
});
