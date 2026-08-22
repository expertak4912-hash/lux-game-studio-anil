import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/available-sites")({
  component: () => (
    <ResourceManager
      title="Available Sites"
      table="available_sites"
      singularName="site"
      listColumns={[
        { name: "name", label: "Name" },
        { name: "category", label: "Category" },
      ]}
      defaults={{ status: "published" }}
      fields={[
        { name: "name", label: "Name" },
        { name: "category", label: "Category" },
        { name: "description", label: "Description", type: "textarea", full: true },
        {
          name: "logo_url",
          label: "Logo",
          type: "image",
          desktopSize: "256 x 256",
          mobileSize: "128 x 128",
        },
        {
          name: "image_url",
          label: "Cover image",
          type: "image",
          desktopSize: "1200 x 800",
          mobileSize: "800 x 600",
        },
        { name: "button_text", label: "Button text" },
        { name: "button_url", label: "Button link" },
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
      ]}
    />
  ),
});
