import { createFileRoute } from "@tanstack/react-router";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <SettingsForm
      title="Site Settings"
      description="Name, logo, contact details and social links."
      table="site_settings"
      fields={[
        { name: "site_name", label: "Website name" },
        { name: "tagline", label: "Tagline" },
        { name: "description", label: "Site description", type: "textarea", full: true },
        { name: "logo_url", label: "Logo", type: "image" },
        { name: "favicon_url", label: "Favicon", type: "image" },
        { name: "whatsapp_url", label: "WhatsApp URL" },
        { name: "email", label: "Contact email" },
        { name: "phone", label: "Contact phone" },
        { name: "copyright_text", label: "Copyright text", full: true },
        {
          name: "social_links",
          label: "Social links (JSON)",
          type: "json",
          full: true,
          help: '[{"label":"Instagram","url":"https://..."}]',
        },
      ]}
    />
  ),
});
