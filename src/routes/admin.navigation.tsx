import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/navigation")({
  component: () => (
    <ResourceManager
      title="Navigation"
      description="Header menu links."
      table="navigation_items"
      singularName="link"
      listColumns={[
        { name: "label", label: "Label" },
        { name: "url", label: "URL" },
      ]}
      defaults={{ status: "published" }}
      fields={[
        { name: "label", label: "Label" },
        { name: "url", label: "URL" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "new_tab", label: "Open in new tab", type: "switch" },
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
