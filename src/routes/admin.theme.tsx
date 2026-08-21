import { createFileRoute } from "@tanstack/react-router";
import { SettingsForm } from "@/components/admin/SettingsForm";

const FONTS = [
  "Sora",
  "Manrope",
  "Inter",
  "Poppins",
  "Outfit",
  "Space Grotesk",
  "Playfair Display",
  "Bebas Neue",
  "Rubik",
  "Oswald",
].map((f) => ({ label: f, value: f }));

export const Route = createFileRoute("/admin/theme")({
  component: () => (
    <SettingsForm
      title="Theme"
      description="Colours, fonts and shapes for the whole public website."
      table="theme_settings"
      fields={[
        { name: "primary_color", label: "Primary colour", type: "color" },
        { name: "secondary_color", label: "Secondary colour", type: "color" },
        { name: "accent_color", label: "Accent colour", type: "color" },
        { name: "button_color", label: "Button colour", type: "color" },
        { name: "button_text_color", label: "Button text colour", type: "color" },
        { name: "header_color", label: "Header colour", type: "color" },
        { name: "footer_color", label: "Footer colour", type: "color" },
        { name: "card_color", label: "Card colour", type: "color" },
        { name: "background_color", label: "Background colour", type: "color" },
        { name: "text_color", label: "Body text colour", type: "color" },
        { name: "heading_color", label: "Heading colour", type: "color" },
        { name: "heading_font", label: "Heading font", type: "select", options: FONTS },
        { name: "body_font", label: "Body font", type: "select", options: FONTS },
        {
          name: "border_radius",
          label: "Border radius",
          type: "select",
          options: [
            { label: "None", value: "0px" },
            { label: "Small", value: "0.5rem" },
            { label: "Medium", value: "1rem" },
            { label: "Large", value: "1.5rem" },
          ],
        },
        {
          name: "button_style",
          label: "Button style",
          type: "select",
          options: [
            { label: "Rounded", value: "rounded" },
            { label: "Pill", value: "pill" },
            { label: "Square", value: "square" },
          ],
        },
        {
          name: "card_style",
          label: "Card style",
          type: "select",
          options: [
            { label: "Glass", value: "glass" },
            { label: "Solid", value: "solid" },
            { label: "Outline", value: "outline" },
          ],
        },
      ]}
    />
  ),
});
