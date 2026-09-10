import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Reveal } from "@/components/Reveal";
import { formatPostDate, postsQuery } from "@/lib/queries";

const TITLE = "Diário da casa — Instituto Cultural Tradição Makumba Brasil";
const DESCRIPTION =
  "Postagens, relatos e ensinamentos escritos por tata Rogério no diário do Instituto Cultural Tradição Makumba Brasil.";

export const Route = createFileRoute("/blog")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: BlogPage,
  errorComponent: () => (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <p className="text-muted-foreground">Não conseguimos carregar as postagens agora.</p>
    </main>
  ),
  notFoundComponent: () => (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <p className="text-muted-foreground">Postagem não encontrada.</p>
    </main>
  ),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

function BlogPage() {
  const { data: posts } = useSuspenseQuery(postsQuery);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60 px-5 pt-16 pb-14 text-center">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              Diário
            </p>
            <h1 className="mt-5 text-3xl leading-tight text-balance-tight sm:text-5xl">
              Palavra da casa
            </h1>
            <div className="mx-auto mt-8 w-40 gold-rule" />
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl space-y-4">
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhuma postagem publicada ainda.
            </p>
          )}
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={80 + i * 70}>
              <article className="overflow-hidden rounded-sm border border-border/70 bg-card/50 transition-colors hover:border-gold/70">
                {p.cover_url && (
                  <img
                    src={p.cover_url}
                    alt={p.title}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-6">
                  <p className="font-display text-xs tracking-[0.2em] text-gold uppercase">
                    {formatPostDate(p.published_at)}
                  </p>
                  <h2 className="mt-3 font-display text-xl">{p.title}</h2>
                  {p.excerpt && (
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {p.excerpt}
                    </p>
                  )}
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="mt-5 inline-block font-display text-xs tracking-widest text-gold uppercase underline decoration-gold/40 underline-offset-4"
                  >
                    Ler a postagem
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
