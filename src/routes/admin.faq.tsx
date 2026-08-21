import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/faq")({
  component: () => (
    <ResourceManager
      title="FAQ"
      table="faq_items"
      singularName="question"
      listColumns={[{ name: "question", label: "Question" }]}
      defaults={{ status: "published", category: "general" }}
      fields={[
        { name: "question", label: "Question", full: true },
        { name: "answer", label: "Answer", type: "textarea", full: true },
        { name: "category", label: "Category" },
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
