import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CmsContent } from "@/components/site/CmsContent";
import { Reveal } from "@/components/site/Reveal";
import { postBySlugQuery } from "@/lib/cms-queries";
import { recordPostView } from "@/lib/cms.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postBySlugQuery(params.slug));
    // A draft or unknown slug must 404 rather than render an empty shell.
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};

    const title = post.seo_title || `${post.title} | Strike Arena`;
    const description = post.seo_description || post.excerpt || "";
    const image = post.seo_image || post.featured_image;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${post.slug}` },
        ...(image ? [{ property: "og:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: `/blog/${post.slug}` }],
    };
  },
  component: BlogPostPage,
});

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  // Fire-and-forget view counter. A failure here must never break the page.
  useEffect(() => {
    void recordPostView({ data: { id: post.id } }).catch(() => undefined);
  }, [post.id]);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={post.title}
        {...(post.excerpt ? { description: post.excerpt } : {})}
        {...(post.featured_image ? { image: post.featured_image } : {})}
      />

      <section className="section-shell py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            All posts
          </Link>

          <Reveal>
            <article className="glass-card mt-6 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {post.publish_date && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    {formatDate(post.publish_date)}
                  </span>
                )}
                {post.author && (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="size-3.5" />
                    {post.author}
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{post.title}</h1>

              {post.content ? (
                <CmsContent
                  html={post.content}
                  className="mt-6 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-5 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_strong]:text-foreground [&_ul]:mt-3"
                />
              ) : (
                post.excerpt && (
                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )
              )}

              {post.tags.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
