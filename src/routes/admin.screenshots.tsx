import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/screenshots")({
  component: () => (
    <ResourceManager
      title="Screenshots"
      description="Demo or fictional screenshots only."
      table="screenshots"
      singularName="screenshot"
      listColumns={[
        { name: "title", label: "Title" },
        { name: "category", label: "Category" },
      ]}
      defaults={{ status: "published", category: "demo" }}
      fields={[
        { name: "title", label: "Title" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            { label: "Payment", value: "demo" },
          ],
        },
        {
          name: "image_url",
          label: "Screenshot",
          type: "image",
          desktopSize: "720 x 1280",
          mobileSize: "720 x 1280",
        },
        { name: "description", label: "Description", type: "textarea", full: true },
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
