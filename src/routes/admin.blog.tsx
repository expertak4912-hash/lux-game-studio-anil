import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { useAdminRows } from "@/lib/admin-db";

export const Route = createFileRoute("/admin/blog")({ component: BlogAdmin });

function BlogAdmin() {
  const { data: categories = [] } = useAdminRows("blog_categories");
  return (
    <ResourceManager
      title="Blog Posts"
      description="Posts appear at /blog/slug once published."
      table="blog_posts"
      singularName="post"
      slugFrom="title"
      order="publish_date"
      ascending={false}
      reorder={false}
      listColumns={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
      ]}
      defaults={{ status: "draft" }}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "author", label: "Author" },
        { name: "publish_date", label: "Publish date", type: "date" },
        {
          name: "category_id",
          label: "Category",
          type: "select",
          options: categories.map((c) => ({
            label: String(c["name"]),
            value: String(c["id"]),
          })),
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Published", value: "published" },
            { label: "Draft", value: "draft" },
          ],
        },
        { name: "tags", label: "Tags", type: "tags", full: true },
        { name: "featured_image", label: "Featured image", type: "image" },
        { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
        { name: "content", label: "Content", type: "richtext" },
        { name: "seo_title", label: "SEO title" },
        { name: "seo_description", label: "Meta description", type: "textarea" },
      ]}
    />
  );
}
