import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/promotions")({
  component: () => (
    <ResourceManager
      title="Promotions"
      description="Informational promotional cards. No winnings or payout claims."
      table="promotions"
      singularName="promotion"
      listColumns={[{ name: "title", label: "Title" }]}
      defaults={{ status: "published" }}
      fields={[
        { name: "title", label: "Title", full: true },
        { name: "short_description", label: "Description", type: "textarea", full: true },
        { name: "image_url", label: "Image", type: "image" },
        { name: "button_text", label: "Button text" },
        { name: "button_url", label: "Button link" },
        { name: "start_date", label: "Start date", type: "date" },
        { name: "end_date", label: "End date", type: "date" },
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
