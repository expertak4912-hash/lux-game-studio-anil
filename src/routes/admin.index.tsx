import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Stat({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
    >
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Link>
  );
}

function Dashboard() {
  // One round trip for every count, rather than fetching six full collections just to
  // read their lengths.
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminStats(),
  });

  const count = (key: string) => stats?.[key] ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage every part of the public website from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Pages" value={count("pages")} to="/admin/pages" />
        <Stat label="Games" value={count("games")} to="/admin/games" />
        <Stat label="Sports" value={count("sports")} to="/admin/sports" />
        <Stat label="Blog posts" value={count("blog_posts")} to="/admin/blog" />
        <Stat label="Promotions" value={count("promotions")} to="/admin/promotions" />
        <Stat label="FAQ items" value={count("faq_items")} to="/admin/faq" />
        <Stat label="Media files" value={count("media")} to="/admin/media" />
        <Stat label="Messages" value={count("contact_messages")} to="/admin/messages" />
        <Stat label="Unread messages" value={count("unread_messages")} to="/admin/messages" />
      </div>
    </div>
  );
}
