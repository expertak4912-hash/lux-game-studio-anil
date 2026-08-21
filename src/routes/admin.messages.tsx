import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/messages")({
  component: () => (
    <ResourceManager
      title="Contact Messages"
      description="Messages submitted through the website contact form."
      table="contact_messages"
      singularName="message"
      reorder={false}
      order="created_at"
      ascending={false}
      listColumns={[
        { name: "name", label: "Name" },
        { name: "email", label: "Email" },
        { name: "message", label: "Message" },
      ]}
      fields={[
        { name: "name", label: "Name" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
        { name: "message", label: "Message", type: "textarea", full: true },
        { name: "is_read", label: "Marked as read", type: "switch" },
      ]}
    />
  ),
});
