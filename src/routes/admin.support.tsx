import { createFileRoute } from "@tanstack/react-router";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const Route = createFileRoute("/admin/support")({
  component: () => (
    <SettingsForm
      title="Support"
      description="Support channels shown across the website."
      table="support_settings"
      fields={[
        { name: "whatsapp_url", label: "WhatsApp URL" },
        { name: "email", label: "Support email" },
        { name: "phone", label: "Support phone" },
        { name: "telegram_url", label: "Telegram URL" },
        { name: "live_chat_url", label: "Live chat URL" },
        { name: "support_text", label: "Support message", type: "textarea", full: true },
      ]}
    />
  ),
});
