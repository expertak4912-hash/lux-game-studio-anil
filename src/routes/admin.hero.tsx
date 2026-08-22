import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/hero")({
  component: () => (
    <ResourceManager
      title="Hero Slider"
      description="Slides shown at the top of the homepage."
      table="hero_slides"
      singularName="slide"
      listColumns={[{ name: "title", label: "Heading" }]}
      defaults={{ status: "published" }}
      fields={[
        { name: "title", label: "Heading", full: true },
        { name: "description", label: "Description", type: "textarea", full: true },
        {
          name: "image_url",
          label: "Slide background image",
          type: "image",
          desktopSize: "1920 x 1080",
          mobileSize: "800 x 1200",
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
