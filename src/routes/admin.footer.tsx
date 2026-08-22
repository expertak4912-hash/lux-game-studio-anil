import { createFileRoute } from "@tanstack/react-router";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const Route = createFileRoute("/admin/footer")({
  component: () => (
    <SettingsForm
      title="Footer"
      description="Footer text, links and legal links."
      table="footer_settings"
      fields={[
        {
          name: "logo_url",
          label: "Footer logo",
          type: "image",
          desktopSize: "256 x 256",
          mobileSize: "128 x 128",
        },
        { name: "description", label: "Footer text", type: "textarea", full: true },
        { name: "contact_info", label: "Contact info", type: "textarea", full: true },
        { name: "copyright_text", label: "Copyright text", full: true },
        {
          name: "footer_links",
          label: "Quick links (JSON)",
          type: "json",
          full: true,
          help: '[{"label":"Home","url":"/"}]',
        },
        { name: "legal_links", label: "Legal links (JSON)", type: "json", full: true },
        { name: "social_links", label: "Social links (JSON)", type: "json", full: true },
      ]}
    />
  ),
});
