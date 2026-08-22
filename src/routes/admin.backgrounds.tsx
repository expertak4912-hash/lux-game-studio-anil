import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/backgrounds")({
  component: () => (
    <ResourceManager
      title="Background Images"
      description="Background image and overlay for each main page."
      table="background_settings"
      singularName="background"
      reorder={false}
      order="label"
      listColumns={[
        { name: "label", label: "Area" },
        { name: "slug", label: "Key" },
      ]}
      fields={[
        { name: "label", label: "Area name" },
        { name: "slug", label: "Key" },
        {
          name: "image_url",
          label: "Background image",
          type: "image",
          desktopSize: "1920 x 1080",
          mobileSize: "800 x 1400",
        },
        { name: "overlay_color", label: "Overlay colour", type: "color" },
        { name: "overlay_opacity", label: "Overlay opacity (0-1)", type: "number" },
      ]}
    />
  ),
});
