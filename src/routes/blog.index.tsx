import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";
import { Button } from "@/components/ui/button";
import { useBlogCategories, useBlogPosts } from "@/lib/cms-content";
import { blogCategoriesQuery, blogPostsQuery } from "@/lib/cms-queries";

const title = "Blog — News, Guides & Updates | Strike Arena";
const description =
  "Match previews, platform guides and product updates from the Strike Arena team, organised by sport and category.";

export const Route = createFileRoute("/blog/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(blogPostsQuery()),
      context.queryClient.ensureQueryData(blogCategoriesQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function BlogIndex() {
  const posts = useBlogPosts();
  const categories = useBlogCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const shown = activeCategory
    ? posts.filter((post) => post.category_id === activeCategory)
    : posts;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="News, guides and updates"
        description="Previews, explainers and product notes from the team, grouped by category so you can jump straight to what you follow."
      />

      <section className="section-shell py-16 lg:py-24">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === null ? "gold" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "gold" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {shown.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">
            No posts published yet. Add one in Admin &rarr; Blog Posts and set its status to
            published.
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((post, i) => (
              <Reveal as="li" key={post.id} delay={i * 70} className="group">
                <article className="glass-card flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 group-hover:-translate-y-2">
                  {(post.featured_image || post.featured_image_mobile) && (
                    <div className="aspect-video overflow-hidden">
                      <ResponsiveImage
                        src={post.featured_image}
                        mobileSrc={post.featured_image_mobile}
                        alt={post.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    {post.publish_date && (
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {formatDate(post.publish_date)}
                      </p>
                    )}
                    <h2 className="font-display text-lg font-bold">
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className="transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="text-sm font-semibold text-accent transition-colors hover:text-primary"
                    >
                      Read more
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
