import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Reveal } from "@/components/Reveal";
import { formatPostDate } from "@/lib/queries";
import { getPublicPost } from "@/lib/site.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublicPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  component: PostPage,
  errorComponent: () => (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <p className="text-muted-foreground">Não conseguimos carregar esta postagem agora.</p>
    </main>
  ),
  notFoundComponent: () => (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <p className="text-muted-foreground">Postagem não encontrada.</p>
    </main>
  ),
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.title} — Instituto Cultural Tradição Makumba Brasil`
      : "Postagem — Instituto Cultural Tradição Makumba Brasil";
    const description =
      loaderData?.excerpt ?? "Postagem do Instituto Cultural Tradição Makumba Brasil.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function PostPage() {
  const post = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-2xl px-5 pt-16 pb-24">
        <Reveal>
          <Link
            to="/blog"
            className="font-display text-xs tracking-widest text-muted-foreground uppercase hover:text-gold"
          >
            ← Diário
          </Link>
          <p className="mt-8 font-display text-xs tracking-[0.25em] text-gold uppercase">
            {formatPostDate(post.published_at)}
          </p>
          <h1 className="mt-4 text-3xl leading-tight text-balance-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-6 w-24 gold-rule" />
        </Reveal>

        {post.cover_url && (
          <Reveal delay={100}>
            <img
              src={post.cover_url}
              alt={post.title}
              className="mt-8 w-full rounded-sm border border-gold/25 object-cover"
            />
          </Reveal>
        )}

        <Reveal delay={160}>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {post.content
              .split(/\n{2,}/)
              .filter((p) => p.trim())
              .map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
          </div>
        </Reveal>
      </article>
    </main>
  );
}
