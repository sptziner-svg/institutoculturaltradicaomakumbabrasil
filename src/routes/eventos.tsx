import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { eventsQuery, formatEventDate } from "@/lib/queries";

const TITLE = "Próximos Eventos — Instituto Cultural Tradição Makumba Brasil";
const DESCRIPTION =
  "Giras, encontros e atividades do Instituto Cultural Tradição Makumba Brasil em Itanhaém/SP.";

export const Route = createFileRoute("/eventos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  component: EventosPage,
  errorComponent: () => (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <p className="text-muted-foreground">
        Não conseguimos carregar os eventos agora. Tente novamente em instantes.
      </p>
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
    links: [{ rel: "canonical", href: "/eventos" }],
  }),
});

export function formatEventDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventosPage() {
  const { data: eventos } = useSuspenseQuery(eventsQuery);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60 px-5 pt-16 pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              Agenda
            </p>
            <h1 className="mt-5 text-3xl leading-tight text-balance-tight sm:text-5xl">
              Próximos eventos
            </h1>
            <div className="mx-auto mt-8 w-40 gold-rule" />
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl space-y-4">
          {eventos.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhum evento marcado no momento. Fale com a casa pelo WhatsApp para saber das
              próximas datas.
            </p>
          )}
          {eventos.map((e, i) => (
            <Reveal key={e.id} delay={80 + i * 80}>
              <article className="rounded-sm border border-border/70 bg-card/50 p-6 transition-colors hover:border-gold/70">
                <p className="font-display text-xs tracking-[0.2em] text-gold uppercase">
                  {formatEventDate(e.starts_at)}
                </p>
                <h2 className="mt-3 font-display text-xl text-foreground">{e.title}</h2>
                {e.location && (
                  <p className="mt-1 text-sm text-muted-foreground">{e.location}</p>
                )}
                {e.description && (
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {e.description}
                  </p>
                )}
              </article>
            </Reveal>
          ))}

          <div className="pt-8 text-center">
            <WhatsAppButton>Tirar dúvidas sobre os eventos</WhatsAppButton>
          </div>
        </div>
      </section>
    </main>
  );
}
